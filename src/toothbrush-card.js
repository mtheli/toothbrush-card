import { LitElement, html, css, unsafeCSS } from 'lit';
import { classMap } from 'lit-html/directives/class-map.js';
import { ToothSVG } from './toothbrush-svg.js';
import styles from 'bundle-text:./toothbrush-card.css';

export class ToothbrushCard extends LitElement {

    set hass(hass) {
        this._hass = hass;

        // determinig all required entitys (if not already done)
        if (!this._entityIds && this.config?.device_id) {
            this._entityIds = this._findAndMapEntitiesInConfig(hass, this.config.device_id);
        }

        this.requestUpdate();
    }

    get hass() {
        return this._hass;
    }

    /*
     * Timer to update the display periodically
     */
    connectedCallback() {
        super.connectedCallback();
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
            throw new Error('Please enter the device id');
        }
        
        // remember config
        this.config = config;
        
        // lazy init (if not already done by set hass)
        if (this._hass && !this._entityIds) {
            this._entityIds = this._findAndMapEntitiesInConfig(this._hass, config.device_id);
        }
    }

    getCardSize() {
        return 4; 
    }

    _showMoreInfo(entityId = null) {
        const targetEntityId = entityId || this._entityIds?.base_entity;

        if (!this._hass || !targetEntityId) {
            console.error("Kann Mehr-Infos nicht öffnen: Ziel-Entität fehlt.");
            return;
        }

        // 2. Event auslösen
        this.dispatchEvent(new CustomEvent('hass-more-info', {
            bubbles: true,
            composed: true,
            detail: { entityId: targetEntityId }
        }));
    }

    _getSectorData(sector) {
        const allSectors = ['lower_left', 'lower_right', 'upper_left', 'upper_right'];

        // helper function to determine the active sector
        const getActiveIndex = (input) => {
            switch (input) {
                case 'sector_1': case 'sector 1': case '1': return 0; 
                case 'sector_2': case 'sector 2': case '2': return 1; 
                case 'sector_3': case 'sector 3': case '3': return 2; 
                case 'sector_4': case 'sector 4': case '4': return 3; 
                default: return -1;
            }
        };

        // determine the currently active sector
        const activeIndex = getActiveIndex(sector);

        // Preparing the result object
        const sectorClassMaps = {
            lower_left:  { cleaned: false, cleaning: false },
            lower_right: { cleaned: false, cleaning: false },
            upper_left:  { cleaned: false, cleaning: false },
            upper_right: { cleaned: false, cleaning: false }
        };

        // success: all sectors are cleaned
        if (sector === 'success') {
            allSectors.forEach(sectorName => {
                sectorClassMaps[sectorName].cleaned = true;
            });
            return sectorClassMaps;
        }

        // unknown: all sectors remain unclean
        if (activeIndex === -1) {
            return sectorClassMaps;
        }

        // in progress: mark previously passed sectors as clean
        allSectors.forEach((sectorName, index) => {
            if (index < activeIndex) {
                sectorClassMaps[sectorName].cleaned = true;
            } else if (index === activeIndex) {
                sectorClassMaps[sectorName].cleaning = true;
            }
        });

        return sectorClassMaps;
    }


    /**
     * Searching for all needed entities.
     * 
     * @param {Object} hass the home assistant object
     * @param {string} deviceId the device id
     * @returns {Object} 
     */
    _findAndMapEntitiesInConfig(hass, deviceId) {
        const entityKeys = {
            sector: null, duration: null, mode: null, pressure: null, 
            battery: null, status: null, base_entity: null 
        };
        
        // getting all known entities
        const allEntities = hass.entities;

        // searching for entities that belong to the device
        for (const entityId in allEntities) {
            const entity = allEntities[entityId];
            if (entity.device_id !== deviceId) {
                continue;
            }

            // getting the entity state and device-lcass
            const state = hass.states[entityId];
            const deviceClass = state?.attributes?.device_class;

            // determine entity type based on translation-key (see /workspaces/ha-core/homeassistant/components/oralb/sensor.py)
            if (entity.translation_key === 'sector') {
                entityKeys.sector = entity.entity_id;
            } else if (entity.translation_key === 'mode') {
                entityKeys.mode = entity.entity_id;
            } else if (entity.translation_key === 'pressure') {
                entityKeys.pressure = entity.entity_id;
            } else if (entity.translation_key === 'toothbrush_state') {
                entityKeys.status = entity.entity_id;
            }

            // determine entity type based on device-class
            if (deviceClass) {
                if (entityKeys.battery === null && deviceClass === 'battery') {
                    entityKeys.battery = entity.entity_id;
                } else if (entityKeys.duration === null && deviceClass === 'duration') {
                    entityKeys.duration = entity.entity_id;
                }
            }

            // fallback for the status object
            if (entityKeys.status === null && entityKeys.base_entity === null) {
                if (!entity.entity_id.includes('_') || entity.entity_id.endsWith(deviceId)) {
                    entityKeys.base_entity = entity.entity_id;
                }
            }
        }
        
        // Status-ID finalisieren
        if (entityKeys.status !== null) {
            entityKeys.base_entity = entityKeys.status;
            entityKeys.status = null; 
        }

        return entityKeys;
    }
        
    render() {
        const hass = this._hass;
        const config = this.config;
        
        // Sicherstellen, dass die Konfiguration und die IDs vorhanden sind
        if (!hass || !config || !this._entityIds) {
            // Falls _hass vorhanden, aber _entityIds null ist (was nicht passieren sollte),
            // versuchen Sie das Mapping noch einmal. Sonst leere Card zeigen.
            if (hass && config?.device_id) {
                this._entityIds = this._findAndMapEntitiesInConfig(hass, config.device_id);
            } else {
                return html`
                    <ha-card class="toothbrush-error">
                        Geräte-ID fehlt oder Home Assistant Daten werden geladen...
                    </ha-card>`;
            }
        }

        // getting the device and name
        const device = hass.devices[config.device_id];
        const deviceName = device.name;

        // finding all neccessary sensors
        const entityIds = this._entityIds; // Abruf der gespeicherten IDs

        // Zustandswerte direkt über die gespeicherte Map abrufen
        const sector = entityIds.sector ? hass.states[entityIds.sector]?.state || 'no_sector' : 'no_sector';
        const duration = entityIds.duration ? hass.states[entityIds.duration]?.state || 0 : 0;
        const mode = entityIds.mode ? hass.states[entityIds.mode]?.state || 'N/A' : 'N/A';
        const pressure = entityIds.pressure ? hass.states[entityIds.pressure]?.state || 'N/A' : 'N/A';
        const batteryLevel = entityIds.battery ? hass.states[entityIds.battery]?.state || 0 : 0;
        
        // Status (nutzt die Base/Status-Entität)
        const statusEntityId = entityIds.base_entity;
        const status = statusEntityId ? hass.states[statusEntityId]?.state || 'unknown' : 'unknown';

        // getting the battery status
        const batteryIsCharging = (status=="charging");
        const batteryIconName = this.getBatteryIcon(batteryLevel, batteryIsCharging);
        const batteryIconColor = this.getBatteryColor(batteryLevel);
        
        const sectorClassData = this._getSectorData(sector);

        // rendering the html
        return html`
            <ha-card>
                <div class="card-content">
                    <h1 class="title">
                        ${deviceName}
                    </h1>

                    <div class="image-stack">
                        <!-- import the svg -->
                        ${ToothSVG(sectorClassData)}

                        <div class="status-overlay" @click="${() => this._showMoreInfo(entityIds.base_entity)}">${status}</div>
                        
                        <div class="time-overlay" @click="${() => this._showMoreInfo(entityIds.duration)}">
                            <span>${this._formatTime(duration)}</span>
                        </div>

                        <div class="pressure-overlay" @click="${() => this._showMoreInfo(entityIds.pressure)}">
                            <ha-icon icon="mdi:tooth-outline"></ha-icon>
                            Druck: ${pressure}
                        </div>
                    </div>

                    <div class="stats-container">
                        <div class="stat-item" @click="${() => this._showMoreInfo(entityIds.mode)}">
                            <span class="label">Modus:</span>
                            <span class="value mode">${mode}</span>
                        </div>
                        <div class="stat-item" @click="${() => this._showMoreInfo(entityIds.battery)}">
                            <span class="label">Batterie:</span>
                            <div class="battery-container">
                                <ha-icon class="value battery-icon" icon="${batteryIconName}" style="color: ${batteryIconColor}"></ha-icon>
                                <span class="value battery-level">${batteryLevel}%</span>
                            </div>
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
        // parsing battery level string to int
        const batteryLevel = parseInt(level, 10);

        // determine if charging is active
        if (is_charging === true) {
            return 'mdi:battery-charging';
        }

        // battery level less than or equal 5% is alert
        if (batteryLevel <= 5) {
            return 'mdi:battery-alert-variant-outline';
        }

        // calculate level 
        const roundedLevel = Math.min(100, Math.ceil(batteryLevel / 10) * 10);

        // battery level is less then 10%
        if (roundedLevel === 0) {
            return 'mdi:battery-outline';
        } 

        // battery level is greater than 90%
        if (roundedLevel === 100) {
            return 'mdi:battery';
        }

        // return icon name e.g. 'mdi:battery-80'
        return `mdi:battery-${roundedLevel}`;
    }

    /**
     * Format duraction 
     * @param {*} seconds 
     * @returns 
     */
    _formatTime(seconds) {
        const secs = parseInt(seconds);
        if (isNaN(secs) || secs < 0) return '00:00';
        
        const minutes = Math.floor(secs / 60);
        const remainingSeconds = secs % 60;
        
        const padSeconds = (num) => num.toString().padStart(2, '0');

        const formattedMinutes = minutes.toString(); 
        
        return `${formattedMinutes}:${padSeconds(remainingSeconds)}`;
    }

    static get styles() {
        return unsafeCSS(styles);
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