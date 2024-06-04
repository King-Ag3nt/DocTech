const mongoose = require('mongoose');

const queuePatientsSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now() },
  patient: {
    type: mongoose.Schema.ObjectId,
    ref: 'Patient',
    required: [true, 'The record must belong to a patient'],
  },
  doctor: {
    type: String,
    required: [true, 'The record must belong to a doctor'],
  },
  status: {
    type: String,
    enum: ['hold', 'pending', 'inQueue', 'inProgress', 'completed'],
  },
  HAGZ: String,
  note: String,
  virified: { type: Boolean, default: false },
  date: Date,
});

queuePatientsSchema.index({ doctor: 1, date: 1 });

const updateDocuments = async function (next) {
  try {
    // Update documents where date is less than 4 hours ago and status is 'inQueue'
    await this.model.updateMany(
      { date: { $lt: new Date(new Date() - 4 * 60 * 60 * 1000) }, status: 'inQueue' },
      { $set: { status: 'completed' } },
    );

    // Continue with the find operation
    next();
  } catch (error) {
    console.error('Error updating documents:', error);
    next(error);
  }
};

queuePatientsSchema.pre('find', updateDocuments);

const QueuePatients = mongoose.model('QueuePatients', queuePatientsSchema);

module.exports = QueuePatients;
