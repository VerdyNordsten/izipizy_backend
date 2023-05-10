/* eslint-disable no-unused-vars */
require("dotenv").config()
const express = require("express")
const createError = require("http-errors")
const morgan = require("morgan")
const helmet = require("helmet")
const xss = require("xss-clean")
const cors = require("cors")
const mainRouter = require("./routes/index")

const app = express()
const port = process.env.PORT

app.use(cors({
  origin: ['https://yumyum.digty.co.id', 'http://localhost:3000'],
  methods: "GET, PUT, POST, DELETE",
  credentials: true
}))

app.options('*', cors())
app.use(express.json())
app.use(morgan("dev"))
app.use(helmet())
app.use(xss())

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://yumyum.digty.co.id")
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization")
  res.header("Access-Control-Allow-Credentials", true)
  next()
})

app.use("/api/v1", mainRouter)

app.all("*", (req, res, next) => {
  next(new createError.NotFound())
})

app.use((err, req, res, next) => {
  const messageError = err.message || "internal server error"
  const statusCode = err.status || 500
  res.status(statusCode).json({
    message: messageError,
  })
})

app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})
