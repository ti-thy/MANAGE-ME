const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/authRouter');
const usersRouter = require('./routes/usersRouter');
const emailAccountsRouter = require('./routes/emailAccountRouter');
const eventsRouter = require('./routes/eventsRouter');
const notificationsRouter = require('./routes/notificationRouter');
require('./auth');
require('dotenv').config();

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(passport.initialize());

app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/email-accounts', emailAccountsRouter);
app.use('/events', eventsRouter);
app.use('/notifications', notificationsRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

module.exports = app;