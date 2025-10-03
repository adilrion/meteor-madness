"use client";

import { PsychologicalPreparednessService } from "@/lib/psychological-preparedness-service";
import { ResourceAllocationService } from "@/lib/resource-allocation-service";
import {
  Activity,
  AlertTriangle,
  Bot,
  Brain,
  CheckCircle2,
  Cloud,
  Heart,
  Package,
  Shield,
  Users,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";

const AIChatbot = dynamic(() => import("@/components/common/ai-chatbot"), {
  ssr: false,
});
const ClimateImpactVisualizer = dynamic(
  () => import("@/components/common/climate-impact-visualizer"),
  { ssr: false }
);

export default function SafetyCenterPage() {
  const [activeSection, setActiveSection] = useState<string>("overview");
  const [checklist, setChecklist] = useState(
    PsychologicalPreparednessService.getEmergencyChecklist()
  );

  const toggleChecklistItem = (catIdx: number, itemIdx: number) => {
    setChecklist((prev) =>
      prev.map((cat, ci) =>
        ci === catIdx
          ? {
            ...cat,
            items: cat.items.map((item, ii) =>
              ii === itemIdx
                ? {
                  ...item,
                  completed: !item.completed,
                }
                : item
            ),
          }
          : cat
      )
    );
  };

  const resourceData = ResourceAllocationService.calculateResources(
    500,
    1000,
    true
  );
  const stressTechniques =
    PsychologicalPreparednessService.getStressManagementTechniques();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center overflow-hidden bg-gradient-to-br from-blue-950 via-purple-950 to-black border-b border-purple-500/30">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="relative max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-500/50 px-4 py-2 rounded-full mb-6">
            <Shield className="w-5 h-5 text-purple-400" />
            <span className="text-purple-400 font-semibold">
              MeteorShield Safety Center
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
            Emergency Response & Preparedness
          </h1>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Comprehensive tools and resources for asteroid impact
            preparedness, emergency planning, and crisis management.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-full transition shadow-lg">
              <Bot className="inline w-5 h-5 mr-2" />
              Ask AI Assistant
            </button>
            <button className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-full transition border border-gray-700">
              <AlertTriangle className="inline w-5 h-5 mr-2" />
              Emergency Checklist
            </button>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <div className="sticky top-0 z-40 bg-black/90 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto gap-2 py-4">
            {[
              { id: "overview", label: "Overview", icon: Shield },
              {
                id: "chatbot",
                label: "AI Assistant",
                icon: Bot,
              },
              {
                id: "climate",
                label: "Climate Effects",
                icon: Cloud,
              },
              {
                id: "resources",
                label: "Resources",
                icon: Package,
              },
              {
                id: "psychology",
                label: "Mental Health",
                icon: Brain,
              },
              {
                id: "checklist",
                label: "Checklist",
                icon: CheckCircle2,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition ${activeSection === tab.id
                  ? "bg-purple-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Overview */}
        {activeSection === "overview" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: Bot,
                  title: "AI Assistant",
                  desc: "Get instant answers about asteroids and emergency procedures",
                  color: "from-blue-600 to-cyan-600",
                },
                {
                  icon: Cloud,
                  title: "Climate Modeling",
                  desc: "Understand long-term environmental impacts",
                  color: "from-purple-600 to-pink-600",
                },
                {
                  icon: Package,
                  title: "Resource Planning",
                  desc: "Emergency supply and team allocation",
                  color: "from-orange-600 to-red-600",
                },
                {
                  icon: Brain,
                  title: "Mental Health",
                  desc: "Stress management and psychological support",
                  color: "from-green-600 to-teal-600",
                },
                {
                  icon: CheckCircle2,
                  title: "Preparedness Checklist",
                  desc: "Step-by-step emergency preparation",
                  color: "from-yellow-600 to-orange-600",
                },
                {
                  icon: Heart,
                  title: "Family Safety",
                  desc: "Communication plans and meeting points",
                  color: "from-pink-600 to-rose-600",
                },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-purple-500/50 transition group"
                >
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition`}
                  >
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  label: "NEOs Tracked",
                  value: "34,000+",
                  icon: Activity,
                },
                {
                  label: "PHAs Monitored",
                  value: "2,300+",
                  icon: AlertTriangle,
                },
                {
                  label: "Safety Features",
                  value: "20+",
                  icon: Shield,
                },
                {
                  label: "Emergency Resources",
                  value: "100+",
                  icon: Users,
                },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl border border-gray-700"
                >
                  <stat.icon className="w-8 h-8 text-purple-400 mb-2" />
                  <div className="text-3xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Climate Impact */}
        {activeSection === "climate" && <ClimateImpactVisualizer />}

        {/* Resources */}
        {activeSection === "resources" && (
          <div className="space-y-6">
            <div className="bg-gray-900 p-8 rounded-3xl border border-purple-500/30">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Package className="w-8 h-8 text-purple-400" />
                Resource Allocation Calculator
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Medical Resources */}
                <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                  <h3 className="text-xl font-bold mb-4 text-blue-400">
                    Medical Resources
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">
                        Doctors Needed:
                      </span>
                      <span className="text-white font-bold">
                        {resourceData.medicalResources.doctors.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">
                        Nurses Needed:
                      </span>
                      <span className="text-white font-bold">
                        {resourceData.medicalResources.nurses.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">
                        Hospitals:
                      </span>
                      <span className="text-white font-bold">
                        {resourceData.medicalResources.hospitals}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">
                        Ambulances:
                      </span>
                      <span className="text-white font-bold">
                        {resourceData.medicalResources.ambulances}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Rescue Teams */}
                <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                  <h3 className="text-xl font-bold mb-4 text-orange-400">
                    Rescue & Recovery
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">
                        Search & Rescue Teams:
                      </span>
                      <span className="text-white font-bold">
                        {resourceData.rescueTeams.searchAndRescue.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">
                        Firefighters:
                      </span>
                      <span className="text-white font-bold">
                        {resourceData.rescueTeams.firefighters.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">
                        Engineers:
                      </span>
                      <span className="text-white font-bold">
                        {resourceData.rescueTeams.engineers.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">
                        Heavy Equipment:
                      </span>
                      <span className="text-white font-bold">
                        {resourceData.rescueTeams.heavyEquipment.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Supplies */}
                <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 md:col-span-2">
                  <h3 className="text-xl font-bold mb-4 text-green-400">
                    Emergency Supplies
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-gray-400 text-sm">
                        Water Supply
                      </div>
                      <div className="text-white font-bold">
                        {resourceData.supplies.water}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-sm">
                        Food Supply
                      </div>
                      <div className="text-white font-bold">
                        {resourceData.supplies.food}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-sm">
                        Emergency Shelters
                      </div>
                      <div className="text-white font-bold">
                        {resourceData.supplies.shelter.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-sm">
                        Blankets
                      </div>
                      <div className="text-white font-bold">
                        {resourceData.supplies.blankets.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-sm">
                        Power Generators
                      </div>
                      <div className="text-white font-bold">
                        {resourceData.supplies.powerGenerators.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-sm">
                        Estimated Cost
                      </div>
                      <div className="text-white font-bold">
                        {resourceData.estimatedCost}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`mt-6 p-4 rounded-xl border ${resourceData.priority === "critical"
                  ? "bg-red-500/20 border-red-500/50"
                  : "bg-yellow-500/20 border-yellow-500/50"
                  }`}
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle
                    className={`w-5 h-5 ${resourceData.priority === "critical" ? "text-red-400" : "text-yellow-400"}`}
                  />
                  <span className="font-bold text-white">
                    Deployment: {resourceData.deploymentTime}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Psychology */}
        {activeSection === "psychology" && (
          <div className="space-y-6">
            <div className="bg-gray-900 p-8 rounded-3xl border border-purple-500/30">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Brain className="w-8 h-8 text-purple-400" />
                Stress Management & Mental Health
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {stressTechniques.map((technique, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-800/50 p-6 rounded-xl border border-gray-700"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-purple-400">
                        {technique.technique}
                      </h3>
                      <span
                        className={`text-xs px-2 py-1 rounded ${technique.effectiveness === "high" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}
                      >
                        {technique.effectiveness ===
                          "high"
                          ? "⭐ HIGH"
                          : "MEDIUM"}
                      </span>
                    </div>
                    <p className="text-gray-300 mb-3">
                      {technique.description}
                    </p>
                    <div className="text-sm text-gray-500">
                      Duration: {technique.duration}
                    </div>
                  </div>
                ))}
              </div>

              {/* Mental Health Resources */}
              <div className="mt-8 bg-gradient-to-r from-blue-900/30 to-purple-900/30 p-6 rounded-xl border border-blue-500/30">
                <h3 className="text-xl font-bold mb-4 text-blue-400">
                  24/7 Mental Health Resources
                </h3>
                {PsychologicalPreparednessService.getMentalHealthResources().map(
                  (resource, idx) => (
                    <div
                      key={idx}
                      className="mb-4 last:mb-0"
                    >
                      <div className="font-bold text-white">
                        {resource.resource}
                      </div>
                      <div className="text-blue-300">
                        {resource.contact}
                      </div>
                      <div className="text-sm text-gray-400">
                        {resource.description}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        )}

        {/* Checklist */}
        {activeSection === "checklist" && (
          <div className="space-y-6">
            <div className="bg-gray-900 p-8 rounded-3xl border border-purple-500/30">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-green-400" />
                Emergency Preparedness Checklist
              </h2>

              {checklist.map((category, catIdx) => {
                const completedCount = category.items.filter(
                  (i) => i.completed
                ).length;
                const totalCount = category.items.length;
                const progress =
                  (completedCount / totalCount) * 100;

                return (
                  <div
                    key={catIdx}
                    className="mb-8 bg-gray-800/50 p-6 rounded-xl border border-gray-700"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-bold text-white">
                        {category.category}
                      </h3>
                      <span className="text-sm text-gray-400">
                        {completedCount}/{totalCount}{" "}
                        completed
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-700 rounded-full h-2 mb-6">
                      <div
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>

                    <div className="space-y-3">
                      {category.items.map(
                        (item, itemIdx) => (
                          <div
                            key={itemIdx}
                            className={`flex items-start gap-3 p-3 rounded-lg transition ${item.completed
                              ? "bg-green-500/10"
                              : "bg-gray-900/50"
                              }`}
                          >
                            <button
                              onClick={() =>
                                toggleChecklistItem(
                                  catIdx,
                                  itemIdx
                                )
                              }
                              className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition ${item.completed
                                ? "bg-green-500 border-green-500"
                                : "border-gray-600 hover:border-green-500"
                                }`}
                            >
                              {item.completed && (
                                <CheckCircle2 className="w-4 h-4 text-white" />
                              )}
                            </button>
                            <div className="flex-1">
                              <span
                                className={`${item.completed ? "text-gray-400 line-through" : "text-white"}`}
                              >
                                {item.task}
                              </span>
                              <span
                                className={`ml-2 text-xs px-2 py-1 rounded ${item.priority ===
                                  "critical"
                                  ? "bg-red-500/20 text-red-400"
                                  : item.priority ===
                                    "high"
                                    ? "bg-orange-500/20 text-orange-400"
                                    : "bg-yellow-500/20 text-yellow-400"
                                  }`}
                              >
                                {item.priority.toUpperCase()}
                              </span>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* AI Chatbot (Always Available) */}
      <AIChatbot />
    </div>
  );
}

