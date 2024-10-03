// eslint-disable-next-line no-unused-vars
import React from "react";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <div className="h-[75vh] flex flex-col md:flex-row items-center justify-center bg-gradient-to-r from-zinc-900 to-zinc-800">
      <div className="w-full mb-12 md:mb-0 lg:w-3/6 flex flex-col items-center lg:items-start justify-center">
        <h1 className="text-4xl lg:text-6xl font-semibold text-yellow-100 text-center lg:text-left transition-transform transform hover:scale-105">
          Discover Your Next Great Read
        </h1>
        <p className="mt-4 text-xl text-zinc-300 text-center lg:text-left">
          From classics to modern hits, we have it all! Dive into stories that
          stay with you. Your perfect book match awaits.
        </p>
        <div className="mt-8">
          <Link 
            to="/all-books"
            className="text-yellow-100 lg:text-2xl text-2xl font-semibold border border-yellow-100 px-10 py-3 hover:bg-zinc-600 transition-all duration-300 rounded-full shadow-lg hover:shadow-xl">
            Discover Books
          </Link>
        </div>
      </div>
      <div className="w-full lg:w-3/6 h-auto lg:h-[100%] flex items-center justify-center">
        <img 
          src="./hero.png" 
          alt="hero" 
          className="w-full h-auto object-cover rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
}

export default Hero;
