// Ghidra headless script — locate the AttribMod/template parser in cityofheroes.exe
// Drop this in <ghidra>/Ghidra/Features/Base/ghidra_scripts/ or pass via -postScript.
//
// Strategy: find strings the engine uses to parse .def files (kStack, kExpression,
// StackType, etc.). Every such string is either a token in a parse table or an
// error message — xrefs from code land inside the parser function(s). We dump
// the containing function's decompilation so the field order can be read directly.
//
// @category Analysis
// @menupath Tools.Find AttribMod Parser

import ghidra.app.decompiler.DecompInterface;
import ghidra.app.decompiler.DecompileResults;
import ghidra.app.script.GhidraScript;
import ghidra.program.model.address.Address;
import ghidra.program.model.data.StringDataInstance;
import ghidra.program.model.listing.Data;
import ghidra.program.model.listing.Function;
import ghidra.program.model.mem.Memory;
import ghidra.program.model.mem.MemoryBlock;
import ghidra.program.model.symbol.Reference;

import java.io.*;
import java.util.*;

public class FindAttribModParser extends GhidraScript {

    // Strings the .def grammar uses — at least some of these will be in the .rdata
    // section as literal tokens used by the parser's keyword table or error logger.
    // Expanded list covers every AttribMod field we know about, so the field-
    // descriptor table that defines the BINARY layout shows up in full.
    private static final String[] TARGETS = {
        // StackType values
        "kStack", "kReplace", "kIgnore", "kExtend", "kSuppress",
        "kRefreshToCount", "kContinuous", "kStackThenIgnore", "kMaximize",
        "kRefresh", "kOverlap", "kCollective",
        // Type values
        "kMagnitude", "kDuration", "kExpression", "kConstant",
        // Aspect / Target (to anchor more tables)
        "kCur", "kMax", "kStr", "kRes", "kAbs",
        "kSelf", "kTarget", "kCaster",
        // AttribMod field names (per-field rows of the descriptor table)
        "Attrib", "Aspect", "Type", "Target", "Table",
        "Scale", "Duration", "Magnitude", "Delay",
        "DurationExpr", "MagnitudeExpr", "DurationExpression", "MagnitudeExpression",
        "ApplicationPeriod", "ApplicationTime", "Application",
        "Continuing", "TickChance", "Chance",
        "CasterStack", "Stack", "StackType", "StackLimit", "StackKey",
        "Flags", "Params", "Messages", "FX", "Suppress",
        "JITRequires", "ActiveConditional",
        "CancelEvents", "CancelOnMiss", "RequiredEvents", "SuppressEvents",
        "BoostModAllowed", "NearGround",
        "TickMagMultiplier", "TickMagAdditive",
        "AttribMod", "EntCreate", "Power", "PriorityList", "EntityDef",
    };

    @Override
    protected void run() throws Exception {
        File out = new File(getProgramFile().getParentFile(), "attribmod_parser_report.txt");
        try (PrintWriter w = new PrintWriter(new BufferedWriter(new FileWriter(out)))) {
            w.println("AttribMod parser string-xref report v2");
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
                w.println(String.format("  %-20s %s", e.getKey(),
                        e.getValue().isEmpty() ? "(not found)" : e.getValue()));
            }
            w.println();

            // ---- Step 2: scan writable/readable data for 8-byte pointers to these strings ----
            // This finds the keyword table. For x64 PE, pointers are absolute 64-bit values
            // within the mapped image — we scan all initialized non-executable blocks.
            w.println("=== Data references to target strings (pointer-table scan) ===");
            Map<Address, String> addrToName = new HashMap<>();
            for (Map.Entry<String, List<Address>> e : stringAddrs.entrySet()) {
                for (Address a : e.getValue()) addrToName.put(a, e.getKey());
            }

            // Build a set of raw long values we want to match.
            Set<Long> wanted = new HashSet<>();
            for (Address a : allStringAddrs) wanted.add(a.getOffset());

            // Track hits: (data-address, pointed-to-string-name)
            List<long[]> ptrHits = new ArrayList<>();  // [dataAddr, stringAddr]
            Memory mem = currentProgram.getMemory();
            for (MemoryBlock blk : mem.getBlocks()) {
                if (!blk.isInitialized()) continue;
                if (blk.isExecute()) continue;  // skip .text
                long start = blk.getStart().getOffset();
                long end = blk.getEnd().getOffset();
                // Scan 8 bytes at a time. 8-byte aligned.
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
                        // fall through — blocks can be sparse
                    }
                }
            }

            // Sort by data address so table runs are contiguous.
            ptrHits.sort((a, b) -> Long.compare(a[0], b[0]));
            for (long[] h : ptrHits) {
                long dataAddr = h[0];
                long strOff = h[1];
                String name = addrToName.get(currentProgram.getAddressFactory()
                    .getDefaultAddressSpace().getAddress(strOff));
                w.println(String.format("  data 0x%x -> string 0x%x (%s)",
                        dataAddr, strOff, name));
            }
            w.println();

            // ---- Step 3: dump 128 bytes around each distinct table region ----
            // Group ptrHits into contiguous runs (gaps <= 64 bytes = same table).
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
                    long dumpEnd = run[1] + 256;  // catch trailing rows past the last pointer we matched
                    w.println(String.format("--- run 0x%x .. 0x%x ---", run[0], run[1]));
                    dumpRegion(w, dumpStart, dumpEnd);
                    w.println();
                }
            }

            // ---- Step 4: walk the AttribMod descriptor tables end-to-end ----
            // Each table is a run of 48-byte rows { char* name, u32 type, u32 flags,
            // u64 offset, u64 default_or_size, void* handler, u64 pad }. We walk
            // from known starts and stop at a row whose name pointer is null or
            // outside a string section (usually .rdata). This dereferences the
            // name string so we see every field — including the "???" ones our
            // original TARGETS list missed (Params, Continuing, NearGround, etc.).
            w.println("=== AttribMod descriptor-table walks ===");
            long[] tableStarts = {
                0x1408ed5a0L,  // binary-reader descriptor (per earlier analysis)
                0x1408e9010L,  // def-parser descriptor
                0x1408e8440L,  // another smaller descriptor (EntCreate-related?)
            };
            for (long tableStart : tableStarts) {
                w.println(String.format("\n--- table @ 0x%x ---", tableStart));
                w.println(String.format("  %-8s  %-24s  %-10s  %-10s  %-10s",
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
                        w.println(String.format("  +0x%04x  %-24s  0x%-8x  0x%-8x  0x%x",
                                (long) i * 48, name, typeCode, flagsHigh, fieldOffset));
                    } catch (Exception ex) {
                        w.println(String.format("  +0x%04x  (unreadable: %s)", (long) i * 48, ex.getMessage()));
                        break;
                    }
                }
            }

            // ---- Step 5: find the reader/writer function by xref to table BASE ----
            w.println();
            w.println("=== Functions that reference a descriptor-table base address ===");
            Set<Function> seen = new LinkedHashSet<>();
            DecompInterface decomp = new DecompInterface();
            decomp.openProgram(currentProgram);
            for (long tableStart : tableStarts) {
                Address a = currentProgram.getAddressFactory()
                    .getDefaultAddressSpace().getAddress(tableStart);
                Reference[] refs = getReferencesTo(a);
                w.println(String.format("\n--- xrefs to table base 0x%x: %d refs ---", tableStart, refs.length));
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
                return null;  // pointer doesn't land in mapped memory — not a string
            }
            if (one[0] == 0) break;
            if (one[0] < 0x20 || one[0] > 0x7e) return null;  // non-printable → not a string
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
                // Also interpret as 2 × u64 — useful to see pointer pairs.
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
            // Exact match first; substring match picks up prefixes like "kStack " etc.
            if (s.equals(needle) || s.startsWith(needle)) {
                out.add(d.getAddress());
            }
        }
        return out;
    }
}
