require("dotenv").config();
require("express-async-errors");

//import routers
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const productRouter = require("./routes/poductRoutes");
const reviewRouter = require("./routes/reviewRoutes");

//express
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

//rest of packages
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

//database
const connectDB = require("./db/connect");

//middlewares
const errorHandlerMiddleware = require("./middleware/error-handler");
const notFoundMiddleware = require("./middleware/not-found");
const { auth } = require("./middleware/authentication");

app.use(morgan("combined"));
app.use(express.json());
app.use(express.static("./public"));
app.use(cookieParser(process.env.JWT_SECRET));
app.use(fileUpload());
//Routes
app.get("/", (req, res) => {
  console.log(req.cookies);

  res.send("<h1>Home Page</h1>");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", auth, userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server is starting on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};
start();
