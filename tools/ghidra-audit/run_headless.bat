@echo off
REM Headless Ghidra analysis of cityofheroes.exe + string-xref dumps.
REM
REM Usage:
REM   run_headless.bat                       -> runs all post-scripts
REM   run_headless.bat AttribMod             -> only FindAttribModParser
REM   run_headless.bat VillainDef            -> only FindVillainDefParser
REM   run_headless.bat PowerEffects          -> only FindPowerEffectsParser
REM
REM Expects (or edit below):
REM   GHIDRA_HOME = path to your Ghidra install (contains support\analyzeHeadless.bat)
REM   JAVA_HOME   = path to JDK 21
REM
REM Outputs (next to cityofheroes.exe):
REM   attribmod_parser_report.txt
REM   villaindef_parser_report.txt
REM   power_effects_parser_report.txt

set EXE=G:\Homecoming\bin\win64\live\cityofheroes.exe
set PROJ_DIR=%~dp0project
set PROJ_NAME=coh_audit
set SCRIPT_DIR=%~dp0
if "%SCRIPT_DIR:~-1%"=="\" set SCRIPT_DIR=%SCRIPT_DIR:~0,-1%

if "%GHIDRA_HOME%"=="" set GHIDRA_HOME=C:\tools\ghidra_12.0.4_PUBLIC
if "%JAVA_HOME%"=="" set JAVA_HOME=C:\Users\jiiwi\AppData\Local\Programs\Eclipse Adoptium\jdk-21.0.10.7-hotspot
set PATH=%JAVA_HOME%\bin;%PATH%

if not exist "%GHIDRA_HOME%\support\analyzeHeadless.bat" (
    echo analyzeHeadless.bat not found under GHIDRA_HOME=%GHIDRA_HOME%
    exit /b 1
)
if not exist "%JAVA_HOME%\bin\java.exe" (
    echo java.exe not found under JAVA_HOME=%JAVA_HOME%
    exit /b 1
)

if not exist "%PROJ_DIR%" mkdir "%PROJ_DIR%"

REM Build the -postScript args based on the optional first argument.
REM Special case: BinSerializer maps to FindBinSerializer.java (no "Parser" suffix).
set POSTARGS=
if "%~1"=="" (
    set POSTARGS=-postScript FindAttribModParser.java -postScript FindVillainDefParser.java -postScript FindPowerEffectsParser.java -postScript FindBinSerializer.java
) else if /I "%~1"=="BinSerializer" (
    set POSTARGS=-postScript FindBinSerializer.java
) else (
    set POSTARGS=-postScript Find%~1Parser.java
)

REM If the binary was already imported+analyzed, skip to -process so we
REM only re-run the post-scripts. Pass FORCE_REIMPORT=1 to re-analyze.
if "%FORCE_REIMPORT%"=="1" goto :import
if exist "%PROJ_DIR%\%PROJ_NAME%.rep" goto :reprocess
goto :import

:reprocess
echo Project already imported â€” running post-scripts only.
"%GHIDRA_HOME%\support\analyzeHeadless.bat" "%PROJ_DIR%" %PROJ_NAME% ^
    -process cityofheroes.exe ^
    -noanalysis ^
    -scriptPath "%SCRIPT_DIR%" ^
    %POSTARGS%
goto :done

:import
"%GHIDRA_HOME%\support\analyzeHeadless.bat" "%PROJ_DIR%" %PROJ_NAME% ^
    -import "%EXE%" ^
    -overwrite ^
    -scriptPath "%SCRIPT_DIR%" ^
    %POSTARGS%

:done

echo.
echo Reports written next to cityofheroes.exe:
echo   G:\Homecoming\bin\win64\live\attribmod_parser_report.txt
echo   G:\Homecoming\bin\win64\live\villaindef_parser_report.txt
echo   G:\Homecoming\bin\win64\live\power_effects_parser_report.txt
