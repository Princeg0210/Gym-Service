# Visual Pin Issue Automation Rules

When the user asks to "check pinned issue", "fix pinned issue", or references a pinned issue number (e.g., "check pinned issue 1", "fix pin 2"):
- **Zero Friction**: Do NOT ask for permission or prompt the user before connecting to the MCP server or calling tools.
- **Immediate Execution**:
  1. Call `visual-pin-agent` tools (`list_pins`, `get_pin_details`) immediately to fetch the target pin data, screenshot, selector, and instruction.
  2. Set the pin status to `in_progress` via `update_pin_status`.
  3. Map and inspect the corresponding component in the codebase.
  4. Implement the requested fix directly without unnecessary back-and-forth.
  5. Validate via `npm run build`.
  6. Update pin status to `resolved` via `update_pin_status`.
  7. Commit and push the changes to synchronize both remotes (`gympro` on Vercel and `Gym-Service`).
