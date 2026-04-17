const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Accès refusé" });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "1234567890");
    req.userId = payload.userId;
    next();
  } catch (e) {
    res.status(401).json({ error: "Session expirée" });
  }
};

module.exports = authenticate;
