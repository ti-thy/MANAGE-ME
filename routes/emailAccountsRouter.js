const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Email accounts router working' });
});

module.exports = router;