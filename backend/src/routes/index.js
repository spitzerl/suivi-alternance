const express = require("express");
const authRoutes = require("./auth");
const applicationRoutes = require("./applications");
const relaunchRoutes = require("./relaunches");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/applications", applicationRoutes);
router.use("/applications/:applicationId/relaunches", relaunchRoutes);

module.exports = router;
