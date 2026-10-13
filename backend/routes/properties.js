const express = require("express");
const pool = require("../db");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const limit = req.query.limit === undefined ? 20 : Number(req.query.limit);
    const offset = req.query.offset === undefined ? 0 : Number(req.query.offset);

    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      return res.status(400).json({ error: "limit must be a whole number between 1 and 100" });
    }

    if (!Number.isInteger(offset) || offset < 0) {
      return res.status(400).json({ error: "offset must be a whole number 0 or greater" });
    }

    const conditions = [];
    const values = [];

    if (req.query.city) {
      conditions.push("LOWER(TRIM(L_City)) = LOWER(TRIM(?))");
      values.push(req.query.city);
    }

    if (req.query.minPrice) {
      const minPrice = Number(req.query.minPrice);
      if (isNaN(minPrice) || minPrice < 0) {
        return res.status(400).json({ error: "minPrice must be a positive number" });
      }
      conditions.push("L_SystemPrice >= ?");
      values.push(minPrice);
    }

    if (req.query.maxPrice) {
      const maxPrice = Number(req.query.maxPrice);
      if (isNaN(maxPrice) || maxPrice < 0) {
        return res.status(400).json({ error: "maxPrice must be a positive number" });
      }
      conditions.push("L_SystemPrice <= ?");
      values.push(maxPrice);
    }

    if (req.query.zipcode) {
      conditions.push("L_Zip = ?");
      values.push(req.query.zipcode);
    }

    if (req.query.beds) {
      const beds = Number(req.query.beds);
      if (isNaN(beds) || beds < 0) {
        return res.status(400).json({ error: "beds must be a positive number" });
      }
      conditions.push("L_Keyword2 >= ?");
      values.push(beds);
    }

    if (req.query.baths) {
      const baths = Number(req.query.baths);
      if (isNaN(baths) || baths < 0) {
        return res.status(400).json({ error: "baths must be a positive number" });
      }
      conditions.push("LM_Dec_3 >= ?");
      values.push(baths);
    }

    const where = conditions.length > 0 ? "WHERE " + conditions.join(" AND ") : "";

    const [countRows] = await pool.query(
      `SELECT COUNT(*) AS total FROM rets_property ${where}`,
      values
    );
    const total = countRows[0].total;

    const [rows] = await pool.query(
      `SELECT * FROM rets_property ${where} LIMIT ? OFFSET ?`,
      [...values, limit, offset]
    );

    res.json({ total, limit, offset, results: rows });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch properties" });
  }
});

module.exports = router;