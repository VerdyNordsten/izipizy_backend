/* eslint-disable camelcase */
const Pool = require("../config/db")

const selectAllRecipe = (limit, offset, searchParam, sortBY, sort) => {
  return Pool.query(`SELECT * FROM recipe WHERE lower(name_recipe) LIKE '%${searchParam}%' ORDER BY ${sortBY} ${sort} LIMIT ${limit} OFFSET ${offset}`)
}

const selectRecipe = (id) => {
  return Pool.query(`SELECT * FROM recipe WHERE id='${id}'`)
}

const insertRecipe = (data) => {
  const { id, name_recipe, description, ingredients, video, image, user_id } = data
  const query = "INSERT INTO recipe(id, name_recipe, description, ingredients, video, image, user_id) VALUES($1, $2, $3, $4, $5, $6, $7)"
  const values = [id, name_recipe, description, ingredients, video, image, user_id]
  return Pool.query(query, values)
}

const updateRecipe = (updateQuery, data) => {
  return Pool.query(`UPDATE recipe SET ${updateQuery} WHERE id=$${Object.keys(data).length}`, Object.values(data))
}

const deleteRecipe = (id) => {
  return Pool.query(`DELETE FROM recipe WHERE id='${id}'`)
}

const countData = () => {
  return Pool.query("SELECT COUNT(*) FROM recipe")
}

const findId = (id) => {
  return Pool.query("SELECT * FROM recipe WHERE id = $1", [id])
}

const findName = (name) => {
  return Pool.query("SELECT * FROM recipe WHERE name = $1", [name])
}

module.exports = {
  selectAllRecipe,
  selectRecipe,
  insertRecipe,
  updateRecipe,
  deleteRecipe,
  countData,
  findId,
  findName,
}
