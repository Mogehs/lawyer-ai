import type { Express, Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import session from "express-session";
import { storage } from "./storage";
import { registerSchema, loginSchema, type User } from "@shared/schema";
import connectPgSimple from "connect-pg-simple";
import { pool } from "./db";

function getClientInfo(req: Request) {
  const ipAddress = req.ip || req.headers["x-forwarded-for"]?.toString() || req.socket.remoteAddress || null;
  const userAgent = req.headers["user-agent"] || null;
  return { ipAddress, userAgent };
}

async function logAudit(
  userId: string,
  userEmail: string,
  action: string,
  req: Request,
  details?: Record<string, any>
) {
  try {
    const { ipAddress, userAgent } = getClientInfo(req);
    await storage.createAuditLog({
      userId,
      userEmail,
      action,
      details: details || null,
      ipAddress,
      userAgent,
    });
  } catch (error) {
    console.error("Failed to create audit log:", error);
  }
}

export { logAudit };

declare module "express-session" {
  interface SessionData {
    userId?: string;
  }
}

export interface AuthenticatedRequest extends Request {
  user?: Omit<User, "passwordHash">;
}

const SALT_ROUNDS = 12;

export async function setupAuth(app: Express) {
  const PgSession = connectPgSimple(session);

  const isProduction = process.env.NODE_ENV === "production";
  const isCrossOrigin = !!process.env.CORS_ORIGIN;

  app.set("trust proxy", 1);

  app.use(
    session({
      store: new PgSession({
        pool,
        tableName: "sessions",
        createTableIfMissing: false,
      }),
      secret: process.env.SESSION_SECRET || "fallback-secret-for-development",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: isProduction,
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: isCrossOrigin ? "none" : "lax",
      },
    })
  );
}

export function registerAuthRoutes(app: Express) {
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const parseResult = registerSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({
          error: "Invalid input",
          details: parseResult.error.errors,
        });
      }

      const { email, password, firstName, lastName } = parseResult.data;

      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({ error: "Email already registered" });
      }

      const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

      const user = await storage.createUser({
        email: email.toLowerCase(),
        passwordHash,
        firstName: firstName || null,
        lastName: lastName || null,
      });

      req.session.userId = user.id;

      await logAudit(user.id, user.email, "register", req, { firstName, lastName });

      const { passwordHash: _, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const parseResult = loginSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({
          error: "Invalid input",
          details: parseResult.error.errors,
        });
      }

      const { email, password } = parseResult.data;

      const user = await storage.getUserByEmail(email);
      if (!user || !user.passwordHash) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const isValid = await bcrypt.compare(password, user.passwordHash);
      if (!isValid) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      req.session.userId = user.id;

      await logAudit(user.id, user.email, "login", req);

      const { passwordHash: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/auth/logout", async (req: Request, res: Response) => {
    const userId = req.session.userId;
    if (userId) {
      const user = await storage.getUserById(userId);
      if (user) {
        await logAudit(user.id, user.email, "logout", req);
      }
    }
    req.session.destroy((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ error: "Logout failed" });
      }
      res.clearCookie("connect.sid");
      res.json({ success: true });
    });
  });

  app.get("/api/auth/user", async (req: Request, res: Response) => {
    try {
      if (!req.session.userId) {
        res.status(401).json({ error: "Not authenticated" });
        return;
      }

      const user = await storage.getUserById(req.session.userId);
      if (!user) {
        req.session.destroy(() => {});
        res.status(401).json({ error: "User not found" });
        return;
      }

      const { passwordHash: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ error: "Failed to get user" });
    }
  });
}

export function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (!req.session.userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  next();
}

export function isAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authReq = req as AuthenticatedRequest;
  if (!authReq.user || authReq.user.role !== "admin") {
    res.status(403).json({ message: "Admin access required" });
    return;
  }
  next();
}

export async function attachUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authReq = req as AuthenticatedRequest;
  if (req.session.userId) {
    const user = await storage.getUserById(req.session.userId);
    if (user) {
      const { passwordHash: _, ...userWithoutPassword } = user;
      authReq.user = userWithoutPassword;
    }
  }
  next();
}
