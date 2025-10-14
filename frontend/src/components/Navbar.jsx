import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets.js";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { LogOut } from "lucide-react";
import { toast } from "react-toastify";
import { logout, fetchUserData } from "../store/authSlice.js";
import axios from "axios";

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);
  const accessToken = window.localStorage.getItem("accessToken");

  const [menuOpen, setMenuOpen] = useState(false); // mobile toggle

  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

  const handleLogin = (e) => {
    e.preventDefault();
    navigate("/login");
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get("http://localhost:8000/logout", config);
      if (response.data.success === true) {
        toast.success(response.data.message);
        dispatch(logout());
        navigate("/");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex w-full justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0">
      {/* Logo */}
      <img
        src={assets.logo}
        alt="Logo"
        className="w-28 sm:w-32 cursor-pointer"
        onClick={() => navigate("/")}
      />

      {authStatus ? (
        <div
          className="relative group"
          onMouseLeave={() => setMenuOpen(false)}
        >
          {/* Avatar */}
          <button
            className="w-9 h-9 flex justify-center items-center rounded-full bg-black text-white cursor-pointer"
            onClick={() => setMenuOpen((prev) => !prev)} // toggle on mobile
          >
            {userData?.username?.[0]?.toUpperCase()}
          </button>

          {/* Dropdown Menu */}
          <div
            className={`
              absolute right-0 mt-2 z-10 bg-white rounded shadow-md text-sm
              ${menuOpen ? "block" : "hidden"}  /* mobile toggle */
              sm:group-hover:block             /* desktop hover */
            `}
          >
            <ul className="list-none m-0 p-2 min-w-[140px]">
              {!userData.IsAccountVerified && (
                <li
                  className="py-1 px-3 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    navigate(`/verify-email/${userData.username}`);
                    setMenuOpen(false);
                  }}
                >
                  Verify Email
                </li>
              )}
              <li
                className="py-1 px-3 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
                onClick={(e) => {
                  handleLogout(e);
                  setMenuOpen(false);
                }}
              >
                Logout
                <LogOut size={18} />
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <button
          className="flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all duration-150 cursor-pointer"
          onClick={handleLogin}
        >
          Login
          <img src={assets.arrow_icon} alt="" />
        </button>
      )}
    </div>
  );
}

export default Navbar;
