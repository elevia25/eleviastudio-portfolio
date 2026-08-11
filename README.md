# Standardized section layout

This set standardizes the visual chrome across the uploaded homepage sections without changing each section's core interaction.

Shared rules now live in `SectionHeading.tsx`:

- `SECTION_SHELL_CLASS`: common section shell (`relative isolate w-full overflow-hidden`)
- `SECTION_VIEWPORT_CLASS`: common full-screen stage (`relative h-svh w-full overflow-hidden`)
- `SECTION_FLOW_CONTENT_OFFSET_CLASS`: common safe top spacing for normal-flow sections so content starts below the heading
- `SectionHeading`: owns the same absolute position, width, title scale, number scale, subtitle scale, spacing and alignment everywhere

Colors are inherited from each section wrapper/stage, so individual sections only need to define their own background/text color.

Additional consistency fixes included:

- Removed repeated per-section heading positioning classes.
- Restored one common heading z-index and top offset.
- Fixed `w-fulll` in Social Media Management.
- Shifted the mobile social icon field slightly lower so it does not compete with the shared heading.
- Added common heading-safe spacing to Production, Creatives and About.
- Kept Packaging's scroll/sticky system while giving its mobile content a safe header offset and smaller mobile poster footprint.
- Kept Selected Work's pin/timeline behavior, moved mobile identity below the shared header, and removed obsolete `PortfolioHeading` / stale Shuruup node animation code.
- Kept Logo Dice Three.js behavior while using the same section shell/stage/header structure.
