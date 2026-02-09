require("dotenv").config();

const express = require("express");
const ErrorHandler = require("./middleware/error");
const connectDatabase = require("./db/Database");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();

// ================= CONNECT DATABASE =================
connectDatabase();

// ================= MIDDLEWARES =================
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Static uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ================= TEST ROUTES =================
app.get("/", (req, res) => {
  res.send("Backend Running 🚀");
});

app.get("/test", (req, res) => {
  res.send("Hello World!");
});

// ================= ROUTES =================
const user = require("./controller/user");
const shop = require("./controller/shop");
const product = require("./controller/product");
const event = require("./controller/event");
const coupon = require("./controller/coupounCode");
const payment = require("./controller/payment");
const order = require("./controller/order");
const message = require("./controller/message");
const conversation = require("./controller/conversation");
const withdraw = require("./controller/withdraw");

app.use("/api/v2/user", user);
app.use("/api/v2/shop", shop);
app.use("/api/v2/product", product);
app.use("/api/v2/event", event);
app.use("/api/v2/coupon", coupon);
app.use("/api/v2/payment", payment);
app.use("/api/v2/order", order);
app.use("/api/v2/message", message);
app.use("/api/v2/conversation", conversation);
app.use("/api/v2/withdraw", withdraw);

// ================= ERROR HANDLER =================
app.use(ErrorHandler);

// ================= START SERVER =================
const PORT = process.env.PORT || 8000;

const server = app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});


// ================= CRASH HANDLERS =================
process.on("uncaughtException", (err) => {
  console.log("❌ UNCAUGHT EXCEPTION:", err.message);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.log("❌ UNHANDLED PROMISE REJECTION:", err.message);
  server.close(() => process.exit(1));
});

module.exports = app;
