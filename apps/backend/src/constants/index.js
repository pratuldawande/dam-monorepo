export const API_BASE_PATH = '/api'
export const API_VERSION = 'v1'
export const API_VERSION_HEADER = 'X-API-Version'

export const API_ROUTES = {
  base: `${API_BASE_PATH}/${API_VERSION}`,
  auth: '/auth',
  assets: '/assets',
  register: '/register',
  login: '/login',
  logout: '/logout',
  me: '/me',
  users: '/users',
  upload: '/upload',
  access: '/access',
  share: '/:assetId/share',
  deleteAsset: '/:assetId',
}

export const HTTP_STATUS = {
  ok: 200,
  created: 201,
  badRequest: 400,
  unauthorized: 401,
  forbidden: 403,
  notFound: 404,
  conflict: 409,
  payloadTooLarge: 413,
  internalServerError: 500,
}

export const ERROR_MESSAGES = {
  unauthorized: 'Unauthorized',
  forbidden: 'Forbidden',
  notFound: 'Not found',
  internalServerError: 'Internal Server Error',
  validationFailed: 'Validation failed',
  invalidCorsOrigin: 'Origin is not allowed by CORS',
  invalidAssetAccessToken: 'Asset access token is invalid',
  invalidPositiveNumberSuffix: 'must be a positive number',
  invalidEnumPrefix: 'must be one of:',
  invalidJwtSecret: 'JWT_SECRET must be at least 16 characters long',
  uploadSizeExceeded: 'Uploaded file exceeds the configured size limit',
}

export const AUTH_MESSAGES = {
  emailAlreadyRegistered: 'Email already registered',
  invalidCredentials: 'Invalid email or password',
  userNotFound: 'User not found',
  registered: 'User registered successfully',
  loginSuccess: 'Login successful',
  logoutSuccess: 'Logout successful.',
}

export const ASSET_MESSAGES = {
  assetNotFound: 'Asset not found',
  deleteForbidden: 'You are not allowed to delete this asset',
  shareForbidden: 'You are not allowed to share this asset',
  selectedUserMissing: 'Selected user does not exist',
  alreadyOwner: 'You already own this asset',
  alreadyShared: 'Asset already shared with this user',
  sharedSuccess: 'Asset shared successfully',
  deletedSuccess: 'Asset deleted successfully',
  uploadedSuccess: 'Assets uploaded successfully',
  uploadRequiresFile: 'At least one file is required',
  uploadMissingOriginalName: 'Each uploaded file must have an original name',
  uploadMissingMimeType: 'Each uploaded file must include a MIME type',
  uploadInvalidSize: 'Each uploaded file must have a valid size',
  videoStreamMissingPrefix: 'Video stream missing for asset',
}

export const VALIDATION_MESSAGES = {
  nameRequired: 'Name required',
  emailRequired: 'Email is required',
  invalidEmail: 'Invalid email',
  invalidEmailFormat: 'Invalid email format',
  passwordRequired: 'Password is required',
  passwordTooShort: 'Password must be at least 8 characters',
  passwordsDoNotMatch: 'Passwords do not match',
  pageInvalid: 'page must be an integer greater than 0',
  limitInvalid: 'limit must be an integer between 1 and 100',
  searchInvalid: 'search must be a string',
  statusInvalid: 'status must be one of queued, processing, completed, or failed',
  typeInvalid: 'type must be one of image, video, or other',
  userIdRequired: 'userId is required',
  userIdInvalid: 'userId must be a valid user id',
}

export const AUTH_FIELDS = {
  name: 'name',
  email: 'email',
  password: 'password',
  confirmPassword: 'confirmPassword',
  userId: 'userId',
  jwtStrategy: 'jwt',
}

export const ASSET_FIELDS = {
  files: 'files',
  assetUpload: '_assetUpload',
  page: 'page',
  limit: 'limit',
  search: 'search',
  status: 'status',
  type: 'type',
}

export const ASSET_STATUS = {
  queued: 'queued',
  processing: 'processing',
  completed: 'completed',
  failed: 'failed',
  all: 'all',
}

export const ASSET_TYPE = {
  image: 'image',
  video: 'video',
  other: 'other',
}

export const ENV_KEYS = {
  nodeEnv: 'NODE_ENV',
  port: 'PORT',
  mongoUri: 'MONGO_URI',
  frontendOrigin: 'FRONTEND_ORIGIN',
  minioEndpoint: 'MINIO_ENDPOINT',
  minioPort: 'MINIO_PORT',
  minioUseSsl: 'MINIO_USE_SSL',
  minioAccessKey: 'MINIO_ACCESS_KEY',
  minioSecretKey: 'MINIO_SECRET_KEY',
  minioBucket: 'MINIO_BUCKET',
  rabbitmqUrl: 'RABBITMQ_URL',
  rabbitmqAssetQueue: 'RABBITMQ_ASSET_QUEUE',
  maxFileSizeBytes: 'MAX_FILE_SIZE_BYTES',
  uploadTmpDir: 'UPLOAD_TMP_DIR',
  jwtSecret: 'JWT_SECRET',
  jwtExpire: 'JWT_EXPIRE',
}

export const ENV_DEFAULTS = {
  nodeEnv: 'development',
  port: 5000,
  mongoUri: 'mongodb://mongo:27017/dam',
  frontendOrigin: 'http://localhost:5173',
  minioEndpoint: 'minio',
  minioPort: 9000,
  minioUseSsl: false,
  minioAccessKey: 'local-minio-user',
  minioSecretKey: 'local-minio-password',
  minioBucket: 'assets',
  rabbitmqUrl: 'amqp://guest:guest@rabbitmq:5672',
  rabbitmqAssetQueue: 'asset-processing',
  maxFileSizeBytes: 1024 * 1024 * 1024,
  uploadTmpDir: '/tmp/dam-uploads',
  jwtSecret: 'local-development-jwt-secret',
  jwtExpire: '7d',
}
