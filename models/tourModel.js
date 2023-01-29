const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  //schema
  name: {
    type: String,
    required: [true, 'A tour must have a name'], //validator
    unique: true, //unique: true, csak egy tour lehet egy name-el
    trim: true,
  },
  duration: {
    type: Number,
    required: [true, 'A tour must have a duration'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a group size'],
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty'],
  },
  ratingsAvarage: {
    type: Number,
    default: 4.5,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true, //trim: true, levágja a whitespace-t a string elejéről és végéről
    required: [true, 'A tour must have a description'],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have a cover image'],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(), //timestamp
  },
  startDates: [Date],
});

const Tour = mongoose.model('Tour', tourSchema); //model

module.exports = Tour;

//     //save to database
// const testTour = new Tour({
//   name: 'The Park Camper',
//   rating: 4.7,
//   price: 997,
// });

// testTour
//   .save()
//   .then((doc) => {

//     console.log(doc);
//   })
//   .catch((err) => {
//     console.log('ERROR: ', err);
//   });
