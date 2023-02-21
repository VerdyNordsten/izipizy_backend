const uuid = require("uuid")
const saveModel = require("../models/saveModel")
const commonHelper = require("../helper/common")

const saveController = {
  getSavesByUser: async (req, res) => {
    try {
      // Extract the user ID from the decoded token
      const userId = req.payload.id

      const sortBy = req.query.sortBy || "desc" // default to descending
      const result = await saveModel.getSavesByUser(userId, sortBy)
      if (!result) {
        return res.json({
          Message: "Saves not found",
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
      commonHelper.response(res, responseData, 200, "Get data saved by user success")
    } catch (err) {
      res.json({ message: err.message })
    }
  },

  getSaveById: async (req, res) => {
    const id = req.params.id
    const result = await saveModel.getSaveById(id)
    if (!result) {
      return res.json({
        Message: "Save not found",
      })
    }
    const responseData = {
      id: result.id,
      user_id: result.user_id,
      recipe_id: result.recipe_id,
      name_recipe: result.name_recipe,
      image: result.image,
    }
    commonHelper.response(res, responseData, 200, "Get data saved by id success")
  },

  getSavesByRecipe: async (req, res) => {
    const recipeId = req.params.id
    try {
      const result = await saveModel.getSavesByRecipe(recipeId)
      return commonHelper.response(res, result, 200, "Get data saved by recipe success")
    } catch (err) {
      console.error(err)
      return commonHelper.response(res, 500, "Error retrieving saved data")
    }
  },

  createSave: async (req, res) => {
    try {
      const { recipe_id } = req.body
      const id = uuid.v4()

      // Extract the user ID from the decoded token
      const userId = req.payload.id

      // Check if a Save already exists for the given recipe and user
      const existingSave = await saveModel.getSaveByUserAndRecipe(userId, recipe_id)
      if (existingSave) {
        return commonHelper.response(res, null, 400, "You have already Saved on this recipe")
      }

      const data = {
        id,
        user_id: userId,
        recipe_id,
      }
      const result = await saveModel.insertSave(data)
      commonHelper.response(res, result.rows, 201, "The recipe has been saved")
    } catch (err) {
      res.json({ message: err.message })
    }
  },

  deleteSave: async (req, res) => {
    try {
      const id = req.params.id
      const { rows } = await saveModel.findSaveId(id)
      if (!rows) {
        return commonHelper.response(res, null, 404, "Save not found")
      }

      // Extract the user ID from the decoded token
      const userId = req.payload.id

      // Check if the user ID of the decoded token matches the user ID of the Save
      if (rows[0].user_id !== userId) {
        return commonHelper.response(res, null, 401, "You are not authorized to delete this Save")
      }

      saveModel
        .deleteSave(id)
        .then((result) => {
          commonHelper.response(res, result.rows, 200, "Save has been deleted")
        })
        .catch((err) => res.send(err))
    } catch (err) {
      console.log(err)
    }
  },
}

module.exports = saveController
