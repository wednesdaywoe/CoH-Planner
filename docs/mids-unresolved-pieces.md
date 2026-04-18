# Mids Unresolved Enhancement Pieces — Guidance Questionnaire

After aggressive normalization + the 328-entry HC-derived alias table + aspect-set matching + 1-aspect fuzzy match, these 20 distinct IO set pieces still fail to resolve. Total occurrences: **309 across 201 builds** (out of 2,178).

If you can tell me which piece number each Mids name corresponds to in our data, I'll add them as explicit aliases.

Fill in the **→ App piece** column with either:
- **The piece number** (1–6) that matches in our data, or
- **`skip`** if the piece genuinely doesn't exist, or
- **`unsure`** with a note.

---

## 1. Overpowering Presence / Dominating Grasp / Will of the Controller (Mez sets, 6-piece)

These Dominator ATOs all have an identical 6-piece skeleton in our data:

| # | Our piece name |
|---|---|
| 1 | `Accuracy/Mez` |
| 2 | `Mez/Recharge` |
| 3 | `Endurance/Recharge` |
| 4 | `Accuracy/Endurance/Mez` |
| 5 | `Accuracy/Endurance/Mez/Recharge` |
| 6 | `Recharge/Chance for Energy Font` / `Fiery Orb` / `Psionic Damage` (varies by set) |

Mids uses `Control Duration` where we use `Mez`.

| Mids piece | Builds | → App piece # |
|---|---|---|
| `Superior Overpowering Presence: RechargeTime/Energy Font` | 69 | `6` |
| `Superior Dominating Grasp: RechargeTime/Fiery Orb` | 43 | `6` |
| `Superior Will of the Controller: Control Duration/Recharge` | 39 | `2` |
| `Superior Overpowering Presence: Control Duration/RechargeTime` | 9 | `2` |

My guess: the first three → piece 6 (the ATO proc piece), `Control Duration/Recharge` → piece 2. Please confirm or correct.
Control Duration -> Mez
RechargeTime -> Recharge


---

## 2. Ascendency of the Dominator

Our pieces (same skeleton as set 1):

| # | Our piece name |
|---|---|
| 1 | `Accuracy/Mez` |
| 2 | `Mez/Recharge` |
| 3 | `Endurance/Recharge` |
| 4 | `Accuracy/Endurance/Mez` |
| 5 | `Accuracy/Endurance/Mez/Recharge` |
| 6 | `Recharge/Chance for +Dam(All)` |

| Mids piece | Builds | → App piece # |
|---|---|---|
| `Superior Ascendency of the Dominator: Control Duration/Recharge` | 31 | `2` |
| `Ascendency of the Dominator: Control Duration/Recharge` | 1 | `2` |

---

## 3. Mocking Beratement / Perfect Zinger (Taunt sets)

Our pieces:

| # | Mocking Beratement | Perfect Zinger |
|---|---|---|
| 1 | `Threat` | `Threat` |
| 2 | `Recharge/Threat` | `Recharge/Threat` |
| 3 | `Range/Recharge/Threat` | `Range/Recharge/Threat` |
| 4 | `Accuracy/Recharge` | `Accuracy/Recharge` |
| 5 | `Range/Threat` | `Range/Threat` |
| 6 | `Recharge` | `Chance for Psionic Damage` |

Mids tracks `Placate` as an aspect that our data doesn't have. Most of these are probably the same piece listed with extra label text.

| Mids piece | Builds | → App piece # | Notes |
|---|---|---|---|
| `Mocking Beratement: Threat/Placate` | 26 | `1` | Matches our piece 1 (`Threat`)? |
| `Mocking Beratement: Threat/Placate/Recharge/Range` | 26 | `3` | Matches our piece 3 (`Range/Recharge/Threat`)? |
| `Perfect Zinger: Threat/Placate/Recharge/Range` | 8 | `3` | Matches our piece 3 (`Range/Recharge/Threat`)? |
| `Perfect Zinger: Threat/Placate` | 1 | `1` | Matches our piece 1 (`Threat`)? |
| `Commanding Presence: Threat/Placate Resist` | 2 | `5` | Commanding Presence only has 5 pieces and no Placate Resist in our data. |
Commanding Presense (5) has +Resist Threat
---

## 4. Kinetic Combat — `Knockdown Bonus`

Our Kinetic Combat pieces:

| # | Our piece |
|---|---|
| 1 | `Accuracy/Damage` |
| 2 | `Damage/Endurance` |
| 3 | `Damage/Recharge` |
| 4 | `Damage/Endurance/Recharge` |
| 5 | `Chance for Knockback` |

| Mids piece | Builds | → App piece # |
|---|---|---|
| `Kinetic Combat: Knockdown Bonus` | 16 | `5` |

Probably piece 5 (`Chance for Knockback`) since KD and KB are mechanically related.

---

## 5. Gladiator's Armor

Our pieces:

| # | Our piece |
|---|---|
| 1 | `Damage Resistance/Endurance` |
| 2 | `Damage Resistance/Recharge` |
| 3 | `Endurance/Recharge` |
| 4 | `Damage Resistance/Endurance/Recharge` |
| 5 | `Damage Resistance` |
| 6 | `+Def(All)` |

| Mids piece | Builds | → App piece # |
|---|---|---|
| `Gladiator's Armor: End/Resist` | 10 | `1` |
| `Gladiator's Armor: Recharge/Resist` | 1 | `2` |

Likely piece 1 and piece 2 respectively (aspect order just swapped).

---

## 6. Synapse's Shock — `EndMod/Increased Run Speed`

Our pieces:

| # | Our piece |
|---|---|
| 1 | `EndMod` |
| 2 | `Damage/Recharge` |
| 3 | `EndMod/Recharge` |
| 4 | `Accuracy/Damage/Recharge` |
| 5 | `Accuracy/Damage/Endurance` |
| 6 | `EndMod/+Run Speed` |

| Mids piece | Builds | → App piece # |
|---|---|---|
| `Synapse's Shock: EndMod/Increased Run Speed` | 6 | `6` |

Almost certainly piece 6 (`EndMod/+Run Speed`).

---

## 7. Superior Kheldian's Grace — `Recharge/Form Empowerment`

Our pieces:

| # | Our piece |
|---|---|
| 1 | `Accuracy/Damage` |
| 2 | `Damage/Recharge` |
| 3 | `Accuracy/Damage/Recharge` |
| 4 | `Damage/Endurance/Recharge` |
| 5 | `Accuracy/Damage/Endurance/Recharge` |
| 6 | `Recharge/+Dam(All)/+Max HitPoints/+Res(All)` |

| Mids piece | Builds | → App piece # |
|---|---|---|
| `Superior Kheldian's Grace: Recharge/Form Empowerment` | 6 | `6` |

Likely piece 6 (the ATO proc piece).

---

## 8. Travel sets — `Thrust`, `Launch`, `Hypersonic`, `Warp`

Our pieces (4 each):

| Set | 1 | 2 | 3 | 4 |
|---|---|---|---|---|
| Thrust | `Run` | `Endurance/Run` | `Endurance` | `Run/+Run Speed` |
| Launch | `Jump` | `Endurance/Jump` | `Endurance` | `Jump/+Jump Height/+Max Jump Height` |
| Hypersonic | `Fly` | `Endurance/Fly` | `Endurance` | `Fly/+Fly Magnitude` |
| Warp | `Range` | `Endurance/Range` | `Endurance` | `Range/+Perception` |

| Mids piece | Builds | → App piece # |
|---|---|---|
| `Thrust: Running / Increased Run Speed Resistance` | 5 | `4` |
| `Launch: Jumping / Increased Jump Height` | 4 | `4` |
| `Hypersonic: Flying / Increased Fly Protection` | 3 | `4` |
| `Warp: Range / Increased Perception` | 3 | `4` |

Likely piece 4 for all four (the unique proc piece).

---

## 9. Power not found (separate issue)

| Mids name | Builds | Notes |
|---|---|---|
| `Mastermind_Buff.Radiation_Emission.EMP_Pulse` | 4 | Our MM Radiation Emission has `EM_Pulse` (no P). Simple rename alias? |

→ **Rename?** `EMP_Pulse` → `EM_Pulse`? `EM_Pulse`
Just another Mids quirk
---

## Summary

If every "likely piece 6" guess is right, this would add ~24 aliases and resolve roughly **197 of the 309 remaining occurrences**, bringing the warning rate from 9.2% → ~5%. The rest are genuine data divergences in Taunt/Placate sets.

Once you've filled in the piece numbers (or confirmed/corrected my guesses), I'll translate them into entries for `LEGACY_PIECE_ALIASES`.
