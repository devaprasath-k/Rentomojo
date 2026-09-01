const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// ---------------- ITEM ----------------
const itemSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, trim: true }, // your custom ID
  name: { type: String, required: true, trim: true, maxlength: 100 },
  category: { type: String, required: true, trim: true, index: true },
  pricePerMonth: { type: Number, required: true, min: 0 },
  deposit: { type: Number, required: true, min: 0 },
  description: { type: String, required: true, maxlength: 1000 },
  images: [{
    type: String,
    validate: { validator: v => /^https?:\/\/.+/.test(v), message: 'Invalid image URL' }
  }],
  availability: { type: Boolean, default: true, index: true },
  city: { type: String, required: true, trim: true, index: true },
  subBranch: { type: String, trim: true, default: "" },
  condition: { type: String, enum: ['new', 'good', 'refurbished'], required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

// Optional: text search
itemSchema.index({ name: 'text', description: 'text' });
itemSchema.index({ category: 1, city: 1, availability: 1 });



// ---------------- USER ----------------
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  fullname: { type: String },
  password: { type: String, required: true },
  role: { type: String, enum: ['user','vendors','admin'], default: 'user' },
  isActive: { type: Boolean, default: true }
});

// Hash password before save
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return; // just return
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  // no next()
});


const Items = mongoose.model('Item', itemSchema);
const User = mongoose.model('User', userSchema);

module.exports = { Items, User };
