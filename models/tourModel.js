const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
  {
    //schema
    name: {
      type: String,
      required: [true, 'A tour must have a name'], //validator
      unique: true, //unique: true, csak egy tour lehet egy name-el
      trim: true,
    },
    slug: String,
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
    ratingsAverage: {
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
      select: false, //select: false, nem jelenik meg a response-ban
    },
    startDates: [Date],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
// document middleware: runs before .save() and .create()
// not working with insertMany()
// this keyword points to the current document
//slug: egyedi azonosító, ami a name alapján generálódik
tourSchema.pre('save', function (next) {
  //pre middleware
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.pre('save', function (next) {
//   //pre middleware
//   console.log('Will save document...');
//   next();
// });

// tourSchema.post('save', function (doc, next) {
//   //post middleware
//   console.log(doc);
//   next();
// }); //post the final document

tourSchema.virtual('durationWeeks').get(function () {
  //virtual property
  return this.duration / 7;
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
