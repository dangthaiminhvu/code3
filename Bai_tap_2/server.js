const jwt = require("jsonwebtoken"); // Thêm dòng này
const app = express(); // Thêm dòng này
app.use(express.json()); // Middleware để parse JSON từ request

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
