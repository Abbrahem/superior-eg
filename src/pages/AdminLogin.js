import React, { useState } from 'react';
import axios from '../config/axios';
import Swal from 'sweetalert2';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/admin/login', formData);
      localStorage.setItem('adminToken', response.data.token);
      
      Swal.fire({
        title: 'Login Successful!',
        text: 'Welcome to admin dashboard',
        icon: 'success',
        confirmButtonText: 'OK',
        background: '#1f1f1f',
        color: '#ffffff'
      }).then(() => {
        window.location.href = '/admin/dashboard';
      });

    } catch (error) {
      Swal.fire({
        title: 'Login Failed',
        text: 'Invalid email or password',
        icon: 'error',
        confirmButtonText: 'OK',
        background: '#1f1f1f',
        color: '#ffffff'
      });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="bg-gray-900 p-8 rounded-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8">Admin Login</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              name="username"
              placeholder="Username or Email"
              value={formData.username}
              onChange={handleInputChange}
              required
              className="w-full bg-gray-800 text-white px-4 py-3 rounded border border-gray-700 focus:outline-none focus:border-white"
            />
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full bg-gray-800 text-white px-4 py-3 rounded border border-gray-700 focus:outline-none focus:border-white"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-white text-black py-3 rounded font-medium hover:bg-gray-200 transition-colors"
          >
            LOGIN
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;