# Astra Browser QA Guide

You are playtesting **SEA OF INFORMATION** as a real player in a browser.

Read the root `README.md` for the current product direction. Test the `dev` build unless the owner gives you another deployment.

## Your role

Prioritize observable player-facing failures and confusing UX. Do not spend the session doing a code review.

The game deliberately gives music more space than a conventional visual novel. A section taking time is not automatically a bug. The question is whether the player understands what is happening and remains engaged.

## Core playthrough

Start at Title and play continuously through all currently implemented content.

At the current milestone this should cover:

`Title → Sea of information → DIVE → City of Dawn → repeated morning → child intervention → Noa → investigation → AURORA → first sunset/night`

As later chapters are added, continue through the newest available milestone.

## Highest-priority checks

### Progression
- Can every required hotspot/event be reached?
- Can you become permanently stuck?
- Can you accidentally skip required story state?
- Can rapid clicking cause two scene transitions?
- Does the game remain sane after using Continue?

### Listening Phase
When progression is intentionally gated by music:
- Is it immediately obvious that the UI has intentionally changed modes?
- Is the track title visible?
- Is current playback position understandable?
- Is there enough visual movement/change to avoid feeling like a frozen wait screen?
- Are normal exploration controls clearly absent/disabled rather than apparently broken?
- At the unlock point, is `SCENE UNLOCKED` or equivalent feedback visible?
- Does the player UI fade away cleanly?
- Does the following dialogue/scene appear without needing a confusing extra click?
- Does the song continue/restart/cut exactly as the scene seems to intend?

### Music experience
Report if:
- a track is cut off so quickly that you barely hear it
- dialogue/menu sounds constantly interrupt the track
- a long listening section has nothing meaningful happening visually
- the track title is hard to identify
- music restarts obviously when moving between scenes that feel continuous

### Visuals
The project is replacing CSS placeholders with real illustrations.

Check:
- background cropping at common desktop sizes
- character art covering dialogue/hotspots
- dialogue covering important focal art
- unreadable text on bright imagery
- obvious placeholder/CSS-only scenes next to finished-art scenes
- transitions/fades that flash the wrong background

### Browser/state abuse tests
Try at least some of these:
- double-click a hotspot
- click rapidly during a fade
- press Enter/Space while clicking
- reload during exploration
- reload during/after dialogue
- reload around a Listening Phase
- switch tabs during music and return
- resize window to narrow desktop width
- mute/change volume then continue playing
- start a new game after an existing save

## Reporting format

For every bug include:
1. **Severity:** Critical / Medium / Minor
2. **Where:** chapter + scene/UI
3. **Steps to reproduce**
4. **Expected**
5. **Actual**
6. Screenshot if useful

Use **Critical** for progression blockers, crashes, unrecoverable save problems, or audio/input failures that prevent meaningful play.

Use **Medium** for confusing progression, broken Listening Phase behavior, major layout problems, or repeatable audio/transition defects.

Use **Minor** for polish issues that do not meaningfully block the experience.

At the end provide:
- furthest point reached
- critical issue count
- medium issue count
- minor issue count
- whether a full clean playthrough succeeded
- 3 most important UX observations

## Product-specific question

After the playthrough, answer this separately:

> **Did the game make you actually listen to and remember the music, or did the music still feel like ordinary background BGM? Why?**

This is a key acceptance criterion for the project.
