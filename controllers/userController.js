/* eslint-disable no-unused-vars */
const userModel = require("../models/userModel");
const uuid = require("uuid");
const commonHelper = require("../helper/common");
const authHelper = require("../helper/auth");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;
var cloudinary = require("../config/cloudinary");

const userController = {
  registerUser: async (req, res) => {
    try {
      const { name, email, password, phone } = req.body;
      const checkEmail = await userModel.findEmail(email);
      if (checkEmail.rowCount > 0) {
        return res.json({
          message: "Email already exist",
        });
      }
      const hashPassword = await bcrypt.hash(password, saltRounds);
      const id = uuid.v4();
      const data = {
        id,
        name,
        email,
        password: hashPassword,
        phone_number: phone,
      };
      const result = await userModel.insertUser(data);
      commonHelper.response(res, result.rows, 201, "Register has been success");
    } catch (err) {
      res.send(err);
    }
  },

  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body;
      const {
        rows: [user],
      } = await userModel.findEmail(email);
      if (!user) {
        return res.json({
          message: "Email is invalid",
        });
      }
      const isValidPassword = bcrypt.compareSync(password, user.password);
      if (!isValidPassword) {
        return res.json({
          message: "Password is invalid",
        });
      }
      delete user.password;
      let payload = {
        email: user.email,
        id: user.id, // add the user ID to the payload
      };
      console.log(payload);
      user.token = authHelper.generateToken(payload);
      user.refreshToken = authHelper.generateRefreshToken(payload);
      commonHelper.response(res, user, 201, "login is successful");
    } catch (err) {
      res.send(err);
    }
  },

  refreshToken: (req, res) => {
    const refreshToken = req.body.refreshToken;
    const decoded = jwt.verify(refreshToken, process.env.SECRET_KEY_JWT);
    let payload = {
      email: decoded.email,
    };
    const result = {
      token: authHelper.generateToken(payload),
      refreshToken: authHelper.generateRefreshToken(payload),
    };
    commonHelper.response(res, result, 200, "Get refresh token is successful");
  },

  profileUser: async (req, res) => {
    const email = req.payload.email;
    const {
      rows: [user],
    } = await userModel.findEmail(email);
    delete user.password;
    commonHelper.response(res, user, 200, "Get data profile is successful");
  },

  editProfile: async (req, res) => {
    const email = req.payload.email;
    const { password } = req.body;
    const hashPassword = await bcrypt.hash(password, saltRounds);
    // const imageUrl = await cloudinary.uploader.upload(req.file.path, {
    //   folder: "izipizy",
    // });
    let photo;
    if (req.file) {
      const imageUrl = await cloudinary.uploader.upload(req.file.path, {
        folder: "izipizy",
      });
      photo = imageUrl.secure_url;
    }
    const result = await userModel.editProfile(hashPassword, photo, email);
    const dataProfile = await userModel.findEmail(email);
    commonHelper.response(
      res,
      dataProfile.rows[0],
      200,
      "Get data profile is successful"
    );
  },
};

module.exports = userController;
