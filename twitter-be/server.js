const express = require("express");
const app = express();
const cors = require("cors");
const UserRoutes = require("./Routes/user_routes");
const PostRoutes = require("./Routes/post_routes");
const FileRoutes = require("./Routes/file_routes");
const path = require('path');
const connectToDatabase = require("./dbConfig");

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/file", FileRoutes);
app.use("/auth", UserRoutes);
app.use("/api", PostRoutes);

app.listen(4000, () => {
  connectToDatabase();
  console.log("server started");
});

