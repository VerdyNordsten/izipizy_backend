const express = require("express")
const router = express.Router()
const likeController = require("../controllers/likeController")
const { verifyToken } = require('../middleware/auth')
// const { validateSave } = require('../middleware/validateSave')


router.get("/", verifyToken, likeController.getLikesByUser)
router.get("/recipe/:id", likeController.getLikesByRecipe)
router.get("/:id", likeController.getLikeById)
router.post("/", verifyToken, likeController.createLike)
router.delete("/:id", verifyToken, likeController.deleteLike)

module.exports = router
