const { UnauthenticatedError } = require("../errors");

const checkPermission = (requestUser, resourceUser) => {
  if (requestUser.role === "admin") return;
  if (requestUser.userId === resourceUser._id.toString()) return;
  throw new UnauthenticatedError("You don't have access to this route");
};
module.exports = checkPermission;
