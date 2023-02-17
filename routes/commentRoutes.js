const express = require("express")
const router = express.Router()
const commentController = require("../controllers/commentController")
const { verifyToken } = require('../middleware/auth')
// const { validateComment } = require('../middleware/validateComment')

router.get("/recipe/:id", commentController.getCommentsByRecipe)
router.get("/:id", commentController.getCommentById)
router.post("/", verifyToken, commentController.createComment)
router.put("/:id", verifyToken, commentController.updateComment)
router.delete("/:id", verifyToken, commentController.deleteComment)

module.exports = router
