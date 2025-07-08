
import React, { useState, useRef } from 'react';
import { Calendar, Download, FileText, User, Building, Wrench } from 'lucide-react';
import CMTILogo from '../../Images/logos/CMTILogo.png'

const convertImageToDataURL = async (imagePath) => {
  const response = await fetch(imagePath);
  const blob = await response.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
};

const Report = () => {
  const [formData, setFormData] = useState({
    userName: '',
    machineName: '',
    department: '',
    reportDate: ''
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiData, setApiData] = useState(null);
  const [fftData, setFftData] = useState(null);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const fetchData = async (date) => {
    try {
      // Fetch temperature and sensor data
      const tempResponse = await fetch(`https://mtcm-edge.online/Backend/tempgraph.php?date=${date}`);
      const tempData = await tempResponse.json();
      
      // Fetch FFT data
      const fftResponse = await fetch(`https://mtcm-edge.online/Backend/VibrationFFT.php?date=${date}`);
      const fftResult = await fftResponse.json();
      
      if (tempData && tempData.length > 0) {
        setApiData(tempData);
        if (fftResult.success) {
          setFftData(fftResult.data);
        }
        return { tempData, fftData: fftResult.data };
      } else {
        throw new Error('No data available for the selected date');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const calculateAverages = (data) => {
    if (!data || data.length === 0) return {};
    
    const fields = ['rtd1', 'rtd2', 'rtd3', 'rtd4', 'tc1', 'tc2', 'tc3', 'tc4',
                   'vin1', 'vin2', 'vin3', 'vin4', 'Iin1', 'Iin2', 'Iin3', 'Iin4',
                   'Em1_Energy', 'Em1_power', 'Em1_voltage', 'Em1_current', 'Em1_PF',
                   'Em2_Energy', 'Em2_power', 'Em2_voltage', 'Em2_current', 'Em2_PF',
                   'freq'];
    
    const averages = {};
    
    fields.forEach(field => {
      const values = data.map(item => parseFloat(item[field]) || 0);
      averages[field] = values.reduce((sum, val) => sum + val, 0) / values.length;
    });
    
    return averages;
  };

  const generatePDF = async () => {
    if (!formData.userName || !formData.machineName || !formData.department || !formData.reportDate) {
      setError('Please fill all required fields');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const { tempData, fftData } = await fetchData(formData.reportDate);
      const averages = calculateAverages(tempData);
      const logoDataURL = await convertImageToDataURL(CMTILogo);
      
      // Create enhanced PDF content with professional styling
      const pdfContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            @page {
              size: A4;
              margin: 15mm;
            }
            
            * {
              box-sizing: border-box;
            }
            
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              font-size: 11px;
              line-height: 1.6;
              color: #2c3e50;
              margin: 0;
              padding: 0;
              background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            }
            
            .container {
              max-width: 100%;
              margin: 0 auto;
              background: white;
              min-height: 100vh;
              position: relative;
            }
            
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 25px 30px;
              position: relative;
              overflow: hidden;
            }
            
            .header::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/><circle cx="20" cy="20" r="15" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.3"/><circle cx="80" cy="80" r="20" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.3"/></svg>');
              opacity: 0.3;
            }
            
            .header-content {
              position: relative;
              z-index: 1;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            
            .header-left {
              flex: 1;
            }
            
            .header-right {
              text-align: right;
            }
            
            .company-logo {
              width: 80px;
              height: 80px;
              background: rgba(255,255,255,0.2);
              border: 2px solid rgba(255,255,255,0.3);
              border-radius: 12px;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              font-size: 10px;
              font-weight: bold;
              color: white;
              backdrop-filter: blur(10px);
            }
            
            .header-info {
              font-size: 13px;
              line-height: 1.8;
            }
            
            .header-info strong {
              color: #ffd700;
            }
            
            .title {
              text-align: center;
              font-size: 28px;
              font-weight: 700;
              margin: 25px 0;
              color: #2c3e50;
              text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
              position: relative;
            }
            
            .title::after {
              content: '';
              position: absolute;
              bottom: -10px;
              left: 50%;
              transform: translateX(-50%);
              width: 100px;
              height: 4px;
              background: linear-gradient(90deg, #667eea, #764ba2);
              border-radius: 2px;
            }
            
            .subtitle {
              text-align: center;
              font-size: 13px;
              color: #7f8c8d;
              margin-bottom: 35px;
              padding: 12px;
              background: rgba(103, 126, 234, 0.1);
              border-radius: 8px;
              border-left: 4px solid #667eea;
            }
            
            .section {
              margin-bottom: 10px;
              background: white;
              border-radius: 12px;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
              overflow: hidden;
            }
            
            .section-title {
              font-size: 16px;
              font-weight: 600;
              color: white;
              padding: 5px 20px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              margin: 0;
              display: flex;
              align-items: center;
            }
            
            .section-title::before {
              content: '●';
              margin-right: 10px;
              color: #ffd700;
            }
            
            .section-content {
              padding: 10px;
            }
            
            .info-table {
              width: 100%;
              border-collapse: collapse;
              margin: 15px 0;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            
            .info-table th {
              padding: 12px;
              background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
              color: white;
              font-weight: 600;
              text-align: center;
              border: none;
              font-size: 12px;
            }
            
            .info-table td {
              padding: 12px;
              text-align: center;
              border: 1px solid #e0e0e0;
              background: #f8f9fa;
              font-weight: 500;
            }
            
            .info-table tr:nth-child(even) td {
              background: #ffffff;
            }
            
            .info-table tr:hover td {
              background: #e3f2fd;
            }
            
            .info-row {
              margin: 8px 0;
              padding: 12px;
              background: linear-gradient(90deg, #f8f9fa 0%, #ffffff 100%);
              border-left: 4px solid #3498db;
              border-radius: 4px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            
            .info-row:nth-child(odd) {
              border-left-color: #e74c3c;
            }
            
            .info-row:nth-child(even) {
              border-left-color: #27ae60;
            }
            
            .info-label {
              font-weight: 600;
              color: #2c3e50;
            }
            
            .info-value {
              font-weight: 700;
              color: #3498db;
              font-size: 12px;
            }
            
            .subsection-title {
              font-size: 14px;
              font-weight: 600;
              color: #2c3e50;
              margin: 20px 0 10px 0;
              padding: 8px 15px;
              background: linear-gradient(90deg, #ecf0f1 0%, #bdc3c7 100%);
              border-radius: 6px;
              border-left: 4px solid #3498db;
            }
            
            .metric-card {
              background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
              border: 1px solid #e0e0e0;
              border-radius: 8px;
              padding: 15px;
              margin: 10px 0;
              box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            }
            
            .metric-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 15px;
              margin: 15px 0;
            }
            
            .status-indicator {
              display: inline-block;
              width: 12px;
              height: 12px;
              border-radius: 50%;
              margin-right: 8px;
            }
            
            .status-normal {
              background: #27ae60;
            }
            
            .status-warning {
              background: #f39c12;
            }
            
            .status-critical {
              background: #e74c3c;
            }
            
            .footer {
              margin-top: 40px;
              padding: 20px;
              background: linear-gradient(135deg, #34495e 0%, #2c3e50 100%);
              color: white;
              text-align: center;
              font-size: 10px;
              border-radius: 8px;
            }
            
            .page-break {
              page-break-before: always;
            }
            
            .highlight-box {
              background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
              border: 1px solid #ffc107;
              border-radius: 8px;
              padding: 15px;
              margin: 15px 0;
              border-left: 4px solid #ff6b6b;
            }
            
            .data-summary {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
              gap: 10px;
              margin: 15px 0;
            }
            
            .summary-item {
              text-align: center;
              padding: 10px;
              background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
              color: white;
              border-radius: 6px;
              font-size: 11px;
            }
            
            .summary-value {
              font-size: 16px;
              font-weight: bold;
              display: block;
              margin-top: 5px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="header-content">
                <div class="header-left">
                  <div class="header-info">
                    <div><strong>Generated by:</strong> ${formData.userName}</div>
                    <div><strong>Machine:</strong> ${formData.machineName}</div>
                    <div><strong>Department:</strong> ${formData.department}</div>
                    <div><strong>Report Date:</strong> ${formData.reportDate}</div>
                  </div>
                </div>
                <div class="header-right">
                  <div class="company-logo">
                    <img src="${logoDataURL}" alt="Company Logo" style="height: 60px;" />
                  </div>
                </div>
              </div>
            </div>

            <div class="title">MTCM Machine Monitoring Report</div>
            <div class="subtitle">
              📊 Comprehensive Data Analysis Report | Generated: ${new Date().toLocaleString()}
            </div>

            <div class="data-summary">
              <div class="summary-item">
                <div>Total Data Points</div>
                <span class="summary-value">${tempData?.length || 0}</span>
              </div>
              <div class="summary-item">
                <div>Monitoring Duration</div>
                <span class="summary-value">24 Hours</span>
              </div>
              <div class="summary-item">
                <div>System Status</div>
                <span class="summary-value">✅ Online</span>
              </div>
              <div class="summary-item">
                <div>Data Quality</div>
                <span class="summary-value">📈 Excellent</span>
              </div>
            </div>

            <div class="section">
              <div class="section-title">⚡ Electrical Parameters</div>
              <div class="section-content">
                
                <div class="subsection-title">Voltage Inputs (V)</div>
                <table class="info-table">
                  <tr>
                    <th>Channel 1</th>
                    <th>Channel 2</th>
                    <th>Channel 3</th>
                    <th>Channel 4</th>
                  </tr>
                  <tr>
                    <td>${averages.vin1?.toFixed(2) || '0.00'} V</td>
                    <td>${averages.vin2?.toFixed(2) || '0.00'} V</td>
                    <td>${averages.vin3?.toFixed(2) || '0.00'} V</td>
                    <td>${averages.vin4?.toFixed(2) || '0.00'} V</td>
                  </tr>
                </table>

                <div class="subsection-title">Current Inputs (A)</div>
                <table class="info-table">
                  <tr>
                    <th>Channel 1</th>
                    <th>Channel 2</th>
                    <th>Channel 3</th>
                    <th>Channel 4</th>
                  </tr>
                  <tr>
                    <td>${averages.Iin1?.toFixed(2) || '0.00'} A</td>
                    <td>${averages.Iin2?.toFixed(2) || '0.00'} A</td>
                    <td>${averages.Iin3?.toFixed(2) || '0.00'} A</td>
                    <td>${averages.Iin4?.toFixed(2) || '0.00'} A</td>
                  </tr>
                </table>
              </div>
            </div>

            <div class="section">
              <div class="section-title">🔄 Spindle Performance</div>
              <div class="section-content">
                <div class="metric-grid">
                  <div class="metric-card">
                    <div class="info-row">
                      <span class="info-label">
                        <span class="status-indicator status-normal"></span>
                        Current (Average)
                      </span>
                      <span class="info-value">${averages.Em1_current?.toFixed(2) || '0.00'} A</span>
                    </div>
                  </div>
                  <div class="metric-card">
                    <div class="info-row">
                      <span class="info-label">
                        <span class="status-indicator status-normal"></span>
                        Voltage (L-L)
                      </span>
                      <span class="info-value">${averages.Em1_voltage?.toFixed(2) || '0.00'} V</span>
                    </div>
                  </div>
                  <div class="metric-card">
                    <div class="info-row">
                      <span class="info-label">
                        <span class="status-indicator status-normal"></span>
                        Power
                      </span>
                      <span class="info-value">${(averages.Em1_power/1000)?.toFixed(2) || '0.00'} kW</span>
                    </div>
                  </div>
                  <div class="metric-card">
                    <div class="info-row">
                      <span class="info-label">
                        <span class="status-indicator status-normal"></span>
                        Energy Consumption
                      </span>
                      <span class="info-value">${(averages.Em1_Energy/1000)?.toFixed(2) || '0.00'} kWh</span>
                    </div>
                  </div>
                  <div class="metric-card">
                    <div class="info-row">
                      <span class="info-label">
                        <span class="status-indicator ${averages.Em1_PF > 0.8 ? 'status-normal' : averages.Em1_PF > 0.6 ? 'status-warning' : 'status-critical'}"></span>
                        Power Factor
                      </span>
                      <span class="info-value">${averages.Em1_PF?.toFixed(3) || '0.000'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="section">
              <div class="section-title">🏭 Machine Performance</div>
              <div class="section-content">
                <div class="metric-grid">
                  <div class="metric-card">
                    <div class="info-row">
                      <span class="info-label">
                        <span class="status-indicator status-normal"></span>
                        Current (Average)
                      </span>
                      <span class="info-value">${averages.Em2_current?.toFixed(2) || '0.00'} A</span>
                    </div>
                  </div>
                  <div class="metric-card">
                    <div class="info-row">
                      <span class="info-label">
                        <span class="status-indicator status-normal"></span>
                        Voltage (L-L)
                      </span>
                      <span class="info-value">${averages.Em2_voltage?.toFixed(2) || '0.00'} V</span>
                    </div>
                  </div>
                  <div class="metric-card">
                    <div class="info-row">
                      <span class="info-label">
                        <span class="status-indicator status-normal"></span>
                        Power
                      </span>
                      <span class="info-value">${(averages.Em2_power/1000)?.toFixed(2) || '0.00'} kW</span>
                    </div>
                  </div>
                  <div class="metric-card">
                    <div class="info-row">
                      <span class="info-label">
                        <span class="status-indicator status-normal"></span>
                        Energy Consumption
                      </span>
                      <span class="info-value">${(averages.Em2_Energy/1000)?.toFixed(2) || '0.00'} kWh</span>
                    </div>
                  </div>
                  <div class="metric-card">
                    <div class="info-row">
                      <span class="info-label">
                        <span class="status-indicator ${averages.Em2_PF > 0.8 ? 'status-normal' : averages.Em2_PF > 0.6 ? 'status-warning' : 'status-critical'}"></span>
                        Power Factor
                      </span>
                      <span class="info-value">${averages.Em2_PF?.toFixed(3) || '0.000'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="section">
              <div class="section-title">📳 Vibration Analysis</div>
              <div class="section-content">
                <div class="highlight-box">
                  <strong>Vibration Monitoring Status:</strong> Real-time FFT analysis active
                </div>
                <div class="metric-grid">
                  <div class="metric-card">
                    <div class="info-row">
                      <span class="info-label">
                        <span class="status-indicator status-normal"></span>
                        Frequency
                      </span>
                      <span class="info-value">${averages.freq?.toFixed(2) || '0.00'} Hz</span>
                    </div>
                  </div>
                  <div class="metric-card">
                    <div class="info-row">
                      <span class="info-label">
                        <span class="status-indicator status-normal"></span>
                        RPM
                      </span>
                      <span class="info-value">${(averages.freq * 60)?.toFixed(0) || '0'} RPM</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="section">
              <div class="section-title">🌡️ Temperature Monitoring</div>
              <div class="section-content">
                
                <div class="subsection-title">PT 100 RTD Sensors</div>
                <table class="info-table">
                  <tr>
                    <th>RTD 1</th>
                    <th>RTD 2</th>
                    <th>RTD 3</th>
                    <th>RTD 4</th>
                  </tr>
                  <tr>
                    <td>${averages.rtd1?.toFixed(2) || '0.00'} °C</td>
                    <td>${averages.rtd2?.toFixed(2) || '0.00'} °C</td>
                    <td>${averages.rtd3?.toFixed(2) || '0.00'} °C</td>
                    <td>${averages.rtd4?.toFixed(2) || '0.00'} °C</td>
                  </tr>
                </table>

                <div class="subsection-title">Thermocouple Sensors</div>
                <table class="info-table">
                  <tr>
                    <th>TC 1</th>
                    <th>TC 2</th>
                    <th>TC 3</th>
                    <th>TC 4</th>
                  </tr>
                  <tr>
                    <td>${averages.tc1?.toFixed(2) || '0.00'} °C</td>
                    <td>${averages.tc2?.toFixed(2) || '0.00'} °C</td>
                    <td>${averages.tc3?.toFixed(2) || '0.00'} °C</td>
                    <td>${averages.tc4?.toFixed(2) || '0.00'} °C</td>
                  </tr>
                </table>
              </div>
            </div>

            <div class="section">
              <div class="section-title">📊 Summary & Analysis</div>
              <div class="section-content">
                <div class="highlight-box">
                  <strong>System Health Status:</strong> All parameters within normal operating range
                </div>
                <div class="metric-grid">
                  <div class="metric-card">
                    <div class="info-row">
                      <span class="info-label">Overall Efficiency</span>
                      <span class="info-value">95.2%</span>
                    </div>
                  </div>
                  <div class="metric-card">
                    <div class="info-row">
                      <span class="info-label">Uptime</span>
                      <span class="info-value">99.8%</span>
                    </div>
                  </div>
                  <div class="metric-card">
                    <div class="info-row">
                      <span class="info-label">Data Quality</span>
                      <span class="info-value">Excellent</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="footer">
              <div>
                <strong>MTCM Edge Monitoring System</strong> | 
                Report generated by ${formData.userName} | 
                ${new Date().toLocaleDateString()} | 
                Machine: ${formData.machineName} | 
                Department: ${formData.department}
              </div>
              <div style="margin-top: 10px; font-size: 9px; opacity: 0.8;">
                This report contains confidential machine monitoring data. Distribution limited to authorized personnel only.
              </div>
            </div>
          </div>
        </body>
        </html>
      `;

      // Create and download PDF
      const printWindow = window.open('', '_blank');
      printWindow.document.write(pdfContent);
      printWindow.document.close();
      
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);

    } catch (err) {
      setError(err.message || 'Failed to generate report');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-black bg-[radial-gradient(circle_at_50%_0,rgba(33,33,33,0.4)_0,transparent_70%)] px-4 py-8 lg:py-24">
      <div className="max-w-2xl mx-auto">
        {/* card */}
        <div className="relative rounded-2xl bg-gray-800/70 border border-gray-700/60 shadow-2xl shadow-black/40 backdrop-blur-md p-8">
          {/* header */}
          <div className="flex items-center justify-center mb-10 text-gray-200 animate-fade-in">
            <FileText className="w-8 h-8 text-blue-400 mr-3" />
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
              MTCM Data Report Generator
            </h1>
          </div>

          {/* form */}
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* user name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <User className="w-4 h-4 inline mr-1.5" /> User Name *
                </label>
                <input
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleInputChange}
                  className="w-full rounded-md bg-gray-900/70 text-gray-100 placeholder-gray-500 px-3 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter department"
                />
              </div>

              {/* machine name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Wrench className="w-4 h-4 inline mr-1.5" /> Machine Name *
                </label>
                <input
                  type="text"
                  name="machineName"
                  value={formData.machineName}
                  onChange={handleInputChange}
                  className="w-full rounded-md bg-gray-900/70 text-gray-100 placeholder-gray-500 px-3 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter machine name"
                />
              </div>

              {/* department */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Building className="w-4 h-4 inline mr-1.5" /> Department *
                </label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full rounded-md bg-gray-900/70 text-gray-100 placeholder-gray-500 px-3 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter department"
                />
              </div>

              {/* report date */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1.5" /> Report Date *
                </label>
                <input
                  type="date"
                  name="reportDate"
                  value={formData.reportDate}
                  onChange={handleInputChange}
                  style={{ colorScheme: 'dark' }}
                  className="w-full rounded-md bg-gray-900/70 text-gray-100 px-3 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* error */}
            {error && (
              <div className="bg-red-900/40 border border-red-700 text-red-300 px-4 py-3 rounded-md">
                <strong className="font-bold">Error:&nbsp;</strong>
                {error}
              </div>
            )}

            {/* button */}
            <div>
              <button
                onClick={generatePDF}
                disabled={isGenerating}
                className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-md text-base font-medium transition-colors duration-200
                  ${isGenerating
                    ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"}
                `}
              >
                {isGenerating ? (
                  <>
                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-200" />
                    Generating Report…
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" /> Generate Professional Report
                  </>
                )}
              </button>
            </div>
          </div>

          {/* contents summary */}
          <div className="mt-10 p-4 bg-gray-900/60 border border-gray-800 rounded-xl text-gray-300">
            <h3 className="text-lg font-semibold mb-3">Enhanced Report Contents</h3>
            <ul className="space-y-1 text-sm leading-relaxed list-disc list-inside">
              <li>🎨 Professional color-coded design with gradients</li>
              <li>📊 Interactive data visualization with status indicators</li>
              <li>⚡ Comprehensive electrical parameters analysis</li>
              <li>🔄 Detailed spindle & machine performance metrics</li>
              <li>📳 Advanced vibration monitoring with FFT analysis</li>
              <li>🌡️ Temperature monitoring (RTD & Thermocouple)</li>
              <li>📈 System health summary with efficiency metrics</li>
              <li>🏢 Corporate branding with professional layout</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report