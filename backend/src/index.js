const express = require('express');
const path = require('path');
const morgan = require('morgan');
const statsRouter = require('./routes/stats');
const cors = require('cors');
const { notFound } = require('./middleware/errorHandler');
const getCookie = require('./utils/getCookie');
const createItemsRouter = require('./routes/items');

const app = express();
const logger = require('./middleware/logger');
const port = process.env.PORT || 3001;

const DATA_PATH = process.env.DATA_PATH || path.resolve(__dirname, '../../data/items.json');

app.use(cors({ origin: 'http://localhost:3000' }));
// Basic middleware
app.use(logger);
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/items', createItemsRouter(DATA_PATH));
app.use('/api/stats', statsRouter);

// Not Found
app.use('*', notFound);

getCookie().then(token => {
    console.log('[Mock Token Received]:', token);
});

app.listen(port, () => console.log('Backend running on http://localhost:' + port));

module.exports = app; // Export for testing