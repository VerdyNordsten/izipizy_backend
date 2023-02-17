const Pool = require("../config/db")

const getAllLike = async (limit, offset, sort) => {
  const query = {
    text: `SELECT * FROM like_recipe ORDER BY recipe_id ${sort} LIMIT $1 OFFSET $2`,
    values: [limit, offset],
  }
  try {
    const result = await Pool.query(query)
    return result.rows
  } catch (err) {
    console.error(err)
    throw err
  }
}

const getLikeById = (id) => {
  return Pool.query(`SELECT * FROM like_recipe WHERE id='${id}'`)
}

const getLikeByUserAndRecipe = async (userId, recipeId) => {
  const query = {
    text: "SELECT * FROM like_recipe WHERE user_id = $1 AND recipe_id = $2",
    values: [userId, recipeId],
  }
  const result = await Pool.query(query)
  return result.rows[0]
}

const getLikesByRecipe = async (recipeId) => {
  const query = {
    text: "SELECT * FROM like_recipe WHERE recipe_id = $1",
    values: [recipeId],
  }
  const result = await Pool.query(query)
  return result.rows
}

const insertLike = (data) => {
  const { id, user_id, recipe_id } = data
  const query = "INSERT INTO like_recipe(id, user_id, recipe_id) VALUES($1, $2, $3)"
  const values = [id, user_id, recipe_id]
  return Pool.query(query, values)
}

const deleteLike = (id) => {
  return Pool.query("DELETE FROM like_recipe WHERE id=$1", [id])
}

const countData = () => {
  return Pool.query("SELECT COUNT(*) FROM save_recipe")
}

module.exports = {
  getAllLike,
  getLikeById,
  getLikeByUserAndRecipe,
  getLikesByRecipe,
  insertLike,
  deleteLike,
  countData,
}
