/* eslint-disable no-unused-vars */
const userModel = require("../models/userModel")
const uuid = require("uuid")
const commonHelper = require("../helper/common")
const authHelper = require("../helper/auth")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const saltRounds = 10
var cloudinary = require("../config/cloudinary")

const userController = {
  registerUser: async (req, res) => {
    try {
      const { name, email, password, phone } = req.body
      const checkEmail = await userModel.findEmail(email)
      if (checkEmail.rowCount > 0) {
        return res.json({
          message: "Email already exist",
        })
      }
      const hashPassword = await bcrypt.hash(password, saltRounds)
      const id = uuid.v4()
      const data = {
        id,
        name,
        email,
        password: hashPassword,
        phone_number: phone,
      }
      const result = await userModel.insertUser(data)
      commonHelper.response(res, result.rows, 201, "Register has been success")
    } catch (err) {
      res.send(err)
    }
  },

  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body
      const {
        rows: [user],
      } = await userModel.findEmail(email)
      if (!user) {
        return res.json({
          message: "Email is invalid",
        })
      }
      const isValidPassword = bcrypt.compareSync(password, user.password)
      if (!isValidPassword) {
        return res.json({
          message: "Password is invalid",
        })
      }
      delete user.password
      let payload = {
        email: user.email,
        id: user.id, // add the user ID to the payload
      }
      // console.log(payload)
      user.token = authHelper.generateToken(payload)
      user.refreshToken = authHelper.generateRefreshToken(payload)
      commonHelper.response(res, user, 201, "login is successful")
    } catch (err) {
      res.send(err)
    }
  },

  refreshToken: (req, res) => {
    const refreshToken = req.body.refreshToken
    const decoded = jwt.verify(refreshToken, process.env.SECRET_KEY_JWT)
    let payload = {
      email: decoded.email,
    }
    const result = {
      token: authHelper.generateToken(payload),
      refreshToken: authHelper.generateRefreshToken(payload),
    }
    commonHelper.response(res, result, 200, "Get refresh token is successful")
  },

  profileUser: async (req, res) => {
    const email = req.payload.email
    const {
      rows: [user],
    } = await userModel.findEmail(email)
    delete user.password
    commonHelper.response(res, user, 200, "Get data profile is successful")
  },

  editProfile: async (req, res) => {
    const userId = req.payload.id
    const id = req.params.id
    const { name, password } = req.body

    if (userId !== id) {
      return commonHelper.response(res, null, 401, "You are not authorized to edit this profile")
    }

    let hashPassword
    let imageProfile

    const dataPw = await userModel.findId(id)
    if (!password) {
      hashPassword = dataPw.rows[0].password
    } else {
      hashPassword = await bcrypt.hash(password, saltRounds)
    }

    if (req.file) {
      const imageUrl = await cloudinary.uploader.upload(req.file.path, {
        folder: "izipizy",
      })
      imageProfile = imageUrl.secure_url
    } else {
      imageProfile = dataPw.rows[0].image_profile
    }

    await userModel.editProfile(name, hashPassword, imageProfile, id)

    const responseData = {
      id: dataPw.rows[0].id,
      name: dataPw.rows[0].name,
      email: dataPw.rows[0].email,
      phone_number: dataPw.rows[0].phone_number,
      image_profile: dataPw.rows[0].image_profile,
    }

    commonHelper.response(res, responseData, 200, "Edit profile is successful")
  },
}

module.exports = userController
