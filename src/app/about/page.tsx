"use client";

import { Activity, Database, Globe, Rocket, Shield, Sparkles, Target, Users, Zap } from "lucide-react";
import Link from "next/link";

export default function About() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-blue-950 via-purple-900 to-black py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
          <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse"></div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 rounded-full px-6 py-2 mb-6">
            <Sparkles className="w-5 h-5 text-blue-400" />
            <span className="text-blue-300 text-sm font-medium">NASA Space Apps Challenge 2025</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            About <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Meteor Madness</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto">
            A cutting-edge web platform for tracking, analyzing, and understanding near-Earth objects and meteor threats using real-time NASA data.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/neo-explorer" className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/50">
              Explore NEOs
            </Link>
            <Link href="/upcoming-meteor" className="px-8 py-3 bg-slate-800 border border-slate-600 text-white rounded-lg font-semibold hover:bg-slate-700 transition-all">
              Live Tracking
            </Link>
          </div>
        </div>
      </div>

      {/* Mission Statement */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-xl p-8 md:p-12">
          <div className="flex items-center gap-3 mb-6">
            <Rocket className="w-8 h-8 text-blue-400" />
            <h2 className="text-3xl font-bold text-white">Our Mission</h2>
          </div>
          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            Meteor Madness aims to make space science accessible and engaging by providing real-time visualization and analysis of near-Earth objects. We combine NASA&apos;s extensive databases with modern web technologies to create an educational platform that helps people understand the science behind asteroid tracking and planetary defense.
          </p>
          <p className="text-gray-300 text-lg leading-relaxed">
            Our platform serves educators, students, researchers, and space enthusiasts by providing scientifically accurate data in an interactive, visually compelling format that makes complex orbital mechanics understandable to everyone.
          </p>
        </div>
      </div>

      {/* Key Features */}
      <KeyFeatures />

      {/* Technology Stack */}
      <TechnologyStack />

      {/* Data Sources */}
      <DataSources />

      {/* What Makes Us Different */}
      <WhatMakesUsDifferent />

      {/* Team Section */}
      <TeamSection />

      {/* Call to Action */}
      <CallToAction />
    </div>
  );
}

function KeyFeatures() {
  const features = [
    {
      icon: Database,
      title: "Real NASA Data",
      description: "Live integration with NASA's Near-Earth Object Web Service, providing real-time data on 34,000+ asteroids.",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Globe,
      title: "3D Visualization",
      description: "Interactive 3D globe and orbital mechanics viewer using Three.js and Cesium for immersive space exploration.",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: Activity,
      title: "Seismic Analysis",
      description: "Advanced impact modeling correlating asteroid energy with earthquake magnitudes using USGS data.",
      color: "from-orange-500 to-orange-600",
    },
    {
      icon: Target,
      title: "Threat Assessment",
      description: "Scientific risk evaluation using Keplerian orbital mechanics and multi-factor threat analysis.",
      color: "from-red-500 to-red-600",
    },
    {
      icon: Zap,
      title: "Real-Time Tracking",
      description: "Live meteor shower monitoring and upcoming close approach predictions with precise calculations.",
      color: "from-yellow-500 to-yellow-600",
    },
    {
      icon: Shield,
      title: "Planetary Defense",
      description: "Educational resources on NASA's planetary defense strategies and the DART mission success.",
      color: "from-green-500 to-green-600",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-white mb-4">Key Features</h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">Comprehensive tools for exploring, analyzing, and understanding near-Earth objects</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div key={index} className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-all group">
            <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <feature.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
            <p className="text-gray-400 leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function TechnologyStack() {
  const techStack = [
    { name: "Next.js 15", category: "Framework" },
    { name: "TypeScript", category: "Language" },
    { name: "Three.js", category: "3D Graphics" },
    { name: "Cesium", category: "Geospatial" },
    { name: "Tailwind CSS", category: "Styling" },
    { name: "React Three Fiber", category: "3D React" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-xl p-8 md:p-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Technology Stack</h2>
          <p className="text-gray-400 text-lg">Built with modern, cutting-edge web technologies</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {techStack.map((tech, index) => (
            <div key={index} className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 text-center hover:border-purple-500 transition-colors">
              <div className="text-white font-bold text-lg mb-1">{tech.name}</div>
              <div className="text-gray-500 text-xs">{tech.category}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DataSources() {
  const dataSources = [
    { name: "NASA NeoWs API", description: "Near-Earth Object Web Service", url: "https://api.nasa.gov" },
    { name: "NASA SBDB", description: "Small-Body Database", url: "https://ssd.jpl.nasa.gov" },
    { name: "USGS NEIC", description: "Earthquake Information Center", url: "https://earthquake.usgs.gov" },
    { name: "NASA CNEOS", description: "Center for NEO Studies", url: "https://cneos.jpl.nasa.gov" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-white mb-4">Data Sources & Partners</h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">Powered by trusted space agencies and scientific institutions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dataSources.map((source, index) => (
          <a key={index} href={source.url} target="_blank" rel="noopener noreferrer" className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-xl p-6 hover:border-blue-500 transition-all group">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500 transition-colors">
              <Database className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{source.name}</h3>
            <p className="text-gray-400 text-sm">{source.description}</p>
          </a>
        ))}
      </div>
    </div>
  );
}

function WhatMakesUsDifferent() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-xl p-8 md:p-12">
        <div className="flex items-center gap-3 mb-8">
          <Target className="w-8 h-8 text-purple-400" />
          <h2 className="text-3xl font-bold text-white">What Makes Us Different</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-bold text-blue-400 mb-3">Scientific Accuracy</h3>
            <p className="text-gray-300 leading-relaxed">All calculations are based on real scientific formulas including Keplerian orbital mechanics, Holsapple-Schmidt crater scaling, and USGS seismic magnitude scales.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-purple-400 mb-3">Real-Time Data</h3>
            <p className="text-gray-300 leading-relaxed">Direct integration with NASA APIs means you&apos;re always seeing the latest information about NEOs and close approaches.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-green-400 mb-3">Interactive Learning</h3>
            <p className="text-gray-300 leading-relaxed">Our platform lets you interact with 3D models and see results in real-time, making learning engaging and intuitive.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-red-400 mb-3">Open & Accessible</h3>
            <p className="text-gray-300 leading-relaxed">We believe space science should be accessible to everyone. Our platform is free and works on any device.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TeamSection() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-blue-500/30 rounded-xl p-8 md:p-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Users className="w-8 h-8 text-blue-400" />
            <h2 className="text-4xl font-bold text-white">Our Team</h2>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">Passionate developers and space enthusiasts dedicated to making space science accessible</p>
        </div>

        <div className="text-center">
          <p className="text-gray-300 text-lg leading-relaxed max-w-3xl mx-auto mb-6">
            Meteor Madness is developed by a team of space enthusiasts, developers, and designers who believe in the power of technology to educate and inspire. We&apos;re committed to creating tools that help people understand the universe around us.
          </p>
          <p className="text-gray-400">Created for NASA Space Apps Challenge 2025</p>
        </div>
      </div>
    </div>
  );
}

function CallToAction() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pb-20">
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-xl p-12 text-center">
        <h2 className="text-4xl font-bold text-white mb-4">Ready to Explore?</h2>
        <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
          Start your journey into space by exploring near-Earth objects, tracking meteor showers, and learning about planetary defense.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/neo-explorer" className="px-8 py-3 bg-white text-purple-600 rounded-lg font-bold hover:bg-gray-100 transition-all shadow-lg">
            Explore NEO Database
          </Link>
          <Link href="/upcoming-meteor" className="px-8 py-3 bg-black/30 backdrop-blur-sm border border-white/30 text-white rounded-lg font-bold hover:bg-black/50 transition-all">
            Track Live Meteors
          </Link>
          <Link href="/contact" className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-bold hover:bg-white hover:text-purple-600 transition-all">
            Get in Touch
          </Link>
        </div>
      </div>
    </div>
  );
}

