const multer = require('multer')
const { MAX_FILE_SIZE_BYTES, UPLOAD_TMP_DIR } = require('../config/env')
const fs = require('fs')

if (!fs.existsSync(UPLOAD_TMP_DIR)) {
  fs.mkdirSync(UPLOAD_TMP_DIR)
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_TMP_DIR),
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`)
  },
})

module.exports = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
  },
})
