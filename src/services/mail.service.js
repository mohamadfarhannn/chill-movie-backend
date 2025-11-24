import nodemailer from "nodemailer";
import "dotenv/config";

// 1. Setup Transporter (Tukang Pos)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // Kita set host manual
  port: 587, // Pakai port 587 (TLS) jangan 465
  secure: false, // false untuk port 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // App Password kamu
  },
});

// 2. Fungsi Kirim Email
export const sendVerificationEmail = async (toEmail, token) => {
  // Link yang nanti diklik user (ini endpoint verifikasi kita)
  const verificationLink = `http://localhost:5001/api/auth/verify-email?token=${token}`;

  const mailOptions = {
    from: '"Chill Movie Admin" <no-reply@chillmovie.com>',
    to: toEmail,
    subject: "Verifikasi Akun Chill Movie Kamu",
    html: `
      <h3>Halo! Terima kasih sudah mendaftar.</h3>
      <p>Silakan klik link di bawah ini untuk memverifikasi akun kamu:</p>
      <a href="${verificationLink}">Verifikasi Email Saya</a>
      <p>Atau copy link ini: ${verificationLink}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email verifikasi terkirim ke: " + toEmail);
  } catch (error) {
    console.error("Gagal kirim email:", error);
    throw new Error("Gagal mengirim email verifikasi");
  }
};
