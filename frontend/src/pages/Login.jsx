import React, { useState } from "react";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { login } from "../store/authSlice.js";
import axios from "axios";
function Login() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // console.log(UsernameMessage)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com)$/;
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!email.trim()) {
        return toast.error("Email is required!", {
          position: "top-right",
          autoClose: 3000,
        });
      }
      if (!pass.trim()) {
        return toast.error("Password is required!", {
          position: "top-right",
          autoClose: 3000,
        });
      }
      if (!emailRegex.test(email)) {
        return toast.error("Invalid email format! Email must end with .com", {
          position: "top-right",
          autoClose: 3000,
        });
      }
      if (!passwordRegex.test(pass)) {
        return toast.error(
          "Password must have at least one uppercase, one lowercase, one number, and one special character!",
          {
            position: "top-right",
            autoClose: 3000,
          }
        );
      }
      const response = await axios.post("http://localhost:8000/login", {
        email,
        password: pass,
      });
      // console.log(response);
      if (response.data.success === true) {
        const accessToken = response.data.userData.accessToken;
        const expiresIn = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
        const expiryTime = Date.now() + expiresIn;
        window.localStorage.setItem("accessToken", accessToken);
        window.localStorage.setItem("tokenExpiry", expiryTime);
        toast.success(response.data.message);
        dispatch(login(response.data.userData));
        navigate("/");
      } else {
        // console.log(response.data.message);
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt=""
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />
      <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm">
        <h2 className="text-3xl font-semibold text-white text-center mb-3">
          Login
        </h2>
        <p className="text-center text-sm mb-6">Login into your Account!</p>
        <form onSubmit={handleSubmit}>
          <div className="flex mb-4 items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.mail_icon} alt="" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              className="outline-none bg-transparent w-full"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex mb-4 items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.lock_icon} alt="" />
            <input
              type="password"
              placeholder="Password"
              value={pass}
              className="outline-none bg-transparent w-full"
              onChange={(e) => setPass(e.target.value)}
            />
          </div>
          <p
            className="mb-4 text-indigo-500 cursor-pointer"
            onClick={() => navigate("/forgotpass")}
          >
            Forgot Password?
          </p>
          <button
            className="cursor-pointer py-2.5 w-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium"
            type="submit"
          >
            Login
          </button>
        </form>
        <p className="text-gray-400 text-center text-xs mt-4">
          Don't have an account?{" "}
          <span
            className="text-blue-400 cursor-pointer underline"
            onClick={() => navigate("/signup")}
          >
            Sign-up
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
