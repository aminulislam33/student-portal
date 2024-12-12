const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
    cloud_name: "",
    api_key: "",
    api_secret: ""
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