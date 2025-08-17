// const cloudinary = require('cloudinary').v2;
// const { CloudinaryStorage } = require('multer-storage-cloudinary');
// // const { CloudinaryStorage } = require("@fluidjs/multer-cloudinary");



// cloudinary.config({
//     cloud_name: process.env.CLOUD_NAME,
//     api_key: process.env.CLOUD_API_KEY,
//     api_secret: process.env.CLOUD_API_SECRET
// });

// const storage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//         folder: 'wanderlust_dev',
//         allowedFormats: ["png", "jpg", "jpeg"],
//     },
// });

// // const storage = new CloudinaryStorage({
// //   cloudinary: cloudinary,
// //   params: async (req, file) => {
// //     return {
// //       folder: "wanderlust_dev",
// //       allowed_formats: ["png", "jpg", "jpeg"], // ✅ correct key
// //       public_id: file.originalname.split(".")[0], // optional custom file name
// //     };
// //   },
// // });

// module.exports ={
//     cloudinary,
//     storage
// };