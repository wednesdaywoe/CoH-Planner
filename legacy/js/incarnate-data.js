/**
 * Complete Incarnate Powers Data
 * All slots, trees, tiers, and power information
 */

const IncarnateData = {
    alpha: {
        slotName: 'Alpha',
        slotColor: '#60A5FA',
        trees: {
            Agility: {
                name: 'Agility',
                type: 'Endurance/Defense/Recharge',
                description: 'Reduces Endurance cost, increases Defense and Recharge Rate',
                tiers: [
                    { name: 'Agility Boost', desc: 'Minor bonuses to Endurance, Defense, and Recharge' },
                    { core: 'Agility Core Paragon', radial: 'Agility Radial Paragon', desc: 'Improved bonuses' },
                    { core: 'Agility Partial Core Revamp', radial: 'Agility Partial Radial Revamp', desc: 'Enhanced bonuses with Level Shift' },
                    { core: 'Agility Total Core Revamp', radial: 'Agility Total Radial Revamp', desc: 'Maximum bonuses with Level Shift' }
                ]
            },
            Cardiac: {
                name: 'Cardiac',
                type: 'Endurance/Range/Resistance',
                description: 'Reduces Endurance cost, increases Range and Damage Resistance',
                tiers: [
                    { name: 'Cardiac Boost', desc: 'Minor bonuses to Endurance, Range, and Resistance' },
                    { core: 'Cardiac Core Paragon', radial: 'Cardiac Radial Paragon', desc: 'Improved bonuses' },
                    { core: 'Cardiac Partial Core Revamp', radial: 'Cardiac Partial Radial Revamp', desc: 'Enhanced bonuses with Level Shift' },
                    { core: 'Cardiac Total Core Revamp', radial: 'Cardiac Total Radial Revamp', desc: 'Maximum bonuses with Level Shift' }
                ]
            },
            Intuition: {
                name: 'Intuition',
                type: 'ToHit/Range/Recharge',
                description: 'Increases To-Hit, Range, and Recharge Rate',
                tiers: [
                    { name: 'Intuition Boost', desc: 'Minor bonuses to ToHit, Range, and Recharge' },
                    { core: 'Intuition Core Paragon', radial: 'Intuition Radial Paragon', desc: 'Improved bonuses' },
                    { core: 'Intuition Partial Core Revamp', radial: 'Intuition Partial Radial Revamp', desc: 'Enhanced bonuses with Level Shift' },
                    { core: 'Intuition Total Core Revamp', radial: 'Intuition Total Radial Revamp', desc: 'Maximum bonuses with Level Shift' }
                ]
            },
            Musculature: {
                name: 'Musculature',
                type: 'Damage/Endurance',
                description: 'Increases Damage and reduces Endurance cost',
                tiers: [
                    { name: 'Musculature Boost', desc: 'Minor bonuses to Damage and Endurance' },
                    { core: 'Musculature Core Paragon', radial: 'Musculature Radial Paragon', desc: 'Improved bonuses' },
                    { core: 'Musculature Partial Core Revamp', radial: 'Musculature Partial Radial Revamp', desc: 'Enhanced bonuses with Level Shift' },
                    { core: 'Musculature Total Core Revamp', radial: 'Musculature Total Radial Revamp', desc: 'Maximum bonuses with Level Shift' }
                ]
            },
            Nerve: {
                name: 'Nerve',
                type: 'Accuracy/Defense/ToHit',
                description: 'Increases Accuracy, Defense, and To-Hit',
                tiers: [
                    { name: 'Nerve Boost', desc: 'Minor bonuses to Accuracy, Defense, and ToHit' },
                    { core: 'Nerve Core Paragon', radial: 'Nerve Radial Paragon', desc: 'Improved bonuses' },
                    { core: 'Nerve Partial Core Revamp', radial: 'Nerve Partial Radial Revamp', desc: 'Enhanced bonuses with Level Shift' },
                    { core: 'Nerve Total Core Revamp', radial: 'Nerve Total Radial Revamp', desc: 'Maximum bonuses with Level Shift' }
                ]
            },
            Resilient: {
                name: 'Resilient',
                type: 'Defense/Resistance',
                description: 'Increases Defense and Damage Resistance',
                tiers: [
                    { name: 'Resilient Boost', desc: 'Minor bonuses to Defense and Resistance' },
                    { core: 'Resilient Core Paragon', radial: 'Resilient Radial Paragon', desc: 'Improved bonuses' },
                    { core: 'Resilient Partial Core Revamp', radial: 'Resilient Partial Radial Revamp', desc: 'Enhanced bonuses with Level Shift' },
                    { core: 'Resilient Total Core Revamp', radial: 'Resilient Total Radial Revamp', desc: 'Maximum bonuses with Level Shift' }
                ]
            },
            Spiritual: {
                name: 'Spiritual',
                type: 'Healing/Recharge',
                description: 'Increases Healing and Recharge Rate',
                tiers: [
                    { name: 'Spiritual Boost', desc: 'Minor bonuses to Healing and Recharge' },
                    { core: 'Spiritual Core Paragon', radial: 'Spiritual Radial Paragon', desc: 'Improved bonuses' },
                    { core: 'Spiritual Partial Core Revamp', radial: 'Spiritual Partial Radial Revamp', desc: 'Enhanced bonuses with Level Shift' },
                    { core: 'Spiritual Total Core Revamp', radial: 'Spiritual Total Radial Revamp', desc: 'Maximum bonuses with Level Shift' }
                ]
            },
            Vigor: {
                name: 'Vigor',
                type: 'Healing/Endurance/Accuracy',
                description: 'Increases Healing, reduces Endurance cost, and increases Accuracy',
                tiers: [
                    { name: 'Vigor Boost', desc: 'Minor bonuses to Healing, Endurance, and Accuracy' },
                    { core: 'Vigor Core Paragon', radial: 'Vigor Radial Paragon', desc: 'Improved bonuses' },
                    { core: 'Vigor Partial Core Revamp', radial: 'Vigor Partial Radial Revamp', desc: 'Enhanced bonuses with Level Shift' },
                    { core: 'Vigor Total Core Revamp', radial: 'Vigor Total Radial Revamp', desc: 'Maximum bonuses with Level Shift' }
                ]
            }
        }
    },
    
    judgement: {
        slotName: 'Judgement',
        slotColor: '#F59E0B',
        trees: {
            Cryonic: {
                name: 'Cryonic',
                type: 'Cold',
                description: 'Ranged Cone, Extreme DMG (Cold), Recharge: Very Long',
                tiers: [
                    { name: 'Cryonic Judgement', desc: 'Ranged Cone, Extreme Cold damage' },
                    { core: 'Cryonic Core Beam', radial: 'Cryonic Radial Blast', desc: 'Core: Single-target focus | Radial: Wider cone' },
                    { core: 'Cryonic Partial Core Invocation', radial: 'Cryonic Partial Radial Invocation', desc: 'Core: High damage | Radial: Slow effect +1 Level Shift' },
                    { core: 'Cryonic Total Core Invocation', radial: 'Cryonic Total Radial Invocation', desc: 'Core: Maximum damage | Radial: Maximum slow' }
                ]
            },
            Ion: {
                name: 'Ion',
                type: 'Energy',
                description: 'Targeted AoE, Extreme DMG (Energy), Recharge: Very Long',
                tiers: [
                    { name: 'Ion Judgement', desc: 'Targeted AoE, Extreme Energy damage with chain effect' },
                    { core: 'Ion Core Beam', radial: 'Ion Radial Blast', desc: 'Core: More chains | Radial: Larger radius' },
                    { core: 'Ion Partial Core Invocation', radial: 'Ion Partial Radial Invocation', desc: 'Core: Extended chains | Radial: Wider area +1 Level Shift' },
                    { core: 'Ion Total Core Invocation', radial: 'Ion Total Radial Invocation', desc: 'Core: Maximum chains | Radial: Maximum radius' }
                ]
            },
            Pyronic: {
                name: 'Pyronic',
                type: 'Fire',
                description: 'PBAoE, Extreme DMG (Fire), Recharge: Very Long',
                tiers: [
                    { name: 'Pyronic Judgement', desc: 'PBAoE, Extreme Fire damage with DoT' },
                    { core: 'Pyronic Core Beam', radial: 'Pyronic Radial Blast', desc: 'Core: Higher DoT | Radial: Larger radius' },
                    { core: 'Pyronic Partial Core Invocation', radial: 'Pyronic Partial Radial Invocation', desc: 'Core: Extended DoT | Radial: Wider area +1 Level Shift' },
                    { core: 'Pyronic Total Core Invocation', radial: 'Pyronic Total Radial Invocation', desc: 'Core: Maximum DoT | Radial: Maximum radius' }
                ]
            },
            Void: {
                name: 'Void',
                type: 'Negative',
                description: 'Ranged AoE, Extreme DMG (Negative), Recharge: Very Long',
                tiers: [
                    { name: 'Void Judgement', desc: 'Ranged AoE, Extreme Negative damage with -ToHit' },
                    { core: 'Void Core Beam', radial: 'Void Radial Blast', desc: 'Core: Higher -ToHit | Radial: Larger radius' },
                    { core: 'Void Partial Core Invocation', radial: 'Void Partial Radial Invocation', desc: 'Core: Extended debuff | Radial: Wider area +1 Level Shift' },
                    { core: 'Void Total Core Invocation', radial: 'Void Total Radial Invocation', desc: 'Core: Maximum -ToHit | Radial: Maximum radius' }
                ]
            },
            Vorpal: {
                name: 'Vorpal',
                type: 'Lethal',
                description: 'Ranged Cone, Extreme DMG (Lethal), Recharge: Very Long',
                tiers: [
                    { name: 'Vorpal Judgement', desc: 'Ranged Cone, Extreme Lethal damage with -Defense' },
                    { core: 'Vorpal Core Beam', radial: 'Vorpal Radial Blast', desc: 'Core: Higher -Defense | Radial: Wider cone' },
                    { core: 'Vorpal Partial Core Invocation', radial: 'Vorpal Partial Radial Invocation', desc: 'Core: Extended debuff | Radial: Wider cone +1 Level Shift' },
                    { core: 'Vorpal Total Core Invocation', radial: 'Vorpal Total Radial Invocation', desc: 'Core: Maximum -Defense | Radial: Maximum cone' }
                ]
            }
        }
    },
    
    interface: {
        slotName: 'Interface',
        slotColor: '#10B981',
        trees: {
            Cognitive: {
                name: 'Cognitive',
                type: 'Confuse',
                description: 'Adds chance for Confuse proc',
                tiers: [
                    { name: 'Cognitive Interface', desc: 'Small chance for Confuse on hit' },
                    { core: 'Cognitive Core Boost', radial: 'Cognitive Radial Boost', desc: 'Core: Higher chance | Radial: Longer duration' },
                    { core: 'Cognitive Partial Core Improved', radial: 'Cognitive Partial Radial Improved', desc: 'Core: Very high chance | Radial: Much longer duration' },
                    { core: 'Cognitive Total Core Improved', radial: 'Cognitive Total Radial Improved', desc: 'Core: Maximum chance | Radial: Maximum duration' }
                ]
            },
            Degenerative: {
                name: 'Degenerative',
                type: '-Regen/-MaxHP',
                description: 'Adds -Regeneration and -Max HP proc',
                tiers: [
                    { name: 'Degenerative Interface', desc: 'Small chance for -Regen/-MaxHP on hit' },
                    { core: 'Degenerative Core Boost', radial: 'Degenerative Radial Boost', desc: 'Core: Higher -Regen | Radial: Higher -MaxHP' },
                    { core: 'Degenerative Partial Core Improved', radial: 'Degenerative Partial Radial Improved', desc: 'Core: Very high -Regen | Radial: Very high -MaxHP' },
                    { core: 'Degenerative Total Core Improved', radial: 'Degenerative Total Radial Improved', desc: 'Core: Maximum -Regen | Radial: Maximum -MaxHP' }
                ]
            },
            Diamagnetic: {
                name: 'Diamagnetic',
                type: '-ToHit',
                description: 'Adds -ToHit debuff proc',
                tiers: [
                    { name: 'Diamagnetic Interface', desc: 'Small chance for -ToHit on hit' },
                    { core: 'Diamagnetic Core Boost', radial: 'Diamagnetic Radial Boost', desc: 'Core: Higher chance | Radial: Stronger debuff' },
                    { core: 'Diamagnetic Partial Core Improved', radial: 'Diamagnetic Partial Radial Improved', desc: 'Core: Very high chance | Radial: Much stronger debuff' },
                    { core: 'Diamagnetic Total Core Improved', radial: 'Diamagnetic Total Radial Improved', desc: 'Core: Maximum chance | Radial: Maximum debuff' }
                ]
            },
            Gravitic: {
                name: 'Gravitic',
                type: '-DMG/-Speed',
                description: 'Adds -Damage and -Speed debuff proc',
                tiers: [
                    { name: 'Gravitic Interface', desc: 'Small chance for -DMG/-Speed on hit' },
                    { core: 'Gravitic Core Boost', radial: 'Gravitic Radial Boost', desc: 'Core: Higher -DMG | Radial: Higher -Speed' },
                    { core: 'Gravitic Partial Core Improved', radial: 'Gravitic Partial Radial Improved', desc: 'Core: Very high -DMG | Radial: Very high -Speed' },
                    { core: 'Gravitic Total Core Improved', radial: 'Gravitic Total Radial Improved', desc: 'Core: Maximum -DMG | Radial: Maximum -Speed' }
                ]
            },
            Paralytic: {
                name: 'Paralytic',
                type: 'Hold',
                description: 'Adds chance for Hold proc',
                tiers: [
                    { name: 'Paralytic Interface', desc: 'Small chance for Hold on hit' },
                    { core: 'Paralytic Core Boost', radial: 'Paralytic Radial Boost', desc: 'Core: Higher chance | Radial: Longer duration' },
                    { core: 'Paralytic Partial Core Improved', radial: 'Paralytic Partial Radial Improved', desc: 'Core: Very high chance | Radial: Much longer duration' },
                    { core: 'Paralytic Total Core Improved', radial: 'Paralytic Total Radial Improved', desc: 'Core: Maximum chance | Radial: Maximum duration' }
                ]
            },
            Preemptive: {
                name: 'Preemptive',
                type: 'Placate',
                description: 'Adds chance for Placate proc',
                tiers: [
                    { name: 'Preemptive Interface', desc: 'Small chance for Placate on hit' },
                    { core: 'Preemptive Core Boost', radial: 'Preemptive Radial Boost', desc: 'Core: Higher chance | Radial: Longer duration' },
                    { core: 'Preemptive Partial Core Improved', radial: 'Preemptive Partial Radial Improved', desc: 'Core: Very high chance | Radial: Much longer duration' },
                    { core: 'Preemptive Total Core Improved', radial: 'Preemptive Total Radial Improved', desc: 'Core: Maximum chance | Radial: Maximum duration' }
                ]
            },
            Reactive: {
                name: 'Reactive',
                type: '-Res/DoT',
                description: 'Adds -Resistance and Fire DoT proc',
                tiers: [
                    { name: 'Reactive Interface', desc: 'Small chance for -Res/Fire DoT on hit' },
                    { core: 'Reactive Core Boost', radial: 'Reactive Radial Boost', desc: 'Core: Higher -Res | Radial: Higher DoT' },
                    { core: 'Reactive Partial Core Improved', radial: 'Reactive Partial Radial Improved', desc: 'Core: Very high -Res | Radial: Much higher DoT' },
                    { core: 'Reactive Total Core Improved', radial: 'Reactive Total Radial Improved', desc: 'Core: Maximum -Res | Radial: Maximum DoT' }
                ]
            },
            Spectral: {
                name: 'Spectral',
                type: 'Immob/-Rech',
                description: 'Adds Immobilize and -Recharge proc',
                tiers: [
                    { name: 'Spectral Interface', desc: 'Small chance for Immob/-Recharge on hit' },
                    { core: 'Spectral Core Boost', radial: 'Spectral Radial Boost', desc: 'Core: Higher chance | Radial: Stronger -Recharge' },
                    { core: 'Spectral Partial Core Improved', radial: 'Spectral Partial Radial Improved', desc: 'Core: Very high chance | Radial: Much stronger -Recharge' },
                    { core: 'Spectral Total Core Improved', radial: 'Spectral Total Radial Improved', desc: 'Core: Maximum chance | Radial: Maximum -Recharge' }
                ]
            }
        }
    },
    
    lore: {
        slotName: 'Lore',
        slotColor: '#8B5CF6',
        trees: {
            Arachnos: { name: 'Arachnos', type: 'Pets', description: 'Summon Arachnos soldiers to fight for you' },
            Banished: { name: 'Banished Pantheon', type: 'Pets', description: 'Summon Banished Pantheon spirits' },
            Carnival: { name: 'Carnival of Shadows', type: 'Pets', description: 'Summon Carnival masks and mistresses' },
            Cimeroran: { name: 'Cimeroran', type: 'Pets', description: 'Summon ancient Cimeroran warriors' },
            Clockwork: { name: 'Clockwork', type: 'Pets', description: 'Summon Clockwork automatons' },
            Drones: { name: 'Robotic Drones', type: 'Pets', description: 'Summon advanced combat drones' },
            Elementals: { name: 'Elementals', type: 'Pets', description: 'Summon elemental beings' },
            IDF: { name: 'IDF', type: 'Pets', description: 'Summon Imperial Defense Force soldiers' },
            Knives: { name: 'Knives of Artemis', type: 'Pets', description: 'Summon deadly assassins' },
            Lights: { name: 'Polar Lights', type: 'Pets', description: 'Summon alien Rikti entities' },
            Longbow: { name: 'Longbow', type: 'Pets', description: 'Summon Longbow operatives' },
            Nemesis: { name: 'Nemesis', type: 'Pets', description: 'Summon steam-powered Nemesis soldiers' },
            Phantoms: { name: 'Phantoms', type: 'Pets', description: 'Summon spectral warriors' },
            Rikti: { name: 'Rikti', type: 'Pets', description: 'Summon Rikti invaders' },
            Rularuu: { name: 'Rularuu', type: 'Pets', description: 'Summon beings from the Shadow Shard' },
            Seers: { name: 'Seers', type: 'Pets', description: 'Summon Praetorian psychics' },
            Talons: { name: 'Talons of Vengeance', type: 'Pets', description: 'Summon mystical warriors' },
            Tsoo: { name: 'Tsoo', type: 'Pets', description: 'Summon Tsoo martial artists' },
            Vanguard: { name: 'Vanguard', type: 'Pets', description: 'Summon Vanguard soldiers' },
            WarWorks: { name: 'Praetorian Clockwork', type: 'Pets', description: 'Summon advanced War Works' }
        }
    },
    
    destiny: {
        slotName: 'Destiny',
        slotColor: '#EF4444',
        trees: {
            Ageless: {
                name: 'Ageless',
                type: 'Recharge/Recovery',
                description: 'Self and Team: +Recharge, +Recovery, +Endurance Discount',
                tiers: [
                    { name: 'Ageless Destiny', desc: 'Moderate Recharge and Recovery boost' },
                    { core: 'Ageless Core Boost', radial: 'Ageless Radial Boost', desc: 'Core: Higher Recharge | Radial: Higher Recovery' },
                    { core: 'Ageless Partial Core Invocation', radial: 'Ageless Partial Radial Invocation', desc: 'Core: Very high Recharge | Radial: Very high Recovery' },
                    { core: 'Ageless Total Core Epiphany', radial: 'Ageless Total Radial Epiphany', desc: 'Core: Maximum Recharge | Radial: Maximum Recovery' }
                ]
            },
            Barrier: {
                name: 'Barrier',
                type: 'Defense/Resistance',
                description: 'Self and Team: +Defense, +Resistance',
                tiers: [
                    { name: 'Barrier Destiny', desc: 'Moderate Defense and Resistance boost' },
                    { core: 'Barrier Core Boost', radial: 'Barrier Radial Boost', desc: 'Core: Higher Defense | Radial: Higher Resistance' },
                    { core: 'Barrier Partial Core Invocation', radial: 'Barrier Partial Radial Invocation', desc: 'Core: Very high Defense | Radial: Very high Resistance' },
                    { core: 'Barrier Total Core Epiphany', radial: 'Barrier Total Radial Epiphany', desc: 'Core: Maximum Defense | Radial: Maximum Resistance' }
                ]
            },
            Clarion: {
                name: 'Clarion',
                type: 'Mez Protection',
                description: 'Self and Team: Mez Protection and Resistance',
                tiers: [
                    { name: 'Clarion Destiny', desc: 'Moderate Mez Protection' },
                    { core: 'Clarion Core Boost', radial: 'Clarion Radial Boost', desc: 'Core: Higher magnitude | Radial: More types' },
                    { core: 'Clarion Partial Core Invocation', radial: 'Clarion Partial Radial Invocation', desc: 'Core: Very high magnitude | Radial: All mez types' },
                    { core: 'Clarion Total Core Epiphany', radial: 'Clarion Total Radial Epiphany', desc: 'Core: Maximum magnitude | Radial: Maximum coverage' }
                ]
            },
            Incandescence: {
                name: 'Incandescence',
                type: 'Damage/ToHit',
                description: 'Self and Team: +Damage, +ToHit',
                tiers: [
                    { name: 'Incandescence Destiny', desc: 'Moderate Damage and ToHit boost' },
                    { core: 'Incandescence Core Boost', radial: 'Incandescence Radial Boost', desc: 'Core: Higher Damage | Radial: Higher ToHit' },
                    { core: 'Incandescence Partial Core Invocation', radial: 'Incandescence Partial Radial Invocation', desc: 'Core: Very high Damage | Radial: Very high ToHit' },
                    { core: 'Incandescence Total Core Epiphany', radial: 'Incandescence Total Radial Epiphany', desc: 'Core: Maximum Damage | Radial: Maximum ToHit' }
                ]
            },
            Rebirth: {
                name: 'Rebirth',
                type: 'Heal/Regen',
                description: 'Self and Team: Heal, +Regeneration, +Recovery',
                tiers: [
                    { name: 'Rebirth Destiny', desc: 'Moderate Heal and Regeneration' },
                    { core: 'Rebirth Core Boost', radial: 'Rebirth Radial Boost', desc: 'Core: Higher Heal | Radial: Higher Regeneration' },
                    { core: 'Rebirth Partial Core Invocation', radial: 'Rebirth Partial Radial Invocation', desc: 'Core: Very high Heal | Radial: Very high Regeneration' },
                    { core: 'Rebirth Total Core Epiphany', radial: 'Rebirth Total Radial Epiphany', desc: 'Core: Maximum Heal | Radial: Maximum Regeneration' }
                ]
            }
        }
    },
    
    hybrid: {
        slotName: 'Hybrid',
        slotColor: '#EC4899',
        trees: {
            Assault: {
                name: 'Assault',
                type: 'Damage/ToHit',
                description: 'Toggle: +Damage, +ToHit while active',
                tiers: [
                    { name: 'Assault Hybrid', desc: 'Moderate offensive boost' },
                    { core: 'Assault Core Boost', radial: 'Assault Radial Boost', desc: 'Core: Higher Damage | Radial: Chance for critical' },
                    { core: 'Assault Partial Core Embodiment', radial: 'Assault Partial Radial Embodiment', desc: 'Core: Very high Damage | Radial: Higher crit chance' },
                    { core: 'Assault Total Core Embodiment', radial: 'Assault Total Radial Embodiment', desc: 'Core: Maximum Damage | Radial: Maximum crit' }
                ]
            },
            Control: {
                name: 'Control',
                type: 'Control Duration/Mag',
                description: 'Toggle: Increases control effects while active',
                tiers: [
                    { name: 'Control Hybrid', desc: 'Moderate control boost' },
                    { core: 'Control Core Boost', radial: 'Control Radial Boost', desc: 'Core: Higher duration | Radial: Higher magnitude' },
                    { core: 'Control Partial Core Embodiment', radial: 'Control Partial Radial Embodiment', desc: 'Core: Very high duration | Radial: Very high magnitude' },
                    { core: 'Control Total Core Embodiment', radial: 'Control Total Radial Embodiment', desc: 'Core: Maximum duration | Radial: Maximum magnitude' }
                ]
            },
            Melee: {
                name: 'Melee',
                type: 'Melee Damage/Defense',
                description: 'Toggle: +Melee Damage, +Defense while active',
                tiers: [
                    { name: 'Melee Hybrid', desc: 'Moderate melee boost' },
                    { core: 'Melee Core Boost', radial: 'Melee Radial Boost', desc: 'Core: Higher Damage | Radial: Higher Defense' },
                    { core: 'Melee Partial Core Embodiment', radial: 'Melee Partial Radial Embodiment', desc: 'Core: Very high Damage | Radial: Very high Defense' },
                    { core: 'Melee Total Core Embodiment', radial: 'Melee Total Radial Embodiment', desc: 'Core: Maximum Damage | Radial: Maximum Defense' }
                ]
            },
            Support: {
                name: 'Support',
                type: 'Healing/Endurance',
                description: 'Toggle: +Healing, +Endurance while active',
                tiers: [
                    { name: 'Support Hybrid', desc: 'Moderate support boost' },
                    { core: 'Support Core Boost', radial: 'Support Radial Boost', desc: 'Core: Higher Healing | Radial: Higher Endurance' },
                    { core: 'Support Partial Core Embodiment', radial: 'Support Partial Radial Embodiment', desc: 'Core: Very high Healing | Radial: Very high Endurance' },
                    { core: 'Support Total Core Embodiment', radial: 'Support Total Radial Embodiment', desc: 'Core: Maximum Healing | Radial: Maximum Endurance' }
                ]
            }
        }
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = IncarnateData;
}
