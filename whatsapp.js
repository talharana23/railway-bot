const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode");

let qrImage = null;
let isReady = false;

const client = new Client({
  authStrategy: new LocalAuth({ dataPath: "./session" }),
  puppeteer: {
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--single-process"
    ]
  }
});

client.on("qr", async (qr) => {
  qrImage = await qrcode.toDataURL(qr);
});

client.on("ready", () => {
  isReady = true;
  console.log("WhatsApp Ready");
});

client.initialize();

async function sendMessage(number, message) {
  const chatId = number + "@c.us";
  return client.sendMessage(chatId, message);
}

async function sendBulk(numbers, message) {
  for (let num of numbers) {
    await sendMessage(num, message);
  }
}

module.exports = {
  client,
  getQR: () => qrImage,
  getStatus: () => (isReady ? "connected" : "disconnected"),
  sendBulk
};