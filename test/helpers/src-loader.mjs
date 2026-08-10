// Node module hooks that make `src/` importable without a Parcel build.
//
// Three things in the source tree are Parcel's job, not Node's:
//
//   * `bundle-text:./toothbrush-card.css` — Parcel inlines the file as a
//     string. Here the CSS is read and handed over the same way, so the card
//     gets its real stylesheet rather than a stub.
//   * `./locales/*.json` — Parcel imports JSON bare; Node wants an
//     `with { type: 'json' }` attribute. Returning them as modules sidesteps
//     the attribute entirely, and the source stays as it has to be for the
//     bundler.
//   * `./build-info.js` — generated at build time and gitignored, so in a
//     fresh clone it does not exist. Missing means "not built", which is
//     exactly what the file's own fallback comment describes: BUILD_DATE
//     reads "dev".
//
// Declaring `format: 'module'` for the source files also silences Node's
// MODULE_TYPELESS_PACKAGE_JSON warning — package.json has no `"type"` field
// and must not get one, because Parcel and the published bundle rely on the
// current setup.
//
// Registered via `node --import ./test/helpers/register-src-loader.mjs`.

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const BUNDLE_TEXT = 'bundle-text:';
const SRC_DIR = new URL('../../src/', import.meta.url).href;

export async function resolve(specifier, context, nextResolve) {
    if (specifier.startsWith(BUNDLE_TEXT)) {
        // Resolve the part after the scheme relative to the importer, so the
        // loader does not have to know which file asked for it.
        const target = new URL(specifier.slice(BUNDLE_TEXT.length), context.parentURL);
        return { url: `${BUNDLE_TEXT}${target.href}`, format: 'bundle-text', shortCircuit: true };
    }
    // build-info.js is generated; stand in for it when it has not been built.
    if (specifier.endsWith('./build-info.js') || specifier.endsWith('/build-info.js')) {
        const target = new URL(specifier, context.parentURL);
        try {
            await readFile(target);
        } catch {
            return { url: `${target.href}?stub-build-info`, format: 'build-info-stub', shortCircuit: true };
        }
    }
    try {
        return await nextResolve(specifier, context);
    } catch (err) {
        // Parcel resolves extensionless relative imports (index.js does that);
        // Node does not. Only retried after a genuine miss, so a real typo
        // still surfaces as the original error.
        if (err?.code === 'ERR_MODULE_NOT_FOUND' && specifier.startsWith('.')
            && !specifier.endsWith('.js')) {
            return nextResolve(`${specifier}.js`, context);
        }
        throw err;
    }
}

export async function load(url, context, nextLoad) {
    if (context.format === 'bundle-text' || url.startsWith(BUNDLE_TEXT)) {
        const file = fileURLToPath(url.slice(BUNDLE_TEXT.length));
        const text = await readFile(file, 'utf8');
        return {
            format: 'module',
            source: `export default ${JSON.stringify(text)};`,
            shortCircuit: true,
        };
    }
    if (context.format === 'build-info-stub' || url.endsWith('?stub-build-info')) {
        return {
            format: 'module',
            source: 'export const BUILD_DATE = "dev";',
            shortCircuit: true,
        };
    }
    // JSON as a module: same value as Parcel's default import, no attribute.
    if (url.startsWith(SRC_DIR) && url.endsWith('.json')) {
        const text = await readFile(fileURLToPath(url), 'utf8');
        // Parse first so a malformed locale fails here and not somewhere
        // downstream with a confusing syntax error.
        return {
            format: 'module',
            source: `export default ${JSON.stringify(JSON.parse(text))};`,
            shortCircuit: true,
        };
    }
    // Spell out the format for the source files; package.json says nothing.
    if (url.startsWith(SRC_DIR) && url.endsWith('.js')) {
        const source = await readFile(fileURLToPath(url), 'utf8');
        return { format: 'module', source, shortCircuit: true };
    }
    return nextLoad(url, context);
}
