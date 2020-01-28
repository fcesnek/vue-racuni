const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const userRoutes = require('./routes/user');
const billRoutes = require('./routes/bill');
const config = require('./config/config');

const app = express();

app.use(cors());
app.use(morgan('combined'));
app.use(bodyParser.json());

require('./passport');

app.use('/user', userRoutes);
app.use('/bills', billRoutes);

mongoose.set('useCreateIndex', true);

mongoose.connect(config.dbPath, {useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to the database...'))
  .catch((err) => console.error('Could not connect to the database...', err));

app.listen(config.port);
console.log(`App started on port ${config.port}`);


