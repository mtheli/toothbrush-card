import { ToothbrushCard, CARD_VERSION, BUILD_DATE, isMainStateEntity } from "./toothbrush-card";
import { ToothbrushCardEditor } from "./toothbrush-card-editor";

customElements.define('toothbrush-card', ToothbrushCard);
customElements.define('toothbrush-card-editor', ToothbrushCardEditor);

window.customCards = window.customCards || [];
window.customCards.push({
    type: "toothbrush-card",
    name: "Toothbrush Card",
    description: "A custom card to display the status of your toothbrush.",
    preview: true,
    documentationURL: "https://github.com/mtheli/toothbrush-card",
    // Card picker suggestion (HA 2026.6+): suggest this card when the picked
    // entity belongs to a supported toothbrush. The entity may sit on the
    // main device or on a sub-device (Sonicare Brush Head / Connection), so
    // accept the picked device, its via_device parent and config-entry
    // siblings — and always point the config at the main state entity's
    // device, which is what the card expects.
    getEntitySuggestion: (hass, entityId) => {
        const entity = hass.entities?.[entityId];
        if (!entity) return null;
        if (isMainStateEntity(entity)) {
            // setConfig rejects a falsy device_id — better no suggestion
            // than one whose preview renders an error card.
            return entity.device_id
                ? { config: { type: "custom:toothbrush-card", device_id: entity.device_id } }
                : null;
        }
        const devices = hass.devices || {};
        const picked = devices[entity.device_id];
        if (!picked) return null;
        const candidates = new Set([entity.device_id]);
        if (picked.via_device_id) candidates.add(picked.via_device_id);
        for (const d of Object.values(devices)) {
            if (d.config_entries?.some((ce) => picked.config_entries?.includes(ce))) {
                candidates.add(d.id);
            }
        }
        const main = Object.values(hass.entities).find(
            (e) => candidates.has(e.device_id) && isMainStateEntity(e)
        );
        return main
            ? { config: { type: "custom:toothbrush-card", device_id: main.device_id } }
            : null;
    },
});

console.info(
  `%c TOOTHBRUSH-CARD %c v${CARD_VERSION} · ${BUILD_DATE} `,
  "color:#fff;background:#1c1c1c;padding:2px 6px;border-radius:4px 0 0 4px;font-weight:700",
  "color:#1c1c1c;background:#42a5f5;padding:2px 6px;border-radius:0 4px 4px 0;font-weight:700",
);