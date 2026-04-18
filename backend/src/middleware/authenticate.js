const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Accès refusé" });

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("JWT_SECRET is missing in environment variables");
    return res.status(500).json({ error: "Erreur de configuration serveur" });
  }

  try {
    const payload = jwt.verify(token, secret);
    req.userId = payload.userId;
    next();
  } catch (e) {
    res.status(401).json({ error: "Session expirée" });
  }
};

module.exports = authenticate;
