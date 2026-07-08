'use client';

import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { Tabs } from '@/components/Tabs';
import { Upload, Palette, Landmark, CircleDollarSign, MoonStar } from 'lucide-react';

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
      label: 'Billing',
      content: (
        <div className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-xl p-6`}>
          <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Business settings</h3>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Bank account</label>
                <input type="text" defaultValue="HDFC 1234567890" className={`w-full ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200'} border rounded-lg px-4 py-2`} />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Currency</label>
                <select className={`w-full ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200'} border rounded-lg px-4 py-2`}>
                  <option>₹ INR</option>
                  <option>$ USD</option>
                </select>
              </div>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Invoice theme</label>
              <div className="flex flex-wrap gap-3">
                {['Modern', 'Classic', 'Minimal'].map((theme) => (
                  <span key={theme} className={`rounded-full border px-3 py-2 text-sm ${isDark ? 'border-gray-700 text-gray-300' : 'border-gray-200 text-gray-700'}`}>{theme}</span>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-dashed border-gray-300 p-4 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-400">
              <div className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white"><Upload className="h-4 w-4" /> Upload company logo</div>
              <p className="mt-1">Your logo will appear on invoices and PDF exports.</p>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium">Save Billing Settings</button>
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
            <div className="flex items-center justify-between rounded-xl border border-gray-200 p-3 dark:border-gray-800">
              <div className="flex items-center gap-2"><MoonStar className="h-4 w-4 text-blue-600" /> <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Dark mode by default</span></div>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between rounded-xl border border-gray-200 p-3 dark:border-gray-800">
              <div className="flex items-center gap-2"><Palette className="h-4 w-4 text-blue-600" /> <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Invoice theme preview</span></div>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between rounded-xl border border-gray-200 p-3 dark:border-gray-800">
              <div className="flex items-center gap-2"><Landmark className="h-4 w-4 text-blue-600" /> <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>GST auto-summary</span></div>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between rounded-xl border border-gray-200 p-3 dark:border-gray-800">
              <div className="flex items-center gap-2"><CircleDollarSign className="h-4 w-4 text-blue-600" /> <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Auto-currency formatting</span></div>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
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
