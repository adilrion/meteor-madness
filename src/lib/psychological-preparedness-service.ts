"use client";

export interface PreparednessChecklist {
    category: string;
    items: {
        task: string;
        completed: boolean;
        priority: "critical" | "high" | "medium";
    }[];
}

export interface StressManagement {
    technique: string;
    description: string;
    duration: string;
    effectiveness: "high" | "medium";
}

export class PsychologicalPreparednessService {
    static getEmergencyChecklist(): PreparednessChecklist[] {
        return [
            {
                category: "🏠 Home Preparedness",
                items: [
                    {
                        task: "Create family emergency communication plan",
                        completed: false,
                        priority: "critical",
                    },
                    {
                        task: "Identify safe rooms in your home (basement, interior rooms)",
                        completed: false,
                        priority: "critical",
                    },
                    {
                        task: "Stock 72-hour emergency supply kit",
                        completed: false,
                        priority: "critical",
                    },
                    {
                        task: "Know locations of utility shut-offs (gas, water, electric)",
                        completed: false,
                        priority: "high",
                    },
                    {
                        task: "Secure heavy furniture and objects",
                        completed: false,
                        priority: "high",
                    },
                    {
                        task: "Keep important documents in waterproof container",
                        completed: false,
                        priority: "medium",
                    },
                ],
            },
            {
                category: "🎒 Emergency Kit",
                items: [
                    {
                        task: "Water (1 gallon per person per day, 3-day supply)",
                        completed: false,
                        priority: "critical",
                    },
                    {
                        task: "Non-perishable food (3-day supply)",
                        completed: false,
                        priority: "critical",
                    },
                    {
                        task: "Battery-powered or hand-crank radio (NOAA Weather Radio)",
                        completed: false,
                        priority: "critical",
                    },
                    {
                        task: "Flashlight and extra batteries",
                        completed: false,
                        priority: "critical",
                    },
                    {
                        task: "First aid kit",
                        completed: false,
                        priority: "high",
                    },
                    {
                        task: "Whistle to signal for help",
                        completed: false,
                        priority: "high",
                    },
                    {
                        task: "Dust masks, plastic sheeting, duct tape",
                        completed: false,
                        priority: "high",
                    },
                    {
                        task: "Prescription medications (7-day supply)",
                        completed: false,
                        priority: "high",
                    },
                    {
                        task: "Cash and important documents",
                        completed: false,
                        priority: "medium",
                    },
                ],
            },
            {
                category: "📱 Communication Plan",
                items: [
                    {
                        task: "Establish out-of-state family contact",
                        completed: false,
                        priority: "critical",
                    },
                    {
                        task: "Program emergency contacts in all phones",
                        completed: false,
                        priority: "critical",
                    },
                    {
                        task: "Know your local emergency meeting point",
                        completed: false,
                        priority: "high",
                    },
                    {
                        task: "Sign up for local emergency alerts (FEMA, local)",
                        completed: false,
                        priority: "high",
                    },
                    {
                        task: "Keep phone chargers and portable power banks ready",
                        completed: false,
                        priority: "medium",
                    },
                ],
            },
            {
                category: "🗺️ Evacuation Planning",
                items: [
                    {
                        task: "Know multiple evacuation routes from your area",
                        completed: false,
                        priority: "critical",
                    },
                    {
                        task: "Identify local emergency shelters",
                        completed: false,
                        priority: "critical",
                    },
                    {
                        task: "Keep vehicle gas tank at least half full",
                        completed: false,
                        priority: "high",
                    },
                    {
                        task: "Have pet evacuation plan (carrier, supplies, vet records)",
                        completed: false,
                        priority: "medium",
                    },
                ],
            },
        ];
    }

    static getStressManagementTechniques(): StressManagement[] {
        return [
            {
                technique: "4-7-8 Breathing",
                description:
                    "Inhale for 4 seconds, hold for 7 seconds, exhale for 8 seconds. Activates parasympathetic nervous system to reduce panic.",
                duration: "2-5 minutes",
                effectiveness: "high",
            },
            {
                technique: "5-4-3-2-1 Grounding",
                description:
                    "Identify 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste. Anchors you to present moment during panic.",
                duration: "3-5 minutes",
                effectiveness: "high",
            },
            {
                technique: "Progressive Muscle Relaxation",
                description:
                    "Tense and release each muscle group (toes to head) for 5 seconds each. Releases physical stress and anxiety.",
                duration: "10-15 minutes",
                effectiveness: "high",
            },
            {
                technique: "Box Breathing",
                description:
                    "Inhale 4 seconds, hold 4 seconds, exhale 4 seconds, hold 4 seconds. Used by Navy SEALs for stress control.",
                duration: "2-5 minutes",
                effectiveness: "high",
            },
            {
                technique: "Mental Safe Place",
                description:
                    "Visualize a calm, safe location in detail (sights, sounds, smells). Mental escape during high stress.",
                duration: "5-10 minutes",
                effectiveness: "medium",
            },
            {
                technique: "Action Planning",
                description:
                    "Write down 3 concrete actions you can take right now. Converts helplessness into empowerment.",
                duration: "5 minutes",
                effectiveness: "high",
            },
        ];
    }

    static getPanicReductionProtocol(): {
        phase: string;
        actions: string[];
    }[] {
        return [
            {
                phase: "Immediate (First 60 seconds)",
                actions: [
                    "STOP - Pause any reactive behavior",
                    "Find a safe location away from windows/falling objects",
                    "Start 4-7-8 breathing immediately",
                    "If with others, hold hands or physical contact for grounding",
                ],
            },
            {
                phase: "Stabilization (1-5 minutes)",
                actions: [
                    "Continue controlled breathing",
                    "Scan your body - identify injuries",
                    "Use 5-4-3-2-1 grounding technique",
                    "Speak calmly if others are present",
                    "Avoid making major decisions",
                ],
            },
            {
                phase: "Action Phase (5-30 minutes)",
                actions: [
                    "Assess immediate threats (fire, gas leak, structural damage)",
                    "Check on family members/neighbors",
                    "Turn on battery radio for official information",
                    "Do NOT use phone unless emergency (preserve networks)",
                    "Follow your prepared emergency plan",
                ],
            },
            {
                phase: "Sustained Response (30+ minutes)",
                actions: [
                    "Continue monitoring official emergency broadcasts",
                    "Ration supplies calmly",
                    "Maintain routines as much as possible (eating, sleeping)",
                    "Help others if safe to do so",
                    "Document important information",
                    "Practice stress management every 2-3 hours",
                ],
            },
        ];
    }

    static getMentalHealthResources(): {
        resource: string;
        contact: string;
        description: string;
    }[] {
        return [
            {
                resource: "SAMHSA Disaster Distress Helpline",
                contact: "Call: 1-800-985-5990 | Text: TalkWithUs to 66746",
                description:
                    "24/7 crisis counseling and support for disaster survivors",
            },
            {
                resource: "National Suicide Prevention Lifeline",
                contact: "Call: 988",
                description: "24/7 confidential support for emotional distress",
            },
            {
                resource: "Crisis Text Line",
                contact: "Text: HOME to 741741",
                description: "Free 24/7 text support with trained counselors",
            },
            {
                resource: "Red Cross Emergency Social Services",
                contact: "Local Red Cross chapter",
                description:
                    "Mental health support, family reunification, shelter",
            },
            {
                resource: "Psychological First Aid (Self-Help)",
                contact: "www.nctsn.org/resources",
                description:
                    "Evidence-based approach to helping disaster survivors",
            },
        ];
    }

    static getChildrenGuidance(): string[] {
        return [
            "Stay calm yourself - children mirror adult emotions",
            "Provide honest, age-appropriate information without graphic details",
            "Maintain routines as much as possible (meals, bedtime)",
            "Allow children to express feelings through talking, drawing, play",
            "Limit media exposure to disaster coverage",
            "Reassure them of safety and your presence",
            "Watch for regression (bedwetting, clinginess) - this is normal",
            "Involve them in preparedness activities (age-appropriate)",
        ];
    }

    static getLongTermCoping(): string[] {
        return [
            "Expect emotional ups and downs for weeks/months",
            "Maintain social connections - isolation worsens trauma",
            "Resume normal activities gradually",
            "Limit alcohol/substance use (impairs coping)",
            "Exercise regularly (reduces stress hormones)",
            "Seek professional help if symptoms persist >1 month",
            "Join support groups with other survivors",
            "Practice self-compassion - recovery takes time",
            "Commemorate the event appropriately when ready",
            "Find meaning through helping others recover",
        ];
    }
}
