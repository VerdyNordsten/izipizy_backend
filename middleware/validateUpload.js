const multer = require("multer")

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    const fileExtension = file.originalname.split(".")[1]
    cb(null, file.fieldname + "-" + uniqueSuffix + "." + fileExtension)
  },
})

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/.(jpg|jpeg|png)$/)) {
      return cb(new Error("Only image files types JPG/JPEG/PNG are allowed!"), false)
    }
    cb(null, true)
  },
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
})

module.exports = upload
