
'use client';

import {
  Activity,
  Clock,
  Eye,
  Globe,
  Pause,
  Play,
  Target,
  TrendingUp,
  Zap
} from 'lucide-react';
import { useEffect, useState } from 'react';

const GlobeSimulationBanner = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeShowers] = useState(3);
  const [meteorsToday, setMeteorsToday] = useState(1247);
  const [liveStations, setLiveStations] = useState(89);

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
      if (Math.random() > 0.7) {
        setMeteorsToday(prev => prev + Math.floor(Math.random() * 3));
      }
      if (Math.random() > 0.9) {
        setLiveStations(prev => prev + (Math.random() > 0.5 ? 1 : -1));
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const meteorShowers = [
    { name: 'Perseids', peak: 'Aug 12-13', status: 'Active', intensity: 'High', color: 'bg-yellow-400' },
    { name: 'Geminids', peak: 'Dec 13-14', status: 'Building', intensity: 'Medium', color: 'bg-cyan-400' },
    { name: 'Leonids', peak: 'Nov 17-18', status: 'Approaching', intensity: 'Low', color: 'bg-green-400' },
  ];

  const globalStats = [
    {
      icon: Activity,
      label: 'Live Tracking',
      value: `${meteorsToday.toLocaleString()}`,
      subtitle: 'meteors today',
      color: 'text-green-400'
    },
    {
      icon: Globe,
      label: 'Active Showers',
      value: activeShowers,
      subtitle: 'worldwide',
      color: 'text-blue-400'
    },
    {
      icon: Target,
      label: 'Detection Stations',
      value: liveStations,
      subtitle: 'countries',
      color: 'text-purple-400'
    },
    {
      icon: TrendingUp,
      label: 'Peak Activity',
      value: '847/hr',
      subtitle: 'meteors per hour',
      color: 'text-orange-400'
    },
  ];

  return (
    <div className="relative bg-gradient-to-br from-black via-purple-900/50 to-blue-900/30 text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-2 h-2 bg-white rounded-full animate-pulse"></div>
        <div className="absolute top-20 right-20 w-1 h-1 bg-yellow-400 rounded-full animate-ping"></div>
        <div className="absolute bottom-20 left-1/4 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-green-400 rounded-full animate-ping"></div>
        <div className="absolute bottom-1/3 left-1/2 w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>

        {/* Shooting star animations */}
        <div className="absolute top-16 left-0 w-px h-20 bg-gradient-to-b from-transparent via-white to-transparent transform rotate-45 animate-pulse"></div>
        <div className="absolute top-32 right-10 w-px h-16 bg-gradient-to-b from-transparent via-yellow-400 to-transparent transform rotate-12 animate-pulse delay-500"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        {/* Main Hero Content */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center animate-pulse">
                <span className="text-3xl">🌠</span>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-bounce flex items-center justify-center">
                <span className="text-xs">🔥</span>
              </div>
            </div>
            <div>
              <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-pulse">
                Meteor Madness
              </h1>
              <p className="text-lg text-gray-300 mt-2">3D Real-time Space Phenomenon Tracking</p>
            </div>
          </div>

          <p className="text-xl lg:text-2xl mb-8 opacity-90 max-w-4xl mx-auto leading-relaxed">
            Experience the cosmos like never before with our cutting-edge 3D visualization platform.
            Track meteors in real-time, explore their trajectories, and witness the beauty of space phenomena
            through interactive Cesium-powered globe technology.
          </p>

          {/* Live Status Bar */}
          <div className="flex items-center justify-center space-x-6 mb-8">
            <div className="flex items-center space-x-2 px-4 py-2 bg-green-500/20 rounded-full border border-green-500/30">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 font-medium">LIVE TRACKING</span>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 bg-blue-500/20 rounded-full border border-blue-500/30">
              <Clock className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 font-medium">
                {currentTime.toLocaleTimeString()} UTC
              </span>
            </div>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-500/20 rounded-full border border-purple-500/30 hover:bg-purple-500/30 transition-all"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span className="font-medium">{isPlaying ? 'Pause' : 'Play'}</span>
            </button>
          </div>
        </div>

        {/* Global Statistics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {globalStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 hover:scale-105">
                <div className="flex items-center space-x-3 mb-3">
                  <IconComponent className={`w-6 h-6 ${stat.color}`} />
                  <span className="text-gray-300 text-sm">{stat.label}</span>
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-gray-400 text-xs">{stat.subtitle}</div>
              </div>
            );
          })}
        </div>

        {/* Active Meteor Showers */}
        <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 mb-8">
          <div className="flex items-center space-x-2 mb-6">
            <Zap className="w-5 h-5 text-yellow-400" />
            <h3 className="text-xl font-bold">Active Meteor Showers</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {meteorShowers.map((shower, index) => (
              <div key={index} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-white">{shower.name}</span>
                  <div className={`w-3 h-3 rounded-full ${shower.color} animate-pulse`}></div>
                </div>
                <div className="text-sm text-gray-300 mb-1">Peak: {shower.peak}</div>
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-1 rounded-full ${shower.status === 'Active' ? 'bg-green-500/20 text-green-400' :
                      shower.status === 'Building' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-blue-500/20 text-blue-400'
                    }`}>
                    {shower.status}
                  </span>
                  <span className="text-xs text-gray-400">{shower.intensity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Controls Guide */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl p-6 border border-purple-500/20">
            <h3 className="text-lg font-semibold mb-4 flex items-center justify-center space-x-2">
              <Eye className="w-5 h-5" />
              <span>Interactive 3D Globe Controls</span>
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">🖱️</div>
                <span className="text-gray-300">Drag to rotate</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">🔄</div>
                <span className="text-gray-300">Scroll to zoom</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">👆</div>
                <span className="text-gray-300">Click meteors</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">⏸️</div>
                <span className="text-gray-300">Space to pause</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobeSimulationBanner;