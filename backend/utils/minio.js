// utils/minio.js
const MinIO = require("minio");

const minioClient = new MinIO.Client({
  endPoint: process.env.MINIO_ENDPOINT || "localhost",
  port: Number(process.env.MINIO_PORT) || 9000,
  useSSL: process.env.MINIO_USE_SSL === "true",
  accessKey: process.env.MINIO_ACCESS_KEY || "minioadmin",
  secretKey: process.env.MINIO_SECRET_KEY || "minioadmin",
});

const BUCKET = process.env.MINIO_BUCKET || "events";

minioClient.bucketExists(BUCKET, (err, exists) => {
  if (err) return console.error(err);
  if (!exists) {
    minioClient.makeBucket(BUCKET, "", (err) => {
      if (err) console.error("Failed to create bucket:", err);
      else console.log(`Bucket ${BUCKET} created`);
    });
  }
});

const getPresignedUrl = (key, expires = 3600) =>
  minioClient.presignedGetObject(BUCKET, key, expires);

module.exports = { minioClient, BUCKET, getPresignedUrl };
