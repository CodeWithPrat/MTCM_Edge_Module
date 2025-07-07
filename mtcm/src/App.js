import React, { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { ChevronLeft, ChevronRight, Menu, X, Thermometer, Zap, Activity, Cpu, BarChart3, Settings, Home, Radio, Cable, Shield, Wifi, Circle } from "lucide-react"

import Tabs from "./Components/Temperature/Tabs";
import MSTab from "./Components/MachineStatus/MSTabs";
import Vibration from "./Components/Vibration/Vibration";
import DIO from "./Components/Digital/DIO";
import ETOP from "./Components/E-TOP/ETOP";
import OEECalculator from "./Components/OEE/OEE";

import CMTILogo from "./Images/logos/CMTILogo.png"
import MHILogo from "./Images/logos/MHI3.png"

import product1 from "./Images/product/product1.PNG"
import product2 from "./Images/product/product2.PNG"
import product3 from "./Images/product/product3.PNG"
import product4 from "./Images/product/product4.PNG"
import product5 from "./Images/product/product5.PNG"
import product6 from "./Images/product/product6.PNG"



// iOS-style Global Styles
const iOSStyles = `
  * {
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    box-sizing: border-box;
  }

  html {
    font-size: 15px;
    -webkit-text-size-adjust: 100%;
  }

  body {
    cursor: default;
    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
    margin: 0;
    padding: 0;
    overflow-x: hidden;
  }

  button, a, [role="button"] {
    cursor: pointer;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    outline: none;
    border: none;
    background: none;
    text-decoration: none;
  }

  button:focus, a:focus {
    outline: none;
  }

  button:active, a:active {
    transform: scale(0.95);
    transition: transform 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  .ios-button {
    position: relative;
    overflow: hidden;
    transform: translateZ(0);
    backface-visibility: hidden;
    will-change: transform;
  }

  .ios-button:before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: width 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), height 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  .ios-button:hover:before {
    width: 100%;
    height: 100%;
  }

  .glass-effect {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .ios-shadow {
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  }

  /* Enhanced Custom Scrollbar */
  ::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  ::-webkit-scrollbar-corner {
    background: transparent;
  }

  /* Responsive Design */
  @media (max-width: 1023px) {
    .navigation-sidebar {
      width: 320px !important;
    }
  }

  @media (max-width: 375px) {
    .navigation-sidebar {
      width: 280px !important;
    }
    
    html {
      font-size: 14px;
    }
  }

  @media (max-width: 320px) {
    .navigation-sidebar {
      width: 260px !important;
    }
  }

  /* Safe area support for iOS devices */
  @supports (padding: max(0px)) {
    .navigation-sidebar {
      padding-left: max(16px, env(safe-area-inset-left));
      padding-right: max(16px, env(safe-area-inset-right));
    }
    
    .menu-button {
      top: max(16px, env(safe-area-inset-top));
      left: max(16px, env(safe-area-inset-left));
    }
  }

  /* Prevent text selection and context menus on mobile */
  @media (hover: none) and (pointer: coarse) {
    * {
      -webkit-user-select: none;
      -webkit-touch-callout: none;
      -webkit-tap-highlight-color: transparent;
    }
  }

  /* High DPI display optimizations */
  @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 2dppx) {
    .ios-shadow {
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
    }
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`;

// Enhanced Error Boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Don't treat ResizeObserver errors as component errors
    if (error.message?.includes('ResizeObserver')) {
      return { hasError: false };
    }
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Only log non-ResizeObserver errors
    if (!error.message?.includes('ResizeObserver')) {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-screen bg-red-900/20 text-white p-8">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Something went wrong</h2>
            <p className="text-white/70">Please refresh the page or try again later.</p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Enhanced Animated Background
const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <style>{iOSStyles}</style>

      {/* Dynamic Gradient Mesh */}
      <div className="absolute inset-0 opacity-20">
        <motion.div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.2) 0%, transparent 60%),
              radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.2) 0%, transparent 60%),
              radial-gradient(circle at 40% 60%, rgba(16, 185, 129, 0.15) 0%, transparent 60%),
              radial-gradient(circle at 60% 40%, rgba(236, 72, 153, 0.1) 0%, transparent 60%)
            `,
            willChange: 'transform, opacity'  
          }}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 10, 0],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Floating Orbs */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-xl"
          style={{
            width: `${Math.random() * 200 + 100}px`,
            height: `${Math.random() * 200 + 100}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            willChange: 'transform, opacity'
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, 50, 0],
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: Math.random() * 10 + 8,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Subtle Grid */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />
      </div>
    </div>
  )
}

// Enhanced Navigation Component with iOS Design
const Navigation = ({ isOpen, setIsOpen }) => {
  const location = useLocation()
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024)
  const [activeSection, setActiveSection] = useState("")

  const navItems = [
    { name: "Dashboard", path: "/", icon: Home, color: "from-blue-500 to-blue-600" },
    { name: "Temperature", path: "/temperature", icon: Thermometer, color: "from-red-500 to-red-600" },
    { name: "Energy", path: "/energy", icon: Zap, color: "from-yellow-500 to-yellow-600" },
    { name: "Vibration", path: "/vibration", icon: Activity, color: "from-green-500 to-green-600" },
    { name: "Digital I/O", path: "/digital-io", icon: Cable, color: "from-purple-500 to-purple-600" },
    { name: "ETOP I/O", path: "/etop-io", icon: Settings, color: "from-indigo-500 to-indigo-600" },
    { name: "Sensors", path: "/sensors", icon: Radio, color: "from-pink-500 to-pink-600" },
    { name: "Analytics", path: "/oee", icon: BarChart3, color: "from-cyan-500 to-cyan-600" },
    { name: "Reports", path: "/reports", icon: Cpu, color: "from-orange-500 to-orange-600" },
  ]

  // Debounce function implementation
function debounce(func, wait, immediate = false) {
  let timeout;
  
  const debounced = function() {
    const context = this;
    const args = arguments;
    
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    
    const callNow = immediate && !timeout;
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func.apply(context, args);
  };
  
  debounced.cancel = function() {
    clearTimeout(timeout);
    timeout = null;
  };
  
  return debounced;
}

  useEffect(() => {
    const handleResize = debounce(() => {  // Using debounce here
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setIsOpen(false);
      }
    }, 100);  // 100ms debounce delay

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      handleResize.cancel();  // Cancel any pending executions
    };
  }, [setIsOpen]);

  // Close menu when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobile && isOpen && !event.target.closest('.navigation-sidebar') && !event.target.closest('.menu-button')) {
        setIsOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [isMobile, isOpen, setIsOpen])

  const sidebarVariants = {
    hidden: {
      x: isMobile ? -320 : 0,
      opacity: isMobile ? 0 : 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
        duration: 0.3
      }
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
        duration: 0.3
      }
    }
  }

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        className="menu-button lg:hidden fixed top-4 left-4 z-50 w-11 h-11 flex items-center justify-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          WebkitTapHighlightColor: 'transparent',
          WebkitUserSelect: 'none',
          userSelect: 'none'
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isOpen ? 'close' : 'open'}
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            {isOpen ? (
              <X size={20} className="text-white" />
            ) : (
              <Menu size={20} className="text-white" />
            )}
          </motion.div>
        </AnimatePresence>
      </motion.button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.2 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Navigation Sidebar */}
      <AnimatePresence>
        {(!isMobile || isOpen) && (
          <motion.nav
            className={`navigation-sidebar fixed left-0 top-0 h-full z-50 ${isMobile ? 'w-80' : 'w-72'
              } bg-white/5 backdrop-blur-xl border-r border-white/10 shadow-2xl`}
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10">
              <motion.div
                className="flex items-center space-x-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Cpu size={24} className="text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm">
                    <div className="w-2 h-2 bg-white rounded-full mt-0.5 ml-0.5"></div>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-bold text-white truncate">MTCM Edge</h2>
                  <p className="text-sm text-white/60">Central Manufacturing Technology Institute</p>
                </div>
              </motion.div>
            </div>

            {/* Status Indicators */}
            <div className="px-6 py-4 border-b border-white/10">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-white/80 font-medium">System Online</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Wifi size={16} className="text-blue-400" />
                  <span className="text-white/60">Connected</span>
                </div>
              </div>
            </div>

            {/* Navigation Items */}
            <div className="flex-1 overflow-y-auto px-4 py-4" style={{ height: 'calc(100vh - 200px)' }}>
              <div className="space-y-2">
                {navItems.map((item, index) => {
                  const Icon = item.icon
                  const isActive = location.pathname === item.path

                  return (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index + 0.2, duration: 0.4 }}
                    >
                      <Link
                        to={item.path}
                        className={`flex items-center space-x-4 p-4 rounded-2xl transition-all duration-300 group relative overflow-hidden ${isActive
                            ? "bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg"
                            : "hover:bg-white/5 active:bg-white/10"
                          }`}
                        onClick={() => isMobile && setIsOpen(false)}
                        style={{
                          WebkitTapHighlightColor: 'transparent',
                          WebkitUserSelect: 'none',
                          userSelect: 'none'
                        }}
                      >
                        {/* Ripple effect */}
                        <div className="absolute inset-0 rounded-2xl overflow-hidden">
                          <div className="absolute inset-0 transform scale-0 group-active:scale-100 bg-white/10 rounded-2xl transition-transform duration-200"></div>
                        </div>

                        <div className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${isActive
                            ? `bg-gradient-to-br ${item.color} shadow-lg`
                            : "bg-white/10 group-hover:bg-white/20"
                          }`}>
                          <Icon size={20} className={`transition-colors duration-200 ${isActive ? "text-white" : "text-white/60 group-hover:text-white"
                            }`} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <span className={`font-medium transition-colors duration-200 ${isActive ? "text-white" : "text-white/80 group-hover:text-white"
                            }`}>
                            {item.name}
                          </span>
                        </div>

                        {isActive && (
                          <motion.div
                            className="w-2 h-2 bg-white rounded-full shadow-sm"
                            layoutId="activeIndicator"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        )}

                        {isMobile && (
                          <ChevronRight size={16} className="text-white/40 group-hover:text-white/60 transition-colors" />
                        )}
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/10">
              <div className="text-center text-white/40 text-sm">
                <p className="font-medium">© 2024 CMTI</p>
                <p className="text-xs">Edge Computing Solutions</p>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  )
}


// Enhanced Product Carousel with iOS Design
const ProductCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const productImages = [
    product1, product2, product3, product4, product5, product6
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % productImages.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [productImages.length])

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % productImages.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + productImages.length) % productImages.length)
  }

  return (
    <div className="relative w-full h-96 lg:h-[500px] rounded-3xl overflow-hidden group ios-shadow">
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={productImages[currentIndex]}
          alt={`MTCM Edge Module ${currentIndex + 1}`}
          className="w-full h-full object-cover"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
      </AnimatePresence>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      {/* Navigation Controls */}
      <motion.button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 glass-effect rounded-full text-white opacity-0 group-hover:opacity-100 transition-all duration-300 ios-button"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <ChevronLeft size={20} />
      </motion.button>

      <motion.button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 glass-effect rounded-full text-white opacity-0 group-hover:opacity-100 transition-all duration-300 ios-button"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <ChevronRight size={20} />
      </motion.button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
        {productImages.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex ? "bg-white w-6" : "bg-white/40"
              }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.8 }}
          />
        ))}
      </div>
    </div>
  )
}

// Enhanced Hero Section with iOS Design
const HeroSection = () => {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 lg:px-8">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Left Side - Content */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-8 lg:space-y-12"
        >
          {/* Title Section */}
          <div className="space-y-6">
            <motion.h1
              className="text-4xl md:text-5xl lg:text-7xl font-bold text-white leading-tight"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
                MTCM
              </span>
              <br />
              <span className="text-white/90">Edge Module</span>
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl lg:text-2xl text-white/70 leading-relaxed max-w-2xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Next-generation Machine Tool Condition Monitoring with
              <br />
              <span className="text-blue-400 font-semibold">AI-powered Industrial Analytics</span>
            </motion.p>
          </div>

          {/* Enhanced Product Description */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {/* Overview Card */}
            <div className="glass-effect rounded-3xl p-6 lg:p-8 border border-white/10 ios-shadow">
              <h3 className="text-lg lg:text-xl font-semibold text-white mb-4 flex items-center">
                <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mr-3"></div>
                Industrial Edge Computing Platform
              </h3>
              <p className="text-white/80 leading-relaxed">
                CMTI's <span className="text-blue-400 font-semibold">MTCM EDGE MODULE</span> delivers enterprise-grade
                edge computing with adaptive I/O capabilities, powered by open-source hardware innovation.
              </p>
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="glass-effect rounded-2xl p-6 border border-blue-500/20 ios-shadow">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-3">
                    <Cpu size={16} className="text-white" />
                  </div>
                  <h4 className="text-white font-semibold">Processing Power</h4>
                </div>
                <p className="text-sm text-white/90 mb-1">
                  <span className="text-blue-400 font-medium">ARM Cortex-M7</span> @ 600MHz
                </p>
                <p className="text-sm text-white/60">NXP iMXRT1062 Architecture</p>
              </div>

              <div className="glass-effect rounded-2xl p-6 border border-green-500/20 ios-shadow">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mr-3">
                    <Radio size={16} className="text-white" />
                  </div>
                  <h4 className="text-white font-semibold">Connectivity</h4>
                </div>
                <p className="text-sm text-white/90 mb-1">
                  <span className="text-green-400 font-medium">Wi-Fi 6</span> + <span className="text-cyan-400 font-medium">BLE 5.2</span>
                </p>
                <p className="text-sm text-white/60">Cloud & Edge Ready</p>
              </div>
            </div>
          </motion.div>

          {/* iOS-style Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <motion.button
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl ios-shadow hover:shadow-2xl transition-all duration-300 ios-button relative overflow-hidden group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10">Explore Platform</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
            </motion.button>

            <motion.button
              className="px-8 py-4 glass-effect border border-white/20 text-white font-semibold rounded-2xl hover:bg-white/10 transition-all duration-300 ios-button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              View Documentation
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Right Side - Product Images */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          className="order-first lg:order-last"
        >
          <ProductCarousel />
        </motion.div>
      </div>
    </section>
  )
}

// Enhanced Features Section with iOS Design
const FeaturesSection = () => {
  const features = [
    {
      icon: Thermometer,
      title: "Temperature Monitoring",
      description: "Real-time thermal analysis with precision sensors and predictive algorithms",
      color: "from-red-500 to-orange-500",
      bgColor: "from-red-500/10 to-orange-500/10",
    },
    {
      icon: Zap,
      title: "Energy Management",
      description: "Smart power optimization with AI-driven efficiency recommendations",
      color: "from-yellow-500 to-amber-500",
      bgColor: "from-yellow-500/10 to-amber-500/10",
    },
    {
      icon: Activity,
      title: "Vibration Analysis",
      description: "Advanced FFT analysis for predictive maintenance and fault detection",
      color: "from-green-500 to-emerald-500",
      bgColor: "from-green-500/10 to-emerald-500/10",
    },
    {
      icon: Radio,
      title: "IoT Connectivity",
      description: "Multi-protocol support with secure cloud and edge communication",
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-500/10 to-cyan-500/10",
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Real-time insights with customizable KPIs and performance metrics",
      color: "from-purple-500 to-violet-500",
      bgColor: "from-purple-500/10 to-violet-500/10",
    },
    {
      icon: Shield,
      title: "Edge Security",
      description: "Enterprise-grade security with encrypted data processing",
      color: "from-indigo-500 to-purple-500",
      bgColor: "from-indigo-500/10 to-purple-500/10",
    },
  ]

  return (
    <section className="py-10 lg:py-10 relative px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Advanced <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Features</span>
          </h2>
          <p className="text-xl lg:text-2xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            Comprehensive monitoring capabilities designed for Industry 4.0 environments
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={index}
                className="relative group"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <div className={`relative p-8 glass-effect rounded-3xl border border-white/10 ios-shadow hover:border-white/20 transition-all duration-300 h-full group-hover:shadow-2xl`}>
                  <div className="space-y-6">
                    <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center ios-shadow`}>
                      <Icon size={28} className="text-white" />
                    </div>

                    <h3 className="text-xl lg:text-2xl font-bold text-white">{feature.title}</h3>

                    <p className="text-white/70 leading-relaxed">{feature.description}</p>
                  </div>

                  {/* Hover Glow Effect */}
                  <motion.div
                    className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{
                      background: `linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))`,
                      boxShadow: "0 0 60px rgba(59, 130, 246, 0.3)",
                    }}
                  />
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// Loading Screen
const LoadingScreen = () => {
  return (
    <motion.div
      className="fixed inset-0 bg-slate-900 flex items-center justify-center z-50"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center space-y-8">
        {/* Enhanced Lottie Animation Container */}
        <motion.div
          className="flex justify-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="w-32 h-32 flex items-center justify-center">
            <DotLottieReact
              src="https://lottie.host/884225af-422e-4077-9e5f-cc59d945d62e/xfbceFG3mX.lottie"
              loop
              autoplay
              className="w-full h-full"
            />
          </div>
        </motion.div>

        {/* Enhanced Text with Multiple Animation States */}
        <motion.div className="space-y-2">
          <motion.p
            className="text-white text-xl font-medium"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Loading MTCM Edge Module...
          </motion.p>

          {/* Additional loading indicator dots */}
          <motion.div
            className="flex justify-center space-x-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-blue-500 rounded-full"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </motion.div>
        </motion.div>

        {/* Optional: Progress indication */}
        <motion.div
          className="w-64 h-1 bg-slate-700 rounded-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

// Main App Component
const App = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [navOpen, setNavOpen] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white overflow-x-hidden">
        <AnimatedBackground />

        {/* Fixed Logos */}
        {/* CMTI badge (left) */}
        <motion.div
          className="fixed top-6 left-6 lg:left-80 z-30"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="">
            <img
              src={CMTILogo}
              alt="CMTI logo"
              className="h-16 w-auto"        /* tweak size here */
              draggable={false}
            />
          </div>
        </motion.div>

        {/* MHI3 badge (right) */}
        <motion.div
          className="fixed top-6 right-6 z-30"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="">
            <img
              src={MHILogo}
              alt="MHI3 logo"
              className="h-28 w-auto"        /* tweak size here */
              draggable={false}
            />
          </div>
        </motion.div>

        <Navigation isOpen={navOpen} setIsOpen={setNavOpen} />

        <main className="lg:ml-40 relative z-10">
          <Routes>
            <Route
              path="/"
              element={
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-0"
                >
                  <HeroSection />
                  <FeaturesSection />
                </motion.div>
              }
            />

            {/* Placeholder routes */}
            {[
              { path: "/temperature", element: <Tabs /> },
              { path: "/energy", element: <MSTab /> },
              { path: "/vibration", element: <Vibration /> },
              { path: "/digital-io", element: <DIO /> },
              { path: "/etop-io", element: <ETOP /> },
              { path: "/sensors", name: "Sensors" },
              { path: "/oee", element: <OEECalculator /> },
              { path: "/reports", name: "Report Generation" },
            ].map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={
                  route.element ? (
                    route.element                      // 👉 real component
                  ) : (
                    <div className="min-h-screen flex items-center justify-center">
                      <div className="text-center space-y-4">
                        <h1 className="text-4xl font-bold text-white">{route.name}</h1>
                        <p className="text-slate-400">Component coming soon...</p>
                      </div>
                    </div>
                  )
                }
              />
            ))}
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App