const express = require('express');
const pool = require('../db');
const router = express.Router();

const BASE_SELECT = `
  SELECT s.*, w.name AS war_name, a.name AS award_name,
         COALESCE(
           (SELECT json_agg(src.url) FROM sources src WHERE src.soldier_id = s.id),
           '[]'
         ) AS sources
  FROM soldiers s
  LEFT JOIN wars w ON s.war_id = w.id
  LEFT JOIN awards a ON s.award_id = a.id
`;

// GET /api/soldiers?search=basantar&award=Param Vir Chakra&war=4
router.get('/', async (req, res, next) => {
  try {
    const { search, award, war } = req.query;
    let query = BASE_SELECT + ' WHERE 1=1';
    const params = [];

    if (search) {
      params.push(`%${search.toLowerCase()}%`);
      query += ` AND (LOWER(s.name) LIKE $${params.length} OR LOWER(s.regiment) LIKE $${params.length} OR LOWER(s.operation) LIKE $${params.length})`;
    }
    if (award) {
      params.push(award);
      query += ` AND a.name = $${params.length}`;
    }
    if (war) {
      params.push(war);
      query += ` AND s.war_id = $${params.length}`;
    }

    query += ' ORDER BY s.date_of_action';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const result = await pool.query(BASE_SELECT + ' WHERE s.id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Profile not found' });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

router.post('/:id/report-correction', async (req, res, next) => {
  try {
    const { message, submittedBy } = req.body;
    if (!message || message.trim().length < 5) {
      return res.status(400).json({ error: 'Please describe the correction (min 5 characters).' });
    }

    const soldier = await pool.query('SELECT id FROM soldiers WHERE id = $1', [req.params.id]);
    if (soldier.rows.length === 0) return res.status(404).json({ error: 'Profile not found' });

    await pool.query(
      'INSERT INTO submissions (soldier_id, message, submitted_by) VALUES ($1, $2, $3)',
      [req.params.id, message.trim(), submittedBy || 'anonymous']
    );

    res.status(201).json({ message: 'Thank you — your correction has been submitted for review.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
