const express = require("express");
const authRoutes = require("./auth");
const applicationRoutes = require("./applications");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/applications", applicationRoutes);

module.exports = router;
