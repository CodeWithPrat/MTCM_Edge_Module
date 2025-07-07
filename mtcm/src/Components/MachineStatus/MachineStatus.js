import React, { useState, useEffect, useRef } from "react";
import { Zap, Power, Gauge, Activity, Wifi, WifiOff, ChevronDown, ChevronUp } from "lucide-react";
import GaugeComponent from "react-gauge-component";
import { debounce } from "lodash";

// Enhanced global error handler for ResizeObserver
if (typeof window !== "undefined") {
  // Handle ResizeObserver errors globally
  const originalError = window.addEventListener;
  window.addEventListener = function(type, listener, options) {
    if (type === 'error') {
      const wrappedListener = function(event) {
        if (event.message && event.message.includes('ResizeObserver loop')) {
          event.preventDefault();
          event.stopPropagation();
          return false;
        }
        if (typeof listener === 'function') {
          return listener(event);
        }
      };
      return originalError.call(this, type, wrappedListener, options);
    }
    return originalError.call(this, type, listener, options);
  };

  // Catch unhandled ResizeObserver errors
  window.addEventListener('error', (e) => {
    if (e.message && (e.message.includes('ResizeObserver') || e.message.includes('loop completed'))) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  });

  // Also handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (e) => {
    if (e.reason && e.reason.message && e.reason.message.includes('ResizeObserver')) {
      e.preventDefault();
      return false;
    }
  });
}

const setupResizeObserverSafe = () => {
  if (typeof window === "undefined") return;

  const originalResizeObserver = window.ResizeObserver;
  
  window.ResizeObserver = class SafeResizeObserver extends originalResizeObserver {
    constructor(callback) {
      super((entries, observer) => {
        requestAnimationFrame(() => {
          try {
            callback(entries, observer);
          } catch (e) {
            if (!e.message.includes('ResizeObserver')) {
              console.error(e);
            }
          }
        });
      });
    }
  };
};
setupResizeObserverSafe();

// Optimized DebouncedGauge component with enhanced error handling
const StableGauge = ({ value, ...props }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const gaugeRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const updateValue = () => {
      setDisplayValue(value);
    };

    // Double buffering with requestAnimationFrame
    animationRef.current = requestAnimationFrame(() => {
      debounce(updateValue, 150)();
    });

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value]);

  return (
    <div 
      ref={gaugeRef}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        contain: "layout paint style", // Softer containment
        transform: "translateZ(0)",
      }}
    >
      <GaugeComponent
        value={displayValue}
        {...props}
        style={{
          width: "100%",
          height: "100%",
          contain: "content",
        }}
      />
    </div>
  );
};
const MachineMSTab = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("connected");
  const [lastUpdate, setLastUpdate] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);
  const [showPhaseCurrents, setShowPhaseCurrents] = useState(false);
  const unmountedRef = useRef(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://mtcm-edge.online/Backend/mtcmedge.php");
      const data = await response.json();

      if (!unmountedRef.current) {
        if (data.success) {
          setData(data.data);
          setLastUpdate(new Date());
          setConnectionStatus("connected");
        } else {
          throw new Error("API response unsuccessful");
        }
      }
    } catch (err) {
      if (!unmountedRef.current) {
        console.error("Error fetching data:", err);
        setError(err.message);
        setConnectionStatus("disconnected");
      }
    } finally {
      if (!unmountedRef.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    unmountedRef.current = false;
    fetchData();
    const interval = setInterval(fetchData, 3000);
    
    return () => {
      unmountedRef.current = true;
      clearInterval(interval);
    };
  }, []);

  const getValue = (field) => {
    if (!data || data[field] === null || data[field] === undefined) return 0;
    return parseFloat(data[field]) || 0;
  };

  const handleBackgroundClick = (e) => {
    if (e.target.classList.contains("dashboard-background")) {
      setShowPhaseCurrents(false);
    }
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-green-500/30 rounded-full animate-spin border-t-green-500 mx-auto mb-4"></div>
          </div>
          <div className="text-white text-xl font-semibold animate-pulse">
            Initializing Energy Monitoring System...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-gradient-to-br from-black via-gray-900 to-black text-white dashboard-background"
      onClick={handleBackgroundClick}
      style={{ willChange: "contents" }}
    >
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -right-40 w-80 h-80 bg-green-500/10 rounded-full blur-3xl animate-pulse"
          style={{
            willChange: "transform, opacity",
            transformStyle: "preserve-3d",
          }}
        ></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl animate-pulse animation-delay-1000"
          style={{
            willChange: "transform, opacity",
            transformStyle: "preserve-3d",
          }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/5 rounded-full blur-3xl animate-pulse animation-delay-2000"
          style={{
            willChange: "transform, opacity",
            transformStyle: "preserve-3d",
          }}
        ></div>
      </div>

      <div className="relative z-10 p-4 md:p-6 mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="">
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-200 via-gray-400 to-gray-600 mb-2">
                Machine
              </h1>
              <p className="mt-2 text-gray-300 text-sm sm:text-base md:text-lg font-medium leading-snug">
                Real-time Monitoring
              </p>
            </div>
          </div>
        </div>

        {/* System Intelligence Section */}
        <div className="mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mr-16">
            {/* Energy Consumption (kWh) */}
            <div className="text-center group">
              <div className="relative inline-block mb-4">
                <StableGauge
                  value={getValue("Em2_Energy") / 1000}
                  type="radial"
                  minValue={0}
                  maxValue={getValue("Em2_Energy") / 1000 + 1000}
                  labels={{
                    tickLabels: {
                      type: "inner",
                      ticks: [
                        { value: (getValue("Em2_Energy") / 1000 + 1000) * 0.25 },
                        { value: (getValue("Em2_Energy") / 1000 + 1000) * 0.5 },
                        { value: (getValue("Em2_Energy") / 1000 + 1000) * 0.75 },
                        { value: getValue("Em2_Energy") / 1000 + 1000 },
                      ],
                    },
                    valueLabel: {
                      formatTextValue: (value) => value.toFixed(1) + " kWh",
                      style: {
                        fontSize: "25px",
                        fill: "#22c55e",
                        fontWeight: "bold",
                      },
                    },
                  }}
                  arc={{
                    colorArray: ["#22c55e", "#eab308", "#ef4444"],
                    subArcs: [
                      { limit: (getValue("Em2_Energy") / 1000 + 1000) * 0.4 },
                      { limit: (getValue("Em2_Energy") / 1000 + 1000) * 0.8 },
                      {},
                    ],
                    padding: 0.02,
                    width: 0.25,
                  }}
                  pointer={{
                    elastic: true,
                    animationDelay: 0,
                    color: "#22c55e",
                  }}
                />
                <div className="absolute inset-0 bg-green-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <h3 className="font-semibold text-green-400">
                Energy Consumption (kWh)
              </h3>
              <p className="text-gray-400 text-sm mt-1">
                {(getValue("Em2_Energy") / 1000).toFixed(1)} kWh
              </p>
            </div>

            {/* Power (kW) */}
            <div className="text-center group">
              <div className="relative inline-block mb-4">
                <StableGauge
                  value={getValue("Em2_power") / 1000}
                  type="radial"
                  minValue={0}
                  maxValue={getValue("Em2_power") / 1000 + 1000}
                  labels={{
                    tickLabels: {
                      type: "inner",
                      ticks: [
                        { value: (getValue("Em2_power") / 1000 + 1000) * 0.25 },
                        { value: (getValue("Em2_power") / 1000 + 1000) * 0.5 },
                        { value: (getValue("Em2_power") / 1000 + 1000) * 0.75 },
                        { value: getValue("Em2_power") / 1000 + 1000 },
                      ],
                    },
                    valueLabel: {
                      formatTextValue: (value) => value.toFixed(1) + " kW",
                      style: {
                        fontSize: "25px",
                        fill: "#14b8a6",
                        fontWeight: "bold",
                      },
                    },
                  }}
                  arc={{
                    colorArray: ["#22c55e", "#eab308", "#ef4444"],
                    subArcs: [
                      { limit: (getValue("Em2_power") / 1000 + 1000) * 0.4 },
                      { limit: (getValue("Em2_power") / 1000 + 1000) * 0.8 },
                      {},
                    ],
                    padding: 0.02,
                    width: 0.25,
                  }}
                  pointer={{
                    elastic: true,
                    animationDelay: 100,
                    color: "#14b8a6",
                  }}
                />
                <div className="absolute inset-0 bg-teal-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <h3 className="font-semibold text-teal-400"> Power (kW)</h3>
              <p className="text-gray-400 text-sm mt-1">
                {(getValue("Em2_power") / 1000).toFixed(1)} kW
              </p>
            </div>

            {/* Voltage (L-L) */}
            <div className="text-center group">
              <div className="relative inline-block mb-4">
                <StableGauge
                  value={getValue("Em2_voltage")}
                  type="radial"
                  minValue={0}
                  maxValue={470}
                  labels={{
                    tickLabels: {
                      type: "inner",
                      ticks: [
                        { value: 117.5 },
                        { value: 235 },
                        { value: 352.5 },
                        { value: 470 },
                      ],
                    },
                    valueLabel: {
                      formatTextValue: (value) => value.toFixed(2) + " V",
                      style: {
                        fontSize: "25px",
                        fill: "#8b5cf6",
                        fontWeight: "bold",
                      },
                    },
                  }}
                  arc={{
                    colorArray: ["#22c55e", "#eab308", "#ef4444"],
                    subArcs: [{ limit: 188 }, { limit: 376 }, {}],
                    padding: 0.02,
                    width: 0.25,
                  }}
                  pointer={{
                    elastic: true,
                    animationDelay: 200,
                    color: "#8b5cf6",
                  }}
                />
                <div className="absolute inset-0 bg-purple-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <h3 className="font-semibold text-purple-400">Voltage (L-L)</h3>
              <p className="text-gray-400 text-sm mt-1">
                {getValue("Em2_voltage").toFixed(3)} V
              </p>
            </div>

            {/* Current (Avg) */}
            <div className="text-center group">
              <div className="relative inline-block mb-4">
                <StableGauge
                  value={getValue("Em2_current")}
                  type="radial"
                  minValue={0}
                  maxValue={10}
                  labels={{
                    tickLabels: {
                      type: "inner",
                      ticks: [
                        { value: 2.5 },
                        { value: 5 },
                        { value: 7.5 },
                        { value: 10 },
                      ],
                    },
                    valueLabel: {
                      formatTextValue: (value) => value.toFixed(1) + "A",
                      style: {
                        fontSize: "25px",
                        fill: "#f59e0b",
                        fontWeight: "bold",
                      },
                    },
                  }}
                  arc={{
                    colorArray: ["#22c55e", "#eab308", "#ef4444"],
                    subArcs: [{ limit: 4 }, { limit: 8 }, {}],
                    padding: 0.02,
                    width: 0.25,
                  }}
                  pointer={{
                    elastic: true,
                    animationDelay: 300,
                    color: "#f59e0b",
                  }}
                />
                <div className="absolute inset-0 bg-yellow-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <h3 className="font-semibold text-yellow-400">Current (Avg)</h3>
              <p className="text-gray-400 text-sm mt-1">
                {getValue("Em2_current").toFixed(1)} A
              </p>
            </div>

            {/* Power Factor (Avg) */}
            <div className="text-center group">
              <div className="relative inline-block mb-4">
                <StableGauge
                  value={getValue("Em2_PF")}
                  type="radial"
                  minValue={0}
                  maxValue={1}
                  labels={{
                    tickLabels: {
                      type: "inner",
                      ticks: [
                        { value: 0.25 },
                        { value: 0.5 },
                        { value: 0.75 },
                        { value: 1.0 },
                      ],
                    },
                    valueLabel: {
                      formatTextValue: (value) => value.toFixed(1),
                      style: {
                        fontSize: "25px",
                        fill: "#f59e0b",
                        fontWeight: "bold",
                      },
                    },
                  }}
                  arc={{
                    colorArray: ["#22c55e", "#eab308", "#ef4444"],
                    subArcs: [{ limit: 0.4 }, { limit: 0.8 }, {}],
                    padding: 0.02,
                    width: 0.25,
                  }}
                  pointer={{
                    elastic: true,
                    animationDelay: 300,
                    color: "#f59e0b",
                  }}
                />
                <div className="absolute inset-0 bg-yellow-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <h3 className="font-semibold text-yellow-400">
                Power Factor (Avg)
              </h3>
              <p className="text-gray-400 text-sm mt-1">
                {getValue("Em2_PF").toFixed(1)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MachineMSTab;