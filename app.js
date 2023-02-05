const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');

const app = express();

// 1) GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(helmet()); //security http headers

// Development logging
if (process.env.NODE_ENV === 'development') {
  //only in development mode (not in production mode)
  app.use(morgan('dev'));
}

//limiting requests from the same IP 100 requests in an hour
const limiter = rateLimit({
  max: 100, //100 requests from the same IP
  windowMs: 60 * 60 * 1000, //in an hour time window
  message: 'Too many requests from this IP, please try again in an hour!',
});

app.use('/api', limiter); //apply to all routes starting with /api

// Body parser, reading data from body into req.body
app.use(
  express.json({
    limit: '10kb', //limit the size of the body security reason
  })
); //middleware, to read data from body into req.body

// Data sanitization against NoSQL query injection
app.use(mongoSanitize()); //security reason

// Data sanitization against XSS
app.use(xss()); //security reason clean user input from malicious HTML code

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAvarage',
      'maxGroupSize',
      'pirce',
      'difficulty',
    ], //to allow duplicate query parameters
  })
);

// serving static files
app.use(express.static(`${__dirname}/public`)); //middleware, to serve static files

// app.use((req, res, next) => {
//   console.log('Hello from the middleware 👋');
//   next();
// });

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

// 3) ROUTES
app.use('/api/v1/tours', tourRouter); //create sub-application
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

// everything that is not in the above routes
// error handling middleware
// fontos, hogy a middlewarek sorrendje fontos
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server!`,
  // });
  // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  // err.status = 'fail';
  // err.statusCode = 404;
  // next(err);

  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// error handling middleware
app.use(globalErrorHandler);

module.exports = app;
