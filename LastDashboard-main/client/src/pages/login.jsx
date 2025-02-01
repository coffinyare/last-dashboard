import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/login', { email, password });
      if (response.data.token) {
        toast.success('Logged in successfully');
        localStorage.setItem('token', response.data.token);
        navigate('/dashboard');
      } else {
        toast.error('Login failed: Invalid credentials');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <section className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-md">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-white">Welcome Back!</h2>
          <p className="text-gray-400">Login to your account</p>
        </div>
        <form onSubmit={handleSubmit} method="POST" className="space-y-6">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-300">
              Email address
            </label>
            <div className="mt-2.5 relative">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full py-3 px-4 bg-gray-700 text-white placeholder-gray-500 border border-gray-600 rounded focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium text-gray-300">
              Password
            </label>
            <div className="mt-2.5 relative">
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full py-3 px-4 bg-gray-700 text-white placeholder-gray-500 border border-gray-600 rounded focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 focus:outline-none"
            >
              Log in
            </button>
          </div>
        </form>
        <ToastContainer />
      </section>
    </div>
  );
}

export default Login;
