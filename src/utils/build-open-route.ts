/**
 * Where a build file has to be read.
 *
 * A `.skif` names the server it was saved on, and the active dataset is a boot-time singleton
 * — so a file from another server can be read one of two ways, and they are different acts:
 *
 *   - open it on ITS server (reload onto that dataset), which is what the user wants when the
 *     file is simply from a server they aren't currently on; or
 *   - PORT it into the dataset already loaded, which is what they want when the question is
 *     "what does this build look like on the other shard" — a live Homecoming build read
 *     against Brainstorm to see what the next patch does to it.
 *
 * Neither is a safe default for the other, so the caller asks. This module only decides
 * whether there is a question to ask; `buildStore.importBuild` performs whichever act.
 *
 * The rebuild's `crates/app/src/build_io.rs::open_route` is the twin of this decision.
 */

import { isDatasetId, type DatasetId } from '@/data/dataset';

/** The dataset a payload names, or `null` when it names none this build ships. */
export function payloadServerId(json: string): DatasetId | null {
  try {
    const raw = JSON.parse(json) as { build?: { serverId?: unknown } };
    const named = raw?.build?.serverId;
    // A file predating the field is a Homecoming file — the same assumption `hydrateBuild`
    // makes, and it must be the same one or the two disagree about whether to ask at all.
    if (named === undefined) return 'homecoming';
    return isDatasetId(named) ? named : null;
  } catch {
    return null;
  }
}

/**
 * The fork a file wants, when that is not the one loaded. `null` means don't ask: either the
 * file is already on this dataset, or it names one this build cannot load, and an unreadable
 * file's refusal belongs to the reader that can state it.
 */
export function crossDatasetChoice(json: string, loaded: DatasetId): DatasetId | null {
  const named = payloadServerId(json);
  return named && named !== loaded ? named : null;
}
