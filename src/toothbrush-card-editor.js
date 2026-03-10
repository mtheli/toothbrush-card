import { LitElement, html, css } from 'lit';
import { QUADRANT_ZONES, SEXTANT_ZONES, ZONE_LABELS } from './toothbrush-card.js';

export class ToothbrushCardEditor extends LitElement {

    static get properties() {
        return {
            hass: { attribute: false },
            _config: { state: true },
            _dragIndex: { state: true },
            _overIndex: { state: true },
        };
    }

    constructor() {
        super();
        this._dragIndex = -1;
        this._overIndex = -1;
    }

    setConfig(config) {
        this._config = config;
    }

    get _sectorOrder() {
        const numSectors = this._getNumSectors();
        const defaultOrder = numSectors === 6 ? SEXTANT_ZONES : QUADRANT_ZONES;
        if (this._config.sector_order?.length === numSectors) {
            return [...this._config.sector_order];
        }
        return [...defaultOrder];
    }

    _getNumSectors() {
        if (!this.hass || !this._config?.device_id) return 4;
        for (const entityId in this.hass.entities) {
            const entity = this.hass.entities[entityId];
            if (entity.device_id === this._config.device_id &&
                entity.translation_key === 'number_of_sectors') {
                return parseInt(this.hass.states[entityId]?.state) || 4;
            }
        }
        return 4;
    }

    _fireConfig(config) {
        this.dispatchEvent(new CustomEvent('config-changed', {
            bubbles: true, composed: true,
            detail: { config },
        }));
    }

    _valueChanged(key, value) {
        const newConfig = { ...this._config, [key]: value };
        if (value === '' || value === undefined) delete newConfig[key];
        this._config = newConfig;
        this._fireConfig(newConfig);
    }

    _deviceChanged(ev) {
        const deviceId = ev.detail.value;
        const newConfig = { ...this._config, device_id: deviceId };
        delete newConfig.sector_order;
        this._config = newConfig;
        this._fireConfig(newConfig);
    }

    // --- Drag & Drop ---
    _dragStart(ev, index) {
        this._dragIndex = index;
        ev.dataTransfer.effectAllowed = 'move';
    }

    _dragOver(ev, index) {
        ev.preventDefault();
        ev.dataTransfer.dropEffect = 'move';
        if (index !== this._overIndex) {
            this._overIndex = index;
        }
    }

    _drop(ev, index) {
        ev.preventDefault();
        if (this._dragIndex === -1 || this._dragIndex === index) {
            this._dragIndex = -1;
            this._overIndex = -1;
            return;
        }
        const order = this._sectorOrder;
        const [moved] = order.splice(this._dragIndex, 1);
        order.splice(index, 0, moved);
        this._dragIndex = -1;
        this._overIndex = -1;
        this._valueChanged('sector_order', order);
    }

    _dragEnd() {
        this._dragIndex = -1;
        this._overIndex = -1;
    }

    _resetOrder() {
        const newConfig = { ...this._config };
        delete newConfig.sector_order;
        this._config = newConfig;
        this._fireConfig(newConfig);
    }

    render() {
        if (!this.hass || !this._config) return html``;

        const order = this._sectorOrder;
        const numSectors = this._getNumSectors();
        const defaultOrder = numSectors === 6 ? SEXTANT_ZONES : QUADRANT_ZONES;
        const isCustom = this._config.sector_order?.length === numSectors &&
            JSON.stringify(this._config.sector_order) !== JSON.stringify(defaultOrder);

        return html`
            <div class="editor">
                <div class="field">
                    <ha-device-picker
                        .hass=${this.hass}
                        .value=${this._config.device_id || ''}
                        .includeDeviceClasses=${undefined}
                        .includeDomains=${undefined}
                        .deviceFilter=${(device) => {
                            const entries = Object.values(this.hass.entities);
                            return entries.some(e => e.device_id === device.id && e.platform === 'oralb');
                        }}
                        @value-changed=${this._deviceChanged}
                    ></ha-device-picker>
                </div>

                <div class="field">
                    <ha-textfield
                        .label=${'Title (Optional)'}
                        .value=${this._config.title || ''}
                        @input=${(ev) => this._valueChanged('title', ev.target.value)}
                    ></ha-textfield>
                </div>

                <div class="field row">
                    <ha-switch
                        .checked=${this._config.show_subtitle !== false}
                        @change=${(ev) => this._valueChanged('show_subtitle', ev.target.checked)}
                    ></ha-switch>
                    <span>Show device name as subtitle</span>
                </div>

                ${this._config.device_id ? html`
                    <div class="section-label">
                        <span>Sector order</span>
                        ${isCustom ? html`
                            <button class="reset-btn" @click=${this._resetOrder}>Reset</button>
                        ` : ''}
                    </div>
                    <div class="sector-list" @dragend=${this._dragEnd}>
                        ${order.map((zone, i) => html`
                            <div class="sector-item ${this._dragIndex === i ? 'dragging' : ''} ${this._overIndex === i && this._dragIndex !== i ? 'over' : ''}"
                                 draggable="true"
                                 @dragstart=${(ev) => this._dragStart(ev, i)}
                                 @dragover=${(ev) => this._dragOver(ev, i)}
                                 @drop=${(ev) => this._drop(ev, i)}>
                                <span class="grip">☰</span>
                                <span class="sector-num">${i + 1}</span>
                                <span class="sector-label">${ZONE_LABELS[zone] || zone}</span>
                            </div>
                        `)}
                    </div>
                ` : ''}
            </div>
        `;
    }

    static get styles() {
        return css`
            .editor {
                padding: 16px;
            }
            .field {
                margin-bottom: 16px;
            }
            .field.row {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            ha-textfield {
                display: block;
                width: 100%;
            }
            .section-label {
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-weight: 500;
                font-size: 14px;
                margin: 20px 0 8px;
                color: var(--primary-text-color);
            }
            .reset-btn {
                background: none;
                border: 1px solid var(--divider-color, #e0e0e0);
                border-radius: 6px;
                padding: 4px 10px;
                font-size: 12px;
                cursor: pointer;
                color: var(--primary-text-color);
            }
            .reset-btn:hover {
                background: var(--secondary-background-color, #f5f5f5);
            }
            .sector-list {
                display: flex;
                flex-direction: column;
                gap: 4px;
            }
            .sector-item {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 8px 12px;
                background: var(--card-background-color, #fff);
                border: 1px solid var(--divider-color, #e0e0e0);
                border-radius: 8px;
                cursor: grab;
                user-select: none;
                transition: opacity 0.15s, border-color 0.15s;
            }
            .sector-item:active {
                cursor: grabbing;
            }
            .sector-item.dragging {
                opacity: 0.3;
            }
            .sector-item.over {
                border-color: var(--primary-color, #03a9f4);
                border-style: dashed;
            }
            .grip {
                color: var(--disabled-text-color, #bdbdbd);
                font-size: 14px;
                line-height: 1;
            }
            .sector-num {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 22px;
                height: 22px;
                border-radius: 50%;
                background: var(--primary-color, #03a9f4);
                color: #fff;
                font-size: 12px;
                font-weight: 600;
                flex-shrink: 0;
            }
            .sector-label {
                font-size: 14px;
                color: var(--primary-text-color);
            }
        `;
    }
}
