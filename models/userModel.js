const Pool = require('../config/db');

const findId = (id) => {
  return Pool.query('SELECT * FROM users WHERE id = $1', [id]);
}

const findEmail = (email) => {
  return Pool.query('SELECT * FROM users WHERE email = $1', [email]);
}

const insertUser = async (data) => {
  return await Pool.query('INSERT INTO users (id, name, email, password, phone_number) VALUES ($1, $2, $3, $4, $5)', [data.id, data.name, data.email, data.password, data.phone_number]);
}

module.exports = { findId, findEmail, insertUser}