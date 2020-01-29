const express = require('express');
const cors = require('cors');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const userRoutes = require('./routes/user');
const billRoutes = require('./routes/bill');
const config = require('./config/config');

const app = express();

app.use(cors());
app.use(bodyParser.json());

if(process.env.NODE_ENV !== 'production') {
  const morgan = require('morgan');
  app.use(morgan('combined'));
}

require('./passport');

app.use('/user', userRoutes);
app.use('/bills', billRoutes);

if(process.env.NODE_ENV === 'production') {
  app.use(express.static(__dirname + '/public/'));
  app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'));
}
mongoose.set('useCreateIndex', true);

mongoose.connect(config.dbPath, {useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to the database...'))
  .catch((err) => console.error('Could not connect to the database...', err));

app.listen(config.port);
console.log(`App started on port ${config.port}`);


