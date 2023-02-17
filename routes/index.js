const express = require("express")
const router = express.Router()
// const categoryRouter = require("./categoryRoutes")
const userRouter = require("./authRoutes")
const recipeRouter = require("./recipeRoutes")
const commentRouter = require("./commentRoutes")
const saveRouter = require("./saveRoutes")
const likeRouter = require("./likeRoutes")

// router.use("/category", categoryRouter)
router.use("/user", userRouter)
router.use("/recipe", recipeRouter)
router.use("/comment", commentRouter)
router.use("/saved", saveRouter)
router.use("/liked", likeRouter)

module.exports = router
