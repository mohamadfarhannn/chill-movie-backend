import express from "express";
import upload from "../services/upload.service.js"; // Import konfigurasi tadi

const router = express.Router();

// Endpoint Upload
// 'file' adalah nama key yang nanti kita pakai di Postman
router.post("/", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Tidak ada file yang diupload" });
    }

    // Buat URL biar gambarnya bisa diakses
    // Contoh: http://localhost:5001/uploads/17491293-gambar.jpg
    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${
      req.file.filename
    }`;

    res.json({
      message: "Upload berhasil!",
      file_url: fileUrl,
      filename: req.file.filename,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
