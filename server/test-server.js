const express = require('express');
const app = express();
const PORT = 8080;

// Simple health endpoint
app.get('/health', (req, res) => {
  console.log('Health check hit!');
  res.json({ status: 'ok', message: 'Test server working' });
});

// Start server
app.listen(PORT, '127.0.0.1', () => {
  console.log(`Test server running on port ${PORT}`);
  console.log(`Test health: http://localhost:${PORT}/health`);
  console.log(`Test health: http://127.0.0.1:${PORT}/health`);
});

module.exports = app;
