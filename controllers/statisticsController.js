const catchAsync = require('../Utiles/catchAsync');
const Patient = require('../models/patientModel');
const QueuePatients = require('../models/queuePatients');
const Statistics = require('../models/statisticsModel');
const AppError = require('../Utiles/appError');

const DateConvertor = date => (date ? new Date(date).toLocaleString('en-US', { month: 'long' }) : 'NO DATE');

exports.patientCount = catchAsync(async (req, res, next) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const startOfMonth = new Date(currentYear, currentMonth, 1);
  const startOfPreviousMonth = new Date(currentYear, currentMonth - 1, 1);
  let getYear = await Statistics.findOne({ clinic: req.user.clinic, year: currentYear });
  const thisMonth = await Patient.countDocuments({ clinic: req.user.clinic, createdAt: { $gte: startOfMonth } });
  const PreviousMonth =
    (await Patient.countDocuments({
      clinic: req.user.clinic,
      createdAt: { $lt: startOfMonth, $gte: startOfPreviousMonth },
    })) || 1;

  console.log(PreviousMonth, thisMonth);
  const growth = ((thisMonth - PreviousMonth) / PreviousMonth) * 100;
  if (getYear) {
    const currentMonthh = DateConvertor(startOfMonth); // Convert the date to the required month format
    // Extract the month values from the growth array
    const months = getYear.growth.map(g => g.month);
    // Find the index of the current month
    const monthIndex = months.indexOf(currentMonthh);
    if (monthIndex !== -1) {
      // If the month exists, update its growth value
      getYear.growth[monthIndex].growth = growth;
    } else {
      // If the month does not exist, create a new object and add it to the array
      getYear.growth.push({ month: currentMonthh, growth: growth });
    }
    // Save the updated document
    await getYear.save();
  }

  if (!getYear) {
    getYear = await Statistics.create({ clinic: req.user.clinic, year: currentYear });
  }
  const previousMonthName = DateConvertor(startOfPreviousMonth);
  if (!getYear.month.includes(previousMonthName)) {
    getYear.month.push(previousMonthName);
  }
  if (!getYear.newPatients.includes(PreviousMonth)) {
    getYear.newPatients.push(PreviousMonth);
  }

  // await getYear.save();
  if (!req.bypassing) {
    if (req.url.endsWith('/Dashboard')) {
      return next();
    }
  }
  getYear.month.push(DateConvertor(startOfMonth));
  getYear.newPatients.push(thisMonth);

  if (req.bypassing) {
    return 1;
  }
  res.status(200).json({
    status: 'success',
    getYear,
  });
});

exports.trackingVisits = async (req, res, next) => {
  try {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();

    const startOfMonth = new Date(currentYear, currentMonth, 1);
    const dataOftheTraffic = await QueuePatients.find({
      doctor: req.user.clinic,
      createdAt: { $gte: startOfMonth },
      status: 'completed',
    });

    const bookingvalues = ['كشف', 'كشف مستعجل', 'أستشارة', 'حقن', 'FREE'];

    const collcting = value => {
      const analyzingData = dataOftheTraffic.slice().filter(data => data.HAGZ === value);
      return analyzingData;
    };

    const holdingDataOfTriffic = {};

    bookingvalues.forEach(value => {
      const count = collcting(value).length;
      const month = DateConvertor(startOfMonth);
      if (!holdingDataOfTriffic[month]) {
        holdingDataOfTriffic[month] = [];
      }
      holdingDataOfTriffic[month].push({ name: value, count });
    });

    // Get the number of visits for the current month
    const visitsOfCurrentMonth = dataOftheTraffic.length;

    // Find or create the Statistics document for the clinic
    let getYear = await Statistics.findOne({ clinic: req.user.clinic });
    if (!getYear) {
      getYear = await Statistics.create({ clinic: req.user.clinic, year: currentYear });
    }

    // Update or add the number of visits for the current month
    const monthString = DateConvertor(startOfMonth);
    const monthIndex = getYear.monthForVisits.indexOf(monthString);
    if (monthIndex !== -1) {
      getYear.countOfVisits[monthIndex] = visitsOfCurrentMonth;
    } else {
      getYear.monthForVisits.push(monthString);
      getYear.countOfVisits.push(visitsOfCurrentMonth);
    }

    // Update or add holdingDataOfTriffic for each month
    Object.entries(holdingDataOfTriffic).forEach(([month, data]) => {
      const existingMonthIndex = getYear.holdingDataOfTriffic.findIndex(item => item.month === month);
      if (existingMonthIndex !== -1) {
        getYear.holdingDataOfTriffic[existingMonthIndex].data = data;
      } else {
        getYear.holdingDataOfTriffic.push({ month, data });
      }
    });

    await getYear.save();
    if (req.bypassing) {
      return 1;
    }
    res.status(200).json({
      status: 'success',
      getYear,
      visitsOfCurrentMonth,
    });
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};
