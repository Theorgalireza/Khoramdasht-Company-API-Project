const {
  BadRequestError,
  CustomAPIError,
  NotFoundError,
  UnauthenticatedError,
} = require("../errors");
const User = require("../models/User");
const { isTokenValid, attachCookiesToResponse, createTokenUser, checkPermission } = require("../utils");

const getAllUsers = async (req, res) => {
  const users = await User.find({ role: "user" }).select("-password");
  if (!users) {
    throw new NotFoundError("Users Not Found");
  }

  res.status(200).json({ users });
};

const getSingleUser = async (req, res) => {
  // console.log(result);
  //   if (req.user.role === "user") {
  //     throw new BadRequestError("You dont have access to this route");
  //   }

  const { id } = req.params;
  const user = await User.findOne({ _id: id, role: "user" }).select("-password").populate({path:'reviews'});

  if (!user) {
    throw new NotFoundError("User not found");
  }

  checkPermission(req.user, user);

  res.status(200).json({ user });
};

const showCurrentUser = async (req, res) => {
  res.status(200).json({ ...req.user });
};

//update user with findOneAndUpdate
// const updateUser = async (req, res) => {
//   const { name, email } = req.body;
//   if (!name || !email) {
//     throw new BadRequestError("Please provide both name and email");
//   }

//   const user = await User.findOneAndUpdate(
//     { _id: req.user.userId },
//     { name, email },
//     { new: true, runValidators: true }
//   ).select("-password");
//   if (!user) {
//     throw new NotFoundError("User not found");
//   }
//   const tokenUser = createTokenUser(user)
//   attachCookiesToResponse({res,user:tokenUser})
// };

//Update user with User.save()
const updateUser = async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    throw new BadRequestError("Please provide both name and email");
  }

  const user = await User.findOne({ _id: req.user.userId });
  user.name = name
  user.email = email
  await user.save()

  if (!user) {
    throw new NotFoundError("User not found");
  }
  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });
};

const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user.userId);
  if (!user) {
    throw new NotFoundError("user not fount");
  }
  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new BadRequestError("Your old password is not correct");
  }
  // 4️⃣ تغییر پسورد و ذخیره (با hash شدن خودکار)
  user.password = newPassword;
  await user.save();

  res.status(200).json({ result });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
