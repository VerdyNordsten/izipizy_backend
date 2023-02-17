const express = require('express')
const router = express.Router()
const recipeController = require('../controllers/recipeController')
// const { validateCreateRecipe, validateUpdateRecipe } = require('../middleware/validateRecipe')
const { verifyToken } = require('../middleware/auth')
const upload = require('../middleware/validateUpload')

router.get('/', recipeController.getAllRecipe)
router.get('/:id', recipeController.getDetailRecipe)
router.post('/', verifyToken, upload.single('image'), recipeController.createRecipe)
router.put('/:id', verifyToken, upload.single('image'), recipeController.updateRecipe)
router.delete('/:id', verifyToken, recipeController.deleteRecipe)

module.exports = router
