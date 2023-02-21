const multer = require("multer")

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = file.originalname.split(".")[1];
    const filename = `${file.fieldname}-${uniqueSuffix}.${fileExtension}`;
    const mimeType = file.mimetype;
    const mediaType = mimeType.includes('image') ? 'image' : 'video';
    const media = { path: filename, mimetype: mimeType, mediaType: mediaType };
    req.media = media;
    cb(null, filename);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const allowedImageTypes = /jpeg|jpg|png/;
    const allowedVideoTypes = /mp4|mov|avi|wmv/;
    const isImage = allowedImageTypes.test(file.mimetype);
    const isVideo = allowedVideoTypes.test(file.mimetype);

    if (!isImage && !isVideo) {
      return cb(new Error("Only image and video files are allowed!"), false);
    }

    const mimeType = file.mimetype;
    const mediaType = isImage ? 'image' : 'video';
    const media = { path: file.path, filename: file.filename, mimetype: mimeType, mediaType: mediaType };
    req.media = media; // add media object to request for later use
    cb(null, true);
  },
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB
});

module.exports = upload
