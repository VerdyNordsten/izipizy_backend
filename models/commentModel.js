const Pool = require("../config/db")

const getCommentById = async (id) => {
  const query = {
    text: `
      SELECT comment.*, users.name, users.image_profile
      FROM comment 
      INNER JOIN users ON comment.user_id = users.id 
      WHERE comment.id = $1
    `,
    values: [id],
  }
  const result = await Pool.query(query)
  return result.rows[0]
}

const getCommentByUserAndRecipe = async (userId, recipeId) => {
  const query = {
    text: "SELECT * FROM comment WHERE user_id = $1 AND recipe_id = $2",
    values: [userId, recipeId],
  }
  const result = await Pool.query(query)
  return result.rows[0]
}

const getCommentsByRecipe = async (recipeId, sortBy) => {
  const query = {
    text: `
      SELECT comment.*, users.name, users.image_profile
      FROM comment 
      INNER JOIN users ON comment.user_id = users.id 
      WHERE comment.recipe_id = $1
      ORDER BY created_at ${sortBy}
    `,
    values: [recipeId],
  }
  const result = await Pool.query(query)
  return result.rows
}

const insertComment = (data) => {
  const { id, comment_text, user_id, recipe_id } = data
  const query = "INSERT INTO comment(id, comment_text, user_id, recipe_id) VALUES($1, $2, $3, $4)"
  const values = [id, comment_text, user_id, recipe_id]
  return Pool.query(query, values)
}

const updateComment = (updateQuery, data) => {
  return Pool.query(`UPDATE comment SET ${updateQuery} WHERE id=$${Object.keys(data).length}`, Object.values(data))
}

const deleteComment = (id) => {
  return Pool.query("DELETE FROM comment WHERE id=$1", [id])
}

const findCommentId = (id) => {
  return Pool.query("SELECT * FROM comment WHERE id = $1", [id])
}

const findComment = (comment_text) => {
  return Pool.query("SELECT * FROM comment WHERE comment_text = $1", [comment_text])
}

module.exports = {
  getCommentById,
  getCommentByUserAndRecipe,
  getCommentsByRecipe,
  insertComment,
  updateComment,
  deleteComment,
  findCommentId,
  findComment,
}
