const prisma = require("../config/prisma");

// Vérifier que l'application appartient à l'utilisateur
async function verifyOwnership(applicationId, userId) {
  const app = await prisma.application.findFirst({
    where: { id: applicationId, userId },
  });
  return !!app;
}

// Créer une relance
exports.create = async (req, res) => {
  const applicationId = parseInt(req.params.applicationId);
  const { date, method, notes, response } = req.body;

  const isOwner = await verifyOwnership(applicationId, req.userId);
  if (!isOwner) return res.status(403).json({ error: "Accès refusé" });

  const relaunch = await prisma.relaunch.create({
    data: {
      applicationId,
      date: date ? new Date(date) : new Date(),
      method: method || null,
      notes: notes || null,
      response: response != null ? response : null,
    },
  });
  res.json(relaunch);
};

// Modifier une relance
exports.update = async (req, res) => {
  const applicationId = parseInt(req.params.applicationId);
  const relaunchId = parseInt(req.params.id);
  const { date, method, notes, response } = req.body;

  const isOwner = await verifyOwnership(applicationId, req.userId);
  if (!isOwner) return res.status(403).json({ error: "Accès refusé" });

  const relaunch = await prisma.relaunch.update({
    where: { id: relaunchId },
    data: {
      date: date ? new Date(date) : undefined,
      method: method !== undefined ? method : undefined,
      notes: notes !== undefined ? notes : undefined,
      response: response !== undefined ? response : undefined,
    },
  });
  res.json(relaunch);
};

// Supprimer une relance
exports.remove = async (req, res) => {
  const applicationId = parseInt(req.params.applicationId);
  const relaunchId = parseInt(req.params.id);

  const isOwner = await verifyOwnership(applicationId, req.userId);
  if (!isOwner) return res.status(403).json({ error: "Accès refusé" });

  await prisma.relaunch.delete({ where: { id: relaunchId } });
  res.json({ success: true });
};
