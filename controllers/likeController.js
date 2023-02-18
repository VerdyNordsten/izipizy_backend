const uuid = require("uuid")
const likeModel = require("../models/likeModel")
const commonHelper = require("../helper/common")

const likeController = {
  getLikesByUser: async (req, res) => {
    try {
      // Extract the user ID from the decoded token
      const userId = req.payload.id

      const sortBy = req.query.sortBy || "desc" // default to descending
      const result = await likeModel.getLikesByUser(userId, sortBy)
      if (!result) {
        return res.json({
          Message: "Likes not found",
        })
      }
      const responseData = result.map((like) => {
        return {
          id: like.id,
          user_id: like.user_id,
          recipe_id: like.recipe_id,
          name_recipe: like.name_recipe,
          image: like.image,
        }
      })
      commonHelper.response(res, responseData, 200, "Get data liked by user success")
    } catch (err) {
      res.json({ message: err.message })
    }
  },

  getLikeById: async (req, res) => {
    const id = req.params.id
    const result = await likeModel.getLikeById(id)
    if (!result) {
      return res.json({
        Message: "Like not found",
      })
    }
    const responseData = {
      id: result.id,
      user_id: result.user_id,
      recipe_id: result.recipe_id,
      name_recipe: result.name_recipe,
      image: result.image,
    }
    commonHelper.response(res, responseData, 200, "Get data liked by id success")
  },

  getLikesByRecipe: async (req, res) => {
    const recipeId = req.params.id
    try {
      const result = await likeModel.getLikesByRecipe(recipeId)
      return commonHelper.response(res, result, 200, "Get data liked by recipe success")
    } catch (err) {
      console.error(err)
      return commonHelper.response(res, 500, "Error retrieving liked data")
    }
  },

  createLike: async (req, res) => {
    try {
      const { recipe_id } = req.body
      const id = uuid.v4()

      // Extract the user ID from the decoded token
      const userId = req.payload.id

      // Check if a Like already exists for the given recipe and user
      const existingLike = await likeModel.getLikeByUserAndRecipe(userId, recipe_id)
      if (existingLike) {
        return commonHelper.response(res, null, 400, "You have already liked on this recipe")
      }

      const data = {
        id,
        user_id: userId,
        recipe_id,
      }
      const result = await likeModel.insertLike(data)
      commonHelper.response(res, result.rows, 201, "The recipe has been liked")
    } catch (err) {
      res.json({ message: err.message })
    }
  },

  deleteLike: async (req, res) => {
    try {
      const id = req.params.id
      const { rowCount, rows } = await likeModel.getLikeById(id)
      if (!rowCount) {
        return commonHelper.response(res, null, 404, "Like not found")
      }

      // Extract the user ID from the decoded token
      const userId = req.payload.id

      // Check if the user ID of the decoded token matches the user ID of the Like
      if (rows[0].user_id !== userId) {
        return commonHelper.response(res, null, 401, "You are not authorized to delete this Like")
      }

      likeModel
        .deleteLike(id)
        .then((result) => {
          commonHelper.response(res, result.rows, 200, "Like has been deleted")
        })
        .catch((err) => res.send(err))
    } catch (err) {
      console.log(err)
    }
  },
}

module.exports = likeController
