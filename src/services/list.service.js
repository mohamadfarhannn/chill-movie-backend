// Impor koneksi database (pool) yang sudah kita buat
import db from "../config/db.js";

/**
 * =======================================================
 * SERVICE UNTUK READ (Membaca "Daftar Saya" milik user)
 * =======================================================
 * Ini akan menjalankan query:
 * SELECT * FROM daftar_saya WHERE user_id = [id-user-kamu]
 */
async function getMyList(userId) {
  try {
    const [rows] = await db.query(
      `SELECT * FROM daftar_saya WHERE user_id = ?`,
      [userId]
    );
    return rows;
  } catch (error) {
    console.error("Error di service getMyList:", error);
    throw new Error("Gagal mengambil data dari database");
  }
}

/**
 * =======================================================
 * SERVICE UNTUK CREATE (Menambah film ke "Daftar Saya")
 * =======================================================
 * Ini akan menjalankan query:
 * INSERT INTO daftar_saya (user_id, content_id, content_type)
 * VALUES ([id-user], [id-film], ['film'])
 */
async function addToList(data) {
  const { userId, contentId, contentType } = data;
  try {
    const [result] = await db.query(
      `INSERT INTO daftar_saya (user_id, content_id, content_type) VALUES (?, ?, ?)`,
      [userId, contentId, contentType || "film"] // Default 'film' jika tidak dispesifikasi
    );

    // Kirim balik ID dari data yang baru saja dibuat
    return { id: result.insertId, ...data };
  } catch (error) {
    console.error("Error di service addToList:", error);
    throw new Error("Gagal menambah data ke database");
  }
}

/**
 * =======================================================
 * SERVICE UNTUK UPDATE (Mengubah status, misal "watched")
 * =======================================================
 * Ini akan menjalankan query:
 * UPDATE daftar_saya SET status = [status-baru] WHERE id = [id-list-kamu]
 */
async function updateStatusInList(listId, status) {
  try {
    const [result] = await db.query(
      `UPDATE daftar_saya SET status = ? WHERE id = ?`,
      [status, listId]
    );

    // Cek apakah ada baris yang benar-benar ter-update
    if (result.affectedRows === 0) {
      throw new Error("Data tidak ditemukan");
    }
    return { id: listId, status: status };
  } catch (error) {
    console.error("Error di service updateStatusInList:", error);
    throw new Error("Gagal mengupdate data di database");
  }
}

/**
 * =======================================================
 * SERVICE UNTUK DELETE (Menghapus film dari "Daftar Saya")
 * =======================================================
 * Ini akan menjalankan query:
 * DELETE FROM daftar_saya WHERE id = [id-list-kamu]
 */
async function deleteFromList(listId) {
  try {
    const [result] = await db.query(`DELETE FROM daftar_saya WHERE id = ?`, [
      listId,
    ]);

    // Cek apakah ada baris yang benar-benar terhapus
    if (result.affectedRows === 0) {
      throw new Error("Data tidak ditemukan");
    }
    return { message: "Data berhasil dihapus" };
  } catch (error) {
    console.error("Error di service deleteFromList:", error);
    throw new Error("Gagal menghapus data dari database");
  }
}

// Ekspor semua fungsi ini agar bisa dipakai di file lain (routes)
export { getMyList, addToList, updateStatusInList, deleteFromList };
