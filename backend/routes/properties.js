const express = require("express");
const pool = require("../db");

const router = express.Router();

const allowed = ["city", "zipcode", "minPrice", "maxPrice", "beds", "baths", "limit", "offset"];

router.get("/", async (req, res) => {
  try {
    for (const key of allowed) {
      if (req.query[key] !== undefined && typeof req.query[key] !== "string") {
        return res.status(400).json({ error: `${key} can only be provided once` });
      }
    }

    let limit;
    if (req.query.limit === undefined) {
      limit = 20;
    } else {
      limit = Number(req.query.limit);
    }

    let offset;
    if (req.query.offset === undefined) {
      offset = 0;
    } else {
      offset = Number(req.query.offset);
    }

    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      return res.status(400).json({ error: "limit must be a whole number between 1 and 100" });
    }

    if (!Number.isInteger(offset) || offset < 0) {
      return res.status(400).json({ error: "offset must be a whole number 0 or greater" });
    }

    const conditions = [];
    const values = [];

    if (req.query.city) {
      const city = req.query.city.trim();
      if (city.length === 0 || city.length > 100) {
        return res.status(400).json({ error: "city must be between 1 and 100 characters" });
      }
      conditions.push("LOWER(TRIM(L_City)) = LOWER(TRIM(?))");
      values.push(city);
    }

    let minPrice;
    if (req.query.minPrice) {
      minPrice = Number(req.query.minPrice);
      if (isNaN(minPrice) || minPrice < 0) {
        return res.status(400).json({ error: "minPrice must be a number 0 or greater" });
      }
      conditions.push("L_SystemPrice >= ?");
      values.push(minPrice);
    }

    if (req.query.maxPrice) {
      const maxPrice = Number(req.query.maxPrice);
      if (isNaN(maxPrice) || maxPrice < 0) {
        return res.status(400).json({ error: "maxPrice must be a number 0 or greater" });
      }
      if (minPrice !== undefined && minPrice > maxPrice) {
        return res.status(400).json({ error: "minPrice cannot be greater than maxPrice" });
      }
      conditions.push("L_SystemPrice <= ?");
      values.push(maxPrice);
    }

    if (req.query.zipcode) {
      const zipcode = req.query.zipcode.trim();
      if (!/^\d{5}$/.test(zipcode)) {
        return res.status(400).json({ error: "zipcode must be a 5 digit number" });
      }
      conditions.push("L_Zip = ?");
      values.push(zipcode);
    }

    if (req.query.beds) {
      const beds = Number(req.query.beds);
      if (!Number.isInteger(beds) || beds < 0) {
        return res.status(400).json({ error: "beds must be a whole number 0 or greater" });
      }
      conditions.push("L_Keyword2 >= ?");
      values.push(beds);
    }

    if (req.query.baths) {
      const baths = Number(req.query.baths);
      if (isNaN(baths) || baths < 0) {
        return res.status(400).json({ error: "baths must be a number 0 or greater" });
      }
      conditions.push("LM_Dec_3 >= ?");
      values.push(baths);
    }

    let where;
    if (conditions.length > 0) {
      where = "WHERE " + conditions.join(" AND ");
    } else {
      where = "";
    }

    const [countRows] = await pool.query(
      `SELECT COUNT(*) AS total FROM rets_property ${where}`,
      values
    );
    const total = countRows[0].total;

    const [rows] = await pool.query(
      `SELECT * FROM rets_property ${where} ORDER BY L_ListingID LIMIT ? OFFSET ?`,
      [...values, limit, offset]
    );

    res.json({ total, limit, offset, results: rows });
  } catch (err) {
    console.error("GET /api/properties failed:", err);
    res.status(500).json({ error: "Failed to fetch properties" });
  }
});


//Week 4: get all open houses for one property
router.get("/:id/openhouses", async (req, res) => {
    try {
    // Grab the house ID from the URL
      const id = req.params.id;


      //// Validate ID, if it has weird symbols or is too long, send a 400 and stop
      if (!/^[A-Za-z0-9-]{1,50}$/.test(id)) {
        return res.status(400).json({ error: "Listing ID must be 1-50 letters, numbers, or dashes" });
      }

       // Check if the property exists
      const [matches] = await pool.query(
        "SELECT L_ListingID FROM rets_property WHERE L_ListingID = ?",
        [id]
      );
  
      // Send a 404 if the property doesn't exist
      if (matches.length === 0) {
        return res.status(404).json({ error: 'No property found with given ID' });
      }

      // Get this property's open houses sorted by date and start time
      const [openHouses] = await pool.query(
        "SELECT * FROM rets_openhouse WHERE L_ListingID = ? ORDER BY OpenHouseDate, OH_StartTime",
        [id]
      );

      // Send back the list, empty list = no open houses
      res.json(openHouses);
    } catch (err) {

    // Print the error in the terminal and tell the user something broke
      console.log("GET /api/properties/:id/openhouses failed:", err);
      res.status(500).json({ error: "Failed to fetch open houses" });
    }
  });




// WEEK 4: get one property by ID
router.get("/:id", async (req, res) => {
    try {
        // Grab the property ID from the URL
        const id = req.params.id;

        // Send a 400 if the ID has weird symbols or is too long
        if (!/^[A-Za-z0-9-]{1,50}$/.test(id)) {
            return res.status(400).json({ error: "Listing ID must be 1-50 letters, numbers, or dashes" });
          }

        // Get all info about the property with this ID
        const [matches] = await pool.query(
            "SELECT * FROM rets_property WHERE L_ListingID = ?",
            [id]
        );

        // Send a 404 if the property doesn't exist
        if (matches.length === 0) {
            return res.status(404).json({ error: `No property found with ID given` });

        }
        // Send back the property
        res.json(matches[0]);
  
    } catch (err) {
        
        // Print the error in the terminal and tell the user something broke
        console.log("GET /api/properties/:id failed:", err);
        res.status(500).json({ error: "Failed to fetch property" });
    }
  });


module.exports = router;