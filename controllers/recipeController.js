/* eslint-disable camelcase */
/* eslint-disable no-undef */
// const userModel = require("../models/userModel")
const recipeModel = require("../models/recipeModel")
const commonHelper = require("../helper/common")
const uuid = require("uuid")
var cloudinary = require("../config/cloudinary")
const moment = require("moment")

const recipeController = {
  getAllRecipe: async (req, res) => {
    try {
      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || 5
      const offset = (page - 1) * limit
      const sortBY = req.query.sortBY || "created_at"
      const sort = req.query.sort || "desc"
      const searchParam = req.query.search ? req.query.search.toLowerCase() : ""
      const result = await recipeModel.selectAllRecipe(limit, offset, searchParam, sortBY, sort)
      if (result.rowCount === 0) {
        return res.json({
          message: "Data not found",
        })
      }
      const {
        rows: [count],
      } = await recipeModel.countData()
      const totalData = parseInt(count.count)
      const totalPage = Math.ceil(totalData / limit)
      const pagination = {
        currentPage: page,
        limit,
        totalData,
        totalPage,
      }
      commonHelper.response(
        res,
        result.rows.map((data) => {
          return {
            ...data,
            created_at: moment(data.created_at).format("DD MMMM YYYY HH:mm"),
          }
        }),
        200,
        "Get data success",
        pagination
      )
    } catch (err) {
      res.json({ message: err.message })
    }
  },

  getDetailRecipe: async (req, res) => {
    try {
      const id = req.params.id
      const { rowCount } = await recipeModel.findId(id)
      if (!rowCount) {
        return res.json({
          Message: "Data not found",
        })
      }

      const recipe = await recipeModel.selectRecipe(id)
      const saved = await recipeModel.getSavedCountByRecipeId(id)
      const liked = await recipeModel.getLikedCountByRecipeId(id)

      const data = {
        ...recipe.rows[0],
        created_at: moment(recipe.rows[0].created_at).format("DD MMMM YYYY HH:mm"),
        saved_count: saved.count,
        liked_count: liked.count,
      }

      commonHelper.response(res, data, 200, "Get data success")
    } catch (err) {
      res.json({ message: err.message })
    }
  },

  createRecipe: async (req, res) => {
    const { name_recipe, description, ingredients, video } = req.body
    const id = uuid.v4()

    const imageUrl = await cloudinary.uploader.upload(req.file.path, { folder: "izipizy" })

    // Extract the user ID from the decoded token
    const userId = req.payload.id

    const data = {
      id,
      name_recipe,
      description,
      ingredients,
      video,
      image: imageUrl.secure_url,
      user_id: userId,
    }

    recipeModel
      .insertRecipe(data)
      .then((result) => {
        commonHelper.response(res, result.rows, 201, "Recipe has been created")
      })
      .catch((err) => res.send(err))
  },

  updateRecipe: async (req, res) => {
    try {
      const id = req.params.id
      const { name_recipe, description, ingredients, video } = req.body
      // Check if the recipe exists and if the user who created it is the same as the authenticated user
      const { rows } = await recipeModel.findId(id)
      if (rows.length === 0) {
        return res.json({
          message: "Recipe not found",
        })
      }

      // Extract the user ID from the decoded token
      const userId = req.payload.id

      // Check if the user ID of the decoded token matches the user ID of the recipe
      if (rows[0].user_id !== userId) {
        return commonHelper.response(res, null, 401, "You are not authorized to edit this recipe")
      }

      let data = {}
      let updateQuery = ""
      let message = "Recipe updated sucessfull"
      if (name_recipe) {
        data.name_recipe = name_recipe
        updateQuery += `name_recipe=$${Object.keys(data).length}`
      }
      if (description) {
        data.description = description
        updateQuery += `${updateQuery ? ", " : ""}description=$${Object.keys(data).length}`
      }
      if (ingredients) {
        data.ingredients = ingredients
        updateQuery += `${updateQuery ? ", " : ""}ingredients=$${Object.keys(data).length}`
      }
      if (video) {
        data.video = video
        updateQuery += `${updateQuery ? ", " : ""}video=$${Object.keys(data).length}`
      }
      if (req.file) {
        const imageUrl = await cloudinary.uploader.upload(req.file.path, { folder: "izipizy" })
        data.image = imageUrl.secure_url
        updateQuery += `${updateQuery ? ", " : ""}image=$${Object.keys(data).length}`
      }

      data.id = id
      recipeModel
        .updateRecipe(updateQuery, data)
        .then(() => {
          recipeModel
            .findId(id)
            .then((recipe) => {
              commonHelper.response(res, recipe.rows[0], 200, message)
            })
            .catch((err) => res.send(err))
        })
        .catch((err) => res.send(err))
    } catch (error) {
      console.log(error)
    }
  },

  deleteRecipe: async (req, res) => {
    try {
      const id = req.params.id
      const { rowCount, rows } = await recipeModel.findId(id)
      if (!rowCount) {
        return commonHelper.response(res, null, 404, "Recipe not found")
      }

      // Extract the user ID from the decoded token
      const userId = req.payload.id

      // Check if the user ID of the decoded token matches the user ID of the recipe
      if (rows[0].user_id !== userId) {
        return commonHelper.response(res, null, 401, "You are not authorized to delete this recipe")
      }

      recipeModel
        .deleteRecipe(id)
        .then((result) => {
          // console.log(result)
          commonHelper.response(res, result.rows, 200, "Recipe has been deleted")
        })
        .catch((err) => res.send(err))
    } catch (error) {
      console.log(error)
    }
  },
}

module.exports = recipeController
