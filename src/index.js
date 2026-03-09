import { ToothbrushCard, CARD_VERSION } from "./toothbrush-card";

customElements.define('toothbrush-card', ToothbrushCard);

window.customCards = window.customCards || [];
window.customCards.push({
    type: "toothbrush-card",
    name: "Toothbrush Card",
    description: "A custom card to display the status of your toothbrush.",
    preview: true,
    documentationURL: "https://github.com/mtheli/toothbrush-card",
});

console.info(
  `%c TOOTHBRUSH-CARD %c v${CARD_VERSION} `,
  "color:#fff;background:#1c1c1c;padding:2px 6px;border-radius:4px 0 0 4px;font-weight:700",
  "color:#1c1c1c;background:#42a5f5;padding:2px 6px;border-radius:0 4px 4px 0;font-weight:700",
);