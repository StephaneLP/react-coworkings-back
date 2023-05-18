const express = require('express');
const router = express.Router();
const coworkingController = require('../controllers/coworkingController')
const authController = require('../controllers/authController')

router
    .route('/')
    .get(coworkingController.findAllCoworkings)
    .post(coworkingController.createCoworking)

router
    .route('/withReview')
    .get(coworkingController.findAllCoworkingsWithReview)
    .post(coworkingController.createCoworking)

router
    .route('/:id')
    .get(coworkingController.findCoworkingByPk)
    // .put(authController.protect, coworkingController.updateCoworking)
    .put(coworkingController.updateCoworking)
    // .delete(authController.protect, authController.restrictTo('admin'), coworkingController.deleteCoworking)
    .delete(coworkingController.deleteCoworking)
    // .delete(authController.protect, coworkingController.deleteCoworking)

module.exports = router;
