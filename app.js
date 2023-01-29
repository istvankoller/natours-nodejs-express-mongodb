const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  //only in development mode (not in production mode)
  app.use(morgan('dev'));
}

app.use(express.json()); //middleware, to read data from body into req.body
//app.use(express.static(`${__dirname}/public`)); //middleware, to serve static files

app.use((req, res, next) => {
  console.log('Hello from the middleware 👋');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES
app.use('/api/v1/tours', tourRouter); //create sub-application
app.use('/api/v1/users', userRouter);

module.exports = app;
