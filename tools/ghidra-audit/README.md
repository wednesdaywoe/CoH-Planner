# Ghidra audit of cityofheroes.exe

Goal: settle the remaining AttribMod layout ambiguities (Create_Entity / Suppress
alignment, values 1/2/4 of the StackType enum) by reading the actual parser in
the HC client instead of inferring from byte diffs.

## One-time setup

1. **Java 21 JDK** — Ghidra 11.x requires it.
   - <https://adoptium.net/temurin/releases/?version=21> → "JDK" → Windows x64 MSI.
2. **Ghidra** — grab the latest `ghidra_*_PUBLIC.zip` from
   <https://github.com/NationalSecurityAgency/ghidra/releases> and unzip it
   somewhere like `C:\tools\ghidra_11.3_PUBLIC`.
3. Set `GHIDRA_HOME` once:
   ```
   setx GHIDRA_HOME "C:\tools\ghidra_11.3_PUBLIC"
   ```
   (close + reopen the terminal to pick it up.)

## Run it

```
tools\ghidra-audit\run_headless.bat
```

That:
1. Creates a project under `tools/ghidra-audit/project/`
2. Imports `G:\Homecoming\bin\win64\live\cityofheroes.exe`
3. Runs full auto-analysis (~30-60 min, mostly disassembly + type propagation)
4. Runs `FindAttribModParser.java`, which searches for every `k*` / field-name
   string the def parser uses, follows xrefs into code, and dumps the
   decompilation of each containing function.

Output: `G:\Homecoming\bin\win64\live\attribmod_parser_report.txt` —
plain text, should be grep-friendly. Look for the function that contains
sequential references to `kMagnitude`/`kExpression` plus field names like
`StackType`, `StackLimit`, `CasterStack` — that's the template parser.

## What to look for in the report

- A function that reads fields in a strict sequence (`fread`/`stream->read_u4`
  style) after matching the `k*` keyword in a switch/table. The exact field
  order in that function is the ground truth — including conditional branches
  like "if kExpression, also read the mag_expr token array."
- The value-to-name mapping for the `StackType` keyword table confirms values
  1, 2, 4 (currently labeled Ignore / Extend / Overlap by best-guess).

## If auto-analysis hangs

Game binaries sometimes trigger pathological Ghidra passes. If it's been over
2 hours with no progress, you can tame analysis by adding
`-propertiesPath ...` or disabling a specific analyzer — easiest is open
Ghidra GUI once, right-click import, customize analysis, uncheck
"Decompiler Parameter ID" and "Decompiler Switch Analysis", then re-run
headless. Default settings usually finish fine though.
