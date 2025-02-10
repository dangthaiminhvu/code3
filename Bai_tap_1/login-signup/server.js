require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const jwt = require("jsonwebtoken"); // Thêm dòng này

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "3010D@ngth@im1nhvu2005",
  database: "user_auth",
});

db.connect((err) => {
  if (err) console.error("Lỗi kết nối MySQL:", err);
  else console.log("✅ Đã kết nối MySQL");
});

// API Đăng ký
app.post("/signup", (req, res) => {
  const { username, email, password } = req.body;

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return res.status(500).json({ error: "Lỗi mã hóa mật khẩu" });

    const sql =
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";

    db.query(sql, [username, email, hash], (err, result) => {
      if (err) return res.status(500).json({ error: "Lỗi database" });
      res.json({ message: "Đăng ký thành công!" });
    });
  });
});

// Thêm API Đăng nhập mới với JWT
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], (err, results) => {
    if (err) return res.status(500).json({ error: "Lỗi database" });
    if (results.length === 0)
      return res.status(401).json({ error: "Email không tồn tại" });

    bcrypt.compare(password, results[0].password, (err, isMatch) => {
      if (err) return res.status(500).json({ error: "Lỗi so sánh mật khẩu" });
      if (!isMatch)
        return res.status(401).json({ error: "Mật khẩu không đúng" });

      // Tạo JWT Token
      const token = jwt.sign(
        { id: results[0].id, username: results[0].username },
        "secret_key",
        { expiresIn: "1h" }
      );
      res.json({ message: "Đăng nhập thành công!", token });
    });
  });
});

// Middleware xác thực token
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, "secret_key", (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// API Dashboard (Yêu cầu phải đăng nhập)
app.get("/dashboard", authenticateToken, (req, res) => {
  res.json({ message: `Chào mừng ${req.user.username} đến với Dashboard!` });
});

app.listen(3000, () => console.log("🚀 Server chạy tại http://localhost:3000"));
