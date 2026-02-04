import express from "express";
import path from "path";
import fetch from "node-fetch";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve the React build
app.use(express.static(path.join(__dirname, "dist")));

// Proxy HK GeoData vector tiles
app.get("/hkmap/*", async (req, res) => {
  try {
    const targetUrl =
      "https://mapapi.geodata.gov.hk" + req.originalUrl.replace("/hkmap", "");

    const response = await fetch(targetUrl);

    if (!response.ok) {
      return res.status(response.status).send("Tile fetch failed");
    }

    // Required headers for vector tiles
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Content-Type", "application/x-protobuf");

    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).send("Proxy error");
  }
});

// SPA fallback for React Router
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
