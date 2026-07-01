import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ResetPassword() {
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [cpass, setCpass] = useState("");

  const [showPass, setShowPass] = useState(false);
  const [showCpass, setShowCpass] = useState(false);

  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const getStrength = () => {
    let count = 0;

    if (pass.length >= 8) count++;
    if (/[A-Z]/.test(pass)) count++;
    if (/[a-z]/.test(pass)) count++;
    if (/[0-9]/.test(pass)) count++;
    if (/[^A-Za-z0-9]/.test(pass)) count++;

    if (count <= 2) return "Weak";
    if (count <= 4) return "Medium";
    return "Strong";
  };

  const resetBtn = async (e) => {
    e.preventDefault();

    let err = {};

    if (!email.trim()) {
        err.email = "Email is required";
    }

    if (!code.trim()) {
      err.code = "Verification code is required";
    }

    if (!pass) {
      err.pass = "Password is required";
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(pass)
    ) {
      err.pass =
        "Password must contain uppercase, lowercase, number and special character";
    }

    if (!cpass) {
      err.cpass = "Confirm Password is required";
    } else if (pass !== cpass) {
      err.cpass = "Passwords do not match";
    }

    setErrors(err);

    if (Object.keys(err).length > 0) {
  return;
}

   try {

  const response = await axios.post(
    "http://localhost:8080/auth/reset-password",
    {
      email: email,
      password: pass
    }
  );

  alert(response.data);

  navigate("/");

} catch (error) {

  alert("Password Reset Failed");

}
  };

  return (
    <div className="mainBox">
      <div className="rightBox">
        <div className="card">
          <h2>Reset Password</h2>

          <p className="subText">
            Enter verification code and create new password.
          </p>

          <form onSubmit={resetBtn}>
            <div className="inputBox">
                <label>Email</label>

                <input
                    type="email"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                    <p className="error">{errors.email}</p>
            </div>
            <div className="inputBox">
              <label>Verification Code</label>

              <input
                type="text"
                placeholder="Enter Code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />

              <p className="error">{errors.code}</p>
            </div>

            <div className="inputBox">
              <label>New Password</label>

              <div className="passBox">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Enter New Password"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                />

                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? "Hide" : "Show"}
                </button>
              </div>

              {pass && (
                <p className="strength">
                  Strength : {getStrength()}
                </p>
              )}

              <p className="error">{errors.pass}</p>
            </div>

            <div className="inputBox">
              <label>Confirm Password</label>

              <div className="passBox">
                <input
                  type={showCpass ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={cpass}
                  onChange={(e) => setCpass(e.target.value)}
                />

                <button
                  type="button"
                  onClick={() => setShowCpass(!showCpass)}
                >
                  {showCpass ? "Hide" : "Show"}
                </button>
              </div>

              <p className="error">{errors.cpass}</p>
            </div>

            <button type="submit" className="btn">
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}