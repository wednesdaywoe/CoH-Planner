# Convert All CoH Powersets - Batch Script (FLAT OUTPUT)
# Converts all powersets to a single flat directory

$rawDataRoot = "C:\Projects\Raw Data Homecoming\powers"
$outputDir = "C:\Projects\CoH-Planner\data\powersets"
$converterScript = "C:\Projects\CoH-Planner\tools\convert_powerset_with_redirects.py"

# Create output directory if it doesn't exist
New-Item -ItemType Directory -Force -Path $outputDir | Out-Null

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "City of Heroes Powerset Batch Converter" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

$totalConverted = 0
$totalErrors = 0

function Convert-Powerset {
    param(
        [string]$Path,
        [string]$OutputName
    )
    
    $outputFile = Join-Path $outputDir "$OutputName.js"
    
    Write-Host "Converting: " -NoNewline
    Write-Host "$OutputName" -ForegroundColor Yellow
    
    try {
        python $converterScript $Path $rawDataRoot $outputFile 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) {
            $script:totalConverted++
            Write-Host "  Success" -ForegroundColor Green
        } else {
            $script:totalErrors++
            Write-Host "  Error" -ForegroundColor Red
        }
    } catch {
        $script:totalErrors++
        Write-Host "  Error: $_" -ForegroundColor Red
    }
}

# BLASTER PRIMARIES
Write-Host "`n--- BLASTER PRIMARIES ---" -ForegroundColor Cyan
Convert-Powerset "$rawDataRoot\blaster_ranged\archery" "archery"
Convert-Powerset "$rawDataRoot\blaster_ranged\assault_rifle" "assault-rifle"
Convert-Powerset "$rawDataRoot\blaster_ranged\beam_rifle" "beam-rifle"
Convert-Powerset "$rawDataRoot\blaster_ranged\dark_blast" "dark-blast"
Convert-Powerset "$rawDataRoot\blaster_ranged\dual_pistols" "dual-pistols"
Convert-Powerset "$rawDataRoot\blaster_ranged\electrical_blast" "electrical-blast"
Convert-Powerset "$rawDataRoot\blaster_ranged\energy_blast" "energy-blast"
Convert-Powerset "$rawDataRoot\blaster_ranged\fire_blast" "fire-blast"
Convert-Powerset "$rawDataRoot\blaster_ranged\ice_blast" "ice-blast"
Convert-Powerset "$rawDataRoot\blaster_ranged\psychic_blast" "psychic-blast"
Convert-Powerset "$rawDataRoot\blaster_ranged\radiation_blast" "radiation-blast"
Convert-Powerset "$rawDataRoot\blaster_ranged\seismic_blast" "seismic-blast"
Convert-Powerset "$rawDataRoot\blaster_ranged\sonic_attack" "sonic-attack"
Convert-Powerset "$rawDataRoot\blaster_ranged\water_blast" "water-blast"

# BLASTER SECONDARIES
Write-Host "`n--- BLASTER SECONDARIES ---" -ForegroundColor Cyan
Convert-Powerset "$rawDataRoot\blaster_support\atomic_manipulation" "atomic-manipulation"
Convert-Powerset "$rawDataRoot\blaster_support\electricity_manipulation" "electricity-manipulation"
Convert-Powerset "$rawDataRoot\blaster_support\energy_manipulation" "energy-manipulation"
Convert-Powerset "$rawDataRoot\blaster_support\fire_manipulation" "fire-manipulation"
Convert-Powerset "$rawDataRoot\blaster_support\ice_manipulation" "ice-manipulation"
Convert-Powerset "$rawDataRoot\blaster_support\martial_combat" "martial-combat"
Convert-Powerset "$rawDataRoot\blaster_support\mental_manipulation" "mental-manipulation"
Convert-Powerset "$rawDataRoot\blaster_support\ninja_training" "ninja-training"
Convert-Powerset "$rawDataRoot\blaster_support\plant_manipulation" "plant-manipulation"
Convert-Powerset "$rawDataRoot\blaster_support\tactical_arrow" "tactical-arrow"
Convert-Powerset "$rawDataRoot\blaster_support\temporal_manipulation" "temporal-manipulation"

# SCRAPPER PRIMARIES
Write-Host "`n--- SCRAPPER PRIMARIES ---" -ForegroundColor Cyan
Convert-Powerset "$rawDataRoot\scrapper_melee\battle_axe" "battle-axe"
Convert-Powerset "$rawDataRoot\scrapper_melee\broad_sword" "broad-sword"
Convert-Powerset "$rawDataRoot\scrapper_melee\claws" "claws"
Convert-Powerset "$rawDataRoot\scrapper_melee\dark_melee" "dark-melee"
Convert-Powerset "$rawDataRoot\scrapper_melee\dual_blades" "dual-blades"
Convert-Powerset "$rawDataRoot\scrapper_melee\electrical_melee" "electrical-melee"
Convert-Powerset "$rawDataRoot\scrapper_melee\energy_melee" "energy-melee"
Convert-Powerset "$rawDataRoot\scrapper_melee\fiery_melee" "fiery-melee"
Convert-Powerset "$rawDataRoot\scrapper_melee\katana" "katana"
Convert-Powerset "$rawDataRoot\scrapper_melee\kinetic_melee" "kinetic-melee"
Convert-Powerset "$rawDataRoot\scrapper_melee\martial_arts" "martial-arts"
Convert-Powerset "$rawDataRoot\scrapper_melee\radiation_melee" "radiation-melee"
Convert-Powerset "$rawDataRoot\scrapper_melee\savage_melee" "savage-melee"
Convert-Powerset "$rawDataRoot\scrapper_melee\spines" "spines"
Convert-Powerset "$rawDataRoot\scrapper_melee\staff_fighting" "staff-fighting"
Convert-Powerset "$rawDataRoot\scrapper_melee\street_justice" "street-justice"
Convert-Powerset "$rawDataRoot\scrapper_melee\titan_weapons" "titan-weapons"
Convert-Powerset "$rawDataRoot\scrapper_melee\war_mace" "war-mace"

# SCRAPPER SECONDARIES
Write-Host "`n--- SCRAPPER SECONDARIES ---" -ForegroundColor Cyan
Convert-Powerset "$rawDataRoot\scrapper_defense\bio_armor" "bio-armor"
Convert-Powerset "$rawDataRoot\scrapper_defense\dark_armor" "dark-armor"
Convert-Powerset "$rawDataRoot\scrapper_defense\electric_armor" "electric-armor"
Convert-Powerset "$rawDataRoot\scrapper_defense\energy_aura" "energy-aura"
Convert-Powerset "$rawDataRoot\scrapper_defense\fiery_aura" "fiery-aura"
Convert-Powerset "$rawDataRoot\scrapper_defense\ice_armor" "ice-armor"
Convert-Powerset "$rawDataRoot\scrapper_defense\invulnerability" "invulnerability"
Convert-Powerset "$rawDataRoot\scrapper_defense\ninjitsu" "ninjitsu"
Convert-Powerset "$rawDataRoot\scrapper_defense\radiation_armor" "radiation-armor"
Convert-Powerset "$rawDataRoot\scrapper_defense\regeneration" "regeneration"
Convert-Powerset "$rawDataRoot\scrapper_defense\shield_defense" "shield-defense"
Convert-Powerset "$rawDataRoot\scrapper_defense\super_reflexes" "super-reflexes"
Convert-Powerset "$rawDataRoot\scrapper_defense\willpower" "willpower"

# DEFENDER PRIMARIES
Write-Host "`n--- DEFENDER PRIMARIES ---" -ForegroundColor Cyan
Convert-Powerset "$rawDataRoot\defender_buff\cold_domination" "cold-domination"
Convert-Powerset "$rawDataRoot\defender_buff\dark_miasma" "dark-miasma"
Convert-Powerset "$rawDataRoot\defender_buff\empathy" "empathy"
Convert-Powerset "$rawDataRoot\defender_buff\force_field" "force-field"
Convert-Powerset "$rawDataRoot\defender_buff\kinetics" "kinetics"
Convert-Powerset "$rawDataRoot\defender_buff\marine_affinity" "marine-affinity"
Convert-Powerset "$rawDataRoot\defender_buff\nature_affinity" "nature-affinity"
Convert-Powerset "$rawDataRoot\defender_buff\pain_domination" "pain-domination"
Convert-Powerset "$rawDataRoot\defender_buff\poison" "poison"
Convert-Powerset "$rawDataRoot\defender_buff\radiation_emission" "radiation-emission"
Convert-Powerset "$rawDataRoot\defender_buff\shock_therapy" "shock-therapy"
Convert-Powerset "$rawDataRoot\defender_buff\sonic_debuff" "sonic-debuff"
Convert-Powerset "$rawDataRoot\defender_buff\storm_summoning" "storm-summoning"
Convert-Powerset "$rawDataRoot\defender_buff\thermal_radiation" "thermal-radiation"
Convert-Powerset "$rawDataRoot\defender_buff\time_manipulation" "time-manipulation"
Convert-Powerset "$rawDataRoot\defender_buff\traps" "traps"
Convert-Powerset "$rawDataRoot\defender_buff\trick_arrow" "trick-arrow"

# CONTROLLER PRIMARIES
Write-Host "`n--- CONTROLLER PRIMARIES ---" -ForegroundColor Cyan
Convert-Powerset "$rawDataRoot\controller_control\darkness_control" "darkness-control"
Convert-Powerset "$rawDataRoot\controller_control\earth_control" "earth-control"
Convert-Powerset "$rawDataRoot\controller_control\electric_control" "electric-control"
Convert-Powerset "$rawDataRoot\controller_control\fire_control" "fire-control"
Convert-Powerset "$rawDataRoot\controller_control\gravity_control" "gravity-control"
Convert-Powerset "$rawDataRoot\controller_control\ice_control" "ice-control"
Convert-Powerset "$rawDataRoot\controller_control\illusion_control" "illusion-control"
Convert-Powerset "$rawDataRoot\controller_control\mind_control" "mind-control"
Convert-Powerset "$rawDataRoot\controller_control\plant_control" "plant-control"
Convert-Powerset "$rawDataRoot\controller_control\symphony_control" "symphony-control"

# DOMINATOR SECONDARIES
Write-Host "`n--- DOMINATOR SECONDARIES ---" -ForegroundColor Cyan
Convert-Powerset "$rawDataRoot\dominator_assault\earth_assault" "earth-assault"
Convert-Powerset "$rawDataRoot\dominator_assault\electricity_assault" "electricity-assault"
Convert-Powerset "$rawDataRoot\dominator_assault\energy_assault" "energy-assault"
Convert-Powerset "$rawDataRoot\dominator_assault\fiery_assault" "fiery-assault"
Convert-Powerset "$rawDataRoot\dominator_assault\ice_assault" "ice-assault"
Convert-Powerset "$rawDataRoot\dominator_assault\martial_assault" "martial-assault"
Convert-Powerset "$rawDataRoot\dominator_assault\psionic_assault" "psionic-assault"
Convert-Powerset "$rawDataRoot\dominator_assault\radioactive_assault" "radioactive-assault"
Convert-Powerset "$rawDataRoot\dominator_assault\savage_assault" "savage-assault"
Convert-Powerset "$rawDataRoot\dominator_assault\thorny_assault" "thorny-assault"

# MASTERMIND PRIMARIES
Write-Host "`n--- MASTERMIND PRIMARIES ---" -ForegroundColor Cyan
Convert-Powerset "$rawDataRoot\mastermind_summon\beast_mastery" "beast-mastery"
Convert-Powerset "$rawDataRoot\mastermind_summon\demon_summoning" "demon-summoning"
Convert-Powerset "$rawDataRoot\mastermind_summon\mercenaries" "mercenaries"
Convert-Powerset "$rawDataRoot\mastermind_summon\necromancy" "necromancy"
Convert-Powerset "$rawDataRoot\mastermind_summon\ninjas" "ninjas"
Convert-Powerset "$rawDataRoot\mastermind_summon\robotics" "robotics"
Convert-Powerset "$rawDataRoot\mastermind_summon\thugs" "thugs"

# SUMMARY
Write-Host "`n==================================================" -ForegroundColor Cyan
Write-Host "CONVERSION COMPLETE" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "Total Converted: $totalConverted" -ForegroundColor Green
Write-Host "Total Errors: $totalErrors" -ForegroundColor $(if ($totalErrors -eq 0) { "Green" } else { "Red" })
Write-Host ""
Write-Host "Output directory: $outputDir" -ForegroundColor Yellow
Write-Host ""

if ($totalErrors -gt 0) {
    Write-Host "Some conversions failed. Check the output above for details." -ForegroundColor Red
} else {
    Write-Host "All conversions successful!" -ForegroundColor Green
}
