const mongoose = require('mongoose');

const patientLaboratorySchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now() },
  patient: {
    type: mongoose.Schema.ObjectId,
    ref: 'Patient',
    required: [true, 'The record must belong to a patient'],
  },
  haematology: [
    {
      title: String,
      result: String,
    },
  ],
  hormones: [
    {
      title: String,
      result: String,
    },
  ],
  chemistry: [
    {
      title: String,
      result: String,
    },
  ],
  tochScreen: [
    {
      title: String,
      result: String,
    },
  ],
  immunology: [
    {
      title: String,
      result: String,
    },
  ],
  microbiology: [
    {
      title: String,
      result: String,
    },
  ],
  tumormaker: [
    {
      title: String,
      result: String,
    },
  ],
  miscellaneous: [
    {
      title: String,
      result: String,
    },
  ],
});

const PatientLaboratory = mongoose.model('PatientLaboratory', patientLaboratorySchema);

module.exports = PatientLaboratory; // Export the model
