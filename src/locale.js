// How Home Assistant wants dates and times written.
//
// The clock is a profile setting, not a property of the language: somebody
// can read a German dashboard and still want half past eight written as
// 8:30 PM. `toLocaleString(language)` cannot see that setting, so a card
// that formats by language alone answers the question nobody asked - and
// gets it wrong for whoever changed it.
//
// These follow what the frontend does with `hass.locale`, so a timestamp
// the card writes matches the ones sitting beside it on the dashboard.

/**
 * Whether times should be written on a twelve-hour clock.
 *
 * The profile stores four values: the two explicit choices arrive as '12'
 * and '24', while 'language' and 'system' defer - to the chosen language or
 * to the browser's own. A locale without the setting is read as 'language',
 * which is what every hass looked like before the profile had the option.
 *
 * Deferring is answered by asking Intl which clock that locale resolves to,
 * rather than by formatting a late hour and reading the answer back out of
 * the string: the tests run with a mocked Date, and a rule that depends on
 * one would quietly answer about the wrong moment.
 */
export function useAmPm(locale) {
    const format = locale?.time_format ?? 'language';
    if (format === '12') return true;
    if (format === '24') return false;
    const language = format === 'system' ? undefined : locale?.language;
    try {
        const cycle = new Intl.DateTimeFormat(language, { hour: 'numeric' })
            .resolvedOptions().hourCycle;
        return cycle === 'h11' || cycle === 'h12';
    } catch {
        return false;
    }
}

/** The language tag to format in, or undefined to leave it to the browser. */
function tag(hass) {
    return hass?.locale?.language || hass?.language || undefined;
}

/**
 * A full date and time - "16 Aug 2026, 08:55" - for the moment the card
 * hides behind the relative age of a session.
 */
export function formatDateTime(hass, timestampMs) {
    const ampm = useAmPm(hass?.locale);
    try {
        return new Date(timestampMs).toLocaleString(tag(hass), {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: ampm ? 'numeric' : '2-digit', minute: '2-digit',
            hourCycle: ampm ? 'h12' : 'h23',
        });
    } catch {
        return new Date(timestampMs).toLocaleString();
    }
}
