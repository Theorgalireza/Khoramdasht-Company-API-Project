#### Khoramdasht Company API

A practical checklist-style README to build an Express + MongoDB backend (auth, users, products, reviews, orders). Use this as a copy-paste-ready blueprint.

---

### Setup — Basic Express Server
- [ ] import `express` and assign to a variable  
- [ ] define a `PORT` (default `5000`) and a function to start the server

---

### Database Connection
- [ ] obtain the MongoDB connection string  
- [ ] add `.env` and set `MONGO_URL=<your_connection_string>`  
- [ ] install and configure `dotenv` and load env vars early in the app  
- [ ] implement `connect()` helper and call it from the server starter  
- [ ] restart server after changes  
- [ ] note: use Mongoose v6+ compatibility information (API differences / deprecations)

---

### Routes & Middleware — Basics
- [ ] add a root `GET /` route  
- [ ] enable `express.json()` middleware to parse JSON bodies  
- [ ] implement a 404 middleware (for unmatched routes) and an errorHandler middleware (centralized error handling)  
- [ ] install and import `express-async-errors` to avoid try/catch boilerplate

---

### 404 vs ErrorHandler Middleware
- 404 middleware: respond when no route matches  
- errorHandler middleware: catch thrown errors and send unified responses

---

### Logging
- Morgan logging middleware (optional): https://www.npmjs.com/package/morgan

---

### User Model
- [ ] create `models/User.js`  
- [ ] schema fields: `name`, `email`, `password` (all `String`)  
- [ ] export the Mongoose model

---

### Validator Package
- Validator utility (optional): https://www.npmjs.com/package/validator

---

### Auth Routes Structure
- [ ] create `controllers/` folder  
- [ ] add `authController.js` and export `register`, `login`, `logout` functions  
- [ ] for initial testing, return a simple string (e.g., `res.send('register')`)  
- [ ] create `routes/` folder and `authRoutes.js`  
- [ ] import controllers and wire routes:
  - `POST /register`
  - `POST /login`
  - `GET /logout`  
- [ ] in `app.js` mount: `app.use('/api/v1/auth', authRouter)`

---

### Test Endpoints (Postman)
- [ ] verify `register`, `login`, `logout` endpoints via Postman

---

### Register Controller — Implementation Checklist
- [ ] create user document on register  
- [ ] (testing) return the whole user object initially  
- [ ] check for existing email before creating (schema + controller check)  
- [ ] ignore or prevent `role` escalation from client input  
- [ ] optionally implement an admin creation flow separately

---

### Password Handling (Secure Storage)
- [ ] add `UserSchema.pre('save')` hook  
  - `this` references the user document  
  - use `bcrypt.genSalt()` with appropriate rounds  
  - `bcrypt.hash()` the password before saving

---

### JWT Authentication
- [ ] install `jsonwebtoken`  
- [ ] create tokens with `jwt.sign(payload, secret, options)`  
- [ ] verify tokens with `jwt.verify(token, secret)`  
- [ ] add `.env` variables: `JWT_SECRET` and `JWT_LIFETIME` (e.g., `1d`)  
- [ ] restart the server after env changes  
- [ ] refactor token creation into `utils/` (helper functions)  
- [ ] refactor cookie handling into a helper (e.g., `attachCookiesToResponse`) that accepts `(res, tokenUser)` and sets secure cookies  
- [ ] optionally return token data in response body

---

### Login Route Requirements
- [ ] validate presence of `email` and `password`, return 400 if missing  
- [ ] find user by email; if not found return 401  
- [ ] compare password, return 401 on mismatch  
- [ ] on success, attach cookie and return same payload as register

---

### Logout Route
- [ ] set auth cookie to a dummy value and set `expires: new Date(Date.now())` to clear it

---

### User Routes Structure
- [ ] create `controllers/userController.js` exporting:
  - `getAllUsers`, `getSingleUser`, `showCurrentUser`, `updateUser`, `updateUserPassword`  
- [ ] make `routes/userRoutes.js` and register a route (e.g., `router.route('/').get(getAllUsers)`)  
- [ ] in `app.js` mount: `app.use('/api/v1/users', userRouter)`

---

### GetAllUsers & GetSingleUser
- [ ] `getAllUsers`: return users with `role: 'user'`, exclude `password` field  
- [ ] `getSingleUser`: find by `req.params.id`, exclude `password`, return 404 if not found

---

### Authenticate User — Setup
- [ ] implement middleware to validate JWT from cookies/headers and set `req.user`

---

### Authorization — Permissions
- [ ] create a `checkPermissions` helper (initially can be hardcoded)  
- [ ] later expand to accept params for roles or resource ownership checks

---

### ShowCurrentUser
- [ ] read authenticated user from `req.user` and return it in response

---

### Update User Password
- [ ] require `authenticateUser` middleware on route  
- [ ] validate `oldPassword` and `newPassword` presence, return 400 if missing  
- [ ] fetch user by `req.user.userId`  
- [ ] verify `oldPassword` via `user.comparePassword()`; return 401 if not matching  
- [ ] set `user.password = newPassword` and `await user.save()`

---

### createTokenUser (Utils)
- [ ] add `utils/createTokenUser.js` that accepts a user object and returns the payload used in tokens (e.g., `{ userId, name, role }`)  
- [ ] export and use across auth flows

---

### Update User (findOneAndUpdate)
- [ ] protect route with `authenticateUser`  
- [ ] validate `name` and `email` in request body (optional)  
- [ ] update with `findOneAndUpdate()` and return updated tokenUser + attach cookie

---

### Update User (document.save)
- [ ] alternative approach: modify `user` doc fields and `await user.save()` to trigger hooks

---

### Apply checkPermissions()
- [ ] add `checkPermissions` calls where admin-only or owner-only access is required

---

### Product Model
- [ ] create `models/Product.js` with schema fields:
  - `name: { type: String }`
  - `price: { type: Number }`
  - `description: { type: String }`
  - `image: { type: String }`
  - `category: { type: String }`
  - `company: { type: String }`
  - `colors: { type: [String] }`
  - `featured: { type: Boolean }`
  - `freeShipping: { type: Boolean }`
  - `inventory: { type: Number }`
  - `averageRating: { type: Number }`
  - `user` (reference to creator)
  - timestamps enabled  
- [ ] export Product model

---

### Product Controllers & Routes
- [ ] add `controllers/productController.js` exporting:
  - `createProduct`, `getAllProducts`, `getSingleProduct`, `updateProduct`, `deleteProduct`, `uploadImage`  
- [ ] create `routes/productRoutes.js` and wire routes  
- [ ] make `getAllProducts` and `getSingleProduct` public, restrict others to `admin` (use middlewares)  
- [ ] add route: `router.route('/uploadImage').post(uploadImage)`  
- [ ] mount in `app.js`: `app.use('/api/v1/products', productRouter)`

---

### Create Product (Server-side)
- [ ] attach `user` field to `req.body` using `req.user.userId`  
- [ ] call `Product.create(req.body)` and return the created product

---

### Remaining Product CRUD
- [ ] implement `getAllProducts`, `getSingleProduct`, `updateProduct`, `deleteProduct`  
- [ ] enforce `admin` role where required

---

### Upload Image
- [ ] follow file upload tutorial / course reference (e.g., 07-file-upload)  
- [ ] store images in `public/images` or similar

---

### Review Model
- [ ] create `models/Review.js` with fields:
  - `rating: { type: Number }`
  - `title: { type: String }`
  - `comment: { type: String }`
  - `user` (ref)
  - `product` (ref)
  - timestamps enabled  
- [ ] export Review model

---

### Review Controllers & Routes
- [ ] create `controllers/reviewController.js` exporting:
  - `createReview`, `getAllReviews`, `getSingleReview`, `updateReview`, `deleteReview`  
- [ ] create `routes/reviewRoutes.js` and wire routes  
- [ ] `getAllReviews` and `getSingleReview` → public  
- [ ] other review routes → authenticated users only  
- [ ] mount in `app.js`: `app.use('/api/v1/reviews', reviewRouter)`

---

### Create Review Flow
- [ ] require `product` in request body  
- [ ] attach `user` via `req.user.userId`  
- [ ] create review document

---

### Get All / Single Review
- [ ] public endpoints for listing and retrieving reviews

---

### Delete Review
- [ ] get `reviewId` from `req.params`  
- [ ] check review exists, if not → 404  
- [ ] check permissions (`req.user` vs `review.user`)  
- [ ] `await review.remove()` and return 200 on success

---

### Update Review
- [ ] get `id` from params and `{ rating, title, comment }` from body  
- [ ] validate existence, permissions, then update fields and `await review.save()`; respond 200

---

### Populate & Virtuals
- [ ] add population between products and reviews where required  
- [ ] consider Mongoose virtuals for aggregated fields (e.g., `product.reviews`)

---

### Get Single Product Reviews
- [ ] implement route to return all reviews for a product (populate user info as needed)

---

### Remove All Reviews (Admin)
- [ ] provide an admin-only endpoint to clear reviews if necessary (慎 use)

---

### Aggregation Pipeline
- [ ] use MongoDB aggregation (Atlas or code) for analytics (e.g., average rating, sales)

---

### Order Schema
- [ ] create `models/Order.js` with:
  - `tax: Number`
  - `shippingFee: Number`
  - `subtotal: Number`
  - `total: Number`
  - `orderItems: []`
  - `status: String`
  - `user` (ref)
  - `clientSecret: String`
  - `paymentId: String`
  - timestamps enabled  
- [ ] export Order model

---

### Order Controllers & Routes
- [ ] add `controllers/orderController.js` exporting:
  - `getAllOrders`, `getSingleOrder`, `getCurrentUserOrders`, `createOrder`, `updateOrder`  
- [ ] create `routes/orderRoutes.js` and wire routes  
- [ ] require authentication on order routes  
- [ ] `getAllOrders` → admin only  
- [ ] `router.route('/showAllMyOrders').get(getCurrentUserOrders)`  
- [ ] mount in `app.js`: `app.use('/api/v1/orders', orderRouter)`

---

### Orders in Postman
- [ ] test all order scenarios (create, list, single, update) via Postman

---

### Create Order (Complex Flow)
- [ ] implement logic to assemble order items, calculate totals, integrate payment provider (clientSecret), and save order

---

### Get All / Single Orders
- [ ] `getAllOrders` (admin), `getSingleOrder` (permission-checked)

---

### Get Current User Orders
- [ ] query orders where `user === req.user.userId`

---

### Update Order (Payment Callback)
- [ ] receive `paymentIntentId` (from request body)  
- [ ] fetch order by id, 404 if not found  
- [ ] permission check  
- [ ] set `paymentIntentId`, `status = 'paid'` and `await order.save()`

---

### API Documentation & Postman
- [ ] export Postman collection for the API  
- [ ] consider `docgen` for static docs: https://github.com/thedevsaddam/docgen  
- [ ] example: `docgen build -i collection.json -o index.html` and serve `index.html` from `public/`

---

### Security Middleware & Packages
- [ ] express-rate-limit  
- [ ] helmet  
- [ ] xss-clean  
- [ ] express-mongo-sanitize  
- [ ] cors (configure cookie settings and allowed origins)

---

## Additional Notes
- Keep code modular: separate `controllers`, `routes`, `models`, `middleware`, and `utils`.  
- Add tests and CI later.  
- Document endpoints and include Postman export in `docs/`.

---

### Other features coming soon...
- Advanced analytics, admin dashboards, background jobs, improved file storage, etc.
