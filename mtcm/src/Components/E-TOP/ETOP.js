import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";

/* --------------------------------------------------------- */
/*  Small, memoised building blocks                          */
/* --------------------------------------------------------- */

const StatusIndicator = React.memo(({ status, label }) => (
  <div className="flex items-center justify-between p-4 bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 group">
    <span className="text-gray-200 font-medium group-hover:text-white transition-colors duration-300">
      {label}
    </span>

    <div className="flex items-center space-x-3">
      <div
        className={`w-4 h-4 rounded-full ${
          status === "1" ? "bg-green-500" : "bg-red-500"
        } shadow-lg ${
          status === "1" ? "shadow-green-500/50" : "shadow-red-500/50"
        } animate-pulse`}
      />
      <span
        className={`text-sm font-bold ${
          status === "1" ? "text-green-400" : "text-red-400"
        }`}
      >
        {status === "1" ? "ON" : "OFF"}
      </span>
    </div>
  </div>
));

const TableSection = React.memo(({ title, items, icon }) => (
  <div className="bg-black backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-500 group">
    <div className="flex items-center space-x-3 mb-6">
      <div className="p-2 bg-gradient-to-r from-brand-purple to-brand-sky rounded-lg">
        {icon}
      </div>
      <h2 className="text-2xl font-bold text-white group-hover:text-brand-sky transition-colors duration-300">
        {title}
      </h2>
    </div>

    <div className="space-y-3">
      {items.map(({ label, status }) => (
        <StatusIndicator key={label} status={status} label={label} />
      ))}
    </div>
  </div>
));

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-full">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-brand-purple border-t-transparent rounded-full animate-spin" />
      <div className="absolute inset-0 w-16 h-16 border-4 border-brand-sky border-b-transparent rounded-full animate-spin animate-reverse" />
    </div>
  </div>
);

/* --------------------------------------------------------- */
/*  Main component                                           */
/* --------------------------------------------------------- */

const ETOP = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  // Keep a reference so we can abort an in‑flight request on unmount/re-render
  const abortRef = useRef(null);

  /** Fetch wrapper – memoised so the interval doesn’t re‑create it */
  const fetchData = useCallback(async () => {
    try {
      // Abort the previous fetch (if any) before starting a new one
      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      const res = await fetch(
        "https://mtcm-edge.online/Backend/mtcmedge.php",
        { signal: controller.signal }
      );

      if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`);
      }

      const json = await res.json();
      if (!json?.success) {
        throw new Error("API returned unsuccessful response");
      }

      setData(json.data);
      setLastUpdate(new Date().toLocaleTimeString());
      setError(null);
    } catch (err) {
      // Ignore aborts – they’re expected during cleanup
      if (err.name !== "AbortError") setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  /* Kick off the first fetch and refresh every 2 s */
  useEffect(() => {
    fetchData(); // first call
    const id = setInterval(fetchData, 2000);
    return () => {
      clearInterval(id);
      if (abortRef.current) abortRef.current.abort();
    };
  }, [fetchData]);

  /* Build IO arrays only when data changes */
  const digitalInputs = useMemo(
    () => [
      { label: "Input 1", status: data?.e_din1 ?? "0" },
      { label: "Input 2", status: data?.e_din2 ?? "0" },
      { label: "Input 3", status: data?.e_din3 ?? "0" },
      { label: "Input 4", status: data?.e_din4 ?? "0" },
      { label: "Input 5", status: data?.e_din5 ?? "0" },
      { label: "Input 6", status: data?.e_din6 ?? "0" },
      { label: "Input 7", status: data?.e_din7 ?? "0" },
    ],
    [data]
  );

  const digitalOutputs = useMemo(
    () => [
      { label: "Output 1", status: data?.e_do1 ?? "0" },
      { label: "Output 2", status: data?.e_do2 ?? "0" },
      { label: "Output 3", status: data?.e_do3 ?? "0" },
      { label: "Output 4", status: data?.e_do4 ?? "0" },
      { label: "Output 5", status: data?.e_do5 ?? "0" },
      { label: "Output 6", status: data?.e_do6 ?? "0" },
      { label: "Output 7", status: data?.e_do7 ?? "0" },
    ],
    [data]
  );

  /* ------------------------------------------------------- */
  /*  Render branches                                        */
  /* ------------------------------------------------------- */

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 animate-gradient-xy" />
        <div className="relative z-10">
          <LoadingSpinner />
          <p className="text-white text-xl mt-4 text-center">
            Loading DIO Dashboard…
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 animate-gradient-xy" />
        <div className="relative z-10 text-center">
          <div className="p-6 bg-red-900/50 backdrop-blur-lg rounded-xl border border-red-700/50">
            <h2 className="text-2xl font-bold text-red-400 mb-2">
              Connection Error
            </h2>
            <p className="text-red-300 mb-4">{error}</p>
            <button
              onClick={() => {
                setLoading(true); // show spinner again
                fetchData();
              }}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-300"
            >
              Retry Connection
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------- */
  /*  Happy path                                             */
  /* ------------------------------------------------------- */

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 animate-gradient-xy" />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-brand-sky rounded-full opacity-30 animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Main UI */}
      <div className="relative z-10 min-h-screen p-4 lg:p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-200 via-gray-400 to-gray-600 mb-4">
            E‑TOP Digital I/O Control Panel
          </h1>

          <div className="flex items-center justify-center space-x-4 text-gray-400">
            <span>Last Updated: {lastUpdate}</span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>Live</span>
          </div>
        </div>

        {/* Dashboard grid */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-2 gap-8">
          <TableSection
            title="Digital Inputs"
            items={digitalInputs}
            icon={
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16l-4-4m0 0l4-4m-4 4h18"
                />
              </svg>
            }
          />

          <TableSection
            title="Digital Outputs"
            items={digitalOutputs}
            icon={
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            }
          />
        </div>

        {/* Status bar */}
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-gray-900/80 backdrop-blur-lg rounded-full px-6 py-3 border border-gray-700/50">
          <div className="flex items-center space-x-4 text-sm text-gray-300">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Connected</span>
            </div>
            <div className="w-px h-4 bg-gray-600" />
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span>Auto‑Refresh: 2 s</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ETOP;
