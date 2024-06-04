const mongoose = require('mongoose');

const statisticsSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now() },
  clinic: String,
  year: { type: String, default: () => new Date().getFullYear().toString() },
  month: [String],
  growth: [{ month: String, growth: Number }],
  newPatients: [Number],
  ratioPerMonth: [Number],
  monthForVisits: [String],
  countOfVisits: [String],
  holdingDataOfTriffic: [
    {
      month: String,
      data: [
        {
          name: String,
          count: Number,
        },
      ],
    },
  ],
});

const Statistics = mongoose.model('Statistics', statisticsSchema);

module.exports = Statistics;
