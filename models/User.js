const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
      minLength: 3,
      maxLength: 50,
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      validate: {
        message: "Please provide valid email",
        validator: validator.isEmail,
      },
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please provide your password"],
      minLength: [8, "Please provide at least 8 length password"],
      validate: {
        validator: (value) =>
          validator.isStrongPassword(value, {
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
          }),
        message:
          "You're password must have at least 1 number,lowercase and uppercase",
      },
    },
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
UserSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "user",
  justOne: false,
});
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return; // فقط وقتی رمز تغییر کرده هش کن
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// UserSchema.methods.createToken = function () {
//   return jwt.sign(
//     { userId: this._id, name: this.name },
//     process.env.JWT_SECRET,
//     { expiresIn: process.env.JWT_LIFETIME }
//   );
// };

UserSchema.methods.comparePassword = async function (password) {
  const isPasswordCorrect = await bcrypt.compare(password, this.password);
  return isPasswordCorrect;
};

// «هر کاربر (User) می‌تونه چند تا Review نوشته باشه،
// ولی در سند User قرار نیست لیست Reviewها ذخیره بشه، فقط وقتی نیاز بود، می‌تونیم با populate اون‌ها رو بیاریم.»


module.exports = mongoose.model("User", UserSchema);
