import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, './uploads/'), // Folder location
  filename: (req, file, cb) => {
    const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniquePrefix + '-' + file.originalname);
  }
});

export const upload = multer({ storage }) ;