import React, { useState, useEffect, useRef } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Zap, Activity, Gauge, TrendingUp } from "lucide-react";

const API_URL = "https://cmti-edge.online/mtcm/Backend/mtcmedge.php";
const REFRESH_MS = 5000;

const Sensors = () => {
  const [sensorData, setSensorData] = useState(null);
  const [error, setError] = useState(null);
  const timerRef = useRef(null);
  
  const fetchSensors = async () => {
    try {
      const res = await fetch(API_URL, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json?.success) throw new Error("API responded with success:false");
      setSensorData(json.data);
      setError(null);
    } catch (e) {
      setError(e.message);
    }
  };
  
  useEffect(() => {
    fetchSensors();
    timerRef.current = setInterval(fetchSensors, REFRESH_MS);
    return () => clearInterval(timerRef.current);
  }, []);

 
  const voltages = sensorData
    ? [
        { id: 1, value: sensorData.vin1, label: "VIN1" },
        { id: 2, value: sensorData.vin2, label: "VIN2" },
        { id: 3, value: sensorData.vin3, label: "VIN3" },
        { id: 4, value: sensorData.vin4, label: "VIN4" },
      ]
    : [];

  const currents = sensorData
    ? [
        { id: 1, value: sensorData.Iin1, label: "IIN1" },
        { id: 2, value: sensorData.Iin2, label: "IIN2" },
        { id: 3, value: sensorData.Iin3, label: "IIN3" },
        { id: 4, value: sensorData.Iin4, label: "IIN4" },
      ]
    : [];

  const SensorCard = ({ sensor, unit, icon: Icon, gradient }) => {
    const value = parseFloat(sensor.value);
    const isActive = value !== 0;
    return (
      <div className={`relative group transform transition-all duration-500 hover:scale-105 ${isActive ? "" : ""}`}>
        <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-20 rounded-2xl blur-xl transition-all duration-500 group-hover:opacity-40`} />
        <div className="relative bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 h-full transition-all duration-500 group-hover:border-gray-600/70">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl bg-gradient-to-r ${gradient} ${isActive ? "" : ""}`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div className={`w-3 h-3 rounded-full ${isActive ? "bg-green-400" : "bg-gray-600"}`} />
          </div>

          <div className="space-y-2">
            <p className="text-gray-400 text-sm font-medium">{sensor.label}</p>
            <div className="flex items-baseline space-x-2">
              <span className={`text-3xl font-bold ${isActive ? "text-white" : "text-gray-500"} transition-colors duration-300`}>
                {Number.isFinite(value) ? value.toFixed(2) : "--"}
              </span>
              <span className="text-gray-400 text-sm">{unit}</span>
            </div>
          </div>

          <div className="mt-4 flex items-center space-x-2">
            <TrendingUp className={`w-4 h-4 ${isActive ? "text-green-400" : "text-gray-600"}`} />
            <span className={`text-xs ${isActive ? "text-green-400" : "text-gray-600"}`}>{isActive ? "Active" : "Inactive"}</span>
          </div>
        </div>
      </div>
    );
  };
  
  if (!sensorData && !error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-64 h-64 mx-auto mb-8">
            <DotLottieReact
              src="https://lottie.host/fab73294-e412-49c5-9866-ff78d7ad63cf/W3ciEX0iXL.lottie"
              loop
              autoplay
            />
          </div>
          <div className="text-white text-xl font-garamond animate-pulse">Loading Sensors…</div>
        </div>
      </div>
    );
  }

  if (error) {
    // fallback for network/API issues
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-red-400">
        <p className="text-lg font-medium">Error: {error}</p>
      </div>
    );
  }

  /* main dashboard (unchanged except it now uses live data) */
  return (
    <div className="min-h-screen bg-black relative overflow-hidden lg:left-28">
      {/* background + particles omitted for brevity – keep your original JSX */}

      <div className="relative z-10 p-4 md:p-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-200 via-gray-400 to-gray-600 mb-4">
            Sensors
          </h1>
          <p className="text-gray-400 text-xl font-tinos">Real‑time monitoring system</p>
        </div>

        {/* Voltage */}
        <section className="mb-16">
          <div className="flex items-center justify-center mb-8">
            <Zap className="w-8 h-8 text-brand-sky mr-4" />
            <h2 className="text-3xl md:text-4xl font-garamond text-white">Voltage Sensors</h2>
            <span className="ml-4 text-gray-400 text-lg">(V)</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {voltages.map((v) => (
              <SensorCard key={v.id} sensor={v} unit="V" icon={Zap} gradient="from-brand-sky to-brand-purple" />
            ))}
          </div>
        </section>

        {/* Current */}
        <section className="mb-16">
          <div className="flex items-center justify-center mb-8">
            <Gauge className="w-8 h-8 text-brand-violet mr-4" />
            <h2 className="text-3xl md:text-4xl font-garamond text-white">Current Sensors</h2>
            <span className="ml-4 text-gray-400 text-lg">(mA)</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {currents.map((c) => (
              <SensorCard key={c.id} sensor={c} unit="mA" icon={Gauge} gradient="from-brand-violet to-brand-navy" />
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm border-t border-gray-700/50 p-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-ping" />
              <span className="text-gray-400 text-sm">
                Last updated:&nbsp;
                {new Date(sensorData.created_at || Date.now()).toLocaleTimeString()}
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <div className="text-center">
                <div className="text-white font-bold">4</div>
                <div className="text-gray-400 text-xs">Voltage</div>
              </div>
              <div className="text-center">
                <div className="text-white font-bold">4</div>
                <div className="text-gray-400 text-xs">Current</div>
              </div>
              <div className="text-center">
                <div className="text-green-400 font-bold">
                  {currents.filter((c) => parseFloat(c.value) !== 0).length}
                </div>
                <div className="text-gray-400 text-xs">Active</div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Sensors;
