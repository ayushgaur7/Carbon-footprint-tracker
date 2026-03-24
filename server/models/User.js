const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  carbonScore: { type: Number, default: 0 },

  achievements: [{
    name: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, default: 'fa-trophy' }, 
    earnedAt: { type: Date, default: Date.now }
  }],
  
  goals: [{
    targetScore: Number,
    deadline: Date,
    achieved: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  }],

  createdAt: { type: Date, default: Date.now }
});

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model('User', UserSchema);
