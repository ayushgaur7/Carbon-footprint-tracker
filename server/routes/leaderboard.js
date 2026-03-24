const express = require('express');
const User = require('../models/User');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const users = await User.aggregate([
      { 
        $match: { 
          carbonScore: { $exists: true, $gt: 0 },
          username: { $exists: true } 
        } 
      },
      { $sort: { carbonScore: 1 } }, 
      { $limit: 20 },
      { 
        $project: {
          username: 1,
          carbonScore: 1,
          achievementsCount: { $size: "$achievements" },
          _id: 0
        } 
      }
    ]);

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
