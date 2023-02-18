const express = require("express")
const router = express.Router()
const saveController = require("../controllers/saveController")
const { verifyToken } = require('../middleware/auth')
// const { validateSave } = require('../middleware/validateSave')


router.get("/", verifyToken, saveController.getSavesByUser)
router.get("/recipe/:id", saveController.getSavesByRecipe)
router.get("/:id", saveController.getSaveById)
router.post("/", verifyToken, saveController.createSave)
router.delete("/:id", verifyToken, saveController.deleteSave)

module.exports = router
