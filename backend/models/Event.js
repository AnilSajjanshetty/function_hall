// models/Event.js
const mongoose = require("mongoose");

// Sub-schema for media items (ensures _id generation)
const MediaItemSchema = new mongoose.Schema(
  {
    key: { type: String, required: true },
    originalName: { type: String, required: true },
    mimeType: { type: String, required: true },
    mediaType: {
      type: String,
      enum: ["image", "video"],
      required: true,
    },
    size: { type: Number, required: true },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: true }
); // Explicitly enable _id

const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    type: {
      type: String,
      required: true,
      enum: [
        "Wedding",
        "Engagement",
        "Birthday Party",
        "Office Event",
        "Anniversary",
        "Baby Shower",
        "Graduation Party",
        "Bridal Shower",
        "Retirement Party",
        "Housewarming",
        "Festival Celebration",
        "Charity Event",
        "Product Launch",
        "Networking Event",
        "Other Event",
      ],
    },
    date: { type: Date, required: true },
    guests: { type: Number, required: true, min: 1 },
    description: { type: String, required: true, trim: true },

    // UNIFIED MEDIA (images + videos)
    media: [MediaItemSchema],

    // Improved: Use ObjectId ref to media sub-doc (_id)
    thumbnailId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      validate: {
        validator: function (id) {
          if (!id) return true;
          const mediaItem = this.media?.id(id);
          return mediaItem && mediaItem.mediaType === "image";
        },
        message: "Thumbnail must reference an image in the media array",
      },
    },

    isPublished: { type: Boolean, default: true },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Indexes
EventSchema.index({ type: 1, date: -1 });
EventSchema.index({ isPublished: 1 });
EventSchema.index({ "media.key": 1 });
EventSchema.index({ "media.mediaType": 1 });
EventSchema.index({ isPublished: 1, date: -1 }); // Compound for common queries

module.exports = mongoose.model("Event", EventSchema);
