const mongoose = require('mongoose')

const assetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sharedWith: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    originalName: String,
    filename: String,
    bucket: String,
    url: String,
    type: String,
    size: Number,
    tags: [String],
    metadata: Object,
    status: {
      type: String,
      enum: ['queued', 'processing', 'completed', 'failed'],
      default: 'queued',
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Asset', assetSchema)
