const mongoose = require('mongoose');

const slugify = require('slugify');

const patientSchema = new mongoose.Schema(
  {
    createdAt: { type: Date, default: Date.now() },
    name: {
      type: String,
      required: [true, 'Patient must have a name'],
      trim: true,
    },
    refDR: {
      type: String,
    },
    sex: {
      type: String,
      enum: ['Male', 'Female'],
      required: [true, 'Patient must have a sex'],
    },
    birthDate: {
      type: Date,
      required: [true, 'Patient must have a Birth Date'],
    },
    age: {
      type: Number,
      required: [true, 'Pateint must have an age'],
    },
    idNo: {
      type: String,
      // default: 'No data found',
    },
    phoneNumber: {
      type: String,
      required: [true, 'Patient must have a Phone number'],
    },
    secondNumber: {
      type: String,
    },
    area: {
      type: String,
      required: [true, 'Patient must have an area'],
    },
    occupation: {
      // type: Boolean,
      type: String,
      // default: 'No data found',
    },
    maritalStatus: {
      type: String,
      enum: ['Single', 'Engaged', 'Married', 'Divorced', 'Widowed'],
      required: [true, 'Must specifiy the Marital Status'],
    },
    numbOfKids: {
      type: Number,
      default: 0,
    },
    yougest: {
      type: Number,
      default: 0,
    },
    pregnancyPlans: {
      // type: Boolean,
      type: String,
      // default: 'No data found',
    },
    contraception: {
      // type: Boolean,
      type: String,
      // default: 'No data found',
    },
    pregnant: {
      type: Boolean,
      default: false,
    },
    breastFeeding: {
      type: Boolean,
      default: false,
    },
    country: {
      type: String,
    },
    // parentalConsanguinity: {
    //   // type: Boolean,
    //   type: String,
    //   // default: 'No data found',
    // },
    familyHistOfMS: {
      // type: Boolean,
      type: String,
      // default: 'No data found',
    },
    familyHistOfAutoDis: {
      // type: Boolean,
      type: String,
      // default: 'No data found',
    },
    comorbidities: {
      // type: Boolean,
      type: String,
      // default: 'No data found',
    },
    // comorbiditiesYes: {
    //   type: String,
    //   // default: 'No data found',
    // },
    smoking: {
      // type: Boolean,
      type: String,
      default: 'No data found',
    },
    alcohol: {
      // type: Boolean,
      type: String,
      default: 'No data found',
    },
    drugAbuse: {
      // type: Boolean,
      type: String,
      default: 'No data found',
    },
    drugType: {
      title: String,
      date: { type: Date, default: Date.now },
    },
    // drugSince: {
    //   // type: Date,
    //   type: String,
    //   // default: 'No data found',
    // },
    // drugRelatedOthers: {
    //   type: String,
    //   // default: 'No data found',
    // },
    serial: {
      type: String,
      required: true,
      unique: true,
    },
    clinic: String,
    //Schema Later
    // relapces: {
    //   type: String,
    //   // default: 'No data found',
    // },
    slug: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);
patientSchema.index({ name: 'text', serial: 1, phoneNumber: 1 }, { unique: true });

patientSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// patientSchema.pre('save', async function (nenxt) {
//   if (!this.isNew) {
//     // Skip if not a new document
//     return next();
//   }

//   // Find the latest patient and get its serial number
//   const latestPatient = await this.constructor.findOne(
//     {},
//     {},
//     { sort: { serial: -1 } },
//   );
//   const lastSerial = latestPatient ? latestPatient.serial : 0;

//   // Set the new serial number
//   this.serial = lastSerial + 1;
//   next();
// });

// Assuming 'patientSchema' is your Mongoose schema
patientSchema.post(/^find/, async (result, next) => {
  const today = new Date();

  try {
    if (!Array.isArray(result)) {
      const patient = result instanceof mongoose.Document ? result.toObject() : result;
      let age = today.getFullYear() - patient.birthDate.getFullYear();
      if (
        today.getMonth() < patient.birthDate.getMonth() ||
        (today.getMonth() === patient.birthDate.getMonth() && today.getDate() < patient.birthDate.getDate())
      ) {
        age -= 1;
      }
      patient.age = age;

      // Update the document with the calculated age
      await Patient.updateOne({ _id: patient._id }, { $set: { age: patient.age } });
    } else {
      // If 'result' is an array of documents
      await Promise.all(
        result.map(async patient => {
          let age = today.getFullYear() - patient.birthDate.getFullYear();
          if (
            today.getMonth() < patient.birthDate.getMonth() ||
            (today.getMonth() === patient.birthDate.getMonth() && today.getDate() < patient.birthDate.getDate())
          ) {
            age -= 1;
          }
          patient.age = age;

          // Update each document with the calculated age
          await Patient.updateOne({ _id: patient._id }, { $set: { age: patient.age } });
        }),
      );
    }

    next();
  } catch (err) {
    console.error('Error updating patient with age:', err);
    next(err); // Pass the error to the next middleware or callback
  }
});

patientSchema.virtual('patientRecord', {
  ref: 'PatientRecord',
  foreignField: 'patient',
  localField: '_id',
});
patientSchema.virtual('Relapses', {
  ref: 'Relapses',
  foreignField: 'patient',
  localField: '_id',
});

patientSchema.virtual('patientScale', {
  ref: 'PatientScale',
  foreignField: 'patient',
  localField: '_id',
});
patientSchema.virtual('queuePatients', {
  ref: 'QueuePatients',
  foreignField: 'patient',
  localField: '_id',
});

patientSchema.virtual('patientLaboratory', {
  ref: 'PatientLaboratory',
  foreignField: 'patient',
  localField: '_id',
});
patientSchema.virtual('patientMRI', {
  ref: 'PatientMRI',
  foreignField: 'patient',
  localField: '_id',
});

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;
