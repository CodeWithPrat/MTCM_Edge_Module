import React, { useState, useEffect, useRef } from 'react';
import * as Plotly from 'plotly.js-dist';

const Vibration = () => {
  const [vibrationData, setVibrationData] = useState({
    xg: 0,
    yg: 0,
    zg: 0,
    freq: 0,
    rpm: 0
  });
  const [fftData, setFftData] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [isRealtime, setIsRealtime] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastUpdate, setLastUpdate] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  
  const plotRef = useRef(null);
  const intervalRef = useRef(null);
  const plotInitialized = useRef(false);

  // Initialize plot
  const initializePlot = () => {
    if (!plotRef.current || plotInitialized.current) return;

    const layout = {
      title: {
        text: 'Real-time FFT Spectrum',
        font: { color: '#ffffff', size: 20 }
      },
      xaxis: {
        title: { text: 'Frequency (Hz)', font: { color: '#ffffff' } },
        color: '#ffffff',
        gridcolor: '#333333',
        zerolinecolor: '#555555'
      },
      yaxis: {
        title: { text: 'Magnitude', font: { color: '#ffffff' } },
        color: '#ffffff',
        gridcolor: '#333333',
        zerolinecolor: '#555555'
      },
      plot_bgcolor: '#000000',  // Set plot background to black
      paper_bgcolor: '#000000', // Set paper background to black
      font: { color: '#ffffff' },
      margin: { l: 50, r: 50, t: 50, b: 50 }
    };

    const config = {
      responsive: true,
      displayModeBar: false
    };

    Plotly.newPlot(plotRef.current, [], layout, config);
    plotInitialized.current = true;
  };

  // Fetch vibration data
  const fetchVibrationData = async () => {
    try {
      const response = await fetch('https://cmti-edge.online/mtcm/Backend/mtcmedge.php');
      const data = await response.json();
      
      if (data.success) {
        const newData = {
          xg: parseFloat(data.data.xg) || 0,
          yg: parseFloat(data.data.yg) || 0,
          zg: parseFloat(data.data.zg) || 0,
          freq: parseFloat(data.data.freq) || 0,
          rpm: (parseFloat(data.data.freq) || 0) * 60
        };
        setVibrationData(newData);
        setIsConnected(true);
        setError('');
      } else {
        throw new Error(data.error || 'Failed to fetch vibration data');
      }
    } catch (err) {
      setError('Failed to fetch vibration data');
      setIsConnected(false);
    }
  };

  // Fetch FFT data
  const fetchFFTData = async (date = null) => {
    try {
      setLoading(true);
      let url = 'https://cmti-edge.online/mtcm/Backend/VibrationFFT.php';
      if (date) {
        url += `?date=${date}`;
      } else {
        url += '?realtime=1';
      }

      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        const plotData = data.data;
        setFftData(plotData);
        updatePlot(plotData);
        setLastUpdate(new Date().toLocaleTimeString());
        setError(''); // Clear any previous errors
      } else {
        throw new Error(data.error || 'No FFT data available');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Update plot with new data
  const updatePlot = (data) => {
    if (!plotRef.current || !data) return;

    const trace = {
      x: data.x || [],
      y: data.y || [],
      type: 'scatter',
      mode: 'lines',
      name: 'FFT Spectrum',
      line: {
        color: '#4895ef',
        width: 2
      }
    };

    const layout = {
      title: {
        text: 'Real-time FFT Spectrum',
        font: { color: '#ffffff', size: 20 }
      },
      xaxis: {
        title: { text: 'Frequency (Hz)', font: { color: '#ffffff' } },
        color: '#ffffff',
        gridcolor: '#333333',
        zerolinecolor: '#555555'
      },
      yaxis: {
        title: { text: 'Magnitude', font: { color: '#ffffff' } },
        color: '#ffffff',
        gridcolor: '#333333',
        zerolinecolor: '#555555'
      },
      plot_bgcolor: '#000000',  // Ensure plot background stays black
      paper_bgcolor: '#000000', // Ensure paper background stays black
      font: { color: '#ffffff' },
      margin: { l: 50, r: 50, t: 50, b: 50 }
    };

    Plotly.react(plotRef.current, [trace], layout);
  };

  // Handle date change
  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    if (date) {
      setIsRealtime(false);
      fetchFFTData(date);
    } else {
      setIsRealtime(true);
    }
  };

  // Toggle realtime mode
  const toggleRealtime = () => {
    if (isRealtime) {
      setIsRealtime(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    } else {
      setIsRealtime(true);
      setSelectedDate('');
    }
  };

  // Setup intervals
  useEffect(() => {
    // Fetch vibration data every 1 second
    const vibrationInterval = setInterval(fetchVibrationData, 1000);
    
    // Initial fetch
    fetchVibrationData();
    
    return () => clearInterval(vibrationInterval);
  }, []);

  useEffect(() => {
    // Setup FFT data fetching
    if (isRealtime) {
      fetchFFTData(); // Initial fetch
      intervalRef.current = setInterval(() => fetchFFTData(), 2000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRealtime]);

  // Initialize plot on mount
  useEffect(() => {
    initializePlot();
  }, []);

  const MetricCard = ({ title, value, unit, color = "brand-sky", icon }) => (
    <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-brand-sky/50 transition-all duration-300 hover:shadow-lg hover:shadow-brand-sky/20 transform hover:scale-105">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-gray-300 text-sm font-medium">{title}</h3>
        {icon && <div className="text-brand-sky text-xl">{icon}</div>}
      </div>
      <div className="flex items-baseline">
        <span className={`text-2xl font-bold text-${color} mr-1`}>
          {typeof value === 'number' ? value.toFixed(2) : value}
        </span>
        <span className="text-gray-400 text-sm">{unit}</span>
      </div>
      <div className="mt-2 w-full bg-gray-700 rounded-full h-1">
        <div 
          className={`bg-gradient-to-r from-${color} to-${color}/70 h-1 rounded-full transition-all duration-300`}
          style={{ width: `${Math.min(Math.abs(value) * 10, 100)}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 animate-gradient-xy"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(116,0,184,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(72,149,239,0.1),transparent_50%)]"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-200 via-gray-400 to-gray-600 mb-2">
            Vibration Monitoring Dashboard
          </h1>
          <div className="flex items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
              <span className="text-gray-400">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <div className="text-gray-400">
              Last Update: {lastUpdate || 'Never'}
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isRealtime ? 'bg-blue-500' : 'bg-yellow-500'} animate-pulse`}></div>
              <span className="text-gray-400">
                {isRealtime ? 'Real-time' : 'Historical'}
              </span>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-900/50 border border-red-500/50 rounded-lg p-4 mb-6 backdrop-blur-sm">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {/* Primary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <MetricCard 
            title="Frequency" 
            value={vibrationData.freq} 
            unit="Hz" 
            color="brand-sky"
            icon="📈"
          />
          <MetricCard 
            title="RPM" 
            value={vibrationData.rpm} 
            unit="RPM" 
            color="brand-purple"
            icon="🔄"
          />
        </div>

        {/* Acceleration Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <MetricCard 
            title="X-Axis Acceleration" 
            value={vibrationData.xg} 
            unit="g" 
            color="brand-sky"
            icon="↔️"
          />
          <MetricCard 
            title="Y-Axis Acceleration" 
            value={vibrationData.yg} 
            unit="g" 
            color="brand-violet"
            icon="↕️"
          />
          <MetricCard 
            title="Z-Axis Acceleration" 
            value={vibrationData.zg} 
            unit="g" 
            color="brand-purple"
            icon="🔄"
          />
        </div>

        {/* FFT Plot Section */}
        <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h2 className="text-2xl font-bold text-white mb-4 md:mb-0">FFT Spectrum Analysis</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-2">
                <label className="text-gray-300 text-sm">Date Filter:</label>
                <input
                  style={{ colorScheme: 'dark' }}
                  type="date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-sky"
                />
              </div>
              <button
                onClick={toggleRealtime}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isRealtime 
                    ? 'bg-brand-sky text-white hover:bg-brand-sky/80' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {isRealtime ? 'Stop Real-time' : 'Start Real-time'}
              </button>
            </div>
          </div>

          {/* Plot Container with conditional loading overlay */}
          <div className="relative bg-black rounded-lg p-4 min-h-[400px]">
            {/* Loading Overlay - only shows when actually loading */}
            {loading && (
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-sky"></div>
                  <span className="ml-3 text-gray-400">Loading FFT data...</span>
                </div>
              </div>
            )}
            
            {/* Plot */}
            <div ref={plotRef} className="w-full h-96"></div>
          </div>

          {/* Plot Info */}
          {fftData && (
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-400">
              <span>Record ID: {fftData.id || 'N/A'}</span>
              <span>Created: {fftData.created_at || 'N/A'}</span>
              <span>Data Points: {fftData.x?.length || 0}</span>
            </div>
          )}
        </div>
      </div>

      {/* Floating particles effect */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-brand-sky rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
      `}</style>
    </div>
  );
};

export default Vibration;