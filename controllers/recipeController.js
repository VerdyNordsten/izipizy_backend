const recipeModel = require("../models/recipeModel")
const commonHelper = require("../helper/common")
const uuid = require("uuid")
const moment = require("moment")
const { uploadFile, deleteFile } = require("../config/googleDrive.config")

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

      const data = result.rows.map((row) => ({
        ...row,
        created_at: moment(row.created_at).format("DD MMMM YYYY HH:mm"),
        likes: row.likes,
        saves: row.saves,
      }))

      commonHelper.response(res, data, 200, "Get data success", pagination)
    } catch (err) {
      res.json({ message: err.message })
    }
  },

  getMyRecipe: async (req, res) => {
    try {
      const userId = req.payload.id
      const sortBy = req.query.sortBy || "desc"
      const result = await recipeModel.getMyRecipe(userId, sortBy)
      if (!result) {
        return res.json({
          Message: "Recipe not found",
        })
      }
      const responseData = result.map((like) => {
        return {
          id: like.id,
          recipe_id: like.recipe_id,
          name_recipe: like.name_recipe,
          image: like.image,
          created_at: moment(like.created_at).format("DD MMMM YYYY HH:mm"),
        }
      })
      commonHelper.response(res, responseData, 200, "Get data Recipe by user success")
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
    const { name_recipe, description, ingredients } = req.body
    const id = uuid.v4()

    const image = req.files.image[0]
    const video = req.files.video[0]

    const imageUrl = await uploadFile(image, "image/jpeg")
    const videoUrl = await uploadFile(video, "video/mp4")

    const userId = req.payload.id

    const data = {
      id,
      name_recipe,
      description,
      ingredients,
      video: `https://drive.google.com/uc?id=${videoUrl.id}`,
      image: `https://drive.google.com/uc?id=${imageUrl.id}`,
      user_id: userId,
    }

    return recipeModel
      .insertRecipe(data)
      .then((result) => {
        commonHelper.response(res, result.rows, 201, "Recipe has been created")
      })
      .catch((err) => res.send(err))
  },

  updateRecipe: async (req, res) => {
    try {
      const id = req.params.id
      const { name_recipe, description, ingredients } = req.body
      const recipeResult = await recipeModel.findId(id)
      if (!recipeResult.rows || recipeResult.rows.length === 0) {
        return res.json({
          message: "Recipe not found",
        })
      }
      const rows = recipeResult.rows

      const userId = req.payload.id

      if (rows[0].user_id !== userId) {
        return commonHelper.response(res, null, 401, "You are not authorized to edit this recipe")
      }

      let data = {}
      let updateQuery = ""
      let message = "Recipe updated sucessfull"
      const image = req.files.image?.[0] 
      const video = req.files.video?.[0] 
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
        const videoUrl = await uploadFile(video, "video/mp4")
        data.video = `https://drive.google.com/uc?id=${videoUrl.id}`
        updateQuery += `${updateQuery ? ", " : ""}video=$${Object.keys(data).length}`
      }
      if (image) {
        const imageUrl = await uploadFile(image, "image/jpeg")
        data.image = `https://drive.google.com/uc?id=${imageUrl.id}`
        updateQuery += `${updateQuery ? ", " : ""}image=$${Object.keys(data).length}`
      }

      data.id = id
      return recipeModel
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
      const { rowCount, rows: [cekUser] } = await recipeModel.findId(id)
      if (!rowCount) {
        return commonHelper.response(res, null, 404, "Recipe not found")
      }

      const userId = req.payload.id

      if (cekUser?.user_id !== userId) {
        return commonHelper.response(res, null, 401, "You are not authorized to delete this recipe")
      }

      const imageSplit = cekUser?.image.split("=")[1]
      const videoSplit = cekUser?.video.split("=")[1]

      await deleteFile(imageSplit)
      await deleteFile(videoSplit)

      await recipeModel.deleteRecipe(id)

      return commonHelper.response(res, null, 200, "Recipe has been deleted")
    } catch (error) {
      console.log(error)
    }
  },
}

module.exports = recipeController