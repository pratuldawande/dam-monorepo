// eslint-disable-next-line no-unused-vars
const errorMiddleware = (err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      success: false,
      message: 'Uploaded file exceeds the configured size limit',
    })
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  })
}

export default errorMiddleware
