const API_URL = "http://localhost:3000";

function signup() {
  const username = document.getElementById("signup-username").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  fetch(`${API_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  })
    .then((res) => res.json())
    .then((data) => alert(data.message))
    .catch((err) => console.error(err));
}

function login() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
    .then((res) => res.json())
    .then((data) => alert(data.message))
    .catch((err) => console.error(err));
}

// Lưu token khi đăng nhập thành công
function login() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.token) {
        localStorage.setItem("token", data.token);
        alert(data.message);
        window.location.href = "dashboard.html";
      } else {
        alert(data.error);
      }
    })
    .catch((err) => console.error(err));
}

// Lấy dữ liệu từ dashboard với token
function loadDashboard() {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Bạn chưa đăng nhập!");
    window.location.href = "index.html";
    return;
  }

  fetch(`${API_URL}/dashboard`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("dashboard-content").innerText = data.message;
    })
    .catch((err) => {
      alert("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại.");
      window.location.href = "index.html";
    });
}

// Hàm đăng xuất
function logout() {
  localStorage.removeItem("token");
  alert("Đăng xuất thành công!");
  window.location.href = "index.html";
}

// Hàm quên mật khẩu
function forget() {
  localStorage.removeItem("token");
  alert(
    "Bạn quên mật khẩu? Thế thì hãy báo lên Liên Hợp Quốc, có thể họ sẽ lắng nghe bạn đấy!"
  );
  window.location.href = "index.html";
}

// Tự động load dashboard nếu đang ở dashboard.html
if (window.location.pathname.includes("dashboard.html")) {
  loadDashboard();
}
