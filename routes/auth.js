const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config();

const router = express.Router();

// API Đăng nhập
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email: email } });
        if (!user) {
            return res.status(400).json({ message: "Email khong ton tai" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Sai mat khau" });
        }

        const accessToken = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        const refreshToken = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: "7d" }
        );

        await user.update({ refreshToken: refreshToken });

        res.json({
            message: "Dang nhap thanh cong",
            accessToken: accessToken,
            refreshToken: refreshToken,
            role: user.role
        });

    } catch (error) {
        res.status(500).json({ message: "Loi server", error: error.message });
    }
}); 

// API Đăng ký
router.post("/register", async (req, res) => {
    try {
        const { fullname, email, password, gender, dateOfBirth } = req.body;

        const existingUser = await User.findOne({ where: { email: email } });
        if (existingUser) {
            return res.status(400).json({ message: "Email da ton tai" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            fullname: fullname,
            email: email,
            password: hashedPassword,
            gender: gender,
            dateOfBirth: dateOfBirth
        });

        res.json({
            message: "Dang ky thanh cong",
            user: newUser
        });

    } catch (error) {
        res.status(500).json({ message: "Loi server", error: error.message });
    }
}); 

module.exports = router;