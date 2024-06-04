const catchAsync = require('../../Utiles/catchAsync');
const Patient = require('../../models/patientModel');
const PatientRecord = require('../../models/patientRecordModel');
const AgeCalculator = require('../../Utiles/AgeCalculator');
const Factory = require('../handlerController');

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

exports.getAllPatients = catchAsync(async (req, res, next) => {
  // { refDR: req.user.name }
  const patient = await Patient.find().populate('patientRecord');
  res.status(200).json({
    status: 'success',
    data: patient,
  });
});

exports.createPatient = catchAsync(async (req, res, next) => {
  // req.body.patient.refDR = `Dr. ${req.user.name}`;
  // req.body.patient.serial = (Math.random() + 1).toString(36).substring(4);
  req.body.patient.serial = Math.floor(Math.random() * 999999) + 1;
  const { birthDate } = req.body.patient;
  req.body.patient.age = new AgeCalculator(birthDate).calculateAge();
  req.body.patient.clinic = req.user.clinic;
  req.body.patient.createdAt = Date.now();
  req.body.patient.refDR = req.user.name;

  await Patient.create(req.body.patient);
  res.status(201).json({
    status: 'success',
  });
});

exports.getPatient = Factory.getOne(Patient, {
  patientRecord: 'patientRecord',
  patientScale: 'patientScale',
});

exports.getSpatient = catchAsync(async (req, res, next) => {
  const { keyword } = req.body;
  const userClinic = req.user.clinic; // Assuming req.user.clinic contains clinic information

  const escapedKeyword = keyword.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');

  const patients = await Patient.find({
    $and: [
      // Use $and to combine multiple conditions
      {
        $or: [
          { serial: new RegExp(`^${escapedKeyword}.*`, 'i') },
          { name: new RegExp(`^${escapedKeyword}.*`, 'i') },
          { phoneNumber: new RegExp(`^${escapedKeyword}.*`, 'i') },
        ],
      },
      { clinic: userClinic }, // Filter by the user's clinic
    ],
  }).lean();

  patients.forEach(element => {
    element.birthDate = DateConvertor(element.birthDate);
  });

  res.send({ patients, user: req.user });
});

exports.deletePatient = catchAsync(async (req, res, next) => {
  const patient = await Patient.findById(req.params.id);

  if (!patient) {
    return res.status(404).json({
      status: 'fail',
      message: 'Patient not found',
    });
  }

  // Delete related records from PatientRecord
  await PatientRecord.deleteMany({ patient: patient._id });

  // Remove the patient after related records are deleted
  await patient.remove();

  res.status(200).json({
    status: 'success',
    data: patient,
  });
});
exports.updatePatient = catchAsync(async (req, res, next) => {
  const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data: patient,
  });
});

exports.homeSearch = catchAsync(async (req, res, next) => {
  const { keyword } = req.query;

  const patients = await Patient.aggregate([
    {
      $match: {
        clinic: req.user.clinic,
        $or: [
          { name: new RegExp(keyword, 'i') },
          { phoneNumber: new RegExp(keyword, 'i') },
          { idNo: new RegExp(keyword, 'i') },
          { serial: new RegExp(keyword, 'i') },
        ],
      },
    },
  ]);
  patients.forEach(element => {
    element.birthDate = DateConvertor(element.birthDate);
  });

  res.status(200).json({ patients, user: req.user });
});
// exports.getPatientt = catchAsync(async (req, res, next) => {
//   const patient = await Patient.find({
//     serial: String(req.body.serial.trim()),
//   })
//     .lean()
//     .populate('patientRecord')
//     .populate('Relapses')
//     .populate({
//       path: 'patientScale',
//       select: 'EDSS createdAt -patient -_id',
//     });

//   patient.forEach(element => {
//     element.birthDate = DateConvertor(element.birthDate);
//   });
//   // console.log(patient);
//   res.render('vewimainpaient', { patient });
// });

// exports.getPatienttt = catchAsync(async (req, res, next) => {
//   const patient = await Patient.find({
//     serial: String(req.body.serial.trim()),
//   })
//     .lean()
//     .populate('patientRecord')
//     .populate('Relapses')
//     .populate({
//       path: 'patientScale',
//       select: 'EDSS createdAt -patient -_id',
//     });

//   patient[0].patientRecord.forEach(element => {
//     element.createdAt = DateConvertor(element.createdAt);
//     element.diagnose.dateOfOnSet = DateConvertor(element.diagnose.dateOfOnSet);
//     element.diagnose.dateOfDignosis = DateConvertor(element.diagnose.dateOfDignosis);
//     element.currentMedications.forEach(element => {
//       element.startedAt = DateConvertor(element.startedAt);
//       if (element.startedAt === 'NO DATE') {
//         element.endedAt = 'NO DATE';
//       } else if (element.endedAt === null) {
//         element.endedAt = 'On Going';
//       } else {
//         element.endedAt = DateConvertor(element.endedAt);
//       }
//     });
//     element.pastRadiology.forEach(element => {
//       element.date = DateConvertor(element.date);
//     });
//   });

//   patient[0].Relapses.forEach(element => {
//     element.createdAt = DateConvertor(element.createdAt);
//     element.relapses.forEach(element => {
//       element.startedAt = DateConvertor(element.startedAt);
//       element.endedAt = DateConvertor(element.endedAt);
//       element.treatments.forEach(element => {
//         element.from = DateConvertor(element.from);
//         element.to = DateConvertor(element.to);
//       });
//     });
//   });

//   res.status(200).json({ patient: patient[0] });
// });
