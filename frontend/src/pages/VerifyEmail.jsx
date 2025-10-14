import React, { useRef, useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { useNavigate, useParams } from "react-router";
import { fetchUserData } from "../store/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import { Loader2 } from "lucide-react"; // 👈 spinner import

function VerifyEmail() {
  const { username } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const inputRef = useRef([]);
  const userData = useSelector((state) => state.auth.userData);
  const [otp, setOtp] = useState(new Array(6).fill("")); // Store OTP digits
  const [loading, setLoading] = useState(false); // 👈 spinner state

  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

  useEffect(() => {
    if (userData.isAccountVerified) {
      navigate("/");
    }
  }, [userData, navigate]);

  const handleInput = (e, index) => {
    const value = e.target.value;
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) inputRef.current[index + 1].focus();
  };

  const handleKeyDown = (e, index) => {
    const newOtp = [...otp];
    if (e.key === "Backspace") {
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
      if (inputRef.current[index]) inputRef.current[index].value = char;
    });
    inputRef.current[5]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (otp.includes("")) {
      return toast.error("OTP is required!", { position: "top-right", autoClose: 3000 });
    }

    setLoading(true); // 👈 start spinner
    const otpString = otp.join("");

    try {
      const response = await axios.post(
        `http://localhost:8000/register/verifyOTP/${username}`,
        { otp: otpString }
      );
      if (response.data.success === true) {
        toast.success(response.data.message);
        navigate("/");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false); // 👈 stop spinner
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
      <form
        className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        onSubmit={handleSubmit}
      >
        <h1 className="text-white text-2xl font-semibold text-center mb-4">
          Email Verify OTP
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
          className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full flex justify-center items-center gap-2"
          disabled={loading} // disable button when loading
        >
          {loading && <Loader2 className="animate-spin w-5 h-5" />}
          {loading ? "Verifying..." : "Verify Email"}
        </button>
      </form>
    </div>
  );
}

export default VerifyEmail;
