const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
require("dotenv").config(); // Fallback to local .env if exists
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const routes = require("./src/routes");

const app = express();

// Security middlewares
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// Health check
app.get("/api/", (req, res) => {
  res.json({ message: "API is running" });
});

// Routes
app.use("/api", routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
