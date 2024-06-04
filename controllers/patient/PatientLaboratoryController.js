const catchAsync = require('../../Utiles/catchAsync');

const PatientLaboratory = require('../../models/LabModel');

const Patient = require('../../models/patientModel');

const DateConvertor = date =>
  new Date(date).toLocaleString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

exports.createPatientLaboratory = catchAsync(async (req, res, next) => {
  const patientLaboratory = await PatientLaboratory.create(req.body.formData);
  res.status(200).json({
    status: 'success',
    data: patientLaboratory,
  });
});

exports.createpatientLaboratoryapi = catchAsync(async (req, res, next) => {
  const patientLaboratory = await PatientLaboratory.create(req.body);

  res.status(200).json({
    status: 'success',
    data: patientLaboratory,
  });
});

exports.getpatientLaboratory = catchAsync(async (req, res, next) => {
  const patientLaboratory = await Patient.find({
    serial: req.body.serial,
  })
    .lean()
    .populate('patientLaboratory');
  patientLaboratory[0].patientLaboratory.forEach(element => {
    element.createdAt = DateConvertor(element.createdAt);
  });

  res.status(200).json({
    status: 'success',
    data: patientLaboratory,
  });
});
