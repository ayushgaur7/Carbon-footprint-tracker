const express = require('express');
const auth = require('../middleware/auth');
const Activity = require('../models/Activity');
const User = require('../models/User');
const router = express.Router();

// Your emission factors (no change)
const EMISSION_FACTORS = {
  transport: {
    car: {
      petrol: 0.192,
      diesel: 0.171,
      hybrid: 0.112,
      electric: 0.053
    },
    bus: 0.089,
    train: 0.041,
    tram: 0.035,
    bicycle: 0,
    walking: 0
  },
  electricity: {
    coal: 0.96,
    oil: 0.78,
    'natural-gas': 0.49,
    nuclear: 0.033,
    hydro: 0.024,
    wind: 0.011,
    solar: 0.045,
    biomass: 0.18
  },
  food: {
    beef: 27.0,
    lamb: 20.0,
    cheese: 13.5,
    pork: 5.8,
    poultry: 4.5,
    eggs: 3.4,
    rice: 2.7,
    vegetables: 0.4,
    fruits: 0.4,
    grains: 0.3
  }
};

// Add new activity
router.post('/', auth, async (req, res) => {
  try {
    const { type, details } = req.body;

    let co2e = 0;
    
    // Convert strings to numbers safely
    const distance = parseFloat(details.distance);
    const kWh = parseFloat(details.kWh);
    const quantity = parseFloat(details.quantity);
    const customCO2 = parseFloat(details.customCO2);

    if (type === 'transport') {
      const vehicle = details.vehicleType;
      if (vehicle === 'car') {
        co2e = distance * EMISSION_FACTORS.transport.car[details.fuelType];
      } else if (vehicle === 'bike') {
        co2e = distance * EMISSION_FACTORS.transport.bicycle;
      } else if (EMISSION_FACTORS.transport[vehicle]) {
        co2e = distance * EMISSION_FACTORS.transport[vehicle];
      }
    } else if (type === 'electricity') {
      co2e = kWh * EMISSION_FACTORS.electricity[details.energySource];
    } else if (type === 'food') {
      if (EMISSION_FACTORS.food[details.foodType]) {
        co2e = quantity * EMISSION_FACTORS.food[details.foodType];
      } else if (details.foodType === 'meat') {
        co2e = quantity * 15.0; // Generic fallback
      }
    } else {
      co2e = customCO2 || 0;
    }

    // Check for NaN, which causes the 400 error
    if (isNaN(co2e)) {
      console.error('Calculation failed, co2e is NaN. Details:', details);
      return res.status(400).json({ error: 'Calculation failed. Check input data.' });
    }

    const activity = new Activity({
      userId: req.user._id, // Using _id from your middleware
      type,
      details,
      co2e
    });

    await activity.save();

    await User.findByIdAndUpdate(req.user._id, { // Using _id
      $inc: { carbonScore: co2e }
    });

    res.status(201).json(activity);
  } catch (err) {
    // This server-side log will be more descriptive
    console.error('Error in POST /api/activities:', err.message);
    res.status(400).json({ error: err.message });
  }
});


router.get('/', auth, async (req, res) => {
  try {
    const activities = await Activity.find({ userId: req.user._id }).sort('-date'); // Using _id
    res.json(activities);
  } catch (err) {
    console.error('Error in GET /api/activities:', err.message);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;