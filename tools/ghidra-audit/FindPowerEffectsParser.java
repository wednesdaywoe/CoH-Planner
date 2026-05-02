// Ghidra headless script — locate the powers.bin parser tail (post-field 74).
//
// _parse_power_parse6 in bin-crawler stops at field 74 with skip_to_end and
// every Rebirth power exports with empty `effects: []`. Field 75+ in Parse7
// is mode arrays → redirects → effects, but blindly copying that tail to
// Parse6 still produces 0/21559 powers with effects, so the layout
// genuinely diverges somewhere between field 74 and the effect-group
// struct_array.
//
// This script anchors on grammar tokens for the post-mode block — Redirect,
// ExclusionGroups, ModesRequired/Disallowed/Suspended, Effect, EffectGroup,
// AllowedBoostsetCats — finds the powers parser, and dumps the
// decompilation. The descriptor table walk should reveal the exact field
// order plus type codes (string_array vs u4_array vs struct_array).
//
// @category Analysis
// @menupath Tools.Find PowerEffects Parser

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

public class FindPowerEffectsParser extends GhidraScript {

    // .def grammar tokens for the powers.bin tail block. Heavily focused on
    // post-field-74 fields where Parse6 diverges from Parse7. Excludes
    // generic short tokens like "Power" / "Effect" alone — those appear
    // hundreds of places and pollute the xref noise.
    private static final String[] TARGETS = {
        // Post-field-74 fields per the Parse7 layout
        "ExclusionGroups", "ModesRequired", "ModesDisallowed", "ModesSuspended",
        "Redirect", "ShowInInfo",
        // Effect-group container fields
        "EffectGroup", "Effects", "ActivationEffects", "ActivationEffect",
        // Effect-group inner fields (chance / requires / flags)
        "Chance", "PPM", "RadiusInner", "RadiusOuter", "ProcsPerMinute",
        "RequiresExpression", "ChildEffectGroups",
        "PowerEffectGroup", "PowerEffectGroupChild",
        // AllowedBoostsetCats / boost machinery (we know boostsetcats isn't
        // actually in the binary, but the grammar token might still exist
        // and lead us to the right parser)
        "AllowedBoostsetCats", "AllowedSetCategories", "BoostsAllowed",
        "ModeGroupRefs",
        // Top-level powers.bin fields useful as a parser anchor (we'll find
        // the same parser function regardless of which token we hit on)
        "PowerName", "PowerCategory", "PowerSet",
        "AttackTypes", "RechargeTime", "ActivatePeriod", "EnduranceCost",
        "Accuracy", "Range", "RangeSecondary", "Radius", "Arc",
        "TimeToActivate", "ChainEffectArray", "ChainDelay",
        // Confirm dialog fields (53-56) — Parse6 retains these, Parse7 may not
        "ConfirmRequires", "ConfirmString",
    };

    @Override
    protected void run() throws Exception {
        File out = new File(getProgramFile().getParentFile(), "power_effects_parser_report.txt");
        try (PrintWriter w = new PrintWriter(new BufferedWriter(new FileWriter(out)))) {
            w.println("PowerEffects parser string-xref report");
            w.println("Binary: " + currentProgram.getExecutablePath());
            w.println("Time:   " + new Date());
            w.println();

            Map<String, List<Address>> stringAddrs = new LinkedHashMap<>();
            Set<Address> allStringAddrs = new HashSet<>();
            for (String target : TARGETS) {
                List<Address> hits = findStringAddresses(target);
                stringAddrs.put(target, hits);
                allStringAddrs.addAll(hits);
            }

            w.println("=== Resolved string addresses ===");
            for (Map.Entry<String, List<Address>> e : stringAddrs.entrySet()) {
                w.println(String.format("  %-26s %s", e.getKey(),
                        e.getValue().isEmpty() ? "(not found)" : e.getValue()));
            }
            w.println();

            Map<Address, String> addrToName = new HashMap<>();
            for (Map.Entry<String, List<Address>> e : stringAddrs.entrySet()) {
                for (Address a : e.getValue()) addrToName.put(a, e.getKey());
            }

            Set<Long> wanted = new HashSet<>();
            for (Address a : allStringAddrs) wanted.add(a.getOffset());

            List<long[]> ptrHits = new ArrayList<>();
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
            w.println("=== Data references to target strings ===");
            for (long[] h : ptrHits) {
                long dataAddr = h[0];
                long strOff = h[1];
                String name = addrToName.get(currentProgram.getAddressFactory()
                    .getDefaultAddressSpace().getAddress(strOff));
                w.println(String.format("  data 0x%x -> string 0x%x (%s)",
                        dataAddr, strOff, name));
            }
            w.println();

            // Run grouping (gaps <= 64 bytes = same descriptor table).
            Set<Long> runStarts = new TreeSet<>();
            if (!ptrHits.isEmpty()) {
                long runEnd = ptrHits.get(0)[0];
                runStarts.add(ptrHits.get(0)[0]);
                for (long[] h : ptrHits) {
                    if (h[0] - runEnd > 64) runStarts.add(h[0]);
                    runEnd = h[0];
                }
            }

            // Region dumps for each run (16-byte rows + per-row qword pair).
            w.println("=== Table region dumps ===");
            if (!ptrHits.isEmpty()) {
                long curRunStart = ptrHits.get(0)[0];
                long curRunEnd = curRunStart;
                List<long[]> runs = new ArrayList<>();
                for (long[] h : ptrHits) {
                    if (h[0] - curRunEnd > 64) {
                        runs.add(new long[]{curRunStart, curRunEnd});
                        curRunStart = h[0];
                    }
                    curRunEnd = h[0];
                }
                runs.add(new long[]{curRunStart, curRunEnd});

                for (long[] run : runs) {
                    w.println(String.format("--- run 0x%x .. 0x%x ---", run[0], run[1]));
                    dumpRegion(w, run[0] - 32, run[1] + 256);
                    w.println();
                }
            }

            // Walk descriptor tables (48-byte rows).
            w.println("=== Descriptor-table walks ===");
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

            // Find parser function via xrefs to each table base.
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
                        int limit = Math.min(500, lines.length);
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
