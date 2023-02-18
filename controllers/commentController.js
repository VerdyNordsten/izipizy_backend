const uuid = require("uuid")
const commentModel = require("../models/commentModel")
const commonHelper = require("../helper/common")
const moment = require("moment");

const commentController = {
  getCommentById: async (req, res) => {
    try {
      const id = req.params.id;
      const comment = await commentModel.getCommentById(id);
      if (!comment) {
        return res.json({
          Message: "Comment not found",
        });
      }
      const formattedComment = {
        ...comment,
        created_at: moment(comment.created_at).format("DD MMMM YYYY HH:mm"),
      };
      commonHelper.response(res, formattedComment, 200, "get data success");
    } catch (err) {
      res.json({ message: err.message });
    }
  },  

  getCommentsByRecipe: async (req, res) => {
    try {
      const recipeId = req.params.id;
      const sortBy = req.query.sortBy || 'desc'; // default to descending
      const comments = await commentModel.getCommentsByRecipe(recipeId, sortBy);
  
      if (comments.length === 0) {
        return commonHelper.response(res, null, 404, "No comments found for this recipe");
      }
  
      const formattedComments = comments.map(comment => ({
        ...comment,
        created_at: moment(comment.created_at).format('DD MMMM YYYY HH:mm')
      }));
  
      const sortedComments = sortBy === 'asc'
        ? formattedComments.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
        : formattedComments.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  
      commonHelper.response(res, sortedComments, 200, "Comments have been retrieved");
    } catch (err) {
      res.json({ message: err.message });
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
      const { rowCount, rows } = await commentModel.findCommentId(id)
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
            .findCommentId(id)
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
      const { rowCount, rows } = await commentModel.findCommentId(id)
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
