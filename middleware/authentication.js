const { UnauthenticatedError } = require("../errors");
const { isTokenValid } = require("../utils/jwt");
const User = require("../models/User");

const auth = async (req, res, next) => {
  const token = req.signedCookies.token;

  // 1. بررسی وجود کوکی
  if (!token) {
    throw new UnauthenticatedError("Authentication invalid");
  }

  try {
    // 2. بررسی صحت توکن JWT
    const payload = isTokenValid({ token });

    // 3. پیدا کردن کاربر از دیتابیس
    const user = await User.findById(payload.userId).select("-password");
    if (!user) {
      throw new UnauthenticatedError("Authentication invalid");
    }

    // 4. اضافه کردن کاربر به req برای استفاده در بقیه routeها
    req.user = {
      userId: user._id,
      name: user.name,
      role: user.role,
    };

    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication invalid");
  }
};

const authorizePermission = (...roles) =>{ //Higher-order function یا «تابع مرتبه بالاتر».
    return (req,res,next)=>{
    const {role} = req.user
    if(!roles.includes(role)){
        throw new UnauthenticatedError('you dont have access to this route')
    }
    next()}
}
module.exports = {auth, authorizePermission};
