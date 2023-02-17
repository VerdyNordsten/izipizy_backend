const Pool = require("../config/db")

const selectAllCategory = (limit, offset, searchParam, sortBY, sort) => {
  return Pool.query(`SELECT * FROM category WHERE lower(name) LIKE '%${searchParam}%' ORDER BY ${sortBY} ${sort} LIMIT ${limit} OFFSET ${offset}`)
}

const selectCategory = (id) => {
  return Pool.query(`SELECT * FROM category WHERE id='${id}'`)
}

const createCategory = (data) => {
  const { id, name } = data
  return Pool.query(`INSERT INTO category(id, name) VALUES('${id}','${name}')`)
}

const updateCategory = (updateQuery, data) => {
  return Pool.query(`UPDATE category SET ${updateQuery} WHERE id=$${Object.keys(data).length}`, Object.values(data))
}

const deleteCategory = (id) => {
  return Pool.query("DELETE FROM category WHERE id=$1", [id])
}

const countData = () => {
  return Pool.query("SELECT COUNT(*) FROM category")
}

const findId = (id) => {
  return new Promise((resolve, reject) =>
    Pool.query(`SELECT id FROM category WHERE id='${id}'`, (error, result) => {
      if (!error) {
        resolve(result)
      } else {
        reject(error)
      }
    })
  )
}

const findName = (name) => {
  return Pool.query("SELECT * FROM category WHERE name = $1", [name])
}

module.exports = {
  selectAllCategory,
  selectCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  countData,
  findId,
  findName,
}
