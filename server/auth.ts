import type { Express, Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import session from "express-session";
import { storage } from "./storage";
import { registerSchema, loginSchema, type User } from "@shared/schema";
import connectPgSimple from "connect-pg-simple";
import { pool } from "./db";

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

      const { passwordHash: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/auth/logout", (req: Request, res: Response) => {
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
