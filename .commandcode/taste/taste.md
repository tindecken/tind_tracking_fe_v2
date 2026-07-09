# Taste (Continuously Learned by [CommandCode][cmd])

[cmd]: https://commandcode.ai/

# Code Style
- Use `@/` path alias (not `src/`) for imports from the src directory. Confidence: 0.85
- Use `Intl.NumberFormat('de-DE')` with 0 fraction digits for number formatting. Confidence: 0.80

# Quasar/Vue
- Add `dense` attribute to all `<q-select>` and `<q-input>` form fields. Confidence: 0.70
- Use local timezone (`getFullYear()/getMonth()/getDate()`) instead of `toISOString()` for date values. Confidence: 0.75
- Auto-select form fields with `isDefault: true` from API data (wallet, category). Confidence: 0.70

# Workflow
- When API server is unreachable, show user-facing error notifications rather than silently failing. Confidence: 0.70
