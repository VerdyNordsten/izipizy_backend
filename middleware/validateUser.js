/* eslint-disable camelcase */
/* eslint-disable no-undef */

const validateLogin = async (req, res, next) => {
  const { email, password } = req.body
  try {
    const checkEmail = async (email) => {
      if (email === "") throw new Error("Email is required")
      if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) throw new Error("Invalid email format")
    }
    const checkPassword = async (password) => {
      if (password === "") throw new Error("Password is required")
      if (password.length < 8) throw new Error("Password must be at least 8 characters")
      if (/\s/.test(password)) throw new Error("Password should not contain any spaces")
    }
    await Promise.all([checkEmail(email), checkPassword(password)])
    next()
  } catch (error) {
    return res.json({ message: error.message })
  }
}

const validateRegister = async (req, res, next) => {
  const { name, email, password, phone } = req.body
  try {
    const checkNameRegister = async (name) => {
      if (name === "") throw new Error("Name is required")
      if (!/^[a-zA-Z ]+$/.test(name)) throw new Error("Full Name must be alphabetic")
    }
    const checkEmailRegister = async (email) => {
      if (email === "") throw new Error("Email is required")
      if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) throw new Error("Invalid email format")
    }
    const checkPasswordRegister = async (password) => {
      if (password === "") throw new Error("Password is required")
      if (password.length < 8) throw new Error("Password must be at least 8 characters")
      if (/\s/.test(password)) throw new Error("Password should not contain any spaces")
    }
    const checkPhoneRegister = async (phone) => {
      if (phone === "") throw new Error("Phone number is required")
      if (!/^\d{10}$/.test(phone)) throw new Error("Invalid phone number format")
    }
    await Promise.all([checkNameRegister(name), checkEmailRegister(email), checkPasswordRegister(password), checkPhoneRegister(phone)])
    next()
  } catch (error) {
    return res.json({ message: error.message })
  }
}

const validateUpdateUser = async (req, res, next) => {
  const { name, email, password, phone } = req.body
  try {
    const checkNameUpdate = async (name) => {
      if (!name) return
      if (!/^[a-zA-Z ]+$/.test(name)) throw new Error("Name must be alphabetic")
    }
    const checkEmailUpdate = async (email) => {
      if (!email) return
      if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) throw new Error("Invalid email format")
    }
    const checkPasswordUpdate = async (password) => {
      if (!password) return
      if (password.length < 8) throw new Error("Password must be at least 8 characters")
      if (/\s/.test(password)) throw new Error("Password should not contain any spaces")
    }
    const checkPhoneUpdate = async (phone) => {
      if (!phone) return
      if (!/^[0-9]{8,}$/.test(phone)) throw new Error("Invalid phone number format")
    }
    await Promise.all([checkNameUpdate(name), checkEmailUpdate(email), checkPasswordUpdate(password), checkPhoneUpdate(phone)])
    next()
  } catch (error) {
    return res.json({ message: error.message })
  }
}

module.exports = { validateLogin, validateRegister, validateUpdateUser }
