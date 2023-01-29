const express = require('express');
const tourController = require('../controllers/tourController');
// const { getAllTours, createTour, getTour, updateTour, deleteTour } = require('./../controllers/tourController');
// ilyenkor nem kell tourController.getAllTours, hanem csak getAllTours
const router = express.Router();

// router.param('id', tourController.checkID);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
