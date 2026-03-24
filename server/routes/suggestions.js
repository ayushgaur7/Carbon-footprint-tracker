const express = require('express');
const auth = require('../middleware/auth');
const Activity = require('../models/Activity');
const router = express.Router();

const ALTERNATIVES = {
  transport: {
    car: "Consider carpooling or using public transport",
    petrol: "Switch to an electric or hybrid vehicle",
    diesel: "Switch to a more efficient fuel type"
  },
  electricity: {
    coal: "Switch to renewable energy providers",
    oil: "Look into solar panel options for your home"
  },
  food: {
    beef: "Try plant-based alternatives like lentils or tofu",
    lamb: "Chicken has a much lower carbon footprint"
  }
};


router.get('/', auth, async (req, res) => {
  try {
    const activities = await Activity.find({ userId: req.user._id }); // <--- CHANGED FROM req.user.id
    
    const suggestions = [];

    activities.forEach(activity => {
     
      if (activity.type === 'transport' && activity.details.fuelType !== 'electric') {
        suggestions.push({
          category: 'transport',
          suggestion: `Consider using an electric vehicle or public transport for your ${activity.details.distance}km trip`,
          potentialSavings: activity.co2e * 0.5
        });
      }

      if (activity.type === 'electricity' && activity.details.energySource !== 'renewable') {
        suggestions.push({
          category: 'electricity',
          suggestion: 'Switch to renewable energy sources for your electricity',
          potentialSavings: activity.co2e * 0.7
        });
      }

      if (activity.type === 'food' && activity.details.foodType === 'meat') {
        suggestions.push({
          category: 'food',
          suggestion: 'Try meat-free alternatives for some meals',
          potentialSavings: activity.co2e * 0.6
        });
      }

      
      if (activity.type === 'transport' && activity.details.vehicleType === 'car') {
        suggestions.push({
          category: 'transport',
          suggestion: ALTERNATIVES.transport.car,
          potentialSavings: activity.co2e * 0.4
        });

        if (activity.details.fuelType === 'petrol') {
          suggestions.push({
            category: 'transport',
            suggestion: ALTERNATIVES.transport.petrol,
            potentialSavings: activity.co2e * 0.6
          });
        }

        if (activity.details.fuelType === 'diesel') {
          suggestions.push({
            category: 'transport',
            suggestion: ALTERNATIVES.transport.diesel,
            potentialSavings: activity.co2e * 0.5
          });
        }
      }

      if (activity.type === 'electricity') {
        if (activity.details.energySource === 'coal') {
          suggestions.push({
            category: 'electricity',
            suggestion: ALTERNATIVES.electricity.coal,
            potentialSavings: activity.co2e * 0.8
          });
        }

        if (activity.details.energySource === 'oil') {
          suggestions.push({
            category: 'electricity',
            suggestion: ALTERNATIVES.electricity.oil,
            potentialSavings: activity.co2e * 0.6
          });
        }
      }

      if (activity.type === 'food') {
        if (activity.details.foodType === 'beef') {
          suggestions.push({
            category: 'food',
            suggestion: ALTERNATIVES.food.beef,
            potentialSavings: activity.co2e * 0.7
          });
        }

        if (activity.details.foodType === 'lamb') {
          suggestions.push({
            category: 'food',
            suggestion: ALTERNATIVES.food.lamb,
            potentialSavings: activity.co2e * 0.6
          });
        }
      }
    });

    
    const uniqueSuggestions = suggestions.filter(
      (s, i) => suggestions.findIndex(
        item => item.suggestion === s.suggestion
      ) === i
    );

    res.json(uniqueSuggestions.slice(0, 5));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;