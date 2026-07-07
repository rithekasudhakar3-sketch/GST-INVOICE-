'use client';

import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { Tabs } from '@/components/Tabs';

export default function SettingsPage() {
  const [isDark, setIsDark] = useState(false);

  const tabs = [
    {
      label: 'Profile',
      content: (
        <div className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-xl p-6`}>
          <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Edit Profile
          </h3>
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Full Name
              </label>
              <input
                type="text"
                defaultValue="John Doe"
                className={`w-full ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200'} border rounded-lg px-4 py-2`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Email
              </label>
              <input
                type="email"
                defaultValue="john@company.com"
                className={`w-full ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200'} border rounded-lg px-4 py-2`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Phone
              </label>
              <input
                type="tel"
                defaultValue="+91 9876543210"
                className={`w-full ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200'} border rounded-lg px-4 py-2`}
              />
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium">
              Save Changes
            </button>
          </div>
        </div>
      ),
    },
    {
      label: 'Company',
      content: (
        <div className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-xl p-6`}>
          <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Company Information
          </h3>
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Company Name
              </label>
              <input
                type="text"
                defaultValue="Acme Corp"
                className={`w-full ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200'} border rounded-lg px-4 py-2`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                GSTIN
              </label>
              <input
                type="text"
                defaultValue="18AABCT1234H1Z0"
                className={`w-full ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200'} border rounded-lg px-4 py-2`}
              />
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium">
              Save Changes
            </button>
          </div>
        </div>
      ),
    },
    {
      label: 'Preferences',
      content: (
        <div className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-xl p-6`}>
          <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Preferences
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Email Notifications</span>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between">
              <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>SMS Alerts</span>
              <input type="checkbox" className="w-5 h-5" />
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium">
              Save Preferences
            </button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className={`${isDark ? 'bg-gray-950 text-white' : 'bg-gray-50'} min-h-screen`}>
      <Navbar 
        user="seller" 
        role="seller"
        onThemeToggle={() => setIsDark(!isDark)}
        isDark={isDark}
      />

      <div className="flex">
        <Sidebar role="seller" isDark={isDark} />

        <main className="flex-1 lg:ml-64 pt-20 lg:pt-0 p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Settings
              </h1>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mt-2`}>
                Manage your account and preferences
              </p>
            </div>

            <Tabs tabs={tabs} />
          </div>
        </main>
      </div>
    </div>
  );
}
