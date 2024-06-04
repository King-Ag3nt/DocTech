const catchAsync = require('../Utiles/catchAsync');

const PreSet = require('../models/preSetModel');

exports.createPreSet = catchAsync(async (req, res, next) => {
  req.body.clinic = req.user.clinic;
  const preSet = await PreSet.create(req.body);
  res.status(200).json({
    status: 'success',
    data: preSet,
  });
});
exports.getAllpreSets = catchAsync(async (req, res, next) => {
  const preSets = await PreSet.find({ clinic: req.user.clinic });
  res.status(200).json({
    status: 'success',
    data: preSets,
  });
});
exports.getpreSet = catchAsync(async (req, res, next) => {
  const preSet = await PreSet.findById(req.params.id);
  res.status(200).json({
    status: 'success',
    data: preSet,
  });
});
exports.updatepreSet = catchAsync(async (req, res, next) => {
  const preSet = await PreSet.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data: preSet,
  });
});
exports.deletepreSet = catchAsync(async (req, res, next) => {
  const preSet = await PreSet.findByIdAndDelete(req.params.id);
  res.status(200).json({
    status: 'success',
    data: preSet,
  });
});
