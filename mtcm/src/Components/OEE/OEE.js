import React, { useState, useEffect } from 'react';
import { Calculator, TrendingUp, AlertTriangle, CheckCircle, Settings, Activity, BarChart3, PieChart, LineChart, Target } from 'lucide-react';

const OEECalculator = () => {
  const [inputs, setInputs] = useState({
    overtimeMins: 0,
    otherBreaktimeMins: 0,
    totalPartsProduced: 0,
    scrapPartsProduced: 0
  });

  const [results, setResults] = useState({
    availability: 0,
    performance: 0,
    quality: 0,
    oee: 0,
    availableTime: 0,
    goodParts: 0,
    theoreticalParts: 0,
    scheduledTime: 0,
    totalBreaktime: 0
  });

  const [historicalData, setHistoricalData] = useState([
    { date: '2024-01-01', oee: 75, availability: 85, performance: 88, quality: 100 },
    { date: '2024-01-02', oee: 68, availability: 80, performance: 85, quality: 100 },
    { date: '2024-01-03', oee: 82, availability: 90, performance: 91, quality: 100 },
    { date: '2024-01-04', oee: 77, availability: 85, performance: 90, quality: 100 },
    { date: '2024-01-05', oee: 73, availability: 82, performance: 89, quality: 100 },
    { date: '2024-01-06', oee: 79, availability: 88, performance: 90, quality: 100 },
    { date: '2024-01-07', oee: results.oee, availability: results.availability, performance: results.performance, quality: results.quality }
  ]);

  // Constants
  const PRODUCTION_TIME = 480; // minutes (8 hours)
  const BREAKTIME = 60; // minutes (1 hour)
  const MACHINE_CAPABILITY = 60; // parts per minute

  const calculateOEE = () => {
    const totalBreaktime = BREAKTIME + parseFloat(inputs.otherBreaktimeMins || 0);
    const scheduledTime = PRODUCTION_TIME + parseFloat(inputs.overtimeMins || 0);
    const availableTime = scheduledTime - totalBreaktime;
    
    // Availability Calculation (Available Time / Scheduled Time)
    const availability = scheduledTime > 0 ? (availableTime / scheduledTime) * 100 : 0;
    
    // Performance Calculation (Actual Parts / Theoretical Parts)
    const totalPartsProduced = parseFloat(inputs.totalPartsProduced || 0);
    const theoreticalParts = availableTime * MACHINE_CAPABILITY;
    const performance = theoreticalParts > 0 ? (totalPartsProduced / theoreticalParts) * 100 : 0;
    
    // Quality Calculation (Good Parts / Total Parts)
    const scrapParts = parseFloat(inputs.scrapPartsProduced || 0);
    const goodParts = totalPartsProduced - scrapParts;
    const quality = totalPartsProduced > 0 ? (goodParts / totalPartsProduced) * 100 : 0;
    
    // OEE Calculation
    const oee = (availability * performance * quality) / 10000;
    
    setResults({
      availability: Math.round(availability * 10) / 10,
      performance: Math.round(performance * 10) / 10,
      quality: Math.round(quality * 10) / 10,
      oee: Math.round(oee * 10) / 10,
      availableTime: Math.round(availableTime),
      goodParts: Math.round(goodParts),
      theoreticalParts: Math.round(theoreticalParts),
      scheduledTime: Math.round(scheduledTime),
      totalBreaktime: Math.round(totalBreaktime)
    });
  };

  useEffect(() => {
    calculateOEE();
  }, [inputs]);

  // Update historical data when results change
  useEffect(() => {
    setHistoricalData(prev => {
      const newData = [...prev];
      newData[newData.length - 1] = {
        date: '2024-01-07',
        oee: results.oee,
        availability: results.availability,
        performance: results.performance,
        quality: results.quality
      };
      return newData;
    });
  }, [results]);

  const handleInputChange = (field, value) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getOEEStatus = (oee) => {
    if (oee >= 85) return { status: 'Excellent', color: 'text-green-400', bg: 'bg-green-900/20' };
    if (oee >= 70) return { status: 'Good', color: 'text-blue-400', bg: 'bg-blue-900/20' };
    if (oee >= 60) return { status: 'Fair', color: 'text-yellow-400', bg: 'bg-yellow-900/20' };
    return { status: 'Poor', color: 'text-red-400', bg: 'bg-red-900/20' };
  };

  const oeeStatus = getOEEStatus(results.oee);

  // ApexCharts Component
  const ApexChart = ({ options, series, type, height = 300 }) => {
    const chartRef = React.useRef(null);
    
    useEffect(() => {
      if (typeof window !== 'undefined' && window.ApexCharts) {
        if (chartRef.current) {
          chartRef.current.innerHTML = '';
        }
        
        const chart = new window.ApexCharts(chartRef.current, {
          ...options,
          series,
          chart: {
            ...options.chart,
            type,
            height,
            background: 'transparent',
            foreColor: '#9CA3AF'
          }
        });
        
        chart.render();
        
        return () => {
          chart.destroy();
        };
      }
    }, [options, series, type, height]);

    return <div ref={chartRef} />;
  };

  // Load ApexCharts script
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.ApexCharts) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/apexcharts/3.44.0/apexcharts.min.js';
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  // Chart configurations
  const pieChartOptions = {
    chart: {
      type: 'pie',
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
      }
    },
    labels: ['Good Parts', 'Scrap Parts'],
    colors: ['#10B981', '#EF4444'],
    legend: {
      position: 'bottom',
      labels: {
        colors: '#9CA3AF'
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '60%'
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function(val) {
        return Math.round(val) + '%';
      }
    }
  };

  const barChartOptions = {
    chart: {
      type: 'bar',
      toolbar: {
        show: false
      }
    },
    colors: ['#3B82F6', '#10B981', '#8B5CF6'],
    xaxis: {
      categories: ['Availability', 'Performance', 'Quality'],
      labels: {
        style: {
          colors: '#9CA3AF'
        }
      }
    },
    yaxis: {
      max: 100,
      labels: {
        style: {
          colors: '#9CA3AF'
        }
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 8,
        dataLabels: {
          position: 'top'
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function(val) {
        return val + '%';
      },
      offsetY: -20,
      style: {
        fontSize: '12px',
        colors: ['#9CA3AF']
      }
    },
    grid: {
      borderColor: '#374151'
    }
  };

  const lineChartOptions = {
    chart: {
      type: 'line',
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    },
    colors: ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B'],
    stroke: {
      width: 3,
      curve: 'smooth'
    },
    xaxis: {
      categories: historicalData.map(d => new Date(d.date).toLocaleDateString()),
      labels: {
        style: {
          colors: '#9CA3AF'
        }
      }
    },
    yaxis: {
      max: 100,
      labels: {
        style: {
          colors: '#9CA3AF'
        }
      }
    },
    legend: {
      labels: {
        colors: '#9CA3AF'
      }
    },
    grid: {
      borderColor: '#374151'
    },
    markers: {
      size: 5
    }
  };

  // Analytics calculations
  const avgOEE = historicalData.reduce((sum, d) => sum + d.oee, 0) / historicalData.length;
  const trendDirection = results.oee > avgOEE ? 'up' : 'down';
  const efficiencyLoss = 100 - results.oee;
  const potentialProduction = results.theoreticalParts;
  const actualProduction = parseFloat(inputs.totalPartsProduced || 0);
  const productionLoss = potentialProduction - actualProduction;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-200 via-gray-400 to-gray-600 mb-4">
            OEE Analytics
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Overall Equipment Effectiveness Calculator with Advanced Analytics & Visualizations
          </p>
        </div>

        {/* Input Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:bg-gray-700/50 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-blue-400">Overtime (mins)</h3>
              <Settings className="w-5 h-5 text-blue-400" />
            </div>
            <input
              type="number"
              value={inputs.overtimeMins}
              onChange={(e) => handleInputChange('overtimeMins', e.target.value)}
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              placeholder="0"
            />
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:bg-gray-700/50 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-purple-400">Other Breaktime (mins)</h3>
              <Activity className="w-5 h-5 text-purple-400" />
            </div>
            <input
              type="number"
              value={inputs.otherBreaktimeMins}
              onChange={(e) => handleInputChange('otherBreaktimeMins', e.target.value)}
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              placeholder="0"
            />
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:bg-gray-700/50 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-green-400">Total Parts Produced</h3>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <input
              type="number"
              value={inputs.totalPartsProduced}
              onChange={(e) => handleInputChange('totalPartsProduced', e.target.value)}
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
              placeholder="0"
            />
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:bg-gray-700/50 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-red-400">Scrap Parts Produced</h3>
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <input
              type="number"
              value={inputs.scrapPartsProduced}
              onChange={(e) => handleInputChange('scrapPartsProduced', e.target.value)}
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
              placeholder="0"
            />
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center">
            <div className="flex items-center justify-center mb-4">
              <Calculator className="w-8 h-8 text-blue-400 mr-2" />
              <h3 className="text-xl font-semibold text-blue-400">OEE</h3>
            </div>
            <p className="text-4xl font-bold text-white mb-2">{results.oee}%</p>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${oeeStatus.bg} ${oeeStatus.color}`}>
              {oeeStatus.status}
            </span>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center">
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-400 mr-2" />
              <h3 className="text-xl font-semibold text-green-400">Availability</h3>
            </div>
            <p className="text-4xl font-bold text-white">{results.availability}%</p>
            <p className="text-sm text-gray-400 mt-2">{results.availableTime} min available</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center">
            <div className="flex items-center justify-center mb-4">
              <TrendingUp className="w-8 h-8 text-blue-400 mr-2" />
              <h3 className="text-xl font-semibold text-blue-400">Performance</h3>
            </div>
            <p className="text-4xl font-bold text-white">{results.performance}%</p>
            <p className="text-sm text-gray-400 mt-2">{results.theoreticalParts} parts theoretical</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center">
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-purple-400 mr-2" />
              <h3 className="text-xl font-semibold text-purple-400">Quality</h3>
            </div>
            <p className="text-4xl font-bold text-white">{results.quality}%</p>
            <p className="text-sm text-gray-400 mt-2">{results.goodParts} good parts</p>
          </div>
        </div>

        {/* Advanced Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-yellow-400">Avg OEE (7 days)</h3>
              <Target className="w-5 h-5 text-yellow-400" />
            </div>
            <p className="text-2xl font-bold text-white">{avgOEE.toFixed(1)}%</p>
            <p className={`text-sm ${trendDirection === 'up' ? 'text-green-400' : 'text-red-400'}`}>
              {trendDirection === 'up' ? '↗' : '↘'} {Math.abs(results.oee - avgOEE).toFixed(1)}% vs avg
            </p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-red-400 mb-2">Efficiency Loss</h3>
            <p className="text-2xl font-bold text-white">{efficiencyLoss.toFixed(1)}%</p>
            <p className="text-sm text-gray-400">Potential improvement</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-orange-400 mb-2">Production Loss</h3>
            <p className="text-2xl font-bold text-white">{productionLoss}</p>
            <p className="text-sm text-gray-400">Parts not produced</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-cyan-400 mb-2">Utilization Rate</h3>
            <p className="text-2xl font-bold text-white">{((actualProduction / potentialProduction) * 100).toFixed(1)}%</p>
            <p className="text-sm text-gray-400">Of max capacity</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Pie Chart - Quality Distribution */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Quality Distribution</h3>
              <PieChart className="w-6 h-6 text-green-400" />
            </div>
            <ApexChart
              options={pieChartOptions}
              series={[results.goodParts, parseFloat(inputs.scrapPartsProduced || 0)]}
              type="donut"
              height={300}
            />
          </div>

          {/* Bar Chart - OEE Components */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">OEE Components</h3>
              <BarChart3 className="w-6 h-6 text-blue-400" />
            </div>
            <ApexChart
              options={barChartOptions}
              series={[{
                name: 'Percentage',
                data: [results.availability, results.performance, results.quality]
              }]}
              type="bar"
              height={300}
            />
          </div>

          {/* Line Chart - Historical Trend */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">7-Day Trend</h3>
              <LineChart className="w-6 h-6 text-purple-400" />
            </div>
            <ApexChart
              options={lineChartOptions}
              series={[
                {
                  name: 'OEE',
                  data: historicalData.map(d => d.oee)
                },
                {
                  name: 'Availability',
                  data: historicalData.map(d => d.availability)
                },
                {
                  name: 'Performance',
                  data: historicalData.map(d => d.performance)
                },
                {
                  name: 'Quality',
                  data: historicalData.map(d => d.quality)
                }
              ]}
              type="line"
              height={300}
            />
          </div>
        </div>

        {/* Detailed Calculations */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">Calculation Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <h4 className="font-semibold text-green-400 mb-2">Availability</h4>
              <p className="text-gray-300">Available Time: {results.availableTime} min</p>
              <p className="text-gray-300">Scheduled Time: {results.scheduledTime} min</p>
              <p className="text-gray-300">Formula: {results.availableTime}/{results.scheduledTime} × 100</p>
            </div>
            <div>
              <h4 className="font-semibold text-blue-400 mb-2">Performance</h4>
              <p className="text-gray-300">Actual Parts: {inputs.totalPartsProduced}</p>
              <p className="text-gray-300">Theoretical Parts: {results.theoreticalParts}</p>
              <p className="text-gray-300">Formula: {inputs.totalPartsProduced}/{results.theoreticalParts} × 100</p>
            </div>
            <div>
              <h4 className="font-semibold text-purple-400 mb-2">Quality</h4>
              <p className="text-gray-300">Good Parts: {results.goodParts}</p>
              <p className="text-gray-300">Total Parts: {inputs.totalPartsProduced}</p>
              <p className="text-gray-300">Formula: {results.goodParts}/{inputs.totalPartsProduced} × 100</p>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">Improvement Recommendations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.availability < 85 && (
              <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
                <h4 className="font-semibold text-red-400 mb-2">Availability Issue</h4>
                <p className="text-gray-300 text-sm">Consider reducing downtime and optimizing maintenance schedules.</p>
              </div>
            )}
            {results.performance < 85 && (
              <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-400 mb-2">Performance Issue</h4>
                <p className="text-gray-300 text-sm">Focus on cycle time reduction and speed optimization.</p>
              </div>
            )}
            {results.quality < 95 && (
              <div className="bg-orange-900/20 border border-orange-700 rounded-lg p-4">
                <h4 className="font-semibold text-orange-400 mb-2">Quality Issue</h4>
                <p className="text-gray-300 text-sm">Implement quality control measures to reduce scrap rate.</p>
              </div>
            )}
            {results.oee >= 85 && (
              <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
                <h4 className="font-semibold text-green-400 mb-2">Excellent Performance</h4>
                <p className="text-gray-300 text-sm">Maintain current practices and consider sharing best practices.</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-400">
          <p>OEE Analytics Dashboard - Manufacturing Excellence through Data-Driven Insights</p>
        </div>
      </div>
    </div>
  );
};

export default OEECalculator;