const express = require('express');
const {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  
} = require('../controller/reviewController');
const { auth, authorizePermission } = require('../middleware/authentication');
const router = express.Router();

router
  .route('/')
  .get(getAllReviews)
  .post(auth, createReview);


router
  .route('/:id')
  .get(getSingleReview)
  .patch(auth, updateReview)
  .delete(auth, authorizePermission('admin'), deleteReview);

module.exports = router;
