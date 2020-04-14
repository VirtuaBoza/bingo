const express = require('express');
const cors = require('cors');
const router = require('./router');
const morgan = require('morgan');
const app = express();
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.use('/api', router);

module.exports = app;
