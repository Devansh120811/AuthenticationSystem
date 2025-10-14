import React, { useEffect, useState, useRef } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { fetchUserData } from "../store/authSlice.js";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { Loader2 } from "lucide-react"; // ✅ import spinner

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const inputRef = useRef([]);
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [isEmailSent, setIsEmailsent] = useState(false);
  const [isOTPSubmitted, setIsOTPSubmitted] = useState(false);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false); // ✅ loading state

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

  const userData = useSelector((state) => state.auth.userData);

  const handleInput = (e, index) => {
    const value = e.target.value;
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      inputRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      if (newOtp[index] !== "") {
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        inputRef.current[index - 1].focus();
        newOtp[index - 1] = "";
        setOtp(newOtp);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRef.current[index - 1].focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRef.current[index + 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d{6}$/.test(paste)) return;
    const pasteArray = paste.split("");
    setOtp(pasteArray);
    pasteArray.forEach((char, index) => {
      if (inputRef.current[index]) {
        inputRef.current[index].value = char;
      }
    });
    inputRef.current[5]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com)$/;
    if (!email.trim()) {
      return toast.error("Email is required!", { position: "top-right", autoClose: 3000 });
    }
    if (!emailRegex.test(email)) {
      return toast.error("Invalid email format! Email must end with .com", {
        position: "top-right",
        autoClose: 3000,
      });
    }
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:8000/forgot-password", { email });
      if (response.data.success) {
        toast.success(response.data.message);
        setUserName(response.data.user.username);
        setIsEmailsent(true);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitOTP = async (e) => {
    e.preventDefault();
    if (otp.includes("")) {
      return toast.error("OTP is required!", { position: "top-right", autoClose: 3000 });
    }
    const otpString = otp.join("");
    try {
      setLoading(true);
      const response = await axios.post(
        `http://localhost:8000/forgot-password/verify/${userName}`,
        { otp: otpString }
      );
      if (response.data.success === true) {
        toast.success(response.data.message);
        setIsOTPSubmitted(true);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitPass = async (e) => {
    e.preventDefault();
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!newPassword.trim()) {
      return toast.error("New Password is required!", {
        position: "top-right",
        autoClose: 3000,
      });
    }
    if (!passwordRegex.test(newPassword)) {
      return toast.error(
        "Password must have at least one uppercase, one lowercase, one number, and one special character!",
        { position: "top-right", autoClose: 3000 }
      );
    }
    try {
      setLoading(true);
      const response = await axios.post(
        `http://localhost:8000/forgot-password/${userName}`,
        { password: newPassword }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        navigate(`/login`);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
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

      {/* Email Form */}
      {!isEmailSent && (
        <form
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
          onSubmit={handleSubmit}
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            Reset Password
          </h1>
          <p className="text-center mb-6 text-indigo-300">
            Enter your registered email address
          </p>
          <div className="flex mb-4 items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.mail_icon} alt="" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              className="outline-none bg-transparent w-full text-white"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button
            className="cursor-pointer py-2.5 w-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium flex justify-center items-center gap-2"
            type="submit"
            disabled={loading}
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Submit"}
          </button>
        </form>
      )}

      {/* OTP Form */}
      {!isOTPSubmitted && isEmailSent && (
        <form
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
          onSubmit={handleSubmitOTP}
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            Reset Password OTP
          </h1>
          <p className="text-center mb-6 text-indigo-300">
            Enter the 6-digit code sent to your email id.
          </p>
          <div className="flex justify-between mb-8" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                type="text"
                maxLength={1}
                key={index}
                className="h-12 w-12 bg-[#333A5C] text-white text-center text-xl rounded-md"
                ref={(e) => (inputRef.current[index] = e)}
                value={digit}
                onChange={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full cursor-pointer flex justify-center items-center gap-2"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Submit"}
          </button>
        </form>
      )}

      {/* New Password Form */}
      {isOTPSubmitted && isEmailSent && (
        <form
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
          onSubmit={handleSubmitPass}
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            New Password
          </h1>
          <p className="text-center mb-6 text-indigo-300">
            Enter new password below
          </p>
          <div className="flex mb-4 items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.lock_icon} alt="" />
            <input
              type="password"
              placeholder="Password"
              value={newPassword}
              className="outline-none bg-transparent w-full text-white"
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <button
            className="cursor-pointer py-2.5 w-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium flex justify-center items-center gap-2"
            type="submit"
            disabled={loading}
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Submit"}
          </button>
        </form>
      )}
    </div>
  );
}

export default ForgotPassword;
