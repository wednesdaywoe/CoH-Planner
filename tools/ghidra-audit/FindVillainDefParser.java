// Ghidra headless script — locate the VillainDef (entity) parser in cityofheroes.exe.
//
// villaindef.bin holds the per-entity definitions the planner needs for pet
// damage. The Parse7 layout was reverse-engineered byte-by-byte; Parse6
// diverges in unknown ways (especially the levels block — between powers
// and levels there's a 4 × u4 sentinel `54, 52, 1, 1` we couldn't explain).
// Rather than keep guessing, follow the same pattern as
// FindAttribModParser: find the .def-grammar tokens for VillainDef in the
// binary, follow xrefs to the parser function, and dump its decompilation.
//
// @category Analysis
// @menupath Tools.Find VillainDef Parser

import ghidra.app.decompiler.DecompInterface;
import ghidra.app.decompiler.DecompileResults;
import ghidra.app.script.GhidraScript;
import ghidra.program.model.address.Address;
import ghidra.program.model.listing.Data;
import ghidra.program.model.listing.Function;
import ghidra.program.model.mem.Memory;
import ghidra.program.model.mem.MemoryBlock;
import ghidra.program.model.symbol.Reference;

import java.io.*;
import java.util.*;

public class FindVillainDefParser extends GhidraScript {

    // Field names from the VillainDef .def grammar. Each is either a token
    // in the parser's keyword table or an error message; xrefs land in the
    // parser. The list mixes top-level fields with `defaults.*` and
    // `levels[].*` so we'll catch every relevant table.
    private static final String[] TARGETS = {
        // Top-level entity fields
        "VillainDef", "Gender", "GroupName", "CommandablePet",
        "PowerTags", "Ally", "Gang", "GameExclusion",
        "InactiveStateWeapon", "CopyCreatorMods", "CanZone",
        "CustomBadgeStat", "BadgeStatFlags",
        // defaults.* block
        "Defaults", "MinLevel", "MaxLevel", "Requires",
        "SpawnLimit", "SpawnLimitMission",
        "IgnoreCombatMods", "IgnoreAVtoEBScaling", "Rank",
        "AIConfig", "CharacterClassName", "Description",
        "GroupDescription", "DisplayClassName", "DisplayName",
        "Costume", "RewardScale", "AdditionalRewards",
        "PowerFullNames", "PowerDisplayNames", "PowerLevels",
        "IsDynamic", "Powers", "ConditionHash",
        // powers struct fields
        "PowerCategory", "PowerSet", "Power", "Level",
        // conditions / levels
        "Conditions", "Levels", "DisplayNames", "Costumes",
        "Experience",
        // rank enum values (separate descriptor table that overlaps these
        // strings — gives us a second anchor)
        "VR_PET", "VR_MINION", "VR_LIEUTENANT", "VR_BOSS",
        "VR_ELITE_BOSS", "VR_ARCHVILLAIN",
    };

    @Override
    protected void run() throws Exception {
        File out = new File(getProgramFile().getParentFile(), "villaindef_parser_report.txt");
        try (PrintWriter w = new PrintWriter(new BufferedWriter(new FileWriter(out)))) {
            w.println("VillainDef parser string-xref report");
            w.println("Binary: " + currentProgram.getExecutablePath());
            w.println("Time:   " + new Date());
            w.println();

            // ---- Step 1: find the string addresses ----
            Map<String, List<Address>> stringAddrs = new LinkedHashMap<>();
            Set<Address> allStringAddrs = new HashSet<>();
            for (String target : TARGETS) {
                List<Address> hits = findStringAddresses(target);
                stringAddrs.put(target, hits);
                allStringAddrs.addAll(hits);
            }

            w.println("=== Resolved string addresses ===");
            for (Map.Entry<String, List<Address>> e : stringAddrs.entrySet()) {
                w.println(String.format("  %-22s %s", e.getKey(),
                        e.getValue().isEmpty() ? "(not found)" : e.getValue()));
            }
            w.println();

            // ---- Step 2: scan data for 8-byte pointers to these strings ----
            Map<Address, String> addrToName = new HashMap<>();
            for (Map.Entry<String, List<Address>> e : stringAddrs.entrySet()) {
                for (Address a : e.getValue()) addrToName.put(a, e.getKey());
            }

            Set<Long> wanted = new HashSet<>();
            for (Address a : allStringAddrs) wanted.add(a.getOffset());

            List<long[]> ptrHits = new ArrayList<>();  // [dataAddr, stringAddr]
            Memory mem = currentProgram.getMemory();
            for (MemoryBlock blk : mem.getBlocks()) {
                if (!blk.isInitialized()) continue;
                if (blk.isExecute()) continue;
                long start = blk.getStart().getOffset();
                long end = blk.getEnd().getOffset();
                long alignedStart = (start + 7) & ~7L;
                byte[] buf = new byte[8];
                for (long off = alignedStart; off <= end - 7; off += 8) {
                    try {
                        Address ptrAddr = currentProgram.getAddressFactory()
                            .getDefaultAddressSpace().getAddress(off);
                        mem.getBytes(ptrAddr, buf);
                        long v = 0;
                        for (int i = 7; i >= 0; i--) {
                            v = (v << 8) | (buf[i] & 0xffL);
                        }
                        if (wanted.contains(v)) {
                            ptrHits.add(new long[]{off, v});
                        }
                    } catch (Exception ex) {
                        // sparse blocks
                    }
                }
            }

            ptrHits.sort((a, b) -> Long.compare(a[0], b[0]));
            w.println("=== Data references to target strings (pointer-table scan) ===");
            for (long[] h : ptrHits) {
                long dataAddr = h[0];
                long strOff = h[1];
                String name = addrToName.get(currentProgram.getAddressFactory()
                    .getDefaultAddressSpace().getAddress(strOff));
                w.println(String.format("  data 0x%x -> string 0x%x (%s)",
                        dataAddr, strOff, name));
            }
            w.println();

            // ---- Step 3: dump 256 bytes around each contiguous run ----
            // Each "run" of pointer hits with gaps <= 64 bytes is likely the
            // same descriptor table — dumping ±256 bytes catches the 48-byte
            // rows the AttribMod descriptor uses (offset, type, flags).
            w.println("=== Table region dumps ===");
            if (!ptrHits.isEmpty()) {
                long runStart = ptrHits.get(0)[0];
                long runEnd = runStart;
                List<long[]> runs = new ArrayList<>();
                for (long[] h : ptrHits) {
                    if (h[0] - runEnd > 64) {
                        runs.add(new long[]{runStart, runEnd});
                        runStart = h[0];
                    }
                    runEnd = h[0];
                }
                runs.add(new long[]{runStart, runEnd});

                for (long[] run : runs) {
                    long dumpStart = run[0] - 32;
                    long dumpEnd = run[1] + 256;
                    w.println(String.format("--- run 0x%x .. 0x%x ---", run[0], run[1]));
                    dumpRegion(w, dumpStart, dumpEnd);
                    w.println();
                }
            }

            // ---- Step 4: walk descriptor tables found in the runs ----
            // The CoH binary parser uses 48-byte descriptor rows
            // { char* name, u32 type_code, u32 flags, u64 field_offset,
            //   u64 default_or_size, void* handler, u64 pad }.
            // For each run start, walk forward up to 80 rows and decode
            // name + type + offset.
            w.println("=== Descriptor-table walks (48-byte rows) ===");
            Set<Long> walkedStarts = new TreeSet<>();
            for (long[] h : ptrHits) walkedStarts.add(h[0]);
            // Only walk from each run's start, not every hit.
            Set<Long> runStarts = new TreeSet<>();
            if (!ptrHits.isEmpty()) {
                long runEnd = ptrHits.get(0)[0];
                runStarts.add(ptrHits.get(0)[0]);
                for (long[] h : ptrHits) {
                    if (h[0] - runEnd > 64) runStarts.add(h[0]);
                    runEnd = h[0];
                }
            }
            for (long tableStart : runStarts) {
                w.println(String.format("\n--- table @ 0x%x ---", tableStart));
                w.println(String.format("  %-8s  %-26s  %-10s  %-10s  %-10s",
                        "row_off", "name", "type_code", "flags", "offset"));
                for (int i = 0; i < 80; i++) {
                    long rowAddr = tableStart + (long) i * 48;
                    try {
                        String name = readPtrString(rowAddr);
                        long typeFull = readU8(rowAddr + 8);
                        int typeCode = (int) (typeFull & 0xffffffffL);
                        int flagsHigh = (int) ((typeFull >>> 32) & 0xffffffffL);
                        long fieldOffset = readU8(rowAddr + 16);
                        if (name == null || name.isEmpty()) {
                            w.println(String.format("  +0x%04x  (null — end of table)", (long) i * 48));
                            break;
                        }
                        w.println(String.format("  +0x%04x  %-26s  0x%-8x  0x%-8x  0x%x",
                                (long) i * 48, name, typeCode, flagsHigh, fieldOffset));
                    } catch (Exception ex) {
                        w.println(String.format("  +0x%04x  (unreadable: %s)", (long) i * 48, ex.getMessage()));
                        break;
                    }
                }
            }

            // ---- Step 5: find the parser function via xref to each table base ----
            w.println();
            w.println("=== Functions that reference a descriptor-table base ===");
            Set<Function> seen = new LinkedHashSet<>();
            DecompInterface decomp = new DecompInterface();
            decomp.openProgram(currentProgram);
            for (long tableStart : runStarts) {
                Address a = currentProgram.getAddressFactory()
                    .getDefaultAddressSpace().getAddress(tableStart);
                Reference[] refs = getReferencesTo(a);
                w.println(String.format("\n--- xrefs to 0x%x: %d refs ---", tableStart, refs.length));
                for (Reference r : refs) {
                    Function f = getFunctionContaining(r.getFromAddress());
                    if (f == null) {
                        w.println(String.format("  xref @ %s  (no containing function)", r.getFromAddress()));
                        continue;
                    }
                    w.println(String.format("  xref @ %s  in %s [%s]",
                            r.getFromAddress(), f.getName(), f.getEntryPoint()));
                    if (!seen.add(f)) {
                        w.println("    (already dumped above)");
                        continue;
                    }
                    DecompileResults dr = decomp.decompileFunction(f, 60, monitor);
                    if (dr != null && dr.getDecompiledFunction() != null) {
                        String[] lines = dr.getDecompiledFunction().getC().split("\n");
                        int limit = Math.min(400, lines.length);
                        w.println("    --- decompile ---");
                        for (int j = 0; j < limit; j++) w.println("    " + lines[j]);
                        if (lines.length > limit) {
                            w.println("    ... (truncated, " + (lines.length - limit) + " more)");
                        }
                        w.println("    --- end ---");
                    } else {
                        w.println("    (decompile failed)");
                    }
                }
            }
            decomp.dispose();
            w.println("DONE.");
        }
        println("Wrote " + out.getAbsolutePath());
    }

    private long readU8(long addr) throws Exception {
        Memory mem = currentProgram.getMemory();
        Address a = currentProgram.getAddressFactory().getDefaultAddressSpace().getAddress(addr);
        byte[] b = new byte[8];
        mem.getBytes(a, b);
        long v = 0;
        for (int i = 7; i >= 0; i--) v = (v << 8) | (b[i] & 0xffL);
        return v;
    }

    private String readPtrString(long addr) throws Exception {
        long strPtr = readU8(addr);
        if (strPtr == 0) return null;
        Memory mem = currentProgram.getMemory();
        Address sa = currentProgram.getAddressFactory().getDefaultAddressSpace().getAddress(strPtr);
        StringBuilder sb = new StringBuilder();
        byte[] one = new byte[1];
        for (int i = 0; i < 128; i++) {
            try {
                mem.getBytes(sa.add(i), one);
            } catch (Exception ex) {
                return null;
            }
            if (one[0] == 0) break;
            if (one[0] < 0x20 || one[0] > 0x7e) return null;
            sb.append((char) (one[0] & 0xff));
        }
        return sb.toString();
    }

    private void dumpRegion(PrintWriter w, long start, long end) {
        Memory mem = currentProgram.getMemory();
        byte[] buf = new byte[16];
        for (long off = start & ~15L; off < end; off += 16) {
            try {
                Address a = currentProgram.getAddressFactory()
                    .getDefaultAddressSpace().getAddress(off);
                mem.getBytes(a, buf);
                StringBuilder hex = new StringBuilder();
                for (int i = 0; i < 16; i++) hex.append(String.format("%02x ", buf[i] & 0xff));
                long qw0 = 0, qw1 = 0;
                for (int i = 7; i >= 0; i--) qw0 = (qw0 << 8) | (buf[i] & 0xffL);
                for (int i = 15; i >= 8; i--) qw1 = (qw1 << 8) | (buf[i] & 0xffL);
                w.println(String.format("  0x%x  %s | 0x%x 0x%x", off, hex.toString(), qw0, qw1));
            } catch (Exception e) {
                w.println(String.format("  0x%x  (unreadable)", off));
            }
        }
    }

    private List<Address> findStringAddresses(String needle) {
        List<Address> out = new ArrayList<>();
        for (Data d : currentProgram.getListing().getDefinedData(true)) {
            if (!(d.getValue() instanceof String)) continue;
            String s = (String) d.getValue();
            if (s == null) continue;
            if (s.equals(needle) || s.startsWith(needle)) {
                out.add(d.getAddress());
            }
        }
        return out;
    }
}
