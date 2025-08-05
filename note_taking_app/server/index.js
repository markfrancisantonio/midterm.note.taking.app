// Backend entry point: sets up Express server with routes, DB connection, and authentication
import express from "express";
import dotenv from "dotenv";
import session from "express-session";
import passport from "passport";

import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "./config/db.js";
import configurePassport from "./config/passport.js";
import { router as noteRoutes } from "./routes/noteRoutes.js";
import { router as userRoutes } from "./routes/userRoutes.js";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// I wanted to get the folder path of this file for serving static files,
// but in ES modules, __dirname is not available by default.
// So, I asked ChatGPT how to get these variables using 'fileURLToPath' and 'path.dirname'.
// This was tricky because it’s different from old CommonJS way.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files (frontend) from the public folder
app.use(express.static(path.join(__dirname, "..", "public")));

// Middleware to parse JSON request bodies
app.use(express.json());

// Setup session middleware for user login sessions
app.use(
  session({
    secret: "yourSecretKey",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

// Initialize and configure Passport for authentication
app.use(passport.initialize());
app.use(passport.session());
configurePassport(passport);

app.use("/api/notes", noteRoutes);
app.use("/api/users", userRoutes);

//listen on port 3000
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
