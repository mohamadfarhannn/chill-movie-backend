import db from "../config/db.js";

async function getMovies(queryParams) {
  // Ambil parameter dari URL (misal: ?search=avatar&year=2024&sort=title)
  const { search, year, sort } = queryParams;

  // Query dasar
  let sql = "SELECT * FROM items";
  const values = [];
  const conditions = [];

  // --- LOGIKA SEARCH (Mencari berdasarkan judul) ---
  if (search) {
    conditions.push("title LIKE ?");
    values.push(`%${search}%`); // %avatar% artinya mengandung kata avatar
  }

  // --- LOGIKA FILTER (Filter berdasarkan tahun rilis) ---
  // Kita pakai kolom 'release_date_year' yang sudah ada di tabel items
  if (year) {
    conditions.push("release_date_year = ?");
    values.push(year);
  }

  // Gabungkan kondisi WHERE jika ada
  if (conditions.length > 0) {
    sql += " WHERE " + conditions.join(" AND ");
  }

  // --- LOGIKA SORT (Mengurutkan data) ---
  // Defaultnya urutkan berdasarkan ID kalau tidak ada request sort
  if (sort === "title") {
    sql += " ORDER BY title ASC"; // A-Z
  } else if (sort === "year") {
    sql += " ORDER BY release_date_year DESC"; // Tahun terbaru dulu
  } else {
    sql += " ORDER BY id ASC";
  }

  // Jalankan Query
  try {
    const [rows] = await db.query(sql, values);
    return rows;
  } catch (error) {
    console.error("Error di getMovies service:", error);
    throw error;
  }
}

export { getMovies };
