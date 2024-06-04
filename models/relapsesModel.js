const mongoose = require('mongoose');

const RelapsesSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now() },
  patient: {
    type: mongoose.Schema.ObjectId,
    ref: 'Patient',
    required: [true, 'The record must belong to a patient'],
  },
  relapses: [
    {
      systemsAffected: String,
      startedAt: Date,
      endedAt: Date,
      recovery: {
        type: String,
        enum: ['Full Recovery', 'Partial Recovery', 'No Recovery'],
      },
      treatments: [{ Type: String, description: String, from: Date, to: Date }],
      over: String,
      residue: { type: String, enum: ['none', 'mild', 'moderate', 'severe'] },
    },
  ],
});

const Relapses = mongoose.model('Relapses', RelapsesSchema);

module.exports = Relapses;
