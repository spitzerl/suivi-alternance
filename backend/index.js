require("dotenv").config();
const express = require("express");
const cors = require("cors");
const routes = require("./src/routes");

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get("/api/", (req, res) => {
  res.json({ message: "API is running" });
});

// Routes
app.use("/api", routes);

app.listen(5000, () => console.log("Server running on port 5000"));
