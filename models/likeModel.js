const Pool = require("../config/db")

const getLikesByUser = async (id, sortBy) => {
  const query = {
    text: `
      SELECT like_recipe.*, recipe.name_recipe, recipe.image
      FROM like_recipe 
      INNER JOIN recipe ON like_recipe.recipe_id = recipe.id 
      WHERE like_recipe.user_id = $1
      ORDER BY like_recipe.id ${sortBy}
    `,
    values: [id],
  }
  const result = await Pool.query(query)
  return result.rows
}

const getLikeById = async (id) => {
  const query = {
    text: `
      SELECT like_recipe.*, recipe.name_recipe, recipe.image
      FROM like_recipe 
      INNER JOIN recipe ON like_recipe.recipe_id = recipe.id 
      WHERE like_recipe.id = $1
    `,
    values: [id],
  }
  const result = await Pool.query(query)
  return result.rows[0]
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
  return Pool.query("SELECT COUNT(*) FROM like_recipe")
}

const findLikeId = (id) => {
  return Pool.query("SELECT * FROM like_recipe WHERE id = $1", [id])
}

module.exports = {
  getLikesByUser,
  getLikeById,
  getLikeByUserAndRecipe,
  getLikesByRecipe,
  insertLike,
  deleteLike,
  countData,
  findLikeId
}
