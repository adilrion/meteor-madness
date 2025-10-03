"use client";

export interface NEOData {
  id: string;
  name: string;
  neo_reference_id: string;
  nasa_jpl_url: string;
  absolute_magnitude_h: number;
  estimated_diameter: {
    kilometers: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
  };
  is_potentially_hazardous_asteroid: boolean;
  close_approach_data: Array<{
    close_approach_date: string;
    close_approach_date_full: string;
    epoch_date_close_approach: number;
    relative_velocity: {
      kilometers_per_second: string;
      kilometers_per_hour: string;
      miles_per_hour: string;
    };
    miss_distance: {
      astronomical: string;
      lunar: string;
      kilometers: string;
      miles: string;
    };
    orbiting_body: string;
  }>;
  orbital_data: {
    orbit_id: string;
    orbit_determination_date: string;
    first_observation_date: string;
    last_observation_date: string;
    data_arc_in_days: number;
    observations_used: number;
    orbit_uncertainty: string;
    minimum_orbit_intersection: string;
    jupiter_tisserand_invariant: string;
    epoch_osculation: string;
    eccentricity: string;
    semi_major_axis: string;
    inclination: string;
    ascending_node_longitude: string;
    orbital_period: string;
    perihelion_distance: string;
    aphelion_distance: string;
    perihelion_argument: string;
    aphelion_argument: string;
    mean_anomaly: string;
    mean_motion: string;
  };
}

export interface NEOAPIResponse {
  links: {
    next?: string;
    prev?: string;
    self: string;
  };
  element_count: number;
  near_earth_objects: {
    [date: string]: NEOData[];
  };
}

export class NASANEOService {
  private static readonly API_BASE = "https://api.nasa.gov/neo/rest/v1";
  private static readonly API_KEY = "DEMO_KEY"; // Replace with your NASA API key

  /**
   * Get Near Earth Objects for a date range
   */
  static async getNEOsByDateRange(startDate: string, endDate: string): Promise<NEOData[]> {
    try {
      const response = await fetch(
        `${this.API_BASE}/feed?start_date=${startDate}&end_date=${endDate}&api_key=${this.API_KEY}`
      );

      if (!response.ok) {
        console.log("NASA API response not ok:", response.status);
        return this.getFallbackNEOData();
      }

      const data: NEOAPIResponse = await response.json();

      // Check if the response has the expected structure
      if (!data || !data.near_earth_objects) {
        console.log("Invalid NASA API response structure:", data);
        return this.getFallbackNEOData();
      }

      // Flatten NEOs from all dates
      const allNEOs: NEOData[] = [];
      const nearEarthObjects = data.near_earth_objects;

      if (nearEarthObjects && typeof nearEarthObjects === "object") {
        Object.values(nearEarthObjects).forEach((neos) => {
          if (Array.isArray(neos)) {
            allNEOs.push(...neos);
          }
        });
      }

      return allNEOs;
    } catch (error) {
      console.error("Error fetching NEO data:", error);
      return this.getFallbackNEOData();
    }
  }

  /**
   * Get detailed information about a specific NEO
   */
  static async getNEODetails(neoId: string): Promise<NEOData | null> {
    try {
      const response = await fetch(`${this.API_BASE}/neo/${neoId}?api_key=${this.API_KEY}`);

      if (!response.ok) {
        throw new Error(`NASA API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching NEO details:", error);
      return null;
    }
  }

  /**
   * Browse all NEOs with pagination
   */
  static async browseNEOs(
    page: number = 0,
    size: number = 20
  ): Promise<{
    neos: NEOData[];
    page: {
      size: number;
      total_elements: number;
      total_pages: number;
      number: number;
    };
  }> {
    try {
      const response = await fetch(
        `${this.API_BASE}/neo/browse?page=${page}&size=${size}&api_key=${this.API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`NASA API error: ${response.status}`);
      }

      const data = await response.json();

      // Validate response structure
      if (!data || !data.near_earth_objects || !data.page) {
        throw new Error("Invalid NASA API response structure");
      }

      return {
        neos: Array.isArray(data.near_earth_objects) ? data.near_earth_objects : [],
        page: data.page,
      };
    } catch (error) {
      console.error("Error browsing NEOs:", error);
      return {
        neos: this.getFallbackNEOData(),
        page: {
          size: 20,
          total_elements: 5,
          total_pages: 1,
          number: 0,
        },
      };
    }
  }

  /**
   * Get NEOs approaching in the next N days
   */
  static async getUpcomingNEOs(days: number = 30): Promise<NEOData[]> {
    const startDate = new Date().toISOString().split("T")[0];
    const endDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    return this.getNEOsByDateRange(startDate, endDate);
  }

  /**
   * Convert NASA NEO data to our internal asteroid format
   */
  static convertNEOToAsteroid(neo: NEOData): {
    id: string;
    name: string;
    orbitRadius: number;
    eccentricity: number;
    inclination: number;
    orbitSpeed: number;
    size: number;
    hazardLevel: "low" | "medium" | "high" | "critical";
    closeApproachDate?: Date;
    closeApproachDistance?: number;
    velocity: number;
    absoluteMagnitude: number;
    description: string;
  } {
    // Safely extract orbital data with fallbacks
    const semiMajorAxis = neo.orbital_data?.semi_major_axis
      ? parseFloat(neo.orbital_data.semi_major_axis) || 1.0
      : 1.0;
    const eccentricity = neo.orbital_data?.eccentricity
      ? parseFloat(neo.orbital_data.eccentricity) || 0.1
      : 0.1;
    const inclination = neo.orbital_data?.inclination
      ? parseFloat(neo.orbital_data.inclination) || 0
      : 0;
    const orbitalPeriod = neo.orbital_data?.orbital_period
      ? parseFloat(neo.orbital_data.orbital_period) || 365
      : 365;
    const estimatedDiameter = neo.estimated_diameter?.kilometers?.estimated_diameter_max || 0.1;

    // Calculate hazard level based on size, approach distance, and PHA status
    let hazardLevel: "low" | "medium" | "high" | "critical" = "low";

    if (neo.is_potentially_hazardous_asteroid) {
      if (estimatedDiameter > 1.0) {
        hazardLevel = "critical";
      } else if (estimatedDiameter > 0.5) {
        hazardLevel = "high";
      } else {
        hazardLevel = "medium";
      }
    } else {
      hazardLevel = estimatedDiameter > 0.1 ? "medium" : "low";
    }

    // Get closest approach data with null checks
    const nextApproach =
      neo.close_approach_data && Array.isArray(neo.close_approach_data)
        ? neo.close_approach_data
            .filter(
              (approach) =>
                approach?.close_approach_date && new Date(approach.close_approach_date) > new Date()
            )
            .sort(
              (a, b) =>
                new Date(a.close_approach_date).getTime() -
                new Date(b.close_approach_date).getTime()
            )[0]
        : undefined;

    return {
      id: neo.id,
      name: neo.name,
      orbitRadius: semiMajorAxis,
      eccentricity,
      inclination,
      orbitSpeed: 360 / orbitalPeriod, // degrees per day
      size: Math.max(estimatedDiameter / 1000, 0.001), // Convert to our scale
      hazardLevel,
      closeApproachDate: nextApproach ? new Date(nextApproach.close_approach_date) : undefined,
      closeApproachDistance: nextApproach?.miss_distance?.astronomical
        ? parseFloat(nextApproach.miss_distance.astronomical)
        : undefined,
      velocity: nextApproach?.relative_velocity?.kilometers_per_second
        ? parseFloat(nextApproach.relative_velocity.kilometers_per_second)
        : 20,
      absoluteMagnitude: neo.absolute_magnitude_h || 20,
      description: `${
        neo.is_potentially_hazardous_asteroid ? "Potentially Hazardous " : ""
      }Near-Earth Asteroid. Estimated diameter: ${estimatedDiameter.toFixed(2)} km.`,
    };
  }

  /**
   * Fallback NEO data when API is unavailable
   */
  private static getFallbackNEOData(): NEOData[] {
    return [
      {
        id: "2099942",
        name: "99942 Apophis (2004 MN4)",
        neo_reference_id: "2099942",
        nasa_jpl_url: "http://ssd.jpl.nasa.gov/sbdb.cgi?sstr=2099942",
        absolute_magnitude_h: 19.7,
        estimated_diameter: {
          kilometers: {
            estimated_diameter_min: 0.27,
            estimated_diameter_max: 0.61,
          },
        },
        is_potentially_hazardous_asteroid: true,
        close_approach_data: [
          {
            close_approach_date: "2029-04-13",
            close_approach_date_full: "2029-Apr-13 21:46",
            epoch_date_close_approach: 1871443560000,
            relative_velocity: {
              kilometers_per_second: "30.73",
              kilometers_per_hour: "110628.33",
              miles_per_hour: "68733.13",
            },
            miss_distance: {
              astronomical: "0.0002548298",
              lunar: "99.1295957",
              kilometers: "38138.635",
              miles: "23696.327",
            },
            orbiting_body: "Earth",
          },
        ],
        orbital_data: {
          orbit_id: "JPL 179",
          orbit_determination_date: "2023-04-08 06:22:07",
          first_observation_date: "2004-06-19",
          last_observation_date: "2023-03-28",
          data_arc_in_days: 6857,
          observations_used: 1888,
          orbit_uncertainty: "0",
          minimum_orbit_intersection: ".000245913",
          jupiter_tisserand_invariant: "5.447",
          epoch_osculation: "2460000.5",
          eccentricity: ".1910838095619468",
          semi_major_axis: ".9224006173527094",
          inclination: "3.33165772579699",
          ascending_node_longitude: "204.4382870574846",
          orbital_period: "323.6009737842754",
          perihelion_distance: ".7460484669135901",
          aphelion_distance: "1.098752767792429",
          perihelion_argument: "126.3967426217084",
          aphelion_argument: "306.3967426217084",
          mean_anomaly: "21.2830645430988",
          mean_motion: "1.112077897",
        },
      },
    ];
  }

  /**
   * Get statistics about NEO data
   */
  static async getNEOStatistics(): Promise<{
    total_neo_count: number;
    potentially_hazardous_count: number;
    size_categories: {
      small: number; // < 50m
      medium: number; // 50m - 300m
      large: number; // 300m - 1km
      very_large: number; // > 1km
    };
  }> {
    try {
      const response = await fetch(`${this.API_BASE}/neo/stats?api_key=${this.API_KEY}`);

      if (!response.ok) {
        throw new Error(`NASA API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching NEO statistics:", error);
      return {
        total_neo_count: 34000,
        potentially_hazardous_count: 2300,
        size_categories: {
          small: 28000,
          medium: 4500,
          large: 1200,
          very_large: 300,
        },
      };
    }
  }

  /**
   * Search NEOs by name or ID
   */
  static async searchNEOs(query: string): Promise<NEOData[]> {
    // Note: NASA API doesn't have a direct search endpoint
    // This would typically be implemented with a local cache/database
    // For now, we'll browse and filter
    try {
      const { neos } = await this.browseNEOs(0, 100);
      if (!Array.isArray(neos)) {
        return [];
      }
      return neos.filter(
        (neo) => neo?.name?.toLowerCase()?.includes(query.toLowerCase()) || neo?.id?.includes(query)
      );
    } catch (error) {
      console.error("Error searching NEOs:", error);
      return [];
    }
  }
}
