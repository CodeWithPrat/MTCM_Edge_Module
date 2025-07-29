import React, { useState, useEffect } from 'react';
import { Thermometer, RefreshCw, Wifi, WifiOff, TrendingUp, Activity, Zap } from 'lucide-react';

const LoadingComponent = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-gray-400 to-gray-600 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${Math.random() * 3 + 2}s`,
            }}
          />
        ))}
      </div>
      
      <div className="text-center relative z-10">
        <div className="text-6xl mb-8 animate-pulse">🌡️</div>
        <div className="relative">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-200 via-gray-400 to-gray-600 mb-4 animate-pulse">
            Loading Temperature Data
          </h2>
          <div className="flex justify-center space-x-2 mb-4">
            <div className="w-3 h-3 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-gradient-to-r from-gray-500 to-gray-700 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-gradient-to-r from-gray-600 to-gray-800 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <p className="text-gray-300 text-lg">Initializing sensors...</p>
        </div>
      </div>
    </div>
  );
};

const ThermometerDisplay = ({ value, label, type, unit = "°C", index }) => {
  const maxTemp = 50;
  const minTemp = 0;
  const percentage = ((value - minTemp) / (maxTemp - minTemp)) * 100;
  
  const getTemperatureColor = (temp) => {
    if (temp < 20) return "from-blue-300 via-blue-400 to-blue-500";
    if (temp < 25) return "from-green-300 via-green-400 to-green-500";
    if (temp < 30) return "from-yellow-300 via-yellow-400 to-yellow-500";
    if (temp < 35) return "from-orange-300 via-orange-400 to-orange-500";
    return "from-red-300 via-red-400 to-red-500";
  };

  const getTemperatureStatus = (temp) => {
    if (temp < 20) return "Cool";
    if (temp < 25) return "Optimal";
    if (temp < 30) return "Warm";
    if (temp < 35) return "Hot";
    return "Critical";
  };

  return (
    <div 
      className="group relative bg-gradient-to-br from-gray-800/60 via-gray-900/60 to-black/60 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 hover:border-gray-600/70 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-gray-500/20"
      style={{ 
        animationDelay: `${index * 0.1}s`,
        animation: 'slideInUp 0.6s ease-out forwards'
      }}
    >
      {/* Glowing effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-500/10 to-gray-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-gray-600/30 to-gray-700/30 rounded-xl">
            <Thermometer className="w-6 h-6 text-gray-300" />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">{label}</h3>
            <p className="text-gray-400 text-sm">{type}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-400">
            {value}{unit}
          </p>
          <p className={`text-xs font-semibold ${
            getTemperatureStatus(value) === 'Critical' ? 'text-red-400' :
            getTemperatureStatus(value) === 'Hot' ? 'text-orange-400' :
            getTemperatureStatus(value) === 'Warm' ? 'text-yellow-400' :
            getTemperatureStatus(value) === 'Optimal' ? 'text-green-400' :
            'text-blue-400'
          }`}>
            {getTemperatureStatus(value)}
          </p>
        </div>
      </div>
      
      {/* Realistic Thermometer */}
      <div className="relative flex items-center justify-center">
        <div className="relative">
          {/* Thermometer Body - More realistic shape */}
          <div className="relative flex flex-col items-center">
            {/* Top rounded section */}
            <div className="w-8 h-4 bg-gradient-to-b from-gray-300 to-gray-400 rounded-t-full border-2 border-gray-500 mb-1"></div>
            
            {/* Main tube */}
            <div className="w-6 h-40 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-sm relative overflow-hidden border-2 border-gray-500 shadow-inner">
              {/* Inner tube (where mercury/alcohol goes) */}
              <div className="absolute inset-1 bg-gradient-to-b from-gray-50 to-white rounded-sm overflow-hidden">
                {/* Temperature Fill - Mercury/Alcohol effect */}
                <div 
                  className={`absolute bottom-0 w-full bg-gradient-to-t ${getTemperatureColor(value)} rounded-sm transition-all duration-1000 ease-out`}
                  style={{ 
                    height: `${Math.max(percentage, 8)}%`,
                    boxShadow: `inset 0 0 10px rgba(0,0,0,0.3), 0 0 20px ${
                      value < 20 ? 'rgba(59, 130, 246, 0.6)' :
                      value < 25 ? 'rgba(34, 197, 94, 0.6)' :
                      value < 30 ? 'rgba(234, 179, 8, 0.6)' :
                      value < 35 ? 'rgba(249, 115, 22, 0.6)' :
                      'rgba(239, 68, 68, 0.6)'
                    }`
                  }}
                >
                  {/* Mercury shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                </div>
              </div>
            </div>
            
            {/* Bulb at bottom */}
            <div className={`w-14 h-14 bg-gradient-to-br ${getTemperatureColor(value)} rounded-full border-3 border-gray-500 shadow-2xl relative -mt-1`}>
              {/* Bulb reflection */}
              <div className="absolute inset-2 bg-gradient-to-br from-white/40 to-transparent rounded-full"></div>
              {/* Bulb shadow */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/20 rounded-full"></div>
            </div>
          </div>
          
          {/* Temperature Scale - More realistic positioning */}
          <div className="absolute left-12 top-2 h-40 flex flex-col justify-between text-xs text-gray-400">
            {[50, 40, 30, 20, 10, 0].map((temp, idx) => (
              <div key={temp} className="flex items-center">
                <div className="w-3 h-px bg-gray-500 mr-2"></div>
                <span className="font-mono text-gray-300">{temp}°C</span>
              </div>
            ))}
          </div>
          
          {/* Scale markings on the left side */}
          <div className="absolute -left-2 top-2 h-40 flex flex-col justify-between">
            {[50, 40, 30, 20, 10, 0].map((temp, idx) => (
              <div key={temp} className="w-2 h-px bg-gray-500"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatusIndicator = ({ isOnline }) => {
  return (
    <div className="flex items-center space-x-3 px-4 py-2 rounded-full bg-gray-800/50 backdrop-blur-sm border border-gray-700/50">
      {isOnline ? (
        <>
          <div className="relative">
            <Wifi className="w-5 h-5 text-green-400" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          <span className="text-green-400 font-semibold">Online</span>
        </>
      ) : (
        <>
          <WifiOff className="w-5 h-5 text-red-400 animate-pulse" />
          <span className="text-red-400 font-semibold">Offline</span>
        </>
      )}
    </div>
  );
};

const StatsCard = ({ icon: Icon, label, value, trend, color }) => (
  <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:border-gray-600/70 transition-all duration-300 hover:scale-105">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="text-gray-400 text-sm">{label}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
      </div>
    </div>
  </div>
);

const Temperature = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch('https://cmti-edge.online/mtcm/Backend/mtcmedge.php');
      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
        setLastUpdate(new Date());
        setError(null);
      } else {
        setError('Failed to fetch data');
      }
    } catch (err) {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const refreshData = () => {
    setLoading(true);
    fetchData();
  };

  if (loading) {
    return <LoadingComponent />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-gradient-to-r from-red-400 to-orange-400 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 4 + 2}px`,
                height: `${Math.random() * 4 + 2}px`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
        
        <div className="text-center relative z-10">
          <div className="text-8xl mb-6 animate-bounce">⚠️</div>
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400 mb-4">
            Connection Error
          </h2>
          <p className="text-gray-300 text-lg mb-8">{error}</p>
          <button 
            onClick={refreshData}
            className="bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 px-8 py-4 rounded-2xl text-white font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-gray-500/25"
          >
            <RefreshCw className="w-5 h-5 inline mr-2" />
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  const avgTemp = data ? (
    (parseFloat(data.rtd1) + parseFloat(data.rtd2) + parseFloat(data.rtd3) + parseFloat(data.rtd4) +
     parseFloat(data.tc1) + parseFloat(data.tc2) + parseFloat(data.tc3) + parseFloat(data.tc4)) / 8
  ).toFixed(1) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(80)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-gray-400 to-gray-600 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 4 + 3}s`,
            }}
          />
        ))}
      </div>
      
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Header */}
          <div className="flex flex-col lg:flex-row items-center lg:items-center justify-between mb-12">
            <div className="mb-6 lg:mb-0">
              <h1 className="text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-200 via-gray-400 to-gray-600 mb-4">
                Temperature Hub
              </h1>
              <p className="text-gray-300 text-xl">Real-time sensor monitoring dashboard</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <StatusIndicator isOnline={!error} />
              <button 
                onClick={refreshData}
                className="bg-gradient-to-r from-gray-700/50 to-gray-800/50 hover:from-gray-600/50 hover:to-gray-700/50 backdrop-blur-sm p-4 rounded-2xl transition-all duration-300 hover:scale-105 border border-gray-700/50 hover:border-gray-600/70"
              >
                <RefreshCw className="w-6 h-6 text-gray-300" />
              </button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <StatsCard 
              icon={Activity}
              label="Average Temperature"
              value={`${avgTemp}°C`}
              color="from-gray-600/30 to-gray-700/30"
            />
            <StatsCard 
              icon={Zap}
              label="Active Sensors"
              value="8"
              color="from-gray-600/30 to-gray-700/30"
            />
            {/* <StatsCard 
              icon={TrendingUp}
              label="System Health"
              value="100%"
              trend={0}
              color="from-gray-600/30 to-gray-700/30"
            /> */}
          </div>

          {/* RTD Sensors Section */}
          <div className="mb-16">
            <div className="flex items-center mb-8">
              <div className="w-2 h-12 bg-gradient-to-b from-gray-400 to-gray-600 rounded-full mr-4"></div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">PT 100 RTD Sensors</h2>
                <p className="text-gray-400">Resistance temperature detectors</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <ThermometerDisplay value={parseFloat(data.rtd1)} label="RTD 1" type="PT 100 RTD" index={0} />
              <ThermometerDisplay value={parseFloat(data.rtd2)} label="RTD 2" type="PT 100 RTD" index={1} />
              <ThermometerDisplay value={parseFloat(data.rtd3)} label="RTD 3" type="PT 100 RTD" index={2} />
              <ThermometerDisplay value={parseFloat(data.rtd4)} label="RTD 4" type="PT 100 RTD" index={3} />
            </div>
          </div>

          {/* Thermocouple Sensors Section */}
          <div className="mb-16">
            <div className="flex items-center mb-8">
              <div className="w-2 h-12 bg-gradient-to-b from-gray-500 to-gray-700 rounded-full mr-4"></div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Thermocouple Sensors</h2>
                <p className="text-gray-400">High-precision temperature measurement</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <ThermometerDisplay value={parseFloat(data.tc1)} label="TC 1" type="Thermocouple" index={4} />
              <ThermometerDisplay value={parseFloat(data.tc2)} label="TC 2" type="Thermocouple" index={5} />
              <ThermometerDisplay value={parseFloat(data.tc3)} label="TC 3" type="Thermocouple" index={6} />
              <ThermometerDisplay value={parseFloat(data.tc4)} label="TC 4" type="Thermocouple" index={7} />
            </div>
          </div>

          {/* Enhanced Footer */}
          <div className="text-center bg-gradient-to-r from-gray-800/30 to-gray-900/30 backdrop-blur-sm rounded-3xl p-8 border border-gray-700/30">
            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-gray-300">Last updated: {lastUpdate?.toLocaleTimeString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-gray-300">Data ID: {data.id}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                <span className="text-gray-300">Created: {new Date(data.created_at).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Temperature;