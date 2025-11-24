import jwt from "jsonwebtoken";
import db from "../config/db.js";
import bcrypt from "bcrypt";
// Penerapan nodemailer
import { v4 as uuidv4 } from "uuid"; // Import UUID
import { sendVerificationEmail } from "./mail.service.js";

// Fungsi untuk Register
async function register(data) {
  // Ambil data dari inputan user
  const { fullname, username, email, password } = data;

  try {
    // 1. Cek dulu apakah username atau email sudah pernah dipakai (Optional, tapi bagus)
    // (Database sebenernya udah jagain pake UNIQUE, tapi ini buat UX yg lebih baik)
    const [existingUsers] = await db.query(
      "SELECT * FROM users WHERE username = ? OR email = ?",
      [username, email]
    );

    if (existingUsers.length > 0) {
      throw new Error("Username atau Email sudah terdaftar!");
    }

    // 2. Enkripsi Password (Hashing)
    // Angka 10 adalah "salt rounds" (kekuatan enkripsi)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate Token Unik
    const emailToken = uuidv4();

    // 3. Masukkan ke Database
    const [result] = await db.query(
      `INSERT INTO users (fullname, username, email, password, email_token) VALUES (?, ?, ?, ?, ?)`,
      [fullname, username, email, hashedPassword, emailToken]
    );

    // Kirim Email (Jalankan di background aja biar register gak nungguin email)
    sendVerificationEmail(email, emailToken).catch((err) => {
      console.error(
        "Gagal kirim email background, tapi user tetap tersimpan:",
        err.message
      );
    });

    // Kembalikan data user yang baru dibuat (tanpa password)
    return {
      id: result.insertId,
      fullname,
      username,
      email,
      message: "Silakan cek email untuk verifikasi!",
    };
  } catch (error) {
    console.error("Error di service register:", error);
    // Lempar error biar ditangkap sama Route
    throw error;
  }
}

// Fungsi Verifikasi Email
async function verifyEmail(token) {
  // 1. Cari user yang punya token tersebut
  const [users] = await db.query("SELECT * FROM users WHERE email_token = ?", [
    token,
  ]);

  if (users.length === 0) {
    throw new Error("Invalid Verification Token"); // [cite: 83]
  }

  const user = users[0];

  // 2. Update user: Hapus tokennya & set is_verified jadi true (1)
  await db.query(
    "UPDATE users SET email_token = NULL, is_verified = 1 WHERE id = ?",
    [user.id]
  );

  return "Email Verified Successfully";
}

// Fungsi untuk login
async function login(data) {
  const { email, password } = data;

  // 1. Cari user berdasarkan email
  const [users] = await db.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);

  // Kalau user tidak ditemukan
  if (users.length === 0) {
    throw new Error("Email atau Password salah!");
  }

  const user = users[0];

  // 2. Cek Password (Bandingkan password inputan vs password hash di DB)
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Email atau Password salah!");
  }

  // 3. Kalau sukses, Buat Token (Tiket Masuk)
  // Payload: Data yang disimpan dalam token (misal id & username)
  // Secret Key: 'rahasia_negara' (Nanti sebaiknya taruh di .env)
  // ExpiresIn: Token berlaku 1 jam
  const token = jwt.sign(
    { id: user.id, username: user.username },
    "rahasia_negara",
    { expiresIn: "1h" }
  );

  return {
    user: {
      id: user.id,
      fullname: user.fullname,
      email: user.email,
    },
    token, // Kirim tokennya ke frontend/postman
  };
}

export { register, login, verifyEmail };
