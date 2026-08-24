# Releasing

How a release is cut and, more importantly, how its notes are written. The
format drifted a few times — this file exists so it stops drifting.

## Release notes

Written for someone who uses the card, not for someone who reads the diff.
What changed for them, and what they have to do about it.

**Written in English.** The card is localized, the notes are not — one text
every reader can open beats a partial set of translated ones. German belongs
in the German-language forum threads, where a release gets announced in the
reader's own language; the notes themselves stay English.

**One section per feature.** The bullets underneath carry the details.

**One sentence per bullet,** opening with two to five bold words that run into
the sentence. No labels, no whole sentence in bold. Write what the user sees,
with the previous behaviour as a short trailing clause where one is needed.

**Plain language.** No literary voice, no marketing tone, no idiom where a verb
will do. This holds for commit messages too. Reasoning belongs in the commit
message, not in the notes.

**No hard line breaks.** GitHub renders a single newline as a line break and
tears prose apart mid-sentence. One paragraph, one line.

```markdown
## Interrupted sessions

- **Finished zones** are marked on the tooth ring. The text already counted them.
- **The zones survive** a page reload.

## Source of the summary

Only for `philips_sonicare_ble` and `oralb_live`.

- **The tooltip distinguishes** "read from the brush" from "counted by Home Assistant". Both used to claim the first.
- **Late records** are accepted. A Sonicare for Kids delivers only on the next connection.
```

**Title:** `vX.Y.Z — what it is about`, e.g.
*v0.28.0 — Home Assistant 2026.8, Oral-B Live, Laifen Wave*.

**Length is a signal.** Stable notes rarely run over 1000 characters; a
release covering four separate themes is already a big one.

**Say who it applies to.** The card serves five integrations and most changes
reach only some of them, so "the card now reads X" is never true of all. Name
them under the heading, including the ones where nothing changes.

**Credit belongs in the notes.** Name whoever reported the problem, tested the
fix or contributed a capture, with `@handle` and the issue number, in the
bullet their work belongs to. Link the external cause when one triggered the
release — a Home Assistant version, an upstream pull request, a dependency
release. A reader who upgraded something and then saw behaviour change
deserves to know the two are connected.

**What does not belong:** commit lists, file names, internal symbol names,
documentation-only changes, and the reasoning behind an implementation choice.

### Betas carry three things a stable release does not

A prerelease is aimed at the handful of people who agreed to test it, so it
says what a stable release has no reason to say:

- **How to install it** — HACS → the card's entry → ⋮ Redownload → *Show beta
  versions* → the tag, then a hard refresh. Point at the editor footer as the
  proof of which bundle is actually loaded.
- **What specifically to check**, as questions the tester can answer, plus
  what to capture if it still fails.
- **Who it is for** — address the testers by handle.

None of that survives into the stable notes. When the beta folds in, the
install instructions and the questions come out, and the tester moves into a
credit line. State plainly which betas the release supersedes.

## The version lives in two files

| File | Role |
| :--- | :--- |
| `package.json` | `version` — what the package declares. |
| `src/toothbrush-card.js` | `CARD_VERSION` — rendered in the editor footer, next to the build date. |

**Both must match the tag.** The footer is how a user proves which bundle their
browser actually loaded, which is the first question on any bug report where a
fix "did not work" — a stale cached bundle and a real regression look identical
until that value is read out.

`hacs.json` carries no version; HACS resolves that from the release.

## dist/ is committed, and it is what users install

`dist/toothbrush-card.js` is built by `npm run build` and attached to every
release as an asset. It has to be rebuilt and committed **in the release
commit**, so the tagged tree contains the bundle that carries the tagged
version.

`scripts/gen_build_info.mjs` stamps a build timestamp into the bundle, so
rebuilding without changing a line of source still produces a one-line diff.
That single `BUILD_DATE` line is the only difference a rebuild may show — any
other change means `dist/` was out of sync with `src/`.

## The icon reference travels with the icons

`docs/ICONS.md` and the overview beside it are documentation of behaviour, not
a gallery, so they go stale the moment the card draws something they do not
describe. Anything that changes what a user sees has to reach them in the same
release: a new icon or chip, a different glyph, a moved threshold, a changed
colour, or a reading arriving from one more integration.

There are three places, and they drift apart in exactly that order:

| File | Holds |
| :--- | :--- |
| `docs/ICONS.md` | the integration matrix and the prose, hand-written. |
| `scripts/gen_icon_overview.mjs` | the state conditions and the palette, mirroring `src/toothbrush-card.js`. |
| `docs/icon-overview.html`, `.png` | generated — never edited by hand. |

Regenerate after touching the script:

```sh
node scripts/gen_icon_overview.mjs
chromium --headless --screenshot=docs/icon-overview.png \
  --window-size=1120,5000 --hide-scrollbars docs/icon-overview.html
```

The window height has to cover the whole page, and it grows as sections are
added; a clipped last section means raising it. Erring high is free.

The failure this prevents has already happened: v0.35.0 corrected which face
`standard` maps to in `ICONS.md` and left the generator saying the old thing,
so the picture a reader looks at first kept the mapping the release had just
replaced.

## Cutting the release

1. Content commits first, pushed, `npm test` green.
2. Icon reference regenerated where anything visible changed, per the section
   above.
3. Bump `version` in `package.json` and `CARD_VERSION` in
   `src/toothbrush-card.js` to the new version.
4. `npm run build`, then `npm test` again — the tests drive the built bundle,
   so they only speak for the artifact once it has been rebuilt.
5. Commit `Release vX.Y.Z`.
6. Tag `vX.Y.Z` and push the tag with it.
7. `gh release create vX.Y.Z dist/toothbrush-card.js --title … --notes-file …`,
   with `--latest` for a stable release or `--prerelease` for a beta.
