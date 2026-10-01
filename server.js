const express = require("express");
const sequelize = require("./config/database");
const authRoutes = require("./routes/auth");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Gắn routes
app.use("/api/auth", authRoutes);

// Kết nối DB + chạy server
const PORT = process.env.PORT || 3000;
sequelize.sync().then(() => {
    console.log("Database da ket noi");
    app.listen(PORT, () => {
        console.log("Server chay tai http://localhost:" + PORT);
    });
});