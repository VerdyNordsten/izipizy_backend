const Pool = require("../config/db")

const getSavesByUser = async (id, sortBy) => {
  const query = {
    text: `
      SELECT save_recipe.*, recipe.name_recipe, recipe.image
      FROM save_recipe 
      INNER JOIN recipe ON save_recipe.recipe_id = recipe.id 
      WHERE save_recipe.user_id = $1
      ORDER BY save_recipe.id ${sortBy}
    `,
    values: [id],
  }
  const result = await Pool.query(query)
  return result.rows
}

const getSaveById = async (id) => {
  const query = {
    text: `
      SELECT save_recipe.*, recipe.name_recipe, recipe.image
      FROM save_recipe 
      INNER JOIN recipe ON save_recipe.recipe_id = recipe.id 
      WHERE save_recipe.id = $1
    `,
    values: [id],
  }
  const result = await Pool.query(query)
  return result.rows[0]
}

const getSaveByUserAndRecipe = async (userId, recipeId) => {
  const query = {
    text: "SELECT * FROM save_recipe WHERE user_id = $1 AND recipe_id = $2",
    values: [userId, recipeId],
  }
  const result = await Pool.query(query)
  return result.rows[0]
}

const getSavesByRecipe = async (recipeId) => {
  const query = {
    text: "SELECT * FROM save_recipe WHERE recipe_id = $1",
    values: [recipeId],
  }
  const result = await Pool.query(query)
  return result.rows
}

const insertSave = (data) => {
  const { id, user_id, recipe_id } = data
  const query = "INSERT INTO save_recipe(id, user_id, recipe_id) VALUES($1, $2, $3)"
  const values = [id, user_id, recipe_id]
  return Pool.query(query, values)
}

const deleteSave = (id) => {
  return Pool.query("DELETE FROM save_recipe WHERE id=$1", [id])
}

const countData = () => {
  return Pool.query("SELECT COUNT(*) FROM save_recipe")
}

module.exports = {
  getSavesByUser,
  getSaveById,
  getSaveByUserAndRecipe,
  getSavesByRecipe,
  insertSave,
  deleteSave,
  countData,
}
