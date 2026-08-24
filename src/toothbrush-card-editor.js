import { LitElement, html, css } from 'lit';
import { QUADRANT_ZONES, SEXTANT_ZONES, ACCENT_COLORS, isMainStateEntity,
         LAYOUT_PROPS, CORNER_SLOTS, normalizeLayout, resolveLayoutForDevice,
         findDeviceEntities, readRingColor,
         CARD_VERSION, BUILD_DATE } from './toothbrush-card.js';
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

    /**
     * The handle's own ring colour, if this device reports one. Read through
     * the card's own reader, so the hint can never promise an accent the card
     * would not paint.
     */
    _ringColor() {
        if (!this.hass || !this._config?.device_id) return null;
        return readRingColor(this.hass, this._deviceIds());
    }

    _hasVerdictSource() {
        if (!this.hass || !this._config?.device_id) return false;
        // Resolved the same way the card resolves it, rather than by a rule
        // of its own: a switch shown for a device whose verdict the card
        // would never render is a control that does nothing.
        const ids = this._deviceIds();
        // A handle that reports neither can still be given a verdict the card
        // works out itself - but only from its own record of the session, so
        // that entity is what makes the switch worth showing.
        return !!(ids.smiley || ids.score || ids.last_session);
    }

    /** Whether this device keeps a record of its own sessions. */
    _hasSessionRecord() {
        if (!this.hass || !this._config?.device_id) return false;
        return !!this._deviceIds().last_session;
    }

    /**
     * Whether a session could be reconstructed from stored readings.
     *
     * The rebuild works off the elapsed-time reading, so a device without one
     * has nothing to rebuild from and the switch would do nothing.
     */
    _canRebuildFromHistory() {
        if (!this.hass || !this._config?.device_id) return false;
        return !!this._deviceIds().duration;
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

    // Whether the recap is shown at all - its own switch, so that the
    // dropdown below is only ever about how long. An off state hidden in a
    // list of durations reads as one duration among many, which it is not.
    _recapEnabled() {
        return this._config.hold_completed !== false;
    }

    // Configs written before the switch existed carry `hold_completed:false`
    // and are read by it unchanged - the key means what it always meant.
    _recapEnabledChanged(enabled) {
        const newConfig = { ...this._config };
        delete newConfig.hold_completed;
        if (!enabled) newConfig.hold_completed = false;
        this._config = newConfig;
        this._fireConfig(newConfig);
    }

    // The dropdown is now only the duration: '0.5' (default) writes no key,
    // anything else `hold_duration` in hours.
    _holdValue() {
        return this._config.hold_duration !== undefined
            ? String(this._config.hold_duration)
            : '0.5';
    }

    _holdChanged(value) {
        const newConfig = { ...this._config };
        delete newConfig.hold_duration;
        if (value !== undefined && value !== '0.5') {
            newConfig.hold_duration = Number(value);
        }
        this._config = newConfig;
        this._fireConfig(newConfig);
    }

    _deviceOptions() {
        const seen = new Map();
        for (const entityId in this.hass.entities) {
            const entity = this.hass.entities[entityId];
            if (!entity.device_id || seen.has(entity.device_id)) continue;
            if (!isMainStateEntity(entity)) continue;
            const device = this.hass.devices?.[entity.device_id];
            seen.set(entity.device_id, device?.name_by_user || device?.name || entity.device_id);
        }
        const options = [...seen.entries()]
            .map(([value, label]) => ({ value, label }))
            .sort((a, b) => a.label.localeCompare(b.label));
        // Keep a manually configured device_id visible instead of "Unknown
        // device selected", even if it doesn't qualify above.
        const current = this._config.device_id;
        if (current && !seen.has(current)) {
            const device = this.hass.devices?.[current];
            options.push({ value: current, label: device?.name_by_user || device?.name || current });
        }
        return options;
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

    // --- Layout (property placement) ---
    _deviceIds() {
        if (!this.hass || !this._config?.device_id) return {};
        return findDeviceEntities(this.hass, this._config.device_id);
    }

    // Effective layout as fixed-length editor slots: chips padded to 4, all four
    // corner keys present (empty string = unset). Resolved for the device so the
    // shared contact slot reads as the reading it actually has (intensity vs
    // pressure).
    _editorLayout() {
        const ids = this._deviceIds();
        const avail = this._availableSet(ids);
        const eff = resolveLayoutForDevice(normalizeLayout(this._config), ids);
        // Drop readings the device doesn't have so the editor never shows a slot
        // filled with something that can't render (e.g. the default head corner
        // on a handle without a brush-head sensor).
        const availChips = eff.chips.filter(p => avail.has(p));
        const chips = [0, 1, 2, 3].map(i => availChips[i] || '');
        const corners = {};
        for (const k of CORNER_SLOTS) corners[k] = avail.has(eff.corners[k]) ? eff.corners[k] : '';
        return { chips, corners };
    }

    // Properties already placed in a slot other than `except` — excluded from
    // that slot's menu so every reading is used at most once.
    _usedElsewhere(except) {
        const L = this._editorLayout();
        const used = new Set();
        L.chips.forEach((p, i) => { if (p && `chip${i}` !== except) used.add(p); });
        for (const k of CORNER_SLOTS) { if (L.corners[k] && `corner${k}` !== except) used.add(L.corners[k]); }
        return used;
    }

    // Readings this device actually provides — everything else is hidden from
    // the menus so we never offer a chip that could not render. Pressure and
    // intensity are offered independently whenever the device exposes them (some
    // handles report both), so either can be placed.
    _availableSet(ids) {
        const a = new Set();
        if (ids.battery) a.add('battery');
        if (ids.pressure_state || ids.pressure) a.add('pressure');
        if (ids.intensity) a.add('intensity');
        if (ids.mode || ids.mode_select) a.add('mode');
        if (ids.score) a.add('score');
        // Oral-B fills the same slot with its day counter where there is no
        // wear reading, and offers brushing time as a second placeable one.
        if (ids.brushhead_wear || ids.refill_days) a.add('brush_head');
        if (ids.refill_brushing_time) a.add('head_time');
        if (ids.brushhead_type) a.add('head_type');
        return a;
    }

    _propLabel(prop) {
        // The head slot is named for what it will actually show: a wear
        // percentage on a handle that reports one, Oral-B's day counter
        // otherwise. Picking the wrong name would make the editor describe a
        // reading the card is not going to draw.
        if (prop === 'brush_head') {
            const ids = this._deviceIds();
            return t(this.hass, !ids.brushhead_wear && ids.refill_days
                ? 'chip_head_days' : 'chip_head') || prop;
        }
        return t(this.hass, 'chip_' + prop) || prop;
    }

    _propOptions(current, usedElsewhere, avail) {
        const opts = [{ value: 'none', label: t(this.hass, 'layout_none') || '—' }];
        for (const p of LAYOUT_PROPS) {
            if (p !== current && !avail.has(p)) continue;
            if (p === current || !usedElsewhere.has(p)) {
                opts.push({ value: p, label: this._propLabel(p) });
            }
        }
        return opts;
    }

    _writeLayout(L) {
        const chips = L.chips.filter(Boolean);
        const corners = {};
        for (const k of CORNER_SLOTS) { if (L.corners[k]) corners[k] = L.corners[k]; }
        const newConfig = { ...this._config, layout: { chips, corners } };
        this._config = newConfig;
        this._fireConfig(newConfig);
    }

    _layoutChipChanged(i, value) {
        const L = this._editorLayout();
        L.chips[i] = value === 'none' ? '' : value;
        this._writeLayout(L);
    }

    _layoutCornerChanged(pos, value) {
        const L = this._editorLayout();
        L.corners[pos] = value === 'none' ? '' : value;
        this._writeLayout(L);
    }

    _resetLayout() {
        const newConfig = { ...this._config };
        delete newConfig.layout;
        this._config = newConfig;
        this._fireConfig(newConfig);
    }

    get _hasCustomOptions() {
        return Object.keys(this._config).some(k => k !== 'type' && k !== 'device_id');
    }

    _resetAll() {
        if (!confirm(t(this.hass, 'config_reset_all_confirm'))) return;
        const newConfig = { type: this._config.type };
        if (this._config.device_id) newConfig.device_id = this._config.device_id;
        this._config = newConfig;
        this._fireConfig(newConfig);
    }

    _colorField(key, labelKey, fallback) {
        const value = this._config[key] || '';
        return html`
            <div class="field">
                <div class="section-label">
                    <span>${t(this.hass, labelKey)}</span>
                    ${value ? html`
                        <button class="reset-btn" @click=${() => this._valueChanged(key, '')}>Reset</button>
                    ` : ''}
                </div>
                <div class="color-field">
                    <input type="color" class="color-input"
                           .value=${value || fallback}
                           @input=${(ev) => this._valueChanged(key, ev.target.value)}>
                    <ha-input
                        .value=${value}
                        .placeholder=${fallback}
                        @input=${(ev) => this._valueChanged(key, ev.target.value)}
                    ></ha-input>
                </div>
            </div>
        `;
    }

    // The three tooth colors as one compact row under a shared heading;
    // the heading's Reset clears all of them.
    _colorRow() {
        const items = [
            ['tooth_color', 'color_tooth', '#d1d5db'],
            ['active_color', 'color_active', '#93c5fd'],
            ['done_color', 'color_done', '#bbf7d0'],
        ];
        const anySet = items.some(([key]) => this._config[key]);
        return html`
            <div class="field">
                <div class="section-label">
                    <span>${t(this.hass, 'config_tooth_colors')}</span>
                    ${anySet ? html`
                        <button class="reset-btn" @click=${this._resetColors}>Reset</button>
                    ` : ''}
                </div>
                <div class="color-row">
                    ${items.map(([key, labelKey, fallback]) => html`
                        <div class="color-item">
                            <input type="color" class="color-input"
                                   .value=${this._config[key] || fallback}
                                   @input=${(ev) => this._valueChanged(key, ev.target.value)}>
                            <span class="color-item-lbl">${t(this.hass, labelKey)}</span>
                        </div>
                    `)}
                </div>
            </div>
        `;
    }

    _resetColors = () => {
        const newConfig = { ...this._config };
        delete newConfig.tooth_color;
        delete newConfig.active_color;
        delete newConfig.done_color;
        this._config = newConfig;
        this._fireConfig(newConfig);
    };

    _renderLayoutSection() {
        const L = this._editorLayout();
        const avail = this._availableSet(this._deviceIds());
        const posLabels = {
            top_left: 'pos_top_left', top_right: 'pos_top_right',
            bottom_left: 'pos_bottom_left', bottom_right: 'pos_bottom_right',
        };
        const selector = (options) => ({ select: { mode: 'dropdown', options } });
        return html`
            <div class="group-label">
                <span>${t(this.hass, 'config_layout')}</span>
                <button class="reset-btn" ?disabled=${!this._config.layout}
                        @click=${this._resetLayout}>Reset</button>
            </div>
            <div class="sector-mode-hint">${t(this.hass, 'config_layout_hint')}</div>

            <div class="sub-label">${t(this.hass, 'config_layout_chips')}</div>
            ${[0, 1, 2, 3].map(i => html`
                <div class="field">
                    <ha-selector
                        .hass=${this.hass}
                        .selector=${selector(this._propOptions(L.chips[i], this._usedElsewhere('chip' + i), avail))}
                        .label=${`${t(this.hass, 'config_layout_chip')} ${i + 1}`}
                        .value=${L.chips[i] || 'none'}
                        @value-changed=${(ev) => this._layoutChipChanged(i, ev.detail.value)}
                    ></ha-selector>
                </div>
            `)}

            <div class="sub-label">${t(this.hass, 'config_layout_corners')}</div>
            ${CORNER_SLOTS.map(k => html`
                <div class="field">
                    <ha-selector
                        .hass=${this.hass}
                        .selector=${selector(this._propOptions(L.corners[k], this._usedElsewhere('corner' + k), avail))}
                        .label=${t(this.hass, posLabels[k])}
                        .value=${L.corners[k] || 'none'}
                        @value-changed=${(ev) => this._layoutCornerChanged(k, ev.detail.value)}
                    ></ha-selector>
                </div>
            `)}
        `;
    }

    // Own section: how readings are displayed, as opposed to the layout
    // section, which is about where they sit.
    _renderValueDisplaySection() {
        const ids = this._deviceIds();
        if (!this._availableSet(ids).has('brush_head')) return '';
        return html`
            <div class="group-label">${t(this.hass, 'group_value_display')}</div>
            <div class="sector-mode-hint">${t(this.hass, 'config_value_display_hint')}</div>
            <div class="field">
                <ha-selector
                    .hass=${this.hass}
                    .selector=${{ select: { mode: 'dropdown', options: [
                        { value: 'remaining', label: t(this.hass, 'head_display_remaining') },
                        { value: 'used', label: t(this.hass, 'head_display_used') },
                        ...(ids?.brushhead_sessions
                            ? [{ value: 'sessions', label: t(this.hass, 'head_display_sessions') }]
                            : []),
                    ] } }}
                    .label=${t(this.hass, 'config_head_display')}
                    .value=${this._config.head_display || 'remaining'}
                    @value-changed=${(ev) => this._headDisplayChanged(ev.detail.value)}
                ></ha-selector>
            </div>
        `;
    }

    // 1 is the default and maps to no config key.
    _scaleChanged(value) {
        const newConfig = { ...this._config };
        const n = Number(value);
        if (!Number.isFinite(n) || n === 1) {
            delete newConfig.scale;
        } else {
            newConfig.scale = Math.round(n * 10) / 10;
        }
        this._config = newConfig;
        this._fireConfig(newConfig);
    }

    // 'slim' is the default and maps to no config key.
    _progressSizeChanged(value) {
        const newConfig = { ...this._config };
        if (!value || value === 'slim') {
            delete newConfig.progress_size;
        } else {
            newConfig.progress_size = value;
        }
        this._config = newConfig;
        this._fireConfig(newConfig);
    }

    // 'remaining' is the default and maps to no config key.
    _headDisplayChanged(value) {
        const newConfig = { ...this._config };
        if (!value || value === 'remaining') {
            delete newConfig.head_display;
        } else {
            newConfig.head_display = value;
        }
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
                <div class="group-label">${t(this.hass, 'group_device')}</div>
                <div class="field">
                    <ha-selector
                        .hass=${this.hass}
                        .selector=${{ select: { mode: 'dropdown', options: this._deviceOptions() } }}
                        .value=${this._config.device_id || ''}
                        .label=${t(this.hass, 'config_device') || 'Device'}
                        @value-changed=${this._deviceChanged}
                    ></ha-selector>
                </div>

                <div class="group-label">${t(this.hass, 'group_header')}</div>
                <div class="field row">
                    <ha-switch
                        .checked=${this._config.show_header !== false}
                        @change=${(ev) => this._valueChanged('show_header', ev.target.checked ? '' : false)}
                    ></ha-switch>
                    <span>${t(this.hass, 'config_show_header')}</span>
                </div>

                ${this._config.show_header !== false ? html`
                <div class="field">
                    <ha-input
                        .label=${t(this.hass, 'config_title')}
                        .value=${this._config.title || ''}
                        @input=${(ev) => this._valueChanged('title', ev.target.value)}
                    ></ha-input>
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
                    ${this._ringColor() ? html`
                        <div class="sector-mode-hint ring-hint">
                            ${t(this.hass, 'config_accent_color_ring')}
                            <span class="ring-swatch" style="background: ${this._ringColor()}"></span>
                            ${this._ringColor()}
                        </div>
                    ` : ''}
                </div>` : ''}

                <div class="group-label">${t(this.hass, 'group_teeth')}</div>
                <div class="field">
                    <ha-selector
                        .hass=${this.hass}
                        .selector=${{ number: { min: 0.8, max: 2, step: 0.1, mode: 'slider' } }}
                        .label=${t(this.hass, 'config_scale')}
                        .value=${Number(this._config.scale) || 1}
                        @value-changed=${(ev) => this._scaleChanged(ev.detail.value)}
                    ></ha-selector>
                </div>
                <div class="field">
                    <ha-selector
                        .hass=${this.hass}
                        .selector=${{ select: { mode: 'dropdown', options: [
                            { value: 'slim', label: t(this.hass, 'progress_size_slim') },
                            { value: 'bold', label: t(this.hass, 'progress_size_bold') },
                            { value: 'xl', label: t(this.hass, 'progress_size_xl') },
                        ] } }}
                        .label=${t(this.hass, 'config_progress_size')}
                        .value=${this._config.progress_size || 'slim'}
                        @value-changed=${(ev) => this._progressSizeChanged(ev.detail.value)}
                    ></ha-selector>
                </div>
                <div class="field">
                    <ha-selector
                        .hass=${this.hass}
                        .selector=${{ select: { mode: 'dropdown', options: [
                            { value: 'teeth', label: t(this.hass, 'tooth_style_teeth') },
                            { value: 'none', label: t(this.hass, 'tooth_style_none') },
                        ] } }}
                        .label=${t(this.hass, 'config_tooth_style')}
                        .value=${this._config.tooth_style === 'none' ? 'none' : 'teeth'}
                        @value-changed=${(ev) => this._valueChanged('tooth_style', ev.detail.value === 'none' ? 'none' : '')}
                    ></ha-selector>
                </div>

                ${this._config.tooth_style !== 'none' ? this._colorRow() : ''}

                ${this._config.device_id && this._config.tooth_style !== 'none' ? html`
                    <div class="group-label">${t(this.hass, 'group_sectors')}</div>
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
                    <div class="sector-revisit-hint">
                        ${t(this.hass, 'config_sector_revisit_hint')}
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

                ${this._config.device_id ? this._renderLayoutSection() : ''}

                ${this._config.device_id ? this._renderValueDisplaySection() : ''}

                <div class="group-label">${t(this.hass, 'group_recap')}</div>
                <div class="field row">
                    <ha-switch
                        .checked=${this._recapEnabled()}
                        @change=${(ev) => this._recapEnabledChanged(ev.target.checked)}
                    ></ha-switch>
                    <span>${t(this.hass, 'config_show_recap')}</span>
                </div>
                ${this._recapEnabled() ? html`
                    ${this._hasVerdictSource() ? html`
                        <div class="field row indented">
                            <ha-switch
                                .checked=${this._config.show_verdict !== false}
                                @change=${(ev) => this._valueChanged('show_verdict', ev.target.checked ? '' : false)}
                            ></ha-switch>
                            <span>${t(this.hass, 'config_show_verdict')}</span>
                        </div>
                    ` : ''}
                    ${this._hasSessionRecord() ? html`
                        <div class="field row indented">
                            <ha-switch
                                .checked=${this._config.device_recap !== false}
                                @change=${(ev) => this._valueChanged('device_recap', ev.target.checked ? '' : false)}
                            ></ha-switch>
                            <span>${t(this.hass, 'config_device_recap')}</span>
                        </div>
                    ` : ''}
                    ${this._canRebuildFromHistory() ? html`
                        <div class="field row indented">
                            <ha-switch
                                .checked=${this._config.history_recap !== false}
                                @change=${(ev) => this._valueChanged('history_recap', ev.target.checked ? '' : false)}
                            ></ha-switch>
                            <span>${t(this.hass, 'config_history_recap')}</span>
                        </div>
                    ` : ''}
                    <div class="field indented">
                        <ha-selector
                            .hass=${this.hass}
                            .selector=${{ select: { mode: 'dropdown', options: [
                                { value: '0.25', label: '15 min' },
                                { value: '0.5', label: '30 min' },
                                { value: '1', label: '1 h' },
                                { value: '4', label: '4 h' },
                                { value: '8', label: '8 h' },
                                { value: '12', label: '12 h' },
                                { value: '24', label: '24 h' },
                                { value: '0', label: t(this.hass, 'hold_until_next_session') },
                            ] } }}
                            .label=${t(this.hass, 'config_hold_duration')}
                            .value=${this._holdValue()}
                            @value-changed=${(ev) => this._holdChanged(ev.detail.value)}
                        ></ha-selector>
                    </div>
                ` : ''}

                <button class="reset-all-btn" ?disabled=${!this._hasCustomOptions}
                        @click=${this._resetAll}>
                    ${t(this.hass, 'config_reset_all')}
                </button>

                <div class="build-info">
                    Toothbrush Card v${CARD_VERSION} · Build ${BUILD_DATE}
                </div>
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
            /* Settings that only mean anything while the summary is shown,
               set in from the switch that governs them. */
            .field.indented {
                margin-left: 24px;
            }
            ha-input {
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
            .group-label {
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-size: 11px;
                font-weight: 700;
                letter-spacing: 0.08em;
                text-transform: uppercase;
                color: var(--secondary-text-color, #888);
                border-top: 1px solid var(--divider-color, #e5e7eb);
                padding-top: 14px;
                margin: 24px 0 12px;
            }
            .group-label:first-child {
                border-top: none;
                padding-top: 0;
                margin-top: 0;
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
            .reset-btn:hover:not([disabled]) {
                background: var(--secondary-background-color, #f5f5f5);
            }
            .reset-btn[disabled] {
                opacity: 0.4;
                cursor: default;
            }
            .reset-all-btn {
                display: block;
                width: 100%;
                margin-top: 24px;
                padding: 8px 12px;
                background: none;
                border: 1px solid var(--divider-color, #e0e0e0);
                border-radius: 8px;
                font-size: 13px;
                cursor: pointer;
                color: var(--error-color, #db4437);
            }
            .reset-all-btn:hover:not([disabled]) {
                border-color: var(--error-color, #db4437);
                background: var(--secondary-background-color, #f5f5f5);
            }
            .reset-all-btn[disabled] {
                opacity: 0.4;
                cursor: default;
            }
            .build-info {
                margin-top: 16px;
                text-align: center;
                font-size: 11px;
                color: var(--secondary-text-color, #727272);
                opacity: 0.8;
            }
            .sector-mode-hint {
                font-size: 12px;
                color: var(--secondary-text-color, #888);
                font-style: italic;
                margin-bottom: 8px;
            }
            /* The hint sits under the swatch grid and needs room from it. */
            .ring-hint {
                margin-top: 10px;
            }
            /* Shows the colour the hint names, beside the value itself. */
            .ring-swatch {
                display: inline-block;
                width: 10px;
                height: 10px;
                border-radius: 50%;
                border: 1px solid var(--divider-color, #e0e0e0);
                vertical-align: baseline;
            }
            .sub-label {
                font-size: 13px;
                font-weight: 500;
                color: var(--secondary-text-color, #888);
                margin: 12px 0 6px;
            }
            .sector-revisit-hint {
                font-size: 11px;
                color: var(--secondary-text-color, #888);
                margin-bottom: 8px;
                line-height: 1.4;
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
            .color-field {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .color-row {
                display: flex;
                gap: 16px;
            }
            .color-item {
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 4px;
            }
            .color-item .color-input {
                width: 100%;
            }
            .color-item-lbl {
                font-size: 11px;
                color: var(--secondary-text-color);
            }
            .color-input {
                width: 40px;
                height: 36px;
                padding: 0;
                border: 1px solid var(--divider-color, #e0e0e0);
                border-radius: 8px;
                background: none;
                cursor: pointer;
                flex-shrink: 0;
            }
            .color-field ha-input {
                flex: 1;
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
