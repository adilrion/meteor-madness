"use client";

import { Cartesian3, Color, JulianDate } from "cesium";

export interface MeteorEvent {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    altitude: number;
    velocity: number; // km/s
    mass: number; // kg
    timestamp: Date;
    shower?: string; // Meteor shower name (e.g., "Perseids")
}

export class MeteorUtils {
    /**
     * Convert meteor event to Cesium position
     */
    static meteorToCartesian3(meteor: MeteorEvent): Cartesian3 {
        return Cartesian3.fromDegrees(
            meteor.longitude,
            meteor.latitude,
            meteor.altitude
        );
    }

    /**
     * Get color based on meteor velocity
     */
    static getVelocityColor(velocity: number): Color {
        if (velocity < 15) return Color.BLUE;
        if (velocity < 25) return Color.GREEN;
        if (velocity < 35) return Color.YELLOW;
        if (velocity < 50) return Color.ORANGE;
        return Color.RED;
    }

    /**
     * Get color based on meteor shower
     */
    static getShowerColor(shower?: string): Color {
        const showerColors: { [key: string]: Color } = {
            Perseids: Color.GOLD,
            Geminids: Color.CYAN,
            Leonids: Color.LIME,
            Quadrantids: Color.PURPLE,
            Lyrids: Color.PINK,
            "Delta Aquarids": Color.LIGHTBLUE,
        };
        return shower ? showerColors[shower] || Color.WHITE : Color.WHITE;
    }

    /**
     * Create atmospheric entry trajectory
     */
    static createTrajectory(
        startLat: number,
        startLon: number,
        startAlt: number,
        endLat: number,
        endLon: number,
        endAlt: number = 0,
        durationSeconds: number = 5
    ) {
        const startTime = JulianDate.now();
        const endTime = JulianDate.addSeconds(
            startTime,
            durationSeconds,
            new JulianDate()
        );

        return {
            startPosition: Cartesian3.fromDegrees(startLon, startLat, startAlt),
            endPosition: Cartesian3.fromDegrees(endLon, endLat, endAlt),
            startTime,
            endTime,
        };
    }

    /**
     * Get realistic meteor shower data
     */
    static getRealisticMeteorData(): MeteorEvent[] {
        const currentDate = new Date();

        return [
            {
                id: "perseid_001",
                name: "Perseid Fireball",
                latitude: 57.0,
                longitude: -2.0,
                altitude: 120000, // 120 km
                velocity: 59.0, // km/s - typical for Perseids
                mass: 0.1, // 100g
                timestamp: new Date(currentDate.getTime() - 1000 * 60 * 30), // 30 min ago
                shower: "Perseids",
            },
            {
                id: "geminid_002",
                name: "Geminid Meteor",
                latitude: 32.0,
                longitude: -110.0,
                altitude: 95000, // 95 km
                velocity: 35.0, // km/s - typical for Geminids
                mass: 0.001, // 1g
                timestamp: new Date(currentDate.getTime() - 1000 * 60 * 15), // 15 min ago
                shower: "Geminids",
            },
            {
                id: "sporadic_003",
                name: "Sporadic Meteor",
                latitude: -23.5,
                longitude: 138.0,
                altitude: 110000, // 110 km
                velocity: 42.0, // km/s
                mass: 0.05, // 50g
                timestamp: new Date(currentDate.getTime() - 1000 * 60 * 5), // 5 min ago
            },
            {
                id: "leonid_004",
                name: "Leonid Meteor",
                latitude: 22.0,
                longitude: -158.0,
                altitude: 130000, // 130 km
                velocity: 71.0, // km/s - very fast!
                mass: 0.002, // 2g
                timestamp: new Date(), // Now
                shower: "Leonids",
            },
        ];
    }

    /**
     * Format meteor information for display
     */
    static formatMeteorInfo(meteor: MeteorEvent): string {
        const velocity = meteor.velocity.toFixed(1);
        const mass =
            meteor.mass < 0.001
                ? `${(meteor.mass * 1000).toFixed(1)}mg`
                : meteor.mass < 1
                ? `${(meteor.mass * 1000).toFixed(0)}g`
                : `${meteor.mass.toFixed(2)}kg`;

        const timeAgo = this.getTimeAgo(meteor.timestamp);

        return `${meteor.name}
Velocity: ${velocity} km/s
Mass: ${mass}
${meteor.shower ? `Shower: ${meteor.shower}` : "Sporadic"}
Detected: ${timeAgo}`;
    }

    private static getTimeAgo(timestamp: Date): string {
        const now = new Date();
        const diffMs = now.getTime() - timestamp.getTime();
        const diffMins = Math.floor(diffMs / (1000 * 60));

        if (diffMins < 1) return "Just now";
        if (diffMins < 60) return `${diffMins} min ago`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours}h ago`;
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays}d ago`;
    }
}
