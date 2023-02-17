const uuid = require("uuid")
const categoryModel = require("../models/categoryModel")
const commonHelper = require("../helper/common")

const categoryController = {
  getAllCategory: async (req, res) => {
    try {
      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || 5
      const offset = (page - 1) * limit
      const sortBY = req.query.sortBY || "name"
      const sort = req.query.sort || "ASC"
      const searchParam = req.query.search ? req.query.search.toLowerCase() : ""
      const result = await categoryModel.selectAllCategory(limit, offset, searchParam, sortBY, sort)
      if (result.rowCount === 0) {
        return res.json({
          message: "Data not found",
        })
      }
      const {
        rows: [count],
      } = await categoryModel.countData()
      const totalData = parseInt(count.count)
      const totalPage = Math.ceil(totalData / limit)
      const pagination = {
        currentPage: page,
        limit,
        totalData,
        totalPage,
      }
      commonHelper.response(res, result.rows, 200, "get data success", pagination)
    } catch (err) {
      console.log(err)
    }
  },

  getDetailCategory: async (req, res) => {
    const id = req.params.id
    const { rowCount } = await categoryModel.findId(id)
    if (!rowCount) {
      return res.json({
        Message: "Category not found",
      })
    }
    categoryModel
      .selectCategory(id)
      .then((result) => {
        commonHelper.response(res, result.rows[0], 200, "get data success")
      })
      .catch((err) => res.send(err))
  },

  createCategory: async (req, res) => {
    try {
      const { name } = req.body
      const checkName = await categoryModel.findName(name)
      if (checkName.rowCount > 0) {
        throw new Error("Name Category already exist")
      }
      const id = uuid.v4()
      const data = {
        id,
        name,
      }
      const result = await categoryModel.createCategory(data)
      commonHelper.response(res, result.rows, 201, "Category has been created")
    } catch (err) {
      res.json({ message: err.message })
    }
  },

  updateCategory: async (req, res) => {
    try {
      const id = req.params.id
      const { name } = req.body
      const checkName = await categoryModel.findName(name)
      if (checkName.rowCount > 0) {
        return res.json({
          message: "Category Name already exist",
        })
      }
      const { rowCount } = await categoryModel.findId(id)
      if (!rowCount) {
        return res.json({
          message: "Category not found",
        })
      }
      let data = {}
      let updateQuery = ""
      let message = "Category updated succesfully"
      if (name) {
        data.name = name
        updateQuery += `name=$${Object.keys(data).length}`
        message
      }
      data.id = id
      categoryModel
        .updateCategory(updateQuery, data)
        .then(() => {
          categoryModel
            .findId(id)
            .then((category) => {
              commonHelper.response(res, category.rows[0], 200, message)
            })
            .catch((err) => res.send(err))
        })
        .catch((err) => res.send(err))
    } catch (err) {
      console.log(err)
    }
  },

  deleteCategory: async (req, res) => {
    try {
      const id = req.params.id
      const { rowCount } = await categoryModel.findId(id)
      if (!rowCount) {
        return res.json({
          Message: "Category not found",
        })
      }
      categoryModel
        .deleteCategory(id)
        .then((result) => {
          commonHelper.response(res, result.rows, 200, "Category has been deleted")
        })
        .catch((err) => res.send(err))
    } catch (err) {
      console.log(err)
    }
  },
}

module.exports = categoryController
