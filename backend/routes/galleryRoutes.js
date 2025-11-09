// routes/gallery.js
const express = require("express");
const router = express.Router();
const {
  getAllGallery,
  uploadToGallery,
  updateGalleryItem,
  deleteGalleryItem,
} = require("../controllers/galleryController");
const { authenticate } = require("../middleware/auth");
const upload = require("../utils/upload");

router.get("/", getAllGallery); // GET /api/gallery (all with filters)
router.post(
  "/upload",
  authenticate,
  upload.array("files", 10),
  uploadToGallery
); // POST /api/gallery/upload
router.patch("/:id", authenticate, updateGalleryItem); // PATCH /api/gallery/:id
router.delete("/:id", authenticate, deleteGalleryItem); // DELETE /api/gallery/:id

module.exports = router;
