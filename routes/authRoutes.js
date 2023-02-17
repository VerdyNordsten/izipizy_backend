const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")
const { verifyToken } = require("../middleware/auth")
const { validateRegister, validateLogin } = require("../middleware/validateUser")

router.post("/register", validateRegister, userController.registerUser)
router.post("/login", validateLogin, userController.loginUser)
router.post("/refresh-token", userController.refreshToken)
router.get("/profile", verifyToken, userController.profileUser)

module.exports = router
