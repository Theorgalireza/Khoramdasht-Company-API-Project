const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const {
  CustomAPIError,
  UnauthenticatedError,
  NotFoundError,
  BadRequestError,
} = require("../errors");
const { attachCookiesToResponse ,createTokenUser} = require("../utils");
const cookieParser = require("cookie-parser");

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError('User Doesn"t Exist');
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (isPasswordCorrect === false) {
    throw new UnauthenticatedError("Password is not correct");
  }
  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });
  // res.send("login");
};
const logout = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.send("logout"); // no need to res
};
const register = async (req, res) => {
  //importing manually for better security
  const { email, name, password } = req.body;

  //checking email if its exists
  const isEmailExists = await User.findOne({ email });
  if (isEmailExists) {
    throw new BadRequestError("Email already exists.");
  }

  //first account is admin
  const isFisrtAcount = (await User.countDocuments({})) === 0;
  const role = isFisrtAcount ? "admin" : "user";

  //creating user
  const user = await User.create({ name, email, password, role });
  if (!user) {
    throw new BadRequestError("Please try again");
  }

  //response
  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });
  // res.status(StatusCodes.CREATED).json({ user });
};

module.exports = { login, logout, register };
