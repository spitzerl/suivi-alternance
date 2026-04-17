const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");

const JWT_SECRET = process.env.JWT_SECRET || "1234567890";

// Inscription
exports.register = async (req, res) => {
  const { name, lastname, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.user.create({
      data: { name, lastname, email, password: hashedPassword },
    });
    res.status(201).json({ message: "Utilisateur créé" });
  } catch (e) {
    console.error("Erreur complète:", e);
    console.error("Code:", e.code);
    console.error("Message:", e.message);
    res.status(400).json({ error: e.message }); // Affiche le message réel
  }
};

// Connexion
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Identifiants invalides" });
  }
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "24h" });
  res.json({ token, email: user.email });
};

// Modification du mot de passe
exports.editPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.userId;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({
      error: "Ancien et nouveau mot de passe requis",
    });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({
      error: "Le nouveau mot de passe doit contenir au moins 8 caractères",
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: "Ancien mot de passe incorrect",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    res.json({ message: "Mot de passe modifié avec succès" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Erreur lors de la modification du mot de passe",
    });
  }
};

// Suppression compte
exports.deleteAccount = async (req, res) => {
  const { password } = req.body;
  const userId = req.userId;

  if (!password) {
    return res.status(400).json({
      error: "Le mot de passe est requis",
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: "Mot de passe incorrect",
      });
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    res.json({ message: "Compte supprimé définitivement" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Erreur lors de la suppression du compte",
    });
  }
};
