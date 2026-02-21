const express = require("express");
const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
} = require("../controller/productController");
const { auth, authorizePermission } = require("../middleware/authentication");
const { getSingleProductReviews } = require("../controller/reviewController");

const router = express.Router();

router
  .route("/")
  .get(getAllProducts)
  .post(auth, authorizePermission("admin"), createProduct);

router
  .route("/uploadImage")
  .post(auth, authorizePermission("admin"), uploadImage);

router
  .route("/:id")
  .get(getSingleProduct)
  .patch(auth, authorizePermission("admin"), updateProduct)
  .delete(auth, authorizePermission("admin"), deleteProduct);

router.route("/:id/reviews").get(getSingleProductReviews);
module.exports = router;
