const { StatusCodes } = require("http-status-codes");
const Product = require("../models/Product");
const { checkPermission } = require("../utils");
const User = require("../models/User");
const path = require("path");
const { BadRequestError } = require("../errors");

const createProduct = async (req, res) => {
  req.body.user = req.user.userId;
  const product = await Product.create({ ...req.body });
  res.status(StatusCodes.CREATED).json({ product });
};

const getAllProducts = async (req, res) => {
  const { featured, company, search, sort, fields, limit, page, numericFilters } = req.query;
  const queryObject = {};

  if (featured) queryObject.featured = featured === "true";
  if (company) queryObject.company = company;
  if (search) queryObject.name = { $regex: search, $options: "i" };

  if (numericFilters) {
    const operatorMap = { ">": "$gt", ">=": "$gte", "=": "$eq", "<": "$lt", "<=": "$lte" };
    const regEx = /\b(<|<=|=|>|>=)\b/g;
    let filters = numericFilters.replace(regEx, (match) => `-${operatorMap[match]}-`);
    const options = ["price", "rating"];
    filters.split(",").forEach((item) => {
      const [field, operator, value] = item.split("-");
      if (options.includes(field)) queryObject[field] = { [operator]: Number(value) };
    });
  }

  let result = Product.find(queryObject);

  // sorting
  result = sort ? result.sort(sort.split(",").join(" ")) : result.sort("createdAt");

  // selecting fields
  if (fields) result = result.select(fields.split(",").join(" "));

  // pagination
  const limitNum = Number(limit) || 10;
  const pageNum = Number(page) || 1;
  const skip = (pageNum - 1) * limitNum;
  result = result.skip(skip).limit(limitNum).populate("reviews");

  const products = await result;
  res.status(StatusCodes.OK).json({ products, count: products.length });
};


const getSingleProduct = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById({ _id: id });
  res.status(StatusCodes.OK).json({ product });
};

const updateProduct = async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id });
  if (!product) {
    throw new NotFoundError(`No product with id: ${req.params.id}`);
  }

  checkPermission(req.user, product.user);

  const updatedProduct = await Product.findOneAndUpdate(
    { _id: req.params.id },
    { ...req.body },
    { new: true, runValidators: true }
  );

  res.status(StatusCodes.OK).json({ product: updatedProduct });
};

const deleteProduct = async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id });
  if (!product) {
    throw new NotFoundError(`No product with id: ${req.params.id}`);
  }
  checkPermission(req.user, product.user);
  await product.remove();
  res.status(StatusCodes.OK).json({ msg: "Product deleted successfully" });
};

const uploadImage = async (req, res) => {
  // check if file exists
  if (!req.files) {
    throw new BadRequestError("No File Uploaded");
  }

  // check format
  const productImage = req.files.image;
  if (!productImage.mimetype.startsWith("image")) {
    throw new BadRequestError("Please upload an image.");
  }

  // check size
  const maxSize = 1024 * 1024;
  if (productImage.size > maxSize) {
    throw new BadRequestError("Image size must be smaller 1MB");
  }

  const now = new Date();
  const formattedDate = now.toISOString().replace(/[:.]/g, "-");
  // 2025-10-13T14-20-31-123Z
  const imageName = `${formattedDate}-${productImage.name}`;
  const imagePath = path.join(__dirname, "../public/uploads/", imageName);
  await productImage.mv(imagePath);

  res.status(StatusCodes.OK).json({ image: { src: `/uploads/${imageName}` } });
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
};
