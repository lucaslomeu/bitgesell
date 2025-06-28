const express = require('express');
const fs = require('fs').promises
const path = require('path');
const router = express.Router();

function createItemsRouter(dataPath) {
  // Utility to read data (intentionally sync to highlight blocking issue)
  async function readData() {
    const raw = await fs.readFile(dataPath);
    return JSON.parse(raw);
  }

  async function writeData(data) {
    await fs.writeFile(dataPath, JSON.stringify(data, null, 2), 'utf-8');
  }

  // GET /api/items
  router.get('/', async (req, res, next) => {
    try {
      const { q = '', page = 1, limit = 20 } = req.query;
      const data = await readData();
      let results = data;

      if (q) {
        // Simple substring search (sub‑optimal)
        results = results.filter(item => item.name.toLowerCase().includes(q.toLowerCase()));
      }

      const total = results.length;
      const startPage = (page - 1) * limit;
      const endPage = startPage + parseInt(limit, 10);
      const paginatedResults = results.slice(startPage, endPage);

      res.json({ total, items: paginatedResults });
    } catch (err) {
      next(err);
    }
  });

  // GET /api/items/:id
  router.get('/:id', async (req, res, next) => {
    try {
      const data = await readData();
      const item = data.find(i => i.id === parseInt(req.params.id));
      if (!item) {
        const err = new Error('Item not found');
        err.status = 404;
        throw err;
      }
      res.json(item);
    } catch (err) {
      next(err);
    }
  });

  // POST /api/items
  router.post('/', async (req, res, next) => {
    try {
      const item = req.body;
      const data = await readData();

      const maxId = data.length ? Math.max(...data.map(i => i.id)) : 0;
      item.id = maxId + 1;

      data.push(item);
      await writeData(data);

      res.status(201).json(item);
    } catch (err) {
      next(err);
    }
  });

  return router;
}
module.exports = createItemsRouter;