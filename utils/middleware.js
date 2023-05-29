const logger = require('./logger');
const morgan = require('morgan');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

morgan.token('body', function (req) {
  return JSON.stringify(req.body);
});

const logFormat =
  ':method :url :status :res[content-length] - :response-time ms :body';


const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '');
  }
  // else response.status(401).end();
  next();
};

const userExtractor = async(request, response, next) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' });
  }
  const user = await User.findById(decodedToken.id);
  request.user = user;
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: error.message });
  }

  next(error);
};

module.exports = {
  requestLogger: morgan,
  logFormat,
  tokenExtractor,
  userExtractor,
  unknownEndpoint,
  errorHandler,
};
