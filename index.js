const express = require("express");
const app = express();

const bot = require("./baileys");
const qrcode = require("qrcode");

app.get("/", (req, res) => {
  res.send("Bot is running 🚀");
});

app.get("/qr", async (req, res) => {
  const qr = bot.getQR();

  if (!qr) {
    return res.send("No QR available (already connected or not generated yet)");
  }

  const qrImage = await qrcode.toDataURL(qr);
  res.send(`<img src="${qrImage}" />`);
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log("Server running on " + PORT);
});