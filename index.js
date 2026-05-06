const express = require("express");
const cors = require("cors");
const path = require("path");

const { getQR, getStatus, sendBulk, client } = require("./whatsapp");

const app = express();

app.use(cors());
app.use(express.json());

// ---------------- SERVE FRONTEND ----------------
app.use(express.static(path.join(__dirname, "dist")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// ---------------- API ----------------
let contacts = [];

app.get("/status", (req, res) => {
  res.json({ status: getStatus() });
});

app.get("/qr", (req, res) => {
  res.json({ qr: getQR() });
});

app.post("/add-contact", (req, res) => {
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(400).json({
      success: false,
      message: "Name and number required"
    });
  }

  const exists = contacts.find(c => c.number === number);
  if (exists) {
    return res.status(400).json({
      success: false,
      message: "Contact already exists"
    });
  }

  contacts.push({ name, number });

  res.json({ success: true, contacts });
});

app.get("/contacts", (req, res) => {
  res.json({ contacts });
});

app.post("/delete-contact", (req, res) => {
  const { number } = req.body;

  contacts = contacts.filter(c => c.number !== number);

  res.json({ success: true, contacts });
});

app.post("/send-bulk", async (req, res) => {
  try {
    const { numbers, message } = req.body;
    await sendBulk(numbers, message);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/logout-whatsapp", async (req, res) => {
  try {
    if (client) await client.logout();

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- START SERVER ----------------
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on " + PORT);
});