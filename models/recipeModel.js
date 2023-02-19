/* eslint-disable camelcase */
const Pool = require("../config/db")

const selectAllRecipe = async (limit, offset, searchParam, sortBY, sort) => {
  let query = `SELECT recipe.*, users.name AS author FROM recipe LEFT JOIN users ON recipe.user_id = users.id WHERE LOWER(name_recipe) LIKE '%${searchParam}%' ORDER BY ${sortBY} ${sort} LIMIT ${limit} OFFSET ${offset}`
  const { rows } = await Pool.query(query)

  const result = await Promise.all(
    rows.map(async (row) => {
      const { rows: likes } = await Pool.query(`SELECT COUNT(*) FROM like_recipe WHERE recipe_id='${row.id}'`)
      const { rows: saves } = await Pool.query(`SELECT COUNT(*) FROM save_recipe WHERE recipe_id='${row.id}'`)
      return {
        ...row,
        likes: likes[0].count,
        saves: saves[0].count,
      }
    })
  )

  return { rowCount: result.length, rows: result }
}

const getMyRecipe = async (id, sortBy) => {
  const query = {
    text: `
      SELECT *
      FROM recipe 
      WHERE user_id = $1
      ORDER BY created_at ${sortBy}
    `,
    values: [id],
  }
  const result = await Pool.query(query)
  return result.rows
}

const selectRecipe = (id) => {
  return Pool.query(`SELECT * FROM recipe WHERE id='${id}'`)
}

const getSavedCountByRecipeId = async (id) => {
  const query = {
    text: `
      SELECT COUNT(*) FROM save_recipe 
      WHERE recipe_id = $1
    `,
    values: [id],
  }
  const result = await Pool.query(query)
  return result.rows[0]
}

const getLikedCountByRecipeId = async (id) => {
  const query = {
    text: `
      SELECT COUNT(*) FROM like_recipe 
      WHERE recipe_id = $1
    `,
    values: [id],
  }
  const result = await Pool.query(query)
  return result.rows[0]
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

const deleteRecipe = async (id) => {
  const client = await Pool.connect()
  try {
    await client.query("BEGIN")

    // Delete related data from save_recipe
    await client.query(`DELETE FROM save_recipe WHERE recipe_id='${id}'`)

    // Delete related data from like_recipe
    await client.query(`DELETE FROM like_recipe WHERE recipe_id='${id}'`)

    // Delete related data from comment
    await client.query(`DELETE FROM comment WHERE recipe_id='${id}'`)

    // Delete the recipe
    await client.query(`DELETE FROM recipe WHERE id='${id}'`)

    await client.query("COMMIT")
  } catch (err) {
    await client.query("ROLLBACK")
    throw err
  } finally {
    client.release()
  }
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
  getMyRecipe,
  selectRecipe,
  getSavedCountByRecipeId,
  getLikedCountByRecipeId,
  insertRecipe,
  updateRecipe,
  deleteRecipe,
  countData,
  findId,
  findName,
}
