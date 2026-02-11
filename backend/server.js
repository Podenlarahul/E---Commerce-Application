const path = require("path");

require("dotenv").config();
require("dotenv").config({ path: path.join(__dirname, "config", ".env") });

const express = require("express");
const ErrorHandler = require("./middleware/error");
const connectDatabase = require("./db/Database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fs = require("fs");
const { UPLOADS_DIR } = require("./utils/uploadPath");

const app = express();
app.set("trust proxy", 1);
app.disable("x-powered-by");

const databaseReady = connectDatabase();

app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use(async (req, res, next) => {
  try {
    await databaseReady;
    next();
  } catch (error) {
    next(error);
  }
});

const isProduction = process.env.NODE_ENV === "production";

const allowedOrigins = new Set(
  (process.env.CORS_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
);

if (process.env.CLIENT_URL) {
  allowedOrigins.add(process.env.CLIENT_URL.trim().replace(/\/$/, ""));
}

if (!isProduction) {
  allowedOrigins.add("http://localhost:3000");
  allowedOrigins.add("http://127.0.0.1:3000");
}

app.use(
  cors({
    origin: (origin, callback) => {
      const vercelUrl = process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : null;

      if (
        !origin ||
        (!isProduction && allowedOrigins.size === 0) ||
        allowedOrigins.has(origin) ||
        (vercelUrl && origin === vercelUrl)
      ) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

fs.mkdirSync(UPLOADS_DIR, { recursive: true });
app.use("/uploads", express.static(UPLOADS_DIR));

app.get("/", (req, res) => {
  res.send("Backend Running");
});

app.get("/test", (req, res) => {
  res.send("Hello World!");
});

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

app.use(ErrorHandler);

const PORT = process.env.PORT || 8000;
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err.message);
});

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED PROMISE REJECTION:", err.message);
});

module.exports = app;
