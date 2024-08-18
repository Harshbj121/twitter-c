const { default: mongoose } = require("mongoose");
const { MONGODB_URL } = require("./config");

const connectToDatabase = () => {
  const databaseUrl = MONGODB_URL;
  mongoose.connect(databaseUrl);

  mongoose.connection.on("connected", () => {
    console.log("Connected to MongoDB");
  });

  mongoose.connection.on("error", (error) => {
    console.error("Error connecting to MongoDB:", error);
  });
};

module.exports = connectToDatabase;
