// Flattens what render() returns into a searchable string.
//
// The suite otherwise asserts on computed state (`el._completedScore`,
// `seen.sector`), which is the better assertion wherever it is available: it
// says what the card concluded, not how it phrased it. But an option whose
// only effect is that one element is not emitted has no state to read - the
// decision lives and dies inside render() - so the markup is the only place
// the effect exists.
//
// lit is not rendered here, only walked: a TemplateResult carries its static
// `strings` and the `values` between them, and a value can be another
// TemplateResult or an array of them. Anything else - directives, `nothing`,
// symbols - contributes no text and is skipped, which is fine because what
// this is asked about are class names and literal text, and both sit in the
// static parts.

const isTemplate = (v) => v !== null && typeof v === 'object' && '_$litType$' in v;

/** The text and markup of a lit render result, with nested templates inlined. */
export function markup(result) {
    if (result === null || result === undefined || result === false) return '';
    if (Array.isArray(result)) return result.map(markup).join('');
    if (isTemplate(result)) {
        const { strings, values } = result;
        return strings.reduce(
            (out, part, i) => out + part + (i < values.length ? markup(values[i]) : ''), '');
    }
    if (typeof result === 'object') return '';
    return String(result);
}
