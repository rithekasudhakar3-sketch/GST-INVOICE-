'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Bell, Settings, LogOut, Moon, Sun } from 'lucide-react';
import { Avatar } from './Avatar';
import { SearchBar } from './SearchBar';
import { mockUsers, mockNotifications } from '@/lib/mockData';

export function Navbar({ user, role, onThemeToggle, isDark }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const unreadNotifications = mockNotifications.filter(n => !n.read);

  const userData = role === 'seller' ? mockUsers.seller : mockUsers.client;

  return (
    <nav className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-b backdrop-blur-sm sticky top-0 z-40`}>
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">📄</span>
            </div>
            <span className={`${isDark ? 'text-white' : 'text-gray-900'} font-bold text-lg hidden sm:inline`}>
              InvoiceHub
            </span>
          </Link>

          {/* Center Search - Hidden on Mobile */}
          <div className="hidden md:flex flex-1 mx-8 max-w-xs">
            <SearchBar 
              placeholder="Search..." 
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={onThemeToggle}
              className={`p-2 rounded-lg ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`p-2 rounded-lg relative ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                <Bell className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                {unreadNotifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </button>

              {showNotifications && (
                <div className={`absolute right-0 mt-2 w-80 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg shadow-lg`}>
                  <div className={`${isDark ? 'border-gray-700' : 'border-gray-200'} border-b p-4 font-semibold`}>
                    Notifications
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {mockNotifications.length > 0 ? (
                      mockNotifications.map(notif => (
                        <div
                          key={notif.id}
                          className={`p-4 ${isDark ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'} border-b cursor-pointer`}
                        >
                          <p className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {notif.title}
                          </p>
                          <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            {notif.message}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className={`p-4 text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        No notifications
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center gap-2 hover:opacity-80"
              >
                <Avatar src={userData.avatar} name={userData.name} size="sm" />
              </button>

              {showProfile && (
                <div className={`absolute right-0 mt-2 w-48 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg shadow-lg`}>
                  <div className={`p-4 ${isDark ? 'border-gray-700' : 'border-gray-200'} border-b`}>
                    <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {userData.name}
                    </p>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {userData.email}
                    </p>
                  </div>
                  <Link href="/settings" className={`flex items-center gap-2 p-4 ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </Link>
                  <button className={`w-full text-left flex items-center gap-2 p-4 text-red-600 ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
