const express = require('express');
const pool = require('../db');
const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM wars ORDER BY year_start');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
