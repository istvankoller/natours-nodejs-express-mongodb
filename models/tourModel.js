const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  //schema
  name: {
    type: String,
    required: [true, 'A tour must have a name'], //validator
    unique: true, //unique: true, csak egy tour lehet egy name-el
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
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
