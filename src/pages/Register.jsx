import React, { useState } from "react";
import "../styles/Register.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [cpass, setCpass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showCpass, setShowCpass] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [role, setRole] = useState("STUDENT");

  const fnameChange = (e) => {
    setFname(e.target.value);
  };

  const lnameChange = (e) => {
    setLname(e.target.value);
  };

  const emailChange = (e) => {
    setEmail(e.target.value);
  };

  const passChange = (e) => {
    setPass(e.target.value);
  };

  const cpassChange = (e) => {
    setCpass(e.target.value);
  };

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

  const registerBtn = async (e) => {
    e.preventDefault();

    let err = {};

    if (!fname.trim()) {
      err.fname = "First Name is required";
    }

    if (!lname.trim()) {
      err.lname = "Last Name is required";
    }

    if (!email.trim()) {
      err.email = "Email is required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      err.email = "Invalid email format";
    }

    if (!pass) {
      err.pass = "Password is required";
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(pass)
    ) {
      err.pass =
        "Password must contain 8 chars, uppercase, lowercase, number and special char";
    }

    if (!cpass) {
      err.cpass = "Confirm Password is required";
    } else if (pass !== cpass) {
      err.cpass = "Passwords do not match";
    }

    setErrors(err);

    if (Object.keys(err).length === 0) {
      try {
        const response = await axios.post(
          "http://localhost:8080/auth/register",
          {
            firstName: fname,
            lastName: lname,
            email: email,
            password: pass,
            role: role
          },
        );

        alert(response.data.message);
        navigate("/");
      } catch (error) {
        alert(error.response?.data || "Registration Failed");
      }
    }
  };

  return (
    <div className="mainBox">
      <div className="leftBox">
        <h1 className="title">AI Education</h1>

        <h2 className="heading">Start Your Learning Journey Today</h2>

        <p className="text">
          Create your account and access personalized AI-powered learning tools,
          track your progress and achieve your goals.
        </p>

        <div className="featureBox">
          <p>✓ Smart Learning</p>
          <p>✓ Progress Tracking</p>
          <p>✓ AI Guidance</p>
        </div>

        <div className="imgBox">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4712/4712027.png"
            alt="register"
          />
        </div>
      </div>

      <div className="rightBox">
        <div className="card">
          <h2>Create Account</h2>

          <p className="subText">Fill in the details below to register.</p>

          <form onSubmit={registerBtn}>
            <div className="inputBox">
              <label>First Name</label>
              <input
                type="text"
                placeholder="Enter first name"
                value={fname}
                onChange={fnameChange}
              />
              <p className="error">{errors.fname}</p>
            </div>

            <div className="inputBox">
              <label>Last Name</label>
              <input
                type="text"
                placeholder="Enter last name"
                value={lname}
                onChange={lnameChange}
              />
              <p className="error">{errors.lname}</p>
            </div>

            <div className="inputBox">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={emailChange}
              />
              <p className="error">{errors.email}</p>
            </div>

            <div className="inputBox">
              <label>Role</label>

              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="STUDENT">Student</option>
                <option value="TRAINER">Trainer</option>
              </select>
            </div>

            <div className="inputBox">
              <label>Password</label>

              <div className="passBox">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Enter password"
                  value={pass}
                  onChange={passChange}
                />

                <button type="button" onClick={() => setShowPass(!showPass)}>
                  {showPass ? "Hide" : "Show"}
                </button>
              </div>

              {pass && <p className="strength">Strength : {getStrength()}</p>}

              <p className="error">{errors.pass}</p>
            </div>

            <div className="inputBox">
              <label>Confirm Password</label>

              <div className="passBox">
                <input
                  type={showCpass ? "text" : "password"}
                  placeholder="Confirm password"
                  value={cpass}
                  onChange={cpassChange}
                />

                <button type="button" onClick={() => setShowCpass(!showCpass)}>
                  {showCpass ? "Hide" : "Show"}
                </button>
              </div>

              <p className="error">{errors.cpass}</p>
            </div>

            <button className="btn" type="submit">
              Register
            </button>
          </form>

          <p className="register">
            Already have an account? <Link to="/">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
