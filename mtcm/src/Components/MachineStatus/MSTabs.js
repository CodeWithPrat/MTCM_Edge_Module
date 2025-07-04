import React, { useState, useEffect } from 'react';
import { Activity, Cpu, BarChart3, Zap, Settings, TrendingUp } from 'lucide-react';

const MSTab = () => {
  const [activeTab, setActiveTab] = useState('spindle');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const tabs = [
    {
      id: 'spindle',
      label: 'Spindle',
      icon: <Settings className="w-5 h-5" />,
      color: 'from-brand-purple to-brand-violet'
    },
    {
      id: 'machine',
      label: 'Machine',
      icon: <Cpu className="w-5 h-5" />,
      color: 'from-brand-sky to-brand-purple'
    },
    {
      id: 'status',
      label: 'Machine Status & Graph',
      icon: <BarChart3 className="w-5 h-5" />,
      color: 'from-brand-violet to-brand-navy'
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'spindle':
        return (
          <div className="w-full h-full flex items-center justify-center">
            <div className="bg-gradient-to-br from-brand-purple/20 to-brand-violet/20 backdrop-blur-sm rounded-3xl p-8 border border-brand-purple/30 shadow-2xl transform hover:scale-105 transition-all duration-700">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-brand-purple to-brand-violet rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                  <Settings className="w-16 h-16 text-white animate-spin" style={{ animationDuration: '3s' }} />
                </div>
                <h3 className="text-3xl font-bold text-white mb-4 animate-fade-in">Spindle Control</h3>
                <p className="text-brand-sky text-lg opacity-80">Advanced spindle monitoring and control system</p>
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="bg-black/40 rounded-xl p-4 border border-brand-purple/20">
                    <div className="text-brand-sky text-sm">RPM</div>
                    <div className="text-white text-xl font-bold">2,450</div>
                  </div>
                  <div className="bg-black/40 rounded-xl p-4 border border-brand-purple/20">
                    <div className="text-brand-sky text-sm">Temperature</div>
                    <div className="text-white text-xl font-bold">68°C</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'machine':
        return (
          <div className="w-full h-full flex items-center justify-center">
            <div className="bg-gradient-to-br from-brand-sky/20 to-brand-purple/20 backdrop-blur-sm rounded-3xl p-8 border border-brand-sky/30 shadow-2xl transform hover:scale-105 transition-all duration-700">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-brand-sky to-brand-purple rounded-full flex items-center justify-center shadow-2xl">
                  <Cpu className="w-16 h-16 text-white animate-bounce" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-4 animate-fade-in">Machine Control</h3>
                <p className="text-brand-sky text-lg opacity-80">Comprehensive machine monitoring and diagnostics</p>
                <div className="mt-6 grid grid-cols-3 gap-4">
                  <div className="bg-black/40 rounded-xl p-4 border border-brand-sky/20">
                    <div className="text-brand-sky text-sm">Status</div>
                    <div className="text-green-400 text-lg font-bold">Active</div>
                  </div>
                  <div className="bg-black/40 rounded-xl p-4 border border-brand-sky/20">
                    <div className="text-brand-sky text-sm">Load</div>
                    <div className="text-white text-lg font-bold">75%</div>
                  </div>
                  <div className="bg-black/40 rounded-xl p-4 border border-brand-sky/20">
                    <div className="text-brand-sky text-sm">Efficiency</div>
                    <div className="text-white text-lg font-bold">94%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'status':
        return (
          <div className="w-full h-full flex items-center justify-center">
            <div className="bg-gradient-to-br from-brand-violet/20 to-brand-navy/20 backdrop-blur-sm rounded-3xl p-8 border border-brand-violet/30 shadow-2xl transform hover:scale-105 transition-all duration-700">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-brand-violet to-brand-navy rounded-full flex items-center justify-center shadow-2xl">
                  <BarChart3 className="w-16 h-16 text-white animate-pulse" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-4 animate-fade-in">Status & Analytics</h3>
                <p className="text-brand-sky text-lg opacity-80">Real-time status monitoring and performance graphs</p>
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="bg-black/40 rounded-xl p-4 border border-brand-violet/20">
                    <div className="text-brand-sky text-sm">Uptime</div>
                    <div className="text-green-400 text-xl font-bold">99.2%</div>
                  </div>
                  <div className="bg-black/40 rounded-xl p-4 border border-brand-violet/20">
                    <div className="text-brand-sky text-sm">Performance</div>
                    <div className="text-white text-xl font-bold">Optimal</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-screen bg-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-navy/30 via-brand-violet/20 to-brand-purple/30 animate-gradient-xy"></div>
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-brand-sky/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className={`relative z-10 w-full h-full flex flex-col transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Header */}
        <div className="flex-shrink-0 px-8 py-6 border-b border-brand-purple/20 backdrop-blur-sm">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-brand-purple to-brand-violet rounded-xl flex items-center justify-center shadow-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Machine Tool Condition Monitoring</h1>
              <p className="text-brand-sky/80 text-lg">Edge Module Dashboard</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex-shrink-0 px-8 py-6">
          <div className="flex space-x-2 bg-black/40 backdrop-blur-sm rounded-2xl p-2 border border-brand-purple/20">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-3 px-6 py-4 rounded-xl transition-all duration-500 transform hover:scale-105 ${
                  activeTab === tab.id
                    ? `bg-gradient-to-r ${tab.color} text-white shadow-2xl shadow-brand-purple/30`
                    : 'text-brand-sky/70 hover:text-white hover:bg-brand-purple/10'
                }`}
              >
                <span className={`transition-all duration-300 ${activeTab === tab.id ? 'animate-pulse' : ''}`}>
                  {tab.icon}
                </span>
                <span className="font-medium text-sm lg:text-base">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 px-8 pb-8">
          <div className="w-full h-full bg-black/20 backdrop-blur-sm rounded-3xl border border-brand-purple/20 shadow-2xl">
            <div className={`w-full h-full transition-all duration-700 transform ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>

      {/* Corner Decorations */}
      <div className="absolute top-4 right-4 w-32 h-32 bg-gradient-to-br from-brand-purple/20 to-transparent rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-4 left-4 w-24 h-24 bg-gradient-to-br from-brand-sky/20 to-transparent rounded-full blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>
      
      {/* Energy Management Indicator */}
      <div className="absolute top-6 right-6 flex items-center space-x-2 bg-black/40 backdrop-blur-sm rounded-full px-4 py-2 border border-brand-sky/20">
        <Zap className="w-4 h-4 text-brand-sky animate-pulse" />
        <span className="text-brand-sky text-sm font-medium">Energy: Optimal</span>
      </div>
    </div>
  );
};

export default MSTab;