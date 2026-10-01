import mongoose from 'mongoose';

const downloadSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    downloadId: { type: String, required: true, unique: true, index: true },
    sourceUrl: { type: String, required: true },
    source: { type: String, required: true },
    title: { type: String, default: 'Video' },
    thumbnail: { type: String, default: null },
    format: { type: String, default: 'MP4' },
    quality: { type: String, default: 'Original' },
    fileSize: { type: Number, default: 0 },
    filePath: { type: String, default: null },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'expired'],
      default: 'pending',
      index: true,
    },
    progress: { type: Number, default: 0 },
    errorMessage: { type: String, default: null },
    expiresAt: { type: Date, default: null, index: true },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

downloadSchema.index({ createdAt: -1 });

export default mongoose.model('Download', downloadSchema);
