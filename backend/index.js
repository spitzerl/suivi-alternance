const express = require("express");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const prisma = new PrismaClient();
const app = express();
const JWT_SECRET = process.env.JWT_SECRET || "1234567890";

app.use(cors());
app.use(express.json());

// --- MIDDLEWARE D'AUTH ---
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Accès refusé" });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.userId;
    next();
  } catch (e) {
    res.status(401).json({ error: "Session expirée" });
  }
};

// --- ROUTES AUTH ---
// Inscription
app.post("/api/auth/register", async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.user.create({
      data: { email, password: hashedPassword },
    });
    res.status(201).json({ message: "Utilisateur créé" });
  } catch (e) {
    res.status(400).json({ error: "Cet email est déjà utilisé" });
  }
});

// Connexion
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Identifiants invalides" });
  }
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "24h" });
  res.json({ token, email: user.email });
});

// --- ROUTES APPLICATIONS ---
// Tout charger
app.get("/api/applications", authenticate, async (req, res) => {
  const apps = await prisma.application.findMany({
    where: { userId: req.userId },
    orderBy: { dateContact: "desc" },
  });
  res.json(apps);
});

// Ajouter
app.post("/api/applications", authenticate, async (req, res) => {
  const { company, status, jobTitle, notes } = req.body;
  const app = await prisma.application.create({
    data: { company, status, jobTitle, notes, userId: req.userId },
  });
  res.json(app);
});

// Modifier
app.patch("/api/applications/:id", authenticate, async (req, res) => {
  const { status, notes } = req.body;
  const updated = await prisma.application.update({
    where: { id: parseInt(req.params.id) },
    data: { status, notes },
  });
  res.json(updated);
});

app.listen(5000, () => console.log("Server running on port 5000"));
