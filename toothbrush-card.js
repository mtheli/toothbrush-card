import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';

class ToothbrushCard extends LitElement {

    // Getter und Setter für 'hass' (Home Assistant State Object)
    set hass(hass) {
        this._hass = hass;
        this.requestUpdate();
    }

    get hass() {
        return this._hass;
    }

    // --- Timer für flüssige Sekunden-Aktualisierung ---
    connectedCallback() {
        super.connectedCallback();
        // Aktualisiert die Karte jede Sekunde, um den Timer zu aktualisieren
        if (!this._interval) {
            this._interval = setInterval(() => this.requestUpdate(), 1000);
        }
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        if (this._interval) {
            clearInterval(this._interval);
            this._interval = null;
        }
    }

    setConfig(config) {
        if (!config.device_id) {
            throw new Error('Bitte das Device in der Konfiguration angeben.');
        }

        this.config = {
            // BITTE PFAD PRÜFEN UND GGf. ANPASSEN!
            image_path: '/local/tutor/toothbrush_images/', 
            ...config
        };
    }

    getCardSize() {
        return 4; 
    }

    // Hilfsfunktion zur Zuweisung des Dateinamens und der CSS-Klasse basierend auf dem Sektor
    _getSectorData(sector) {
        let fileName = null;
        let cssClass = ''; 

        // Mapping basierend auf den typischen Oral-B Sektor-Nummern (1-4 angenommen)
        switch (sector) {
            case 'sector_3': 
            case 'sector 3': 
            case '3': // top_left.png
                fileName = 'top_left.png';
                cssClass = 'active-sector';
                break;
            case 'sector_4': 
            case 'sector 4':
            case '4': // top_right.png
                fileName = 'top_right.png';
                cssClass = 'active-sector';
                break;
            case 'sector_1': 
            case 'sector 1': 
            case '1': // bottom_left.png
                fileName = 'bottom_left.png';
                cssClass = 'active-sector';
                break;
            case 'sector_2': 
            case 'sector 2': 
            case '2': // bottom_right.png
                fileName = 'bottom_right.png';
                cssClass = 'active-sector';
                break;
            case 'success': 
                // success.png (muss jetzt in der gleichen Größe existieren)
                fileName = 'success.png'; 
                cssClass = 'active-sector';
                break;
            default:
                return { fileName: null, cssClass: '' };
        }
        return { fileName, cssClass };
    }

    render() {
        const hass = this._hass;
        const config = this.config;
        
        if (!hass || !config) {
            return html``;
        }

        // getting the device and name
        const device = hass.devices[config.device_id];
        const deviceName = device.name;

        // searching for proper entities
        const allEntities = this.hass.entities;

        // searching for device entities
        var status;
        var sector;
        var duration;
        var mode;
        var pressure;
        var batteryLevel;

        for (const entityId in allEntities) {
            const entity = allEntities[entityId];
            if (entity.device_id === config.device_id) {
                const entity_id = entity.entity_id;

                if(entity_id.endsWith("sector")) {
                    sector = this.hass.states[entity_id]?.state || 'no_sector';
                } else if (entity_id.endsWith("duration")) {
                    duration = this.hass.states[entity_id]?.state || 0;
                } else if (entity_id.endsWith("brushing_mode")) {
                    mode = this.hass.states[entity_id]?.state || 'N/A';
                } else if (entity_id.endsWith("pressure")) {
                    pressure = this.hass.states[entity_id]?.state || 'N/A';
                } else if (entity_id.endsWith("battery")) {
                    batteryLevel = this.hass.states[entity_id]?.state || 0;
                } else {
                    status = this.hass.states[entity_id]?.state || 'unknown';
                }                
            }
        }

        // getting the battery status
        const batteryIsCharging = (status=="charging");
        const batteryIconName = this.getBatteryIcon(batteryLevel, batteryIsCharging);
        const batteryIconColor = this.getBatteryColor(batteryLevel);
        
        const imagePath = config.image_path;
        const { fileName: activeFileName, cssClass: activeCssClass } = this._getSectorData(sector);

        return html`
            <ha-card>
                <div class="card-content">
                    <h2 class="title">${deviceName}</h2>

                    <div class="image-stack">
                        
                        <img src="${imagePath}base.png" class="tooth-image base-image" alt="Base Tooth Chart" />

                        ${activeFileName
                            ? html`<img src="${imagePath}${activeFileName}" class="tooth-image ${activeCssClass}" alt="Active Sector" />`
                            : ''
                        }

                        <div class="status-overlay">${status}</div>
                        
                        <div class="time-overlay">
                            <!--
                                <ha-icon icon="mdi:timer-outline"></ha-icon>
                            -->
                            <span>${this._formatTime(duration)}</span>
                        </div>

                        <div class="pressure-overlay">
                            <ha-icon icon="mdi:tooth-outline"></ha-icon>
                            Druck: ${pressure}
                        </div>
                    </div>

                    <div class="stats-container">
                        <div class="stat-item">
                            <span class="label">Modus:</span>
                            <span class="value mode">${mode}</span>
                        </div>
                        <div class="stat-item">
                            <span class="label">Batterie:</span>
                            <ha-icon class="value battery-icon" icon="${batteryIconName}" style="color: ${batteryIconColor}"></ha-icon>
                            <span class="value battery-level">${batteryLevel}%</span>
                        </div>
                    </div>

                </div>
            </ha-card>
        `;
    }

    getBatteryColor(level) {
        if (level <= 15) return 'red';
        if (level <= 30) return 'orange';
        return 'var(--paper-item-icon-color)'; 
    }

    /**
     * Determine the proper image for battery 
     * See: https://pictogrammers.com/library/mdi/ 
     */
    getBatteryIcon(level, is_charging) {
        // Sicherstellen, dass der Level eine Zahl ist
        const batteryLevel = parseInt(level, 10);

        // 1. Ladezustand prüfen
        if (is_charging === true) {
            return 'mdi:battery-charging';
        }

        // 2. Alarm und niedriger Zustand prüfen
        if (batteryLevel <= 5) {
            return 'mdi:battery-alert-variant-outline';
        }

        // 3. Normalen Zustand in 10er-Schritte umwandeln
        const roundedLevel = Math.min(100, Math.ceil(batteryLevel / 10) * 10);

        // Spezialfall: 0 oder kleiner als 10
        if (roundedLevel === 0) {
            return 'mdi:battery-outline';
        } 

        if (roundedLevel === 100) {
            return 'mdi:battery';
        }

        // Icon-String zurückgeben (z.B. 'mdi:battery-80')
        return `mdi:battery-${roundedLevel}`;
    }

    _formatTime(seconds) {
        const secs = parseInt(seconds);
        if (isNaN(secs) || secs < 0) return '00:00';
        
        const minutes = Math.floor(secs / 60);
        const remainingSeconds = secs % 60;
        
        const padSeconds = (num) => num.toString().padStart(2, '0');
        
        // Die Minutenzahl wird direkt in einen String konvertiert (kein padStart für Minuten)
        const formattedMinutes = minutes.toString(); 
        
        return `${formattedMinutes}:${padSeconds(remainingSeconds)}`;
    }

    static get styles() {
        return css`
            .card-content {
                padding: 16px;
                text-align: center;
                display: flex;
                flex-direction: column;
                gap: 15px;
            }
            .title {
                margin: 0 0 10px 0;
                font-size: 1.2em;
            }
            .image-stack {
                position: relative;
                width: 100%;
                /* Seitenverhältnis der base.png */
                padding-bottom: 75%; 
                margin: 0 auto;
            }
            .tooth-image {
                position: absolute;
                object-fit: contain; 
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
            }
            
            .base-image, .active-sector {
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
            }

            /* Basis-Klasse für alle Overlays im Bildstapel */
            .status-overlay, .time-overlay, .pressure-overlay {
                position: absolute;
                left: 50%;
                transform: translateX(-50%); /* Horizontal zentrieren */
                pointer-events: none;
                color: var(--primary-text-color);
                z-index: 10;
                font-weight: 500;
            }

            /* 1. STATUS (Oben) */
            .status-overlay {
                top: 30%; /* Position oben in den Zähnen */
                font-size: 1.1em;
                text-transform: capitalize;
                color: var(--secondary-text-color);
            }

            /* 2. COUNTDOWN (Mitte/Groß) */
            .time-overlay {
                top: 50%; /* Vertikal zentriert */
                transform: translate(-50%, -50%); /* Korrigiert die Zentrierung */
                display: flex;
                align-items: center; 
                gap: 5px; 
                font-size: 56px; 
                font-weight: var(--ha-font-weight-normal);
                font-family: var(--ha-font-family-body);
            }
            .time-overlay ha-icon {
                --mdc-icon-size: 1.2em; 
            }

            /* 3. DRUCK (Unten) */
            .pressure-overlay {
                top: 65%; /* Position unten in den Zähnen */
                font-size: 1.1em;
                font-weight: 700;
                
                display: flex; /* Für das Icon */
                align-items: center;
                gap: 5px;
            }
            .pressure-overlay ha-icon {
                --mdc-icon-size: 1.2em;
            }

            .stats-container {
                display: flex;
                justify-content: space-around;
                width: 100%;
                padding-top: 10px;
                border-top: 1px solid var(--divider-color);
            }
            .stat-item {
                display: flex;
                flex-direction: column;
                align-items: center;
                font-size: 0.9em;
                /* Platz für nur 2 Elemente */
                flex-basis: 45%; 
            }
            .label {
                font-weight: 500;
                color: var(--secondary-text-color);
            }
            .value {
                font-weight: 700;
                color: var(--primary-text-color);
                font-size: 1.1em;
                margin-top: 4px;
            }
        `;
    }

    /**
     * The properties to configure
     */
    static getConfigForm() {
        return {
            schema: [
                { 
                    name: "device_id", 
                    required: true, 
                    selector: { 
                        device: {
                            filter : {
                                integration: "oralb"
                            },
                            multiple: false
                        } 
                    } 
                }
            ]
        };
    }

    static getStubConfig() {
        return { device_id: "" }
    }
}

customElements.define('toothbrush-card', ToothbrushCard);

window.customCards = window.customCards || [];
window.customCards.push({
    type: "toothbrush-card",
    name: "Toothbrush Card",
    description: "A custom card made by me!" // optional
});