/**
 * Types for `bin-crawler-fingerprint.mjs`. The module stays plain ESM because
 * `scripts/sync-bin-crawler.sh` runs it with bare `node`; this declaration is
 * what lets the guard under `src/` import it without `tsc` losing the thread.
 */

export declare const REPO_ROOT: string;
export declare const SYNCED_PATHS: string[];
export declare const VENDOR_RECORD: string;
export declare const CANONICAL_REMOTE: string;

export interface RepoFingerprint {
  tree_fingerprint: string;
  export_manifest_digest: string;
  export_manifest_count: number;
}

export interface VendorRecord extends RepoFingerprint {
  schema: string;
  note: string;
  canonical_repo: string;
  synced_paths: string[];
  synced_from_commit: string;
  synced_from_subject: string;
  synced_from_date: string;
}

export declare function treeFingerprint(repoRoot: string): string;
export declare function exportManifestDigest(repoRoot: string): { digest: string; count: number };
export declare function fingerprintRepo(repoRoot: string): RepoFingerprint;
export declare function resolveCanonicalRepo(explicit?: string): string | null;
export declare function canonicalHead(repoRoot: string): {
  commit: string;
  subject: string;
  date: string;
};
export declare function readVendorRecord(repoRoot?: string): VendorRecord | null;
export declare function writeVendorRecord(canonicalPath: string, repoRoot?: string): VendorRecord;
