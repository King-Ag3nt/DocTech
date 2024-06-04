const mongoose = require('mongoose');

const preSetSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now() },
  name: String,
  currentMedications: [
    {
      title: String,
      comment: String,
    },
  ],
  requestedInvestigations: [
    {
      title: String,
      comment: String,
    },
  ],
  clinic: String,
});

const PreSet = mongoose.model('PreSet', preSetSchema);

module.exports = PreSet;
