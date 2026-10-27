// Which translation the card reads, and that none of them is missing a text.
// Home Assistant names Simplified Chinese `zh-Hans`, the file is `zh`.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { t } from '../src/translations.js';

test('a zh-Hans profile reads the Simplified Chinese file', () => {
    assert.equal(t({ language: 'zh-Hans' }, 'status_charging'), t({ language: 'zh' }, 'status_charging'));
    assert.notEqual(t({ language: 'zh-Hans' }, 'status_charging'), t({ language: 'en' }, 'status_charging'));
});

test('every translation has every text the English file has', () => {
    const dir = new URL('../src/locales/', import.meta.url);
    const read = (name) => JSON.parse(readFileSync(new URL(name, dir), 'utf8'));
    const english = Object.keys(read('en.json'));
    for (const name of readdirSync(dir).filter((f) => f.endsWith('.json'))) {
        const keys = new Set(Object.keys(read(name)));
        assert.deepEqual(english.filter((k) => !keys.has(k)), [], name);
    }
});
