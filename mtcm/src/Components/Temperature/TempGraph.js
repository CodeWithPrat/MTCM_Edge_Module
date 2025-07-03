import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { RefreshCw, TrendingUp, Activity, Thermometer, Zap, Calendar, Clock, BarChart3 } from 'lucide-react';

const TempGraph = () => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('00:00');
  const [endTime, setEndTime] = useState('23:59');
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [graphType, setGraphType] = useState('rtd');
  const [selectedSensor, setSelectedSensor] = useState('rtd1');
  const [isAnimating, setIsAnimating] = useState(false);

  const fetchGraphData = async () => {
    setLoading(true);
    setError(null);
    setIsAnimating(true);
    
    try {
      // Simulate API call delay for animation effect
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock data generation
      const timestamps = [];
      const data = [];
      
      for (let i = 0; i < 24; i++) {
        const hour = i.toString().padStart(2, '0');
        const dataPoint = {
          time: `${hour}:00`,
          rtd1: Math.round((25 + Math.sin(i * 0.3) * 3 + Math.random() * 2) * 10) / 10,
          rtd2: Math.round((26 + Math.cos(i * 0.2) * 2 + Math.random() * 1.5) * 10) / 10,
          rtd3: Math.round((24 + Math.sin(i * 0.25) * 2.5 + Math.random() * 1.8) * 10) / 10,
          rtd4: Math.round((27 + Math.cos(i * 0.35) * 1.5 + Math.random() * 1.2) * 10) / 10,
          tc1: Math.round((28 + Math.sin(i * 0.4) * 3 + Math.random() * 2.2) * 10) / 10,
          tc2: Math.round((29 + Math.cos(i * 0.3) * 2 + Math.random() * 1.7) * 10) / 10,
          tc3: Math.round((27 + Math.sin(i * 0.35) * 2.5 + Math.random() * 1.9) * 10) / 10,
          tc4: Math.round((28 + Math.cos(i * 0.25) * 1.5 + Math.random() * 1.4) * 10) / 10,
        };
        data.push(dataPoint);
      }
      
      setGraphData(data);
    } catch (err) {
      setError('Connection error');
      console.error('Error fetching graph data:', err);
    } finally {
      setLoading(false);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  useEffect(() => {
    fetchGraphData();
  }, [date, startTime, endTime, graphType, selectedSensor]);

  const getSensorConfig = () => {
    if (graphType === 'rtd') {
      return {
        title: 'PT 100 RTD Sensors',
        icon: <Thermometer className="w-5 h-5" />,
        sensors: [
          { key: 'rtd1', label: 'RTD 1', color: '#3b82f6', gradient: 'from-blue-500 to-blue-600' },
          { key: 'rtd2', label: 'RTD 2', color: '#10b981', gradient: 'from-emerald-500 to-emerald-600' },
          { key: 'rtd3', label: 'RTD 3', color: '#f59e0b', gradient: 'from-amber-500 to-amber-600' },
          { key: 'rtd4', label: 'RTD 4', color: '#8b5cf6', gradient: 'from-violet-500 to-violet-600' }
        ]
      };
    } else if (graphType === 'tc') {
      return {
        title: 'Thermocouple Sensors',
        icon: <Zap className="w-5 h-5" />,
        sensors: [
          { key: 'tc1', label: 'TC 1', color: '#dc2626', gradient: 'from-red-500 to-red-600' },
          { key: 'tc2', label: 'TC 2', color: '#ea580c', gradient: 'from-orange-500 to-orange-600' },
          { key: 'tc3', label: 'TC 3', color: '#d97706', gradient: 'from-amber-600 to-amber-700' },
          { key: 'tc4', label: 'TC 4', color: '#059669', gradient: 'from-emerald-600 to-emerald-700' }
        ]
      };
    } else {
      const allSensors = [
        { key: 'rtd1', label: 'RTD 1', color: '#3b82f6', gradient: 'from-blue-500 to-blue-600' },
        { key: 'rtd2', label: 'RTD 2', color: '#10b981', gradient: 'from-emerald-500 to-emerald-600' },
        { key: 'rtd3', label: 'RTD 3', color: '#f59e0b', gradient: 'from-amber-500 to-amber-600' },
        { key: 'rtd4', label: 'RTD 4', color: '#8b5cf6', gradient: 'from-violet-500 to-violet-600' },
        { key: 'tc1', label: 'TC 1', color: '#dc2626', gradient: 'from-red-500 to-red-600' },
        { key: 'tc2', label: 'TC 2', color: '#ea580c', gradient: 'from-orange-500 to-orange-600' },
        { key: 'tc3', label: 'TC 3', color: '#d97706', gradient: 'from-amber-600 to-amber-700' },
        { key: 'tc4', label: 'TC 4', color: '#059669', gradient: 'from-emerald-600 to-emerald-700' }
      ];
      
      const sensor = allSensors.find(s => s.key === selectedSensor);
      return {
        title: `${sensor.label} Sensor`,
        icon: <Activity className="w-5 h-5" />,
        sensors: [sensor]
      };
    }
  };

  const config = getSensorConfig();

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900/95 backdrop-blur-sm border border-gray-700/50 rounded-lg p-3 shadow-xl">
          <p className="text-gray-300 text-sm mb-2">{`Time: ${label}`}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-white text-sm font-medium">
                {entry.dataKey.toUpperCase()}: {entry.value}°C
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const getStats = () => {
    if (!graphData) return null;
    
    const sensors = config.sensors.map(sensor => {
      const values = graphData.map(d => d[sensor.key]);
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      const min = Math.min(...values);
      const max = Math.max(...values);
      
      return {
        ...sensor,
        avg: Math.round(avg * 10) / 10,
        min,
        max,
        trend: values[values.length - 1] > values[0] ? 'up' : 'down'
      };
    });
    
    return sensors;
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 p-4 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="flex items-center justify-center space-x-3 mb-4">
              {config.icon}
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
                Temperature Monitor
              </h1>
            </div>
            <p className="text-gray-400 text-lg">Real-time temperature data visualization</p>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map((stat, index) => (
                <div
                  key={stat.key}
                  className={`bg-gradient-to-br ${stat.gradient} p-6 rounded-2xl shadow-2xl backdrop-blur-sm border border-white/10 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl animate-slide-up`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold text-lg">{stat.label}</h3>
                    <TrendingUp className={`w-5 h-5 ${stat.trend === 'up' ? 'text-green-300' : 'text-red-300 rotate-180'}`} />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">{stat.avg}°C</div>
                  <div className="flex justify-between text-sm text-white/70">
                    <span>Min: {stat.min}°C</span>
                    <span>Max: {stat.max}°C</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Controls */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-2xl mb-8 animate-slide-up">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-300">
                  <Calendar className="w-4 h-4" />
                  <span>Date</span>
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 hover:bg-gray-800/70"
                />
              </div>
              
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-300">
                  <Clock className="w-4 h-4" />
                  <span>Start Time</span>
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 hover:bg-gray-800/70"
                />
              </div>
              
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-300">
                  <Clock className="w-4 h-4" />
                  <span>End Time</span>
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 hover:bg-gray-800/70"
                />
              </div>
              
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-300">
                  <BarChart3 className="w-4 h-4" />
                  <span>Graph Type</span>
                </label>
                <div className="flex space-x-1">
                  {[
                    { value: 'rtd', label: 'RTD', color: 'from-blue-500 to-blue-600' },
                    { value: 'tc', label: 'TC', color: 'from-red-500 to-red-600' },
                    { value: 'individual', label: 'Single', color: 'from-purple-500 to-purple-600' }
                  ].map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setGraphType(type.value)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        graphType === type.value
                          ? `bg-gradient-to-r ${type.color} text-white shadow-lg scale-105`
                          : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700/70 hover:scale-105'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={fetchGraphData}
                  disabled={loading}
                  className={`w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                    loading ? 'animate-pulse' : ''
                  }`}
                >
                  <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                  <span>{loading ? 'Loading...' : 'Update'}</span>
                </button>
              </div>
            </div>

            {graphType === 'individual' && (
              <div className="animate-fade-in">
                <label className="block text-sm font-medium text-gray-300 mb-2">Select Sensor</label>
                <select
                  value={selectedSensor}
                  onChange={(e) => setSelectedSensor(e.target.value)}
                  className="w-full md:w-1/3 bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 hover:bg-gray-800/70"
                >
                  <optgroup label="PT 100 RTD">
                    <option value="rtd1">RTD 1</option>
                    <option value="rtd2">RTD 2</option>
                    <option value="rtd3">RTD 3</option>
                    <option value="rtd4">RTD 4</option>
                  </optgroup>
                  <optgroup label="Thermocouple">
                    <option value="tc1">TC 1</option>
                    <option value="tc2">TC 2</option>
                    <option value="tc3">TC 3</option>
                    <option value="tc4">TC 4</option>
                  </optgroup>
                </select>
              </div>
            )}
          </div>

          {/* Graph */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-2xl animate-slide-up">
            <div className="flex items-center space-x-3 mb-6">
              {config.icon}
              <h2 className="text-2xl font-bold text-white">{config.title}</h2>
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center h-96">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin animate-reverse" style={{ animationDelay: '0.5s' }}></div>
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-12 animate-fade-in">
                <div className="text-red-400 text-lg mb-4">Error loading graph data</div>
                <button
                  onClick={fetchGraphData}
                  className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Retry
                </button>
              </div>
            ) : graphData ? (
              <div className={`h-96 w-full transition-all duration-1000 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={graphData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <defs>
                      {config.sensors.map((sensor, index) => (
                        <linearGradient key={sensor.key} id={`gradient-${sensor.key}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={sensor.color} stopOpacity={0.8}/>
                          <stop offset="95%" stopColor={sensor.color} stopOpacity={0.1}/>
                        </linearGradient>
                      ))}
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                    <XAxis 
                      dataKey="time" 
                      stroke="#9CA3AF" 
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="#9CA3AF" 
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#9CA3AF' } }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                      wrapperStyle={{ paddingTop: '20px' }}
                      iconType="circle"
                    />
                    {config.sensors.map((sensor, index) => (
                      <Area
                        key={sensor.key}
                        type="monotone"
                        dataKey={sensor.key}
                        stroke={sensor.color}
                        strokeWidth={3}
                        fill={`url(#gradient-${sensor.key})`}
                        fillOpacity={0.6}
                        name={sensor.label}
                        animationDuration={1500}
                        animationDelay={index * 200}
                      />
                    ))}
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400 animate-fade-in">
                <Activity className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <div className="text-lg">No data available</div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }
        
        .animate-reverse {
          animation-direction: reverse;
        }
      `}</style>
    </div>
  );
};

export default TempGraph;