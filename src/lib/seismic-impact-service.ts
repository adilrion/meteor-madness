"use client";

/**
 * Seismic Impact Service
 * Correlates asteroid impact energy with earthquake magnitudes
 * Based on USGS earthquake data and energy calculations
 */

export interface SeismicComparison {
    impactEnergyMT: number;
    equivalentMagnitude: number;
    richterScale: number;
    description: string;
    historicalComparison: string;
    shockwaveRadius: number; // km
    tsunamiRisk: "none" | "low" | "moderate" | "high" | "extreme";
}

export interface HistoricalImpact {
    name: string;
    year: number;
    location: string;
    energyMT: number;
    diameter: number; // meters
    casualties: number;
    craterDiameter: number; // km
    description: string;
}

export interface EarthquakeComparison {
    name: string;
    year: number;
    magnitude: number;
    location: string;
    energyMT: number;
    description: string;
}

export class SeismicImpactService {
    /**
     * Convert impact energy to seismic magnitude
     * Using the relationship: M = (2/3) * log10(E) - 2.9
     * where E is energy in ergs
     */
    static energyToMagnitude(energyMT: number): number {
        // Convert megatons to ergs
        // 1 MT = 4.184 × 10^22 ergs
        const energyErgs = energyMT * 4.184e22;

        // Moment magnitude formula
        const magnitude = (2 / 3) * Math.log10(energyErgs) - 2.9;

        return magnitude;
    }

    /**
     * Convert magnitude to energy in megatons
     */
    static magnitudeToEnergy(magnitude: number): number {
        // E = 10^(1.5M + 4.8) in joules
        const energyJoules = Math.pow(10, 1.5 * magnitude + 4.8);

        // Convert to megatons
        const energyMT = energyJoules / 4.184e15;

        return energyMT;
    }

    /**
     * Calculate Richter scale equivalent
     */
    static calculateRichterScale(energyMT: number): number {
        // Richter scale: log10(A) = M - log10(A0)
        // Simplified relationship for impact events
        const magnitude = this.energyToMagnitude(energyMT);

        // Richter scale is approximately the same for large events
        return magnitude;
    }

    /**
     * Estimate shockwave radius based on energy
     */
    static estimateShockwaveRadius(energyMT: number): {
        totalDestruction: number; // km
        severeDestruction: number; // km
        moderateDestruction: number; // km
        glassBreakage: number; // km
    } {
        // Based on nuclear weapons effects scaling
        const cubicRoot = Math.pow(energyMT, 1 / 3);

        return {
            totalDestruction: 2.2 * cubicRoot,
            severeDestruction: 6.0 * cubicRoot,
            moderateDestruction: 17.0 * cubicRoot,
            glassBreakage: 35.0 * cubicRoot,
        };
    }

    /**
     * Assess tsunami risk for ocean impacts
     */
    static assessTsunamiRisk(
        energyMT: number,
        diameterKm: number,
        isOceanImpact: boolean
    ): "none" | "low" | "moderate" | "high" | "extreme" {
        if (!isOceanImpact) return "none";

        if (energyMT > 10000 || diameterKm > 1.0) return "extreme";
        if (energyMT > 1000 || diameterKm > 0.5) return "high";
        if (energyMT > 100 || diameterKm > 0.2) return "moderate";
        if (energyMT > 10 || diameterKm > 0.05) return "low";

        return "none";
    }

    /**
     * Get comprehensive seismic comparison
     */
    static getSeismicComparison(
        energyMT: number,
        diameterKm: number,
        isOceanImpact: boolean = false
    ): SeismicComparison {
        const magnitude = this.energyToMagnitude(energyMT);
        const richter = this.calculateRichterScale(energyMT);
        const shockwave = this.estimateShockwaveRadius(energyMT);
        const tsunamiRisk = this.assessTsunamiRisk(
            energyMT,
            diameterKm,
            isOceanImpact
        );

        let description = "";
        if (magnitude < 4) {
            description = "Minor tremors, barely felt";
        } else if (magnitude < 5) {
            description = "Light earthquake, minor damage to buildings";
        } else if (magnitude < 6) {
            description = "Moderate earthquake, considerable damage";
        } else if (magnitude < 7) {
            description = "Strong earthquake, severe damage over wide area";
        } else if (magnitude < 8) {
            description = "Major earthquake, catastrophic destruction";
        } else if (magnitude < 9) {
            description = "Great earthquake, devastating regional effects";
        } else {
            description =
                "Mega-thrust earthquake, global environmental effects";
        }

        const historicalEq = this.findSimilarEarthquake(magnitude);
        const historicalComparison = historicalEq
            ? `Similar to ${historicalEq.name} (${historicalEq.year})`
            : "Unprecedented seismic event";

        return {
            impactEnergyMT: energyMT,
            equivalentMagnitude: magnitude,
            richterScale: richter,
            description,
            historicalComparison,
            shockwaveRadius: shockwave.severeDestruction,
            tsunamiRisk,
        };
    }

    /**
     * Find similar historical earthquake
     */
    static findSimilarEarthquake(
        magnitude: number
    ): EarthquakeComparison | null {
        const earthquakes = this.getHistoricalEarthquakes();

        // Find closest magnitude
        let closest: EarthquakeComparison | null = null;
        let minDiff = Infinity;

        for (const eq of earthquakes) {
            const diff = Math.abs(eq.magnitude - magnitude);
            if (diff < minDiff) {
                minDiff = diff;
                closest = eq;
            }
        }

        return closest;
    }

    /**
     * Get historical earthquakes for comparison
     */
    static getHistoricalEarthquakes(): EarthquakeComparison[] {
        return [
            {
                name: "San Francisco Earthquake",
                year: 1906,
                magnitude: 7.9,
                location: "California, USA",
                energyMT: 0.006,
                description:
                    "One of the most significant earthquakes in US history",
            },
            {
                name: "Great Chilean Earthquake",
                year: 1960,
                magnitude: 9.5,
                location: "Valdivia, Chile",
                energyMT: 178,
                description: "Most powerful earthquake ever recorded",
            },
            {
                name: "Indian Ocean Earthquake & Tsunami",
                year: 2004,
                magnitude: 9.1,
                location: "Sumatra, Indonesia",
                energyMT: 32,
                description:
                    "Triggered devastating tsunami, 230,000+ casualties",
            },
            {
                name: "Great East Japan Earthquake",
                year: 2011,
                magnitude: 9.1,
                location: "Tōhoku, Japan",
                energyMT: 32,
                description: "Fukushima nuclear disaster triggered by tsunami",
            },
            {
                name: "Anchorage Earthquake",
                year: 1964,
                magnitude: 9.2,
                location: "Alaska, USA",
                energyMT: 56,
                description:
                    "Second most powerful earthquake recorded in history",
            },
            {
                name: "Haiti Earthquake",
                year: 2010,
                magnitude: 7.0,
                location: "Port-au-Prince, Haiti",
                energyMT: 0.001,
                description:
                    "Devastating humanitarian disaster, 300,000+ casualties",
            },
            {
                name: "Kobe Earthquake",
                year: 1995,
                magnitude: 6.9,
                location: "Kobe, Japan",
                energyMT: 0.0008,
                description:
                    "Severe infrastructure damage in major industrial city",
            },
            {
                name: "Nepal Earthquake",
                year: 2015,
                magnitude: 7.8,
                location: "Kathmandu, Nepal",
                energyMT: 0.004,
                description: "Historic temples destroyed, 9,000+ casualties",
            },
        ];
    }

    /**
     * Get historical asteroid impacts
     */
    static getHistoricalImpacts(): HistoricalImpact[] {
        return [
            {
                name: "Chicxulub Impact",
                year: -65000000,
                location: "Yucatán Peninsula, Mexico",
                energyMT: 100000000,
                diameter: 10000,
                casualties: 0, // Dinosaurs
                craterDiameter: 150,
                description:
                    "Caused mass extinction event, ended Cretaceous period",
            },
            {
                name: "Tunguska Event",
                year: 1908,
                location: "Siberia, Russia",
                energyMT: 12,
                diameter: 60,
                casualties: 0,
                craterDiameter: 0, // Air burst
                description:
                    "Flattened 2,000 km² of forest, largest impact in recorded history",
            },
            {
                name: "Chelyabinsk Meteor",
                year: 2013,
                location: "Chelyabinsk Oblast, Russia",
                energyMT: 0.5,
                diameter: 20,
                casualties: 1500, // Injured
                craterDiameter: 0, // Air burst
                description:
                    "Injured 1,500 people from shockwave, damaged 7,200 buildings",
            },
            {
                name: "Barringer Crater",
                year: -50000,
                location: "Arizona, USA",
                energyMT: 10,
                diameter: 50,
                casualties: 0,
                craterDiameter: 1.2,
                description:
                    "Well-preserved impact crater, tourist destination",
            },
            {
                name: "Vredefort Impact",
                year: -2023000000,
                location: "Free State, South Africa",
                energyMT: 500000000,
                diameter: 15000,
                casualties: 0,
                craterDiameter: 300,
                description: "Largest verified impact crater on Earth",
            },
            {
                name: "Sudbury Basin",
                year: -1850000000,
                location: "Ontario, Canada",
                energyMT: 300000000,
                diameter: 10000,
                casualties: 0,
                craterDiameter: 250,
                description:
                    "Second largest impact structure, major nickel mining site",
            },
            {
                name: "Chesapeake Bay Impact",
                year: -35000000,
                location: "Virginia, USA",
                energyMT: 50000000,
                diameter: 3000,
                casualties: 0,
                craterDiameter: 85,
                description:
                    "Created Chesapeake Bay, one of largest US impact craters",
            },
        ];
    }

    /**
     * Compare asteroid impact to historical events
     */
    static compareToHistoricalImpact(
        energyMT: number
    ): HistoricalImpact | null {
        const impacts = this.getHistoricalImpacts();

        // Find closest energy match
        let closest: HistoricalImpact | null = null;
        let minRatio = Infinity;

        for (const impact of impacts) {
            const ratio = Math.max(
                impact.energyMT / energyMT,
                energyMT / impact.energyMT
            );
            if (ratio < minRatio) {
                minRatio = ratio;
                closest = impact;
            }
        }

        return closest;
    }

    /**
     * Calculate casualty estimates based on population density
     */
    static estimateCasualties(
        energyMT: number,
        populationDensity: number
    ): {
        deaths: number;
        injuries: number;
        description: string;
    } {
        const shockwave = this.estimateShockwaveRadius(energyMT);

        // Calculate affected area
        const totalDestructionArea =
            Math.PI * Math.pow(shockwave.totalDestruction, 2);
        const severeDestructionArea =
            Math.PI *
            (Math.pow(shockwave.severeDestruction, 2) -
                Math.pow(shockwave.totalDestruction, 2));
        const moderateDestructionArea =
            Math.PI *
            (Math.pow(shockwave.moderateDestruction, 2) -
                Math.pow(shockwave.severeDestruction, 2));

        // Fatality rates by zone
        const totalDestructionDeaths =
            totalDestructionArea * populationDensity * 0.95;
        const severeDestructionDeaths =
            severeDestructionArea * populationDensity * 0.15;
        const moderateDestructionDeaths =
            moderateDestructionArea * populationDensity * 0.02;

        const totalDeaths = Math.round(
            totalDestructionDeaths +
                severeDestructionDeaths +
                moderateDestructionDeaths
        );
        const totalInjuries = Math.round(totalDeaths * 3);

        let description = "";
        if (totalDeaths < 100) {
            description = "Limited casualties in sparsely populated area";
        } else if (totalDeaths < 10000) {
            description = "Significant local casualties";
        } else if (totalDeaths < 100000) {
            description = "Major urban disaster";
        } else if (totalDeaths < 1000000) {
            description = "Catastrophic metropolitan devastation";
        } else {
            description = "Mass casualty event with regional/global impact";
        }

        return {
            deaths: totalDeaths,
            injuries: totalInjuries,
            description,
        };
    }
}
