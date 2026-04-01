import fs from 'fs'
import multer from 'multer'
import { MAX_FILE_SIZE_BYTES, UPLOAD_TMP_DIR } from '@/config/env'

if (!fs.existsSync(UPLOAD_TMP_DIR)) {
  fs.mkdirSync(UPLOAD_TMP_DIR)
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_TMP_DIR),
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`)
  },
})

export default multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
  },
})
