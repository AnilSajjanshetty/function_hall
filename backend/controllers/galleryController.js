// controllers/galleryController.js
const Gallery = require("../models/Gallery");
const { minioClient, BUCKET, getPresignedUrl } = require("../utils/minio");

// Helper: Attach presigned URL to item
const attachUrl = async (item) => ({
  ...item,
  url: await getPresignedUrl(item.key),
});

// 1. GET ALL GALLERY (with search, type, pagination)
const getAllGallery = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      type,
      sort = "createdAt",
      order = "desc",
    } = req.query;

    const filter = {};

    if (type === "image") filter.mediaType = "image";
    if (type === "video") filter.mediaType = "video";
    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [{ title: regex }, { tags: regex }];
    }

    const sortObj = {};
    sortObj[sort] = order === "desc" ? -1 : 1;

    const items = await Gallery.find(filter)
      .sort(sortObj)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean();

    const results = await Promise.all(items.map(attachUrl));

    const total = await Gallery.countDocuments(filter);

    res.json({
      gallery: results,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 2. UPLOAD TO GALLERY (bulk, with titles/tags)
const uploadToGallery = async (req, res) => {
  try {
    const files = req.files;
    if (!files?.length)
      return res.status(400).json({ message: "No files uploaded" });

    let titles = [],
      tagsArray = [];
    try {
      titles = req.body.titles ? JSON.parse(req.body.titles) : [];
      tagsArray = req.body.tags ? JSON.parse(req.body.tags) : [];
    } catch (e) {
      return res
        .status(400)
        .json({ message: "titles and tags must be JSON arrays" });
    }

    if (!Array.isArray(titles) || titles.length !== files.length)
      return res
        .status(400)
        .json({ message: "titles array must match file count" });

    const results = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const title = titles[i]?.trim();
      if (!title)
        return res
          .status(400)
          .json({ message: `Title required for file ${i + 1}` });

      const isImage = file.mimetype.startsWith("image/");
      const isVideo = file.mimetype.startsWith("video/");
      if (!isImage && !isVideo)
        return res
          .status(400)
          .json({ message: `Invalid type: ${file.originalname}` });

      const key = `gallery/${Date.now()}-${i}-${file.originalname}`;
      await minioClient.putObject(BUCKET, key, file.buffer, file.size, {
        "Content-Type": file.mimetype,
      });

      const tags = Array.isArray(tagsArray[i])
        ? tagsArray[i].map((t) => t.trim()).filter(Boolean)
        : [];

      const item = await Gallery.create({
        key,
        title,
        originalName: file.originalname,
        mimeType: file.mimetype,
        mediaType: isImage ? "image" : "video",
        size: file.size,
        uploadedBy: req.user.id,
        tags,
      });

      const url = await getPresignedUrl(key);
      results.push({ ...item.toObject(), url });
    }

    res.status(201).json({ uploaded: results });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 3. UPDATE GALLERY ITEM (title, tags only)
const updateGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, tags } = req.body;

    const item = await Gallery.findByIdAndUpdate(
      id,
      {
        title: title?.trim(),
        tags: tags
          ? tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : undefined,
      },
      { new: true, runValidators: true }
    ).lean();

    if (!item)
      return res.status(404).json({ message: "Gallery item not found" });

    const updatedItem = await attachUrl(item);
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 4. DELETE GALLERY ITEM + MINIO
const deleteGalleryItem = async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });

    await minioClient.removeObject(BUCKET, item.key);
    await item.remove();
    res.json({ message: "Gallery item and file deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllGallery,
  uploadToGallery,
  updateGalleryItem,
  deleteGalleryItem,
};
