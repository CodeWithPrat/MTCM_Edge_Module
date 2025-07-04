import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { RefreshCw, Calendar, Clock, TrendingUp } from 'lucide-react';

const MSGraph = () => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [startTime, setStartTime] = useState('00:00');
    const [endTime, setEndTime] = useState('23:59');
    const [graphType, setGraphType] = useState('Energy Consumption (kWh)');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const graphTypes = [
        'Energy Consumption (kWh)',
        'Power (kW)',
        'Voltage (L-L)',
        'Current (Avg)',
        'Power Factor (Avg)'
    ];

    const parameterMapping = {
        'Energy Consumption (kWh)': { spindle: 'Em1_Energy', machine: 'Em2_Energy' },
        'Power (kW)': { spindle: 'Em1_power', machine: 'Em2_power' },
        'Voltage (L-L)': { spindle: 'Em1_voltage', machine: 'Em2_voltage' },
        'Current (Avg)': { spindle: 'Em1_current', machine: 'Em2_current' },
        'Power Factor (Avg)': { spindle: 'Em1_PF', machine: 'Em2_PF' }
    };

    const fetchData = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`https://mtcm-edge.online/Backend/tempgraph.php?date=${selectedDate}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const rawData = await response.json();

            // Filter data by time range and process
            const filteredData = rawData.filter(item => {
                const itemTime = new Date(item.created_at).toTimeString().substring(0, 5);
                return itemTime >= startTime && itemTime <= endTime;
            });

            // Process data for chart
            const processedData = filteredData.map(item => ({
                time: new Date(item.created_at).toLocaleTimeString('en-US', {
                    hour12: false,
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                timestamp: new Date(item.created_at).getTime(),
                spindle: parseFloat(item[parameterMapping[graphType].spindle]) || 0,
                machine: parseFloat(item[parameterMapping[graphType].machine]) || 0,
                ...item
            }));

            // Sort by timestamp
            processedData.sort((a, b) => a.timestamp - b.timestamp);

            setData(processedData);
        } catch (err) {
            setError(`Failed to fetch data: ${err.message}`);
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch data on component mount and when filters change
    useEffect(() => {
        fetchData();
    }, [selectedDate, startTime, endTime, graphType]);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-black/90 border border-brand-purple/30 rounded-lg p-4 shadow-xl backdrop-blur-sm">
                    <p className="text-brand-white font-semibold mb-2">{`Time: ${label}`}</p>
                    {payload.map((entry, index) => (
                        <p key={index} className="text-sm" style={{ color: entry.color }}>
                            {`${entry.name}: ${entry.value.toFixed(2)}`}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="min-h-screen bg-black relative overflow-hidden mr-24">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 animate-gradient-xy opacity-20 "></div>

            {/* Floating particles effect */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-2 bg-brand-sky rounded-full animate-bounce opacity-30"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${3 + Math.random() * 2}s`
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 p-4 sm:p-6 lg:p-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-200 via-gray-400 to-gray-600 mb-4">
                        Graph Analytics
                    </h1>
                    <p className="text-brand-white/70 text-lg sm:text-xl">
                        Real-time Machine & Spindle Data Visualization
                    </p>
                </div>

                {/* Controls Panel */}
                <div className="bg-black/40 backdrop-blur-md border border-brand-purple/30 rounded-2xl p-6 mb-8 shadow-2xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                        {/* Date Selector */}
                        <div className="space-y-2">
                            <label className="flex items-center text-brand-white font-medium text-sm">
                                <Calendar className="w-4 h-4 mr-2 text-brand-sky" />
                                Select Date
                            </label>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="w-full bg-brand-navy/50 border border-brand-purple/30 rounded-lg
             px-3 py-2 text-brand-white focus:outline-none
             focus:ring-2 focus:ring-brand-sky/50 transition-all duration-300"
                                style={{ colorScheme: 'dark' }}   // ⬅️ built‑in icon turns white
                            />
                        </div>

                        {/* Start Time */}
                        <div className="space-y-2">
                            <label className="flex items-center text-brand-white font-medium text-sm">
                                <Clock className="w-4 h-4 mr-2 text-brand-sky" />
                                Start Time
                            </label>
                            <input
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="w-full bg-brand-navy/50 border border-brand-purple/30 rounded-lg px-3 py-2 text-brand-white focus:outline-none focus:ring-2 focus:ring-brand-sky/50 transition-all duration-300"
                                style={{ colorScheme: 'dark' }}   // ⬅️ built‑in icon turns white
                            />
                        </div>

                        {/* End Time */}
                        <div className="space-y-2">
                            <label className="flex items-center text-brand-white font-medium text-sm">
                                <Clock className="w-4 h-4 mr-2 text-brand-sky" />
                                End Time
                            </label>
                            <input
                                type="time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                className="w-full bg-brand-navy/50 border border-brand-purple/30 rounded-lg px-3 py-2 text-brand-white focus:outline-none focus:ring-2 focus:ring-brand-sky/50 transition-all duration-300"
                                style={{ colorScheme: 'dark' }}   // ⬅️ built‑in icon turns white
                            />
                        </div>

                        {/* Graph Type */}
                        <div className="space-y-2">
                            <label className="flex items-center text-brand-white font-medium text-sm">
                                <TrendingUp className="w-4 h-4 mr-2 text-brand-sky" />
                                Graph Type
                            </label>
                            <select
                                value={graphType}
                                onChange={(e) => setGraphType(e.target.value)}
                                className="w-full bg-brand-navy/50 border border-brand-purple/30 rounded-lg px-3 py-2 text-brand-white focus:outline-none focus:ring-2 focus:ring-brand-sky/50 transition-all duration-300"
                            >
                                {graphTypes.map(type => (
                                    <option key={type} value={type} className="bg-brand-navy">
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Refresh Button */}
                        <div className="space-y-2">
                            <label className="text-brand-white font-medium text-sm opacity-0">
                                Refresh
                            </label>
                            <button
                                onClick={fetchData}
                                disabled={loading}
                                className={`w-full bg-gradient-to-r from-brand-sky to-brand-purple hover:from-brand-purple hover:to-brand-violet text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl ${loading ? 'opacity-70 cursor-not-allowed' : ''
                                    }`}
                            >
                                <RefreshCw className={`w-4 h-4 mx-auto ${loading ? 'animate-spin' : ''}`} />
                            </button>
                        </div>
                    </div>

                    {/* Status Bar */}
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-brand-sky rounded-full mr-2"></div>
                                <span className="text-brand-white">Spindle Data</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-brand-purple rounded-full mr-2"></div>
                                <span className="text-brand-white">Machine Data</span>
                            </div>
                        </div>
                        <div className="text-brand-white/70">
                            {loading ? 'Loading...' : `${data.length} data points`}
                        </div>
                    </div>
                </div>

                {/* Chart Container */}
                <div className="bg-black/40 backdrop-blur-md border border-brand-purple/30 rounded-2xl p-6 shadow-2xl min-h-[500px]">
                    {error && (
                        <div className="bg-red-900/20 border border-red-500/30 text-red-200 p-4 rounded-lg mb-6">
                            <p className="font-medium">Error:</p>
                            <p className="text-sm">{error}</p>
                        </div>
                    )}

                    {loading ? (
                        <div className="flex items-center justify-center h-96">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-sky"></div>
                        </div>
                    ) : data.length > 0 ? (
                        <div className="h-96">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                    <XAxis
                                        dataKey="time"
                                        stroke="#ffffff70"
                                        fontSize={12}
                                        tick={{ fill: '#ffffff70' }}
                                    />
                                    <YAxis
                                        stroke="#ffffff70"
                                        fontSize={12}
                                        tick={{ fill: '#ffffff70' }}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend
                                        wrapperStyle={{ color: '#ffffff' }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="spindle"
                                        stroke="#4895ef"
                                        strokeWidth={2}
                                        dot={{ fill: '#4895ef', strokeWidth: 1, r: 2 }}
                                        activeDot={{ r: 6, stroke: '#4895ef', strokeWidth: 2 }}
                                        name="Spindle"
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="machine"
                                        stroke="#7400b8"
                                        strokeWidth={2}
                                        dot={{ fill: '#7400b8', strokeWidth: 1, r: 2 }}
                                        activeDot={{ r: 6, stroke: '#7400b8', strokeWidth: 2 }}
                                        name="Machine"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-96 text-brand-white/70">
                            <div className="text-center">
                                <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-30" />
                                <p className="text-lg">No data available for the selected criteria</p>
                                <p className="text-sm">Try adjusting your filters or refresh the data</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Data Summary */}
                {data.length > 0 && (
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            {
                                title: 'Total Data Points',
                                value: data.length,
                                icon: '📊',
                                color: 'from-brand-sky to-brand-purple'
                            },
                            {
                                title: 'Avg Spindle Value',
                                value: (data.reduce((sum, item) => sum + item.spindle, 0) / data.length).toFixed(2),
                                icon: '⚡',
                                color: 'from-brand-purple to-brand-violet'
                            },
                            {
                                title: 'Avg Machine Value',
                                value: (data.reduce((sum, item) => sum + item.machine, 0) / data.length).toFixed(2),
                                icon: '🔧',
                                color: 'from-brand-violet to-brand-navy'
                            },
                            {
                                title: 'Time Range',
                                value: `${startTime} - ${endTime}`,
                                icon: '⏰',
                                color: 'from-brand-navy to-brand-sky'
                            }
                        ].map((stat, index) => (
                            <div key={index} className={`bg-gradient-to-r ${stat.color} p-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300`}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-white/80 text-sm">{stat.title}</p>
                                        <p className="text-white text-xl font-bold">{stat.value}</p>
                                    </div>
                                    <div className="text-2xl">{stat.icon}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MSGraph;