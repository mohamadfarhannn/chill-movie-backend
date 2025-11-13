import express from "express";

// Impor ke-4 fungsi service yang sudah kita buat
import {
  getMyList,
  addToList,
  updateStatusInList,
  deleteFromList,
} from "../services/list.service.js";

// Buat router baru
const router = express.Router();

/*
 * =======================================================
 * ROUTE UNTUK READ (GET)
 * =======================================================
 * Method: GET
 * URL: /api/my-list/:userId
 * Tugas: Mengambil semua list milik satu user
 */
router.get("/:userId", async (req, res) => {
  try {
    // 1. Ambil userId dari parameter URL
    const userId = req.params.userId;

    // 2. Panggil service
    const list = await getMyList(userId);

    // 3. Kirim respon sukses
    res.json({
      message: "Berhasil mengambil data list",
      data: list,
    });
  } catch (error) {
    // 3. Kirim respon error
    res.status(500).json({ message: error.message });
  }
});

/*
 * =======================================================
 * ROUTE UNTUK CREATE (POST)
 * =======================================================
 * Method: POST
 * URL: /api/my-list/
 * Tugas: Menambah item baru ke list
 */
router.post("/", async (req, res) => {
  try {
    // 1. Ambil data (userId, contentId) dari body request
    const data = req.body;

    // 2. Panggil service
    const newListEntry = await addToList(data);

    // 3. Kirim respon sukses
    res.status(201).json({
      // 201 artinya "Created"
      message: "Berhasil menambah data ke list",
      data: newListEntry,
    });
  } catch (error) {
    // 3. Kirim respon error
    res.status(500).json({ message: error.message });
  }
});

/*
 * =======================================================
 * ROUTE UNTUK UPDATE (PATCH)
 * =======================================================
 * Method: PATCH
 * URL: /api/my-list/:listId
 * Tugas: Mengubah status (misal jadi 'watched')
 */
router.patch("/:listId", async (req, res) => {
  try {
    // 1. Ambil listId dari parameter URL
    const listId = req.params.listId;
    // 2. Ambil status baru dari body request
    const status = req.body.status;

    // Validasi simpel
    if (!status) {
      return res.status(400).json({ message: "Status wajib diisi" });
    }

    // 3. Panggil service
    const updatedData = await updateStatusInList(listId, status);

    // 4. Kirim respon sukses
    res.json({
      message: "Berhasil mengupdate status",
      data: updatedData,
    });
  } catch (error) {
    // 4. Kirim respon error
    res.status(500).json({ message: error.message });
  }
});

/*
 * =======================================================
 * ROUTE UNTUK DELETE (DELETE)
 * =======================================================
 * Method: DELETE
 * URL: /api/my-list/:listId
 * Tugas: Menghapus item dari list
 */
router.delete("/:listId", async (req, res) => {
  try {
    // 1. Ambil listId dari parameter URL
    const listId = req.params.listId;

    // 2. Panggil service
    await deleteFromList(listId);

    // 3. Kirim respon sukses (tidak perlu kirim data, cuma pesan)
    res.json({
      message: "Data berhasil dihapus dari list",
    });
  } catch (error) {
    // 3. Kirim respon error
    res.status(500).json({ message: error.message });
  }
});

// Ekspor router-nya agar bisa dipakai di index.js
export default router;
