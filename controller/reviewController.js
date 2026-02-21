const { StatusCodes } = require("http-status-codes");
const Review = require("../models/Review");
const Product = require("../models/Product");
const { BadRequestError } = require("../errors");
const { checkPermission } = require("../utils");

const createReview = async (req, res) => {
  const { product: productId } = req.body;
  const isValidProduct = await Product.find({ _id: productId });
  if (!isValidProduct) {
    throw new BadRequestError(`no product id such${productId}`);
  }
  const alreadySubmitted = await Review.findOne({
    product: productId,
    user: req.user.userId,
  });
  if (alreadySubmitted) {
    throw new BadRequestError(
      "Youre Already submitted your review for thi product"
    );
  }
  req.body.user = req.user.userId;
  const review = await Review.create({ ...req.body });
  res.status(StatusCodes.CREATED).json({ review });
};

const getAllReviews = async (req, res) => {
  const reviews = await Review.find({})
    .populate({ path: "product", select: "name price company" })
    .populate({ path: "user", select: "name role email" });
  res.status(StatusCodes.OK).json({ reviews });
};

const getSingleReview = async (req, res) => {
  const review = await Review.findOne({ _id: req.params.id })
    .populate({ path: "product", select: "name price company" })
    .populate({ path: "user", select: "name role email" });
  res.status(StatusCodes.OK).json({ review });
};

const updateReview = async (req, res) => {
  const review = await Review.findOne({ _id: req.params.id });
  const { title, rating, comment } = req.body;
  if (!review) {
    throw new BadRequestError("No Such A Review");
  }
  checkPermission(req.user, review.user);
  review.title = title;
  review.rating = rating;
  review.comment = comment;

  await review.save();
  res.status(StatusCodes.OK).json({ result });
};

const deleteReview = async (req, res) => {
  const review = await Review.findOne({ _id: req.params.id });
  if (!review) {
    throw new BadRequestError("No Such A Review");
  }
  checkPermission(req.user, review.user);
  review.deleteOne();
  res.status(StatusCodes.OK).json({ msg: "Review Deleted Successfully" });
};

const getSingleProductReviews = async (req, res) => {
  const {id} = req.params
  const reviews = find({product: id})
  if (!reviews){
    throw new BadRequestError("There is no review for such product")
  }
  res.status(StatusCodes.OK).json({reviews})
};

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  getSingleProductReviews
};
