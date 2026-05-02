// Ghidra headless script — locate the generic binary serializer that
// iterates the .def descriptor tables we found in earlier passes.
//
// Findings from the previous two scripts:
//   - powers.bin descriptor lives at 0x1408f04f0 / 0x1408f0610
//   - villaindef.bin descriptor lives at 0x1408faa50 / 0x1408fab70
//   - AttribMod descriptor lives at 0x1408ed5a0 / 0x1408e9010 / 0x1408e8440
//   - getReferencesTo(table_base) returns 0 for ALL of these — Ghidra's
//     auto-analyzer didn't flag the LEA-immediate loads as references.
//
// Strategy: for each known table base, scan every executable memory
// block byte-by-byte for the 8-byte little-endian address value. Each
// match is a candidate `lea` immediate. Resolve the containing function
// and decompile it — that's where the parser/serializer dispatcher
// lives. The function appearing for the most distinct tables is the
// generic dispatcher; tables that resolve to a unique function are the
// per-format reader (Parse6 vs Parse7 if they diverge).
//
// We also dump:
//   - The handler pointer at +0x20 of every descriptor row (the
//     per-type read primitive). Grouping by handler gives us the
//     type_code → handler mapping, including any "skip-if-default"
//     wrapper handlers that gate Parse6 omission.
//   - Decompilations of each unique handler, so the serialize-side
//     logic is fully visible.
//
// @category Analysis
// @menupath Tools.Find Bin Serializer

import ghidra.app.decompiler.DecompInterface;
import ghidra.app.decompiler.DecompileResults;
import ghidra.app.script.GhidraScript;
import ghidra.program.model.address.Address;
import ghidra.program.model.listing.Function;
import ghidra.program.model.mem.Memory;
import ghidra.program.model.mem.MemoryBlock;

import java.io.*;
import java.util.*;

public class FindBinSerializer extends GhidraScript {

    // Descriptor table base addresses harvested from the previous two
    // scripts' "Descriptor-table walks" sections. Add new tables here as
    // more parsers get audited.
    private static final long[] DESCRIPTOR_TABLES = {
        // powers.bin (most-complete first — fewer rows are subsets that
        // skip leading fields, identifiable by missing initial entries)
        0x1408f04f0L, 0x1408f0610L, 0x1408f0a30L,
        // villaindef.bin defaults block
        0x1408faa50L, 0x1408fab70L, 0x1408fac90L,
        // AttribMod (kept for cross-reference)
        0x1408ed5a0L, 0x1408e9010L, 0x1408e8440L,
    };

    @Override
    protected void run() throws Exception {
        File out = new File(getProgramFile().getParentFile(), "bin_serializer_report.txt");
        try (PrintWriter w = new PrintWriter(new BufferedWriter(new FileWriter(out)))) {
            w.println("Bin serializer / dispatcher report");
            w.println("Binary: " + currentProgram.getExecutablePath());
            w.println("Time:   " + new Date());
            w.println();

            Memory mem = currentProgram.getMemory();

            // ---- Step 1: scan executable blocks for each table-base 8-byte LE ----
            // Map<tableBase, List<Address>> = LEA-immediate hit sites
            Map<Long, List<Address>> tableHits = new LinkedHashMap<>();
            for (long table : DESCRIPTOR_TABLES) tableHits.put(table, new ArrayList<>());

            // Build a map: 8-byte LE pattern → table base, for fast scan.
            Map<Long, Long> patternToTable = new HashMap<>();
            for (long table : DESCRIPTOR_TABLES) patternToTable.put(table, table);

            for (MemoryBlock blk : mem.getBlocks()) {
                if (!blk.isInitialized()) continue;
                if (!blk.isExecute()) continue;  // .text only
                long start = blk.getStart().getOffset();
                long end = blk.getEnd().getOffset();
                w.println(String.format(
                    "Scanning %s (%s) [0x%x .. 0x%x] for table-base immediates...",
                    blk.getName(), blk.isExecute() ? "exec" : "data", start, end));
                byte[] buf = new byte[8];
                // Walk byte-by-byte (immediate can land at any alignment in
                // x64 instruction encoding).
                for (long off = start; off <= end - 7; off++) {
                    try {
                        Address a = currentProgram.getAddressFactory()
                            .getDefaultAddressSpace().getAddress(off);
                        mem.getBytes(a, buf);
                        long v = 0;
                        for (int i = 7; i >= 0; i--) v = (v << 8) | (buf[i] & 0xffL);
                        Long table = patternToTable.get(v);
                        if (table != null) {
                            tableHits.get(table).add(a);
                        }
                    } catch (Exception ex) {
                        // sparse blocks, skip
                    }
                    if ((off & 0xfffffL) == 0) monitor.checkCancelled();
                }
            }
            w.println();

            // ---- Step 2: report containing functions ----
            DecompInterface decomp = new DecompInterface();
            decomp.openProgram(currentProgram);

            // tableBase -> Set<Function> (functions that load the table
            // address as an immediate)
            Map<Long, Set<Function>> tableFns = new LinkedHashMap<>();
            // Function -> Set<tableBase> (which tables this function uses)
            Map<Function, Set<Long>> fnTables = new LinkedHashMap<>();

            for (long table : DESCRIPTOR_TABLES) {
                Set<Function> fns = new LinkedHashSet<>();
                tableFns.put(table, fns);
                w.println(String.format("=== Table 0x%x: %d immediate-hit sites ===",
                        table, tableHits.get(table).size()));
                for (Address hit : tableHits.get(table)) {
                    Function f = getFunctionContaining(hit);
                    String fname = f == null ? "<none>" : f.getName();
                    w.println(String.format("  %s  in %s", hit, fname));
                    if (f != null) {
                        fns.add(f);
                        fnTables.computeIfAbsent(f, k -> new LinkedHashSet<>()).add(table);
                    }
                }
                w.println();
            }

            // ---- Step 3: rank functions by # of tables they reference ----
            // The dispatcher (if shared across multiple parser entry points)
            // appears most often; per-format readers appear once per
            // descriptor variant.
            w.println("=== Functions ranked by # of distinct tables referenced ===");
            List<Map.Entry<Function, Set<Long>>> ranked =
                new ArrayList<>(fnTables.entrySet());
            ranked.sort((a, b) -> Integer.compare(b.getValue().size(), a.getValue().size()));
            for (Map.Entry<Function, Set<Long>> e : ranked) {
                StringBuilder sb = new StringBuilder();
                for (long t : e.getValue()) sb.append(String.format(" 0x%x", t));
                w.println(String.format("  %s [%s]: %d tables -> %s",
                        e.getKey().getName(), e.getKey().getEntryPoint(),
                        e.getValue().size(), sb.toString().trim()));
            }
            w.println();

            // ---- Step 4: decompile each candidate function ----
            // Cap at 30 functions to keep the report bounded.
            w.println("=== Decompiled candidate functions ===");
            int decompiled = 0;
            for (Map.Entry<Function, Set<Long>> e : ranked) {
                if (decompiled++ >= 30) {
                    w.println("(stopping at 30 — adjust DECOMP_LIMIT in script for more)");
                    break;
                }
                Function f = e.getKey();
                w.println(String.format("\n--- %s @ %s (refs %d tables) ---",
                        f.getName(), f.getEntryPoint(), e.getValue().size()));
                DecompileResults dr = decomp.decompileFunction(f, 90, monitor);
                if (dr != null && dr.getDecompiledFunction() != null) {
                    String[] lines = dr.getDecompiledFunction().getC().split("\n");
                    int limit = Math.min(500, lines.length);
                    for (int j = 0; j < limit; j++) w.println("  " + lines[j]);
                    if (lines.length > limit) {
                        w.println("  ... (truncated, " + (lines.length - limit) + " more lines)");
                    }
                } else {
                    w.println("  (decompile failed)");
                }
            }
            w.println();

            // ---- Step 5: extract per-row handler pointers ----
            // Each descriptor row is 48 bytes: name(8) + type(4) + flags(4)
            // + offset(8) + default(8) + handler(8) + pad(8). Walking the
            // tables and dumping unique handlers gives us the type_code →
            // handler dispatch table — the same mapping the serializer's
            // switch statement implements.
            w.println("=== Per-type handler dispatch (handler @ row+0x20) ===");
            // Map<typeCode, Map<handler, exampleRowName>> — typeCode appears
            // at row+0x8 (low 32 bits)
            Map<Integer, Map<Long, String>> typeToHandlers = new TreeMap<>();
            // Also collect ALL unique handler addresses for later
            Map<Long, String> handlerExamples = new LinkedHashMap<>();
            for (long table : DESCRIPTOR_TABLES) {
                for (int i = 0; i < 80; i++) {
                    long rowAddr = table + (long) i * 48;
                    try {
                        long namePtr = readU8(rowAddr);
                        if (namePtr == 0) break;  // end of table
                        String name = readCString(namePtr, 64);
                        if (name == null || name.isEmpty()) break;
                        long typeFull = readU8(rowAddr + 8);
                        int typeCode = (int) (typeFull & 0xffffffffL);
                        long handler = readU8(rowAddr + 32);  // +0x20
                        typeToHandlers
                            .computeIfAbsent(typeCode, k -> new LinkedHashMap<>())
                            .putIfAbsent(handler, name);
                        if (!handlerExamples.containsKey(handler)) {
                            handlerExamples.put(handler, String.format(
                                "type 0x%x, e.g. %s in table 0x%x row +0x%x",
                                typeCode, name, table, (long) i * 48));
                        }
                    } catch (Exception ex) {
                        break;
                    }
                }
            }
            for (Map.Entry<Integer, Map<Long, String>> e : typeToHandlers.entrySet()) {
                w.println(String.format("type 0x%x:", e.getKey()));
                for (Map.Entry<Long, String> h : e.getValue().entrySet()) {
                    w.println(String.format("    handler 0x%x  (e.g. field %s)",
                            h.getKey(), h.getValue()));
                }
            }
            w.println();

            // ---- Step 6: recursively walk sub-descriptors ----
            // The +0x20 field points into the .data section past .text
            // (.text ends at 0x140787fff in this build), so it's not a code
            // pointer — it's a SUB-DESCRIPTOR pointer for nested types like
            // struct_array (0x50001d) and AttribMod (0x5c001d). Walking it
            // as a 48-byte-row table reveals the inner struct's field
            // layout, which is what we need to crack Parse6 effects.
            w.println("=== Sub-descriptor walks (struct_array / AttribMod payloads) ===");
            Set<Long> walkedSubs = new HashSet<>();
            for (long table : DESCRIPTOR_TABLES) walkedSubs.add(table);  // skip top-level

            // Recursive helper: walk(addr, depth, label).
            Deque<long[]> queue = new ArrayDeque<>();  // [addr, depth, parentTable, parentRow]
            for (long table : DESCRIPTOR_TABLES) {
                for (int i = 0; i < 80; i++) {
                    long rowAddr = table + (long) i * 48;
                    try {
                        long namePtr = readU8(rowAddr);
                        if (namePtr == 0) break;
                        long typeFull = readU8(rowAddr + 8);
                        int typeCode = (int) (typeFull & 0xffffffffL);
                        long subPtr = readU8(rowAddr + 32);  // +0x20
                        // Only recurse on types that need a sub-descriptor:
                        // 0x1d (single struct), 0x40001d (struct), 0x50001d
                        // (struct_array), 0x5c001d (AttribMod).
                        boolean needsSub =
                            (typeCode & 0xff) == 0x1d
                            || typeCode == 0x40001d
                            || typeCode == 0x50001d
                            || typeCode == 0x5c001d;
                        if (needsSub && subPtr != 0 && !walkedSubs.contains(subPtr)) {
                            queue.add(new long[]{subPtr, 1, table, (long) i * 48});
                        }
                    } catch (Exception ex) {
                        break;
                    }
                }
            }

            while (!queue.isEmpty()) {
                long[] item = queue.removeFirst();
                long subAddr = item[0];
                long depth = item[1];
                long parentTable = item[2];
                long parentRow = item[3];
                if (walkedSubs.contains(subAddr)) continue;
                walkedSubs.add(subAddr);

                String parentName = "?";
                try {
                    parentName = readCString(readU8(parentTable + parentRow), 64);
                } catch (Exception ignored) {}

                w.println(String.format(
                    "\n--- sub-descriptor @ 0x%x  (depth=%d, from table 0x%x row +0x%x = %s) ---",
                    subAddr, depth, parentTable, parentRow, parentName));
                w.println(String.format("  %-8s  %-26s  %-10s  %-10s  %-10s  %-12s",
                        "row_off", "name", "type_code", "flags", "offset", "sub_ptr"));
                int rows = 0;
                for (int i = 0; i < 200; i++) {
                    long rowAddr = subAddr + (long) i * 48;
                    try {
                        long namePtr = readU8(rowAddr);
                        if (namePtr == 0) {
                            w.println(String.format("  +0x%04x  (null — end)", (long) i * 48));
                            break;
                        }
                        String name = readCString(namePtr, 64);
                        if (name == null || name.isEmpty()) {
                            w.println(String.format("  +0x%04x  (no name — end)", (long) i * 48));
                            break;
                        }
                        long typeFull = readU8(rowAddr + 8);
                        int typeCode = (int) (typeFull & 0xffffffffL);
                        int flags = (int) ((typeFull >>> 32) & 0xffffffffL);
                        long fieldOffset = readU8(rowAddr + 16);
                        long subPtr = readU8(rowAddr + 32);
                        w.println(String.format("  +0x%04x  %-26s  0x%-8x  0x%-8x  0x%-8x  0x%x",
                                (long) i * 48, name, typeCode, flags, fieldOffset, subPtr));
                        rows++;
                        // Queue further recursion for nested struct types.
                        boolean needsSub =
                            (typeCode & 0xff) == 0x1d
                            || typeCode == 0x40001d
                            || typeCode == 0x50001d
                            || typeCode == 0x5c001d;
                        if (needsSub && subPtr != 0 && !walkedSubs.contains(subPtr) && depth < 4) {
                            queue.add(new long[]{subPtr, depth + 1, subAddr, (long) i * 48});
                        }
                    } catch (Exception ex) {
                        w.println(String.format("  +0x%04x  (unreadable)", (long) i * 48));
                        break;
                    }
                }
                if (rows == 0) {
                    w.println("  (no rows — likely not a descriptor)");
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

    private String readCString(long addr, int max) throws Exception {
        Memory mem = currentProgram.getMemory();
        Address a = currentProgram.getAddressFactory().getDefaultAddressSpace().getAddress(addr);
        StringBuilder sb = new StringBuilder();
        byte[] one = new byte[1];
        for (int i = 0; i < max; i++) {
            try {
                mem.getBytes(a.add(i), one);
            } catch (Exception ex) {
                return null;
            }
            if (one[0] == 0) break;
            if (one[0] < 0x20 || one[0] > 0x7e) return null;
            sb.append((char) (one[0] & 0xff));
        }
        return sb.toString();
    }
}
