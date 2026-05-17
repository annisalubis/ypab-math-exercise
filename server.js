require('dotenv').config();

const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8080;
const SHEETS_URL = process.env.SHEETS_URL || '';

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.all('/api/sheets', async (req, res) => {
  if (!SHEETS_URL) return res.status(500).json({ error: 'SHEETS_URL not configured' });
  try {
    const url =
      req.method === 'GET' ? `${SHEETS_URL}?${new URLSearchParams(req.query)}` : SHEETS_URL;
    const opts = { method: req.method, headers: { 'Content-Type': 'application/json' } };
    if (req.method === 'POST') opts.body = JSON.stringify(req.body);
    const response = await fetch(url, { ...opts, redirect: 'follow' });
    const data = await response.json();
    res.json(data);
  } catch (e) {
    console.error('Proxy error:', e);
    res.status(502).json({ error: 'Failed to reach backend' });
  }
});

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
