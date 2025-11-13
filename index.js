import "dotenv/config"; // Panggil dotenv
import express from "express";
import cors from "cors";
// Impor koneksi database (buat tes)
import db from "./src/config/db.js";

// impor routes untuk "Daftar Saya"
import listRoutes from "./src/routes/list.routes.js";

const app = express();
const port = 5001;

// Gunakan middleware
app.use(cors()); // Mengizinkan akses dari frontend
app.use(express.json()); // Agar bisa baca body request sbg JSON
app.use("/api/my-list", listRoutes); // Rute untuk "Daftar Saya"

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
