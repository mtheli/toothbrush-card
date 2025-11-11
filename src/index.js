import { ToothbrushCard } from "./toothbrush-card";

customElements.define('toothbrush-card', ToothbrushCard);

window.customCards = window.customCards || [];
window.customCards.push({
    type: "toothbrush-card",
    name: "Toothbrush Card",
    description: "A custom card to display the status of your toothbrush." 
});