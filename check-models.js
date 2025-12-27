import { GoogleGenerativeAI } from "@google/generative-ai";

const GOOGLE_API_KEY = "AIzaSyDOnEdn5Y4PIALaHGeGjAKMnkNzsc7gQJs";
const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);

async function listModels() {
  try {
    console.log("Fetching available models...\n");
    
    // Try to list models
    const models = await genAI.listModels();
    
    console.log("Available models:");
    console.log("=================\n");
    
    for await (const model of models) {
      console.log(`Model: ${model.name}`);
      console.log(`Display Name: ${model.displayName}`);
      console.log(`Supported Methods: ${model.supportedGenerationMethods?.join(", ")}`);
      console.log("---");
    }
  } catch (error) {
    console.error("Error listing models:", error.message);
    
    // Try common model names
    console.log("\nTrying common model names...\n");
    const commonModels = [
      "gemini-pro",
      "gemini-1.5-pro",
      "gemini-1.5-flash",
      "models/gemini-pro",
      "models/gemini-1.5-pro",
      "models/gemini-1.5-flash"
    ];
    
    for (const modelName of commonModels) {
      try {
        console.log(`Testing: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Hello");
        console.log(`✅ ${modelName} - WORKS!`);
        console.log(`Response: ${result.response.text()}\n`);
      } catch (err) {
        console.log(`❌ ${modelName} - Failed: ${err.message}\n`);
      }
    }
  }
}

listModels();
