const mongoose = require('mongoose');

const refDrSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now() },
  name: String,
  description: String,
  phoneNumber: [String],
  email: String,
  clinic: String,
  slug: String,
});

const RefDr = mongoose.model('RefDr', refDrSchema);

module.exports = RefDr;
