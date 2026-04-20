@echo off
REM Headless Ghidra analysis of cityofheroes.exe + string-xref dump.
REM Usage: run_headless.bat
REM
REM Expects these env vars (or edit the paths below):
REM   GHIDRA_HOME = path to your Ghidra install (contains support\analyzeHeadless.bat)
REM
REM Output: attribmod_parser_report.txt next to cityofheroes.exe

set EXE=G:\Homecoming\bin\win64\live\cityofheroes.exe
set PROJ_DIR=%~dp0project
set PROJ_NAME=coh_audit
REM Strip trailing backslash — otherwise "%SCRIPT_DIR%" ends in \" which cmd
REM interprets as an escaped quote, merging the following flag into the arg.
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

REM -import: load the binary, run default analyzers, then run our post-script.
REM -overwrite: re-import if project already has the file.
REM -scriptPath: where Ghidra looks for our .java script.
REM If the binary was already imported+analyzed, use -process to skip re-analysis
REM and just re-run the post-script. Pass FORCE_REIMPORT=1 to re-analyze.
if "%FORCE_REIMPORT%"=="1" goto :import
if exist "%PROJ_DIR%\%PROJ_NAME%.rep\cityofheroes.exe.prp" goto :reprocess
if exist "%PROJ_DIR%\%PROJ_NAME%.rep" goto :reprocess
goto :import

:reprocess
echo Project already imported — running post-script only.
"%GHIDRA_HOME%\support\analyzeHeadless.bat" "%PROJ_DIR%" %PROJ_NAME% ^
    -process cityofheroes.exe ^
    -noanalysis ^
    -scriptPath "%SCRIPT_DIR%" ^
    -postScript FindAttribModParser.java
goto :done

:import
"%GHIDRA_HOME%\support\analyzeHeadless.bat" "%PROJ_DIR%" %PROJ_NAME% ^
    -import "%EXE%" ^
    -overwrite ^
    -scriptPath "%SCRIPT_DIR%" ^
    -postScript FindAttribModParser.java

:done

echo.
echo Report written next to cityofheroes.exe:
echo   G:\Homecoming\bin\win64\live\attribmod_parser_report.txt
