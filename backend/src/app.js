const express = require('express');
const cors = require('cors');
const soldiersRouter = require('./routes/soldiers');
const warsRouter = require('./routes/wars');

const app = express();

app.use(cors({ origin: process.env.ALLOWED_ORIGIN || '*' }));
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.use('/api/soldiers', soldiersRouter);
app.use('/api/wars', warsRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Centralized error handler - every route's catch(next) lands here
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;
