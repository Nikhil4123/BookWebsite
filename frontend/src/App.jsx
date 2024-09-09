/* eslint-disable no-unused-vars */
import React from "react";
import Home from "./pages/home";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AllBooks from './pages/AllBooks';
import Login from './pages/LogIn';
import SignUp from "./pages/SignUp";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import ViewBookDetails from "./components/ViewBookDetails/ViewBookDetails";

const App = () => {
  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route  path="/all-books" element={<AllBooks />} />
          <Route  path="/Cart" element={<Cart />} />
          <Route  path="/Profile" element={<Profile />} />
          <Route  path="/LogIn" element={<Login />} />
          <Route  path="/SignUp" element={<SignUp />} />
          <Route  path="view-book-details/:id" element={<ViewBookDetails />} />

          </Routes>
          <Footer/>
      </Router>
    </div>
  );
};

export default App;
