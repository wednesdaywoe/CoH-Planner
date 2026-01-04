# City of Heroes: Homecoming - Batch Epic Pool Converter
# Converts all epic/ancillary power pools from raw JSON to planner format

$ErrorActionPreference = "Continue"

# Epic pool list (all pools from epic directory)
$epicPools = @(
    "arctic_mastery",
    "blaster_dark_mastery",
    "blaster_mace_mastery",
    "blaster_mu_mastery",
    "blaze_mastery",
    "body_mastery",
    "body_mastery_stalker",
    "brute_leviathan_mastery",
    "brute_mace_mastery",
    "brute_mu_mastery",
    "brute_soul_mastery",
    "charge_mastery",
    "chill_mastery",
    "cold_mastery",
    "controller_dark_mastery",
    "controller_mace_mastery",
    "corruptor_fire_mastery",
    "corruptor_leviathan_mastery",
    "corruptor_mace_mastery",
    "corruptor_mu_mastery",
    "corruptor_soul_mastery",
    "dark_mastery",
    "darkness_mastery",
    "defender_fire_mastery",
    "defender_ice_mastery",
    "dominator_dark_mastery",
    "dominator_leviathan_mastery",
    "dominator_mace_mastery",
    "dominator_mu_mastery",
    "dominator_soul_mastery",
    "earth_mastery",
    "electrical_mastery",
    "electricity_mastery",
    "energy_mastery",
    "energy_mastery_brute",
    "field_mastery",
    "fire_mastery",
    "fire_mastery_dominator",
    "flame_mastery",
    "force_mastery",
    "heat_mastery_stalker",
    "ice_mastery",
    "ice_mastery_dominator",
    "mastermind_dark_mastery",
    "mastermind_leviathan_mastery",
    "mastermind_mace_mastery",
    "mastermind_mu_mastery",
    "mastermind_soul_mastery",
    "melee_psionic_mastery",
    "munitions_mastery",
    "power_mastery",
    "primal_forces_mastery",
    "primal_forces_mastery_dominator",
    "psionic_mastery",
    "psionic_mastery_domingator",
    "psychic_mastery",
    "pyre_mastery",
    "scrapper_ice_mastery",
    "sentinel_dark_mastery",
    "sentinel_electricity_mastery",
    "sentinel_fire_mastery",
    "sentinel_ice_mastery",
    "sentinel_leviathan_mastery",
    "sentinel_mace_mastery",
    "sentinel_mu_mastery",
    "sentinel_ninja_mastery",
    "sentinel_psionic_mastery",
    "sentinel_soul_mastery",
    "stalker_leviathan_mastery",
    "stalker_mace_mastery",
    "stalker_mu_mastery",
    "stalker_soul_mastery",
    "stone_mastery",
    "tank_dark_mastery",
    "tank_psionic_mastery",
    "veat_leviathan_mastery",
    "veat_mace_mastery",
    "veat_mu_mastery",
    "veat_soul_mastery",
    "weapon_mastery",
    "weapon_mastery_stalker"
)

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "City of Heroes: Homecoming - Batch Epic Pool Converter" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Converting $($epicPools.Count) epic/ancillary pools..." -ForegroundColor Yellow
Write-Host ""

$successCount = 0
$failCount = 0
$failedPools = @()

# Change to tools directory where convert_epic.py is located
Push-Location (Split-Path -Parent $MyInvocation.MyCommand.Path)

foreach ($pool in $epicPools) {
    Write-Host "Processing: $pool" -ForegroundColor White
    
    $output = python convert_epic.py $pool 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        $successCount++
        Write-Host "  Success" -ForegroundColor Green
    } else {
        $failCount++
        $failedPools += $pool
        Write-Host "  Failed" -ForegroundColor Red
        if ($output) {
            Write-Host $output -ForegroundColor Red
        }
    }
    
    Write-Host ""
}

# Summary
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "CONVERSION SUMMARY" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Total Pools:    $($epicPools.Count)" -ForegroundColor White
Write-Host "Successful:     $successCount" -ForegroundColor Green
Write-Host "Failed:         $failCount" -ForegroundColor $(if ($failCount -eq 0) { "Green" } else { "Red" })

if ($failCount -gt 0) {
    Write-Host ""
    Write-Host "Failed pools:" -ForegroundColor Red
    foreach ($pool in $failedPools) {
        Write-Host "  - $pool" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Output directory: C:\Projects\CoH-Planner\js\data\epics\" -ForegroundColor Cyan
Write-Host "Organized by archetype subdirectories" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

# Restore original directory
Pop-Location

if ($failCount -eq 0) {
    Write-Host ""
    Write-Host "All epic pools converted successfully!" -ForegroundColor Green
    exit 0
} else {
    exit 1
}
