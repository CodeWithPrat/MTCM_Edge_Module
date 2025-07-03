import { useState } from "react";

export default function App() {
  // simple piece of state just to prove everything’s working
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 mb-8">
        React + Tailwind Starter
      </h1>

      {/* Counter card */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8 flex flex-col items-center gap-6 w-72">
        <p className="text-lg font-medium text-gray-700 dark:text-gray-200">
          Current count:
        </p>

        <span className="text-5xl font-bold text-blue-600 dark:text-blue-400">
          {count}
        </span>

        <button
          onClick={() => setCount((c) => c + 1)}
          className="px-6 py-3 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 transform-gpu transition duration-150 ease-out"
        >
          Increment
        </button>
      </div>

      {/* Footer */}
      <footer className="mt-12 text-sm text-gray-500 dark:text-gray-400">
        Built with&nbsp;
        <a
          href="https://react.dev"
          className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
        >
          React
        </a>{" "}
        &amp;&nbsp;
        <a
          href="https://tailwindcss.com"
          className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
        >
          Tailwind CSS
        </a>
      </footer>
    </div>
  );
}
