const mongoose = require('mongoose');

const PatientScaleSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now() },
  patient: {
    type: mongoose.Schema.ObjectId,
    ref: 'Patient',
    required: [true, 'The record must belong to a patient'],
  },
  FSS: {
    visual: { type: Number, min: 0, max: 6 },
    brainstem: { type: Number, min: 0, max: 5 },
    pyramidal: { type: Number, min: 0, max: 6 },
    cerebellar: { type: Number, min: 0, max: 5 },
    sensory: { type: Number, min: 0, max: 6 },
    BB: { type: Number, min: 0, max: 6 },
    mental: { type: Number, min: 0, max: 5 },
    ambulation: { type: Number, min: 0, max: 12 },
  },
  EDSS: { type: Number, min: 0, max: 10 },
  status: String,
});

const PatientScale = mongoose.model('PatientScale', PatientScaleSchema);

module.exports = PatientScale;
