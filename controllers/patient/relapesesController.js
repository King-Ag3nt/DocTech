const catchAsync = require('../../Utiles/catchAsync');

const Relapse = require('../../models/relapsesModel');

exports.createRelapse = catchAsync(async (req, res, next) => {
  const relapse = await Relapse.create(req.body.formData);

  res.status(200).json({
    status: 'success',
    data: relapse,
  });
});

exports.deleteRelapse = catchAsync(async (req, res, next) => {
  const relapse = await Relapse.findByIdAndDelete(req.params.id);
  res.status(200).json({
    status: 'success',
    data: relapse,
  });
});

exports.updateRelapse = catchAsync(async (req, res, next) => {
  const relapse = await Relapse.findByIdAndUpdate(req.params.id, req.body);
  res.status(200).json({
    status: 'success',
    data: relapse,
  });
});

exports.getAllRelapses = catchAsync(async (req, res, next) => {
  const relapses = await Relapse.find().populate('patient');

  res.status(200).json({
    status: 'success',
    data: relapses,
  });
});
