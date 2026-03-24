const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true, enum: ['transport', 'electricity', 'food', 'other'] },
  details: {
    
    vehicleType: String,
    distance: Number,
    fuelType: String,
   
    energySource: String,
    kWh: Number,
    
    foodType: String,
    quantity: Number,
    
    description: String,
    customCO2: Number
  },
  co2e: { type: Number, required: true }, // CO2 equivalent in kg
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Activity', ActivitySchema);