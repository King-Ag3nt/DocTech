const sharp = require('sharp');
const multer = require('multer');
const fs = require('fs/promises');

const catchAsync = require('../../Utiles/catchAsync');

const AppError = require('../../Utiles/appError');

const PatientRecord = require('../../models/patientRecordModel');
const PatientMRI = require('../../models/patientMRIModel');

const Patient = require('../../models/patientModel');
require('body-parser');

const DateConvertor = date => {
  if (date === null) {
    return (date = 'NO DATE');
  }
  return new Date(date).toLocaleString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

exports.setPatientId = catchAsync(async (req, res, next) => {
  if (req.body) {
    const patientId = await Patient.findOne({ serial: req.params.Id });
    req.body.patient = patientId._id;
  }
  next();
});

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images', 400), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadMRIPhotos = upload.array('MRI');

exports.createPatientRecordNew = catchAsync(async (req, res, next) => {
  // Parse patient data from JSON
  const { numberOfTheFile, patient } = req.body;
  const patientObject = JSON.parse(patient);
  const numberOnjext = JSON.parse(numberOfTheFile);
  if (numberOnjext) {
    const imgFiles = await Promise.all(
      Array.from(req.files.entries()).map(async ([index, file]) => {
        const filename = `MRI-${req.user._id}-${Date.now()}-${index + 1}.jpeg`;

        await sharp(file.buffer).rotate().toFormat('jpeg').jpeg({ quality: 80 }).toFile(`public/img/MRI/${filename}`);

        return filename;
      }),
    );
    Array.from(numberOnjext).forEach(element => {
      for (let i = 0; i < element.many; i += 1) {
        patientObject.pastRadiology[element.where - 1].img.push(imgFiles[i]);
      }
      for (let i = 0; i < element.many; i += 1) {
        imgFiles.shift();
      }
    });
  }
  patientObject.clinic = req.user.clinic;
  patientObject.patient = req.params.Id;
  patientObject.createdAt = Date.now();

  await PatientRecord.create(patientObject);
  res.status(200).json({
    status: 'success', // You may include the modified patient data in the response
  });
});

exports.editPatientRecordNew = catchAsync(async (req, res, next) => {
  const { numberOfTheFile, patient } = req.body;
  const patientObject = JSON.parse(patient);
  const numberOnjext = JSON.parse(numberOfTheFile);
  if (numberOnjext) {
    const imgFiles = await Promise.all(
      Array.from(req.files.entries()).map(async ([index, file]) => {
        const filename = `MRI-${req.user._id}-${Date.now()}-${index + 1}.jpeg`;

        await sharp(file.buffer).rotate().toFormat('jpeg').jpeg({ quality: 80 }).toFile(`public/img/MRI/${filename}`);

        return filename;
      }),
    );
    Array.from(numberOnjext).forEach(element => {
      for (let i = 0; i < element.many; i += 1) {
        patientObject.pastRadiology[element.where - 1].img.push(imgFiles[i]);
      }
      for (let i = 0; i < element.many; i += 1) {
        imgFiles.shift();
      }
    });
  }
  const editedrecord = await PatientRecord.findByIdAndUpdate(req.params.Id, patientObject);
  res.status(200).json({
    status: 'success',
    editedrecord,
  });
});

exports.resizeMRIPhotos = catchAsync(async (req, res, next) => {
  const { numberOfTheFile, formDatas } = req.body;
  const patentdata = JSON.parse(formDatas);

  if (numberOfTheFile) {
    const imgFiles = [];

    // Resizing and saving images
    for (const [index, file] of req.files.entries()) {
      try {
        const filename = `MRI-${req.user._id}-${Date.now()}-${index + 1}.jpeg`;

        await sharp(file.buffer).rotate().toFormat('jpeg').jpeg({ quality: 80 }).toFile(`public/img/MRI/${filename}`);

        imgFiles.push(filename);
      } catch (err) {
        console.error('Error processing file:', err);
        // Handle the error appropriately
      }
    }

    // Reorganizing files based on numberOfFiles
    const numberOfFiles = parseInt(numberOfTheFile, 10);
    const organizedFiles = [];
    let currentIndex = 0;

    while (currentIndex < imgFiles.length) {
      organizedFiles.push(imgFiles.slice(currentIndex, currentIndex + numberOfFiles));
      currentIndex += numberOfFiles;
    }

    // Assigning images to pastRadiology in patentdata
    patentdata.pastRadiology.forEach((element, index) => {
      if (organizedFiles[index] && organizedFiles[index].length > 0) {
        element.img = organizedFiles[index];
      }
    });
  }
  patentdata.clinic = req.user.clinic;
  patentdata.createdAt = Date.now();
  // Creating PatientRecord and sending response

  await PatientRecord.create(patentdata);

  res.status(200).json({
    status: 'success',
  });
});

exports.deleteRecord = catchAsync(async (req, res, next) => {
  const record = await PatientRecord.findByIdAndDelete(req.params.Id);

  res.status(200).json({
    status: 'success',
    data: {
      record,
    },
  });
});

exports.patchRecord = catchAsync(async (req, res, next) => {
  const { formDatas, index } = req.body;

  const patentdata = JSON.parse(formDatas);

  const imgFiles = [];

  if (req.files.length > 0) {
    for (const [index, file] of req.files.entries()) {
      try {
        const filename = `MRI-${req.user._id}-${Date.now()}-${index + 1}.jpeg`;

        await sharp(file.buffer).rotate().toFormat('jpeg').jpeg({ quality: 80 }).toFile(`public/img/MRI/${filename}`);

        imgFiles.push(filename);
      } catch (err) {
        console.error('Error processing file:', err);
        // Handle the error appropriately
      }
    }
  }

  if (index) {
    if (index.length > 0) {
      const indexx = JSON.parse(index);
      indexx.forEach(element => {
        for (let i = 0; i < element.many; i++) {
          if (imgFiles[i]) {
            patentdata.pastRadiology[element.index].img.push(imgFiles[i]);
          }
        }
        for (let i = 0; i < element.many; i++) {
          imgFiles.shift();
        }
      });
    }
  }

  // const patient = await PatientRecord.findById(req.params.Id);

  const patient = await PatientRecord.findByIdAndUpdate(req.params.Id, patentdata);

  res.status(200).json({
    status: 'success',
    data: {
      patient,
    },
  });
});

exports.resizeFilePhoto = catchAsync(async (req, res, next) => {
  const imgFiles = [];

  for (let index = 0; index < req.files.length; index++) {
    const file = req.files[index];
    const filename = `MRI-${req.user._id}-${Date.now()}-${index + 1}.jpeg`;

    await sharp(file.buffer).rotate().toFormat('jpeg').jpeg({ quality: 80 }).toFile(`public/img/MRI/${filename}`);

    imgFiles.push(filename);
  }
  const { name, patient, date } = req.body;
  let IMGMRI = [];

  IMGMRI.push({
    patient: patient,
    image: { name: name, date: date, path: imgFiles },
  });
  IMGMRI = IMGMRI[0];
  console.log(IMGMRI);

  const patientMRI = await PatientMRI.create(IMGMRI);
  res.status(200).json({
    status: 'success',
    data: {
      patientMRI,
    },
  });
});

const filterOutput = data => {
  return data.map(result => {
    const filteredResult = Object.entries(result._doc).reduce((acc, [key, value]) => {
      if (!Array.isArray(value) || value.length > 0) {
        acc[key] = value;
      }
      return acc;
    }, {});

    return filteredResult;
  });
};

exports.createPatientRecord = catchAsync(async (req, res, next) => {
  const patient = await PatientRecord.create(req.body);
  res.status(201).json({
    status: 'success',
    data: patient,
  });
});

exports.getAllPatientRecords = catchAsync(async (req, res, next) => {
  const patientRecord = await PatientRecord.find().populate({
    path: 'patient',
    select: 'name',
  });

  const reso = filterOutput(patientRecord);

  res.status(200).json({ status: 'success', reso });
});

exports.dataSearch = catchAsync(async (req, res, next) => {
  let resualt = await PatientRecord.find({
    $or: [
      {
        'pastRadiology.title': new RegExp('^' + req.body.pastRadiology + '.*', 'i'),
      },
      { diagnose: new RegExp('^' + req.body.diagnose + '.*', 'i') },
      {
        'currentMedications.title': new RegExp('^' + req.body.currentMedications + '.*', 'i'),
      },
      {
        'complaints.title': new RegExp('^' + req.body.complaints + '.*', 'i'),
      },
      {
        'examination.title': new RegExp('^' + req.body.examination + '.*', 'i'),
      },
      {
        'pastMedicalHistories.title': new RegExp('^' + req.body.pastMedicalHistories + '.*', 'i'),
      },
    ],
  })
    .populate({
      path: 'patient',
      select: 'name',
    })
    .select('pastRadiology diagnose examination currentMedications complaints pastMedicalHistories');

  resualt = filterOutput(resualt);

  res.status(200).json({
    status: 'success',
    data: {
      resualt,
    },
  });
});

exports.getOnePatientRecord = catchAsync(async (req, res, next) => {
  console.log(req.params.Id);

  const patientRecord = await PatientRecord.findById(req.params.Id).populate('patient').lean();

  console.log(patientRecord);

  patientRecord.createdAt = DateConvertor(patientRecord.createdAt);

  res.status(200).json({
    status: 'success',
    data: {
      patientRecord,
    },
  });
});

exports.getPatientFiles = catchAsync(async (req, res, next) => {
  const patientMRI = await PatientMRI.find({
    patient: req.params.Id,
  }).lean();
  Array.from(patientMRI).forEach(element => {
    element.image.date = DateConvertor(element.image.date);
  });
  res.status(200).json({
    status: 'success',
    data: {
      patientMRI,
    },
  });
});
exports.getPatientsByDate = async (req, res) => {
  try {
    const nextDay = new Date(req.body.date);
    nextDay.setDate(nextDay.getDate() + 1);

    const queuePatients = await PatientRecord.find({
      $and: [
        { clinic: 'nuroclinic' },
        {
          $expr: {
            $and: [{ $gte: ['$createdAt', req.body.date] }, { $lt: ['$createdAt', nextDay] }],
          },
        },
      ],
    }).populate('patient');

    // Extracting only the 'patient' field from the queuePatients array
    const patients = queuePatients.map(record => record.patient);

    res.status(200).json({
      status: 'success',
      data: patients,
      length: patients.length,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

exports.deleteFiles = async (req, res, next) => {
  const files = await PatientMRI.findByIdAndDelete(req.params.Id);

  if (!files) {
    return res.status(404).json({ status: 'fail', message: 'Files not found' });
  }

  // Use Promise.all for parallel file deletion
  await Promise.all(
    files.image.path.map(async filePath => {
      try {
        // Check if the file exists before unlinking
        await fs.access(`public/img/MRI/${filePath}`, fs.constants.F_OK);

        // If the file exists, proceed with unlinking
        await fs.unlink(`public/img/MRI/${filePath}`);
      } catch (error) {
        // Handle the error or log it
        console.error(`Error while deleting file: ${filePath}`, error);
      }
    }),
  );

  res.status(204).json({ status: 'success' });
};
// const filterOutput = (data) => {
//   return data.map((result) => {
//     const filteredResult = { ...result._doc };

//     for (const key in filteredResult) {
//       if (
//         Array.isArray(filteredResult[key]) &&
//         filteredResult[key].length === 0
//       ) {
//         delete filteredResult[key];
//       }
//     }
//     return filteredResult;
//   });
// };

// exports.resizeMRIPhotos = catchAsync(async (req, res, next) => {

//   const { numberOfTheFile, formDatas } = req.body;
//   const patentdata = JSON.parse(formDatas);
//   const imgFiles = [];

//   for (let index = 0; index < req.files.length; index++) {
//     const file = req.files[index];
//     const filename = `MRI-${req.user._id}-${Date.now()}-${index + 1}.jpeg`;

//     await sharp(file.buffer)
//       .toFormat('jpeg')
//       .toFile(`public/img/MRI/${filename}`);

//     imgFiles.push(filename);
//   }
//   const thefinla = [];

//   Array.from(numberOfTheFile).forEach((element) => {
//     if (element > 0) {
//       const keko = [];
//       for (let index = 0; index < element; index++) {
//         keko.push(imgFiles[index]);
//       }
//       thefinla.push(keko);
//       for (let index = 0; index < element; index++) {
//         imgFiles.pop(imgFiles[index]);
//       }
//     } else {
//       thefinla.push('no data found');
//     }
//   });

//   Array.from(patentdata.pastRadiology).forEach((element, index) => {
//     element.img = thefinla[index];
//   });

//   const patient = await PatientRecord.create(patentdata);

//   res.status(200).json({
//     status: 'success',
//   });
// });
// const { name, patient } = req.body;
// let IMGMRI = [];

// IMGMRI.push({
//   patient: patient,
//   image: { name: name, date: new Date(), path: imgFiles },
// });
// IMGMRI = IMGMRI[0];
// console.log(IMGMRI);

// const patientMRI = await PatientMRI.create(IMGMRI);
// res.status(200).json({
//   status: 'success',
//   data: {
//     patientMRI,
//   },
// });
