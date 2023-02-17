const uuid = require("uuid")
const likeModel = require("../models/likeModel")
const commonHelper = require("../helper/common")

const likeController = {
  getAllLike: async (req, res) => {
    try {
      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || 10000
      const offset = (page - 1) * limit
      const sort = req.query.sort || "ASC"
      const result = await likeModel.getAllLike(limit, offset, sort)
      if (result.length === 0) {
        return res.json({
          message: "Data not found",
        })
      }
      const {
        rows: [count],
      } = await likeModel.countData()
      const totalData = parseInt(count.count)
      const totalPage = Math.ceil(totalData / limit)
      const pagination = {
        currentPage: page,
        limit,
        totalData,
        totalPage,
      }
      commonHelper.response(res, result, 200, "Get all like data success", pagination)
    } catch (error) {
      console.log(error)
      return commonHelper.response(res, [], 500, "Error retrieving liked data")
    }
  },

  getLikeById: async (req, res) => {
    const id = req.params.id
    const { rowCount } = await likeModel.getLikeById(id)
    if (!rowCount) {
      return res.json({
        Message: "Like not found",
      })
    }
    likeModel
      .getLikeById(id)
      .then((result) => {
        commonHelper.response(res, result.rows[0], 200, "Get data liked by id success")
      })
      .catch((err) => res.send(err))
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
