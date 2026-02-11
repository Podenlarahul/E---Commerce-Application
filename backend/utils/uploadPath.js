const path = require("path");

const isProduction = process.env.NODE_ENV === "production";

const UPLOADS_DIR = isProduction
  ? path.join("/tmp", "uploads")
  : path.join(__dirname, "..", "uploads");

const getStoredFilename = (value = "") => {
  if (!value) return "";
  return path.basename(value);
};

const getUploadFilePath = (value = "") => {
  return path.join(UPLOADS_DIR, getStoredFilename(value));
};

module.exports = {
  UPLOADS_DIR,
  getStoredFilename,
  getUploadFilePath,
};
