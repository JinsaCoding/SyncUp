// server.js
const express = require("express");
const app = express();
app.use(express.json());

const tokenStore = {}; // In production, use a real database

app.post("/register-token", (req, res) => {
  const { userId, token } = req.body;
  tokenStore[userId] = token;
  res.json({ success: true });
});

app.post("/notify", async (req, res) => {
  const { friendIds, message } = req.body;
  const tokens = friendIds.map((id) => tokenStore[id]).filter(Boolean);

  await fetch("https://exp.host/--/expogoer/push/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(
      tokens.map((token) => ({
        to: token,
        title: "SynchUp",
        body: message,
      })),
    ),
  });

  res.json({ success: true });
});

app.listen(3000, () => console.log("Server running on port 3000"));
