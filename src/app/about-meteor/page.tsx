"use client";

import {
  AlertCircle,
  Atom,
  Flame,
  Globe2,
  MapPin,
  Rocket,
  Star,
  Zap,
} from "lucide-react";

export default function AboutMeteorPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950 via-purple-950 to-black">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full filter blur-[100px] animate-pulse"></div>
            <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full filter blur-[120px] animate-pulse delay-1000"></div>
          </div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-500/50 px-4 py-2 rounded-full mb-8">
            <Zap className="w-5 h-5 text-yellow-400 animate-pulse" />
            <span className="text-purple-300 font-semibold">
              Cosmic Visitors from Space
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl font-extrabold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
            About Meteors
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed">
            Discover the science, history, and beauty of these spectacular
            cosmic phenomena that light up our night sky
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { icon: Star, label: "Shooting Stars", value: "Millions/Year" },
              { icon: Flame, label: "Entry Speed", value: "Up to 70 km/s" },
              { icon: Globe2, label: "Daily Influx", value: "100+ Tons" },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6 hover:border-purple-500 transition group"
              >
                <stat.icon className="w-10 h-10 text-purple-400 mx-auto mb-3 group-hover:scale-110 transition" />
                <div className="text-3xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-purple-400 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-purple-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Understanding Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
            Understanding Meteors
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Meteoroid",
                icon: Atom,
                description:
                  "A small rocky or metallic body traveling through space. Can range from grain-sized to boulder-sized objects.",
                stage: "In Space",
                color: "from-blue-600 to-cyan-600",
              },
              {
                title: "Meteor",
                icon: Flame,
                description:
                  "The bright streak of light (shooting star) produced when a meteoroid enters Earth's atmosphere and burns up due to friction.",
                stage: "In Atmosphere",
                color: "from-orange-600 to-red-600",
              },
              {
                title: "Meteorite",
                icon: MapPin,
                description:
                  "A meteoroid that survives its fiery journey through the atmosphere and lands on Earth's surface.",
                stage: "On Ground",
                color: "from-purple-600 to-pink-600",
              },
            ].map((item, idx) => (
              <div key={idx} className="relative group">
                <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 hover:border-purple-500/50 transition h-full">
                  <div
                    className={`w-20 h-20 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition`}
                  >
                    <item.icon className="w-10 h-10 text-white" />
                  </div>

                  <div className="inline-block px-3 py-1 bg-purple-500/20 rounded-full text-xs text-purple-300 mb-4">
                    {item.stage}
                  </div>

                  <h3 className="text-3xl font-bold mb-4 text-white">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {idx < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <div className="w-8 h-0.5 bg-gradient-to-r from-purple-500 to-transparent"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-4xl mx-auto text-center">
          <Rocket className="w-20 h-20 text-purple-400 mx-auto mb-6 animate-bounce" />
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Ready to Track Real Meteors?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Explore our live tracking system and 3D visualizations of actual
            meteor events
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/upcoming-meteor"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-full transition shadow-lg inline-flex items-center gap-2"
            >
              <Globe2 className="w-5 h-5" />
              Live Tracking
            </a>
            <a
              href="/asteroid-threat"
              className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-4 px-8 rounded-full transition border border-gray-700 inline-flex items-center gap-2"
            >
              <AlertCircle className="w-5 h-5" />
              Threat Assessment
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

