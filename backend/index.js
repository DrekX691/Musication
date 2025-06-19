




























































// backend/index.js
require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
let access_token = "";

async function refreshToken() {
  const response = await axios.post(
    "https://accounts.spotify.com/api/token",
    new URLSearchParams({
      grant_type: "client_credentials",
    }),
    {
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  access_token = response.data.access_token;
  console.log("✅ Spotify token frissítve");
}

app.get("/track/:id", async (req, res) => {
  const trackId = req.params.id;
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/tracks/${trackId}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    const { name, artists, external_urls } = response.data;
    res.json({
      name,
      artist: artists.map((a) => a.name).join(", "),
      url: external_urls.spotify,
    });
  } catch (error) {
    res.status(500).json({ error: "Nem sikerült lekérni a dalt." });
  }
});

refreshToken();
setInterval(refreshToken, 1000 * 60 * 60);

const PORT = process.env.PORT || 8888;
app.listen(PORT, () => {
  console.log(`🚀 Backend elindult: http://localhost:${PORT}`);
});
// Példa backend fájl