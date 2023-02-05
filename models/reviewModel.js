const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty!'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour.'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user.'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.pre(/^find/, function (next) {
  // this.populate({
  //   path: 'tour', //referenced model to populate
  //   select: 'name', //name will be shown in the response
  // }).populate({
  //   path: 'user',
  //   select: 'name photo', //name and photo will be shown in the response
  // });

  this.populate({
    path: 'user',
    select: 'name photo', //name and photo will be shown in the response
  });

  next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;

// nested routes
// POST /tour/234fad4/reviews access to tour id
// GET /tour/234fad4/reviews
// GET /tour/234fad4/reviews/9098fad
