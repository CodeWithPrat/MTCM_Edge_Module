import React, { useState, useEffect } from 'react';
import { Cpu, BarChart3, Settings } from 'lucide-react';

import SpindleMSTab from './SpindleStatusPage';
import MachineMSTab from './MachineStatus';
import MSGraph from './MSGraph';

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
                    <div className="">
                        <SpindleMSTab />
                    </div>
                );
            case 'machine':
                return (
                    <div className="">
                        <MachineMSTab />
                    </div>
                );
            case 'status':
                return (
                    <div className="">
                        <MSGraph />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-7h-screen bg-black relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 animate-gradient-xy"></div>

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
            <div className={`relative z-10 left-36 min-h-screen flex flex-col transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                {/* Header */}
                <div className="flex-shrink-0 px-8 py-6 border-b border-brand-purple/20 backdrop-blur-sm
                flex justify-center">
                    <div className="flex items-center space-x-4">
                        {/* text is centered and no longer stretches with flex‑1 */}
                        <div className="text-center">
                            <h1 className="text-5xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-200 via-gray-400 to-gray-600 mb-4">
                                Machine Status and Energy Management
                            </h1>
                            <p className="text-gray-300 text-xl">Edge Module Real-time Monitoring</p>
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
                                className={`flex items-center space-x-3 px-6 py-4 rounded-xl transition-all duration-500 transform hover:scale-105 ${activeTab === tab.id
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
            <div className="absolute bottom-4 left-4 w-24 h-24 bg-gradient-to-br from-brand-sky/20 to-transparent rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
    );
};

export default MSTab;