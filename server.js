const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cron = require('node-cron');
const loopingController = require('./controllers/looping');
const socketController = require('./controllers/socketController'); // Import the socket controller
const socketModule = require('./socket');

dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
const port = process.env.PORT || 8000;

mongoose.connect(DB).then(() => {
  // eslint-disable-next-line no-console
  console.log('DB Connection successfully');
  cron.schedule(
    '55 23 * * *',
    async () => {
      try {
        console.log('Executing loopingmidnight function...');
        await loopingController.loopingmidnight();
        console.log('loopingmidnight function executed successfully');
      } catch (error) {
        console.error('Error executing loopingmidnight function:', error);
      }
    },
    {
      timezone: 'Africa/Cairo',
    },
  );

  const server = app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`App running on port ${port}`);
  });
  // Initialize socket.io and get the instance
  const io = socketModule.init(server);
  socketController(io); // Pass the socket instance to the controller
});
