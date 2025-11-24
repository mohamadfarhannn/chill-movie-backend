import express from "express";
import { getMovies } from "../services/movie.service.js";

// Import middleware Auth (OPSIONAL)
// Kalau endpoint ini mau dibikin PUBLIC (siapa aja bisa lihat), gak usah pake verifyToken.
// Tapi kalau instruksinya harus login dulu, uncomment baris bawah ini:
// import { verifyToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

// GET /api/movies
router.get("/", async (req, res) => {
  try {
    // Kirim req.query (isi parameter URL) ke service
    const movies = await getMovies(req.query);

    res.json({
      message: "Berhasil mengambil data film",
      data: movies,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
});

export default router;
