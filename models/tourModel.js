const mongoose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    //schema
    name: {
      type: String,
      required: [true, 'A tour must have a name'], //validator
      unique: true, //unique: true, csak egy tour lehet egy name-el
      trim: true,
      maxlength: [40, 'A tour name must have less or equal then 40 characters'],
      minlength: [10, 'A tour name must have more or equal then 10 characters'],
      // validate: [validator.isAlpha, 'Tour name must only contain characters'], //validator
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
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult',
      }, //enum: {}, csak ezeket a stringeket fogadja el
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: function (val) {
        //this only points to current doc on NEW document creation
        return val < this.price;
      },
      message: 'Discount price ({VALUE}) should be below regular price',
      // VALUE access the value of the priceDiscount
    },
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
    secretTour: {
      type: Boolean,
      default: false,
    },
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

// Query middleware
// this keyword points to the current query
// csak bizonyos query-kre működik pl vip vendégeknek

tourSchema.pre(/^find/, function (next) {
  //pre middleware
  this.find({ secretTour: { $ne: true } }); //$ne: nem egyenlő
  this.start = Date.now();
  next();
}); //find, findOne, findOneAndDelete, findOneAndUpdate

// tourSchema.post(/^find/, function (docs, next) {
//   //post middleware
//   console.log(`Query took ${Date.now() - this.start} milliseconds!`);
//   next();
// });

// Aggregation middleware
// this keyword points to the current aggregation object
// csak bizonyos aggregation-kre működik pl vip vendégeknek
// pl: ha egy tour secretTour, akkor azt nem jeleníti meg a response-ban
// remove secretTour from aggregation pipeline
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });

  console.log(this.pipeline());
  next();
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
