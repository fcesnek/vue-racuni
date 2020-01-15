const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');

const config = require('./config/config');

const app = express();

app.use(cors());
app.use(morgan('combined'));

mongoose.connect(config.dbPath, {useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to the database...'))
  .catch((err) => console.error('Could not connect to the database...', err))

app.listen(config.port);
console.log(`App started on port ${config.port}`);


