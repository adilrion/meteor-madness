"use client";

export interface ResourceAllocation {
    scenario: string;
    affectedPopulation: number;
    medicalResources: {
        doctors: number;
        nurses: number;
        hospitals: number;
        ambulances: number;
        medicalSupplies: string;
    };
    rescueTeams: {
        searchAndRescue: number;
        firefighters: number;
        engineers: number;
        heavyEquipment: number;
    };
    supplies: {
        water: string;
        food: string;
        shelter: number;
        blankets: number;
        powerGenerators: number;
    };
    estimatedCost: string;
    deploymentTime: string;
    priority: "critical" | "high" | "medium" | "low";
}

export class ResourceAllocationService {
    static calculateResources(
        energyMT: number,
        populationDensity: number,
        urbanArea: boolean = true
    ): ResourceAllocation {
        // Calculate affected population
        const shockwaveRadius = this.calculateShockwaveRadius(energyMT);
        const affectedArea = Math.PI * Math.pow(shockwaveRadius, 2);
        const affectedPopulation = Math.floor(
            affectedArea * populationDensity * (urbanArea ? 1.5 : 0.5)
        );

        // Calculate casualties
        const estimatedCasualties = Math.floor(affectedPopulation * 0.3);
        const estimatedInjuries = Math.floor(affectedPopulation * 0.5);

        // Medical resources needed
        const medicalResources = {
            doctors: Math.ceil(estimatedCasualties / 50), // 1 doctor per 50 casualties
            nurses: Math.ceil(estimatedInjuries / 30), // 1 nurse per 30 injuries
            hospitals: Math.ceil(estimatedCasualties / 500), // 1 hospital per 500 casualties
            ambulances: Math.ceil(estimatedInjuries / 20), // 1 ambulance per 20 injuries
            medicalSupplies: `${Math.ceil(
                estimatedCasualties / 100
            )} tons of emergency medical supplies`,
        };

        // Rescue teams needed
        const rescueTeams = {
            searchAndRescue: Math.ceil(affectedPopulation / 1000), // 1 team per 1000 people
            firefighters: Math.ceil(affectedArea / 10), // Based on area
            engineers: Math.ceil(affectedPopulation / 5000), // Structural assessment
            heavyEquipment: Math.ceil(affectedArea / 5), // Excavators, cranes, etc.
        };

        // Supply requirements
        const supplies = {
            water: `${Math.ceil(
                (affectedPopulation * 3) / 1000
            )} thousand gallons/day`, // 3 gallons per person
            food: `${Math.ceil(
                (affectedPopulation * 2000) / 1000000
            )} million calories/day`,
            shelter: Math.ceil(affectedPopulation / 4), // Emergency shelters for 1/4 population
            blankets: affectedPopulation,
            powerGenerators: Math.ceil(affectedPopulation / 500),
        };

        // Cost estimation (billions USD)
        const immediateCost =
            (medicalResources.doctors * 200 +
                medicalResources.hospitals * 50000000 +
                rescueTeams.searchAndRescue * 100000 +
                supplies.shelter * 5000) /
            1000000000;

        const estimatedCost = `$${immediateCost.toFixed(1)}B immediate, $${(
            immediateCost * 10
        ).toFixed(1)}B total recovery`;

        // Deployment timeline
        let deploymentTime: string;
        let priority: ResourceAllocation["priority"];

        if (energyMT > 10000) {
            deploymentTime = "Immediate (0-6 hours) - National emergency";
            priority = "critical";
        } else if (energyMT > 1000) {
            deploymentTime = "Urgent (6-24 hours) - Regional emergency";
            priority = "critical";
        } else if (energyMT > 100) {
            deploymentTime = "Priority (24-48 hours) - Major disaster";
            priority = "high";
        } else if (energyMT > 10) {
            deploymentTime = "Standard (48-72 hours) - Local emergency";
            priority = "medium";
        } else {
            deploymentTime = "Routine (3-7 days) - Limited response";
            priority = "low";
        }

        let scenario: string;
        if (energyMT < 1) {
            scenario = "Minor Impact";
        } else if (energyMT < 100) {
            scenario = "Local Disaster";
        } else if (energyMT < 1000) {
            scenario = "Regional Catastrophe";
        } else if (energyMT < 10000) {
            scenario = "National Emergency";
        } else {
            scenario = "Global Crisis";
        }

        return {
            scenario,
            affectedPopulation,
            medicalResources,
            rescueTeams,
            supplies,
            estimatedCost,
            deploymentTime,
            priority,
        };
    }

    private static calculateShockwaveRadius(energyMT: number): number {
        // Severe destruction radius in km (empirical nuclear weapons formula)
        return Math.pow(energyMT, 0.33) * 2.2;
    }

    static getPrePositioningStrategy(threatLevel: string): string[] {
        const strategies: Record<string, string[]> = {
            low: [
                "Maintain standard emergency reserves",
                "Regular training exercises",
                "Update emergency communication systems",
            ],
            medium: [
                "Increase medical supply stockpiles by 50%",
                "Position emergency teams in key locations",
                "Establish temporary shelters",
                "Coordinate with regional partners",
            ],
            high: [
                "Full mobilization of national resources",
                "Evacuate high-risk zones",
                "Deploy military medical units",
                "International aid coordination",
                "Establish field hospitals",
            ],
            critical: [
                "Global emergency declaration",
                "Mass evacuation protocols",
                "Maximum resource mobilization",
                "International military cooperation",
                "Activate all emergency response agencies",
            ],
        };

        return strategies[threatLevel] || strategies.low;
    }

    static getSupplyChainPriorities(): {
        item: string;
        priority: number;
        reason: string;
    }[] {
        return [
            {
                item: "Water purification systems",
                priority: 1,
                reason: "Essential for survival within 3 days",
            },
            {
                item: "Medical supplies and antibiotics",
                priority: 2,
                reason: "Critical for treating injuries and preventing disease",
            },
            {
                item: "Emergency food rations",
                priority: 3,
                reason: "High-calorie, long shelf-life nutrition",
            },
            {
                item: "Temporary shelter materials",
                priority: 4,
                reason: "Protection from elements and aftershocks",
            },
            {
                item: "Communication equipment",
                priority: 5,
                reason: "Coordination and family reunification",
            },
            {
                item: "Power generators and fuel",
                priority: 6,
                reason: "Essential infrastructure operation",
            },
            {
                item: "Heavy rescue equipment",
                priority: 7,
                reason: "Extract survivors from debris",
            },
            {
                item: "Transportation vehicles",
                priority: 8,
                reason: "Evacuation and resource distribution",
            },
        ];
    }
}
