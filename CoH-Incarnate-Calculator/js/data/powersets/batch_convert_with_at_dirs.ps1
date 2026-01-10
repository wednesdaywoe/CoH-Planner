# Batch Powerset Converter with Archetype Organization
param(
    [Parameter(Mandatory=$true)][string]$Archetype,
    [int]$Level = 50,
    [string]$Category = "all",
    [string[]]$Powersets = @(),
    [string]$OutputDir = "js/data/powersets",
    [string]$RawDataDir = "C:\Projects\Raw Data Homecoming",
    [string]$TablesDir = "C:\Projects\Raw Data Homecoming\tables"
)

$archetypeMap = @{
    "tanker" = @{ "primaries" = "tanker_defense"; "secondaries" = "tanker_melee" }
    "scrapper" = @{ "primaries" = "scrapper_melee"; "secondaries" = "scrapper_defense" }
    "blaster" = @{ "primaries" = "blaster_ranged"; "secondaries" = "blaster_support" }
    "brute" = @{ "primaries" = "brute_melee"; "secondaries" = "brute_defense" }
    "stalker" = @{ "primaries" = "stalker_melee"; "secondaries" = "stalker_defense" }
    "sentinel" = @{ "primaries" = "sentinel_ranged"; "secondaries" = "sentinel_defense" }
    "defender" = @{ "primaries" = "defender_buff"; "secondaries" = "defender_ranged" }
    "controller" = @{ "primaries" = "controller_control"; "secondaries" = "controller_buff" }
    "corruptor" = @{ "primaries" = "corruptor_ranged"; "secondaries" = "corruptor_buff" }
    "dominator" = @{ "primaries" = "dominator_control"; "secondaries" = "dominator_assault" }
    "mastermind" = @{ "primaries" = "mastermind_summon"; "secondaries" = "mastermind_buff" }
}

Write-Host "========================================"
Write-Host "Batch Powerset Converter"
Write-Host "========================================"
Write-Host ""

$archetypeLower = $Archetype.ToLower()
if (-not $archetypeMap.ContainsKey($archetypeLower)) {
    Write-Host "ERROR: Unknown archetype '$Archetype'" -ForegroundColor Red
    Write-Host "Valid archetypes: $($archetypeMap.Keys -join ', ')" -ForegroundColor Yellow
    exit 1
}

# Create archetype-specific output directory
$archetypeOutputDir = Join-Path $OutputDir $archetypeLower
if (-not (Test-Path $archetypeOutputDir)) {
    Write-Host "Creating archetype directory: $archetypeOutputDir" -ForegroundColor Cyan
    New-Item -ItemType Directory -Path $archetypeOutputDir | Out-Null
}

$powersetDirs = @()

if ($Powersets.Count -gt 0) {
    foreach ($name in $Powersets) {
        $primaryDir = $archetypeMap[$archetypeLower]["primaries"]
        $path = Join-Path $RawDataDir "powers\$primaryDir\$name"
        if (Test-Path $path) {
            $powersetDirs += @{ "Path" = $path; "Name" = $name; "Type" = "primary" }
        }
        $secondaryDir = $archetypeMap[$archetypeLower]["secondaries"]
        $path = Join-Path $RawDataDir "powers\$secondaryDir\$name"
        if (Test-Path $path) {
            $powersetDirs += @{ "Path" = $path; "Name" = $name; "Type" = "secondary" }
        }
    }
} else {
    if ($Category -eq "all" -or $Category -eq "primaries") {
        $primaryDir = $archetypeMap[$archetypeLower]["primaries"]
        $primaryPath = Join-Path $RawDataDir "powers\$primaryDir"
        if (Test-Path $primaryPath) {
            Get-ChildItem -Path $primaryPath -Directory | ForEach-Object {
                $powersetDirs += @{ "Path" = $_.FullName; "Name" = $_.Name; "Type" = "primary" }
            }
        }
    }
    if ($Category -eq "all" -or $Category -eq "secondaries") {
        $secondaryDir = $archetypeMap[$archetypeLower]["secondaries"]
        $secondaryPath = Join-Path $RawDataDir "powers\$secondaryDir"
        if (Test-Path $secondaryPath) {
            Get-ChildItem -Path $secondaryPath -Directory | ForEach-Object {
                $powersetDirs += @{ "Path" = $_.FullName; "Name" = $_.Name; "Type" = "secondary" }
            }
        }
    }
}

Write-Host "Archetype: $Archetype" -ForegroundColor Cyan
Write-Host "Output: $archetypeOutputDir" -ForegroundColor Cyan
Write-Host "Found $($powersetDirs.Count) powersets"
Write-Host ""

$successCount = 0
$failCount = 0
$startTime = Get-Date

foreach ($powerset in $powersetDirs) {
    $name = $powerset["Name"]
    $path = $powerset["Path"]
    $outputName = $name.Replace("_", "-") + ".js"
    
    # Output to archetype-specific subdirectory
    $outputPath = Join-Path $archetypeOutputDir $outputName
    
    Write-Host "[$($successCount + $failCount + 1)/$($powersetDirs.Count)] $name" -NoNewline
    
    # Run converter with archetype parameter
    $output = python convert_powerset.py "$path" "$outputPath" --archetype=$archetypeLower --level=$Level --tables="$TablesDir" 2>&1
    
    # Check exit code
    if ($LASTEXITCODE -eq 0) {
        Write-Host " - OK" -ForegroundColor Green
        $successCount++
    } else {
        Write-Host " - FAILED" -ForegroundColor Red
        if ($output) {
            Write-Host "  Error: $output" -ForegroundColor DarkRed
        }
        $failCount++
    }
}

$endTime = Get-Date
$duration = $endTime - $startTime

Write-Host ""
Write-Host "========================================"
Write-Host "Conversion Complete"
Write-Host "========================================"
Write-Host "Archetype: $Archetype" -ForegroundColor Cyan
Write-Host "Output: $archetypeOutputDir" -ForegroundColor Cyan
Write-Host "Succeeded: $successCount" -ForegroundColor Green
Write-Host "Failed: $failCount" -ForegroundColor $(if ($failCount -gt 0) { "Red" } else { "Green" })
Write-Host "Duration: $($duration.TotalSeconds.ToString('0.1'))s"
Write-Host ""

if ($failCount -gt 0) {
    exit 1
} else {
    exit 0
}
