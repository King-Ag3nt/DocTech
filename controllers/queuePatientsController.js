// controllers/queuePatientsController.js

const catchAsync = require('../Utiles/catchAsync');
const QueuePatients = require('../models/queuePatients');
const AppError = require('../Utiles/appError');
const socketModule = require('../socket');
// Controller functions
exports.getAllQueuePatients = async (req, res, next) => {
  try {
    const currentDate = new Date();
    const startOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 0, 0, 0);
    const startOfNextDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() + 1,
      0,
      0,
      0,
    );
    const queuePatients = await QueuePatients.find({
      $and: [{ doctor: req.user.clinic }, { date: { $gte: startOfDay, $lt: startOfNextDay } }],
    }).populate('patient');

    req.queue = queuePatients;

    next();
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};

exports.createQueuePatient = async (req, res, next) => {
  try {
    const item = req.body;

    const formdata = {
      createdAt: new Date(),
      patient: item.patient,
      doctor: req.user.clinic,
      HAGZ: item.hagz,
      date: new Date(),
      status: 'inQueue',
    };

    const existingQueue = await QueuePatients.findOne({
      $and: [{ doctor: req.user.clinic }, { patient: item.patient }, { status: 'inQueue' }],
    });
    if (existingQueue) {
      return next(new AppError('This patient is already in queue', 409));
    }

    const newQueuePatient = await (await QueuePatients.create(formdata)).populate('patient');

    const queueLength = await QueuePatients.countDocuments({
      $and: [{ status: 'inQueue' }, { doctor: req.user.clinic }],
    });
    const io = socketModule.getIo(); // Get the socket instance
    io.to(req.user.clinic).emit('queueLength', {
      action: 'post',
      ql: queueLength,
      data: newQueuePatient,
      user: req.user.name,
    });
    res.status(201).json({
      status: 'success',
      newQueuePatient,
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message,
    });
  }
};
exports.updatePendingToInqueue = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const formdata = {
    status: 'inQueue',
    date: new Date(),
  };

  const existingQueue = await QueuePatients.findOne({
    $and: [{ doctor: req.user.clinic }, { patient: id }, { status: 'inQueue' }],
  });
  if (existingQueue) {
    return next(new AppError('This patient is already in queue', 409));
  }
  const updatedQueuePatient = await QueuePatients.findByIdAndUpdate(id, formdata);
  const queueLength = await QueuePatients.countDocuments({
    $and: [{ status: 'inQueue' }, { doctor: req.user.clinic }],
  });
  const io = socketModule.getIo(); // Get the socket instance
  io.to(req.user.clinic).emit('queueLength', {
    action: 'post',
    ql: queueLength,
    data: updatedQueuePatient,
    user: req.user.name,
  });
  res.status(200).json({
    status: 'success',
  });
});
exports.updateQueueToCompleted = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return next(new AppError('You are not authorized to perform this action', 401));
    }
    const deletedQueuePatient = await QueuePatients.findByIdAndUpdate(req.params.id, {
      status: 'completed',
      date: new Date(),
    });
    const queueLength = await QueuePatients.countDocuments({
      $and: [{ status: 'inQueue' }, { doctor: req.user.clinic }],
    });
    const io = socketModule.getIo(); // Get the socket instance
    io.to(req.user.clinic).emit('queueLength', { action: 'delete', ql: queueLength, data: deletedQueuePatient });

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message,
    });
  }
};

exports.DeleteBooking = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const deletedQueuePatient = await QueuePatients.findByIdAndDelete(id);
  const queueLength = await QueuePatients.countDocuments({
    $and: [{ status: 'inQueue' }, { doctor: req.user.clinic }],
  });
  const io = socketModule.getIo(); // Get the socket instance
  io.to(req.user.clinic).emit('queueLength', { action: 'delete', ql: queueLength, data: deletedQueuePatient });

  res.status(200).json({
    status: 'success',
  });
});

exports.getQueuePatientById = async (req, res) => {
  try {
    const queuePatient = await QueuePatients.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: queuePatient,
    });
  } catch (err) {
    res.status(404).json({
      status: 'error',
      message: 'Queue patient not found',
    });
  }
};

exports.updateQueuePatient = async (req, res) => {
  try {
    const updatedQueuePatient = await QueuePatients.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({
      status: 'success',
      data: updatedQueuePatient,
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message,
    });
  }
};

exports.getQueuePatientsWithin24Hours = async (req, res) => {
  try {
    const twentyFourHoursAgo = new Date(new Date() - 24 * 60 * 60 * 1000); // Calculate 24 hours ago
    const queuePatients = await QueuePatients.find({
      createdAt: { $gte: twentyFourHoursAgo },
    });

    res.status(200).json({
      status: 'success',
      data: queuePatients,
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};

// exports.Queuetestingkeepalive = async (req, res) => {
//   try {
//     res.setHeader('Cache-Control', 'no-cache');
//     res.setHeader('Content-Type', 'text/event-stream');
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Connection', 'keep-alive');
//     res.flushHeaders(); // flush the headers to establish SSE with client

//     const intervalID = setInterval(async () => {
//       try {
//         const queueLength = await QueuePatients.countDocuments({
//           $and: [{ status: 'inQueue' }, { doctor: req.user.clinic }],
//         });
//         // Set the latest response to the current queue

//         // Send the latest response to the client

//         res.write(`data: ${JSON.stringify({ queue: queueLength })}\n\n`);
//       } catch (err) {
//         console.error('Error fetching queue:', err);
//       }
//     }, 1000);
//     console.log('client connected');
//     // If client closes connection, stop sending events
//     res.on('close', () => {
//       console.log('client dropped me');
//       clearInterval(intervalID);
//       res.end();
//     });
//   } catch (err) {
//     console.error('Unexpected error:', err);
//     res.status(500).json({
//       status: 'error',
//       message: 'Unexpected error occurred',
//     });
//   }
// };
exports.Queuetestingkeepalive = catchAsync(async (req, res) => {
  const queueLength = await QueuePatients.countDocuments({
    $and: [{ status: 'inQueue' }, { doctor: req.user.clinic }],
  });

  // Set cache-control headers to prevent caching
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  res.status(200).json({
    status: 'success',
    data: queueLength,
  });
});

exports.e7gz = catchAsync(async (req, res, next) => {
  const existingQueue = await QueuePatients.findOne({
    date: req.body.dateTimeObject,
    doctor: req.user.clinic,
  });
  if (existingQueue) {
    return next(new AppError('This date is already taken', 409));
  }
  const formdata = {
    createdAt: new Date(),
    patient: req.body.serial,
    doctor: req.user.clinic,
    date: req.body.dateTimeObject,
    HAGZ: req.body.hagz,
    // this part below is need to change
    status: req.body.status,
    note: req.body.note,
  };
  await QueuePatients.create(formdata);

  res.status(201).json({
    status: 'success',
  });
});
exports.getspsificdate = catchAsync(async (req, res, next) => {
  const { started, ended } = req.params;

  // const endDate = new Date(ended);

  // endDate.setDate(endDate.getDate() + 1);

  // const formattedEndDate = endDate.toISOString().split('T')[0];

  const specificDate = await QueuePatients.find({
    $and: [
      { doctor: req.user.clinic },
      { date: { $gte: started } },
      { date: { $lte: ended } }, // Use the modified endDate here
    ],
  }).populate('patient');

  req.queue = specificDate;
  next();
});

exports.searchbynameorphone = catchAsync(async (req, res, next) => {
  const { keyword } = req.body;
  const escapedKeyword = keyword.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');

  const result = await QueuePatients.aggregate([
    {
      $match: {
        $and: [{ status: 'pending' }, { doctor: req.user.clinic }],
      },
    },
    {
      $lookup: {
        from: 'patients', // Assuming the name of the collection is "patients"
        localField: 'patient', // Field in the QueuePatients collection
        foreignField: '_id', // Field in the patients collection
        as: 'patient', // Alias for the joined documents
      },
    },
    {
      $unwind: '$patient', // Deconstruct the patient array
    },
    {
      $match: {
        $or: [
          { 'patient.name': { $regex: new RegExp(`^${escapedKeyword}.*`, 'i') } },
          { 'patient.phoneNumber': { $regex: new RegExp(`^${escapedKeyword}.*`, 'i') } },
          { 'patient.serial': { $regex: new RegExp(`^${escapedKeyword}.*`, 'i') } },
        ],
      },
    },
  ]);
  if (result.length === 0) {
    return next(new AppError('No patient found with that name or phone number', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      result,
    },
  });
});

exports.verifybooking = catchAsync(async (req, res) => {
  const booking = await QueuePatients.findById(req.params.id);

  if (!booking) {
    return res.status(404).json({
      status: 'error',
      message: 'Booking not found',
    });
  }
  // Toggle the value of 'verified'
  booking.virified = !booking.virified;
  await booking.save();

  res.status(200).json({
    status: 'success',
    data: {
      booking,
    },
  });
});
