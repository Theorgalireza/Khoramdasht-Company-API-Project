// utils/index.js
const { createJWT, isTokenValid, attachCookiesToResponse } = require('./jwt');
const checkPermission = require('./checkPermission');
const createTokenUser = require('./createTokenUser'); // <-- درست شد (نام صحیح فایل)

module.exports = {
  createJWT,
  isTokenValid,
  attachCookiesToResponse,
  checkPermission,
  createTokenUser,
};
