const uuid = require("uuid")
const saveModel = require("../models/saveModel")
const commonHelper = require("../helper/common")

const saveController = {
  getAllSave: async (req, res) => {
    try {
      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || 10000
      const offset = (page - 1) * limit
      const sort = req.query.sort || "ASC"
      const result = await saveModel.getAllSave(limit, offset, sort)
      if (result.length === 0) {
        return res.json({
          message: "Data not found",
        })
      }
      const {
        rows: [count],
      } = await saveModel.countData()
      const totalData = parseInt(count.count)
      const totalPage = Math.ceil(totalData / limit)
      const pagination = {
        currentPage: page,
        limit,
        totalData,
        totalPage,
      }
      commonHelper.response(res, result, 200, "Get all save data success", pagination)
    } catch (error) {
      console.log(error)
      return commonHelper.response(res, [], 500, "Error retrieving saved data")
    }
  },

  getSaveById: async (req, res) => {
    const id = req.params.id
    const { rowCount } = await saveModel.getSaveById(id)
    if (!rowCount) {
      return res.json({
        Message: "Save not found",
      })
    }
    saveModel
      .getSaveById(id)
      .then((result) => {
        commonHelper.response(res, result.rows[0], 200, "Get data saved by id success")
      })
      .catch((err) => res.send(err))
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
      const { rowCount, rows } = await saveModel.getSaveById(id)
      if (!rowCount) {
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
