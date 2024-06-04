const catchAsync = require('../../Utiles/catchAsync');

const PatientScale = require('../../models/patientScaleModel');
const Patient = require('../../models/patientModel');

const DateConvertor = date =>
  new Date(date).toLocaleString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

exports.createPatientScale = catchAsync(async (req, res, next) => {
  const patient = await PatientScale.create(req.body);

  res.status(201).json({
    status: 'success',
    data: patient,
  });
});

exports.getpatientScale = catchAsync(async (req, res, next) => {
  const patient = await Patient.find({ serial: req.params.Id }).lean().populate('patientScale');
  patient[0].patientScale.forEach(element => {
    element.createdAt = DateConvertor(element.createdAt);
  });
  res.status(200).json({
    status: 'success',
    data: patient,
  });
});
