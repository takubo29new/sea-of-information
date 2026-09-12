# SEA OF INFORMATION

Original browser game combining the creator's original music with cinematic visual storytelling, exploration, mystery, and light interaction.

> **Core concept:** the soundtrack is not background music. A major track is treated as a game scene in itself. Visuals, interaction, dialogue timing, and progression are designed around the music so the player actually hears and remembers it.

## Branches

- `main` — stable/release branch. Do not use for active AI-assisted development.
- `dev` — current development branch and source of truth.

AI collaborators should review/test **`dev`** unless explicitly told otherwise.

## Current status

Working milestone: **v0.4 → v0.5**

Implemented:
- Title / NEW GAME / CONTINUE
- `Sea of information` prologue
- `City of Dawn` through AURORA shutdown and the first night
- Data-driven Scene/Event architecture
- Autosave and settings foundation
- Audio manager and Music Archive foundation
- full-screen **Listening Phase** UI for music-gated progression
- initial structure for replacing CSS-only visuals with real illustration assets

Current work:
1. Retrofit **all existing scenes** (not only future chapters) with real key visuals, backgrounds, character art, foreground/effects, and lightweight motion.
2. Apply/refine Listening Phase UX throughout `Sea of information` and `City of Dawn`.
3. Build `Gadget Area`.
4. Introduce BIT.
5. Add environmental machinery puzzles.
6. End the milestone with `IDENTITY MATCH 99.7% / ADMINISTRATOR REI / WELCOME BACK`.

## Important UX rule: Listening Phase

Do **not** leave the normal exploration/dialogue UI visible while silently rejecting input because the music has not reached a progression point.

When the story needs the player to experience more of a track:

`normal gameplay → deliberate transition → full-screen music-player presentation → music-synchronised visual/text changes → SCENE UNLOCKED → fade player UI out → return to scene/dialogue`

The Listening Phase should communicate clearly that this is intentional. It should show track title and playback position and use the song's development for visual changes. It must not feel like a countdown/wait screen.

The target for major tracks is generally to let the player naturally hear roughly 50–80% or more on a first playthrough. Short cinematic tracks may be heard almost in full.

## Visual direction

CSS gradients/shapes are scaffolding, **not the final visual target**.

Existing content must also be upgraded. Target structure:
- full-screen illustrated background/key visual
- character standing art where appropriate
- foreground layer
- subtle parallax / particles / cloud / light / camera motion
- minimal UI that does not cover the art
- concise dialogue (usually 1–3 short lines)

A useful quality test is: **would the scene still make an appealing screenshot if all dialogue text disappeared?** If not, the visual presentation needs more work.

## Story baseline

Theme: **過去は保存できる。未来は保存できない。**

SEA OF INFORMATION was built to preserve humanity's memories/history after Earth civilization collapsed. Dr. Rei later added `CREATE`, allowing the system to generate people and worlds that never historically existed.

The 17-year-old protagonist Rei is not Dr. Rei, a clone, or a reincarnation. He is a newly generated person assembled from Dr. Rei-related data plus enormous amounts of other human information. This is why administrator systems can identify him at approximately `99.7%` rather than 100%.

`12,418` means days since the last human access to SEA OF INFORMATION (~34 years), not a simulation count.

Humanity did not completely go extinct; off-Earth humans survived. The biological Dr. Rei died, while a management AI based on him remained in the system.

Do not reintroduce old discarded concepts such as 12,418 simulation loops, 12,417 prior Reis, BODY #12418, mass Rei clones, or Project ADAM unless the project owner explicitly changes the story again.

## Current chapter flow

`Sea of information → City of Dawn → Load road → Gadget Area → Load road → wish → Fantasy → beautiful → Break/blavery → Naked → Signal → Spacecraft → New create → Thundercloud → Space Home`

The project uses 15 original tracks, but **15 tracks do not mean 15 stages**. `Load road`, for example, is a recurring travel/intermission piece.

The mistakenly supplied track `Newborn10` is explicitly excluded from the game.

## Main characters

- **Rei** — 17. Newly generated protagonist. Slim, dark short hair, white/light-gray minimalist clothing, blue DIVE device. Curious, lightly humorous, acts despite uncertainty.
- **BIT** — small industrial helper robot, ~30–40 cm, yellow + dark gray/black, simple LCD face. Starts utilitarian/mechanical and gradually shows attachment through actions rather than speeches about having a heart.
- **Noa** — 16. City of Dawn resident, warm/orange visual identity and orange scarf. Remembers the repeated morning while others do not.
- **Dr. Rei** — management AI based on the deceased scientist. Not a conventional villain; wants to stop CREATE because he has watched generated beings suffer for decades.

## Technology / architecture

- Next.js
- React
- TypeScript
- data-driven `Scene → Event` structure
- localStorage save foundation
- shared audio manager

Key files:
- `components/GameApp.tsx` — main runtime/UI orchestration
- `data/scenes.ts` — current scene/dialogue/hotspot data
- `engine/model.ts` — core types/state
- `engine/audio.ts` — audio management
- `engine/saveCore.ts` / `saveClient.ts` — save handling
- `app/globals.css` — current presentation styles
- `tests/engine.test.ts` — engine/data validation

## Collaboration roles

### ChatGPT — primary implementation
Owns architecture, scene implementation, game-state integration, music/visual synchronization, ongoing fixes, and integration of feedback.

### Claude — code review
Claude should primarily **review rather than redesign the game**. See [`docs/CLAUDE_REVIEW.md`](docs/CLAUDE_REVIEW.md).

Review priorities:
1. progression blockers / broken state transitions
2. save corruption or incompatible state
3. audio lifecycle / browser autoplay / scene-transition bugs
4. React state/effect bugs and race conditions
5. repeated-click / double-trigger issues
6. TypeScript correctness
7. maintainability problems that will become costly as chapters grow
8. accessibility/performance issues with real art/audio assets

Please distinguish `critical`, `medium`, and `minor` findings and avoid large speculative rewrites when a focused fix is enough.

### ChatGPT Astra — browser QA / playtesting
Astra should behave like a player and test the actual browser build. See [`docs/ASTRA_QA.md`](docs/ASTRA_QA.md).

Priority is not just "does it run?" but also:
- can the game become stuck?
- is it obvious why input is temporarily unavailable?
- does Listening Phase feel intentional rather than broken?
- does the music get enough uninterrupted time?
- do transitions happen at the right moment?
- do art/dialogue/hotspots remain usable at different viewport sizes?
- does reload/continue return to a sane state?

## Definition of done for a milestone

A milestone is not done just because the happy path renders. Before moving on:
- chapter can be played from entry to exit without progression blockers
- save/reload works at meaningful checkpoints
- music does not unexpectedly restart/cut out during same-track scene transitions
- Listening Phase enters/exits clearly
- repeated clicks cannot double-run progression
- missing/broken save state fails safely
- no obvious viewport overflow at desktop and narrow widths
- tests pass
- Claude review findings of meaningful severity are addressed
- Astra playthrough has no unresolved critical blocker

## Music

Original music by **Takubo29**.

Expected runtime audio directory: `public/audio/`.

The game uses:
- `sea-of-information.m4a`
- `city-of-dawn.m4a`
- `gadget-area.mp3`
- `load-road.mp3`
- `wish.m4a`
- `fantasy.m4a`
- `beautiful.mp3`
- `break.m4a`
- `naked.mp3`
- `blavery.mp3`
- `signal.mp3`
- `spacecraft.m4a`
- `new-create.mp3`
- `thundercloud.mp3`
- `space-home.mp3`

## Product goal

Target first playthrough: roughly **3–4 hours**. Prefer a short, polished game over a larger unfinished one. No RPG leveling/equipment/random battles/open world/crafting. The intended form is **cinematic exploration ADV × point-and-click × music-synchronised presentation**.
