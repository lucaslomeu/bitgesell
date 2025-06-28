const notFound = (req, res, next) => {
  const err = new Error('Route Not Found');
  err.status = 404;
  next(err);
}

const errorHandler = (err, req, res, next) => {
  console.error('Erro:', err.message || err);
  res.status(err.status || 500).json({
    message: err.message || 'Interal Server Error',
  });
};

function logError(error) {
  console.error('[LOG ERROR]:', error?.message || error);
}

module.exports = { notFound, errorHandler, logError };