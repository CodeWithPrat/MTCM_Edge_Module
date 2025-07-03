// Tabs.js
import React, { useState } from 'react';
import Temperature from './Temperature';
import TempGraph from './TempGraph';

const Tabs = () => {
  const [activeTab, setActiveTab] = useState('data');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Tab Navigation */}
      <div className="relative z-20 pt-6 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex space-x-2 mb-8">
            <button
              onClick={() => setActiveTab('data')}
              className={`px-6 py-3 rounded-t-xl font-medium transition-all duration-300 ${
                activeTab === 'data'
                  ? 'bg-gradient-to-b from-gray-800 to-gray-900 text-white border-t border-l border-r border-gray-700/50'
                  : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-800/70'
              }`}
            >
              Temperature Data
            </button>
            <button
              onClick={() => setActiveTab('graph')}
              className={`px-6 py-3 rounded-t-xl font-medium transition-all duration-300 ${
                activeTab === 'graph'
                  ? 'bg-gradient-to-b from-gray-800 to-gray-900 text-white border-t border-l border-r border-gray-700/50'
                  : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-800/70'
              }`}
            >
              Temperature Graph
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="relative z-10">
        {activeTab === 'data' ? <Temperature /> : <TempGraph />}
      </div>
    </div>
  );
};

export default Tabs;