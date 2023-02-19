const multer = require("multer");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const s3 = require("../config/digitalocean");


const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.fieldname === "image" && !file.originalname.match(/.(jpg|jpeg|png)$/)) {
      return cb(new Error("Only image files types JPG/JPEG/PNG are allowed!"), false);
    }
    if (file.fieldname === "video" && !file.originalname.match(/.(mp4|avi|wmv|mov)$/)) {
      return cb(new Error("Only video files types MP4/AVI/WMV/MOV are allowed!"), false);
    }
    cb(null, true);
  },
  limits: function (req, file, cb) {
    if (file.fieldname === "image") {
      cb(null, { fileSize: 2 * 1024 * 1024 }); // 2 MB
    } else if (file.fieldname === "video") {
      cb(null, { fileSize: 50 * 1024 * 1024 }); // 50 MB
    } else {
      cb(new Error("Invalid file fieldname"), false);
    }
  },
}).fields([{ name: "image", maxCount: 1 }, { name: "video", maxCount: 1 }]);

const uploadFileToDO = async (file, folder) => {
  const fileExtension = file.originalname.split(".")[1];
  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  const fileName = folder + uniqueSuffix + "." + fileExtension;

  const command = new PutObjectCommand({
    Bucket: process.env.DO_SPACES_BUCKET_NAME,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read",
  });

  try {
    const response = await s3.send(command);
    console.log(`File uploaded successfully to ${response.Location}`);
    return response.Location;
  } catch (error) {
    console.error("Error uploading file to DO Spaces:", error);
    throw error;
  }
};

module.exports = { upload, uploadFileToDO };
