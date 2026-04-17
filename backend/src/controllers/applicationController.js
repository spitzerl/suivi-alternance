const prisma = require("../config/prisma");

// Charger toutes les candidatures
exports.getAll = async (req, res) => {
  const apps = await prisma.application.findMany({
    where: { userId: req.userId },
    orderBy: { dateApplication: "desc" },
    include: { relaunches: true },
  });
  res.json(apps);
};

// Ajouter une candidature
exports.create = async (req, res) => {
  const {
    companyName,
    status,
    jobTitle,
    notes,
    dateApplication,
    priority,
    applicationUrl,
    salary,
    location,
    source,
  } = req.body;

  const app = await prisma.application.create({
    data: {
      companyName,
      status,
      jobTitle,
      notes,
      dateApplication,
      priority,
      applicationUrl,
      salary,
      location,
      source,
      userId: req.userId,
    },
  });
  res.json(app);
};

// Modifier une candidature
exports.update = async (req, res) => {
  const {
    status,
    notes,
    companyName,
    jobTitle,
    priority,
    applicationUrl,
    salary,
    location,
    source,
    dateApplication,
  } = req.body;

  const updated = await prisma.application.update({
    where: { id: parseInt(req.params.id) },
    data: {
      status,
      notes,
      companyName,
      jobTitle,
      priority,
      applicationUrl,
      salary,
      location,
      source,
      dateApplication,
    },
    include: { relaunches: true },
  });
  res.json(updated);
};
