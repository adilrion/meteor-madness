"use client";

import { MeteorEvent } from "./meteor-utils";

export interface UpcomingMeteorData extends MeteorEvent {
  impactProbability: number;
  trajectoryPoints: [number, number, number][];
  countryCode: string;
  estimatedImpactTime: Date;
  showerPeak?: Date;
  visibility: "excellent" | "good" | "fair" | "poor";
  description: string;
  magnitude: number; // Apparent brightness
  radiant: { ra: number; dec: number }; // Radiant coordinates
  zenithalHourlyRate?: number; // For meteor showers
}

export class UpcomingMeteorService {
  /**
   * Get upcoming meteor events for the next 30 days
   */
  static getUpcomingMeteors(): UpcomingMeteorData[] {
    const currentDate = new Date();

    return [
      // Perseid shower events
      {
        id: "perseid_2025_001",
        name: "Perseid Fireball Alpha",
        latitude: 40.7128,
        longitude: -74.006,
        altitude: 120000,
        velocity: 59.0,
        mass: 0.5,
        timestamp: new Date(currentDate.getTime() + 2 * 24 * 60 * 60 * 1000),
        shower: "Perseids",
        impactProbability: 0.15,
        trajectoryPoints: [],
        countryCode: "US",
        estimatedImpactTime: new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000),
        showerPeak: new Date(currentDate.getTime() + 10 * 24 * 60 * 60 * 1000),
        visibility: "excellent",
        description:
          "Bright Perseid meteor expected to produce spectacular fireball over northeastern United States",
        magnitude: -4.2,
        radiant: { ra: 46, dec: 58 },
        zenithalHourlyRate: 100,
      },

      // Geminid events
      {
        id: "geminid_2025_001",
        name: "Geminid Twin Streak",
        latitude: 51.5074,
        longitude: -0.1278,
        altitude: 110000,
        velocity: 35.0,
        mass: 0.3,
        timestamp: new Date(currentDate.getTime() + 5 * 24 * 60 * 60 * 1000),
        shower: "Geminids",
        impactProbability: 0.08,
        trajectoryPoints: [],
        countryCode: "GB",
        estimatedImpactTime: new Date(currentDate.getTime() + 12 * 24 * 60 * 60 * 1000),
        showerPeak: new Date(currentDate.getTime() + 15 * 24 * 60 * 60 * 1000),
        visibility: "good",
        description: "Moderate Geminid meteor visible from Europe, part of annual December shower",
        magnitude: -2.1,
        radiant: { ra: 112, dec: 33 },
        zenithalHourlyRate: 120,
      },

      // Leonid high-risk event
      {
        id: "leonid_2025_hazard",
        name: "Leonid Epsilon Threat",
        latitude: 35.6762,
        longitude: 139.6503,
        altitude: 130000,
        velocity: 71.0,
        mass: 2.5,
        timestamp: new Date(currentDate.getTime() + 1 * 24 * 60 * 60 * 1000),
        shower: "Leonids",
        impactProbability: 0.82,
        trajectoryPoints: [],
        countryCode: "JP",
        estimatedImpactTime: new Date(currentDate.getTime() + 3 * 24 * 60 * 60 * 1000),
        visibility: "fair",
        description:
          "HIGH RISK: Large Leonid fragment with significant impact probability over Tokyo Bay area",
        magnitude: -6.8,
        radiant: { ra: 152, dec: 22 },
      },

      // Southern hemisphere event
      {
        id: "eta_aquariid_2025",
        name: "Eta Aquariid Meteor",
        latitude: -33.8688,
        longitude: 151.2093,
        altitude: 105000,
        velocity: 66.0,
        mass: 0.8,
        timestamp: new Date(currentDate.getTime() + 8 * 24 * 60 * 60 * 1000),
        shower: "Eta Aquarids",
        impactProbability: 0.25,
        trajectoryPoints: [],
        countryCode: "AU",
        estimatedImpactTime: new Date(currentDate.getTime() + 20 * 24 * 60 * 60 * 1000),
        visibility: "good",
        description:
          "Eta Aquariid meteor from Halley's Comet debris, best viewed from Southern Hemisphere",
        magnitude: -3.5,
        radiant: { ra: 338, dec: -1 },
        zenithalHourlyRate: 50,
      },

      // South American event
      {
        id: "lyrid_2025_brazil",
        name: "Lyrid Southern Cross",
        latitude: -23.5505,
        longitude: -46.6333,
        altitude: 95000,
        velocity: 48.0,
        mass: 0.4,
        timestamp: new Date(currentDate.getTime() + 6 * 24 * 60 * 60 * 1000),
        shower: "Lyrids",
        impactProbability: 0.45,
        trajectoryPoints: [],
        countryCode: "BR",
        estimatedImpactTime: new Date(currentDate.getTime() + 8 * 24 * 60 * 60 * 1000),
        visibility: "excellent",
        description: "Medium-risk Lyrid meteor over São Paulo metropolitan area",
        magnitude: -2.8,
        radiant: { ra: 271, dec: 34 },
        zenithalHourlyRate: 18,
      },

      // European event
      {
        id: "quadrantid_2025_europe",
        name: "Quadrantid Northern Light",
        latitude: 60.1282,
        longitude: 18.6435, // Stockholm area
        altitude: 115000,
        velocity: 41.0,
        mass: 0.6,
        timestamp: new Date(currentDate.getTime() + 10 * 24 * 60 * 60 * 1000),
        shower: "Quadrantids",
        impactProbability: 0.12,
        trajectoryPoints: [],
        countryCode: "SE",
        estimatedImpactTime: new Date(currentDate.getTime() + 18 * 24 * 60 * 60 * 1000),
        visibility: "good",
        description: "Early year Quadrantid meteor over Scandinavia, part of January shower peak",
        magnitude: -1.9,
        radiant: { ra: 230, dec: 49 },
        zenithalHourlyRate: 110,
      },

      // African event
      {
        id: "southern_delta_aquariid_2025",
        name: "Delta Aquariid Sahara",
        latitude: 30.0444,
        longitude: 31.2357, // Cairo area
        altitude: 108000,
        velocity: 41.0,
        mass: 0.35,
        timestamp: new Date(currentDate.getTime() + 14 * 24 * 60 * 60 * 1000),
        shower: "Southern Delta Aquarids",
        impactProbability: 0.18,
        trajectoryPoints: [],
        countryCode: "EG",
        estimatedImpactTime: new Date(currentDate.getTime() + 25 * 24 * 60 * 60 * 1000),
        visibility: "excellent",
        description:
          "Southern Delta Aquariid meteor over North Africa, excellent desert viewing conditions",
        magnitude: -2.3,
        radiant: { ra: 340, dec: -16 },
        zenithalHourlyRate: 25,
      },

      // Canadian event
      {
        id: "draconid_2025_canada",
        name: "Draconid Aurora Shower",
        latitude: 49.2827,
        longitude: -123.1207, // Vancouver area
        altitude: 125000,
        velocity: 20.0,
        mass: 0.15,
        timestamp: new Date(currentDate.getTime() + 16 * 24 * 60 * 60 * 1000),
        shower: "Draconids",
        impactProbability: 0.05,
        trajectoryPoints: [],
        countryCode: "CA",
        estimatedImpactTime: new Date(currentDate.getTime() + 28 * 24 * 60 * 60 * 1000),
        visibility: "fair",
        description: "Slow-moving Draconid meteor from 21P/Giacobini-Zinner comet debris",
        magnitude: -1.2,
        radiant: { ra: 262, dec: 54 },
        zenithalHourlyRate: 10,
      },

      // High-risk Russian event
      {
        id: "tunguska_type_2025",
        name: "Siberian Impact Threat",
        latitude: 60.8861,
        longitude: 101.8371, // Central Siberia
        altitude: 140000,
        velocity: 25.0,
        mass: 15.0,
        timestamp: new Date(currentDate.getTime() + 4 * 24 * 60 * 60 * 1000),
        impactProbability: 0.73,
        trajectoryPoints: [],
        countryCode: "RU",
        estimatedImpactTime: new Date(currentDate.getTime() + 5 * 24 * 60 * 60 * 1000),
        visibility: "poor",
        description:
          "CRITICAL ALERT: Large asteroid fragment with high impact probability over remote Siberian region",
        magnitude: -8.5,
        radiant: { ra: 45, dec: 25 },
      },

      // Indian Ocean event
      {
        id: "sporadic_2025_indian_ocean",
        name: "Indian Ocean Bolide",
        latitude: -10.0,
        longitude: 75.0, // Indian Ocean
        altitude: 100000,
        velocity: 32.0,
        mass: 1.8,
        timestamp: new Date(currentDate.getTime() + 22 * 24 * 60 * 60 * 1000),
        impactProbability: 0.65,
        trajectoryPoints: [],
        countryCode: "IO", // Indian Ocean
        estimatedImpactTime: new Date(currentDate.getTime() + 26 * 24 * 60 * 60 * 1000),
        visibility: "poor",
        description:
          "Major bolide event predicted over Indian Ocean, potential tsunami risk if impact occurs",
        magnitude: -7.2,
        radiant: { ra: 180, dec: -20 },
      },
    ];
  }

  /**
   * Get meteors by risk level
   */
  static getMeteorsByRisk(risk: "high" | "medium" | "low"): UpcomingMeteorData[] {
    const meteors = this.getUpcomingMeteors();

    switch (risk) {
      case "high":
        return meteors.filter((m) => m.impactProbability > 0.7);
      case "medium":
        return meteors.filter((m) => m.impactProbability > 0.4 && m.impactProbability <= 0.7);
      case "low":
        return meteors.filter((m) => m.impactProbability <= 0.4);
      default:
        return meteors;
    }
  }

  /**
   * Get meteors by shower
   */
  static getMeteorsByShower(shower: string): UpcomingMeteorData[] {
    return this.getUpcomingMeteors().filter((m) => m.shower === shower);
  }

  /**
   * Get active meteor showers
   */
  static getActiveShowers(): string[] {
    const meteors = this.getUpcomingMeteors();
    const showers = meteors
      .map((m) => m.shower)
      .filter((shower): shower is string => Boolean(shower));

    return Array.from(new Set(showers));
  }

  /**
   * Get upcoming meteors by timeframe
   */
  static getMeteorsByTimeframe(days: number): UpcomingMeteorData[] {
    const cutoffDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    return this.getUpcomingMeteors().filter((m) => m.estimatedImpactTime <= cutoffDate);
  }
}
