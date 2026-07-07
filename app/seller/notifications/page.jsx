'use client';

import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { mockNotifications } from '@/lib/mockData';
import { formatDate } from '@/lib/utils';
import { X } from 'lucide-react';

export default function NotificationsPage() {
  const [isDark, setIsDark] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

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
                Notifications
              </h1>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mt-2`}>
                Stay updated with your latest alerts
              </p>
            </div>

            <div className="space-y-4">
              {notifications.map(notif => (
                <div
                  key={notif.id}
                  className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-xl p-6 flex justify-between items-start ${!notif.read ? (isDark ? 'bg-gray-800' : 'bg-blue-50') : ''}`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {notif.title}
                      </h3>
                      {!notif.read && (
                        <span className="w-2 h-2 bg-blue-600 rounded-full" />
                      )}
                    </div>
                    <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>{notif.message}</p>
                    <p className={`text-xs mt-2 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                      {formatDate(notif.date)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {!notif.read && (
                      <button
                        onClick={() => markAsRead(notif.id)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
                      >
                        Mark as read
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notif.id)}
                      className="p-2 hover:bg-gray-200 rounded-lg text-red-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {notifications.length === 0 && (
              <div className={`text-center py-12 ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-xl`}>
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>No notifications</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
