import "dotenv/config"; // Panggil dotenv
import express from "express";
import cors from "cors";
// Impor koneksi database (buat tes)
import db from "./src/config/db.js";

// impor routes untuk "Daftar Saya"
import listRoutes from "./src/routes/list.routes.js";
// impor routes untuk Autentikasi
import authRoutes from "./src/routes/auth.routes.js";
// import routes untuk "katalog movies"
import movieRoutes from "./src/routes/movie.routes.js";
// import routes untuk "upload gambar"
import uploadRoutes from "./src/routes/upload.routes.js";

const app = express();
const port = 5001;

// Gunakan middleware
app.use(cors()); // Mengizinkan akses dari frontend
app.use(express.json()); // Agar bisa baca body request sbg JSON
app.use("/uploads", express.static("uploads")); // Untuk akses gambar
app.use("/api/upload", uploadRoutes); // Rute untuk Upload gambar
app.use("/api/my-list", listRoutes); // Rute untuk "Daftar Saya"
app.use("/api/auth", authRoutes); // Rute untuk Autentikasi (Register/Login)
app.use("/api/movies", movieRoutes); // Rute Catalog Film (Search, Filter, Sort)

// Endpoint percobaan
app.get("/", (req, res) => {
  res.send("Halo, server Chill Movie jalan!");
});

// Tes koneksi database
app.get("/test-db", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1 + 1 AS solution");
    res.json({
      message: "Koneksi database BERHASIL",
      result: rows[0].solution,
    });
  } catch (error) {
    res.status(500).json({
      message: "Koneksi database GAGAL",
      error: error.message,
    });
  }
});

// Jalankan server
app.listen(port, () => {
  console.log(`Server jalan di http://localhost:${port}`);
});
