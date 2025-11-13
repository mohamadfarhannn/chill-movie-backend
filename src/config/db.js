// Impor library dotenv untuk membaca file .env
import "dotenv/config";

// Impor library mysql2
import mysql from "mysql2/promise";

// Buat konfigurasi koneksi
const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
};

// Buat "kumpulan koneksi" (Connection Pool)
const pool = mysql.createPool(dbConfig);

// Ekspor pool-nya agar bisa dipakai file lain
export default pool;
