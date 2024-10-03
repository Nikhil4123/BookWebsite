/* eslint-disable no-undef */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux'; 
import { authActions } from './../store/auth';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [error, setError] = useState(null); // State to manage login errors
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize navigation

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form from submitting by default
    setError(null); // Reset the error message before a new login attempt

    try {
      console.log(formData);
      
      // Send formData to the backend API
      const response = await axios.post("http://localhost:3100/api/v1/sign-in", formData);

      // Dispatch login action to Redux store
      dispatch(authActions.login());
      dispatch(authActions.changeRole());

      // Store data in local storage
      localStorage.setItem("id", response.data.id); // Assuming it's "id" not "in"
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      navigate("/profile");

      console.log(response.data);

      // Navigate to the dashboard or another page after successful login
       
    } catch (error) {
      console.log(error);
      setError('Login failed. Please check your username and password.');
    }
  };

  return (
    <div className="min-h-screen animated-bg flex items-center justify-center px-4 py-8">
      <div className="bg-zinc-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold text-zinc-100 mb-6 text-center">Login</h2>

        {/* Show error message if login fails */}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-zinc-400 text-sm font-semibold mb-2" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-zinc-700 text-zinc-100 border border-zinc-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-zinc-400 text-sm font-semibold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-zinc-700 text-zinc-100 border border-zinc-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Login
          </button>
        </form>

        {/* Don't have an account? Sign Up */}
        <div className="mt-6 text-center">
          <p className="text-zinc-400">Don't have an account?</p>
          <Link to="/signup" className="text-blue-500 hover:text-blue-400 font-semibold">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
