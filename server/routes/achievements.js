const express = require('express');
const User = require('../models/User');
const Activity = require('../models/Activity'); // Import Activity model
const auth = require('../middleware/auth'); // Import auth middleware
const router = express.Router();


// Add the missing /goals endpoint
router.post('/goals', auth, async (req, res) => {
  try {
    const { targetScore, deadline } = req.body;
    const goal = { targetScore, deadline };

    // We can push directly to the user object from middleware
    req.user.goals.push(goal);
    await req.user.save(); // Save the user document

    res.json(req.user.goals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fix the /check endpoint
router.post('/check', auth, async (req, res) => {
  try {
    // We already have the full user object from the auth middleware
    const user = req.user; 
    
    // Query the Activity collection for the count
    const activityCount = await Activity.countDocuments({ userId: user._id }); // <--- Use user._id
    
    const newAchievements = [];

    // Check against activityCount
    if (activityCount >= 3 && !user.achievements.some(a => a.name === 'Bronze')) {
      newAchievements.push({ name: 'Bronze', description: 'Logged 3 activities', icon: 'fa-medal' });
    }
    if (activityCount >= 10 && !user.achievements.some(a => a.name === 'Silver')) {
      newAchievements.push({ name: 'Silver', description: 'Logged 10 activities', icon: 'fa-medal' });
    }
    if (user.carbonScore < 100 && !user.achievements.some(a => a.name === 'Eco Warrior')) {
      newAchievements.push({ name: 'Eco Warrior', description: 'Maintained low carbon footprint', icon: 'fa-leaf' });
    }

    if (newAchievements.length > 0) {
      user.achievements.push(...newAchievements);
      await user.save();
    }

    res.json(newAchievements);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;