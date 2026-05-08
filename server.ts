import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));

  // API Routes
  app.post("/api/deposit/analyze", async (req, res) => {
    // In a real production app, this would call specialized CV models.
    // For this demonstration, we'll return a simulation or prompt the frontend to use Gemini.
    const { frontImage, backImage } = req.body;
    
    if (!frontImage || !backImage) {
      return res.status(400).json({ error: "Both front and back images are required." });
    }

    // Mock processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    res.json({
      status: "success",
      message: "Check images received and queued for processing.",
      correlationId: `check-${Date.now()}`
    });
  });

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", version: "1.0.0-PROD" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CheckStudio Backend (Full-Stack) running on http://localhost:${PORT}`);
  });
}

startServer();
