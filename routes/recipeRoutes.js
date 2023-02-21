const express = require("express")
const router = express.Router()
const recipeController = require("../controllers/recipeController")
// const { validateCreateRecipe, validateUpdateRecipe } = require('../middleware/validateRecipe')
const { verifyToken } = require("../middleware/auth")
const upload = require("../middleware/validateUpload")

router.get("/", recipeController.getAllRecipe)
router.get("/myrecipe", verifyToken, recipeController.getMyRecipe)
router.get("/:id", recipeController.getDetailRecipe)
router.post("/", verifyToken, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]), recipeController.createRecipe);
router.put("/:id", verifyToken, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]), recipeController.updateRecipe)
router.delete("/:id", verifyToken, recipeController.deleteRecipe)

module.exports = router
