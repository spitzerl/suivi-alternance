const prisma = require("../config/prisma");

// Charger toutes les candidatures
exports.getAll = async (req, res) => {
  const apps = await prisma.application.findMany({
    where: { userId: req.userId },
    orderBy: { dateContact: "desc" },
  });
  res.json(apps);
};

// Ajouter une candidature
exports.create = async (req, res) => {
  const { company, status, jobTitle, notes } = req.body;
  const app = await prisma.application.create({
    data: { company, status, jobTitle, notes, userId: req.userId },
  });
  res.json(app);
};

// Modifier une candidature
exports.update = async (req, res) => {
  const { status, notes } = req.body;
  const updated = await prisma.application.update({
    where: { id: parseInt(req.params.id) },
    data: { status, notes },
  });
  res.json(updated);
};
