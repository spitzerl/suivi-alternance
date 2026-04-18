const express = require("express");
const relaunchController = require("../controllers/relaunchController");
const authenticate = require("../middleware/authenticate");

const router = express.Router({ mergeParams: true });

router.post("/", authenticate, relaunchController.create);
router.patch("/:id", authenticate, relaunchController.update);
router.delete("/:id", authenticate, relaunchController.remove);

module.exports = router;
