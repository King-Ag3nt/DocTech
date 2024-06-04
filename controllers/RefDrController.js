const catchAsync = require('../Utiles/catchAsync');

const RefDr = require('../models/refDrModel');

exports.createRefDr = catchAsync(async (req, res, next) => {
  req.body.clinic = req.user.clinic;
  const refDr = await RefDr.create(req.body);
  res.status(200).json({
    status: 'success',
    data: refDr,
  });
});

exports.deleteRefDr = catchAsync(async (req, res, next) => {
  const refDr = await RefDr.findByIdAndDelete(req.params.id);
  res.status(200).json({
    status: 'success',
    data: refDr,
  });
});

exports.getsearchedRefDr = catchAsync(async (req, res, next) => {
  const { keyword } = req.body;
  const escapedKeyword = keyword.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');

  const refDr = await RefDr.aggregate([
    {
      $match: {
        $or: [
          { name: new RegExp(`^${escapedKeyword}.*`, 'i') },
          { phoneNumber: new RegExp(`^${escapedKeyword}.*`, 'i') },
          { description: new RegExp(`^${escapedKeyword}.*`, 'i') },
        ],
        clinic: req.user.clinic,
      },
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: refDr,
  });
});
exports.ALLgetREfdr = catchAsync(async (req, res, next) => {
  const refDr = await RefDr.find({ clinic: req.user.clinic });

  res.send(refDr);
});
