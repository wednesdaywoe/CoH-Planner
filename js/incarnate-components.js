/**
 * Incarnate Component Requirements
 * Generated from Incarnate.recipe raw data
 * Contains salvage requirements for all Incarnate powers
 */

const IncarnateComponents = {
    alpha: {
        Vigor: {
            tier1: {
                core: {
                    salvage: ["1x EnchantedSand", "1x SuperchargedCapacitor", "1x ArcaneCantrip"],
                    prerequisites: []
                },
            },
            tier2: {
                core: {
                    salvage: ["2x ArcaneCantrip", "1x GluonCompound"],
                    prerequisites: ["Vigor_Boost"]
                },
                radial: {
                    salvage: ["1x BiomorphicGoo", "1x GenomicAnalysis", "1x DimensionalPocket"],
                    prerequisites: ["Vigor_Boost"]
                }
            },
            tier3: {
                core: {
                    salvage: ["1x SuperchargedCapacitor", "1x DetailedReports", "1x AncientTexts"],
                    prerequisites: ["Vigor_Core_Boost"]
                },
                radial: {
                    salvage: ["1x SuperchargedCapacitor", "1x EnchantedSand", "1x AncientTexts"],
                    prerequisites: ["Vigor_Radial_Boost"]
                }
            },
            tier4: {
                core: {
                    salvage: ["1x MeditationTechniques", "1x DetailedReports", "1x ThaumicResonator"],
                    prerequisites: ["Vigor_Partial_Core_Revamp", "Vigor_Partial_Radial_Revamp"]
                },
                radial: {
                    salvage: ["1x DetailedReports", "1x ArcaneCantrip", "1x SelfEvolvingAlloy"],
                    prerequisites: ["Vigor_Partial_Core_Revamp", "Vigor_Partial_Radial_Revamp"]
                }
            },
        },
        Spiritual: {
            tier1: {
                core: {
                    salvage: ["1x EnchantedSand", "1x SuperchargedCapacitor", "1x ArcaneCantrip"],
                    prerequisites: []
                },
            },
            tier2: {
                core: {
                    salvage: ["2x ArcaneCantrip", "1x GluonCompound"],
                    prerequisites: ["Spiritual_Boost"]
                },
                radial: {
                    salvage: ["1x BiomorphicGoo", "1x GenomicAnalysis", "1x DimensionalPocket"],
                    prerequisites: ["Spiritual_Boost"]
                }
            },
            tier3: {
                core: {
                    salvage: ["1x SuperchargedCapacitor", "1x DetailedReports", "1x AncientTexts"],
                    prerequisites: ["Spiritual_Core_Boost"]
                },
                radial: {
                    salvage: ["1x SuperchargedCapacitor", "1x EnchantedSand", "1x AncientTexts"],
                    prerequisites: ["Spiritual_Radial_Boost"]
                }
            },
            tier4: {
                core: {
                    salvage: ["1x MeditationTechniques", "1x DetailedReports", "1x ThaumicResonator"],
                    prerequisites: ["Spiritual_Partial_Core_Revamp", "Spiritual_Partial_Radial_Revamp"]
                },
                radial: {
                    salvage: ["1x DetailedReports", "1x ArcaneCantrip", "1x SelfEvolvingAlloy"],
                    prerequisites: ["Spiritual_Partial_Core_Revamp", "Spiritual_Partial_Radial_Revamp"]
                }
            },
        },
        Resilient: {
            tier1: {
                core: {
                    salvage: ["1x BiomorphicGoo", "1x ArcaneCantrip", "1x MeditationTechniques"],
                    prerequisites: []
                },
            },
            tier2: {
                core: {
                    salvage: ["2x EnchantedSand", "1x DimensionalPocket"],
                    prerequisites: ["Resilient_Boost"]
                },
                radial: {
                    salvage: ["1x BiomorphicGoo", "1x ArcaneCantrip", "1x CytoliticInfusion"],
                    prerequisites: ["Resilient_Boost"]
                }
            },
            tier3: {
                core: {
                    salvage: ["2x EnchantedSand", "1x SuperconductiveMembrane"],
                    prerequisites: ["Resilient_Core_Boost"]
                },
                radial: {
                    salvage: ["1x MeditationTechniques", "1x ArcaneCantrip", "1x ExoticIsotope"],
                    prerequisites: ["Resilient_Radial_Boost"]
                }
            },
            tier4: {
                core: {
                    salvage: ["1x SuperchargedCapacitor", "1x DetailedReports", "1x ForbiddenTechnique"],
                    prerequisites: ["Resilient_Partial_Core_Revamp", "Resilient_Partial_Radial_Revamp"]
                },
                radial: {
                    salvage: ["1x EnchantedSand", "1x MeditationTechniques", "1x ThaumicResonator"],
                    prerequisites: ["Resilient_Partial_Core_Revamp", "Resilient_Partial_Radial_Revamp"]
                }
            },
        },
        Nerve: {
            tier1: {
                core: {
                    salvage: ["1x BiomorphicGoo", "1x ArcaneCantrip", "1x MeditationTechniques"],
                    prerequisites: []
                },
            },
            tier2: {
                core: {
                    salvage: ["2x EnchantedSand", "1x DimensionalPocket"],
                    prerequisites: ["Nerve_Boost"]
                },
                radial: {
                    salvage: ["1x BiomorphicGoo", "1x ArcaneCantrip", "1x CytoliticInfusion"],
                    prerequisites: ["Nerve_Boost"]
                }
            },
            tier3: {
                core: {
                    salvage: ["2x EnchantedSand", "1x SuperconductiveMembrane"],
                    prerequisites: ["Nerve_Core_Boost"]
                },
                radial: {
                    salvage: ["1x MeditationTechniques", "1x ArcaneCantrip", "1x ExoticIsotope"],
                    prerequisites: ["Nerve_Radial_Boost"]
                }
            },
            tier4: {
                core: {
                    salvage: ["1x SuperchargedCapacitor", "1x DetailedReports", "1x ForbiddenTechnique"],
                    prerequisites: ["Nerve_Partial_Core_Revamp", "Nerve_Partial_Radial_Revamp"]
                },
                radial: {
                    salvage: ["1x EnchantedSand", "1x MeditationTechniques", "1x ThaumicResonator"],
                    prerequisites: ["Nerve_Partial_Core_Revamp", "Nerve_Partial_Radial_Revamp"]
                }
            },
        },
        Musculature: {
            tier1: {
                core: {
                    salvage: ["1x BiomorphicGoo", "1x MeditationTechniques", "1x GenomicAnalysis"],
                    prerequisites: []
                },
            },
            tier2: {
                core: {
                    salvage: ["1x ArcaneCantrip", "1x DetailedReports", "1x WornSpellbook"],
                    prerequisites: ["Musculature_Boost"]
                },
                radial: {
                    salvage: ["1x BiomorphicGoo", "1x EnchantedSand", "1x GluonCompound"],
                    prerequisites: ["Musculature_Boost"]
                }
            },
            tier3: {
                core: {
                    salvage: ["1x GenomicAnalysis", "1x NanotechGrowthMedium", "1x SuperconductiveMembrane"],
                    prerequisites: ["Musculature_Core_Boost"]
                },
                radial: {
                    salvage: ["1x SuperchargedCapacitor", "1x MeditationTechniques", "1x ExoticIsotope"],
                    prerequisites: ["Musculature_Radial_Boost"]
                }
            },
            tier4: {
                core: {
                    salvage: ["1x ArcaneCantrip", "1x NanotechGrowthMedium", "1x ForbiddenTechnique"],
                    prerequisites: ["Musculature_Partial_Core_Revamp", "Musculature_Partial_Radial_Revamp"]
                },
                radial: {
                    salvage: ["1x SuperchargedCapacitor", "1x MeditationTechniques", "1x SelfEvolvingAlloy"],
                    prerequisites: ["Musculature_Partial_Core_Revamp", "Musculature_Partial_Radial_Revamp"]
                }
            },
        },
        Intuition: {
            tier1: {
                core: {
                    salvage: ["1x SuperchargedCapacitor", "1x DetailedReports", "1x BiomorphicGoo"],
                    prerequisites: []
                },
            },
            tier2: {
                core: {
                    salvage: ["1x SuperchargedCapacitor", "1x GenomicAnalysis", "1x CytoliticInfusion"],
                    prerequisites: ["Intuition_Boost"]
                },
                radial: {
                    salvage: ["1x DetailedReports", "1x BiomorphicGoo", "1x GluonCompound"],
                    prerequisites: ["Intuition_Boost"]
                }
            },
            tier3: {
                core: {
                    salvage: ["1x GenomicAnalysis", "1x ArcaneCantrip", "1x AncientTexts"],
                    prerequisites: ["Intuition_Core_Boost"]
                },
                radial: {
                    salvage: ["1x MeditationTechniques", "1x EnchantedSand", "1x ExoticIsotope"],
                    prerequisites: ["Intuition_Radial_Boost"]
                }
            },
            tier4: {
                core: {
                    salvage: ["1x EnchantedSand", "1x GenomicAnalysis", "1x LivingRelic"],
                    prerequisites: ["Intuition_Partial_Core_Revamp", "Intuition_Partial_Radial_Revamp"]
                },
                radial: {
                    salvage: ["1x EnchantedSand", "1x MeditationTechniques", "1x ThaumicResonator"],
                    prerequisites: ["Intuition_Partial_Core_Revamp", "Intuition_Partial_Radial_Revamp"]
                }
            },
        },
        Cardiac: {
            tier1: {
                core: {
                    salvage: ["1x SuperchargedCapacitor", "1x DetailedReports", "1x BiomorphicGoo"],
                    prerequisites: []
                },
            },
            tier2: {
                core: {
                    salvage: ["1x SuperchargedCapacitor", "1x GenomicAnalysis", "1x CytoliticInfusion"],
                    prerequisites: ["Cardiac_Boost"]
                },
                radial: {
                    salvage: ["1x DetailedReports", "1x BiomorphicGoo", "1x GluonCompound"],
                    prerequisites: ["Cardiac_Boost"]
                }
            },
            tier3: {
                core: {
                    salvage: ["1x GenomicAnalysis", "1x ArcaneCantrip", "1x AncientTexts"],
                    prerequisites: ["Cardiac_Core_Boost"]
                },
                radial: {
                    salvage: ["1x MeditationTechniques", "1x EnchantedSand", "1x ExoticIsotope"],
                    prerequisites: ["Cardiac_Radial_Boost"]
                }
            },
            tier4: {
                core: {
                    salvage: ["1x EnchantedSand", "1x GenomicAnalysis", "1x LivingRelic"],
                    prerequisites: ["Cardiac_Partial_Core_Revamp", "Cardiac_Partial_Radial_Revamp"]
                },
                radial: {
                    salvage: ["1x EnchantedSand", "1x MeditationTechniques", "1x ThaumicResonator"],
                    prerequisites: ["Cardiac_Partial_Core_Revamp", "Cardiac_Partial_Radial_Revamp"]
                }
            },
        },
        Agility: {
            tier1: {
                core: {
                    salvage: ["1x BiomorphicGoo", "1x MeditationTechniques", "1x GenomicAnalysis"],
                    prerequisites: []
                },
            },
            tier2: {
                core: {
                    salvage: ["1x ArcaneCantrip", "1x DetailedReports", "1x WornSpellbook"],
                    prerequisites: ["Agility_Boost"]
                },
                radial: {
                    salvage: ["1x BiomorphicGoo", "1x EnchantedSand", "1x GluonCompound"],
                    prerequisites: ["Agility_Boost"]
                }
            },
            tier3: {
                core_1: {
                    salvage: ["1x GenomicAnalysis", "1x NanotechGrowthMedium", "1x ExoticIsotope"],
                    prerequisites: ["Agility_Core_Boost"]
                },
                core_2: {
                    salvage: ["2x NanotechGrowthMedium", "1x ExoticIsotope"],
                    prerequisites: ["Agility_Core_Boost"]
                },
                radial_1: {
                    salvage: ["1x SuperchargedCapacitor", "1x MeditationTechniques", "1x SelfEvolvingAlloy"],
                    prerequisites: ["Agility_Radial_Boost"]
                },
                radial_2: {
                    salvage: ["1x SuperchargedCapacitor", "1x MeditationTechniques", "1x ExoticIsotope"],
                    prerequisites: ["Agility_Radial_Boost"]
                }
            },
            tier4: {
                core: {
                    salvage: ["1x GenomicAnalysis", "1x NanotechGrowthMedium", "1x ForbiddenTechnique"],
                    prerequisites: [
                        "Agility_Total_Core_Revamp",
                        "Agility_Partial_Core_Revamp",
                        "Agility_Total_Radial_Revamp",
                        "Agility_Partial_Radial_Revamp"
                    ],
                    validCombinations: [
                        ["Agility_Partial_Core_Revamp", "Agility_Partial_Radial_Revamp"],
                        ["Agility_Partial_Core_Revamp", "Agility_Total_Core_Revamp"],
                        ["Agility_Partial_Core_Revamp", "Agility_Total_Radial_Revamp"],
                        ["Agility_Partial_Radial_Revamp", "Agility_Total_Core_Revamp"],
                        ["Agility_Partial_Radial_Revamp", "Agility_Total_Radial_Revamp"],
                        ["Agility_Total_Core_Revamp", "Agility_Total_Radial_Revamp"]
                    ]
                },
                radial: {
                    salvage: ["1x ArcaneCantrip", "1x MeditationTechniques", "1x SelfEvolvingAlloy"],
                    prerequisites: [
                        "Agility_Total_Core_Revamp",
                        "Agility_Partial_Core_Revamp",
                        "Agility_Total_Radial_Revamp",
                        "Agility_Partial_Radial_Revamp"
                    ],
                    validCombinations: [
                        ["Agility_Partial_Core_Revamp", "Agility_Partial_Radial_Revamp"],
                        ["Agility_Partial_Core_Revamp", "Agility_Total_Core_Revamp"],
                        ["Agility_Partial_Core_Revamp", "Agility_Total_Radial_Revamp"],
                        ["Agility_Partial_Radial_Revamp", "Agility_Total_Core_Revamp"],
                        ["Agility_Partial_Radial_Revamp", "Agility_Total_Radial_Revamp"],
                        ["Agility_Total_Core_Revamp", "Agility_Total_Radial_Revamp"]
                    ]
                }
            },
        },
    },
    judgement: {
        Vorpal: {
            tier1: {
                core: {
                    salvage: ["1x DetailedReports", "1x MeditationTechniques", "1x EnchantedSand"],
                    prerequisites: []
                },
            },
            tier2: {
                core: {
                    salvage: ["1x SuperchargedCapacitor", "1x NanotechGrowthMedium", "1x CytoliticInfusion"],
                    prerequisites: ["Vorpal_Judgement"]
                },
                radial: {
                    salvage: ["1x NanotechGrowthMedium", "1x MeditationTechniques", "1x DimensionalPocket"],
                    prerequisites: ["Vorpal_Judgement"]
                }
            },
            tier3: {
                core: {
                    salvage: ["1x NanotechGrowthMedium", "1x EnchantedSand", "1x SemiConsciousEnergy"],
                    prerequisites: ["Vorpal_Core_Judgement"]
                },
                radial: {
                    salvage: ["1x EnchantedSand", "1x BiomorphicGoo", "1x SemiConsciousEnergy"],
                    prerequisites: ["Vorpal_Radial_Judgement"]
                }
            },
            tier4: {
                core: {
                    salvage: ["1x BiomorphicGoo", "1x DetailedReports", "1x SelfEvolvingAlloy"],
                    prerequisites: ["Vorpal_Partial_Core_Judgement", "Vorpal_Partial_Radial_Judgement"]
                },
                radial: {
                    salvage: ["1x NanotechGrowthMedium", "1x EnchantedSand", "1x ForbiddenTechnique"],
                    prerequisites: ["Vorpal_Partial_Core_Judgement", "Vorpal_Partial_Radial_Judgement"]
                }
            },
        },
        Void: {
            tier1: {
                core: {
                    salvage: ["1x GenomicAnalysis", "1x EnchantedSand", "1x ArcaneCantrip"],
                    prerequisites: []
                },
            },
            tier2: {
                core: {
                    salvage: ["1x DetailedReports", "1x ArcaneCantrip", "1x WornSpellbook"],
                    prerequisites: ["Void_Judgement"]
                },
                radial: {
                    salvage: ["1x ArcaneCantrip", "1x GenomicAnalysis", "1x DimensionalPocket"],
                    prerequisites: ["Void_Judgement"]
                }
            },
            tier3: {
                core: {
                    salvage: ["1x DetailedReports", "1x NanotechGrowthMedium", "1x AncientTexts"],
                    prerequisites: ["Void_Core_Judgement"]
                },
                radial: {
                    salvage: ["1x EnchantedSand", "1x GenomicAnalysis", "1x ExoticIsotope"],
                    prerequisites: ["Void_Radial_Judgement"]
                }
            },
            tier4: {
                core: {
                    salvage: ["1x DetailedReports", "1x ArcaneCantrip", "1x LivingRelic"],
                    prerequisites: ["Void_Partial_Core_Judgement", "Void_Partial_Radial_Judgement"]
                },
                radial: {
                    salvage: ["1x NanotechGrowthMedium", "1x MeditationTechniques", "1x ForbiddenTechnique"],
                    prerequisites: ["Void_Partial_Core_Judgement", "Void_Partial_Radial_Judgement"]
                }
            },
        },
        Pyronic: {
            tier1: {
                core: {
                    salvage: ["2x SuperchargedCapacitor", "1x ArcaneCantrip"],
                    prerequisites: []
                },
            },
            tier2: {
                core: {
                    salvage: ["1x EnchantedSand", "1x ArcaneCantrip", "1x GluonCompound"],
                    prerequisites: ["Pyronic_Judgement"]
                },
                radial: {
                    salvage: ["1x DetailedReports", "1x GenomicAnalysis", "1x CytoliticInfusion"],
                    prerequisites: ["Pyronic_Judgement"]
                }
            },
            tier3: {
                core: {
                    salvage: ["1x NanotechGrowthMedium", "1x DetailedReports", "1x ExoticIsotope"],
                    prerequisites: ["Pyronic_Core_Judgement"]
                },
                radial: {
                    salvage: ["1x MeditationTechniques", "1x EnchantedSand", "1x ExoticIsotope"],
                    prerequisites: ["Pyronic_Radial_Judgement"]
                }
            },
            tier4: {
                core: {
                    salvage: ["1x GenomicAnalysis", "1x BiomorphicGoo", "1x SelfEvolvingAlloy"],
                    prerequisites: ["Pyronic_Partial_Core_Judgement", "Pyronic_Partial_Radial_Judgement"]
                },
                radial: {
                    salvage: ["1x BiomorphicGoo", "1x EnchantedSand", "1x ThaumicResonator"],
                    prerequisites: ["Pyronic_Partial_Core_Judgement", "Pyronic_Partial_Radial_Judgement"]
                }
            },
        },
        Ion: {
            tier1: {
                core: {
                    salvage: ["1x NanotechGrowthMedium", "1x SuperchargedCapacitor", "1x DetailedReports"],
                    prerequisites: []
                },
            },
            tier2: {
                core: {
                    salvage: ["1x BiomorphicGoo", "1x DetailedReports", "1x WornSpellbook"],
                    prerequisites: ["Ion_Judgement"]
                },
                radial: {
                    salvage: ["1x NanotechGrowthMedium", "1x DetailedReports", "1x GluonCompound"],
                    prerequisites: ["Ion_Judgement"]
                }
            },
            tier3: {
                core: {
                    salvage: ["1x BiomorphicGoo", "1x MeditationTechniques", "1x AncientTexts"],
                    prerequisites: ["Ion_Core_Judgement"]
                },
                radial: {
                    salvage: ["1x MeditationTechniques", "1x SuperchargedCapacitor", "1x ExoticIsotope"],
                    prerequisites: ["Ion_Radial_Judgement"]
                }
            },
            tier4: {
                core: {
                    salvage: ["1x GenomicAnalysis", "1x MeditationTechniques", "1x ThaumicResonator"],
                    prerequisites: ["Ion_Partial_Core_Judgement", "Ion_Partial_Radial_Judgement"]
                },
                radial: {
                    salvage: ["1x SuperchargedCapacitor", "1x NanotechGrowthMedium", "1x LivingRelic"],
                    prerequisites: ["Ion_Partial_Core_Judgement", "Ion_Partial_Radial_Judgement"]
                }
            },
        },
        Cryonic: {
            tier1: {
                core: {
                    salvage: ["1x DetailedReports", "1x MeditationTechniques", "1x EnchantedSand"],
                    prerequisites: []
                },
            },
            tier2: {
                core: {
                    salvage: ["1x SuperchargedCapacitor", "1x NanotechGrowthMedium", "1x CytoliticInfusion"],
                    prerequisites: ["Cryonic_Judgement"]
                },
                radial: {
                    salvage: ["1x NanotechGrowthMedium", "1x MeditationTechniques", "1x DimensionalPocket"],
                    prerequisites: ["Cryonic_Judgement"]
                }
            },
            tier3: {
                core: {
                    salvage: ["1x NanotechGrowthMedium", "1x EnchantedSand", "1x SemiConsciousEnergy"],
                    prerequisites: ["Cryonic_Core_Judgement"]
                },
                radial: {
                    salvage: ["1x EnchantedSand", "1x BiomorphicGoo", "1x SemiConsciousEnergy"],
                    prerequisites: ["Cryonic_Radial_Judgement"]
                }
            },
            tier4: {
                core: {
                    salvage: ["1x BiomorphicGoo", "1x DetailedReports", "1x SelfEvolvingAlloy"],
                    prerequisites: ["Cryonic_Partial_Core_Judgement", "Cryonic_Partial_Radial_Judgement"]
                },
                radial: {
                    salvage: ["1x NanotechGrowthMedium", "1x EnchantedSand", "1x ForbiddenTechnique"],
                    prerequisites: ["Cryonic_Partial_Core_Judgement", "Cryonic_Partial_Radial_Judgement"]
                }
            },
        },
    },
    interface: {
        Spectral: {
            tier1: {
                core: {
                    salvage: ["1x GenomicAnalysis", "1x EnchantedSand", "1x SuperchargedCapacitor"],
                    prerequisites: []
                },
            },
            tier2: {
                core: {
                    salvage: ["1x DetailedReports", "1x ArcaneCantrip", "1x CytoliticInfusion"],
                    prerequisites: ["Spectral_Interface"]
                },
                radial: {
                    salvage: ["1x ArcaneCantrip", "1x DetailedReports", "1x GluonCompound"],
                    prerequisites: ["Spectral_Interface"]
                }
            },
            tier3: {
                core: {
                    salvage: ["1x ArcaneCantrip", "1x EnchantedSand", "1x ExoticIsotope"],
                    prerequisites: ["Spectral_Core_Interface"]
                },
                radial: {
                    salvage: ["1x SuperchargedCapacitor", "1x GenomicAnalysis", "1x SuperconductiveMembrane"],
                    prerequisites: ["Spectral_Radial_Interface"]
                }
            },
            tier4: {
                core: {
                    salvage: ["1x DetailedReports", "1x SuperchargedCapacitor", "1x LivingRelic"],
                    prerequisites: ["Spectral_Partial_Core_Conversion", "Spectral_Partial_Radial_Conversion"]
                },
                radial: {
                    salvage: ["1x SuperchargedCapacitor", "1x EnchantedSand", "1x SelfEvolvingAlloy"],
                    prerequisites: ["Spectral_Partial_Core_Conversion", "Spectral_Partial_Radial_Conversion"]
                }
            },
        },
        Reactive: {
            tier1: {
                core: {
                    salvage: ["1x SuperchargedCapacitor", "1x MeditationTechniques", "1x ArcaneCantrip"],
                    prerequisites: []
                },
            },
            tier2: {
                core: {
                    salvage: ["1x EnchantedSand", "1x SuperchargedCapacitor", "1x GluonCompound"],
                    prerequisites: ["Reactive_Interface"]
                },
                radial: {
                    salvage: ["2x SuperchargedCapacitor", "1x DimensionalPocket"],
                    prerequisites: ["Reactive_Interface"]
                }
            },
            tier3: {
                core: {
                    salvage: ["1x GenomicAnalysis", "1x SuperchargedCapacitor", "1x SemiConsciousEnergy"],
                    prerequisites: ["Reactive_Core_Interface"]
                },
                radial: {
                    salvage: ["1x GenomicAnalysis", "1x MeditationTechniques", "1x AncientTexts"],
                    prerequisites: ["Reactive_Radial_Interface"]
                }
            },
            tier4: {
                core: {
                    salvage: ["1x MeditationTechniques", "1x DetailedReports", "1x LivingRelic"],
                    prerequisites: ["Reactive_Partial_Core_Conversion", "Reactive_Partial_Radial_Conversion"]
                },
                radial: {
                    salvage: ["2x ArcaneCantrip", "1x SelfEvolvingAlloy"],
                    prerequisites: ["Reactive_Partial_Core_Conversion", "Reactive_Partial_Radial_Conversion"]
                }
            },
        },
        Preemptive: {
            tier1: {
                core: {
                    salvage: ["1x ArcaneCantrip", "1x SuperchargedCapacitor", "1x GenomicAnalysis"],
                    prerequisites: []
                },
            },
            tier2: {
                core: {
                    salvage: ["1x DetailedReports", "1x SuperchargedCapacitor", "1x WornSpellbook"],
                    prerequisites: ["Preemptive_Interface"]
                },
                radial: {
                    salvage: ["1x NanotechGrowthMedium", "1x GenomicAnalysis", "1x CytoliticInfusion"],
                    prerequisites: ["Preemptive_Interface"]
                }
            },
            tier3: {
                core: {
                    salvage: ["2x SuperchargedCapacitor", "1x ExoticIsotope"],
                    prerequisites: ["Preemptive_Core_Interface"]
                },
                radial: {
                    salvage: ["1x GenomicAnalysis", "1x DetailedReports", "1x AncientTexts"],
                    prerequisites: ["Preemptive_Radial_Interface"]
                }
            },
            tier4: {
                core: {
                    salvage: ["1x ArcaneCantrip", "1x BiomorphicGoo", "1x ThaumicResonator"],
                    prerequisites: ["Preemptive_Partial_Core_Conversion", "Preemptive_Partial_Radial_Conversion"]
                },
                radial: {
                    salvage: ["1x EnchantedSand", "1x BiomorphicGoo", "1x ForbiddenTechnique"],
                    prerequisites: ["Preemptive_Partial_Core_Conversion", "Preemptive_Partial_Radial_Conversion"]
                }
            },
        },
        Paralytic: {
            tier1: {
                core: {
                    salvage: ["1x NanotechGrowthMedium", "1x DetailedReports", "1x BiomorphicGoo"],
                    prerequisites: []
                },
            },
            tier2: {
                core: {
                    salvage: ["1x MeditationTechniques", "1x ArcaneCantrip", "1x DimensionalPocket"],
                    prerequisites: ["Paralytic_Interface"]
                },
                radial: {
                    salvage: ["1x ArcaneCantrip", "1x NanotechGrowthMedium", "1x CytoliticInfusion"],
                    prerequisites: ["Paralytic_Interface"]
                }
            },
            tier3: {
                core: {
                    salvage: ["1x SuperchargedCapacitor", "1x BiomorphicGoo", "1x SuperconductiveMembrane"],
                    prerequisites: ["Paralytic_Core_Interface"]
                },
                radial: {
                    salvage: ["1x DetailedReports", "1x EnchantedSand", "1x SemiConsciousEnergy"],
                    prerequisites: ["Paralytic_Radial_Interface"]
                }
            },
            tier4: {
                core: {
                    salvage: ["1x ArcaneCantrip", "1x SuperchargedCapacitor", "1x ForbiddenTechnique"],
                    prerequisites: ["Paralytic_Partial_Core_Conversion", "Paralytic_Partial_Radial_Conversion"]
                },
                radial: {
                    salvage: ["1x DetailedReports", "1x MeditationTechniques", "1x SelfEvolvingAlloy"],
                    prerequisites: ["Paralytic_Partial_Core_Conversion", "Paralytic_Partial_Radial_Conversion"]
                }
            },
        },
        Gravitic: {
            tier1: {
                core: {
                    salvage: ["1x ArcaneCantrip", "1x SuperchargedCapacitor", "1x GenomicAnalysis"],
                    prerequisites: []
                },
            },
            tier2: {
                core: {
                    salvage: ["1x DetailedReports", "1x SuperchargedCapacitor", "1x WornSpellbook"],
                    prerequisites: ["Gravitic_Interface"]
                },
                radial: {
                    salvage: ["1x NanotechGrowthMedium", "1x GenomicAnalysis", "1x CytoliticInfusion"],
                    prerequisites: ["Gravitic_Interface"]
                }
            },
            tier3: {
                core: {
                    salvage: ["2x SuperchargedCapacitor", "1x ExoticIsotope"],
                    prerequisites: ["Gravitic_Core_Interface"]
                },
                radial: {
                    salvage: ["1x GenomicAnalysis", "1x DetailedReports", "1x AncientTexts"],
                    prerequisites: ["Gravitic_Radial_Interface"]
                }
            },
            tier4: {
                core: {
                    salvage: ["1x ArcaneCantrip", "1x BiomorphicGoo", "1x ThaumicResonator"],
                    prerequisites: ["Gravitic_Partial_Core_Conversion", "Gravitic_Partial_Radial_Conversion"]
                },
                radial: {
                    salvage: ["1x EnchantedSand", "1x BiomorphicGoo", "1x ForbiddenTechnique"],
                    prerequisites: ["Gravitic_Partial_Core_Conversion", "Gravitic_Partial_Radial_Conversion"]
                }
            },
        },
        Diamagnetic: {
            tier1: {
                core: {
                    salvage: ["1x GenomicAnalysis", "1x EnchantedSand", "1x SuperchargedCapacitor"],
                    prerequisites: []
                },
            },
            tier2: {
                core: {
                    salvage: ["1x DetailedReports", "1x ArcaneCantrip", "1x CytoliticInfusion"],
                    prerequisites: ["Diamagnetic_Interface"]
                },
                radial: {
                    salvage: ["1x ArcaneCantrip", "1x DetailedReports", "1x GluonCompound"],
                    prerequisites: ["Diamagnetic_Interface"]
                }
            },
            tier3: {
                core: {
                    salvage: ["1x ArcaneCantrip", "1x EnchantedSand", "1x ExoticIsotope"],
                    prerequisites: ["Diamagnetic_Core_Interface"]
                },
                radial: {
                    salvage: ["1x SuperchargedCapacitor", "1x GenomicAnalysis", "1x SuperconductiveMembrane"],
                    prerequisites: ["Diamagnetic_Radial_Interface"]
                }
            },
            tier4: {
                core: {
                    salvage: ["1x DetailedReports", "1x SuperchargedCapacitor", "1x LivingRelic"],
                    prerequisites: ["Diamagnetic_Partial_Core_Conversion", "Diamagnetic_Partial_Radial_Conversion"]
                },
                radial: {
                    salvage: ["1x SuperchargedCapacitor", "1x EnchantedSand", "1x SelfEvolvingAlloy"],
                    prerequisites: ["Diamagnetic_Partial_Core_Conversion", "Diamagnetic_Partial_Radial_Conversion"]
                }
            },
        },
        Degenerative: {
            tier1: {
                core: {
                    salvage: ["1x NanotechGrowthMedium", "1x DetailedReports", "1x BiomorphicGoo"],
                    prerequisites: []
                },
            },
            tier2: {
                core: {
                    salvage: ["1x MeditationTechniques", "1x ArcaneCantrip", "1x DimensionalPocket"],
                    prerequisites: ["Degenerative_Interface"]
                },
                radial: {
                    salvage: ["1x ArcaneCantrip", "1x NanotechGrowthMedium", "1x CytoliticInfusion"],
                    prerequisites: ["Degenerative_Interface"]
                }
            },
            tier3: {
                core: {
                    salvage: ["1x SuperchargedCapacitor", "1x BiomorphicGoo", "1x SuperconductiveMembrane"],
                    prerequisites: ["Degenerative_Core_Interface"]
                },
                radial: {
                    salvage: ["1x DetailedReports", "1x EnchantedSand", "1x SemiConsciousEnergy"],
                    prerequisites: ["Degenerative_Radial_Interface"]
                }
            },
            tier4: {
                core: {
                    salvage: ["1x ArcaneCantrip", "1x SuperchargedCapacitor", "1x ForbiddenTechnique"],
                    prerequisites: ["Degenerative_Partial_Core_Conversion", "Degenerative_Partial_Radial_Conversion"]
                },
                radial: {
                    salvage: ["1x DetailedReports", "1x MeditationTechniques", "1x SelfEvolvingAlloy"],
                    prerequisites: ["Degenerative_Partial_Core_Conversion", "Degenerative_Partial_Radial_Conversion"]
                }
            },
        },
        Cognitive: {
            tier1: {
                core: {
                    salvage: ["1x SuperchargedCapacitor", "1x MeditationTechniques", "1x ArcaneCantrip"],
                    prerequisites: []
                },
            },
            tier2: {
                core: {
                    salvage: ["1x EnchantedSand", "1x SuperchargedCapacitor", "1x GluonCompound"],
                    prerequisites: ["Cognitive_Interface"]
                },
                radial: {
                    salvage: ["2x SuperchargedCapacitor", "1x DimensionalPocket"],
                    prerequisites: ["Cognitive_Interface"]
                }
            },
            tier3: {
                core: {
                    salvage: ["1x GenomicAnalysis", "1x SuperchargedCapacitor", "1x SemiConsciousEnergy"],
                    prerequisites: ["Cognitive_Core_Interface"]
                },
                radial: {
                    salvage: ["1x GenomicAnalysis", "1x MeditationTechniques", "1x AncientTexts"],
                    prerequisites: ["Cognitive_Radial_Interface"]
                }
            },
            tier4: {
                core: {
                    salvage: ["1x MeditationTechniques", "1x DetailedReports", "1x LivingRelic"],
                    prerequisites: ["Cognitive_Partial_Core_Conversion", "Cognitive_Partial_Radial_Conversion"]
                },
                radial: {
                    salvage: ["2x ArcaneCantrip", "1x SelfEvolvingAlloy"],
                    prerequisites: ["Cognitive_Partial_Core_Conversion", "Cognitive_Partial_Radial_Conversion"]
                }
            },
        },
    },
    lore: {
        Warworks: {
            tier1: {
                core: {
                    salvage: ["2x ArcaneCantrip", "1x MeditationTechniques"],
                    prerequisites: []
                },
            },
            tier2: {
                core: {
                    salvage: ["1x EnchantedSand", "1x ArcaneCantrip", "1x WornSpellbook"],
                    prerequisites: ["Warworks_Ally"]
                },
                radial: {
                    salvage: ["1x MeditationTechniques", "1x BiomorphicGoo", "1x CytoliticInfusion"],
                    prerequisites: ["Warworks_Ally"]
                }
            },
            tier3: {
                core: {
                    salvage: ["1x ArcaneCantrip", "1x SuperchargedCapacitor", "1x SuperconductiveMembrane"],
                    prerequisites: ["Warworks_Core_Ally"]
                },
                radial: {
                    salvage: ["1x EnchantedSand", "1x SuperchargedCapacitor", "1x ExoticIsotope"],
                    prerequisites: ["Warworks_Radial_Ally"]
                }
            },
            tier4: {
                core: {
                    salvage: ["1x MeditationTechniques", "1x GenomicAnalysis", "1x SelfEvolvingAlloy"],
                    prerequisites: ["Warworks_Partial_Core_Improved_Ally", "Warworks_Partial_Radial_Improved_Ally"]
                },
                radial: {
                    salvage: ["1x BiomorphicGoo", "1x SuperchargedCapacitor", "1x LivingRelic"],
                    prerequisites: ["Warworks_Partial_Core_Improved_Ally", "Warworks_Partial_Radial_Improved_Ally"]
                }
            },
        },
        Vanguard: {
            tier1: {
                core: {
                    salvage: ["2x ArcaneCantrip", "1x MeditationTechniques"],
                    prerequisites: []
                },
            },
            tier2: {
                core: {
                    salvage: ["1x EnchantedSand", "1x ArcaneCantrip", "1x WornSpellbook"],
                    prerequisites: ["Vanguard_Ally"]
                },
                radial: {
                    salvage: ["1x MeditationTechniques", "1x BiomorphicGoo", "1x CytoliticInfusion"],
                    prerequisites: ["Vanguard_Ally"]
                }
            },
            tier3: {
                core: {
                    salvage: ["1x ArcaneCantrip", "1x SuperchargedCapacitor", "1x SuperconductiveMembrane"],
                    prerequisites: ["Vanguard_Core_Ally"]
                },
                radial: {
                    salvage: ["1x EnchantedSand", "1x SuperchargedCapacitor", "1x ExoticIsotope"],
                    prerequisites: ["Vanguard_Radial_Ally"]
                }
            },
            tier4: {
                core: {
                    salvage: ["1x MeditationTechniques", "1x GenomicAnalysis", "1x SelfEvolvingAlloy"],
                    prerequisites: ["Vanguard_Partial_Core_Improved_Ally", "Vanguard_Partial_Radial_Improved_Ally"]
                },
                radial: {
                    salvage: ["1x BiomorphicGoo", "1x SuperchargedCapacitor", "1x LivingRelic"],
                    prerequisites: ["Vanguard_Partial_Core_Improved_Ally", "Vanguard_Partial_Radial_Improved_Ally"]
                }
            },
        },
        Tsoo: {
            tier1: {
                core: {
                    salvage: ["1x ArcaneCantrip", "1x GenomicAnalysis", "1x EnchantedSand"],
                    prerequisites: []
                },
            },
            tier2: {
                core: {
                    salvage: ["1x BiomorphicGoo", "1x EnchantedSand", "1x WornSpellbook"],
                    prerequisites: ["Tsoo_Ally"]
                },
                radial: {
                    salvage: ["1x GenomicAnalysis", "1x SuperchargedCapacitor", "1x DimensionalPocket"],
                    prerequisites: ["Tsoo_Ally"]
                }
            },
            tier3: {
                core: {
                    salvage: ["2x EnchantedSand", "1x SuperconductiveMembrane"],
                    prerequisites: ["Tsoo_Core_Ally"]
                },
                radial: {
                    salvage: ["2x EnchantedSand", "1x SemiConsciousEnergy"],
                    prerequisites: ["Tsoo_Radial_Ally"]
                }
            },
            tier4: {
                core: {
                    salvage: ["2x GenomicAnalysis", "1x ThaumicResonator"],
                    prerequisites: ["Tsoo_Partial_Core_Improved_Ally", "Tsoo_Partial_Radial_Improved_Ally"]
                },
                radial: {
                    salvage: ["1x EnchantedSand", "1x BiomorphicGoo", "1x ForbiddenTechnique"],
                    prerequisites: ["Tsoo_Partial_Core_Improved_Ally", "Tsoo_Partial_Radial_Improved_Ally"]
                }
            },
        },
        Talons: {
            tier1: {
                core: {
                    salvage: ["1x MeditationTechniques", "1x BiomorphicGoo", "1x EnchantedSand"],
                    prerequisites: []
                },
            },
            tier2: {
                core: {
                    salvage: ["1x MeditationTechniques", "1x EnchantedSand", "1x DimensionalPocket"],
                    prerequisites: ["Talons_of_Vengeance_Ally"]
                },
                radial: {
                    salvage: ["1x SuperchargedCapacitor", "1x EnchantedSand", "1x WornSpellbook"],
                    prerequisites: ["Talons_of_Vengeance_Ally"]
                }
            },
            tier3: {
                core: {
                    salvage: ["1x MeditationTechniques", "1x GenomicAnalysis", "1x SuperconductiveMembrane"],
                    prerequisites: ["Talons_of_Vengeance_Core_Ally"]
                },
                radial: {
                    salvage: ["1x MeditationTechniques", "1x GenomicAnalysis", "1x SuperconductiveMembrane"],
                    prerequisites: ["Talons_of_Vengeance_Radial_Ally"]
                }
            },
            tier4: {
                core: {
                    salvage: ["2x GenomicAnalysis", "1x LivingRelic"],
                    prerequisites: ["Talons_of_Vengeance_Partial_Core_Improved_Ally", "Talons_of_Vengeance_Partial_Radial_Improved_Ally"]
                },
                radial: {
                    salvage: ["1x GenomicAnalysis", "1x ArcaneCantrip", "1x ForbiddenTechnique"],
                    prerequisites: ["Talons_of_Vengeance_Partial_Core_Improved_Ally", "Talons_of_Vengeance_Partial_Radial_Improved_Ally"]
                }
            },
        },
        Storm: {
            tier1: {
                core: {
                    salvage: ["1x ArcaneCantrip", "1x GenomicAnalysis", "1x EnchantedSand"],
                    prerequisites: []
                },
            },
            tier2: {
                core: {
                    salvage: ["1x BiomorphicGoo", "1x EnchantedSand", "1x WornSpellbook"],
                    prerequisites: ["Storm_Elemental_Ally"]
                },
                radial: {
                    salvage: ["1x GenomicAnalysis", "1x SuperchargedCapacitor", "1x DimensionalPocket"],
                    prerequisites: ["Storm_Elemental_Ally"]
                }
            },
            tier3: {
                core: {
                    salvage: ["2x EnchantedSand", "1x SuperconductiveMembrane"],
                    prerequisites: ["Storm_Elemental_Core_Ally"]
                },
                radial: {
                    salvage: ["2x EnchantedSand", "1x SemiConsciousEnergy"],
                    prerequisites: ["Storm_Elemental_Radial_Ally"]
                }
            },
            tier4: {
                core: {
                    salvage: ["2x GenomicAnalysis", "1x ThaumicResonator"],
                    prerequisites: ["Storm_Elemental_Partial_Core_Improved_Ally", "Storm_Elemental_Partial_Radial_Improved_Ally"]
                },
                radial: {
                    salvage: ["1x EnchantedSand", "1x BiomorphicGoo", "1x ForbiddenTechnique"],
                    prerequisites: ["Storm_Elemental_Partial_Core_Improved_Ally", "Storm_Elemental_Partial_Radial_Improved_Ally"]
                }
            },
        },
        Seers: {
            tier1: {
                core: {
                    salvage: ["1x ArcaneCantrip", "1x GenomicAnalysis", "1x EnchantedSand"],
                    prerequisites: []
                },
            },
            tier2: {
                core: {
                    salvage: ["1x BiomorphicGoo", "1x NanotechGrowthMedium", "1x WornSpellbook"],
                    prerequisites: ["Seers_Ally"]
                },
                radial: {
                    salvage: ["1x GenomicAnalysis", "1x SuperchargedCapacitor", "1x DimensionalPocket"],
                    prerequisites: ["Seers_Ally"]
                }
            },
            tier3: {
                core: {
                    salvage: ["1x EnchantedSand", "1x NanotechGrowthMedium", "1x SuperconductiveMembrane"],
                    prerequisites: ["Seers_Core_Ally"]
                },
                radial: {
                    salvage: ["1x NanotechGrowthMedium", "1x EnchantedSand", "1x SemiConsciousEnergy"],
                    prerequisites: ["Seers_Radial_Ally"]
                }
            },
            tier4: {
                core: {
                    salvage: ["2x GenomicAnalysis", "1x ThaumicResonator"],
                    prerequisites: ["Seers_Partial_Core_Improved_Ally", "Seers_Partial_Radial_Improved_Ally"]
                },
                radial: {
                    salvage: ["1x NanotechGrowthMedium", "1x BiomorphicGoo", "1x ForbiddenTechnique"],
                    prerequisites: ["Seers_Partial_Core_Improved_Ally", "Seers_Partial_Radial_Improved_Ally"]
                }
            },
        },
        Rularuu: {
            tier1: {
                core: {
                    salvage: ["1x MeditationTechniques", "1x BiomorphicGoo", "1x EnchantedSand"],
                    prerequisites: []
                },
            },
            tier2: {
                core: {
                    salvage: ["1x MeditationTechniques", "1x EnchantedSand", "1x DimensionalPocket"],
                    prerequisites: ["Rularuu_Ally"]
                },
                radial: {
                    salvage: ["1x SuperchargedCapacitor", "1x EnchantedSand", "1x WornSpellbook"],
                    prerequisites: ["Rularuu_Ally"]
                }
            },
            tier3: {
                core: {
                    salvage: ["1x MeditationTechniques", "1x GenomicAnalysis", "1x SuperconductiveMembrane"],
                    prerequisites: ["Rularuu_Core_Ally"]
                },
                radial: {
                    salvage: ["1x MeditationTechniques", "1x GenomicAnalysis", "1x SuperconductiveMembrane"],
                    prerequisites: ["Rularuu_Radial_Ally"]
                }
            },
            tier4: {
                core: {
                    salvage: ["2x GenomicAnalysis", "1x LivingRelic"],
                    prerequisites: ["Rularuu_Partial_Core_Improved_Ally", "Rularuu_Partial_Radial_Improved_Ally"]
                },
                radial: {
                    salvage: ["1x GenomicAnalysis", "1x ArcaneCantrip", "1x ForbiddenTechnique"],
                    prerequisites: ["Rularuu_Partial_Core_Improved_Ally", "Rularuu_Partial_Radial_Improved_Ally"]
                }
            },
        },
        Robotic: {
            tier1: {
                core: {
                    salvage: ["1x MeditationTechniques", "1x BiomorphicGoo", "1x EnchantedSand"],
                    prerequisites: []
                },
            },
            tier2: {
                core: {
                    salvage: ["1x MeditationTechniques", "1x EnchantedSand", "1x DimensionalPocket"],
                    prerequisites: ["Robotic_Drones_Ally"]
                },
                radial: {
                    salvage: ["1x SuperchargedCapacitor", "1x EnchantedSand", "1x WornSpellbook"],
                    prerequisites: ["Robotic_Drones_Ally"]
                }
            },
            tier3: {
                core: {
                    salvage: ["1x MeditationTechniques", "1x GenomicAnalysis", "1x SuperconductiveMembrane"],
                    prerequisites: ["Robotic_Drones_Core_Ally"]
                },
                radial: {
                    salvage: ["1x MeditationTechniques", "1x NanotechGrowthMedium", "1x SuperconductiveMembrane"],
                    prerequisites: ["Robotic_Drones_Radial_Ally"]
                }
            },
            tier4: {
                core: {
                    salvage: ["2x NanotechGrowthMedium", "1x ThaumicResonator"],
                    prerequisites: ["Robotic_Drones_Partial_Core_Improved_Ally", "Robotic_Drones_Partial_Radial_Improved_Ally"]
                },
                radial: {
                    salvage: ["1x NanotechGrowthMedium", "1x ArcaneCantrip", "1x SelfEvolvingAlloy"],
                    prerequisites: ["Robotic_Drones_Partial_Core_Improved_Ally", "Robotic_Drones_Partial_Radial_Improved_Ally"]
                }
            },
        },
        Rikti: {
            tier1: {
                core: {
                    salvage: ["1x MeditationTechniques", "1x BiomorphicGoo", "1x EnchantedSand"],
                    prerequisites: []
                },
            },
            tier2: {
                core: {
                    salvage: ["1x MeditationTechniques", "1x EnchantedSand", "1x DimensionalPocket"],
                    prerequisites: ["Rikti_Ally"]
                },
                radial: {
                    salvage: ["1x SuperchargedCapacitor", "1x EnchantedSand", "1x CytoliticInfusion"],
                    prerequisites: ["Rikti_Ally"]
                }
            },
            tier3: {
                core: {
                    salvage: ["1x MeditationTechniques", "1x DetailedReports", "1x SuperconductiveMembrane"],
                    prerequisites: ["Rikti_Core_Ally"]
                },
                radial: {
                    salvage: ["1x MeditationTechniques", "1x DetailedReports", "1x SuperconductiveMembrane"],
                    prerequisites: ["Rikti_Radial_Ally"]
                }
            },
            tier4: {
                core: {
                    salvage: ["1x GenomicAnalysis", "1x DetailedReports", "1x LivingRelic"],
                    prerequisites: ["Rikti_Partial_Core_Improved_Ally", "Rikti_Partial_Radial_Improved_Ally"]
                },
                radial: {
                    salvage: ["1x GenomicAnalysis", "1x ArcaneCantrip", "1x SelfEvolvingAlloy"],
                    prerequisites: ["Rikti_Partial_Core_Improved_Ally", "Rikti_Partial_Radial_Improved_Ally"]
                }
            },
        },
        Polar: {
            tier1: {
                core: {
                    salvage: ["1x MeditationTechniques", "1x BiomorphicGoo", "1x EnchantedSand"],
                    prerequisites: []
                },
            },
            tier2: {
                core: {
                    salvage: ["1x MeditationTechniques", "1x EnchantedSand", "1x DimensionalPocket"],
                    prerequisites: ["Polar_Lights_Ally"]
                },
                radial: {
                    salvage: ["1x SuperchargedCapacitor", "1x EnchantedSand", "1x WornSpellbook"],
                    prerequisites: ["Polar_Lights_Ally"]
                }
            },
            tier3: {
                core: {
                    salvage: ["1x MeditationTechniques", "1x GenomicAnalysis", "1x SuperconductiveMembrane"],
                    prerequisites: ["Polar_Lights_Core_Ally"]
                },
                radial: {
                    salvage: ["1x MeditationTechniques", "1x ArcaneCantrip", "1x SemiConsciousEnergy"],
                    prerequisites: ["Polar_Lights_Radial_Ally"]
                }
            },
            tier4: {
                core: {
                    salvage: ["2x ArcaneCantrip", "1x LivingRelic"],
                    prerequisites: ["Polar_Lights_Partial_Core_Improved_Ally", "Polar_Lights_Partial_Radial_Improved_Ally"]
                },
                radial: {
                    salvage: ["2x ArcaneCantrip", "1x ForbiddenTechnique"],
                    prerequisites: ["Polar_Lights_Partial_Core_Improved_Ally", "Polar_Lights_Partial_Radial_Improved_Ally"]
                }
            },
        },
        Phantom: {
            tier1: {
                core: {
                    salvage: ["1x MeditationTechniques", "1x BiomorphicGoo", "1x EnchantedSand"],
                    prerequisites: []
                },
            },
            tier2: {
                core: {
                    salvage: ["1x MeditationTechniques", "1x EnchantedSand", "1x DimensionalPocket"],
                    prerequisites: ["Phantom_Ally"]
                },
                radial: {
                    salvage: ["1x SuperchargedCapacitor", "1x EnchantedSand", "1x GluonCompound"],
                    prerequisites: ["Phantom_Ally"]
                }
            },
            tier3: {
                core: {
                    salvage: ["1x MeditationTechniques", "1x GenomicAnalysis", "1x SuperconductiveMembrane"],
                    prerequisites: ["Phantom_Core_Ally"]
                },
                radial: {
                    salvage: ["1x MeditationTechniques", "1x EnchantedSand", "1x ExoticIsotope"],
                    prerequisites: ["Phantom_Radial_Ally"]
                }
            },
            tier4: {
                core: {
                    salvage: ["2x EnchantedSand", "1x LivingRelic"],
                    prerequisites: ["Phantom_Partial_Core_Improved_Ally", "Phantom_Partial_Radial_Improved_Ally"]
                },
                radial: {
                    salvage: ["1x EnchantedSand", "1x ArcaneCantrip", "1x ForbiddenTechnique"],
                    prerequisites: ["Phantom_Partial_Core_Improved_Ally", "Phantom_Partial_Radial_Improved_Ally"]
                }
            },
        },
        Nemesis: {
            tier1: {
                core: {
                    salvage: ["1x MeditationTechniques", "1x BiomorphicGoo", "1x EnchantedSand"],
                    prerequisites: []
                },
            },
            tier2: {
                core: {
                    salvage: ["1x MeditationTechniques", "1x EnchantedSand", "1x DimensionalPocket"],
                    prerequisites: ["Nemesis_Ally"]
                },
                radial: {
                    salvage: ["1x SuperchargedCapacitor", "1x EnchantedSand", "1x CytoliticInfusion"],
                    prerequisites: ["Nemesis_Ally"]
                }
            },
            tier3: {
                core: {
                    salvage: ["1x MeditationTechniques", "1x GenomicAnalysis", "1x ExoticIsotope"],
                    prerequisites: ["Nemesis_Core_Ally"]
                },
                radial: {
                    salvage: ["1x MeditationTechniques", "1x NanotechGrowthMedium", "1x SuperconductiveMembrane"],
                    prerequisites: ["Nemesis_Radial_Ally"]
                }
            },
            tier4: {
                core: {
                    salvage: ["2x NanotechGrowthMedium", "1x LivingRelic"],
                    prerequisites: ["Nemesis_Partial_Core_Improved_Ally", "Nemesis_Partial_Radial_Improved_Ally"]
                },
                radial: {
                    salvage: ["1x NanotechGrowthMedium", "1x ArcaneCantrip", "1x SelfEvolvingAlloy"],
                    prerequisites: ["Nemesis_Partial_Core_Improved_Ally", "Nemesis_Partial_Radial_Improved_Ally"]
                }
            },
        },
        Longbow: {
            tier1: {
                core: {
                    salvage: ["1x MeditationTechniques", "1x BiomorphicGoo", "1x EnchantedSand"],
                    prerequisites: []
                },
            },
            tier2: {
                core: {
                    salvage: ["1x MeditationTechniques", "1x EnchantedSand", "1x GluonCompound"],
                    prerequisites: ["Longbow_Ally"]
                },
                radial: {
                    salvage: ["1x SuperchargedCapacitor", "1x EnchantedSand", "1x CytoliticInfusion"],
                    prerequisites: ["Longbow_Ally"]
                }
            },
            tier3: {
                core: {
                    salvage: ["1x MeditationTechniques", "1x GenomicAnalysis", "1x SemiConsciousEnergy"],
                    prerequisites: ["Longbow_Core_Ally"]
                },
                radial: {
                    salvage: ["1x MeditationTechniques", "1x NanotechGrowthMedium", "1x ExoticIsotope"],
                    prerequisites: ["Longbow_Radial_Ally"]
                }
            },
            tier4: {
                core: {
                    salvage: ["2x NanotechGrowthMedium", "1x ThaumicResonator"],
                    prerequisites: ["Longbow_Partial_Core_Improved_Ally", "Longbow_Partial_Radial_Improved_Ally"]
                },
                radial: {
                    salvage: ["1x NanotechGrowthMedium", "1x ArcaneCantrip", "1x SelfEvolvingAlloy"],
                    prerequisites: ["Longbow_Partial_Core_Improved_Ally", "Longbow_Partial_Radial_Improved_Ally"]
                }
            },
        },
        Knives: {
            tier1: {
                core: {
                    salvage: ["1x ArcaneCantrip", "1x BiomorphicGoo", "1x GenomicAnalysis"],
                    prerequisites: []
                },
            },
            tier2: {
                core: {
                    salvage: ["1x ArcaneCantrip", "1x EnchantedSand", "1x DimensionalPocket"],
                    prerequisites: ["Knives_of_Vengeance_Ally"]
                },
                radial: {
                    salvage: ["1x SuperchargedCapacitor", "1x EnchantedSand", "1x CytoliticInfusion"],
                    prerequisites: ["Knives_of_Vengeance_Ally"]
                }
            },
            tier3: {
                core: {
                    salvage: ["1x MeditationTechniques", "1x GenomicAnalysis", "1x SuperconductiveMembrane"],
                    prerequisites: ["Knives_of_Vengeance_Core_Ally"]
                },
                radial: {
                    salvage: ["1x MeditationTechniques", "1x NanotechGrowthMedium", "1x SuperconductiveMembrane"],
                    prerequisites: ["Knives_of_Vengeance_Radial_Ally"]
                }
            },
            tier4: {
                core: {
                    salvage: ["2x NanotechGrowthMedium", "1x LivingRelic"],
                    prerequisites: ["Knives_of_Vengeance_Partial_Core_Improved_Ally", "Knives_of_Vengeance_Partial_Radial_Improved_Ally"]
                },
                radial: {
                    salvage: ["1x NanotechGrowthMedium", "1x ArcaneCantrip", "1x ThaumicResonator"],
                    prerequisites: ["Knives_of_Vengeance_Partial_Core_Improved_Ally", "Knives_of_Vengeance_Partial_Radial_Improved_Ally"]
                }
            },
        },
        IDF: {
            tier1: {
                core: {
                    salvage: ["1x ArcaneCantrip", "1x BiomorphicGoo", "1x GenomicAnalysis"],
                    prerequisites: []
                },
            },
            tier2: {
                core: {
                    salvage: ["1x ArcaneCantrip", "1x EnchantedSand", "1x DimensionalPocket"],
                    prerequisites: ["IDF_Ally"]
                },
                radial: {
                    salvage: ["1x SuperchargedCapacitor", "1x EnchantedSand", "1x CytoliticInfusion"],
                    prerequisites: ["IDF_Ally"]
                }
            },
            tier3: {
                core: {
                    salvage: ["1x MeditationTechniques", "1x GenomicAnalysis", "1x SuperconductiveMembrane"],
                    prerequisites: ["IDF_Core_Ally"]
                },
                radial: {
                    salvage: ["1x MeditationTechniques", "1x NanotechGrowthMedium", "1x SuperconductiveMembrane"],
                    prerequisites: ["IDF_Radial_Ally"]
                }
            },
            tier4: {
                core: {
                    salvage: ["2x NanotechGrowthMedium", "1x LivingRelic"],
                    prerequisites: ["IDF_Partial_Core_Improved_Ally", "IDF_Partial_Radial_Improved_Ally"]
                },
                radial: {
                    salvage: ["1x NanotechGrowthMedium", "1x ArcaneCantrip", "1x ThaumicResonator"],
                    prerequisites: ["IDF_Partial_Core_Improved_Ally", "IDF_Partial_Radial_Improved_Ally"]
                }
            },
        },
        Clockwork: {
            tier1: {
                core: {
                    salvage: ["1x ArcaneCantrip", "1x GenomicAnalysis", "1x MeditationTechniques"],
                    prerequisites: []
                },
            },
            tier2: {
                core: {
                    salvage: ["1x MeditationTechniques", "1x SuperchargedCapacitor", "1x GluonCompound"],
                    prerequisites: ["Clockwork_Ally"]
                },
                radial: {
                    salvage: ["2x BiomorphicGoo", "1x WornSpellbook"],
                    prerequisites: ["Clockwork_Ally"]
                }
            },
            tier3: {
                core: {
                    salvage: ["1x GenomicAnalysis", "1x DetailedReports", "1x ExoticIsotope"],
                    prerequisites: ["Clockwork_Core_Ally"]
                },
                radial: {
                    salvage: ["1x GenomicAnalysis", "1x BiomorphicGoo", "1x AncientTexts"],
                    prerequisites: ["Clockwork_Radial_Ally"]
                }
            },
            tier4: {
                core: {
                    salvage: ["1x SuperchargedCapacitor", "1x MeditationTechniques", "1x ThaumicResonator"],
                    prerequisites: ["Clockwork_Partial_Core_Improved_Ally", "Clockwork_Partial_Radial_Improved_Ally"]
                },
                radial: {
                    salvage: ["1x SuperchargedCapacitor", "1x DetailedReports", "1x ForbiddenTechnique"],
                    prerequisites: ["Clockwork_Partial_Core_Improved_Ally", "Clockwork_Partial_Radial_Improved_Ally"]
                }
            },
        },
        Cimeroran: {
            tier1: {
                core: {
                    salvage: ["1x ArcaneCantrip", "1x GenomicAnalysis", "1x MeditationTechniques"],
                    prerequisites: []
                },
            },
            tier2: {
                core: {
                    salvage: ["1x MeditationTechniques", "1x SuperchargedCapacitor", "1x GluonCompound"],
                    prerequisites: ["Cimeroran_Ally"]
                },
                radial: {
                    salvage: ["2x BiomorphicGoo", "1x DimensionalPocket"],
                    prerequisites: ["Cimeroran_Ally"]
                }
            },
            tier3: {
                core: {
                    salvage: ["1x GenomicAnalysis", "1x DetailedReports", "1x ExoticIsotope"],
                    prerequisites: ["Cimeroran_Core_Ally"]
                },
                radial: {
                    salvage: ["1x GenomicAnalysis", "1x BiomorphicGoo", "1x AncientTexts"],
                    prerequisites: ["Cimeroran_Radial_Ally"]
                }
            },
            tier4: {
                core: {
                    salvage: ["1x SuperchargedCapacitor", "1x MeditationTechniques", "1x ThaumicResonator"],
                    prerequisites: ["Cimeroran_Partial_Core_Improved_Ally", "Cimeroran_Partial_Radial_Improved_Ally"]
                },
                radial: {
                    salvage: ["1x SuperchargedCapacitor", "1x DetailedReports", "1x ForbiddenTechnique"],
                    prerequisites: ["Cimeroran_Partial_Core_Improved_Ally", "Cimeroran_Partial_Radial_Improved_Ally"]
                }
            },
        },
        Carnival: {
            tier1: {
                core: {
                    salvage: ["1x ArcaneCantrip", "1x GenomicAnalysis", "1x MeditationTechniques"],
                    prerequisites: []
                },
            },
            tier2: {
                core: {
                    salvage: ["1x BiomorphicGoo", "1x SuperchargedCapacitor", "1x GluonCompound"],
                    prerequisites: ["Carnival_Ally"]
                },
                radial: {
                    salvage: ["2x BiomorphicGoo", "1x WornSpellbook"],
                    prerequisites: ["Carnival_Ally"]
                }
            },
            tier3: {
                core: {
                    salvage: ["1x GenomicAnalysis", "1x DetailedReports", "1x SemiConsciousEnergy"],
                    prerequisites: ["Carnival_Core_Ally"]
                },
                radial: {
                    salvage: ["1x GenomicAnalysis", "1x BiomorphicGoo", "1x AncientTexts"],
                    prerequisites: ["Carnival_Radial_Ally"]
                }
            },
            tier4: {
                core: {
                    salvage: ["1x SuperchargedCapacitor", "1x BiomorphicGoo", "1x ThaumicResonator"],
                    prerequisites: ["Carnival_Partial_Core_Improved_Ally", "Carnival_Partial_Radial_Improved_Ally"]
                },
                radial: {
                    salvage: ["1x SuperchargedCapacitor", "1x DetailedReports", "1x ForbiddenTechnique"],
                    prerequisites: ["Carnival_Partial_Core_Improved_Ally", "Carnival_Partial_Radial_Improved_Ally"]
                }
            },
        },
        Banished: {
            tier1: {
                core: {
                    salvage: ["1x MeditationTechniques", "1x BiomorphicGoo", "1x EnchantedSand"],
                    prerequisites: []
                },
            },
            tier2: {
                core: {
                    salvage: ["1x MeditationTechniques", "1x EnchantedSand", "1x GluonCompound"],
                    prerequisites: ["Banished_Pantheon_Ally"]
                },
                radial: {
                    salvage: ["1x SuperchargedCapacitor", "1x EnchantedSand", "1x CytoliticInfusion"],
                    prerequisites: ["Banished_Pantheon_Ally"]
                }
            },
            tier3: {
                core: {
                    salvage: ["1x MeditationTechniques", "1x GenomicAnalysis", "1x SemiConsciousEnergy"],
                    prerequisites: ["Banished_Pantheon_Core_Ally"]
                },
                radial: {
                    salvage: ["1x MeditationTechniques", "1x NanotechGrowthMedium", "1x ExoticIsotope"],
                    prerequisites: ["Banished_Pantheon_Radial_Ally"]
                }
            },
            tier4: {
                core: {
                    salvage: ["2x NanotechGrowthMedium", "1x ThaumicResonator"],
                    prerequisites: ["Banished_Pantheon_Partial_Core_Improved_Ally", "Banished_Pantheon_Partial_Radial_Improved_Ally"]
                },
                radial: {
                    salvage: ["1x NanotechGrowthMedium", "1x ArcaneCantrip", "1x SelfEvolvingAlloy"],
                    prerequisites: ["Banished_Pantheon_Partial_Core_Improved_Ally", "Banished_Pantheon_Partial_Radial_Improved_Ally"]
                }
            },
        },
        Arachnos: {
            tier1: {
                core: {
                    salvage: ["1x ArcaneCantrip", "1x GenomicAnalysis", "1x MeditationTechniques"],
                    prerequisites: []
                },
            },
            tier2: {
                core: {
                    salvage: ["1x BiomorphicGoo", "1x SuperchargedCapacitor", "1x GluonCompound"],
                    prerequisites: ["Arachnos_Ally"]
                },
                radial: {
                    salvage: ["2x BiomorphicGoo", "1x CytoliticInfusion"],
                    prerequisites: ["Arachnos_Ally"]
                }
            },
            tier3: {
                core: {
                    salvage: ["1x GenomicAnalysis", "1x DetailedReports", "1x ExoticIsotope"],
                    prerequisites: ["Arachnos_Core_Ally"]
                },
                radial: {
                    salvage: ["1x GenomicAnalysis", "1x BiomorphicGoo", "1x AncientTexts"],
                    prerequisites: ["Arachnos_Radial_Ally"]
                }
            },
            tier4: {
                core: {
                    salvage: ["1x SuperchargedCapacitor", "1x BiomorphicGoo", "1x ThaumicResonator"],
                    prerequisites: ["Arachnos_Partial_Core_Improved_Ally", "Arachnos_Partial_Radial_Improved_Ally"]
                },
                radial: {
                    salvage: ["1x SuperchargedCapacitor", "1x DetailedReports", "1x SelfEvolvingAlloy"],
                    prerequisites: ["Arachnos_Partial_Core_Improved_Ally", "Arachnos_Partial_Radial_Improved_Ally"]
                }
            },
        },
    },
    destiny: {
        Incandescence: {
            tier1: {
                core: {
                    salvage: ["1x EnchantedSand", "1x ArcaneCantrip", "1x BiomorphicGoo"],
                    prerequisites: []
                },
            },
            tier2: {
                core: {
                    salvage: ["1x NanotechGrowthMedium", "1x BiomorphicGoo", "1x GluonCompound"],
                    prerequisites: ["Incandescence_Invocation"]
                },
                radial: {
                    salvage: ["1x DetailedReports", "1x NanotechGrowthMedium", "1x WornSpellbook"],
                    prerequisites: ["Incandescence_Invocation"]
                }
            },
            tier3: {
                core: {
                    salvage: ["1x EnchantedSand", "1x DetailedReports", "1x SemiConsciousEnergy"],
                    prerequisites: ["Incandescence_Core_Invocation"]
                },
                radial: {
                    salvage: ["1x GenomicAnalysis", "1x BiomorphicGoo", "1x SuperconductiveMembrane"],
                    prerequisites: ["Incandescence_Radial_Invocation"]
                }
            },
            tier4: {
                core: {
                    salvage: ["1x DetailedReports", "1x BiomorphicGoo", "1x SelfEvolvingAlloy"],
                    prerequisites: ["Incandescence_Partial_Core_Invocation", "Incandescence_Partial_Radial_Invocation"]
                },
                radial: {
                    salvage: ["1x SuperchargedCapacitor", "1x ArcaneCantrip", "1x ThaumicResonator"],
                    prerequisites: ["Incandescence_Partial_Core_Invocation", "Incandescence_Partial_Radial_Invocation"]
                }
            },
        },
        Rebirth: {
            tier1: {
                core: {
                    salvage: ["2x GenomicAnalysis", "1x ArcaneCantrip"],
                    prerequisites: []
                },
            },
            tier2: {
                core: {
                    salvage: ["2x SuperchargedCapacitor", "1x WornSpellbook"],
                    prerequisites: ["Rebirth_Invocation"]
                },
                radial: {
                    salvage: ["1x SuperchargedCapacitor", "1x BiomorphicGoo", "1x DimensionalPocket"],
                    prerequisites: ["Rebirth_Invocation"]
                }
            },
            tier3: {
                core: {
                    salvage: ["1x NanotechGrowthMedium", "1x GenomicAnalysis", "1x AncientTexts"],
                    prerequisites: ["Rebirth_Core_Invocation"]
                },
                radial: {
                    salvage: ["1x EnchantedSand", "1x DetailedReports", "1x AncientTexts"],
                    prerequisites: ["Rebirth_Radial_Invocation"]
                }
            },
            tier4: {
                core: {
                    salvage: ["1x EnchantedSand", "1x DetailedReports", "1x LivingRelic"],
                    prerequisites: ["Rebirth_Partial_Core_Invocation", "Rebirth_Partial_Radial_Invocation"]
                },
                radial: {
                    salvage: ["1x GenomicAnalysis", "1x EnchantedSand", "1x ForbiddenTechnique"],
                    prerequisites: ["Rebirth_Partial_Core_Invocation", "Rebirth_Partial_Radial_Invocation"]
                }
            },
        },
        Clarion: {
            tier1: {
                core: {
                    salvage: ["1x EnchantedSand", "1x ArcaneCantrip", "1x BiomorphicGoo"],
                    prerequisites: []
                },
            },
            tier2: {
                core: {
                    salvage: ["1x NanotechGrowthMedium", "1x BiomorphicGoo", "1x GluonCompound"],
                    prerequisites: ["Clarion_Invocation"]
                },
                radial: {
                    salvage: ["1x DetailedReports", "1x NanotechGrowthMedium", "1x WornSpellbook"],
                    prerequisites: ["Clarion_Invocation"]
                }
            },
            tier3: {
                core: {
                    salvage: ["1x EnchantedSand", "1x DetailedReports", "1x SemiConsciousEnergy"],
                    prerequisites: ["Clarion_Core_Invocation"]
                },
                radial: {
                    salvage: ["1x GenomicAnalysis", "1x BiomorphicGoo", "1x SuperconductiveMembrane"],
                    prerequisites: ["Clarion_Radial_Invocation"]
                }
            },
            tier4: {
                core: {
                    salvage: ["1x DetailedReports", "1x BiomorphicGoo", "1x SelfEvolvingAlloy"],
                    prerequisites: ["Clarion_Partial_Core_Invocation", "Clarion_Partial_Radial_Invocation"]
                },
                radial: {
                    salvage: ["1x SuperchargedCapacitor", "1x ArcaneCantrip", "1x ThaumicResonator"],
                    prerequisites: ["Clarion_Partial_Core_Invocation", "Clarion_Partial_Radial_Invocation"]
                }
            },
        },
        Barrier: {
            tier1: {
                core: {
                    salvage: ["1x NanotechGrowthMedium", "1x ArcaneCantrip", "1x GenomicAnalysis"],
                    prerequisites: []
                },
            },
            tier2: {
                core: {
                    salvage: ["1x DetailedReports", "1x MeditationTechniques", "1x GluonCompound"],
                    prerequisites: ["Barrier_Invocation"]
                },
                radial: {
                    salvage: ["1x MeditationTechniques", "1x ArcaneCantrip", "1x DimensionalPocket"],
                    prerequisites: ["Barrier_Invocation"]
                }
            },
            tier3: {
                core: {
                    salvage: ["1x MeditationTechniques", "1x BiomorphicGoo", "1x SuperconductiveMembrane"],
                    prerequisites: ["Barrier_Core_Invocation"]
                },
                radial: {
                    salvage: ["1x SuperchargedCapacitor", "1x ArcaneCantrip", "1x AncientTexts"],
                    prerequisites: ["Barrier_Radial_Invocation"]
                }
            },
            tier4: {
                core: {
                    salvage: ["1x NanotechGrowthMedium", "1x GenomicAnalysis", "1x ForbiddenTechnique"],
                    prerequisites: ["Barrier_Partial_Core_Invocation", "Barrier_Partial_Radial_Invocation"]
                },
                radial: {
                    salvage: ["1x DetailedReports", "1x GenomicAnalysis", "1x LivingRelic"],
                    prerequisites: ["Barrier_Partial_Core_Invocation", "Barrier_Partial_Radial_Invocation"]
                }
            },
        },
        Ageless: {
            tier1: {
                core: {
                    salvage: ["1x GenomicAnalysis", "1x NanotechGrowthMedium", "1x EnchantedSand"],
                    prerequisites: []
                },
            },
            tier2: {
                core: {
                    salvage: ["2x MeditationTechniques", "1x WornSpellbook"],
                    prerequisites: ["Ageless_Invocation"]
                },
                radial: {
                    salvage: ["1x DetailedReports", "1x GenomicAnalysis", "1x CytoliticInfusion"],
                    prerequisites: ["Ageless_Invocation"]
                }
            },
            tier3: {
                core: {
                    salvage: ["1x EnchantedSand", "1x NanotechGrowthMedium", "1x AncientTexts"],
                    prerequisites: ["Ageless_Core_Invocation"]
                },
                radial: {
                    salvage: ["1x DetailedReports", "1x ArcaneCantrip", "1x SemiConsciousEnergy"],
                    prerequisites: ["Ageless_Radial_Invocation"]
                }
            },
            tier4: {
                core: {
                    salvage: ["2x BiomorphicGoo", "1x SelfEvolvingAlloy"],
                    prerequisites: ["Ageless_Partial_Core_Invocation", "Ageless_Partial_Radial_Invocation"]
                },
                radial: {
                    salvage: ["1x NanotechGrowthMedium", "1x DetailedReports", "1x LivingRelic"],
                    prerequisites: ["Ageless_Partial_Core_Invocation", "Ageless_Partial_Radial_Invocation"]
                }
            },
        },
    },
    hybrid: {
        Support: {
            tier1: {
                core: {
                    salvage: ["2x SuperchargedCapacitor", "1x ArcaneCantrip"],
                    prerequisites: []
                },
            },
            tier2: {
                core: {
                    salvage: ["1x EnchantedSand", "1x ArcaneCantrip", "1x GluonCompound"],
                    prerequisites: ["Support_Genome"]
                },
                radial: {
                    salvage: ["1x DetailedReports", "1x GenomicAnalysis", "1x CytoliticInfusion"],
                    prerequisites: ["Support_Genome"]
                }
            },
            tier3: {
                core: {
                    salvage: ["1x NanotechGrowthMedium", "1x DetailedReports", "1x ExoticIsotope"],
                    prerequisites: ["Support_Genome_2"]
                },
                radial: {
                    salvage: ["1x MeditationTechniques", "1x EnchantedSand", "1x ExoticIsotope"],
                    prerequisites: ["Support_Genome_3"]
                }
            },
            tier4: {
                core: {
                    salvage: ["1x GenomicAnalysis", "1x BiomorphicGoo", "1x SelfEvolvingAlloy"],
                    prerequisites: ["Support_Genome_5", "Support_Genome_6"]
                },
                radial: {
                    salvage: ["1x BiomorphicGoo", "1x EnchantedSand", "1x ThaumicResonator"],
                    prerequisites: ["Support_Genome_5", "Support_Genome_6"]
                }
            },
        },
        Melee: {
            tier1: {
                core: {
                    salvage: ["1x NanotechGrowthMedium", "1x SuperchargedCapacitor", "1x DetailedReports"],
                    prerequisites: []
                },
            },
            tier2: {
                core: {
                    salvage: ["1x BiomorphicGoo", "1x DetailedReports", "1x WornSpellbook"],
                    prerequisites: ["Melee_Genome_1"]
                },
                radial: {
                    salvage: ["1x NanotechGrowthMedium", "1x DetailedReports", "1x GluonCompound"],
                    prerequisites: ["Melee_Genome_1"]
                }
            },
            tier3: {
                core: {
                    salvage: ["1x BiomorphicGoo", "1x MeditationTechniques", "1x AncientTexts"],
                    prerequisites: ["Melee_Genome_2"]
                },
                radial: {
                    salvage: ["1x MeditationTechniques", "1x SuperchargedCapacitor", "1x ExoticIsotope"],
                    prerequisites: ["Melee_Genome_3"]
                }
            },
            tier4: {
                core: {
                    salvage: ["1x GenomicAnalysis", "1x MeditationTechniques", "1x ThaumicResonator"],
                    prerequisites: ["Melee_Genome_5", "Melee_Genome_6"]
                },
                radial: {
                    salvage: ["1x SuperchargedCapacitor", "1x NanotechGrowthMedium", "1x LivingRelic"],
                    prerequisites: ["Melee_Genome_5", "Melee_Genome_6"]
                }
            },
        },
        Control: {
            tier1: {
                core: {
                    salvage: ["1x DetailedReports", "1x MeditationTechniques", "1x EnchantedSand"],
                    prerequisites: []
                },
            },
            tier2: {
                core: {
                    salvage: ["1x SuperchargedCapacitor", "1x NanotechGrowthMedium", "1x CytoliticInfusion"],
                    prerequisites: ["Control_Genome"]
                },
                radial: {
                    salvage: ["1x NanotechGrowthMedium", "1x MeditationTechniques", "1x DimensionalPocket"],
                    prerequisites: ["Control_Genome"]
                }
            },
            tier3: {
                core: {
                    salvage: ["1x NanotechGrowthMedium", "1x EnchantedSand", "1x SemiConsciousEnergy"],
                    prerequisites: ["Control_Core_Genome"]
                },
                radial: {
                    salvage: ["1x EnchantedSand", "1x BiomorphicGoo", "1x SemiConsciousEnergy"],
                    prerequisites: ["Control_Radial_Genome"]
                }
            },
            tier4: {
                core: {
                    salvage: ["1x BiomorphicGoo", "1x DetailedReports", "1x SelfEvolvingAlloy"],
                    prerequisites: ["Control_Partial_Core_Graft", "Control_Partial_Radial_Graft"]
                },
                radial: {
                    salvage: ["1x NanotechGrowthMedium", "1x EnchantedSand", "1x ForbiddenTechnique"],
                    prerequisites: ["Control_Partial_Core_Graft", "Control_Partial_Radial_Graft"]
                }
            },
        },
        Assault: {
            tier1: {
                core: {
                    salvage: ["1x GenomicAnalysis", "1x EnchantedSand", "1x ArcaneCantrip"],
                    prerequisites: []
                },
            },
            tier2: {
                core: {
                    salvage: ["1x DetailedReports", "1x ArcaneCantrip", "1x WornSpellbook"],
                    prerequisites: ["Assault_Genome"]
                },
                radial: {
                    salvage: ["1x ArcaneCantrip", "1x GenomicAnalysis", "1x DimensionalPocket"],
                    prerequisites: ["Assault_Genome"]
                }
            },
            tier3: {
                core: {
                    salvage: ["1x DetailedReports", "1x NanotechGrowthMedium", "1x AncientTexts"],
                    prerequisites: ["Assault_Core_Genome"]
                },
                radial: {
                    salvage: ["1x EnchantedSand", "1x GenomicAnalysis", "1x ExoticIsotope"],
                    prerequisites: ["Assault_Radial_Genome"]
                }
            },
            tier4: {
                core: {
                    salvage: ["1x DetailedReports", "1x ArcaneCantrip", "1x LivingRelic"],
                    prerequisites: ["Assault_Partial_Core_Graft", "Assault_Partial_Radial_Graft"]
                },
                radial: {
                    salvage: ["1x NanotechGrowthMedium", "1x MeditationTechniques", "1x ForbiddenTechnique"],
                    prerequisites: ["Assault_Partial_Core_Graft", "Assault_Partial_Radial_Graft"]
                }
            },
        },
    },
};

if (typeof module !== "undefined" && module.exports) {
    module.exports = IncarnateComponents;
}