"use client";

/**
 * Orbital Mechanics Service
 * Implements Keplerian orbital parameters for asteroid trajectory calculations
 * Based on NASA's orbital mechanics resources
 */

export interface KeplerianElements {
    semiMajorAxis: number; // AU
    eccentricity: number;
    inclination: number; // degrees
    longitudeOfAscendingNode: number; // degrees
    argumentOfPerihelion: number; // degrees
    meanAnomaly: number; // degrees
    epoch: number; // Julian Date
}

export interface OrbitalPosition {
    x: number; // AU
    y: number; // AU
    z: number; // AU
    vx: number; // AU/day
    vy: number; // AU/day
    vz: number; // AU/day
}

export interface TrajectoryPoint {
    position: { x: number; y: number; z: number };
    velocity: { vx: number; vy: number; vz: number };
    time: number;
    distance: number; // Distance from Earth in AU
}

export class OrbitalMechanics {
    private static readonly AU_TO_KM = 149597870.7; // 1 AU in kilometers
    private static readonly EARTH_RADIUS_KM = 6371; // Earth radius in km
    private static readonly G = 6.6743e-11; // Gravitational constant
    private static readonly SOLAR_MASS = 1.989e30; // kg
    private static readonly EARTH_MASS = 5.972e24; // kg

    /**
     * Convert Keplerian elements to Cartesian coordinates
     */
    static keplerianToCartesian(
        elements: KeplerianElements,
        julianDate: number
    ): OrbitalPosition {
        const {
            semiMajorAxis: a,
            eccentricity: e,
            inclination: i,
            longitudeOfAscendingNode: Omega,
            argumentOfPerihelion: omega,
            meanAnomaly: M,
            epoch,
        } = elements;

        // Convert angles to radians
        const iRad = (i * Math.PI) / 180;
        const OmegaRad = (Omega * Math.PI) / 180;
        const omegaRad = (omega * Math.PI) / 180;
        const MRad = (M * Math.PI) / 180;

        // Time since epoch
        const dt = julianDate - epoch;

        // Mean motion (radians per day)
        const n = Math.sqrt(1 / (a * a * a)) * (2 * Math.PI); // Assuming GM_sun = 1 in AU^3/day^2

        // Mean anomaly at given time
        const M_t = MRad + n * dt;

        // Solve Kepler's equation for eccentric anomaly (E)
        let E = M_t;
        for (let iter = 0; iter < 10; iter++) {
            E = M_t + e * Math.sin(E);
        }

        // True anomaly
        const nu =
            2 *
            Math.atan2(
                Math.sqrt(1 + e) * Math.sin(E / 2),
                Math.sqrt(1 - e) * Math.cos(E / 2)
            );

        // Distance from sun
        const r = a * (1 - e * Math.cos(E));

        // Position in orbital plane
        const xOrbital = r * Math.cos(nu);
        const yOrbital = r * Math.sin(nu);

        // Velocity in orbital plane
        const vFactor = Math.sqrt(1 / (a * (1 - e * e)));
        const vxOrbital = -vFactor * Math.sin(nu);
        const vyOrbital = vFactor * (e + Math.cos(nu));

        // Rotate to ecliptic coordinates
        const cosOmega = Math.cos(OmegaRad);
        const sinOmega = Math.sin(OmegaRad);
        const cosomega = Math.cos(omegaRad);
        const sinomega = Math.sin(omegaRad);
        const cosi = Math.cos(iRad);
        const sini = Math.sin(iRad);

        const x =
            (cosOmega * cosomega - sinOmega * sinomega * cosi) * xOrbital +
            (-cosOmega * sinomega - sinOmega * cosomega * cosi) * yOrbital;
        const y =
            (sinOmega * cosomega + cosOmega * sinomega * cosi) * xOrbital +
            (-sinOmega * sinomega + cosOmega * cosomega * cosi) * yOrbital;
        const z = sinomega * sini * xOrbital + cosomega * sini * yOrbital;

        const vx =
            (cosOmega * cosomega - sinOmega * sinomega * cosi) * vxOrbital +
            (-cosOmega * sinomega - sinOmega * cosomega * cosi) * vyOrbital;
        const vy =
            (sinOmega * cosomega + cosOmega * sinomega * cosi) * vxOrbital +
            (-sinOmega * sinomega + cosOmega * cosomega * cosi) * vyOrbital;
        const vz = sinomega * sini * vxOrbital + cosomega * sini * vyOrbital;

        return { x, y, z, vx, vy, vz };
    }

    /**
     * Calculate orbital trajectory over time
     */
    static calculateTrajectory(
        elements: KeplerianElements,
        startJD: number,
        days: number,
        steps: number = 100
    ): TrajectoryPoint[] {
        const trajectory: TrajectoryPoint[] = [];
        const stepSize = days / steps;

        for (let i = 0; i <= steps; i++) {
            const jd = startJD + i * stepSize;
            const pos = this.keplerianToCartesian(elements, jd);

            // Calculate distance from Earth (assuming Earth at [1, 0, 0] as approximation)
            const earthX = Math.cos(((jd - 2451545.0) * 2 * Math.PI) / 365.25);
            const earthY = Math.sin(((jd - 2451545.0) * 2 * Math.PI) / 365.25);
            const earthZ = 0;

            const distance = Math.sqrt(
                Math.pow(pos.x - earthX, 2) +
                    Math.pow(pos.y - earthY, 2) +
                    Math.pow(pos.z - earthZ, 2)
            );

            trajectory.push({
                position: { x: pos.x, y: pos.y, z: pos.z },
                velocity: { vx: pos.vx, vy: pos.vy, vz: pos.vz },
                time: jd,
                distance: distance,
            });
        }

        return trajectory;
    }

    /**
     * Calculate close approach data
     */
    static findCloseApproaches(
        trajectory: TrajectoryPoint[],
        threshold: number = 0.05
    ): TrajectoryPoint[] {
        return trajectory.filter((point) => point.distance < threshold);
    }

    /**
     * Calculate impact energy in megatons TNT
     */
    static calculateImpactEnergy(mass: number, velocityKmS: number): number {
        // Kinetic energy: KE = 1/2 * m * v^2
        const massKg = mass * 1000; // Convert to kg if in metric tons
        const velocityMS = velocityKmS * 1000; // Convert to m/s
        const energyJoules = 0.5 * massKg * velocityMS * velocityMS;

        // Convert to megatons TNT (1 MT = 4.184 × 10^15 J)
        const megatons = energyJoules / 4.184e15;

        return megatons;
    }

    /**
     * Calculate asteroid mass from diameter
     */
    static calculateMass(diameterKm: number, density: number = 2000): number {
        // Assuming spherical asteroid
        // Volume = (4/3) * π * r^3
        const radiusKm = diameterKm / 2;
        const volumeKm3 = (4 / 3) * Math.PI * Math.pow(radiusKm, 3);
        const volumeM3 = volumeKm3 * 1e9; // Convert km³ to m³
        const massKg = volumeM3 * density;
        const massMetricTons = massKg / 1000;

        return massMetricTons;
    }

    /**
     * Calculate crater diameter (Holsapple-Schmidt scaling)
     */
    static calculateCraterDiameter(
        diameterKm: number,
        velocityKmS: number,
        density: number = 2000,
        impactAngle: number = 45
    ): number {
        const mass = this.calculateMass(diameterKm, density);
        const energy = this.calculateImpactEnergy(mass, velocityKmS);

        // Simplified crater scaling (actual formula is more complex)
        // D_crater ≈ D_asteroid * (velocity / 12.6)^0.33 * sin(angle)^0.33
        const angleFactor = Math.pow(
            Math.sin((impactAngle * Math.PI) / 180),
            0.33
        );
        const velocityFactor = Math.pow(velocityKmS / 12.6, 0.33);
        const craterDiameter = diameterKm * 20 * velocityFactor * angleFactor;

        return craterDiameter;
    }

    /**
     * Calculate orbital period in days
     */
    static calculateOrbitalPeriod(semiMajorAxis: number): number {
        // Kepler's third law: T² = a³ (in AU and years)
        const periodYears = Math.pow(semiMajorAxis, 1.5);
        const periodDays = periodYears * 365.25;

        return periodDays;
    }

    /**
     * Calculate perihelion and aphelion distances
     */
    static calculateApsides(
        semiMajorAxis: number,
        eccentricity: number
    ): { perihelion: number; aphelion: number } {
        const perihelion = semiMajorAxis * (1 - eccentricity);
        const aphelion = semiMajorAxis * (1 + eccentricity);

        return { perihelion, aphelion };
    }

    /**
     * Convert NASA NEO orbital data to Keplerian elements
     */
    static parseNASAOrbitalData(orbitalData: any): KeplerianElements {
        return {
            semiMajorAxis: parseFloat(orbitalData.semi_major_axis) || 1.0,
            eccentricity: parseFloat(orbitalData.eccentricity) || 0.1,
            inclination: parseFloat(orbitalData.inclination) || 0,
            longitudeOfAscendingNode:
                parseFloat(orbitalData.ascending_node_longitude) || 0,
            argumentOfPerihelion:
                parseFloat(orbitalData.perihelion_argument) || 0,
            meanAnomaly: parseFloat(orbitalData.mean_anomaly) || 0,
            epoch: parseFloat(orbitalData.epoch_osculation) || 2460000.5,
        };
    }

    /**
     * Calculate minimum orbit intersection distance (MOID)
     */
    static calculateMOID(elements: KeplerianElements): number {
        // Simplified MOID calculation
        // Actual calculation requires complex orbital mechanics
        const { perihelion } = this.calculateApsides(
            elements.semiMajorAxis,
            elements.eccentricity
        );
        const earthOrbit = 1.0; // AU

        return Math.abs(perihelion - earthOrbit);
    }

    /**
     * Determine threat level based on orbital parameters
     */
    static assessThreatLevel(
        elements: KeplerianElements,
        diameter: number
    ): {
        level: "minimal" | "low" | "moderate" | "high" | "critical";
        reasons: string[];
    } {
        const moid = this.calculateMOID(elements);
        const reasons: string[] = [];
        let threatScore = 0;

        // Check MOID
        if (moid < 0.05) {
            threatScore += 3;
            reasons.push(`Very close MOID: ${moid.toFixed(4)} AU`);
        } else if (moid < 0.1) {
            threatScore += 2;
            reasons.push(`Close MOID: ${moid.toFixed(4)} AU`);
        }

        // Check size
        if (diameter > 1.0) {
            threatScore += 3;
            reasons.push(
                `Large diameter: ${diameter.toFixed(
                    2
                )} km (potential global effects)`
            );
        } else if (diameter > 0.3) {
            threatScore += 2;
            reasons.push(
                `Significant size: ${diameter.toFixed(2)} km (regional damage)`
            );
        } else if (diameter > 0.05) {
            threatScore += 1;
            reasons.push(
                `Medium size: ${diameter.toFixed(2)} km (local damage)`
            );
        }

        // Check eccentricity (high eccentricity can lead to unpredictable orbits)
        if (elements.eccentricity > 0.5) {
            threatScore += 1;
            reasons.push(
                `High eccentricity: ${elements.eccentricity.toFixed(3)}`
            );
        }

        // Determine level
        if (threatScore >= 5) return { level: "critical", reasons };
        if (threatScore >= 4) return { level: "high", reasons };
        if (threatScore >= 2) return { level: "moderate", reasons };
        if (threatScore >= 1) return { level: "low", reasons };
        return { level: "minimal", reasons };
    }
}
