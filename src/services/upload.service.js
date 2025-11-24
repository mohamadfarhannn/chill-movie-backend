import multer from "multer";
import path from "path";

// Konfigurasi Penyimpanan (Storage)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Tentukan folder penyimpanan
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // Buat nama file unik biar gak bentrok
    // Format: timestamp-namafileasli.jpg
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// Filter File (Opsional: Cuma boleh gambar)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Hanya boleh upload file gambar!"), false);
  }
};

// Inisialisasi Multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // Maksimal 5MB
  fileFilter: fileFilter,
});

export default upload;
