
'use client';

import {
  Activity,
  ExternalLink,
  Github,
  Globe,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Satellite,
  Target,
  Twitter
} from 'lucide-react';
import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { href: '/', label: 'Home', icon: Globe },
    { href: '/about-meteor', label: 'About Meteors', icon: Target },
    { href: '/upcoming-meteor', label: 'Live Tracking', icon: Activity },
    { href: '/about', label: 'About Us', icon: Satellite },
  ];

  const meteorData = [
    { label: 'Active Showers', value: '23', icon: '🌠' },
    { label: 'Tracked Today', value: '1,247', icon: '📊' },
    { label: 'Countries Covered', value: '195', icon: '🌍' },
    { label: 'Live Stations', value: '89', icon: '📡' },
  ];

  const socialLinks = [
    { href: 'https://github.com/adilrion/meteor-madness', icon: Github, label: 'GitHub' },
    { href: 'https://twitter.com', icon: Twitter, label: 'Twitter' },
    { href: 'https://linkedin.com', icon: Linkedin, label: 'LinkedIn' },
  ];

  return (
    <footer className="bg-gradient-to-t from-black via-gray-900 to-gray-800 text-white">
      {/* Live Stats Section */}
      <div className="border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
              🚀 Live Meteor Statistics
            </h3>
            <p className="text-gray-400">Real-time data from our global tracking network</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {meteorData.map((item, index) => (
              <div key={index} className="text-center p-4 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-lg border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300">
                <div className="text-3xl mb-2">{item.icon}</div>
                <div className="text-2xl font-bold text-purple-400 animate-pulse">{item.value}</div>
                <div className="text-sm text-gray-400">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl animate-pulse">🌠</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Meteor Madness
                </h2>
                <p className="text-sm text-gray-400">Real-time 3D Meteor Tracking</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Experience the wonder of space with our cutting-edge 3D visualization platform.
              Track meteors in real-time, explore cosmic phenomena, and join the global community
              of space enthusiasts powered by Cesium technology.
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-400 mb-2">
              <Satellite className="w-4 h-4 text-purple-400" />
              <span>Powered by NASA data & Cesium 3D</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Activity className="w-4 h-4 text-green-400 animate-pulse" />
              <span>Live tracking since 2025</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-purple-400">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-300 group"
                    >
                      <IconComponent className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      <span>{link.label}</span>
                    </Link>
                  </li>
                );
              })}
              <li>
                <a
                  href="https://nasa.gov"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-300 group"
                >
                  <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>NASA Data Source</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-purple-400">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-gray-300">
                <Mail className="w-4 h-4 text-purple-400" />
                <span className="text-sm">hello@meteormadness.com</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <Phone className="w-4 h-4 text-purple-400" />
                <span className="text-sm">+1 (555) METEOR-1</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <MapPin className="w-4 h-4 text-purple-400" />
                <span className="text-sm">Global Network</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-6">
              <h4 className="text-md font-semibold mb-3 text-purple-400">Follow Us</h4>
              <div className="flex space-x-4">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={social.href}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gray-700 hover:bg-purple-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                      aria-label={social.label}
                    >
                      <IconComponent className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              © {currentYear} Meteor Madness. Built for NASA Space Apps Challenge. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <div className="flex items-center space-x-1">
                <span>Made with</span>
                <span className="text-red-500 animate-pulse">❤️</span>
                <span>and</span>
                <span className="text-blue-400">Cesium</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;