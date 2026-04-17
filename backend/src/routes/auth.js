const express = require("express");
const authController = require("../controllers/authController");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.patch("/edit-password", authenticate, authController.editPassword);
router.delete("/delete-account", authenticate, authController.deleteAccount);

module.exports = router;
