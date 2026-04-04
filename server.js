import express from "express";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve frontend
app.use(express.static(path.join(__dirname, "public")));

// API route
app.get("/camera/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const response = await fetch(
      `http://123.176.36.146:9090/cameraserver/images/${id}.jpg`
    );

    if (!response.ok) {
      return res.status(404).send("Image not found");
    }

    const buffer = await response.arrayBuffer();

    res.set("Content-Type", "image/jpeg");
    res.send(Buffer.from(buffer));
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching image");
  }
});

// fallback route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});