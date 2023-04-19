const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController')

router
    .route('/')
    .get(reviewController.findAllReviews)
    .post(reviewController.createReview)

// Controller qu'un review appartient à un user :
// router
//     .route('/:id')
//     ...

module.exports = router;