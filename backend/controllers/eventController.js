// controllers/eventController.js
const Event = require("../models/Event");
const { minioClient, BUCKET, getPresignedUrl } = require("../utils/minio");

// Helper: Attach presigned URLs to media array
const attachMediaUrls = async (media) =>
  Promise.all(
    (media || []).map(async (m) => ({
      ...m,
      url: await getPresignedUrl(m.key),
    }))
  );

// 1. GET ALL EVENTS (unchanged)
const getAllEvents = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      type,
      published,
      sort = "date",
      order = "desc",
    } = req.query;

    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    if (type) filter.type = type;
    if (published !== undefined) filter.isPublished = published === "true";

    const sortObj = { [sort]: order === "desc" ? -1 : 1 };

    const events = await Event.find(filter)
      .sort(sortObj)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean();

    const results = await Promise.all(
      (events || []).map(async (event) => {
        event.media = Array.isArray(event.media) ? event.media : [];
        event.media = await attachMediaUrls(event.media);

        if (event.thumbnailId && event.media.length > 0) {
          const thumb = event.media.find(
            (m) => m._id?.toString() === event.thumbnailId?.toString()
          );
          event.thumbnail = thumb || null;
        } else {
          event.thumbnail = null;
        }

        return event;
      })
    );

    const total = await Event.countDocuments(filter);

    res.json({
      events: results,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("getAllEvents error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 2. GET SINGLE EVENT (unchanged)
const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).lean();
    if (!event) return res.status(404).json({ message: "Event not found" });

    event.media = await attachMediaUrls(event.media);

    if (event.thumbnailId) {
      const thumb = event.media.find(
        (m) => m._id.toString() === event.thumbnailId.toString()
      );
      event.thumbnail = thumb || null;
    }

    await Event.updateOne({ _id: event._id }, { $inc: { views: 1 } });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 3. CREATE EVENT (Updated: Handles text fields + files in one request)
const createEvent = async (req, res) => {
  try {
    // Parse text fields from req.body
    const { title, type, date, guests, description } = req.body;
    const files = req.files ? req.files["files"] || [] : [];

    if (!title || !type || !date || !guests || !description) {
      return res.status(400).json({ message: "All event fields are required" });
    }
    if (!files || files.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one media file is required" });
    }

    // Create event first (without media)
    const event = await Event.create({
      title,
      type,
      date,
      guests: parseInt(guests),
      description,
      media: [], // Will populate below
    });

    const results = [];

    for (const file of files) {
      const isImage = file.mimetype.startsWith("image/");
      const isVideo = file.mimetype.startsWith("video/");
      if (!isImage && !isVideo) {
        return res
          .status(400)
          .json({ message: `Unsupported file type: ${file.originalname}` });
      }

      const key = `events/${event._id}/${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 5)}-${file.originalname}`;
      await minioClient.putObject(BUCKET, key, file.buffer, file.size, {
        "Content-Type": file.mimetype,
      });

      const mediaObj = {
        key,
        originalName: file.originalname,
        mimeType: file.mimetype,
        mediaType: isImage ? "image" : "video",
        size: file.size,
      };

      event.media.push(mediaObj);
      const url = await getPresignedUrl(key);
      results.push({
        ...mediaObj,
        url,
        _id: event.media[event.media.length - 1]._id, // Auto-generated _id
      });
    }

    // Optional: Auto-set first image as thumbnail
    const firstImage = event.media.find((m) => m.mediaType === "image");
    if (firstImage) {
      event.thumbnailId = firstImage._id;
    }

    await event.save();

    // Attach URLs for response
    event.media = await attachMediaUrls(event.media);
    if (event.thumbnailId) {
      const thumb = event.media.find(
        (m) => m._id.toString() === event.thumbnailId.toString()
      );
      event.thumbnail = thumb || null;
    }

    res.status(201).json(event);
  } catch (err) {
    console.error("createEvent error:", err);
    res.status(400).json({ message: err.message });
  }
};

// 4. UPDATE EVENT (any field)
const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const event = await Event.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).lean();

    if (!event) return res.status(404).json({ message: "Event not found" });

    event.media = await attachMediaUrls(event.media);
    if (event.thumbnailId) {
      const thumb = event.media.find(
        (m) => m._id.toString() === event.thumbnailId.toString()
      );
      event.thumbnail = thumb || null;
    }

    res.json(event);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 5. DELETE EVENT + ALL MEDIA FROM MINIO
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Delete all media from MinIO
    const deletePromises = (event.media || []).map((m) =>
      minioClient.removeObject(BUCKET, m.key).catch(() => {})
    );
    await Promise.all(deletePromises);

    await event.remove();
    res.json({ message: "Event and all media deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 6. UPLOAD MEDIA TO EVENT (For existing events)
const uploadEventMedia = async (req, res) => {
  try {
    const { eventId } = req.body;
    const files = req.files;
    if (!files?.length)
      return res.status(400).json({ message: "No files uploaded" });
    if (!eventId)
      return res.status(400).json({ message: "eventId is required" });

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const results = [];

    for (const file of files) {
      const isImage = file.mimetype.startsWith("image/");
      const isVideo = file.mimetype.startsWith("video/");

      const key = `events/${eventId}/${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 5)}-${file.originalname}`;
      await minioClient.putObject(BUCKET, key, file.buffer, file.size, {
        "Content-Type": file.mimetype,
      });

      const mediaObj = {
        key,
        originalName: file.originalname,
        mimeType: file.mimetype,
        mediaType: isImage ? "image" : "video",
        size: file.size,
      };

      event.media.push(mediaObj);
      const url = await getPresignedUrl(key);
      results.push({
        ...mediaObj,
        url,
        _id: event.media[event.media.length - 1]._id, // Auto-generated _id
      });
    }

    await event.save();
    res.status(201).json({ uploaded: results });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 7. SET THUMBNAIL
const setEventThumbnail = async (req, res) => {
  try {
    const { eventId, mediaId } = req.body;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const mediaItem = event.media.id(mediaId);
    if (!mediaItem || mediaItem.mediaType !== "image") {
      return res.status(400).json({ message: "Thumbnail must be an image" });
    }

    event.thumbnailId = mediaId;
    await event.save();

    const url = await getPresignedUrl(mediaItem.key);
    res.json({
      message: "Thumbnail set",
      thumbnail: { _id: mediaId, key: mediaItem.key, url },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  uploadEventMedia,
  setEventThumbnail,
};
