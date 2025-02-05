import React,{useEffect} from "react";
import { assets } from "../assets/assets.js";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { LogOut } from "lucide-react";
import {toast} from 'react-toastify'
import { logout,fetchUserData } from "../store/authSlice.js";
import axios from "axios";

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authStatus = useSelector((state) => state.auth.status);
  // console.log(authStatus)
  const userData = useSelector((state) => state.auth.userData);
  const accessToken = window.localStorage.getItem("accessToken")
  const config = {
    headers: {
        Authorization: `Bearer ${accessToken}`,
    },
};
useEffect(()=>{
dispatch(fetchUserData())
},[dispatch])
// console.log(userData)
  const handleLogin = (e) => {
    e.preventDefault();
    navigate("/login");
  };
  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get('http://localhost:8000/logout',config)
      if(response.data.success === true){    
        toast.success(response.data.message)
        dispatch(logout());
        navigate('/')
      }
      else{
        toast.error(response.data.message)
      }   
    } catch (error) {
      toast.error(error.message)
    }
  };
  return (
    <div className="flex w-full justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0">
      <img src={assets.logo} alt="" className="w-28 sm:w-32 cursor-pointer" />
      {authStatus ? (
        <div className="w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group cursor-pointer">
          {userData.username[0].toUpperCase()}
          <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10">
            <ul className="list-none m-0 p-2 bg-gray-100 text-sm">
              {!userData.IsAccountVerified && (
                <li
                  className="py-1 px-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => navigate(`/verify-email/${userData.username}`)}
                >
                  Verify Email
                </li>
              )}
              <li
                className="py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10 flex gap-1.5"
                onClick={handleLogout}
              >
                Logout
                <LogOut size={20} />
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
