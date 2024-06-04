const statisticsController = require('./statisticsController');
const User = require('../models/userModel');

exports.loopingmidnight = async (req, res, next) => {
  try {
    const allUsers = await User.find().lean();

    // Extract all clinic names from users
    const clinicNames = allUsers.map(user => user.clinic);

    // Use Set to ensure uniqueness and remove duplications
    const uniqueClinicNames = [...new Set(clinicNames)];
    uniqueClinicNames.forEach(async clinicName => {
      // Execute patientCount and trackingVisits for each clinic
      await statisticsController.patientCount({ user: { clinic: clinicName }, bypassing: true }, res, next);
      await statisticsController.trackingVisits({ user: { clinic: clinicName }, bypassing: true }, res, next);
    });
  } catch (err) {
    console.log(err);
  }
};
