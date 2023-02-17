const Pool = require("../config/db")

const getAllSave = async (limit, offset, sort) => {
  const query = {
    text: `SELECT * FROM save_recipe ORDER BY recipe_id ${sort} LIMIT $1 OFFSET $2`,
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

const getSaveById = (id) => {
  return Pool.query(`SELECT * FROM save_recipe WHERE id='${id}'`)
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
  getAllSave,
  getSaveById,
  getSaveByUserAndRecipe,
  getSavesByRecipe,
  insertSave,
  deleteSave,
  countData,
}
