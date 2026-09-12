# Claude Code Review Guide

You are reviewing **SEA OF INFORMATION**, an original browser game whose primary implementation is being handled by ChatGPT with the project owner.

Read the root `README.md` first. Treat the `dev` branch as the current source of truth.

## Your role

Act as a senior code reviewer. Do not take over product/story direction unless a technical decision creates a clear product risk.

The goal is to find concrete problems early while the game grows chapter by chapter.

## Review order

### 1. Critical — progression / data loss
Look for:
- scene with no reachable exit
- condition that can never become true
- stale closure/state causing progression to fire incorrectly
- event/hotspot that can execute twice
- save that restores to an invalid scene or impossible flag combination
- chapter transition that loses required state
- audio gate that can permanently lock progression

### 2. Audio lifecycle
Music is a first-class game system.

Check:
- browser autoplay restrictions
- track unexpectedly restarting between scenes that intentionally share a song
- stale `timeupdate`/ended listeners
- multiple Audio instances playing simultaneously
- volume/settings persistence
- seeking/currentTime assumptions before metadata is loaded
- cleanup on unmount/scene change
- Listening Phase unlock timing

### 3. React / TypeScript
Check:
- effect dependency mistakes
- race conditions around scene/dialogue/music transitions
- derived state stored unnecessarily
- mutation of state/data objects
- unsafe casts
- timer/listener cleanup
- unstable keys
- overly coupled runtime code that will become hard to extend across 15 tracks

### 4. Save compatibility
Save data should fail safely. The project will grow for many iterations.

Check versioning, validation, fallback behavior, partial/corrupt localStorage data, and whether new fields can be introduced without trapping old saves.

### 5. Input robustness
Test mentally/review for:
- double click
- rapid repeated hotspot clicks
- Enter/Space plus mouse firing same action
- clicking during fade/transition
- clicking just as Listening Phase unlocks
- browser tab becoming inactive
- reload during dialogue/transition

### 6. Asset/performance readiness
The project is moving from CSS placeholders to real full-screen art and large audio files.

Flag:
- unbounded image dimensions/memory usage
- avoidable layout shifts
- missing lazy/preload strategy where it matters
- inaccessible UI caused by art overlays
- expensive animation loops

## Important design constraints

Do not "fix" these away:
- Major songs intentionally occupy substantial uninterrupted time.
- A music gate is not itself a bug; unclear feedback or a broken/boring gate is.
- During a Listening Phase the normal gameplay UI intentionally changes into a music-player-like presentation.
- The project intentionally uses a data-driven scene/event structure.
- The game intentionally avoids RPG systems and feature bloat.

## Expected review format

Return findings in this order:

### Critical
For each issue:
- file + relevant code area
- exact failure scenario
- why it matters
- smallest safe fix

### Medium
Same structure.

### Minor
Keep these concise.

### Positive checks
Briefly mention systems you inspected that appear sound. This helps avoid rechecking the same concern blindly.

### Suggested tests
List only tests that have a realistic chance of catching regressions.

If there are no critical issues, explicitly say **No critical blockers found**.

Do not generate a broad rewrite merely because you prefer another architecture. Prefer small, reviewable patches unless the current design creates a demonstrated correctness/maintenance problem.

## Current review target

At the time this guide was added, review the existing `Sea of information` + `City of Dawn` implementation and the Listening Phase foundation before the project expands deeply into `Gadget Area`.
