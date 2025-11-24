import express from "express";
import { register, login, verifyEmail } from "../services/auth.service.js";

const router = express.Router();

// Router untuk register
router.post("/register", async (req, res) => {
  try {
    // Panggil service register dengan data dari body request
    const newUser = await register(req.body);

    res.status(201).json({
      message: "Registrasi berhasil!",
      data: newUser,
    });
  } catch (error) {
    // Cek apakah error karena duplikat (username/email sama)
    if (
      error.message === "Username atau Email sudah terdaftar!" ||
      error.code === "ER_DUP_ENTRY"
    ) {
      return res
        .status(400)
        .json({ message: "Username atau Email sudah digunakan" });
    }

    res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
});

// Router untuk login
router.post("/login", async (req, res) => {
  try {
    const result = await login(req.body);

    res.json({
      message: "Login berhasil!",
      data: result,
    });
  } catch (error) {
    // Kalau errornya "Email atau Password salah", kasih status 401 (Unauthorized)
    if (error.message === "Email atau Password salah!") {
      return res.status(401).json({ message: error.message });
    }

    res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
});

// Router untuk verifikasi email (GET)
// Endpoint ini yang akan dipanggil saat link di email diklik
// URL: /api/auth/verify-email?token=...
router.get("/verify-email", async (req, res) => {
  try {
    // Ambil token dari Query Params URL (?token=...)
    const { token } = req.query;

    if (!token) return res.status(400).send("Token tidak ada");

    const message = await verifyEmail(token);

    // Karena ini diakses lewat browser, kita kirim text/html aja biar enak dibaca
    res.send(`<h1>${message}</h1><p>Sekarang kamu bisa login!</p>`);
  } catch (error) {
    res.status(400).send(`<h1>Gagal Verifikasi: ${error.message}</h1>`);
  }
});

export default router;
