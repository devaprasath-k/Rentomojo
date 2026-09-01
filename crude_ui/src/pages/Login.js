import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ onLogin }) {
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [adminSecret, setAdminSecret] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const [isDark, setIsDark] = useState( 
    localStorage.getItem("theme") === "dark"
  );

  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-bs-theme",
      isDark ? "dark" : "light"
    );
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  // Auto-login if token exists
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const savedUser = localStorage.getItem("username");

    if (token && role && savedUser) {
      onLogin({ username: savedUser, role, token });
      navigate("/");
    }
  }, [onLogin, navigate]);

  // ---------------- LOGIN ----------------
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) return alert("Enter username & password");

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data?.message || "Login failed");
        return;
      }

      const token = data.token || data.data?.token;
      const role = data.role || data.data?.role;
      const usernameResp = data.username || data.data?.username;

 
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("username", usernameResp);

      onLogin({ username: usernameResp, role, token });
      navigate("/");

    } catch (err) {
      console.error(err);
      alert("Network or server error");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- SIGNUP ----------------
  const handleSignup = async () => {
    if (!fullname || !username || !password) {
      alert("Enter fullname, username & password");
      return;
    }

    if (adminSecret) {
      // Admin signup
      if (!adminSecret) {
        alert("Admin secret is required");
        return;
      }
    }

    setLoading(true);
    try {
      const body = { fullname, username, password };
      if (adminSecret) body.adminSecret = adminSecret;

      const res = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data?.message || "Signup failed");
        return;
      }

      alert("Signup successful! Please login.");
      setShowSignup(false);
      setFullname("");
      setUsername("");
      setPassword("");
      setAdminSecret("");

    } catch (err) {
      console.error(err);
      alert("Network or server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="vh-100 d-flex align-items-center justify-content-center bg-body-tertiary position-relative">
      <div className="container h-100 d-flex flex-wrap align-items-center justify-content-center justify-content-lg-between">

        {/* Left Illustration */}
        <div className="col-md-8 col-lg-6 mb-4 mb-lg-0">
          <img
            src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
            className="img-fluid"
            alt="Illustration"
          />
        </div>

        {/* Right Login/Signup Form */}
        <div className="col-md-8 col-lg-5">

          {/* Theme Toggle */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="btn btn-outline-secondary position-fixed top-0 end-0 m-4 shadow"
          >
            {isDark ? "☀ Light" : "🌙 Dark"}
          </button>

          <form
            onSubmit={showSignup ? (e) => e.preventDefault() : handleLogin}
            className="bg-body p-4 rounded shadow"
          >
            <h2 className="text-center fw-bold mb-4">
              {showSignup ? "Sign Up" : "Login"}
            </h2>

            {/* Fullname for signup */}
            {showSignup && (
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                />
              </div>
            )}

            {/* Username */}
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                type="text"
                className="form-control form-control-lg"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {/* Password */}
            <div className="mb-3 position-relative">
              <label className="form-label">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                className="form-control form-control-lg pe-5"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="btn btn-sm btn-link position-absolute top-50 end-0 translate-middle-x text-secondary"
              >
                
              </button>
            </div>

            {/* Admin Secret (only for admin signup) */}
            {showSignup && (
              <div className="mb-3">
                <label className="form-label">Admin Secret (only for admin)</label>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  value={adminSecret}
                  onChange={(e) => setAdminSecret(e.target.value)}
                />
              </div>
            )}

            {/* Submit button */}
            {!showSignup ? (
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-100 py-2 fs-5"
              >
                {loading ? "Logging in..." : "Sign In"}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSignup}
                disabled={loading}
                className="btn btn-success w-100 py-2 fs-5"
              >
                {loading ? "Signing up..." : "Sign Up"}
              </button>
            )}
          </form>

          <div className="mt-3 text-center">
            {showSignup ? (
              <span>
                Already have an account?{" "}
                <button
                  className="btn btn-link"
                  onClick={() => setShowSignup(false)}
                >
                  Login
                </button>
              </span>
            ) : (
              <span>
                Don't have an account?{" "}
                <button
                  className="btn btn-link"
                  onClick={() => setShowSignup(true)}
                >
                  Sign Up
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
