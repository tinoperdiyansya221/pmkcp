import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  DocumentTextIcon,
  UserIcon,
  KeyIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Redirect to login page
    navigate('/');
  };

  const menuItems = [
    {
      name: 'Dashboard',
      href: '/user/dashboard',
      icon: HomeIcon,
    },
    {
      name: 'Laporan Saya',
      href: '/user/laporan',
      icon: DocumentTextIcon,
    },
    {
      name: 'Ubah Profil',
      href: '/user/profil',
      icon: UserIcon,
    },
    {
      name: 'Ganti Password',
      href: '/user/password',
      icon: KeyIcon,
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
      
      {/* Sidebar */}
      <div className={`bg-white shadow-lg h-screen w-64 fixed left-0 top-0 overflow-y-auto z-30 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
      {/* Logo/Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">PMKCP User</h2>
        <p className="text-sm text-gray-600">Dashboard Pengguna</p>
      </div>

      {/* Navigation Menu */}
      <nav className="mt-6">
        <div className="px-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 border-r-4 border-blue-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.name}
              </NavLink>
            );
          })}
        </div>

        {/* Logout Button */}
        <div className="px-4 mt-8">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-700 rounded-lg hover:bg-red-50 transition-colors duration-200"
          >
            <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5" />
            Logout
          </button>
        </div>
      </nav>

      {/* User Info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700">
              {(() => {
                try {
                  const user = JSON.parse(localStorage.getItem('user') || '{}')
                  return user.nama || 'User'
                } catch (e) {
                  return 'User'
                }
              })()}
            </p>
            <p className="text-xs text-gray-500">
              {(() => {
                try {
                  const user = JSON.parse(localStorage.getItem('user') || '{}')
                  return user.email || 'user@example.com'
                } catch (e) {
                  return 'user@example.com'
                }
              })()}
            </p>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default Sidebar;