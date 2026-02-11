require("dotenv").config({ path: "config/.env" });

const express = require("express");
const ErrorHandler = require("./middleware/error");
const connectDatabase = require("./db/Database");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();

/* ================= DATABASE ================= */
connectDatabase();

/* ================= MIDDLEWARES ================= */
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

/* ================= STATIC ================= */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ================= TEST ROUTES ================= */
app.get("/", (req, res) => {
  res.send("Backend Running 🚀");
});

app.get("/test", (req, res) => {
  res.send("Hello World!");
});

/* ================= ROUTES ================= */
app.use("/api/v2/user", require("./controller/user"));
app.use("/api/v2/shop", require("./controller/shop"));
app.use("/api/v2/product", require("./controller/product"));
app.use("/api/v2/event", require("./controller/event"));
app.use("/api/v2/coupon", require("./controller/coupounCode"));
app.use("/api/v2/payment", require("./controller/payment"));
app.use("/api/v2/order", require("./controller/order"));
app.use("/api/v2/message", require("./controller/message"));
app.use("/api/v2/conversation", require("./controller/conversation"));
app.use("/api/v2/withdraw", require("./controller/withdraw"));

/* ================= ERROR HANDLER ================= */
app.use(ErrorHandler);

/* ================= LOCAL SERVER ONLY ================= */
const PORT = process.env.PORT || 8000;

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

/* ================= SAFETY ================= */
process.on("uncaughtException", (err) => {
  console.error("❌ UNCAUGHT EXCEPTION:", err.message);
});

process.on("unhandledRejection", (err) => {
  console.error("❌ UNHANDLED PROMISE REJECTION:", err.message);
});

/* ================= EXPORT FOR VERCEL ================= */
module.exports = app;
