require("dotenv").config();

const express = require("express");
const cors = require("cors");
const pool = require("./db");
const propertiesRouter = require("./routes/properties");

const app = express();
app.use(cors());
app.use(express.json());


// WEEK 4: log every request with method, URL, status code, and how long it took
app.use((req, res, next) => {
    const st = Date.now();
  
    res.on("finish", () => {
      const dur = Date.now() - st;
      console.log(
        new Date().toISOString() + " " +
        req.method + " " +
        req.originalUrl + " " +
        res.statusCode + " " +
        dur + "ms"
      );
    });
  
    next();
  });

app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", database: "connected" });
  } catch (err) {
    res.status(500).json({ status: "error", database: "disconnected" });
  }
});

app.use("/api/properties", propertiesRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, (err) => {
  if (err) {
    console.error(`Could not start on port ${PORT}:`, err.message);
    process.exit(1);
  }
  console.log(`Server running on port ${PORT}`);
});