const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Notifications router working' });
});

module.exports = router;