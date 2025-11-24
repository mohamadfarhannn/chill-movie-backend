import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  // 1. Ambil header Authorization dari request
  // Biasanya formatnya: "Bearer <tokenmu>"
  const authHeader = req.headers["authorization"];

  // 2. Kita ambil tokennya saja (buang kata 'Bearer ')
  // Kalau authHeader ada, kita split. Kalau gak ada, jadi undefined.
  const token = authHeader && authHeader.split(" ")[1];

  // 3. Kalau token gak ada, tolak akses!
  if (!token) {
    return res.status(401).json({
      message: "Akses ditolak! Kamu belum login (Token tidak ada).",
    });
  }

  // 4. Verifikasi tokennya
  // 'rahasia_negara' harus SAMA PERSIS dengan yang di auth.service.js
  jwt.verify(token, "rahasia_negara", (err, user) => {
    if (err) {
      return res.status(403).json({
        message: "Token tidak valid atau sudah kadaluarsa!",
      });
    }

    // 5. Kalau valid, simpan data user ke dalam request
    // Biar nanti di controller kita tau siapa yang lagi akses
    req.user = user;

    // 6. Lanjut ke fungsi berikutnya (Controller)
    next();
  });
};
