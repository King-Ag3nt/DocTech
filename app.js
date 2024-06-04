const path = require('path');
const express = require('express');
const compression = require('compression');
const cookies = require('cookie-parser');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./Routes/userRoutes');
const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./Utiles/appError');

const app = express();

app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookies());

app.use(bodyParser.json());

helmet.contentSecurityPolicy({
  useDefaults: false,
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", 'https://cdn.jsdelivr.net', 'https://unpkg.com'],
    objectSrc: ["'none'"],
    upgradeInsecureRequests: [],
  },
});

app.use(xss());
app.use(mongoSanitize());
app.use(hpp());
app.use(cors());
app.use(compression());

// eslint-disable-next-line no-console
console.log(process.env.NODE_ENV);

//routes config
const patientRecordRoutes = require('./Routes/patientRecordRoutes');
const patientRoutes = require('./Routes/patientRoutes');
const relapsesRoutes = require('./Routes/relapsesRoutes');
const patientLaboratoryRoutes = require('./Routes/patientLaboratoryRoutes');
const queuePatientsRoutes = require('./Routes/queuePatientsRoutes');
const preSetRoutes = require('./Routes/preSetRoutes');
const statisticsRoutes = require('./Routes/statisticsRoutes');
const REFDRRoutes = require('./Routes/REFDRRoutes');
const PreScriptionRoutes = require('./Routes/PreScriptionRoutes');
const viewRoutes = require('./Routes/viewRoutes');

app.use('/api/v1/user', userRoutes);
app.use('/api/v1/queue', queuePatientsRoutes);
app.use('/api/v1/patient', patientRoutes);
app.use('/api/v1/relapses', relapsesRoutes);
app.use('/api/v1/preSetRoutes', preSetRoutes);
app.use('/api/v1/Laboratory', patientLaboratoryRoutes);
app.use('/api/v1/REFDR', REFDRRoutes);
app.use('/api/v1/statistics', statisticsRoutes);
app.use('/api/v1/patient/patientRecord', patientRecordRoutes);
app.use('/api/v1/Prescription', PreScriptionRoutes);

app.use('/', viewRoutes);

app.all('*', (req, res, next) => {
  next(new AppError(`Cant find ${req.originalUrl} on this server!`, 404));
});
app.use(globalErrorHandler);
module.exports = app;
