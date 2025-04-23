import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaBuilding, FaEdit, FaSun, FaMoon } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext'; // <-- import the hook

const Profile = () => {
  const { darkMode, toggleDarkMode } = useTheme(); // <-- use the hook
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: 'Vigneswar Garikina',
    email: 'siddhugarikina4769@gmail.com',
    phoneNumber: '',
    hatcheryName: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    setIsEditing(false);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} py-12 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-24 w-24 rounded-full bg-white flex items-center justify-center">
                  <FaUser className="h-12 w-12 text-blue-500" />
                </div>
                <div className="ml-6">
                  <h1 className="text-3xl font-bold text-white">{formData.fullName}</h1>
                  <p className="text-blue-100">Employee Profile</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-white text-blue-500 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-50"
              >
                <FaEdit /> {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
          </div>

          {/* Profile Content */}
          <div className="px-8 py-6">
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div className="flex items-center">
                  <FaUser className="h-5 w-5 text-gray-400" />
                  <div className="ml-4 flex-1">
                    <label className="block text-sm font-medium text-gray-500">Full Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="mt-1 text-lg text-gray-900">{formData.fullName}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center">
                  <FaEnvelope className="h-5 w-5 text-gray-400" />
                  <div className="ml-4 flex-1">
                    <label className="block text-sm font-medium text-gray-500">Email Address</label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="mt-1 text-lg text-gray-900">{formData.email}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center">
                  <FaPhone className="h-5 w-5 text-gray-400" />
                  <div className="ml-4 flex-1">
                    <label className="block text-sm font-medium text-gray-500">Phone Number</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="mt-1 text-lg text-gray-900">{formData.phoneNumber || 'Not provided'}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center">
                  <FaBuilding className="h-5 w-5 text-gray-400" />
                  <div className="ml-4 flex-1">
                    <label className="block text-sm font-medium text-gray-500">Hatchery Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="hatcheryName"
                        value={formData.hatcheryName}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="mt-1 text-lg text-gray-900">{formData.hatcheryName || 'Not provided'}</p>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Dark Mode Toggle */}
      <div className="flex justify-end p-4">
        <button
          onClick={toggleDarkMode}
          className={`p-2 rounded-full ${
            darkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-600'
          }`}
        >
          {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
        </button>
      </div>
    </div>
  );
};

export default Profile;
