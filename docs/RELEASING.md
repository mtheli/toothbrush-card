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

**Structure:** `##` sections by theme, each holding bullets that open with a
bold phrase and then explain themselves in one or two sentences.

```markdown
## Ready for Home Assistant 2026.8

Optional lead-in paragraph — only when the bullets need context to make
sense, e.g. an external cause the reader could not know about.

- **The reported sector is used as it is** wherever the integration can name
  every sector of the brush. Detected from the entity's enum options rather
  than a version string, so beta channels resolve correctly too.
- **Home Assistant 2026.7 and older are untouched** — the workaround stays
  exactly as it was.

## Laifen Wave

- **The routine length is read from the number entity.** `laifen_ble` 3.0.3
  drops the Brushing Time sensor on the Wave, which left the card without a
  routine there.
```

**Title:** `vX.Y.Z — what it is about`, e.g.
*v0.28.0 — Home Assistant 2026.8, Oral-B Live, Laifen Wave*.

**Length is a signal.** Stable notes have run between 400 and 2000 characters;
a release covering four separate themes is already a big one. Prose that
explains the reasoning belongs in the commit message, not here — if a section
needs three paragraphs to land, it is being written for the wrong reader.

**Say who it applies to.** The card serves five integrations and most changes
reach only some of them. Name the ones a section applies to — and the ones it
does not, where that is not obvious — so a reader can stop at the heading
instead of working it out from the feature. Integrations differ in what they
expose, so "the card now reads X" is only ever true of some of them.

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

## Cutting the release

1. Content commits first, pushed, `npm test` green.
2. Bump `version` in `package.json` and `CARD_VERSION` in
   `src/toothbrush-card.js` to the new version.
3. `npm run build`, then `npm test` again — the tests drive the built bundle,
   so they only speak for the artifact once it has been rebuilt.
4. Commit `Release vX.Y.Z`.
5. Tag `vX.Y.Z` and push the tag with it.
6. `gh release create vX.Y.Z dist/toothbrush-card.js --title … --notes-file …`,
   with `--latest` for a stable release or `--prerelease` for a beta.
