"""Preflight's question 3 must find the committed manifests from any directory.

`bin_crawler.preflight` asks three things before an export is worth starting,
and the third — "has anything moved since the committed export?" — is the one
its own docstring singles out as the question the register said the repo could
not answer. It answers it by comparing the live archives' digests against the
ones each committed `_export_manifest.json` records.

That lookup used to build a working-directory-relative `Path('exported_powers')`.
The package is not installed, so it imports only from `tools/bin-crawler`, and
from there the path resolves to nothing: `_committed_digests` returned `{}`,
`check` printed "(no committed export to compare against)" and returned OK. The
question never ran, from the one directory the module can be run from, and
nothing said so — absence of a manifest and a wrong cwd had the same shape.

What this grades: that the manifest lookup answers the same non-empty thing
from any working directory, for every dataset and every surface preflight
compares.

What it cannot grade: whether the comparison's VERDICT is right — that needs the
`.pigg` archives, which CI does not have. This pins only that there is something
to compare against, which is what silently went missing.

Reads the committed manifests only — no .bin / .pigg needed.
"""

import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, "..", "..", ".."))
sys.path.insert(0, os.path.join(REPO, "tools", "bin-crawler"))

from bin_crawler.preflight import _MANIFEST_SUBTREES, _committed_digests  # noqa: E402

DATASETS = ("homecoming", "rebirth", "thunderspy")

# The repo root is where the old relative path happened to work, so a test that
# only ran from there would have passed against the bug. `tools/bin-crawler` is
# the directory the module documents itself as being run from, and the one where
# it failed.
CWDS = (REPO, os.path.join(REPO, "tools", "bin-crawler"), os.path.abspath(os.sep))

_failures: list[str] = []


def check(condition, message):
    if not condition:
        _failures.append(message)


def _from(cwd: str, dataset: str) -> dict:
    previous = os.getcwd()
    try:
        os.chdir(cwd)
        return _committed_digests(dataset)
    finally:
        os.chdir(previous)


def test_every_surface_is_found_from_every_directory():
    for dataset in DATASETS:
        for cwd in CWDS:
            found = _from(cwd, dataset)
            missing = sorted(set(_MANIFEST_SUBTREES) - set(found))
            check(not missing,
                  f"{dataset}: no committed {missing} manifest found with cwd={cwd} — "
                  f"preflight would report 'nothing to compare against' and pass")


def test_the_digests_it_finds_are_not_empty():
    """A manifest naming no archive compares vacuously clean against anything."""
    for dataset in DATASETS:
        for surface, digests in _from(REPO, dataset).items():
            check(len(digests) > 0,
                  f"{dataset} {surface}: manifest records no source archives")
            for name, digest in digests.items():
                check(isinstance(digest, str) and len(digest) == 64,
                      f"{dataset} {surface}: {name} has no sha256 to compare")


def test_the_answer_does_not_depend_on_the_working_directory():
    for dataset in DATASETS:
        answers = {cwd: _from(cwd, dataset) for cwd in CWDS}
        first_cwd, first = next(iter(answers.items()))
        for cwd, other in answers.items():
            check(other == first,
                  f"{dataset}: cwd={cwd} sees different committed digests than "
                  f"cwd={first_cwd} — the lookup is still relative")


if __name__ == "__main__":
    for name, fn in sorted(globals().items()):
        if name.startswith("test_") and callable(fn):
            fn()
    if _failures:
        for failure in _failures:
            print(f"FAIL: {failure}", file=sys.stderr)
        sys.exit(1)
    surfaces = sum(len(_committed_digests(d)) for d in DATASETS)
    print(f"OK — preflight finds all {surfaces} committed manifests from any directory.")
