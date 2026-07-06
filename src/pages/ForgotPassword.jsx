import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const emailChange = (e) => {
    setEmail(e.target.value);
  };

  const sendBtn = (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    const emailPattern =
      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

    if (!emailPattern.test(email)) {
      setError("Invalid email format");
      return;
    }

    setError("");

    alert("Code Sent Successfully");

    navigate("/reset-password");
  };

  return (
    <div className="mainBox">
      <div className="rightBox">
        <div className="card">
          <h2>Forgot Password</h2>

          <p className="subText">
            Enter your email address to receive a code.
          </p>

          <form onSubmit={sendBtn}>
            <div className="inputBox">
              <label>Email Address</label>

              <input
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={emailChange}
              />

              <p className="error">{error}</p>
            </div>

            <button type="submit" className="btn">
              Send Code
            </button>
          </form>

          <p className="register">
            Back to <Link to="/">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}