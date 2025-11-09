// models/Gallery.js
const mongoose = require("mongoose");

// Optional: Sub-schema for reusability (if expanding later)
const GalleryItemSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    title: { type: String, required: true, trim: true },
    originalName: { type: String, required: true },
    mimeType: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^image\/|^video\//.test(v); // Enforce image/video only
        },
        message: "mimeType must be image or video",
      },
    },
    mediaType: {
      type: String,
      enum: ["image", "video"],
      required: true,
    },
    size: {
      type: Number,
      required: true,
      min: 1, // No zero-byte files
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tags: [{ type: String, trim: true }], // Trim tags too
  },
  { timestamps: true }
);

// Indexes (unchanged, but added compound for common queries)
GalleryItemSchema.index({ mediaType: 1 });
GalleryItemSchema.index({ title: "text", tags: "text" });
GalleryItemSchema.index({ uploadedBy: 1, createdAt: -1 }); // New: User uploads by date

module.exports = mongoose.model("Gallery", GalleryItemSchema);
