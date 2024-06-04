const mongoose = require('mongoose');

const patientMRISchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now() },
  patient: {
    type: mongoose.Schema.ObjectId,
    ref: 'Patient',
    required: [true, 'The record must belong to a patient'],
  },

  image: { name: String, date: Date, path: [String] },
});

const PatientMRI = mongoose.model('PatientMRI', patientMRISchema);

module.exports = PatientMRI;
