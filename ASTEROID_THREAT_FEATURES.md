# Asteroid Threat Assessment Center

A comprehensive 3D visualization and analysis platform for asteroid impact scenarios, built with Next.js, Three.js, and React Three Fiber.

## 🌟 Features Implemented

### 1. **Asteroid Threat Info Panel**

-   **Name, Size & Mass**: Complete asteroid specifications
-   **Speed & Trajectory**: Impact velocity and entry angle
-   **Predicted Impact**: Location coordinates and estimated time
-   **Risk Probability**: Scientific probability calculations
-   **Traffic-Light Risk Levels**: Color-coded threat assessment (MINIMAL → CRITICAL)

### 2. **Casualty & Damage Estimator**

-   **Deaths & Injuries**: Population-based impact calculations
-   **Infrastructure Loss**: Billions USD in damage assessment
-   **Economic Impact**: Global and regional economic effects
-   **Advanced Modeling**: Considers population density, urban areas, and blast zones

### 3. **Impact Timeline Simulator**

-   **6-Phase Simulation**:
    -   Atmospheric Entry
    -   Heating & Fragmentation
    -   Impact
    -   Explosion
    -   Shockwave
    -   Aftermath
-   **Real-time Animation**: Interactive play/pause controls
-   **Phase Details**: Duration and description for each phase

### 4. **Energy Release Visualizer**

-   **TNT Equivalent**: Megatons comparison
-   **Historical References**:
    -   Hiroshima Bomb (0.015 MT)
    -   Tsar Bomba (50 MT)
    -   Mount St. Helens (24 MT)
    -   2004 Indian Ocean Tsunami (23,000 MT)
    -   Chicxulub Impact (100,000,000 MT)
-   **Relative Scale**: Multiplier comparisons

### 5. **Impact Probability Meter**

-   **Adjustable Timeframe**: 1-1000 years
-   **Real-time Calculation**: Dynamic probability updates
-   **Visual Meter**: Animated probability bar
-   **Risk Assessment**: Automatic threat level determination
-   **Statistical Display**: Multiple probability formats

### 6. **Multi-Scenario Comparison**

-   **6 Asteroid Types**: From Chelyabinsk-class to Chicxulub-class
-   **Side-by-side Analysis**: Quick comparison dashboard
-   **Key Metrics**: Size, location, risk level, energy, casualties
-   **Interactive Selection**: Click to switch scenarios

## 🎯 Additional Features

### **3D Earth Visualization**

-   **Realistic Globe**: Rotating Earth with country mapping
-   **Impact Markers**: Red indicators for impact locations
-   **Orbital Controls**: Zoom, pan, and rotate
-   **Star Field**: Space environment backdrop

### **Asteroid 3D Rendering**

-   **Dynamic Animation**: Rotating asteroids with realistic textures
-   **Trajectory Visualization**: Flight path from space to impact
-   **Composition-based Colors**: Different materials (Metallic, Stony, Carbonaceous)
-   **Scale-accurate Sizing**: Logarithmic size representation

### **3D Trajectory Simulator**

-   **Real-time Path Animation**: Entry to impact visualization
-   **Atmospheric Effects**: Heating and fragmentation effects
-   **Entry Angle Simulation**: Accurate trajectory based on physics
-   **Impact Point Tracking**: Precise location marking

### **Size Comparison Tool**

-   **Reference Objects**: Human, car, house, football field, Empire State Building, Mount Everest
-   **Visual Scale Bars**: Proportional size representation
-   **Dynamic Highlighting**: Selected asteroid emphasis
-   **Scale Statistics**: Relative size calculations

### **Threat Summary Dashboard**

-   **Comprehensive Overview**: All key metrics in one view
-   **Threat Level Icons**: Visual threat indicators
-   **Historical Context**: Impact frequency data
-   **Educational Notes**: Scientific disclaimers and information

## 🛠️ Technology Stack

-   **Frontend**: Next.js 15.5.0 with TypeScript
-   **3D Graphics**: Three.js + React Three Fiber
-   **3D Components**: @react-three/drei
-   **UI Components**: Custom components with Tailwind CSS
-   **Animations**: CSS transitions and Three.js animations
-   **State Management**: React hooks (useState, useEffect, useRef)

## 📊 Scientific Accuracy

### **Impact Calculations**

-   Kinetic energy formulas: KE = ½mv²
-   TNT equivalent conversion: 4.184 × 10¹⁵ J per megaton
-   Crater diameter estimation: Holsapple-Schmidt scaling laws
-   Population impact modeling: Zone-based casualty rates

### **Risk Assessment**

-   NASA/ESA probability standards
-   Historical impact frequency data
-   Multi-variable risk factors
-   Torino Scale compatibility

### **Damage Modeling**

-   **Total Destruction Zone**: 95% fatality rate
-   **Severe Destruction Zone**: 15% fatality rate
-   **Moderate Destruction Zone**: 2% fatality rate
-   **Economic Impact**: GDP-based calculations

## 🎮 Interactive Features

1. **Asteroid Selection**: Choose from 6 different asteroid scenarios
2. **Probability Timeframe**: Adjust from 1 to 1000 years
3. **3D Scene Navigation**: Full camera controls
4. **Timeline Animation**: Play/pause impact sequence
5. **Real-time Updates**: All calculations update automatically
6. **Responsive Design**: Works on desktop and mobile

## 🌍 Real-world Applications

-   **Educational Tool**: Understanding asteroid threats
-   **Risk Assessment**: Scientific impact analysis
-   **Public Awareness**: Asteroid defense importance
-   **Research Platform**: Testing impact scenarios
-   **Emergency Planning**: Disaster preparedness

## 🚀 Future Enhancements

-   Atmospheric density effects
-   Seasonal impact variations
-   Multiple simultaneous impacts
-   Evacuation zone planning
-   International response coordination
-   Historical impact recreation

## 📱 Usage

1. **Navigate**: Visit `/asteroid-threat` in your browser
2. **Select**: Choose an asteroid from the comparison panel
3. **Explore**: Use 3D controls to examine Earth and trajectory
4. **Analyze**: Review all impact metrics and assessments
5. **Compare**: Switch between different asteroid scenarios
6. **Simulate**: Play the timeline animation
7. **Adjust**: Modify probability timeframes

This comprehensive asteroid threat assessment tool provides both educational value and scientific accuracy, making complex impact scenarios accessible and understandable through interactive 3D visualization.
