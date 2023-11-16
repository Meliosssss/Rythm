const express = require("express");
const app = express();
require("dotenv/config");
const cors = require("cors");
const mongoose = require("mongoose");

// Cấu hình CORS
const corsOptions = {
    origin: "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};
app.use(cors(corsOptions));

app.use(express.json()); // Phân tích yêu cầu JSON

mongoose.connect(process.env.DB_STRING, { useNewUrlParser: true });
const db = mongoose.connection;

//lộ trình xác thực người dùng
const userRoute = require("./routes/auth");
app.use("/api/users/", userRoute);
const artistRoutes = require("./routes/artist");
app.use("/api/artists/", artistRoutes);
const albumRoutes = require("./routes/albums");
app.use("/api/albums/", albumRoutes);
const songRoutes = require("./routes//songs");
const song = require("./models/song");
app.use("/api/songs/", songRoutes);

db.once("open", () => {
    console.log("Kết nối thành công");
});

db.on("error", (error) => {
    console.log(`LỖI: ${error}`);
});

app.listen(4000, () => {
    console.log("Kết nối với cổng 4000");
});
