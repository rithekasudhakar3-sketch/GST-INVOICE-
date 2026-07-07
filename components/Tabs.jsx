'use client';

import { useState } from 'react';

export function Tabs({ tabs, defaultTab = 0 }) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <div>
      <div className="border-b border-gray-200 flex gap-8">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === index
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-6">
        {tabs[activeTab]?.content}
      </div>
    </div>
  );
}
