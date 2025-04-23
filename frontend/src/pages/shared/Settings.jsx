import React, { useState } from 'react';
import { FaUser, FaLock, FaMoon, FaSun } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';

const Settings = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    fullName: 'Vigneswar Garikina',
    email: 'siddhugarikina4769@gmail.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
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
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} py-8 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Account Settings
          </h1>
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${
              darkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-600'
            } hover:bg-opacity-80`}
          >
            {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
          </button>
        </div>

        <div className="space-y-6">
          {/* Password Settings */}
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow rounded-lg p-6`}>
            <h2 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-4 flex items-center gap-2`}>
              <FaLock className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              Password Settings
            </h2>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-gray-500 focus:ring-gray-500' 
                      : 'bg-white border-gray-300 focus:border-gray-500 focus:ring-gray-500'
                  }`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-gray-500 focus:ring-gray-500' 
                      : 'bg-white border-gray-300 focus:border-gray-500 focus:ring-gray-500'
                  }`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-gray-500 focus:ring-gray-500' 
                      : 'bg-white border-gray-300 focus:border-gray-500 focus:ring-gray-500'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              onClick={handleSubmit}
              className={`px-6 py-2 ${
                darkMode 
                  ? 'bg-gray-700 hover:bg-gray-600' 
                  : 'bg-gray-600 hover:bg-gray-700'
              } text-white rounded-lg transition-colors`}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;