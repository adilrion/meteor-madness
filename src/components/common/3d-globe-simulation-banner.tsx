
const GlobeSimulationBanner = () => {
  return (
    <div className="bg-gradient-to-r from-blue-900 via-purple-900 to-black text-white py-16">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl font-bold mb-4 animate-pulse">
          🌍 Meteor Madness 🌠
        </h1>
        <p className="text-xl mb-6 opacity-90">
          Real-time 3D visualization of meteors and space phenomena using Cesium
        </p>
        <div className="text-sm opacity-75">
          <p>Navigate the 3D globe below to explore meteor entry points and trajectories</p>
          <p className="mt-2">Use mouse to rotate • Scroll to zoom • Click and drag to pan</p>
        </div>
      </div>
    </div>
  )
}

export default GlobeSimulationBanner