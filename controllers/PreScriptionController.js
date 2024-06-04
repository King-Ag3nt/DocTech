const PreScription = require('../models/prescriptionModel');
const catchAsync = require('../Utiles/catchAsync');

exports.createPreScription = catchAsync(async (req, res, next) => {
  req.body.clinic = req.user.clinic;
  const preScription = await PreScription.create(req.body);
  res.status(200).json({
    status: 'success',
    data: preScription,
  });
});
