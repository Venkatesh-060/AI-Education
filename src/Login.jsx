import React, {useState} from "react";
import "./Login.css";
import { Link } from "react-router-dom";

export default function Login() {

    const[email, setEmail] = useState("");
    const[pass,setPass] = useState("");
    const[check, setCheck] = useState(false);

    const emailChange = (e) => {
        setEmail(e.target.value);
    }

    const passChange = (e) => {
        setPass(e.target.value);
    }

    const checkChange = (e) => {
        setCheck(e.target.checked);
    }

    const loginBtn = (e) => {
        e.preventDefault();

        console.log({email,pass,check})
    };
 
   return (
    <div className="mainBox">

      <div className="leftBox">
        <h1 className="title">AI Education</h1>

        <h2 className="heading">
          Empowering Minds with AI Education
        </h2>

        <p className="text">
            Access personalized learning experiences, monitor your academic
            progress, and enhance productivity with intelligent educational
            tools designed for modern learners.
        </p>

        <div className="featureBox">
          <p>✓ Smart Learning</p>
          <p>✓ Track Progress</p>
          <p>✓ AI Assistance</p>
        </div>

        <div className="imgBox">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4712/4712027.png"
            alt="AI Education"
          />
        </div>
      </div>

      {/* Right Side */}

      <div className="rightBox">
        <div className="card">
          <h2>Welcome Back</h2>

          <p className="subText">
            Sign in to access your dashboard and continue your learning journey.
          </p>

          <form onSubmit={loginBtn}>
            <div className="inputBox">
              <label>Email</label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={emailChange}
              />
            </div>

            <div className="inputBox">
              <label>Password</label>

              <input
                type="password"
                placeholder="Enter your password"
                value={pass}
                onChange={passChange}
              />
            </div>

            <div className="optionBox">
              <label>
                <input
                  type="checkbox"
                  checked={check}
                  onChange={checkChange}
                />
                Remember Me
              </label>

              <a href="/">Forgot Password?</a>
            </div>

            <button type="submit" className="btn">
              Login
            </button>
          </form>

          <p className="register">
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
