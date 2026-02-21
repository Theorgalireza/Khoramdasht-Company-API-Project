const mongoose = require("mongoose");
const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Please provide product name"],
      maxLength: [100, "Name can not be more than 100 characters"],
    },
    price: {
      type: Number,
      required: [true, "Please provide product price"],
      default: 0,
    },
    description: {
      type: String,
      required: [true, "Please provide product discription"],
      maxLength: [100, "Discription can not be more than 100 character"],
    },
    image: {
      type: String,
      // default: in Front end or backend
    },
    category: {
      type: String,
      required: [true, "Please provide product category"],
      enum: ["Electronic", "Home Things", "office", "bedroom", "kitchen"],
    },
    company: {
      type: String,
      required: [true, "Please provide product company"],
      enum: {
        values: ["ikea", "liddy", "marcos"],
        message: "{VALUE} is not supported",
      },
    },
    colors: {
      type: [String],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    freeShipping: {
      type: Boolean,
      default: false,
    },
    inventory: {
      type: Number,
      required: true,
      default: 15, //imagine
    },
    averageRating: {
      type: Number,
      min: 1,
      max: 5,
      default: 1,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

ProductSchema.virtual("reviews", {
  ref: "Review", // مدلی که می‌خوای وصل بشه
  localField: "_id", // فیلد داخلی در Product
  foreignField: "product", // فیلدی در Review که به Product اشاره می‌کنه
  justOne: false, // چون ممکنه چندتا review داشته باشه
});

ProductSchema.pre("remove", async function (next) {
  await this.model("Review").deleteMany({ product: this._id });
});
// 🔍 ۴. چرا نگفت Review.findAndDelete()؟

// سه دلیل اصلی 👇

// در اون فایل احتمالاً فقط مدل Product import شده، نه Review.
// پس اگر بخواد Review.findAndDelete() بنویسه، باید Review رو جداگانه require کنه.

// داخل pre('remove')، تمرکز روی سند جاری (this) است، نه مدل کلی.
// نوشتن this.model('Review') یعنی:
// "از درون همین context، برو سراغ مدل Review"

// اگر پروژه‌ای با چند اتصال MongoDB باشه،
// استفاده از Review.findAndDelete() ممکنه به دیتابیس اشتباهی وصل بشه.
// ولی this.model('Review') دقیقاً در همان اتصال کار می‌کند.

module.exports = mongoose.model("Product", ProductSchema);
