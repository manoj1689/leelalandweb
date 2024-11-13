// src/pages/SignupPage.tsx
import React, { useState } from 'react';
import { signupUser } from '../services/SignUpService';
import { SignupForm } from '../interfaces/interfaces';

const SignupPage: React.FC = () => {
  const [form, setForm] = useState<SignupForm>({
    device_id: '',
    name: '',
    email: '',
    age: 0,
    dob: '',
    occupation: '',
    birth_location: '',
    birth_time: '',
    image_link: ''
  });

  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await signupUser(form);
      setMessage('Signup successful! ' + response.message);
    } catch (error: any) {
      setError(error?.detail || 'Signup failed');
    }
  };

  return (
    <div className="flex w-full h-screen items-center justify-center">
      <div className="flex w-1/2">
        <div className="flex w-full justify-center text-center text-5xl text-white">
          LEELA LAND
        </div>
      </div>
      <div className="flex w-1/2 justify-center items-center">
        <div>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Grid for Device ID and Name - stacked in small screens, side by side in large screens */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700">Device ID:</label>
                <input
                  type="text"
                  name="device_id"
                  value={form.device_id}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700">Name:</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Grid for Email and Age */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700">Email:</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700">Age:</label>
                <input
                  type="number"
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Grid for Date of Birth and Occupation */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700">Date of Birth:</label>
                <input
                  type="date"
                  name="dob"
                  value={form.dob}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700">Occupation:</label>
                <input
                  type="text"
                  name="occupation"
                  value={form.occupation}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Grid for Birth Location and Birth Time */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700">Birth Location:</label>
                <input
                  type="text"
                  name="birth_location"
                  value={form.birth_location}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700">Birth Time:</label>
                <input
                  type="time"
                  name="birth_time"
                  value={form.birth_time}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Image Link */}
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700">Image Link:</label>
              <input
                type="url"
                name="image_link"
                value={form.image_link}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Sign Up
            </button>
          </form>

          {message && <p className="mt-4 text-green-600 font-semibold">{message}</p>}
          {error && <p className="mt-4 text-red-600 font-semibold">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default SignupPage;

