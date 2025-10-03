import { EnhancedSolarSystemVisualization } from '@/components/common/enhanced-solar-system'

const UpcomingMeteor = () => {
  return (
    <main className="min-h-screen bg-black">
      <EnhancedSolarSystemVisualization
        enableRealTimeData={true}
        autoRefresh={true}
        refreshInterval={60}
      />
    </main>
  )
}

export default UpcomingMeteor