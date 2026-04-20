# CoH Sidekick

A character build planner for City of Heroes, built as a gift to the CoH community.

CoH Sidekick is designed to stay free and community-maintained for as long as the game endures.

## The Sidekick Suite

CoH Sidekick is the flagship of a small suite of community tools for the CoH data ecosystem. All three ship from this repository:

- **CoH Sidekick** — the character build planner (this app). React/TypeScript web application in [src/](src/).
- **Pigg Wrangler** — a viewer, extractor, and Python library for the game's `.pigg` archive files. Lives under [tools/pigg-wrangler/](tools/pigg-wrangler/), with a PyInstaller build configuration in [tools/pigg-wrangler-dist/](tools/pigg-wrangler-dist/).
- **Bin Crawler** — a parser for the game's binary `.bin` data files (Cryptic Parse6 / Parse7 formats), plus an HTTP API for consumers. Lives under [tools/bin-crawler/](tools/bin-crawler/). Depends on Pigg Wrangler for archive access.

The planner is the main feature; Pigg Wrangler and Bin Crawler exist so the community has maintained, open tooling to keep extracting and inspecting game data as the game evolves.

## License

CoH Sidekick is free software, licensed under the **GNU Affero General Public License v3.0 or later** (AGPL-3.0-or-later). See [LICENSE](LICENSE) for the full text.

In short:

- You are free to use, study, modify, and redistribute this software.
- Any modified version you distribute — **including versions you run as a hosted web service** — must also be released under AGPL-3.0 with full source code available to its users.
- There is no warranty. Use at your own risk.

This license was chosen deliberately to keep CoH Sidekick free and open: it prevents anyone from taking the code, closing the source, and selling it back to the community as a proprietary product.

Copyright (C) 2026 Wednesdaywoe.

## Trademarks

"CoH Sidekick" is the project's name and brand. The AGPL license covers the code; it does **not** grant permission to use the CoH Sidekick name or logo for forks or derivative works. See [TRADEMARKS.md](TRADEMARKS.md) for details.

## Game IP Notice

City of Heroes and all related assets are the property of their respective rights holders. CoH Sidekick is an unofficial, fan-made tool and is not affiliated with or endorsed by NCsoft, Paragon Studios, Homecoming, or Rebirth. Game data referenced by this tool is used solely to support community play.

## Contributing

Contributions are welcome. By submitting a pull request, you agree that your contribution will be licensed under AGPL-3.0-or-later on the same terms as the rest of the project. Please include a `Signed-off-by` line in your commits (Developer Certificate of Origin).
