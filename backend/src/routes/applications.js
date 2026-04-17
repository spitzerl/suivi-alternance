const express = require("express");
const applicationController = require("../controllers/applicationController");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

router.get("/", authenticate, applicationController.getAll);
router.post("/", authenticate, applicationController.create);
router.patch("/:id", authenticate, applicationController.update);

module.exports = router;
