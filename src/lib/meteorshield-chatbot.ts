"use client";

// MeteorShield AI Chatbot using raw NASA data
export interface ChatMessage {
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

export interface NEOKnowledgeBase {
    asteroids: {
        name: string;
        diameter: string;
        velocity: string;
        closeApproach: string;
        hazardous: boolean;
        description: string;
    }[];
    facts: {
        category: string;
        question: string[];
        answer: string;
    }[];
    emergencyInfo: {
        category: string;
        info: string;
    }[];
}

export class MeteorShieldChatbot {
    private static knowledgeBase: NEOKnowledgeBase = {
        asteroids: [
            {
                name: "99942 Apophis",
                diameter: "370 meters",
                velocity: "30.73 km/s",
                closeApproach: "April 13, 2029",
                hazardous: true,
                description:
                    "Apophis will pass within 31,000 km of Earth in 2029, closer than some satellites. Despite early concerns, impact risk has been ruled out for at least 100 years.",
            },
            {
                name: "101955 Bennu",
                diameter: "492 meters",
                velocity: "28.2 km/s",
                closeApproach: "September 24, 2182",
                hazardous: true,
                description:
                    "Bennu has a 1 in 2,700 chance of impacting Earth in 2182. NASA's OSIRIS-REx mission collected samples from Bennu in 2020.",
            },
            {
                name: "433 Eros",
                diameter: "16.8 km",
                velocity: "24.36 km/s",
                closeApproach: "January 31, 2012",
                hazardous: false,
                description:
                    "One of the largest near-Earth asteroids. NEAR Shoemaker spacecraft landed on Eros in 2001, the first landing on an asteroid.",
            },
            {
                name: "1950 DA",
                diameter: "1.3 km",
                velocity: "15 km/s",
                closeApproach: "March 16, 2880",
                hazardous: true,
                description:
                    "Has approximately 0.3% chance of impacting Earth in 2880. If it impacts, it would release energy equivalent to 44,800 megatons of TNT.",
            },
            {
                name: "2023 DW",
                diameter: "50 meters",
                velocity: "25 km/s",
                closeApproach: "February 14, 2046",
                hazardous: true,
                description:
                    "Small asteroid with low impact probability. Continuous monitoring by planetary defense systems.",
            },
        ],
        facts: [
            {
                category: "general",
                question: [
                    "what is neo",
                    "what are near earth objects",
                    "explain neo",
                ],
                answer: "Near-Earth Objects (NEOs) are asteroids and comets with orbits that bring them within 195 million kilometers of the Sun, meaning they can pass within 50 million km of Earth's orbit. Currently, we track over 34,000 NEOs.",
            },
            {
                category: "general",
                question: ["what is pha", "potentially hazardous asteroid"],
                answer: "Potentially Hazardous Asteroids (PHAs) are NEOs larger than 140 meters that can come within 7.5 million km of Earth's orbit. There are approximately 2,300 known PHAs being actively monitored.",
            },
            {
                category: "impact",
                question: [
                    "what happens if asteroid hits",
                    "asteroid impact",
                    "impact effects",
                ],
                answer: "An asteroid impact creates several effects: atmospheric heating during entry, massive explosion on impact (kinetic energy = ½mv²), shockwaves that can destroy buildings, potential tsunamis if ocean impact, and for large asteroids (>1km), global climate effects from dust and debris.",
            },
            {
                category: "defense",
                question: [
                    "how to stop asteroid",
                    "planetary defense",
                    "can we deflect",
                ],
                answer: "NASA's DART mission successfully demonstrated asteroid deflection in 2022 by impacting Dimorphos. Other methods include: kinetic impactors, gravity tractors, nuclear deflection (last resort), and early warning systems. The key is detecting threats years in advance.",
            },
            {
                category: "detection",
                question: [
                    "how do we find asteroids",
                    "asteroid detection",
                    "tracking",
                ],
                answer: "Asteroids are detected using ground-based telescopes (Pan-STARRS, Catalina Sky Survey) and space-based observatories (NEOWISE). We track their orbits using Keplerian elements: semi-major axis, eccentricity, inclination, and more.",
            },
            {
                category: "energy",
                question: [
                    "how much energy",
                    "explosion size",
                    "tnt equivalent",
                ],
                answer: "Impact energy is calculated as KE = ½mv². For reference: Chelyabinsk meteor (20m) = 0.5 megatons, Tunguska (60m) = 12 megatons, Chicxulub dinosaur extinction (10km) = 100 million megatons. 1 megaton = 4.184 × 10¹⁵ joules.",
            },
            {
                category: "probability",
                question: [
                    "what are the odds",
                    "impact probability",
                    "chances of impact",
                ],
                answer: "Small impacts (Chelyabinsk-size) occur every 60-100 years. City-destroying asteroids (60m+) hit every few thousand years. Civilization-threatening asteroids (1km+) impact every 500,000 years. We track all known hazardous objects.",
            },
            {
                category: "size",
                question: [
                    "how big are asteroids",
                    "asteroid size",
                    "diameter",
                ],
                answer: "NEOs range from a few meters to over 30km. Anything over 140m is considered hazardous. The largest NEO is 1036 Ganymed (38.5km). For reference: 50m can destroy a city, 1km can cause regional devastation, 10km+ can cause mass extinction.",
            },
        ],
        emergencyInfo: [
            {
                category: "evacuation",
                info: "If impact is predicted: Follow official evacuation orders immediately. Move perpendicular to impact trajectory. Avoid coastal areas if ocean impact. Bring emergency supplies: water, food, first aid, radio, flashlight.",
            },
            {
                category: "shelter",
                info: "Best shelters: Underground facilities, reinforced concrete buildings, subway systems. Stay away from windows. If outdoors during impact: Find a ditch or depression, lie flat, cover head. Shockwave travels faster than sound.",
            },
            {
                category: "supplies",
                info: "Emergency kit should include: 1 gallon water per person per day (3-day supply), non-perishable food, battery/hand-crank radio, flashlight, first aid kit, whistle, dust masks, plastic sheeting, duct tape, wrench for utilities.",
            },
            {
                category: "communication",
                info: "During emergency: Monitor FEMA alerts, local emergency broadcasts. Text instead of calling (less network congestion). Have a family communication plan. Know your local emergency sirens and alerts.",
            },
        ],
    };

    static processQuery(query: string): string {
        const lowerQuery = query.toLowerCase().trim();

        // Check for specific asteroid queries
        for (const asteroid of this.knowledgeBase.asteroids) {
            if (lowerQuery.includes(asteroid.name.toLowerCase())) {
                return (
                    `**${asteroid.name}**\n\n` +
                    `📏 Diameter: ${asteroid.diameter}\n` +
                    `⚡ Velocity: ${asteroid.velocity}\n` +
                    `📅 Close Approach: ${asteroid.closeApproach}\n` +
                    `⚠️ Hazardous: ${asteroid.hazardous ? "YES" : "NO"}\n\n` +
                    `${asteroid.description}`
                );
            }
        }

        // Check knowledge base facts
        for (const fact of this.knowledgeBase.facts) {
            for (const question of fact.question) {
                if (lowerQuery.includes(question)) {
                    return fact.answer;
                }
            }
        }

        // Check emergency info
        if (
            lowerQuery.includes("emergency") ||
            lowerQuery.includes("what should i do") ||
            lowerQuery.includes("prepare")
        ) {
            if (lowerQuery.includes("evacuat")) {
                return this.knowledgeBase.emergencyInfo.find(
                    (e) => e.category === "evacuation"
                )!.info;
            }
            if (lowerQuery.includes("shelter") || lowerQuery.includes("hide")) {
                return this.knowledgeBase.emergencyInfo.find(
                    (e) => e.category === "shelter"
                )!.info;
            }
            if (
                lowerQuery.includes("supplies") ||
                lowerQuery.includes("pack")
            ) {
                return this.knowledgeBase.emergencyInfo.find(
                    (e) => e.category === "supplies"
                )!.info;
            }
            if (
                lowerQuery.includes("communication") ||
                lowerQuery.includes("contact")
            ) {
                return this.knowledgeBase.emergencyInfo.find(
                    (e) => e.category === "communication"
                )!.info;
            }
            // General emergency response
            return (
                "🚨 **Emergency Preparedness Tips:**\n\n" +
                "1. **Evacuation**: Follow official orders, move perpendicular to trajectory\n" +
                "2. **Shelter**: Underground facilities, reinforced buildings\n" +
                "3. **Supplies**: Water, food, radio, first aid kit\n" +
                "4. **Communication**: Monitor alerts, text don't call\n\n" +
                "Ask me about specific topics: 'evacuation', 'shelter', 'supplies', or 'communication'"
            );
        }

        // Statistics queries
        if (
            lowerQuery.includes("how many") ||
            lowerQuery.includes("statistics")
        ) {
            return (
                "📊 **NEO Statistics:**\n\n" +
                "• Total NEOs tracked: 34,000+\n" +
                "• Potentially Hazardous Asteroids (PHAs): 2,300+\n" +
                "• New discoveries per year: ~3,000\n" +
                "• Close approaches next 7 days: 10-30\n" +
                "• Largest NEO: 1036 Ganymed (38.5 km)\n\n" +
                "We continuously monitor all known threats to Earth."
            );
        }

        // List asteroids
        if (
            lowerQuery.includes("list") ||
            lowerQuery.includes("show asteroids")
        ) {
            return (
                "🌠 **Notable Near-Earth Asteroids:**\n\n" +
                this.knowledgeBase.asteroids
                    .map(
                        (a, i) =>
                            `${i + 1}. **${a.name}** - ${a.diameter} - ${
                                a.closeApproach
                            }`
                    )
                    .join("\n") +
                "\n\nAsk me about any specific asteroid for detailed information!"
            );
        }

        // Help/greeting
        if (
            lowerQuery.includes("hello") ||
            lowerQuery.includes("hi") ||
            lowerQuery.includes("help") ||
            lowerQuery.length < 5
        ) {
            return (
                "👋 **Hello! I'm MeteorShield AI Assistant.**\n\n" +
                "I can help you with:\n" +
                "• Information about specific asteroids (Apophis, Bennu, etc.)\n" +
                "• NEO statistics and tracking data\n" +
                "• Impact effects and energy calculations\n" +
                "• Planetary defense strategies\n" +
                "• Emergency preparedness guidance\n\n" +
                "💬 Try asking:\n" +
                "- 'Tell me about Apophis'\n" +
                "- 'What happens if an asteroid hits?'\n" +
                "- 'How do we deflect asteroids?'\n" +
                "- 'What should I do in an emergency?'"
            );
        }

        // Default response
        return (
            "I'm not sure about that specific question. Try asking about:\n\n" +
            "🌍 **Asteroids**: Apophis, Bennu, Eros, 1950 DA\n" +
            "📊 **Topics**: NEO basics, impact effects, detection, defense\n" +
            "🚨 **Emergency**: Evacuation, shelter, supplies, communication\n" +
            "📈 **Statistics**: 'How many asteroids are there?'\n\n" +
            "Or type 'help' for more options."
        );
    }

    static getSuggestedQuestions(): string[] {
        return [
            "Tell me about Apophis",
            "What is a NEO?",
            "What happens if an asteroid hits Earth?",
            "How do we deflect asteroids?",
            "What should I do in an emergency?",
            "How many asteroids are tracked?",
            "Show me the list of asteroids",
            "What is the DART mission?",
        ];
    }
}
