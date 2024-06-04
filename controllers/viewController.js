const catchAsync = require('../Utiles/catchAsync');
const Relapse = require('../models/relapsesModel');
const Patient = require('../models/patientModel');
const RefDoctor = require('../models/refDrModel');
const PreSet = require('../models/preSetModel');
const User = require('../models/userModel');
const QueuePatients = require('../models/queuePatients');
const PatientRecord = require('../models/patientRecordModel');
const Statistics = require('../models/statisticsModel');
const PreScription = require('../models/prescriptionModel');
const Email = require('../Utiles/Email');

const DateConvertorr = date => (date ? new Date(date).toLocaleString('en-US', { month: 'long' }) : 'NO DATE');

const DateConvertor = date => {
  if (date === null) {
    date = 'NO DATE';
  }
  return new Date(date).toLocaleString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};
function FORMATDATETOYYYYMMDD(dateString) {
  if (dateString === null || dateString === undefined) {
    return;
  }
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

exports.newView = catchAsync(async (req, res, next) => {
  const patient = await Patient.find({
    $and: [{ clinic: req.user.clinic }, { _id: req.params.id }],
  })
    .populate('patientRecord')
    .lean();
  const preScription = await PreScription.findOne({ clinic: req.user.clinic }).lean();

  patient.forEach(element => {
    element.birthDate = DateConvertor(element.birthDate);
  });
  patient[0].patientRecord.forEach(element => {
    element.diagnose.dateOfDignosis = DateConvertor(element.diagnose.dateOfDignosis);
    element.diagnose.dateOfOnSet = DateConvertor(element.diagnose.dateOfOnSet);
    element.createdAt = DateConvertor(element.createdAt);
    element.currentMedications.forEach(medication => {
      element.startedAt = DateConvertor(medication.startedAt);
      element.endedAt = DateConvertor(medication.endedAt);
    });
  });

  res.render('layout', {
    printt: 'print.css',
    body: 'newView.ejs',
    user: req.user,
    patient: patient[0],
    title: 'newView',
    queue: req.queue,
    preScription,
  });
});

exports.newHome = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1; // Get the requested page number from the query parameters
  const pageSize = 8;

  const aggregationPipeline = [
    {
      $match: { clinic: req.user.clinic },
    },
    {
      $facet: {
        metadata: [{ $count: 'totalCount' }],
        data: [{ $skip: (page - 1) * pageSize }, { $limit: pageSize }],
      },
    },
  ];

  const result = await Patient.aggregate(aggregationPipeline);

  const totalPatients = result[0].metadata[0] ? result[0].metadata[0].totalCount : 0;
  const totalPages = Math.ceil(totalPatients / pageSize);

  const patients = result[0].data;

  patients.forEach(element => {
    element.birthDate = DateConvertor(element.birthDate);
  });
  // new Email({ name: 'oday tarek', email: 'picev29909@agafx.com' }, 'asdasda').sendWelcome();
  res.render('layout', {
    body: 'newHome.ejs',
    user: req.user,
    patients,
    title: 'Home',
    queue: req.queue,
    totalPages,
    currentPage: page,
  });
});

exports.loginpage = catchAsync(async (req, res, next) => {
  res.render('login');
});

exports.relapses = catchAsync(async (req, res, next) => {
  let patient = await Patient.find({ serial: req.params.id }).lean().populate('patientRecord').populate({
    path: 'patientScale',
    select: 'EDSS createdAt -patient -_id',
  });

  if (patient.length === 0) {
    res.render('errorpage');
  }
  patient = patient[0];

  res.render('layout', {
    body: 'add relapses.ejs',
    user: req.user,
    patient,
    title: 'Add Relapses',
    queue: req.queue,
  });
});
exports.MRIADD = catchAsync(async (req, res, next) => {
  let patient = await Patient.find({ serial: req.params.id }).lean().populate('patientMRI').populate('patientRecord');

  // if (patient.length === 0) {
  //   res.render('errorpage');
  // }
  patient = patient[0];

  res.render('layout', {
    body: 'MRIADD.ejs',
    patient,
    user: req.user,
    title: 'MRIADD',
    queue: req.queue,
  });
});

exports.addRecordV2 = catchAsync(async (req, res, next) => {
  const patient = await Patient.findById(req.params.id).lean();
  const presets = await PreSet.find({ clinic: req.user.clinic }).lean();
  res.render('layout', {
    body: 'addRecordV2.ejs',
    user: req.user,
    patient,
    presets,
    title: 'addRecord',
    queue: req.queue,
  });
});

exports.editRecordV2 = catchAsync(async (req, res, next) => {
  const record = await PatientRecord.findById(req.params.id).populate('patient').lean();
  const presets = await PreSet.find({ clinic: req.user.clinic }).lean();

  record.diagnose.dateOfDignosis = FORMATDATETOYYYYMMDD(record.diagnose.dateOfDignosis);
  record.diagnose.dateOfOnSet = FORMATDATETOYYYYMMDD(record.diagnose.dateOfOnSet);
  if (record.DMD) {
    record.DMD.forEach(dmdd => {
      dmdd.startedAt = FORMATDATETOYYYYMMDD(dmdd.startedAt);
      dmdd.endedAt = FORMATDATETOYYYYMMDD(dmdd.endedAt);
    });
  }
  record.pastRadiology.forEach(e => {
    e.date = FORMATDATETOYYYYMMDD(e.date);
  });
  record.currentMedications.forEach(medication => {
    medication.startedAt = FORMATDATETOYYYYMMDD(medication.startedAt);
    medication.endedAt = FORMATDATETOYYYYMMDD(medication.endedAt);
  });

  res.render('layout', {
    body: 'editRecordV2.ejs',
    user: req.user,
    presets,
    title: 'Edit Record',
    record,
    queue: req.queue,
  });
});
// test Agent record start
exports.horizontalRecord = catchAsync(async (req, res, next) => {
  const patient = await Patient.findById(req.params.id).lean();
  const presets = await PreSet.find({ clinic: req.user.clinic }).lean();
  res.render('layout', {
    body: 'new record.ejs',
    user: req.user,
    patient,
    presets,
    title: 'testRecordAgent',
    queue: req.queue,
  });
});
exports.horizontalFollowUp = catchAsync(async (req, res, next) => {
  const patient = await Patient.find({ _id: req.params.id }).populate('patientRecord').lean();
  const presets = await PreSet.find({ clinic: req.user.clinic }).lean();
  console.log(patient[0].patientRecord.DMD);
  patient[0].patientRecord.forEach(element => {
    element.diagnose.dateOfDignosis = FORMATDATETOYYYYMMDD(element.diagnose.dateOfDignosis);
    element.diagnose.dateOfOnSet = FORMATDATETOYYYYMMDD(element.diagnose.dateOfOnSet);
    element.createdAt = FORMATDATETOYYYYMMDD(element.createdAt);
    if (element.DMD) {
      element.DMD.forEach(dmdd => {
        dmdd.startedAt = FORMATDATETOYYYYMMDD(dmdd.startedAt);
        dmdd.endedAt = FORMATDATETOYYYYMMDD(dmdd.endedAt);
      });
    }
    element.currentMedications.forEach(medication => {
      medication.startedAt = FORMATDATETOYYYYMMDD(medication.startedAt);
      medication.endedAt = FORMATDATETOYYYYMMDD(medication.endedAt);
    });
  });

  res.render('layout', {
    body: 'new secondvisits.ejs',
    user: req.user,
    patient,
    presets,
    title: 'addRecord',
    queue: req.queue,
  });
});
// test Agent record end
exports.secondVisints = catchAsync(async (req, res, next) => {
  const patient = await Patient.find({ _id: req.params.id }).populate('patientRecord').lean();
  const presets = await PreSet.find({ clinic: req.user.clinic }).lean();
  console.log(patient[0].patientRecord.DMD);
  patient[0].patientRecord.forEach(element => {
    element.diagnose.dateOfDignosis = FORMATDATETOYYYYMMDD(element.diagnose.dateOfDignosis);
    element.diagnose.dateOfOnSet = FORMATDATETOYYYYMMDD(element.diagnose.dateOfOnSet);
    element.createdAt = FORMATDATETOYYYYMMDD(element.createdAt);
    if (element.DMD) {
      element.DMD.forEach(dmdd => {
        dmdd.startedAt = FORMATDATETOYYYYMMDD(dmdd.startedAt);
        dmdd.endedAt = FORMATDATETOYYYYMMDD(dmdd.endedAt);
      });
    }
    element.currentMedications.forEach(medication => {
      medication.startedAt = FORMATDATETOYYYYMMDD(medication.startedAt);
      medication.endedAt = FORMATDATETOYYYYMMDD(medication.endedAt);
    });
  });

  res.render('layout', {
    body: 'secondVisints.ejs',
    user: req.user,
    patient,
    presets,
    title: 'addRecord',
    queue: req.queue,
  });
});
exports.userAccess = catchAsync(async (req, res, next) => {
  const users = await User.find({
    clinic: req.user.clinic,
    _id: { $ne: req.user._id }, // Exclude the current user
  }).lean();

  res.render('layout', {
    body: 'user access.ejs',
    user: req.user,
    users: users,
    title: 'User Access',
    queue: req.queue,
  });
});

// Agent test
exports.QueueV2 = catchAsync(async (req, res, next) => {
  const hold = await QueuePatients.find({ doctor: req.user.clinic, status: 'hold' }).populate('patient');

  res.render('layout', {
    body: 'QueueV2.ejs',
    user: req.user,
    hold,
    title: 'Queue',
    queue: req.queue,
  });
});
exports.addPatientV2 = catchAsync(async (req, res, next) => {
  res.render('layout', {
    body: 'add PatientV2.ejs',
    user: req.user,
    title: 'Add Patient',
    queue: req.queue,
  });
});
exports.addrefdrv2 = catchAsync(async (req, res, next) => {
  res.render('layout', {
    body: 'add ref doc v2.ejs',
    user: req.user,
    title: 'Add Referal Doctor',
    queue: req.queue,
  });
});
exports.viewrefdrv2 = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1; // Get the requested page number from the query parameters
  const pageSize = 8;

  const aggregationPipeline = [
    {
      $match: { clinic: req.user.clinic },
    },
    {
      $facet: {
        metadata: [{ $count: 'totalCount' }],
        data: [{ $skip: (page - 1) * pageSize }, { $limit: pageSize }],
      },
    },
  ];

  const result = await RefDoctor.aggregate(aggregationPipeline);

  const totalPatients = result[0].metadata[0] ? result[0].metadata[0].totalCount : 0;
  const totalPages = Math.ceil(totalPatients / pageSize);
  res.render('layout', {
    printt: 'printref.css',
    body: 'newRef Doc.ejs',
    title: 'View Referal Doctor',
    result: result[0].data,
    totalPages,
    currentPage: page,
    user: req.user,
    queue: req.queue,
  });
});
exports.editPatientV2 = catchAsync(async (req, res, next) => {
  const patient = await Patient.findById(req.params.id).lean();
  patient.birthDate = FORMATDATETOYYYYMMDD(patient.birthDate);
  res.render('layout', {
    body: 'editPatientV2.ejs',
    user: req.user,
    title: 'Edit Patient',
    patient,
    queue: req.queue,
  });
});
exports.viewRelapseV2 = catchAsync(async (req, res, next) => {
  const patient = await Patient.findById(req.params.id).lean();
  const relapses = await Relapse.find({ patient: req.params.id }).lean();
  patient.birthDate = DateConvertor(patient.birthDate);

  res.render('layout', {
    body: 'viewRelapseV2.ejs',
    user: req.user,
    title: 'View Relapse',
    relapses,
    patient,
    queue: req.queue,
  });
});
exports.AddScaleV2 = catchAsync(async (req, res, next) => {
  const patient = await Patient.findById(req.params.id).lean();
  res.render('layout', {
    body: 'AddScaleV2.ejs',
    user: req.user,
    title: 'Add Scale',
    patient,
    queue: req.queue,
  });
});
exports.viewScaleV2 = catchAsync(async (req, res, next) => {
  const patient = await Patient.findById(req.params.id).populate('patientScale').lean();
  patient.birthDate = DateConvertor(patient.birthDate);
  res.render('layout', {
    body: 'viewScaleV2.ejs',
    user: req.user,
    title: 'View Scale',
    patient,
    queue: req.queue,
  });
});
exports.presetMedication = catchAsync(async (req, res, next) => {
  const preSets = await PreSet.find({ clinic: req.user.clinic });
  res.render('layout', {
    body: 'presetMedecation.ejs',
    user: req.user,
    preSets,
    title: 'Preset Medecation',
    queue: req.queue,
  });
});
exports.presetInvestigations = catchAsync(async (req, res, next) => {
  const preSets = await PreSet.find({ clinic: req.user.clinic });
  res.render('layout', {
    body: 'presetInvestigations.ejs',
    user: req.user,
    preSets,
    title: 'Preset Investigations',
    queue: req.queue,
  });
});
exports.dashBoard = catchAsync(async (req, res, next) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const startOfMonth = new Date(currentYear, currentMonth, 1);
  const currentMonthh = DateConvertorr(startOfMonth); // Convert the date to the required month format
  const total = await Patient.countDocuments({ clinic: req.user.clinic });
  const stitics = await Statistics.findOne({ clinic: req.user.clinic, year: currentYear });

  const months = stitics.growth.map(item => item.month); // Extract months into a separate array
  const currentMonthIndex = months.indexOf(currentMonthh); // Find the index of the current month

  const { growth } = stitics.growth[currentMonthIndex];

  res.render('layout', {
    body: 'dashBoard.ejs',
    user: req.user,
    title: 'Dashboard',
    queue: req.queue,
    total,
    growth,
    stitics,
  });
});
exports.advSearch = catchAsync(async (req, res, next) => {
  if (!req.query.keywords) {
    return res.render('layout', {
      body: 'advSearch.ejs',
      user: req.user,
      title: 'Advanced Search',
      queue: req.queue,
      currentPage: 1,
      totalPages: 1,
      filteredData: [],
    });
  }

  const perPage = 8;
  const page = parseInt(req.query.page, 10) || 1;
  const textArray = req.query.keywords.split(',');
  const searchFields = [
    'examination.title',
    'pastRadiology.title',
    'currentMedications.title',
    'complaints.title',
    'diagnose.title',
    'DMD.Type',
  ];

  const andConditions = textArray.map(keyword => ({
    $and: [
      { $or: searchFields.map(field => ({ [field]: { $regex: new RegExp(`\\b${keyword}\\b`, 'i') } })) },
      { clinic: req.user.clinic },
    ],
  }));

  const resultsCount = await PatientRecord.aggregate([
    {
      $match: { $and: andConditions },
    },
    {
      $group: {
        _id: '$patient',
        data: { $first: '$$ROOT' },
      },
    },

    {
      $lookup: {
        from: 'patients',
        localField: '_id',
        foreignField: '_id',
        as: 'patient',
      },
    },

    { $count: 'totalPatients' },
  ]);

  const totalPatients = resultsCount && resultsCount.length > 0 ? resultsCount[0].totalPatients : 0;
  const totalPages = Math.ceil(totalPatients / perPage);

  const results = await PatientRecord.aggregate([
    {
      $match: { $and: andConditions },
    },
    {
      $group: {
        _id: '$patient',
        data: { $first: '$$ROOT' },
      },
    },
    {
      $lookup: {
        from: 'patients',
        localField: '_id',
        foreignField: '_id',
        as: 'patient',
      },
    },
    { $sort: { 'data.createdAt': -1 } }, // Sort by 'createdAt' field in descending order
    { $skip: perPage * (page - 1) },
    { $limit: perPage },
    { $unwind: '$patient' },
  ]);

  const filteredData = results;

  res.render('layout', {
    body: 'advSearch.ejs',
    user: req.user,
    title: 'Advanced Search',
    queue: req.queue,
    filteredData,
    currentPage: page,
    totalPages,
  });
});

exports.resetpasswordview = catchAsync(async (req, res, next) => {
  res.render('resetpassword', {
    title: 'resetpassword',
  });
});
exports.passwordConfirmation = catchAsync(async (req, res, next) => {
  res.render('passwordConfirmation', {
    title: 'passwordConfirmation',
  });
});

exports.patientMedicalView = catchAsync(async (req, res, next) => {
  const patient = await Patient.findById(req.params.id).populate('patientRecord Relapses patientScale').lean();

  const preScription = await PreScription.findOne({ clinic: req.user.clinic }).lean();

  patient.birthDate = DateConvertor(patient.birthDate);

  patient.patientRecord.forEach(element => {
    element.diagnose.dateOfDignosis = DateConvertor(element.diagnose.dateOfDignosis);
    element.diagnose.dateOfOnSet = DateConvertor(element.diagnose.dateOfOnSet);
    element.createdAt = DateConvertor(element.createdAt);
    element.currentMedications.forEach(medication => {
      element.startedAt = DateConvertor(medication.startedAt);
      element.endedAt = DateConvertor(medication.endedAt);
    });
  });
  console.log(patient);

  res.render('layout', {
    body: 'patientMedicalView.ejs',
    title: 'patientMedicalView',
    user: req.user,
    queue: req.queue,
    preScription,
    patient,
  });
});

exports.Pricing = catchAsync(async (req, res, next) => {
  res.render('Pricing');
});
