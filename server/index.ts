import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { connectToDatabase } from "./db/connection";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// API request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    // Register API routes first
    const server = await registerRoutes(app);
    
    // Attempt to connect to MongoDB with improved error handling
    // We don't await this to avoid blocking server startup, but use log messages to track progress
    connectToDatabase(3, 5000)
      .then(connected => {
        if (connected) {
          log('MongoDB connected and ready to use', 'database');
        } else {
          // We'll retry connection later
          log('Initial MongoDB connection attempt unsuccessful, will retry automatically', 'database');
          
          // Set up a reconnection attempt in the background
          setTimeout(() => {
            log('Attempting MongoDB reconnection...', 'database');
            connectToDatabase(3, 5000)
              .then(reconnected => {
                if (reconnected) {
                  log('MongoDB reconnected successfully', 'database');
                } else {
                  log('MongoDB reconnection failed', 'database');
                }
              })
              .catch(reconnectError => {
                log(`MongoDB reconnection error: ${reconnectError}`, 'database');
              });
          }, 30000); // Wait 30 seconds before retry
        }
      })
      .catch(dbError => {
        log(`MongoDB connection error: ${dbError}`, 'database');
      });

    // Error handling middleware
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      log(`Error: ${status} - ${message}`, 'error');
      res.status(status).json({ message });
    });

    // Setup Vite or serve static files
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    // Start server
    const port = 5000;
    server.listen({
      port,
      host: "0.0.0.0",
      reusePort: true,
    }, () => {
      log(`Server running on port ${port}`);
    });
  } catch (error) {
    log(`Failed to start server: ${error}`, 'error');
    process.exit(1);
  }
})();
