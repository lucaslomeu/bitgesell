const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const DATA_PATH = path.join(__dirname, '../../data/items.json');

const CACHE_TTL_MS = 1000 * 60;

let statsCache = null;
let cacheTimestamp = 0;

// Utility to read and calc stats
function calculateStats(callback) {
  fs.readFile(DATA_PATH, (err, raw) => {
    if (err) return callback(err);

    const items = JSON.parse(raw);
    const stats = {
      total: items.length,
      averagePrice: items.reduce((acc, cur) => acc + cur.price, 0) / items.length
    }

    statsCache = stats;

    cacheTimestamp = Date.now();
    callback(null, stats);
  });
}

// GET /api/stats
router.get('/', (req, res, next) => {
  const now = Date.now();

  if (statsCache && (now - cacheTimestamp < CACHE_TTL_MS)) {
    return res.json(statsCache);
  }

  calculateStats((err, stats) => {
    if (err) return next(err);
    res.json(stats);
  });
});

module.exports = router;