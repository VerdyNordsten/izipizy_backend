const uuid = require("uuid")
const commentModel = require("../models/commentModel")
const commonHelper = require("../helper/common")

const commentController = {
  getCommentById: async (req, res) => {
    const id = req.params.id
    const { rowCount } = await commentModel.getCommentById(id)
    if (!rowCount) {
      return res.json({
        Message: "Comment not found",
      })
    }
    commentModel
      .getCommentById(id)
      .then((result) => {
        commonHelper.response(res, result.rows[0], 200, "get data success")
      })
      .catch((err) => res.send(err))
  },

  getCommentsByRecipe: async (req, res) => {
    try {
      const recipeId = req.params.id
      const comments = await commentModel.getCommentsByRecipe(recipeId)

      if (comments.length === 0) {
        return commonHelper.response(res, null, 404, "No comments found for this recipe")
      }

      commonHelper.response(res, comments, 200, "Comments have been retrieved")
    } catch (err) {
      res.json({ message: err.message })
    }
  },

  createComment: async (req, res) => {
    try {
      const { comment_text, recipe_id } = req.body
      const id = uuid.v4()

      // Extract the user ID from the decoded token
      const userId = req.payload.id

      // Check if a comment already exists for the given recipe and user
      const existingComment = await commentModel.getCommentByUserAndRecipe(userId, recipe_id)
      if (existingComment) {
        return commonHelper.response(res, null, 400, "You have already commented on this recipe")
      }

      const data = {
        id,
        comment_text,
        user_id: userId,
        recipe_id,
      }
      const result = await commentModel.insertComment(data)
      commonHelper.response(res, result.rows, 201, "Comment has been created")
    } catch (err) {
      res.json({ message: err.message })
    }
  },

  updateComment: async (req, res) => {
    try {
      const id = req.params.id
      const { comment_text } = req.body
      const { rowCount, rows } = await commentModel.getCommentById(id)
      if (!rowCount) {
        return res.json({
          message: "Comment not found",
        })
      }
  
      // Extract the user ID from the decoded token
      const userId = req.payload.id
  
      // Check if the user ID of the decoded token matches the user ID of the comment
      if (rows[0].user_id !== userId) {
        return commonHelper.response(res, null, 401, "You are not authorized to edit this comment")
      }
  
      let data = {}
      let updateQuery = ""
      let message = "Comment updated succesfully"
      if (comment_text) {
        data.comment_text = comment_text
        updateQuery += `comment_text=$${Object.keys(data).length}`
      }
      data.id = id
      commentModel
        .updateComment(updateQuery, data)
        .then(() => {
          commentModel
            .getCommentById(id)
            .then((comment) => {
              commonHelper.response(res, comment.rows[0], 200, message)
            })
            .catch((err) => res.send(err))
        })
        .catch((err) => res.send(err))
    } catch (err) {
      console.log(err)
    }
  },  

  deleteComment: async (req, res) => {
    try {
      const id = req.params.id
      const { rowCount, rows } = await commentModel.getCommentById(id)
      if (!rowCount) {
        return commonHelper.response(res, null, 404, "Comment not found")
      }
  
      // Extract the user ID from the decoded token
      const userId = req.payload.id
  
      // Check if the user ID of the decoded token matches the user ID of the comment
      if (rows[0].user_id !== userId) {
        return commonHelper.response(res, null, 401, "You are not authorized to delete this comment")
      }
  
      commentModel
        .deleteComment(id)
        .then((result) => {
          commonHelper.response(res, result.rows, 200, "Comment has been deleted")
        })
        .catch((err) => res.send(err))
    } catch (err) {
      console.log(err)
    }
  },  
}

module.exports = commentController
