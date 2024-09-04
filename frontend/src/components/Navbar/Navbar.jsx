/* eslint-disable no-unused-vars */

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaGripLines } from "react-icons/fa";
import { motion } from 'framer-motion';

const Navbar = () => {
  const links = [
    { title: "Home", link: "/" },
    { title: "All Books", link: "/all-books" },
    { title: "Cart", link: "/cart" },
    { title: "Profile", link: "/profile" },
  ];

  const [MobileNav,setMobileNav]= useState("hidden")

  return (<>
    <nav className="z-50 relative flex bg-zinc-800  text-white px-8 py-4  items-center justify-between">
      <div className="flex items-center justify-center">
        <img
          className="h-10 me-4 border rounded-3xl hover:rotate-180 transform transition-transform duration-300 "
          src="https://getwallpapers.com/wallpaper/full/a/4/e/165947.jpg"
          alt="logo"
        />
        <h1 className="text-2xl font-semibold"> Bookworms Paradise</h1>
      </div>
      <div className="nav-links-bookparadise block md:flex items-center gap-4 ">
        <div className="hidden md:flex flex gap-4 ">
          {links.map((items, i) => (
            <Link
              to={items.link}
              className="hover:text-blue-400 transition-all duration-300"
              key={i}
            >
              {items.title}{" "}
            </Link>
          ))}
        </div>
        <div className="hidden md:flex flex gap-4 ">
          <Link
            to="/LogIn"
            className="px-4 py-1 border rounded-xl border-blue-500 hover:bg-blue-500 hover:text-white transition-all duration-300"
          >
            LogIn
          </Link>
          <Link
            to="/SignUp"
            className="px-4 py-1 border rounded-xl border-blue-500 hover:bg-blue-500 hover:text-white transition-all duration-300"
          >
            SignUp
          </Link>
        </div>
        <button className="block md:hidden text-white text-2xl hover:text-green-400"
        onClick={() => (MobileNav === "hidden" ? setMobileNav("block") : setMobileNav("hidden"))}>
        <FaGripLines />
        </button>
      </div>
    </nav>

    <div className= {`${MobileNav} bg-zinc-800 h-screen absolute top-0 left-0 w-full z-40  flex flex-col  items-center justify-center `}>
    {links.map((items, i) => (
            <Link
              to={items.link}
              className={`${MobileNav} text-white text-4xl mb-8 font-semibold hover:text-blue-400 transition-all duration-300`}
              key={i}
              onClick={() => (MobileNav === "hidden" ? setMobileNav("block") : setMobileNav("hidden"))}
            >
              {items.title}{" "}
            </Link>
          ))}
          <Link
            to="/LogIn"
            className= {`${MobileNav} px-8 py-1 text-1xl mb-8 font-semibold border rounded-xl text-white border-blue-500
                                     hover:bg-blue-500 hover:text-white transition-all duration-300`}
            onClick={() => (MobileNav === "hidden" ? setMobileNav("block") : setMobileNav("hidden"))}
          >
            LogIn
          </Link>
          <Link
            to="/SignUp"
            className= {`${MobileNav} px-8 py-1 text-1xl mb-8 font-semibold border rounded-xl bg-zinc-800 text-white
                                   hover:text-zinc-300 hover:bg-blue-500 transition-all duration-300`}
                                   onClick={() => (MobileNav === "hidden" ? setMobileNav("block") : setMobileNav("hidden"))}
          >
            SignUp
          </Link>
        </div>


    </>
  );
};

export default Navbar;
