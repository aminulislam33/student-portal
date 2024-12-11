const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
    cloud_name: "dwr8472qb",
    api_key: "872674654568337",
    api_secret: "c3968uQj-l8n4EDCQaBjxrQC40g",
  });
  
  const cloudinaryStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "profile_pictures",
      allowed_formats: ["jpg", "jpeg", "png"],
    },
  });
  
const uploadToCloudinary = multer({ storage: cloudinaryStorage });

module.exports = uploadToCloudinary;