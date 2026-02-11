const mongoose = require("mongoose");

let cachedConnection = null;

const connectDatabase = () => {
  if (cachedConnection) {
    return cachedConnection;
  }

  cachedConnection = mongoose
    .connect(process.env.DB_URL)
    .then((data) => {
      console.log(`MongoDB connected: ${data.connection.host}`);
      return data;
    })
    .catch((error) => {
      cachedConnection = null;
      throw error;
    });

  return cachedConnection;
};

module.exports = connectDatabase;
