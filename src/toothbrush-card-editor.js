import { LitElement, html, css } from 'lit';
import { QUADRANT_ZONES, SEXTANT_ZONES, ACCENT_COLORS } from './toothbrush-card.js';
import { t } from './translations.js';

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
        if (this._config?.num_sectors) return this._config.num_sectors;
        return this._getEntityNumSectors();
    }

    _getEntityNumSectors() {
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

    _hasSectorEntity() {
        if (!this.hass || !this._config?.device_id) return false;
        return Object.values(this.hass.entities).some(
            e => e.device_id === this._config.device_id && e.translation_key === 'sector'
        );
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
        delete newConfig.num_sectors;
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

    _moveItem(index, direction) {
        const target = index + direction;
        const order = this._sectorOrder;
        if (target < 0 || target >= order.length) return;
        [order[index], order[target]] = [order[target], order[index]];
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

    _numSectorsChanged(value) {
        const parsed = parseInt(value);
        const entityValue = this._getEntityNumSectors();
        const newConfig = { ...this._config };
        if (parsed && parsed !== entityValue) {
            newConfig.num_sectors = parsed;
        } else {
            delete newConfig.num_sectors;
        }
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
                    <ha-selector
                        .hass=${this.hass}
                        .selector=${{ device: { filter: [{ integration: 'oralb' }, { integration: 'philips_sonicare_ble' }], entity: [{ device_class: 'battery' }] } }}
                        .value=${this._config.device_id || ''}
                        .label=${t(this.hass, 'config_device') || 'Device'}
                        @value-changed=${this._deviceChanged}
                    ></ha-selector>
                </div>

                <div class="field">
                    <ha-textfield
                        .label=${t(this.hass, 'config_title')}
                        .value=${this._config.title || ''}
                        @input=${(ev) => this._valueChanged('title', ev.target.value)}
                    ></ha-textfield>
                </div>

                <div class="field row">
                    <ha-switch
                        .checked=${this._config.show_subtitle !== false}
                        @change=${(ev) => this._valueChanged('show_subtitle', ev.target.checked)}
                    ></ha-switch>
                    <span>${t(this.hass, 'config_subtitle')}</span>
                </div>

                <div class="field">
                    <div class="section-label">
                        <span>${t(this.hass, 'config_accent_color')}</span>
                        ${this._config.accent_color ? html`
                            <button class="reset-btn" @click=${() => this._valueChanged('accent_color', '')}>Reset</button>
                        ` : ''}
                    </div>
                    <div class="color-grid">
                        ${ACCENT_COLORS.map(c => html`
                            <button class="color-swatch ${this._config.accent_color === c.color ? 'selected' : ''}"
                                    style="background: ${c.color}"
                                    title="${c.name}"
                                    @click=${() => this._valueChanged('accent_color', c.color)}>
                            </button>
                        `)}
                    </div>
                </div>

                ${this._config.device_id ? html`
                    <div class="field">
                        <ha-selector
                            .hass=${this.hass}
                            .selector=${{ select: { mode: 'dropdown', options: [
                                { value: '4', label: '4' },
                                { value: '6', label: '6' },
                            ] } }}
                            .label=${t(this.hass, 'config_num_sectors')}
                            .value=${String(numSectors)}
                            @value-changed=${(ev) => this._numSectorsChanged(ev.detail.value)}
                        ></ha-selector>
                    </div>

                    <div class="section-label">
                        <span>${t(this.hass, 'config_sector_order')}</span>
                        ${isCustom ? html`
                            <button class="reset-btn" @click=${this._resetOrder}>Reset</button>
                        ` : ''}
                    </div>
                    <div class="sector-mode-hint">
                        ${this._hasSectorEntity()
                            ? t(this.hass, 'config_sector_mode_device')
                            : t(this.hass, 'config_sector_mode_time')}
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
                                <span class="sector-label">${t(this.hass, 'zone_' + zone)}</span>
                                <span class="move-buttons">
                                    <button class="move-btn" ?disabled=${i === 0}
                                            @click=${(ev) => { ev.stopPropagation(); this._moveItem(i, -1); }}>▲</button>
                                    <button class="move-btn" ?disabled=${i === order.length - 1}
                                            @click=${(ev) => { ev.stopPropagation(); this._moveItem(i, 1); }}>▼</button>
                                </span>
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
            .sector-mode-hint {
                font-size: 12px;
                color: var(--secondary-text-color, #888);
                font-style: italic;
                margin-bottom: 8px;
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
                flex: 1;
            }
            .move-buttons {
                display: flex;
                gap: 4px;
                margin-left: auto;
            }
            .move-btn {
                background: none;
                border: 1px solid var(--divider-color, #e0e0e0);
                border-radius: 4px;
                width: 28px;
                height: 24px;
                cursor: pointer;
                color: var(--primary-text-color);
                font-size: 10px;
                padding: 0;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .move-btn:hover:not([disabled]) {
                background: var(--secondary-background-color, #f5f5f5);
            }
            .move-btn[disabled] {
                opacity: 0.25;
                cursor: default;
            }
            .color-grid {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
            }
            .color-swatch {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                border: 2px solid var(--divider-color, #e0e0e0);
                cursor: pointer;
                padding: 0;
                transition: transform 0.15s, border-color 0.15s;
                box-sizing: border-box;
            }
            .color-swatch:hover {
                transform: scale(1.15);
            }
            .color-swatch.selected {
                border-color: var(--primary-text-color, #333);
                border-width: 3px;
                box-shadow: 0 0 0 2px var(--card-background-color, #fff),
                            0 0 0 4px var(--primary-text-color, #333);
            }
        `;
    }
}
