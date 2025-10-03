'use client';

import { Activity, AlertTriangle, Database, Globe, Menu, Shield, Users, X, Zap } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { href: '/', label: 'Home', icon: Globe },
    { href: '/about-meteor', label: 'About Meteors', icon: Zap },
    { href: '/upcoming-meteor', label: 'Live Tracking', icon: Activity },
    { href: '/asteroid-threat', label: 'Threats', icon: AlertTriangle },
    { href: '/neo-explorer', label: 'NEO Explorer', icon: Database },
    { href: '/safety-center', label: 'Safety Center', icon: Shield },
    { href: '/about', label: 'About Us', icon: Users },
    { href: '/contact', label: 'Contact', icon: Menu },
  ];

  return (
    <nav className="bg-black/95 backdrop-blur-sm border-b border-purple-500/20 sticky top-0 z-50">
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-lg animate-pulse">🌠</span>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Meteor Madness
                </h1>
                <p className="text-xs text-gray-400 -mt-1">Real-time 3D Tracking</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-1 text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:bg-purple-500/20 group"
                >
                  <IconComponent className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Live Status Indicator */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-3 py-1 bg-green-500/20 rounded-full border border-green-500/30">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-xs font-medium">LIVE</span>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white p-2 rounded-md transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          } overflow-hidden`}>
          <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-900/50 rounded-lg mt-2">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-3 text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium transition-all duration-300 hover:bg-purple-500/20"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <IconComponent className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <div className="flex items-center justify-center space-x-2 px-3 py-2 mt-4">
              <div className="flex items-center space-x-2 px-3 py-1 bg-green-500/20 rounded-full border border-green-500/30">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-xs font-medium">LIVE TRACKING</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;