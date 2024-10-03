/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaGripLines, FaUser, FaSignOutAlt, FaBook } from "react-icons/fa"; 
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../store/auth.js";

const Navbar = () => {
  const links = [
    { title: "Home", link: "/", icon: <FaBook /> },
    { title: "All Books", link: "/all-books", icon: <FaBook /> },
  ];

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const toggleMobileNav = () => setIsMobileNavOpen(!isMobileNavOpen);

  const handleLogout = () => {
    dispatch(authActions.logout());
    ["id", "token", "role"].forEach((item) => localStorage.removeItem(item));
  };

  // Close mobile nav when resizing to desktop view
  useEffect(() => {
    const handleResize = () => window.innerWidth >= 768 && setIsMobileNavOpen(false);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const renderLinks = () => (
    links.map(({ title, link, icon }, i) => (
      <Link 
        to={link} 
        className="flex items-center hover:text-blue-400 transition-all duration-300" 
        key={i}
        onClick={() => setIsMobileNavOpen(false)}
      >
        {icon} <span className="ml-1">{title}</span>
      </Link>
    ))
  );

  const renderAuthButtons = () => (
    isLoggedIn ? (
      <>
        <Link 
          to="/profile" 
          className="flex items-center hover:text-blue-400 transition-all duration-300"
          onClick={() => setIsMobileNavOpen(false)}
        >
          <FaUser className="mr-1" /> Profile
        </Link>
        <button
          onClick={() => {
            handleLogout();
            setIsMobileNavOpen(false);
          }}
          className="flex items-center hover:text-blue-400 transition-all duration-300"
        >
          <FaSignOutAlt className="mr-1" /> Logout
        </button>
      </>
    ) : (
      <>
        <Link
          to="/LogIn"
          className="px-4 py-1 border rounded-xl border-blue-500 hover:bg-blue-500 hover:text-white transition-all duration-300"
          onClick={() => setIsMobileNavOpen(false)}
        >
          LogIn
        </Link>
        <Link
          to="/SignUp"
          className="px-4 py-1 border rounded-xl border-blue-500 hover:bg-blue-500 hover:text-white transition-all duration-300"
          onClick={() => setIsMobileNavOpen(false)}
        >
          SignUp
        </Link>
      </>
    )
  );

  return (
    <>
      <nav className="z-50 relative flex bg-gradient-to-r from-gray-600 to-black text-white px-8 py-4 items-center justify-between shadow-lg transition-all duration-300">
        <div className="flex items-center">
          <img
            className="h-10 me-4 border rounded-3xl hover:rotate-180 transform transition-transform duration-300 ease-in-out"
            src="https://getwallpapers.com/wallpaper/full/a/4/e/165947.jpg"
            alt="logo"
          />
          <h1 className="text-2xl font-bold">Bookworms Paradise</h1>
        </div>
        <div className="nav-links-bookparadise hidden md:flex gap-4 items-center">
          {renderLinks()}
          {isLoggedIn && (
            <Link
              to="/cart"
              className="flex items-center hover:text-blue-400 transition-all duration-300"
            >
              <FaBook className="mr-1" /> Cart
            </Link>
          )}
          {renderAuthButtons()}
        </div>
        <button
          className="block md:hidden text-white text-2xl hover:text-green-400 transition-all duration-300"
          onClick={toggleMobileNav}
        >
          <FaGripLines />
        </button>
      </nav>

      {isMobileNavOpen && (
        <div className="bg-gradient-to-r from-blue-800 to-blue-600 h-screen absolute top-0 left-0 w-full z-40 flex flex-col items-center justify-center shadow-lg transition-all duration-300">
          {renderLinks()}
          {isLoggedIn && (
            <Link
              to="/cart"
              className="text-white text-4xl mb-8 hover:text-blue-400"
              onClick={() => setIsMobileNavOpen(false)}
            >
              Cart
            </Link>
          )}
          {renderAuthButtons()}
        </div>
      )}
    </>
  );
};

export default Navbar;
