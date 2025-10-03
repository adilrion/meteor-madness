"use client";

export interface ClimateImpactData {
    asteroidDiameter: number; // km
    impactEnergy: number; // megatons TNT
    dustVolume: number; // cubic km
    atmosphericDuration: number; // months
    temperatureDrop: number; // celsius
    sunlightReduction: number; // percentage
    agriculturalImpact: string;
    globalEffects: string[];
    timelinePhases: {
        phase: string;
        timeframe: string;
        effects: string[];
    }[];
    severity: "minimal" | "moderate" | "severe" | "catastrophic" | "extinction";
}

export class ClimateImpactService {
    /**
     * Calculate climate effects from asteroid impact
     */
    static calculateClimateImpact(
        diameterKm: number,
        energyMT: number
    ): ClimateImpactData {
        // Dust volume estimation (empirical formula based on crater size)
        const dustVolume = Math.pow(diameterKm, 2.5) * 0.1;

        // Atmospheric duration (months) - larger impacts have longer-lasting effects
        let atmosphericDuration: number;
        if (diameterKm < 0.05) {
            atmosphericDuration = 0.1;
        } else if (diameterKm < 0.5) {
            atmosphericDuration = 1 + diameterKm * 2;
        } else if (diameterKm < 2) {
            atmosphericDuration = 6 + diameterKm * 12;
        } else if (diameterKm < 5) {
            atmosphericDuration = 24 + diameterKm * 24;
        } else {
            atmosphericDuration = 120 + diameterKm * 12; // Years for extinction-level
        }

        // Temperature drop (based on sunlight reduction)
        const sunlightReduction = Math.min(95, diameterKm * 15);
        const temperatureDrop = (sunlightReduction / 100) * 20; // Max ~20°C drop

        // Agricultural impact assessment
        let agriculturalImpact: string;
        let severity: ClimateImpactData["severity"];
        let globalEffects: string[];

        if (diameterKm < 0.05) {
            severity = "minimal";
            agriculturalImpact = "Negligible impact on agriculture";
            globalEffects = [
                "Minor atmospheric disturbance",
                "Local air quality effects",
            ];
        } else if (diameterKm < 0.2) {
            severity = "moderate";
            agriculturalImpact = "Regional crop failures for 1-2 seasons";
            globalEffects = [
                "Temporary regional cooling",
                "Increased atmospheric particulates",
                "Local weather disruption",
                "Minor global temperature fluctuation",
            ];
        } else if (diameterKm < 1) {
            severity = "severe";
            agriculturalImpact = "Multi-year global food shortages";
            globalEffects = [
                "Global temperature drop of 5-10°C",
                "Reduced sunlight for 1-3 years",
                "Widespread crop failures",
                "Ocean acidification",
                "Ozone layer damage",
                "Extreme weather events",
            ];
        } else if (diameterKm < 5) {
            severity = "catastrophic";
            agriculturalImpact = "Decade-long agricultural collapse";
            globalEffects = [
                "Global temperature drop of 10-15°C",
                "Impact winter lasting years",
                "Mass starvation (billions affected)",
                "Ocean ecosystem collapse",
                "Acid rain across continents",
                "Breakdown of global supply chains",
                "Mass species extinction",
            ];
        } else {
            severity = "extinction";
            agriculturalImpact = "Complete cessation of photosynthesis";
            globalEffects = [
                "Global temperature drop of 15-20°C",
                "Darkness lasting months to years",
                "Mass extinction event (>75% species)",
                "Ocean dead zones expanding",
                "Complete agricultural failure",
                "Civilization collapse",
                "Recovery timeframe: millions of years",
            ];
        }

        // Timeline phases
        const timelinePhases = this.generateTimelinePhases(
            diameterKm,
            atmosphericDuration
        );

        return {
            asteroidDiameter: diameterKm,
            impactEnergy: energyMT,
            dustVolume,
            atmosphericDuration,
            temperatureDrop,
            sunlightReduction,
            agriculturalImpact,
            globalEffects,
            timelinePhases,
            severity,
        };
    }

    private static generateTimelinePhases(
        diameterKm: number,
        totalMonths: number
    ): ClimateImpactData["timelinePhases"] {
        if (diameterKm < 0.05) {
            return [
                {
                    phase: "Immediate (0-24 hours)",
                    timeframe: "First day",
                    effects: [
                        "Dust plume reaches stratosphere",
                        "Local air quality alerts",
                    ],
                },
                {
                    phase: "Short-term (1-7 days)",
                    timeframe: "First week",
                    effects: ["Dust dispersal begins", "Atmospheric cleanup"],
                },
            ];
        } else if (diameterKm < 0.5) {
            return [
                {
                    phase: "Impact Day (0-24 hours)",
                    timeframe: "First day",
                    effects: [
                        "Massive dust injection into stratosphere",
                        "Regional temperature spike from fires",
                        "Atmospheric shockwave circles globe",
                    ],
                },
                {
                    phase: "First Week",
                    timeframe: "1-7 days",
                    effects: [
                        "Global dust dispersal begins",
                        "Temperature starts dropping",
                        "Sunlight noticeably dimmed",
                    ],
                },
                {
                    phase: "First Month",
                    timeframe: "1-4 weeks",
                    effects: [
                        "Peak dust concentration",
                        "Maximum sunlight reduction",
                        "Crop damage becomes evident",
                    ],
                },
                {
                    phase: "Recovery Phase",
                    timeframe: `${Math.floor(
                        totalMonths / 2
                    )}-${totalMonths} months`,
                    effects: [
                        "Dust gradually settles",
                        "Temperature normalizes",
                        "Ecosystem recovery begins",
                    ],
                },
            ];
        } else {
            // Major impact timeline
            return [
                {
                    phase: "Impact Event (Hour 0)",
                    timeframe: "Immediate",
                    effects: [
                        "Vaporization of impact site",
                        "Ejecta blanket formation",
                        "Global seismic shockwave",
                        "Atmospheric compression heating",
                    ],
                },
                {
                    phase: "First Day",
                    timeframe: "0-24 hours",
                    effects: [
                        "Global firestorms from re-entering ejecta",
                        "Atmospheric dust reaches 40km altitude",
                        "Temperature spike from infrared radiation",
                        "Initial die-off begins",
                    ],
                },
                {
                    phase: "First Week - Impact Winter Onset",
                    timeframe: "1-7 days",
                    effects: [
                        "Sunlight reduced by 50-90%",
                        "Temperature drops 5-10°C",
                        "Photosynthesis severely impaired",
                        "Acid rain begins",
                    ],
                },
                {
                    phase: "First Month - Peak Crisis",
                    timeframe: "1-4 weeks",
                    effects: [
                        "Maximum darkness and cold",
                        "Widespread plant death",
                        "Ocean surface cooling",
                        "Food chain collapse initiates",
                    ],
                },
                {
                    phase: "First Year - Sustained Winter",
                    timeframe: "1-12 months",
                    effects: [
                        "Persistent cold and darkness",
                        "Mass starvation",
                        "Ocean ecosystem breakdown",
                        "Societal collapse",
                    ],
                },
                {
                    phase: "Long-term Recovery",
                    timeframe: `1-${Math.floor(totalMonths / 12)} years`,
                    effects: [
                        "Gradual atmospheric clearing",
                        "Slow temperature recovery",
                        "Ecosystem restructuring",
                        "Surviving species adaptation",
                    ],
                },
            ];
        }
    }

    /**
     * Get historical climate impact comparison
     */
    static getHistoricalComparison(diameterKm: number): string {
        if (diameterKm < 0.02) {
            return "Similar to: Large volcanic eruption (Mount Pinatubo 1991) - temporary 0.5°C global cooling";
        } else if (diameterKm < 0.1) {
            return "Similar to: Tambora eruption (1815) - 'Year Without Summer', global crop failures";
        } else if (diameterKm < 0.5) {
            return "Similar to: Toba supervolcano (74,000 years ago) - volcanic winter, human population bottleneck";
        } else if (diameterKm < 2) {
            return "Beyond recorded history: Would exceed any volcanic event in human history";
        } else {
            return "Similar to: Chicxulub impact (65 million years ago) - Dinosaur extinction, 75% of species died";
        }
    }

    /**
     * Get mitigation strategies
     */
    static getMitigationStrategies(severity: string): string[] {
        const strategies: Record<string, string[]> = {
            minimal: [
                "Monitor air quality",
                "Prepare for temporary weather changes",
            ],
            moderate: [
                "Stockpile food reserves (6-12 months)",
                "Develop emergency agricultural plans",
                "Prepare greenhouse farming infrastructure",
                "Coordinate international aid",
            ],
            severe: [
                "Massive food stockpiling (multi-year supply)",
                "Underground/protected agriculture",
                "Global coordination of resources",
                "Prepare for mass migration",
                "Establish emergency governments",
            ],
            catastrophic: [
                "Deep underground facilities",
                "Sealed environment agriculture",
                "Genetic seed banks",
                "Population preservation protocols",
                "Long-term sustainability planning",
            ],
            extinction: [
                "Deep underground survival bunkers",
                "Self-sustaining closed ecosystems",
                "Genetic repositories for all species",
                "Space-based human colonies (if time permits)",
                "Focus on species preservation",
            ],
        };

        return strategies[severity] || strategies.minimal;
    }
}
