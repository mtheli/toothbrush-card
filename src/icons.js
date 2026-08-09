export const CONN_ICONS = {
    bluetooth: 'M17.71 7.71L12 2h-1v7.59L6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 11 14.41V22h1l5.71-5.71-4.3-4.29 4.3-4.29zM13 5.83l1.88 1.88L13 9.59V5.83zm1.88 10.46L13 18.17v-3.76l1.88 1.88z',
    lan_connect: 'M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z',
    lan_disconnect: 'M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM17 7h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z',
    // Charging station (mdiPowerPlug). Shown next to the Bluetooth icon when
    // the handle is paired with one — a path indicator, never a fault: a
    // station that is merely idle looks exactly like a working one.
    charger: 'M16,7V3H14V7H10V3H8V7H8C7,7 6,8 6,9V14.5L9.5,18V21H14.5V18L18,14.5V9C18,8 17,7 16,7Z',
};

export const MODE_ICONS = {
    // OralB modes
    "daily_clean": "mdi:repeat-once",
    "deep_clean": "mdi:water",
    // oralb_live spells two modes differently from the built-in oralb
    // integration: gentle_white has no counterpart there at all, and
    // tongue_clean is its name for tongue_cleaning.
    "gentle_white": "mdi:shimmer",
    "gum_care": "mdi:tooth-outline",
    "intense": "mdi:shape-circle-plus",
    "massage": "mdi:spa",
    "off": "mdi:power",
    "sensitive": "mdi:feather",
    "settings": "mdi:cog-outline",
    "smart_adapt": "mdi:auto-fix",
    "super_sensitive": "mdi:feather",
    "tongue_clean": "mdi:gate-and",
    "tongue_cleaning": "mdi:gate-and",
    "turbo": "mdi:car-turbocharger",
    "whiten": "mdi:shimmer",
    "whitening": "mdi:shimmer",
    // Sonicare modes
    "clean": "mdi:toothbrush-electric",
    "white_plus": "mdi:shimmer",
    "gum_health": "mdi:tooth-outline",
    "deep_clean_plus": "mdi:water",
    "tongue_care": "mdi:emoticon-tongue-outline",
    "default": "mdi:brush-variant"
};