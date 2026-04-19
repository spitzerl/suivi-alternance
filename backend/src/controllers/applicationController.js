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

// Supprimer une candidature
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.application.delete({
      where: {
        id: parseInt(id),
        userId: req.userId, // Sécurité : on ne peut supprimer que ses propres candidatures
      },
    });
    res.json({ message: "Candidature supprimée avec succès" });
  } catch (error) {
    console.error("Delete application error:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la suppression de la candidature." });
  }
};

// Import en masse (JSON)
exports.bulkCreate = async (req, res) => {
  const applications = req.body;

  if (!Array.isArray(applications)) {
    return res
      .status(400)
      .json({ error: "L'import doit être un tableau d'applications." });
  }

  try {
    const results = await prisma.$transaction(async (tx) => {
      const createdApps = [];
      for (const app of applications) {
        const { relaunches, id, userId, createdAt, updatedAt, ...appData } =
          app;

        const created = await tx.application.create({
          data: {
            ...appData,
            userId: req.userId,
            relaunches:
              relaunches && Array.isArray(relaunches) && relaunches.length > 0
                ? {
                    create: relaunches.map(
                      ({ id, applicationId, createdAt, updatedAt, ...rData }) =>
                        rData,
                    ),
                  }
                : undefined,
          },
        });
        createdApps.push(created);
      }
      return createdApps;
    });

    res.json({
      message: `${results.length} candidatures importées avec succès.`,
      count: results.length,
    });
  } catch (error) {
    console.error("Bulk import error:", error);
    res.status(500).json({ error: "Erreur lors de l'importation." });
  }
};
