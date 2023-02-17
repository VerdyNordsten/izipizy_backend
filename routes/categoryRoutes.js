const express = require("express")
const router = express.Router()
const categoryController = require("../controllers/categoryController")
const { validateCategory } = require('../middleware/validateCategory')

router.get("/", categoryController.getAllCategory)
router.get("/:id", categoryController.getDetailCategory)
router.post("/", validateCategory, categoryController.createCategory)
router.put("/:id", validateCategory, categoryController.updateCategory)
router.delete("/:id", categoryController.deleteCategory)

module.exports = router
