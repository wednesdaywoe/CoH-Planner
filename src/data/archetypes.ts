/**
 * Archetype definitions
 * Migrated from legacy/js/data/archetypes.js
 */

import type { Archetype, ArchetypeId, ArchetypeRegistry } from '@/types';

// ============================================
// PER-LEVEL HP TABLES (from attrib_max.hit_points)
// Index 0 = level 1, index 49 = level 50
// ============================================

/** Controller, Defender, Dominator */
const HP_TABLE_SQUISHY: number[] = [
  99.0, 109.3398, 120.3991, 132.2534, 144.9259,
  158.3561, 172.4508, 187.366, 203.1062, 219.6715,
  237.0572, 255.2533, 274.2442, 294.0087, 314.5194,
  335.743, 357.6397, 380.1636, 403.2622, 426.8769,
  452.1326, 477.9041, 504.1183, 530.6957, 557.5506,
  584.5918, 611.7228, 638.8425, 665.8456, 692.623,
  719.0631, 745.0521, 770.4748, 795.2156, 819.1593,
  842.1917, 864.2009, 885.0782, 904.7185, 923.0217,
  939.8931, 955.2447, 968.9955, 981.0725, 991.4112,
  999.9562, 1006.6618, 1011.4922, 1014.422, 1017.3519,
];

/** Corruptor, Peacebringer, Warshade, Arachnos Soldier, Arachnos Widow */
const HP_TABLE_LOW_MID: number[] = [
  100.0, 110.5, 121.7997, 133.9275, 146.9091,
  160.7676, 175.5225, 191.1898, 207.7812, 225.3041,
  243.7607, 263.1478, 283.4566, 304.6722, 326.7734,
  349.7323, 373.514, 398.077, 423.3724, 449.3441,
  475.929, 503.057, 530.6509, 558.627, 586.8953,
  615.3598, 643.9188, 672.4658, 700.8901, 729.0768,
  756.9086, 784.2654, 811.0261, 837.0691, 862.2729,
  886.5175, 909.6852, 931.6613, 952.3353, 971.6017,
  989.3612, 1005.5207, 1019.9953, 1032.7079, 1043.5907,
  1052.5854, 1059.644, 1064.7286, 1067.8127, 1070.8967,
];

/** Blaster, Sentinel, Stalker */
const HP_TABLE_MID: number[] = [
  102.5, 113.4006, 125.3015, 138.1128, 151.8673,
  166.7964, 183.2016, 200.7492, 219.4689, 239.3856,
  260.5192, 282.8838, 306.4874, 331.331, 357.4084,
  384.7055, 413.1999, 442.8607, 473.6479, 505.5121,
  535.4202, 565.9391, 596.9823, 628.4554, 660.2573,
  692.2797, 724.4086, 756.5241, 788.5013, 820.2114,
  851.5221, 882.2986, 912.4044, 941.7027, 970.057,
  997.3322, 1023.3958, 1048.1189, 1071.3772, 1093.052,
  1113.0312, 1131.2108, 1147.4948, 1161.7964, 1174.0396,
  1184.1586, 1192.0995, 1197.8197, 1201.2893, 1204.7588,
];

/** Scrapper */
const HP_TABLE_SCRAPPER: number[] = [
  105.0, 116.3013, 128.8032, 142.298, 156.8255,
  172.8251, 190.8807, 210.3087, 231.1566, 253.4671,
  277.2778, 302.6199, 329.5183, 357.9898, 388.0434,
  419.6787, 452.8858, 487.6444, 523.9233, 561.6801,
  594.9113, 628.8212, 663.3136, 698.2838, 733.6192,
  769.1997, 804.8985, 840.5823, 876.1126, 911.346,
  946.1357, 980.3317, 1013.7827, 1046.3364, 1077.8411,
  1108.1469, 1137.1064, 1164.5767, 1190.4191, 1214.5022,
  1236.7014, 1256.9009, 1274.9941, 1290.8848, 1304.4884,
  1315.7318, 1324.5551, 1330.9108, 1334.7657, 1338.6208,
];

/** Brute */
const HP_TABLE_BRUTE: number[] = [
  108.0, 119.782, 133.0053, 147.3203, 162.7753,
  180.0597, 200.0956, 221.7801, 245.1819, 270.3649,
  297.388, 326.3032, 357.1553, 389.9804, 424.8054,
  461.6466, 500.5088, 541.3848, 584.2539, 629.0817,
  666.3006, 704.2798, 742.9113, 782.0779, 821.6535,
  861.5037, 901.4863, 941.4522, 981.2461, 1020.7076,
  1059.672, 1097.9716, 1135.4366, 1171.8967, 1207.1821,
  1241.1245, 1273.5593, 1304.3258, 1333.2694, 1360.2424,
  1385.1056, 1407.729, 1427.9934, 1445.791, 1461.027,
  1473.6198, 1483.5016, 1490.6201, 1494.9377, 1499.2554,
];

/** Tanker */
const HP_TABLE_TANKER: number[] = [
  115.0, 127.9038, 142.8102, 159.0389, 176.6583,
  196.9403, 221.5971, 248.5467, 277.9074, 309.7932,
  344.3119, 381.5643, 421.6417, 464.6251, 510.5834,
  559.5716, 611.6293, 666.7791, 725.0252, 786.3522,
  832.8758, 880.3497, 928.6391, 977.5973, 1027.0668,
  1076.8796, 1126.8578, 1176.8152, 1226.5576, 1275.8845,
  1324.59, 1372.4644, 1419.2958, 1464.8708, 1508.9775,
  1551.4056, 1591.9491, 1630.4072, 1666.5867, 1700.3031,
  1731.382, 1759.6613, 1784.9917, 1807.2388, 1826.2837,
  1842.0247, 1854.377, 1863.2751, 1868.6722, 1874.0692,
];

/** Mastermind */
const HP_TABLE_MASTERMIND: number[] = [
  95.0, 104.6988, 114.7963, 125.5571, 136.9928,
  148.71, 160.1643, 172.0708, 184.4058, 197.1411,
  210.2436, 223.6756, 237.3949, 251.3546, 265.5034,
  279.7858, 294.1423, 308.5097, 322.8215, 337.0081,
  356.9468, 377.2927, 397.9882, 418.9703, 440.1715,
  461.5198, 482.9391, 504.3494, 525.6675, 546.8076,
  567.6814, 588.199, 608.2696, 627.8018, 646.7047,
  664.8881, 682.2639, 698.7459, 714.2515, 728.7013,
  742.0209, 754.1405, 764.9964, 774.5309, 782.693,
  789.4391, 794.733, 798.5465, 800.8595, 803.1725,
];

// ============================================
// PER-LEVEL HP CAP TABLES (from attrib_max_max.hit_points)
// ============================================

/** Controller, Corruptor, Defender, Dominator, Mastermind */
const HP_CAP_STANDARD: number[] = [
  150.0, 165.75, 182.6996, 200.8913, 220.3637,
  241.1514, 263.2837, 286.7846, 311.6718, 337.9562,
  365.641, 394.7216, 425.1849, 457.0083, 490.1601,
  524.5984, 560.2711, 597.1156, 635.0586, 674.0162,
  713.8935, 754.5855, 795.9763, 837.9406, 880.343,
  923.0396, 965.8782, 1008.6987, 1051.3351, 1093.6154,
  1135.3628, 1176.3981, 1216.5392, 1255.6036, 1293.4094,
  1329.7762, 1364.5278, 1397.4919, 1428.5029, 1457.4026,
  1484.0417, 1508.2811, 1529.9929, 1549.0618, 1565.3861,
  1578.8782, 1589.4659, 1597.0929, 1601.719, 1606.3451,
];

/** Blaster */
const HP_CAP_BLASTER: number[] = [
  154.5, 170.9711, 189.0028, 208.4247, 229.2885,
  252.0032, 277.1061, 303.9917, 332.7097, 363.3029,
  395.8064, 430.2466, 466.6404, 504.9942, 545.3031,
  587.5502, 631.7056, 677.7262, 725.5544, 775.1186,
  820.9776, 867.7733, 915.3728, 963.6316, 1012.3945,
  1061.4956, 1110.7599, 1160.0035, 1209.0354, 1257.6575,
  1305.6674, 1352.8578, 1399.0201, 1443.9442, 1487.4208,
  1529.2427, 1569.2069, 1607.1157, 1642.7783, 1676.0129,
  1706.6479, 1734.5232, 1759.4918, 1781.4211, 1800.194,
  1815.71, 1827.8859, 1836.6569, 1841.9769, 1847.2968,
];

/** Sentinel, Stalker */
const HP_CAP_SENTINEL: number[] = [
  159.0, 176.1923, 195.3059, 215.9581, 238.2132,
  262.855, 290.9285, 321.1988, 353.7475, 388.6496,
  425.9718, 465.7715, 508.0959, 552.9801, 600.4461,
  650.502, 703.1402, 758.3368, 816.0503, 876.221,
  928.0616, 980.9611, 1034.7692, 1089.3228, 1144.4459,
  1199.9515, 1255.6416, 1311.3083, 1366.7356, 1421.6998,
  1475.9717, 1529.3175, 1581.501, 1632.2847, 1681.4323,
  1728.7092, 1773.8861, 1816.7395, 1857.0538, 1894.6234,
  1929.2542, 1960.7654, 1988.9907, 2013.7804, 2035.002,
  2052.5417, 2066.3059, 2076.2207, 2082.2346, 2088.2485,
];

/** Scrapper, Peacebringer, Warshade, Arachnos Soldier, Arachnos Widow */
const HP_CAP_SCRAPPER: number[] = [
  165.0, 183.1538, 203.7101, 226.0027, 250.1128,
  277.3241, 309.3584, 344.1416, 381.798, 422.4452,
  466.1923, 513.1381, 563.3699, 616.9612, 673.9701,
  734.4377, 798.3863, 865.8176, 936.7114, 1011.0242,
  1070.8403, 1131.8782, 1193.9645, 1256.9108, 1320.5145,
  1384.5594, 1448.8173, 1513.0481, 1577.0026, 1640.4229,
  1703.0442, 1764.597, 1824.8088, 1883.4055, 1940.114,
  1994.6644, 2046.7917, 2096.2378, 2142.7544, 2186.104,
  2226.0625, 2262.4216, 2294.9893, 2323.5928, 2348.0791,
  2368.3174, 2384.199, 2395.6394, 2402.5786, 2409.5176,
];

/** Brute */
const HP_CAP_BRUTE: number[] = [
  180.0, 200.5575, 224.7205, 251.1141, 279.8619,
  313.4968, 355.433, 401.4985, 451.9242, 506.9343,
  566.7435, 631.5546, 701.555, 776.9141, 857.7802,
  944.2771, 1036.5015, 1134.5197, 1238.3643, 1348.0323,
  1427.7871, 1509.1709, 1591.9528, 1675.8811, 1760.686,
  1846.0793, 1931.7563, 2017.3975, 2102.6702, 2187.2305,
  2270.7256, 2352.7961, 2433.0784, 2511.2073, 2586.8186,
  2659.5525, 2729.0557, 2794.9839, 2857.0059, 2914.8052,
  2968.0835, 3016.5623, 3059.9858, 3098.1235, 3130.7722,
  3157.7563, 3178.9319, 3194.1858, 3203.438, 3212.6902,
];

/** Tanker */
const HP_CAP_TANKER: number[] = [
  186.0, 207.519, 233.1247, 261.1587, 291.7616,
  327.9659, 373.8629, 424.4413, 479.9746, 540.7299,
  606.964, 678.9212, 756.8291, 840.8953, 931.3042,
  1028.2128, 1131.7476, 1242.0004, 1359.0254, 1482.8354,
  1570.5658, 1660.088, 1751.1479, 1843.4692, 1936.7546,
  2030.6873, 2124.9319, 2219.1372, 2312.9373, 2405.9536,
  2497.7981, 2588.0757, 2676.3862, 2762.3279, 2845.5005,
  2925.5078, 3001.9612, 3074.4822, 3142.7063, 3206.2859,
  3264.8918, 3318.2185, 3365.9844, 3407.936, 3443.8494,
  3473.532, 3496.8252, 3513.6045, 3523.7817, 3533.959,
];

export const ARCHETYPES: ArchetypeRegistry = {
  // ============================================
  // HERO ARCHETYPES
  // ============================================

  blaster: {
    name: 'Blaster',
    side: 'hero',
    description: 'Ranged damage specialist with high offensive power but low defenses',
    inherent: {
      name: 'Defiance',
      description: 'Attacking grants stacking damage bonus. First two Primary and first Secondary power usable while mezzed.',
    },
    stats: {
      baseHP: 1204.7588,
      maxHP: 1847.2968,
      hpTable: HP_TABLE_MID,
      hpCapTable: HP_CAP_BLASTER,
      baseEndurance: 100,
      baseRecovery: 1.67,
      baseThreat: 1.0,
      damageModifier: {
        melee: 0.5,
        ranged: 1.125,
        aoe: 1.0,
      },
      buffDebuffModifier: 0.625,
    },
    primarySets: [
      'blaster/archery',
      'blaster/assault-rifle',
      'blaster/beam-rifle',
      'blaster/dark-blast',
      'blaster/dual-pistols',
      'blaster/electrical-blast',
      'blaster/energy-blast',
      'blaster/fire-blast',
      'blaster/ice-blast',
      'blaster/psychic-blast',
      'blaster/radiation-blast',
      'blaster/seismic-blast',
      'blaster/sonic-attack',
      'blaster/storm-blast',
      'blaster/water-blast',
    ],
    secondarySets: [
      'blaster/darkness-manipulation',
      'blaster/earth-manipulation',
      'blaster/electricity-manipulation',
      'blaster/energy-manipulation',
      'blaster/fire-manipulation',
      'blaster/gadgets',
      'blaster/ice-manipulation',
      'blaster/martial-manipulation',
      'blaster/mental-manipulation',
      'blaster/ninja-training',
      'blaster/plant-manipulation',
      'blaster/radiation-manipulation',
      'blaster/sonic-manipulation',
      'blaster/tactical-arrow',
      'blaster/time-manipulation',
    ],
  },

  controller: {
    name: 'Controller',
    side: 'hero',
    description: 'Mezzes enemies and buffs/debuffs with strong team support',
    inherent: {
      name: 'Containment',
      description: 'Double damage vs Held, Immobilized, Slept, or Disoriented targets. Applied after enhancements.',
    },
    stats: {
      baseHP: 1017.3519,
      maxHP: 1606.3451,
      hpTable: HP_TABLE_SQUISHY,
      hpCapTable: HP_CAP_STANDARD,
      baseEndurance: 100,
      baseRecovery: 1.67,
      baseThreat: 1.0,
      damageModifier: {
        melee: 0.55,
        ranged: 0.55,
        aoe: 0.5,
      },
      buffDebuffModifier: 1.0,
    },
    primarySets: [
      'controller/arsenal-control',
      'controller/darkness-control',
      'controller/earth-control',
      'controller/electric-control',
      'controller/fire-control',
      'controller/gravity-control',
      'controller/ice-control',
      'controller/illusion-control',
      'controller/mind-control',
      'controller/plant-control',
      'controller/pyrotechnic-control',
      'controller/symphony-control',
    ],
    secondarySets: [
      'controller/cold-domination',
      'controller/darkness-affinity',
      'controller/empathy',
      'controller/force-field',
      'controller/kinetics',
      'controller/marine-affinity',
      'controller/nature-affinity',
      'controller/pain-domination',
      'controller/poison',
      'controller/radiation-emission',
      'controller/shock-therapy',
      'controller/sonic-debuff',
      'controller/storm-summoning',
      'controller/thermal-radiation',
      'controller/time-manipulation',
      'controller/traps',
      'controller/trick-arrow',
    ],
  },

  defender: {
    name: 'Defender',
    side: 'hero',
    description: 'Support specialist with powerful buffs, debuffs, and healing',
    inherent: {
      name: 'Vigilance',
      description: 'Solo/small teams: +6-30% damage (scales with level). Endurance discount when teammates are injured. 3+ teammates = no damage bonus.',
    },
    stats: {
      baseHP: 1017.3519,
      maxHP: 1606.3451,
      hpTable: HP_TABLE_SQUISHY,
      hpCapTable: HP_CAP_STANDARD,
      baseEndurance: 100,
      baseRecovery: 1.67,
      baseThreat: 1.0,
      damageModifier: {
        melee: 0.55,
        ranged: 0.65,
        aoe: 0.5,
      },
      buffDebuffModifier: 1.25,
    },
    primarySets: [
      'defender/cold-domination',
      'defender/dark-miasma',
      'defender/empathy',
      'defender/force-field',
      'defender/kinetics',
      'defender/marine-affinity',
      'defender/nature-affinity',
      'defender/pain-domination',
      'defender/poison',
      'defender/radiation-emission',
      'defender/shock-therapy',
      'defender/sonic-debuff',
      'defender/storm-summoning',
      'defender/thermal-radiation',
      'defender/time-manipulation',
      'defender/traps',
      'defender/trick-arrow',
    ],
    secondarySets: [
      'defender/archery',
      'defender/assault-rifle',
      'defender/beam-rifle',
      'defender/dark-blast',
      'defender/dual-pistols',
      'defender/electrical-blast',
      'defender/energy-blast',
      'defender/fire-blast',
      'defender/ice-blast',
      'defender/psychic-blast',
      'defender/radiation-blast',
      'defender/seismic-blast',
      'defender/sonic-attack',
      'defender/storm-blast',
      'defender/water-blast',
    ],
  },

  scrapper: {
    name: 'Scrapper',
    side: 'hero',
    description: 'Melee damage dealer with good survivability through defense/resistance',
    inherent: {
      name: 'Critical Hit',
      description: '5% crit chance vs minions (double damage), 10% vs lieutenants/bosses. Average +5-10% damage bonus.',
    },
    stats: {
      baseHP: 1338.6208,
      maxHP: 2409.5176,
      hpTable: HP_TABLE_SCRAPPER,
      hpCapTable: HP_CAP_SCRAPPER,
      baseEndurance: 100,
      baseRecovery: 1.67,
      baseThreat: 3.0,
      damageModifier: {
        melee: 1.125,
        ranged: 0.5,
        aoe: 0.8,
      },
      buffDebuffModifier: 1.0,
    },
    primarySets: [
      'scrapper/battle-axe',
      'scrapper/street_justice',
      'scrapper/broad-sword',
      'scrapper/claws',
      'scrapper/dark-melee',
      'scrapper/dual-blades',
      'scrapper/electrical-melee',
      'scrapper/energy-melee',
      'scrapper/fiery-melee',
      'scrapper/ice-melee',
      'scrapper/katana',
      'scrapper/kinetic-attack',
      'scrapper/martial-arts',
      'scrapper/psionic-melee',
      'scrapper/quills',
      'scrapper/radiation-melee',
      'scrapper/savage-melee',
      'scrapper/staff-fighting',
      'scrapper/stone-melee',
      'scrapper/titan-weapons',
      'scrapper/war-mace',
    ],
    secondarySets: [
      'scrapper/bio-organic-armor',
      'scrapper/dark-armor',
      'scrapper/electric-armor',
      'scrapper/energy-aura',
      'scrapper/fiery-aura',
      'scrapper/ice-armor',
      'scrapper/invulnerability',
      'scrapper/ninjitsu',
      'scrapper/psionic-armor',
      'scrapper/radiation-armor',
      'scrapper/regeneration',
      'scrapper/shield-defense',
      'scrapper/stone-armor',
      'scrapper/super-reflexes',
      'scrapper/willpower',
    ],
  },

  tanker: {
    name: 'Tanker',
    side: 'hero',
    description: 'Extremely tough with highest HP and strong defensive powers',
    inherent: {
      name: 'Gauntlet',
      description: 'PunchVoke: ST attacks taunt target + 4 nearby, AoE taunts all. +50% AoE radius/range, +50% cone arc. PBAoE hits bonus targets at 33% damage.',
    },
    stats: {
      baseHP: 1874.0692,
      maxHP: 3533.959,
      hpTable: HP_TABLE_TANKER,
      hpCapTable: HP_CAP_TANKER,
      baseEndurance: 100,
      baseRecovery: 1.67,
      baseThreat: 4.0,
      damageModifier: {
        melee: 0.8,
        ranged: 0.5,
        aoe: 0.7,
      },
      buffDebuffModifier: 1.0,
    },
    primarySets: [
      'tanker/bio-organic-armor',
      'tanker/dark-armor',
      'tanker/electric-armor',
      'tanker/energy-aura',
      'tanker/fiery-aura',
      'tanker/ice-armor',
      'tanker/invulnerability',
      'tanker/psionic-armor',
      'tanker/radiation-armor',
      'tanker/regeneration',
      'tanker/shield-defense',
      'tanker/stone-armor',
      'tanker/super-reflexes',
      'tanker/willpower',
    ],
    secondarySets: [
      'tanker/battle-axe',
      'tanker/street_justice',
      'tanker/broad-sword',
      'tanker/claws',
      'tanker/dark-melee',
      'tanker/dual-blades',
      'tanker/electrical-melee',
      'tanker/energy-melee',
      'tanker/fiery-melee',
      'tanker/ice-melee',
      'tanker/katana',
      'tanker/kinetic-attack',
      'tanker/martial-arts',
      'tanker/psionic-melee',
      'tanker/radiation-melee',
      'tanker/savage-melee',
      'tanker/spines',
      'tanker/staff-fighting',
      'tanker/stone-melee',
      'tanker/super-strength',
      'tanker/titan-weapons',
      'tanker/war-mace',
    ],
  },

  sentinel: {
    name: 'Sentinel',
    side: 'hero',
    description: 'Homecoming exclusive: Ranged damage with built-in armor for survivability',
    inherent: {
      name: 'Opportunity',
      description: 'Build meter by attacking. When full, T1/T2 attacks apply debuffs to enemy: -11.25% Def, -15% Res (all types), -15% Mez Res, -150ft Stealth.',
    },
    stats: {
      baseHP: 1204.7588,
      maxHP: 2088.2485,
      hpTable: HP_TABLE_MID,
      hpCapTable: HP_CAP_SENTINEL,
      baseEndurance: 100,
      baseRecovery: 1.67,
      baseThreat: 2.5,
      damageModifier: {
        melee: 0.65,
        ranged: 0.95,
        aoe: 0.8,
      },
      buffDebuffModifier: 1.0,
    },
    primarySets: [
      'sentinel/archery',
      'sentinel/assault-rifle',
      'sentinel/beam-rifle',
      'sentinel/dark-blast',
      'sentinel/dual-pistols',
      'sentinel/electrical-blast',
      'sentinel/energy-blast',
      'sentinel/fire-blast',
      'sentinel/ice-blast',
      'sentinel/psychic-blast',
      'sentinel/radiation-blast',
      'sentinel/seismic-blast',
      'sentinel/sonic-attack',
      'sentinel/storm-blast',
      'sentinel/water-blast',
    ],
    secondarySets: [
      'sentinel/bio-organic-armor',
      'sentinel/dark-armor',
      'sentinel/electric-armor',
      'sentinel/energy-aura',
      'sentinel/fiery-aura',
      'sentinel/ice-armor',
      'sentinel/invulnerability',
      'sentinel/ninjitsu',
      'sentinel/psionic-armor',
      'sentinel/radiation-armor',
      'sentinel/regeneration',
      'sentinel/stone-armor',
      'sentinel/super-reflexes',
      'sentinel/willpower',
    ],
  },

  // ============================================
  // VILLAIN ARCHETYPES
  // ============================================

  brute: {
    name: 'Brute',
    side: 'villain',
    description: 'High damage melee fighter that builds fury through combat',
    inherent: {
      name: 'Fury',
      description: 'Build fury (0-100) by attacking and being attacked. Each fury point grants +2% damage, up to +200% at max fury.',
    },
    stats: {
      baseHP: 1499.2554,
      maxHP: 3212.6902,
      hpTable: HP_TABLE_BRUTE,
      hpCapTable: HP_CAP_BRUTE,
      baseEndurance: 100,
      baseRecovery: 1.67,
      baseThreat: 4.0,
      damageModifier: {
        melee: 0.75,
        ranged: 0.5,
        aoe: 0.65,
      },
      buffDebuffModifier: 1.0,
    },
    primarySets: [
      'brute/battle-axe',
      'brute/street_justice',
      'brute/broad-sword',
      'brute/claws',
      'brute/dark-melee',
      'brute/dual-blades',
      'brute/electrical-melee',
      'brute/energy-melee',
      'brute/fiery-melee',
      'brute/ice-melee',
      'brute/katana',
      'brute/kinetic-attack',
      'brute/martial-arts',
      'brute/psionic-melee',
      'brute/radiation-melee',
      'brute/savage-melee',
      'brute/spines',
      'brute/staff-fighting',
      'brute/stone-melee',
      'brute/super-strength',
      'brute/titan-weapons',
      'brute/war-mace',
    ],
    secondarySets: [
      'brute/bio-organic-armor',
      'brute/dark-armor',
      'brute/electric-armor',
      'brute/energy-aura',
      'brute/fiery-aura',
      'brute/ice-armor',
      'brute/invulnerability',
      'brute/psionic-armor',
      'brute/radiation-armor',
      'brute/regeneration',
      'brute/shield-defense',
      'brute/stone-armor',
      'brute/super-reflexes',
      'brute/willpower',
    ],
  },

  corruptor: {
    name: 'Corruptor',
    side: 'villain',
    description: 'Ranged damage dealer with debuffs and support abilities',
    inherent: {
      name: 'Scourge',
      description: 'Chance for double damage when enemies are below 50% HP. 2.5% per 1% below 50%, guaranteed at 10% HP. ~30% avg damage bonus.',
    },
    stats: {
      baseHP: 1070.8967,
      maxHP: 1606.3451,
      hpTable: HP_TABLE_LOW_MID,
      hpCapTable: HP_CAP_STANDARD,
      baseEndurance: 100,
      baseRecovery: 1.67,
      baseThreat: 1.0,
      damageModifier: {
        melee: 0.55,
        ranged: 0.75,
        aoe: 0.6,
      },
      buffDebuffModifier: 0.75,
    },
    primarySets: [
      'corruptor/archery',
      'corruptor/assault-rifle',
      'corruptor/beam-rifle',
      'corruptor/dark-blast',
      'corruptor/dual-pistols',
      'corruptor/electrical-blast',
      'corruptor/energy-blast',
      'corruptor/fire-blast',
      'corruptor/ice-blast',
      'corruptor/psychic-blast',
      'corruptor/radiation-blast',
      'corruptor/seismic-blast',
      'corruptor/sonic-attack',
      'corruptor/storm-blast',
      'corruptor/water-blast',
    ],
    secondarySets: [
      'corruptor/cold-domination',
      'corruptor/dark-miasma',
      'corruptor/empathy',
      'corruptor/force-field',
      'corruptor/kinetics',
      'corruptor/marine-affinity',
      'corruptor/nature-affinity',
      'corruptor/pain-domination',
      'corruptor/poison',
      'corruptor/radiation-emission',
      'corruptor/shock-therapy',
      'corruptor/sonic-resonance',
      'corruptor/storm-summoning',
      'corruptor/thermal-radiation',
      'corruptor/time-manipulation',
      'corruptor/traps',
      'corruptor/trick-arrow',
    ],
  },

  dominator: {
    name: 'Dominator',
    side: 'villain',
    description: 'Control specialist with strong offensive capabilities',
    inherent: {
      name: 'Domination',
      description: 'Build meter by attacking, activate at 90%+ for 2× mez magnitude, 1.5× mez duration, mez protection, and full endurance. Lasts 90s.',
    },
    stats: {
      baseHP: 1017.3519,
      maxHP: 1606.3451,
      hpTable: HP_TABLE_SQUISHY,
      hpCapTable: HP_CAP_STANDARD,
      baseEndurance: 100,
      baseRecovery: 1.67,
      baseThreat: 1.0,
      damageModifier: {
        melee: 0.75,
        ranged: 0.75,
        aoe: 0.65,
      },
      buffDebuffModifier: 0.9,
    },
    primarySets: [
      'dominator/arsenal-control',
      'dominator/darkness-control',
      'dominator/earth-control',
      'dominator/electric-control',
      'dominator/fire-control',
      'dominator/gravity-control',
      'dominator/ice-control',
      'dominator/illusion-control',
      'dominator/mind-control',
      'dominator/plant-control',
      'dominator/pyrotechnic-control',
      'dominator/symphony-control',
    ],
    secondarySets: [
      'dominator/arsenal-assault',
      'dominator/dark-assault',
      'dominator/earth-assault',
      'dominator/electricity-manipulation',
      'dominator/energy-assault',
      'dominator/fiery-assault',
      'dominator/icy-assault',
      'dominator/martial-assault',
      'dominator/psionic-assault',
      'dominator/radioactive-assault',
      'dominator/savage-assault',
      'dominator/sonic-assault',
      'dominator/thorny-assault',
    ],
  },

  mastermind: {
    name: 'Mastermind',
    side: 'villain',
    description: 'Pet commander with support abilities for minions',
    inherent: {
      name: 'Supremacy',
      description: 'Henchmen within 60ft gain +25% Damage and +10% ToHit. Bodyguard Mode (Defensive/Follow) splits damage: 66% to you, 33% to pets.',
    },
    stats: {
      baseHP: 803.1725,
      maxHP: 1606.3451,
      hpTable: HP_TABLE_MASTERMIND,
      hpCapTable: HP_CAP_STANDARD,
      baseEndurance: 100,
      baseRecovery: 1.67,
      baseThreat: 2.0,
      damageModifier: {
        melee: 0.55,
        ranged: 0.55,
        aoe: 0.5,
      },
      buffDebuffModifier: 0.75,
    },
    primarySets: [
      'mastermind/beast-mastery',
      'mastermind/demon-summoning',
      'mastermind/mercenaries',
      'mastermind/necromancy',
      'mastermind/ninjas',
      'mastermind/robotics',
      'mastermind/thugs',
    ],
    secondarySets: [
      'mastermind/cold-domination',
      'mastermind/dark-miasma',
      'mastermind/empathy',
      'mastermind/force-field',
      'mastermind/kinetics',
      'mastermind/marine-affinity',
      'mastermind/nature-affinity',
      'mastermind/pain-domination',
      'mastermind/poison',
      'mastermind/radiation-emission',
      'mastermind/shock-therapy',
      'mastermind/sonic-debuff',
      'mastermind/storm-summoning',
      'mastermind/thermal-radiation',
      'mastermind/time-manipulation',
      'mastermind/traps',
      'mastermind/trick-arrow',
    ],
  },

  stalker: {
    name: 'Stalker',
    side: 'villain',
    description: 'Stealthy assassin with critical strikes from hide',
    inherent: {
      name: 'Assassination',
      description: 'From Hide: 100% critical (double damage). Outside: 10% base + 3% per teammate. Assassin\'s Focus grants up to +100% crit for Assassin\'s Strike.',
    },
    stats: {
      baseHP: 1204.7588,
      maxHP: 2088.2485,
      hpTable: HP_TABLE_MID,
      hpCapTable: HP_CAP_SENTINEL,
      baseEndurance: 100,
      baseRecovery: 1.67,
      baseThreat: 2.0,
      damageModifier: {
        melee: 1.0,
        ranged: 0.6,
        aoe: 0.7,
      },
      buffDebuffModifier: 1.0,
    },
    primarySets: [
      'stalker/street_justice',
      'stalker/broad-sword',
      'stalker/claws',
      'stalker/dark-melee',
      'stalker/dual-blades',
      'stalker/electrical-melee',
      'stalker/energy-melee',
      'stalker/fiery-melee',
      'stalker/ice-melee',
      'stalker/kinetic-attack',
      'stalker/martial-arts',
      'stalker/ninja-sword',
      'stalker/psionic-melee',
      'stalker/radiation-melee',
      'stalker/savage-melee',
      'stalker/spines',
      'stalker/staff-fighting',
      'stalker/stone-melee',
    ],
    secondarySets: [
      'stalker/bio-organic-armor',
      'stalker/dark-armor',
      'stalker/electric-armor',
      'stalker/energy-aura',
      'stalker/fiery-aura',
      'stalker/ice-armor',
      'stalker/invulnerability',
      'stalker/ninjitsu',
      'stalker/psionic-armor',
      'stalker/radiation-armor',
      'stalker/regeneration',
      'stalker/shield-defense',
      'stalker/super-reflexes',
      'stalker/willpower',
    ],
  },

  // ============================================
  // EPIC ARCHETYPES - KHELDIANS (Hero)
  // ============================================

  peacebringer: {
    name: 'Peacebringer',
    side: 'hero',
    description:
      'Kheldian shapeshifter with access to multiple forms. Can transform between human, nova (ranged), and dwarf (melee/tank) forms.',
    inherent: {
      name: 'Energy Flight',
      description:
        'Innate ability to fly. Also provides access to Nova and Dwarf transformation forms.',
    },
    stats: {
      baseHP: 1070.8967,
      maxHP: 2409.5176,
      hpTable: HP_TABLE_LOW_MID,
      hpCapTable: HP_CAP_SCRAPPER,
      baseEndurance: 100,
      baseRecovery: 1.67,
      baseThreat: 2.0,
      damageModifier: {
        melee: 0.85,
        ranged: 0.8,
        aoe: 0.7,
      },
      buffDebuffModifier: 1.0,
    },
    primarySets: ['peacebringer/luminous-blast'],
    secondarySets: ['peacebringer/luminous-aura'],
  },

  warshade: {
    name: 'Warshade',
    side: 'hero',
    description:
      'Kheldian shapeshifter that feeds on defeated enemies. Can summon pets from fallen foes and transform between forms.',
    inherent: {
      name: 'Shadow Step',
      description:
        'Innate teleportation ability. Also provides access to Nova and Dwarf transformation forms.',
    },
    stats: {
      baseHP: 1070.8967,
      maxHP: 2409.5176,
      hpTable: HP_TABLE_LOW_MID,
      hpCapTable: HP_CAP_SCRAPPER,
      baseEndurance: 100,
      baseRecovery: 1.67,
      baseThreat: 2.0,
      damageModifier: {
        melee: 0.85,
        ranged: 0.8,
        aoe: 0.7,
      },
      buffDebuffModifier: 1.0,
    },
    primarySets: ['warshade/umbral-blast'],
    secondarySets: ['warshade/umbral-aura'],
  },

  // ============================================
  // EPIC ARCHETYPES - ARACHNOS (Villain)
  // ============================================

  'arachnos-soldier': {
    name: 'Arachnos Soldier',
    side: 'villain',
    description:
      'Versatile soldier with branching power choices. Can specialize as a Crab Spider (pets/support) or Bane Spider (stealth/melee).',
    inherent: {
      name: 'Conditioning',
      description: 'Increased maximum HP and inherent resistance to status effects.',
    },
    stats: {
      baseHP: 1070.8967,
      maxHP: 2409.5176,
      hpTable: HP_TABLE_LOW_MID,
      hpCapTable: HP_CAP_SCRAPPER,
      baseEndurance: 100,
      baseRecovery: 1.67,
      baseThreat: 2.0,
      damageModifier: {
        melee: 0.75,
        ranged: 0.75,
        aoe: 0.65,
      },
      buffDebuffModifier: 1.0,
    },
    primarySets: ['arachnos-soldier/arachnos-soldier'],
    secondarySets: ['arachnos-soldier/training-and-gadgets'],
    branches: {
      'bane-spider': {
        name: 'Bane Spider',
        level: 24,
        primarySet: 'arachnos-soldier/bane-spider-soldier',
        secondarySet: 'arachnos-soldier/bane-spider-training',
      },
      'crab-spider': {
        name: 'Crab Spider',
        level: 24,
        primarySet: 'arachnos-soldier/crab-spider-soldier',
        secondarySet: 'arachnos-soldier/crab-spider-training',
      },
    },
  },

  'arachnos-widow': {
    name: 'Arachnos Widow',
    side: 'villain',
    description:
      'Versatile operative with branching power choices. Can specialize as a Fortunata (psychic powers) or Night Widow (melee assassin).',
    inherent: {
      name: 'Conditioning',
      description: 'Increased maximum HP and inherent resistance to status effects.',
    },
    stats: {
      baseHP: 1070.8967,
      maxHP: 2409.5176,
      hpTable: HP_TABLE_LOW_MID,
      hpCapTable: HP_CAP_SCRAPPER,
      baseEndurance: 100,
      baseRecovery: 1.67,
      baseThreat: 2.0,
      damageModifier: {
        melee: 0.85,
        ranged: 0.65,
        aoe: 0.7,
      },
      buffDebuffModifier: 1.0,
    },
    primarySets: ['arachnos-widow/widow-training'],
    secondarySets: ['arachnos-widow/teamwork'],
    branches: {
      'night-widow': {
        name: 'Night Widow',
        level: 24,
        primarySet: 'arachnos-widow/night-widow-training',
        secondarySet: 'arachnos-widow/widow-teamwork',
      },
      fortunata: {
        name: 'Fortunata',
        level: 24,
        primarySet: 'arachnos-widow/fortunata-training',
        secondarySet: 'arachnos-widow/fortunata-teamwork',
      },
    },
  },
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get an archetype by ID
 */
export function getArchetype(id: ArchetypeId): Archetype | undefined {
  return ARCHETYPES[id];
}

/**
 * Get all archetype IDs
 */
export function getArchetypeIds(): ArchetypeId[] {
  return Object.keys(ARCHETYPES) as ArchetypeId[];
}

/**
 * Get archetypes filtered by faction
 */
export function getArchetypesByFaction(faction: 'hero' | 'villain'): Archetype[] {
  return Object.values(ARCHETYPES).filter((at) => at.side === faction);
}

/**
 * Epic archetype IDs (Kheldians and Arachnos)
 */
export const EPIC_ARCHETYPE_IDS: ArchetypeId[] = [
  'peacebringer',
  'warshade',
  'arachnos-soldier',
  'arachnos-widow',
];

/**
 * Standard archetype IDs (non-epic)
 */
export const STANDARD_ARCHETYPE_IDS: ArchetypeId[] = [
  'blaster',
  'controller',
  'defender',
  'scrapper',
  'tanker',
  'sentinel',
  'brute',
  'corruptor',
  'dominator',
  'mastermind',
  'stalker',
];

/**
 * Check if an archetype is an epic archetype
 */
export function isEpicArchetype(id: ArchetypeId): boolean {
  return EPIC_ARCHETYPE_IDS.includes(id);
}

/**
 * Get all epic archetypes
 */
export function getEpicArchetypes(): Archetype[] {
  return EPIC_ARCHETYPE_IDS.map((id) => ARCHETYPES[id]);
}

/**
 * Get all standard (non-epic) archetypes
 */
export function getStandardArchetypes(): Archetype[] {
  return STANDARD_ARCHETYPE_IDS.map((id) => ARCHETYPES[id]);
}
