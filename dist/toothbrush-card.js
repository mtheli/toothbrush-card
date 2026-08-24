
function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const $06bdd16cbb4a41b3$var$t = globalThis, $06bdd16cbb4a41b3$export$b4d10f6001c083c2 = $06bdd16cbb4a41b3$var$t.ShadowRoot && (void 0 === $06bdd16cbb4a41b3$var$t.ShadyCSS || $06bdd16cbb4a41b3$var$t.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, $06bdd16cbb4a41b3$var$s = Symbol(), $06bdd16cbb4a41b3$var$o = new WeakMap;
class $06bdd16cbb4a41b3$export$505d1e8739bad805 {
    constructor(t, e, o){
        if (this._$cssResult$ = !0, o !== $06bdd16cbb4a41b3$var$s) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
        this.cssText = t, this.t = e;
    }
    get styleSheet() {
        let t = this.o;
        const s = this.t;
        if ($06bdd16cbb4a41b3$export$b4d10f6001c083c2 && void 0 === t) {
            const e = void 0 !== s && 1 === s.length;
            e && (t = $06bdd16cbb4a41b3$var$o.get(s)), void 0 === t && ((this.o = t = new CSSStyleSheet).replaceSync(this.cssText), e && $06bdd16cbb4a41b3$var$o.set(s, t));
        }
        return t;
    }
    toString() {
        return this.cssText;
    }
}
const $06bdd16cbb4a41b3$export$8d80f9cac07cdb3 = (t)=>new $06bdd16cbb4a41b3$export$505d1e8739bad805("string" == typeof t ? t : t + "", void 0, $06bdd16cbb4a41b3$var$s), $06bdd16cbb4a41b3$export$dbf350e5966cf602 = (t, ...e)=>{
    const o = 1 === t.length ? t[0] : e.reduce((e, s, o)=>e + ((t)=>{
            if (!0 === t._$cssResult$) return t.cssText;
            if ("number" == typeof t) return t;
            throw Error("Value passed to 'css' function must be a 'css' function result: " + t + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
        })(s) + t[o + 1], t[0]);
    return new $06bdd16cbb4a41b3$export$505d1e8739bad805(o, t, $06bdd16cbb4a41b3$var$s);
}, $06bdd16cbb4a41b3$export$2ca4a66ec4cecb90 = (s, o)=>{
    if ($06bdd16cbb4a41b3$export$b4d10f6001c083c2) s.adoptedStyleSheets = o.map((t)=>t instanceof CSSStyleSheet ? t : t.styleSheet);
    else for (const e of o){
        const o = document.createElement("style"), n = $06bdd16cbb4a41b3$var$t.litNonce;
        void 0 !== n && o.setAttribute("nonce", n), o.textContent = e.cssText, s.appendChild(o);
    }
}, $06bdd16cbb4a41b3$export$ee69dfd951e24778 = $06bdd16cbb4a41b3$export$b4d10f6001c083c2 ? (t)=>t : (t)=>t instanceof CSSStyleSheet ? ((t)=>{
        let e = "";
        for (const s of t.cssRules)e += s.cssText;
        return $06bdd16cbb4a41b3$export$8d80f9cac07cdb3(e);
    })(t) : t;


/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const { is: $375b48187e686ca2$var$i, defineProperty: $375b48187e686ca2$var$e, getOwnPropertyDescriptor: $375b48187e686ca2$var$h, getOwnPropertyNames: $375b48187e686ca2$var$r, getOwnPropertySymbols: $375b48187e686ca2$var$o, getPrototypeOf: $375b48187e686ca2$var$n } = Object, $375b48187e686ca2$var$a = globalThis, $375b48187e686ca2$var$c = $375b48187e686ca2$var$a.trustedTypes, $375b48187e686ca2$var$l = $375b48187e686ca2$var$c ? $375b48187e686ca2$var$c.emptyScript : "", $375b48187e686ca2$var$p = $375b48187e686ca2$var$a.reactiveElementPolyfillSupport, $375b48187e686ca2$var$d = (t, s)=>t, $375b48187e686ca2$export$7312b35fbf521afb = {
    toAttribute (t, s) {
        switch(s){
            case Boolean:
                t = t ? $375b48187e686ca2$var$l : null;
                break;
            case Object:
            case Array:
                t = null == t ? t : JSON.stringify(t);
        }
        return t;
    },
    fromAttribute (t, s) {
        let i = t;
        switch(s){
            case Boolean:
                i = null !== t;
                break;
            case Number:
                i = null === t ? null : Number(t);
                break;
            case Object:
            case Array:
                try {
                    i = JSON.parse(t);
                } catch (t) {
                    i = null;
                }
        }
        return i;
    }
}, $375b48187e686ca2$export$53a6892c50694894 = (t, s)=>!$375b48187e686ca2$var$i(t, s), $375b48187e686ca2$var$b = {
    attribute: !0,
    type: String,
    converter: $375b48187e686ca2$export$7312b35fbf521afb,
    reflect: !1,
    useDefault: !1,
    hasChanged: $375b48187e686ca2$export$53a6892c50694894
};
Symbol.metadata ??= Symbol("metadata"), $375b48187e686ca2$var$a.litPropertyMetadata ??= new WeakMap;
class $375b48187e686ca2$export$c7c07a37856565d extends HTMLElement {
    static addInitializer(t) {
        this._$Ei(), (this.l ??= []).push(t);
    }
    static get observedAttributes() {
        return this.finalize(), this._$Eh && [
            ...this._$Eh.keys()
        ];
    }
    static createProperty(t, s = $375b48187e686ca2$var$b) {
        if (s.state && (s.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((s = Object.create(s)).wrapped = !0), this.elementProperties.set(t, s), !s.noAccessor) {
            const i = Symbol(), h = this.getPropertyDescriptor(t, i, s);
            void 0 !== h && $375b48187e686ca2$var$e(this.prototype, t, h);
        }
    }
    static getPropertyDescriptor(t, s, i) {
        const { get: e, set: r } = $375b48187e686ca2$var$h(this.prototype, t) ?? {
            get () {
                return this[s];
            },
            set (t) {
                this[s] = t;
            }
        };
        return {
            get: e,
            set (s) {
                const h = e?.call(this);
                r?.call(this, s), this.requestUpdate(t, h, i);
            },
            configurable: !0,
            enumerable: !0
        };
    }
    static getPropertyOptions(t) {
        return this.elementProperties.get(t) ?? $375b48187e686ca2$var$b;
    }
    static _$Ei() {
        if (this.hasOwnProperty($375b48187e686ca2$var$d("elementProperties"))) return;
        const t = $375b48187e686ca2$var$n(this);
        t.finalize(), void 0 !== t.l && (this.l = [
            ...t.l
        ]), this.elementProperties = new Map(t.elementProperties);
    }
    static finalize() {
        if (this.hasOwnProperty($375b48187e686ca2$var$d("finalized"))) return;
        if (this.finalized = !0, this._$Ei(), this.hasOwnProperty($375b48187e686ca2$var$d("properties"))) {
            const t = this.properties, s = [
                ...$375b48187e686ca2$var$r(t),
                ...$375b48187e686ca2$var$o(t)
            ];
            for (const i of s)this.createProperty(i, t[i]);
        }
        const t = this[Symbol.metadata];
        if (null !== t) {
            const s = litPropertyMetadata.get(t);
            if (void 0 !== s) for (const [t, i] of s)this.elementProperties.set(t, i);
        }
        this._$Eh = new Map;
        for (const [t, s] of this.elementProperties){
            const i = this._$Eu(t, s);
            void 0 !== i && this._$Eh.set(i, t);
        }
        this.elementStyles = this.finalizeStyles(this.styles);
    }
    static finalizeStyles(s) {
        const i = [];
        if (Array.isArray(s)) {
            const e = new Set(s.flat(1 / 0).reverse());
            for (const s of e)i.unshift((0, $06bdd16cbb4a41b3$export$ee69dfd951e24778)(s));
        } else void 0 !== s && i.push((0, $06bdd16cbb4a41b3$export$ee69dfd951e24778)(s));
        return i;
    }
    static _$Eu(t, s) {
        const i = s.attribute;
        return !1 === i ? void 0 : "string" == typeof i ? i : "string" == typeof t ? t.toLowerCase() : void 0;
    }
    constructor(){
        super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
    }
    _$Ev() {
        this._$ES = new Promise((t)=>this.enableUpdating = t), this._$AL = new Map, this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t)=>t(this));
    }
    addController(t) {
        (this._$EO ??= new Set).add(t), void 0 !== this.renderRoot && this.isConnected && t.hostConnected?.();
    }
    removeController(t) {
        this._$EO?.delete(t);
    }
    _$E_() {
        const t = new Map, s = this.constructor.elementProperties;
        for (const i of s.keys())this.hasOwnProperty(i) && (t.set(i, this[i]), delete this[i]);
        t.size > 0 && (this._$Ep = t);
    }
    createRenderRoot() {
        const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
        return (0, $06bdd16cbb4a41b3$export$2ca4a66ec4cecb90)(t, this.constructor.elementStyles), t;
    }
    connectedCallback() {
        this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((t)=>t.hostConnected?.());
    }
    enableUpdating(t) {}
    disconnectedCallback() {
        this._$EO?.forEach((t)=>t.hostDisconnected?.());
    }
    attributeChangedCallback(t, s, i) {
        this._$AK(t, i);
    }
    _$ET(t, s) {
        const i = this.constructor.elementProperties.get(t), e = this.constructor._$Eu(t, i);
        if (void 0 !== e && !0 === i.reflect) {
            const h = (void 0 !== i.converter?.toAttribute ? i.converter : $375b48187e686ca2$export$7312b35fbf521afb).toAttribute(s, i.type);
            this._$Em = t, null == h ? this.removeAttribute(e) : this.setAttribute(e, h), this._$Em = null;
        }
    }
    _$AK(t, s) {
        const i = this.constructor, e = i._$Eh.get(t);
        if (void 0 !== e && this._$Em !== e) {
            const t = i.getPropertyOptions(e), h = "function" == typeof t.converter ? {
                fromAttribute: t.converter
            } : void 0 !== t.converter?.fromAttribute ? t.converter : $375b48187e686ca2$export$7312b35fbf521afb;
            this._$Em = e;
            const r = h.fromAttribute(s, t.type);
            this[e] = r ?? this._$Ej?.get(e) ?? r, this._$Em = null;
        }
    }
    requestUpdate(t, s, i) {
        if (void 0 !== t) {
            const e = this.constructor, h = this[t];
            if (i ??= e.getPropertyOptions(t), !((i.hasChanged ?? $375b48187e686ca2$export$53a6892c50694894)(h, s) || i.useDefault && i.reflect && h === this._$Ej?.get(t) && !this.hasAttribute(e._$Eu(t, i)))) return;
            this.C(t, s, i);
        }
        !1 === this.isUpdatePending && (this._$ES = this._$EP());
    }
    C(t, s, { useDefault: i, reflect: e, wrapped: h }, r) {
        i && !(this._$Ej ??= new Map).has(t) && (this._$Ej.set(t, r ?? s ?? this[t]), !0 !== h || void 0 !== r) || (this._$AL.has(t) || (this.hasUpdated || i || (s = void 0), this._$AL.set(t, s)), !0 === e && this._$Em !== t && (this._$Eq ??= new Set).add(t));
    }
    async _$EP() {
        this.isUpdatePending = !0;
        try {
            await this._$ES;
        } catch (t) {
            Promise.reject(t);
        }
        const t = this.scheduleUpdate();
        return null != t && await t, !this.isUpdatePending;
    }
    scheduleUpdate() {
        return this.performUpdate();
    }
    performUpdate() {
        if (!this.isUpdatePending) return;
        if (!this.hasUpdated) {
            if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
                for (const [t, s] of this._$Ep)this[t] = s;
                this._$Ep = void 0;
            }
            const t = this.constructor.elementProperties;
            if (t.size > 0) for (const [s, i] of t){
                const { wrapped: t } = i, e = this[s];
                !0 !== t || this._$AL.has(s) || void 0 === e || this.C(s, void 0, i, e);
            }
        }
        let t = !1;
        const s = this._$AL;
        try {
            t = this.shouldUpdate(s), t ? (this.willUpdate(s), this._$EO?.forEach((t)=>t.hostUpdate?.()), this.update(s)) : this._$EM();
        } catch (s) {
            throw t = !1, this._$EM(), s;
        }
        t && this._$AE(s);
    }
    willUpdate(t) {}
    _$AE(t) {
        this._$EO?.forEach((t)=>t.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
    }
    _$EM() {
        this._$AL = new Map, this.isUpdatePending = !1;
    }
    get updateComplete() {
        return this.getUpdateComplete();
    }
    getUpdateComplete() {
        return this._$ES;
    }
    shouldUpdate(t) {
        return !0;
    }
    update(t) {
        this._$Eq &&= this._$Eq.forEach((t)=>this._$ET(t, this[t])), this._$EM();
    }
    updated(t) {}
    firstUpdated(t) {}
}
$375b48187e686ca2$export$c7c07a37856565d.elementStyles = [], $375b48187e686ca2$export$c7c07a37856565d.shadowRootOptions = {
    mode: "open"
}, $375b48187e686ca2$export$c7c07a37856565d[$375b48187e686ca2$var$d("elementProperties")] = new Map, $375b48187e686ca2$export$c7c07a37856565d[$375b48187e686ca2$var$d("finalized")] = new Map, $375b48187e686ca2$var$p?.({
    ReactiveElement: $375b48187e686ca2$export$c7c07a37856565d
}), ($375b48187e686ca2$var$a.reactiveElementVersions ??= []).push("2.1.1");


/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const $d33ef1320595a3ac$var$t = globalThis, $d33ef1320595a3ac$var$i = $d33ef1320595a3ac$var$t.trustedTypes, $d33ef1320595a3ac$var$s = $d33ef1320595a3ac$var$i ? $d33ef1320595a3ac$var$i.createPolicy("lit-html", {
    createHTML: (t)=>t
}) : void 0, $d33ef1320595a3ac$var$e = "$lit$", $d33ef1320595a3ac$var$h = `lit$${Math.random().toFixed(9).slice(2)}$`, $d33ef1320595a3ac$var$o = "?" + $d33ef1320595a3ac$var$h, $d33ef1320595a3ac$var$n = `<${$d33ef1320595a3ac$var$o}>`, $d33ef1320595a3ac$var$r = document, $d33ef1320595a3ac$var$l = ()=>$d33ef1320595a3ac$var$r.createComment(""), $d33ef1320595a3ac$var$c = (t)=>null === t || "object" != typeof t && "function" != typeof t, $d33ef1320595a3ac$var$a = Array.isArray, $d33ef1320595a3ac$var$u = (t)=>$d33ef1320595a3ac$var$a(t) || "function" == typeof t?.[Symbol.iterator], $d33ef1320595a3ac$var$d = "[ \t\n\f\r]", $d33ef1320595a3ac$var$f = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, $d33ef1320595a3ac$var$v = /-->/g, $d33ef1320595a3ac$var$_ = />/g, $d33ef1320595a3ac$var$m = RegExp(`>|${$d33ef1320595a3ac$var$d}(?:([^\\s"'>=/]+)(${$d33ef1320595a3ac$var$d}*=${$d33ef1320595a3ac$var$d}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), $d33ef1320595a3ac$var$p = /'/g, $d33ef1320595a3ac$var$g = /"/g, $d33ef1320595a3ac$var$$ = /^(?:script|style|textarea|title)$/i, $d33ef1320595a3ac$var$y = (t)=>(i, ...s)=>({
            _$litType$: t,
            strings: i,
            values: s
        }), $d33ef1320595a3ac$export$c0bb0b647f701bb5 = $d33ef1320595a3ac$var$y(1), $d33ef1320595a3ac$export$7ed1367e7fa1ad68 = $d33ef1320595a3ac$var$y(2), $d33ef1320595a3ac$export$47d5b44d225be5b4 = $d33ef1320595a3ac$var$y(3), $d33ef1320595a3ac$export$9c068ae9cc5db4e8 = Symbol.for("lit-noChange"), $d33ef1320595a3ac$export$45b790e32b2810ee = Symbol.for("lit-nothing"), $d33ef1320595a3ac$var$A = new WeakMap, $d33ef1320595a3ac$var$C = $d33ef1320595a3ac$var$r.createTreeWalker($d33ef1320595a3ac$var$r, 129);
function $d33ef1320595a3ac$var$P(t, i) {
    if (!$d33ef1320595a3ac$var$a(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
    return void 0 !== $d33ef1320595a3ac$var$s ? $d33ef1320595a3ac$var$s.createHTML(i) : i;
}
const $d33ef1320595a3ac$var$V = (t, i)=>{
    const s = t.length - 1, o = [];
    let r, l = 2 === i ? "<svg>" : 3 === i ? "<math>" : "", c = $d33ef1320595a3ac$var$f;
    for(let i = 0; i < s; i++){
        const s = t[i];
        let a, u, d = -1, y = 0;
        for(; y < s.length && (c.lastIndex = y, u = c.exec(s), null !== u);)y = c.lastIndex, c === $d33ef1320595a3ac$var$f ? "!--" === u[1] ? c = $d33ef1320595a3ac$var$v : void 0 !== u[1] ? c = $d33ef1320595a3ac$var$_ : void 0 !== u[2] ? ($d33ef1320595a3ac$var$$.test(u[2]) && (r = RegExp("</" + u[2], "g")), c = $d33ef1320595a3ac$var$m) : void 0 !== u[3] && (c = $d33ef1320595a3ac$var$m) : c === $d33ef1320595a3ac$var$m ? ">" === u[0] ? (c = r ?? $d33ef1320595a3ac$var$f, d = -1) : void 0 === u[1] ? d = -2 : (d = c.lastIndex - u[2].length, a = u[1], c = void 0 === u[3] ? $d33ef1320595a3ac$var$m : '"' === u[3] ? $d33ef1320595a3ac$var$g : $d33ef1320595a3ac$var$p) : c === $d33ef1320595a3ac$var$g || c === $d33ef1320595a3ac$var$p ? c = $d33ef1320595a3ac$var$m : c === $d33ef1320595a3ac$var$v || c === $d33ef1320595a3ac$var$_ ? c = $d33ef1320595a3ac$var$f : (c = $d33ef1320595a3ac$var$m, r = void 0);
        const x = c === $d33ef1320595a3ac$var$m && t[i + 1].startsWith("/>") ? " " : "";
        l += c === $d33ef1320595a3ac$var$f ? s + $d33ef1320595a3ac$var$n : d >= 0 ? (o.push(a), s.slice(0, d) + $d33ef1320595a3ac$var$e + s.slice(d) + $d33ef1320595a3ac$var$h + x) : s + $d33ef1320595a3ac$var$h + (-2 === d ? i : x);
    }
    return [
        $d33ef1320595a3ac$var$P(t, l + (t[s] || "<?>") + (2 === i ? "</svg>" : 3 === i ? "</math>" : "")),
        o
    ];
};
class $d33ef1320595a3ac$var$N {
    constructor({ strings: t, _$litType$: s }, n){
        let r;
        this.parts = [];
        let c = 0, a = 0;
        const u = t.length - 1, d = this.parts, [f, v] = $d33ef1320595a3ac$var$V(t, s);
        if (this.el = $d33ef1320595a3ac$var$N.createElement(f, n), $d33ef1320595a3ac$var$C.currentNode = this.el.content, 2 === s || 3 === s) {
            const t = this.el.content.firstChild;
            t.replaceWith(...t.childNodes);
        }
        for(; null !== (r = $d33ef1320595a3ac$var$C.nextNode()) && d.length < u;){
            if (1 === r.nodeType) {
                if (r.hasAttributes()) for (const t of r.getAttributeNames())if (t.endsWith($d33ef1320595a3ac$var$e)) {
                    const i = v[a++], s = r.getAttribute(t).split($d33ef1320595a3ac$var$h), e = /([.?@])?(.*)/.exec(i);
                    d.push({
                        type: 1,
                        index: c,
                        name: e[2],
                        strings: s,
                        ctor: "." === e[1] ? $d33ef1320595a3ac$var$H : "?" === e[1] ? $d33ef1320595a3ac$var$I : "@" === e[1] ? $d33ef1320595a3ac$var$L : $d33ef1320595a3ac$var$k
                    }), r.removeAttribute(t);
                } else t.startsWith($d33ef1320595a3ac$var$h) && (d.push({
                    type: 6,
                    index: c
                }), r.removeAttribute(t));
                if ($d33ef1320595a3ac$var$$.test(r.tagName)) {
                    const t = r.textContent.split($d33ef1320595a3ac$var$h), s = t.length - 1;
                    if (s > 0) {
                        r.textContent = $d33ef1320595a3ac$var$i ? $d33ef1320595a3ac$var$i.emptyScript : "";
                        for(let i = 0; i < s; i++)r.append(t[i], $d33ef1320595a3ac$var$l()), $d33ef1320595a3ac$var$C.nextNode(), d.push({
                            type: 2,
                            index: ++c
                        });
                        r.append(t[s], $d33ef1320595a3ac$var$l());
                    }
                }
            } else if (8 === r.nodeType) {
                if (r.data === $d33ef1320595a3ac$var$o) d.push({
                    type: 2,
                    index: c
                });
                else {
                    let t = -1;
                    for(; -1 !== (t = r.data.indexOf($d33ef1320595a3ac$var$h, t + 1));)d.push({
                        type: 7,
                        index: c
                    }), t += $d33ef1320595a3ac$var$h.length - 1;
                }
            }
            c++;
        }
    }
    static createElement(t, i) {
        const s = $d33ef1320595a3ac$var$r.createElement("template");
        return s.innerHTML = t, s;
    }
}
function $d33ef1320595a3ac$var$S(t, i, s = t, e) {
    if (i === $d33ef1320595a3ac$export$9c068ae9cc5db4e8) return i;
    let h = void 0 !== e ? s._$Co?.[e] : s._$Cl;
    const o = $d33ef1320595a3ac$var$c(i) ? void 0 : i._$litDirective$;
    return h?.constructor !== o && (h?._$AO?.(!1), void 0 === o ? h = void 0 : (h = new o(t), h._$AT(t, s, e)), void 0 !== e ? (s._$Co ??= [])[e] = h : s._$Cl = h), void 0 !== h && (i = $d33ef1320595a3ac$var$S(t, h._$AS(t, i.values), h, e)), i;
}
class $d33ef1320595a3ac$var$M {
    constructor(t, i){
        this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = i;
    }
    get parentNode() {
        return this._$AM.parentNode;
    }
    get _$AU() {
        return this._$AM._$AU;
    }
    u(t) {
        const { el: { content: i }, parts: s } = this._$AD, e = (t?.creationScope ?? $d33ef1320595a3ac$var$r).importNode(i, !0);
        $d33ef1320595a3ac$var$C.currentNode = e;
        let h = $d33ef1320595a3ac$var$C.nextNode(), o = 0, n = 0, l = s[0];
        for(; void 0 !== l;){
            if (o === l.index) {
                let i;
                2 === l.type ? i = new $d33ef1320595a3ac$var$R(h, h.nextSibling, this, t) : 1 === l.type ? i = new l.ctor(h, l.name, l.strings, this, t) : 6 === l.type && (i = new $d33ef1320595a3ac$var$z(h, this, t)), this._$AV.push(i), l = s[++n];
            }
            o !== l?.index && (h = $d33ef1320595a3ac$var$C.nextNode(), o++);
        }
        return $d33ef1320595a3ac$var$C.currentNode = $d33ef1320595a3ac$var$r, e;
    }
    p(t) {
        let i = 0;
        for (const s of this._$AV)void 0 !== s && (void 0 !== s.strings ? (s._$AI(t, s, i), i += s.strings.length - 2) : s._$AI(t[i])), i++;
    }
}
class $d33ef1320595a3ac$var$R {
    get _$AU() {
        return this._$AM?._$AU ?? this._$Cv;
    }
    constructor(t, i, s, e){
        this.type = 2, this._$AH = $d33ef1320595a3ac$export$45b790e32b2810ee, this._$AN = void 0, this._$AA = t, this._$AB = i, this._$AM = s, this.options = e, this._$Cv = e?.isConnected ?? !0;
    }
    get parentNode() {
        let t = this._$AA.parentNode;
        const i = this._$AM;
        return void 0 !== i && 11 === t?.nodeType && (t = i.parentNode), t;
    }
    get startNode() {
        return this._$AA;
    }
    get endNode() {
        return this._$AB;
    }
    _$AI(t, i = this) {
        t = $d33ef1320595a3ac$var$S(this, t, i), $d33ef1320595a3ac$var$c(t) ? t === $d33ef1320595a3ac$export$45b790e32b2810ee || null == t || "" === t ? (this._$AH !== $d33ef1320595a3ac$export$45b790e32b2810ee && this._$AR(), this._$AH = $d33ef1320595a3ac$export$45b790e32b2810ee) : t !== this._$AH && t !== $d33ef1320595a3ac$export$9c068ae9cc5db4e8 && this._(t) : void 0 !== t._$litType$ ? this.$(t) : void 0 !== t.nodeType ? this.T(t) : $d33ef1320595a3ac$var$u(t) ? this.k(t) : this._(t);
    }
    O(t) {
        return this._$AA.parentNode.insertBefore(t, this._$AB);
    }
    T(t) {
        this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
    }
    _(t) {
        this._$AH !== $d33ef1320595a3ac$export$45b790e32b2810ee && $d33ef1320595a3ac$var$c(this._$AH) ? this._$AA.nextSibling.data = t : this.T($d33ef1320595a3ac$var$r.createTextNode(t)), this._$AH = t;
    }
    $(t) {
        const { values: i, _$litType$: s } = t, e = "number" == typeof s ? this._$AC(t) : (void 0 === s.el && (s.el = $d33ef1320595a3ac$var$N.createElement($d33ef1320595a3ac$var$P(s.h, s.h[0]), this.options)), s);
        if (this._$AH?._$AD === e) this._$AH.p(i);
        else {
            const t = new $d33ef1320595a3ac$var$M(e, this), s = t.u(this.options);
            t.p(i), this.T(s), this._$AH = t;
        }
    }
    _$AC(t) {
        let i = $d33ef1320595a3ac$var$A.get(t.strings);
        return void 0 === i && $d33ef1320595a3ac$var$A.set(t.strings, i = new $d33ef1320595a3ac$var$N(t)), i;
    }
    k(t) {
        $d33ef1320595a3ac$var$a(this._$AH) || (this._$AH = [], this._$AR());
        const i = this._$AH;
        let s, e = 0;
        for (const h of t)e === i.length ? i.push(s = new $d33ef1320595a3ac$var$R(this.O($d33ef1320595a3ac$var$l()), this.O($d33ef1320595a3ac$var$l()), this, this.options)) : s = i[e], s._$AI(h), e++;
        e < i.length && (this._$AR(s && s._$AB.nextSibling, e), i.length = e);
    }
    _$AR(t = this._$AA.nextSibling, i) {
        for(this._$AP?.(!1, !0, i); t !== this._$AB;){
            const i = t.nextSibling;
            t.remove(), t = i;
        }
    }
    setConnected(t) {
        void 0 === this._$AM && (this._$Cv = t, this._$AP?.(t));
    }
}
class $d33ef1320595a3ac$var$k {
    get tagName() {
        return this.element.tagName;
    }
    get _$AU() {
        return this._$AM._$AU;
    }
    constructor(t, i, s, e, h){
        this.type = 1, this._$AH = $d33ef1320595a3ac$export$45b790e32b2810ee, this._$AN = void 0, this.element = t, this.name = i, this._$AM = e, this.options = h, s.length > 2 || "" !== s[0] || "" !== s[1] ? (this._$AH = Array(s.length - 1).fill(new String), this.strings = s) : this._$AH = $d33ef1320595a3ac$export$45b790e32b2810ee;
    }
    _$AI(t, i = this, s, e) {
        const h = this.strings;
        let o = !1;
        if (void 0 === h) t = $d33ef1320595a3ac$var$S(this, t, i, 0), o = !$d33ef1320595a3ac$var$c(t) || t !== this._$AH && t !== $d33ef1320595a3ac$export$9c068ae9cc5db4e8, o && (this._$AH = t);
        else {
            const e = t;
            let n, r;
            for(t = h[0], n = 0; n < h.length - 1; n++)r = $d33ef1320595a3ac$var$S(this, e[s + n], i, n), r === $d33ef1320595a3ac$export$9c068ae9cc5db4e8 && (r = this._$AH[n]), o ||= !$d33ef1320595a3ac$var$c(r) || r !== this._$AH[n], r === $d33ef1320595a3ac$export$45b790e32b2810ee ? t = $d33ef1320595a3ac$export$45b790e32b2810ee : t !== $d33ef1320595a3ac$export$45b790e32b2810ee && (t += (r ?? "") + h[n + 1]), this._$AH[n] = r;
        }
        o && !e && this.j(t);
    }
    j(t) {
        t === $d33ef1320595a3ac$export$45b790e32b2810ee ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
    }
}
class $d33ef1320595a3ac$var$H extends $d33ef1320595a3ac$var$k {
    constructor(){
        super(...arguments), this.type = 3;
    }
    j(t) {
        this.element[this.name] = t === $d33ef1320595a3ac$export$45b790e32b2810ee ? void 0 : t;
    }
}
class $d33ef1320595a3ac$var$I extends $d33ef1320595a3ac$var$k {
    constructor(){
        super(...arguments), this.type = 4;
    }
    j(t) {
        this.element.toggleAttribute(this.name, !!t && t !== $d33ef1320595a3ac$export$45b790e32b2810ee);
    }
}
class $d33ef1320595a3ac$var$L extends $d33ef1320595a3ac$var$k {
    constructor(t, i, s, e, h){
        super(t, i, s, e, h), this.type = 5;
    }
    _$AI(t, i = this) {
        if ((t = $d33ef1320595a3ac$var$S(this, t, i, 0) ?? $d33ef1320595a3ac$export$45b790e32b2810ee) === $d33ef1320595a3ac$export$9c068ae9cc5db4e8) return;
        const s = this._$AH, e = t === $d33ef1320595a3ac$export$45b790e32b2810ee && s !== $d33ef1320595a3ac$export$45b790e32b2810ee || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, h = t !== $d33ef1320595a3ac$export$45b790e32b2810ee && (s === $d33ef1320595a3ac$export$45b790e32b2810ee || e);
        e && this.element.removeEventListener(this.name, this, s), h && this.element.addEventListener(this.name, this, t), this._$AH = t;
    }
    handleEvent(t) {
        "function" == typeof this._$AH ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
    }
}
class $d33ef1320595a3ac$var$z {
    constructor(t, i, s){
        this.element = t, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = s;
    }
    get _$AU() {
        return this._$AM._$AU;
    }
    _$AI(t) {
        $d33ef1320595a3ac$var$S(this, t);
    }
}
const $d33ef1320595a3ac$export$8613d1ca9052b22e = {
    M: $d33ef1320595a3ac$var$e,
    P: $d33ef1320595a3ac$var$h,
    A: $d33ef1320595a3ac$var$o,
    C: 1,
    L: $d33ef1320595a3ac$var$V,
    R: $d33ef1320595a3ac$var$M,
    D: $d33ef1320595a3ac$var$u,
    V: $d33ef1320595a3ac$var$S,
    I: $d33ef1320595a3ac$var$R,
    H: $d33ef1320595a3ac$var$k,
    N: $d33ef1320595a3ac$var$I,
    U: $d33ef1320595a3ac$var$L,
    B: $d33ef1320595a3ac$var$H,
    F: $d33ef1320595a3ac$var$z
}, $d33ef1320595a3ac$var$j = $d33ef1320595a3ac$var$t.litHtmlPolyfillSupport;
$d33ef1320595a3ac$var$j?.($d33ef1320595a3ac$var$N, $d33ef1320595a3ac$var$R), ($d33ef1320595a3ac$var$t.litHtmlVersions ??= []).push("3.3.1");
const $d33ef1320595a3ac$export$b3890eb0ae9dca99 = (t, i, s)=>{
    const e = s?.renderBefore ?? i;
    let h = e._$litPart$;
    if (void 0 === h) {
        const t = s?.renderBefore ?? null;
        e._$litPart$ = h = new $d33ef1320595a3ac$var$R(i.insertBefore($d33ef1320595a3ac$var$l(), t), t, void 0, s ?? {});
    }
    return h._$AI(t), h;
};




/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const $528e4332d1e3099e$var$s = globalThis;
class $528e4332d1e3099e$export$3f2f9f5909897157 extends (0, $375b48187e686ca2$export$c7c07a37856565d) {
    constructor(){
        super(...arguments), this.renderOptions = {
            host: this
        }, this._$Do = void 0;
    }
    createRenderRoot() {
        const t = super.createRenderRoot();
        return this.renderOptions.renderBefore ??= t.firstChild, t;
    }
    update(t) {
        const r = this.render();
        this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = (0, $d33ef1320595a3ac$export$b3890eb0ae9dca99)(r, this.renderRoot, this.renderOptions);
    }
    connectedCallback() {
        super.connectedCallback(), this._$Do?.setConnected(!0);
    }
    disconnectedCallback() {
        super.disconnectedCallback(), this._$Do?.setConnected(!1);
    }
    render() {
        return 0, $d33ef1320595a3ac$export$9c068ae9cc5db4e8;
    }
}
$528e4332d1e3099e$export$3f2f9f5909897157._$litElement$ = !0, $528e4332d1e3099e$export$3f2f9f5909897157["finalized"] = !0, $528e4332d1e3099e$var$s.litElementHydrateSupport?.({
    LitElement: $528e4332d1e3099e$export$3f2f9f5909897157
});
const $528e4332d1e3099e$var$o = $528e4332d1e3099e$var$s.litElementPolyfillSupport;
$528e4332d1e3099e$var$o?.({
    LitElement: $528e4332d1e3099e$export$3f2f9f5909897157
});
const $528e4332d1e3099e$export$f5c524615a7708d6 = {
    _$AK: (t, e, r)=>{
        t._$AK(e, r);
    },
    _$AL: (t)=>t._$AL
};
($528e4332d1e3099e$var$s.litElementVersions ??= []).push("4.2.1");


/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const $56239b0c931b817c$export$6acf61af03e62db = !1;





/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const $f62b4c9bce56f3ae$export$9ba3b3f20a85bfa = {
    ATTRIBUTE: 1,
    CHILD: 2,
    PROPERTY: 3,
    BOOLEAN_ATTRIBUTE: 4,
    EVENT: 5,
    ELEMENT: 6
}, $f62b4c9bce56f3ae$export$99b43ad1ed32e735 = (t)=>(...e)=>({
            _$litDirective$: t,
            values: e
        });
class $f62b4c9bce56f3ae$export$befdefbdce210f91 {
    constructor(t){}
    get _$AU() {
        return this._$AM._$AU;
    }
    _$AT(t, e, i) {
        this._$Ct = t, this._$AM = e, this._$Ci = i;
    }
    _$AS(t, e) {
        return this.update(t, e);
    }
    update(t, e) {
        return this.render(...e);
    }
}


/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const $da98d0425d3716de$export$56cc687933817664 = (0, $f62b4c9bce56f3ae$export$99b43ad1ed32e735)(class extends (0, $f62b4c9bce56f3ae$export$befdefbdce210f91) {
    constructor(t){
        if (super(t), t.type !== (0, $f62b4c9bce56f3ae$export$9ba3b3f20a85bfa).ATTRIBUTE || "class" !== t.name || t.strings?.length > 2) throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.");
    }
    render(t) {
        return " " + Object.keys(t).filter((s)=>t[s]).join(" ") + " ";
    }
    update(s, [i]) {
        if (void 0 === this.st) {
            this.st = new Set, void 0 !== s.strings && (this.nt = new Set(s.strings.join(" ").split(/\s/).filter((t)=>"" !== t)));
            for(const t in i)i[t] && !this.nt?.has(t) && this.st.add(t);
            return this.render(i);
        }
        const r = s.element.classList;
        for (const t of this.st)t in i || (r.remove(t), this.st.delete(t));
        for(const t in i){
            const s = !!i[t];
            s === this.st.has(t) || this.nt?.has(t) || (s ? (r.add(t), this.st.add(t)) : (r.remove(t), this.st.delete(t)));
        }
        return 0, $d33ef1320595a3ac$export$9c068ae9cc5db4e8;
    }
});






const $84db147239ed44e7$var$OUTLINES = (0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)`
    <!-- Outlines -->
    <path fill="none" stroke="var(--secondary-text-color, #9ca3af)" stroke-width="8" d="m 1962,3484 c 6,19 6,16 7,-7 1,-36 16,-64 42,-78 12,-6 94,-13 189,-16 160,-5 169,-4 181,15 12,19 14,18 55,-13 58,-44 218,-95 298,-95 28,0 36,-4 36,-18 0,-30 110,-154 157,-176 36,-17 42,-25 46,-60 6,-44 33,-86 64,-100 11,-5 27,-31 37,-59 18,-50 84,-132 114,-142 14,-4 17,-19 18,-72 1,-74 25,-156 55,-189 17,-18 18,-25 8,-53 -17,-47 -4,-147 26,-204 14,-28 25,-66 25,-88 0,-65 65,-175 120,-204 39,-20 77,-19 130,7 34,16 66,21 129,22 l 85,1 19,34 c 29,49 37,215 12,262 -13,26 -17,54 -16,116 3,93 -11,155 -43,198 -17,22 -24,49 -28,100 -7,93 -37,168 -96,241 -43,53 -49,67 -55,123 -12,115 -59,182 -148,210 -32,10 -38,18 -48,58 -17,68 -45,115 -90,156 -42,38 -109,62 -146,53 -19,-5 -25,1 -43,43 -27,65 -91,134 -155,166 -58,29 -84,31 -133,10 l -34,-14 -42,45 c -73,79 -152,107 -228,79 -25,-9 -53,-19 -63,-22 -12,-4 -35,11 -72,46 -30,29 -72,59 -92,68 -55,23 -138,20 -201,-7 -50,-22 -112,-78 -112,-102"/>
    <path fill="none" stroke="var(--secondary-text-color, #9ca3af)" stroke-width="8" d="m 1961,3822 c -5,5 -12,14 -20,24 -56,75 -189,122 -272,95 -44,-15 -72,-33 -125,-83 l -52,-49 -51,21 c -29,11 -66,20 -84,20 -50,0 -129,-42 -173,-93 -38,-43 -41,-44 -64,-31 -88,48 -247,-44 -296,-173 -16,-41 -19,-43 -58,-43 -58,-1 -116,-30 -159,-81 -31,-36 -51,-81 -72,-165 -2,-5 -23,-16 -46,-23 -83,-25 -129,-94 -145,-220 -6,-43 -17,-67 -54,-117 -57,-75 -89,-154 -97,-243 -4,-44 -14,-78 -29,-101 -33,-51 -48,-121 -41,-198 6,-56 3,-74 -15,-110 -18,-38 -20,-55 -15,-127 3,-46 12,-98 20,-116 23,-55 38,-62 115,-55 60,6 74,4 126,-20 69,-31 110,-27 159,16 44,38 91,133 92,185 0,22 11,60 25,85 27,52 40,183 21,218 -9,17 -8,23 5,30 25,14 64,136 64,201 0,56 2,60 38,87 51,39 68,61 89,114 10,25 34,61 54,80 32,31 59,88 59,128 0,6 10,12 21,12 27,0 146,119 165,166 11,27 20,34 42,34 15,0 71,11 125,25 96,24 170,57 197,90 12,14 15,14 32,-5 19,-20 27,-21 166,-15 222,9 229,11 250,85"/>
    <path fill="none" stroke="var(--secondary-text-color, #9ca3af)" stroke-width="8" d="M 1959,437 C 1946,436 1925,438 1905,442 c -28,5 -102,11 -165,13 -92,2 -123,6 -155,22 -49,25 -130,43 -194,43 -41,0 -50,4 -69,30 -40,53 -122,112 -153,108 -22,-2 -36,6 -63,35 -19,21 -47,40 -65,43 -21,5 -31,12 -30,23 6,66 -48,155 -110,181 -19,8 -31,20 -31,31 0,11 -26,49 -57,84 -32,36 -73,83 -92,105 -24,29 -43,42 -71,46 -36,6 -38,8 -43,54 -8,64 -41,141 -76,174 -27,26 -28,31 -23,96 4,54 1,75 -12,94 -9,14 -16,34 -16,45 0,11 -12,33 -26,50 -53,64 -210,79 -320,32 -61,-26 -97,-61 -119,-115 -20,-48 -15,-86 28,-181 22,-50 31,-90 34,-140 2,-38 13,-101 24,-139 18,-60 29,-78 78,-125 49,-47 59,-63 64,-100 7,-52 53,-144 109,-219 40,-54 116,-102 163,-102 16,0 26,-16 48,-73 36,-94 46,-106 109,-128 48,-16 54,-21 67,-61 19,-60 55,-104 95,-118 40,-13 114,1 162,31 l 31,19 7,-32 c 10,-51 63,-124 103,-143 31,-15 44,-16 87,-6 27,6 64,23 82,36 l 32,25 21,-33 C 1430,32 1524,12 1605,96 l 41,42 18,-33 c 32,-59 70,-87 123,-92 65,-6 106,21 138,90 14,28 25,62 25,75"/>
    <path fill="none" stroke="var(--secondary-text-color, #9ca3af)" stroke-width="8" d="m 1954,195 c 2,3 4,5 6,5 6,0 10,-10 10,-22 1,-33 33,-99 63,-127 34,-31 103,-39 146,-16 18,9 46,38 63,65 l 30,48 31,-35 c 80,-91 165,-77 254,40 l 21,27 53,-27 c 36,-19 68,-28 101,-28 41,0 52,5 83,35 20,20 46,61 58,92 22,52 24,55 42,41 32,-23 123,-45 155,-38 44,10 87,58 106,120 16,50 20,54 55,60 21,4 49,15 62,26 21,16 60,94 81,162 3,9 15,17 28,17 99,1 239,167 270,318 12,54 18,64 55,91 67,48 113,163 113,281 0,42 9,77 35,137 63,145 40,230 -79,288 -59,29 -181,42 -241,26 -66,-17 -114,-57 -115,-94 0,-10 -8,-32 -17,-50 -12,-22 -16,-53 -15,-100 2,-65 0,-71 -33,-109 -39,-46 -65,-114 -65,-170 0,-32 -3,-38 -20,-38 -41,0 -87,-28 -110,-66 -13,-22 -47,-62 -77,-91 -36,-35 -53,-60 -53,-77 0,-17 -7,-27 -22,-31 -56,-17 -133,-124 -126,-174 4,-26 1,-30 -25,-35 -16,-3 -46,-23 -65,-43 -24,-26 -42,-37 -58,-35 -34,5 -76,-21 -132,-83 -47,-51 -54,-55 -96,-55 -70,0 -146,-19 -203,-51 -30,-17 -55,-25 -58,-19 -3,6 -27,10 -53,10 -63,0 -223,-20 -242,-30"/>
`;
const $84db147239ed44e7$var$ToothSVG4 = (sectorClassData)=>(0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)`
<svg class="tooth-svg" viewBox="0 0 392 395" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(0,395) scale(0.1,-0.1)" fill="none" stroke="var(--divider-color, #d1d5db)" stroke-width="4">
    <g id="zone-ur" class="${(0, $da98d0425d3716de$export$56cc687933817664)(sectorClassData.upper_right)}">
      <path class="zone" d="m 3816,2201 c 10,-49 -10,-185 -31,-217 -16,-25 -19,-26 -90,-19 -63,6 -79,4 -114,-14 -53,-27 -120,-28 -154,-1 -37,30 -87,122 -90,167 l -2,38 75,5 c 63,4 84,10 126,37 47,30 53,32 119,27 64,-5 72,-3 100,20 27,23 31,23 42,9 7,-9 16,-32 19,-52"/>
      <path class="zone" d="m 3767,2512 c 13,-33 18,-72 17,-131 -1,-84 -1,-84 -38,-118 -37,-34 -38,-34 -106,-27 -66,6 -70,5 -113,-26 -37,-26 -58,-33 -110,-37 -61,-5 -67,-4 -90,21 -30,32 -50,100 -50,171 0,59 14,85 45,85 10,0 57,16 104,35 55,23 100,35 132,35 59,0 114,15 144,39 29,24 41,15 65,-47"/>
      <path class="zone" d="m 3664,2829 c 33,-60 59,-163 52,-204 -11,-56 -42,-75 -152,-89 -59,-8 -116,-22 -141,-34 -22,-12 -60,-26 -83,-31 -38,-8 -45,-7 -65,14 -30,29 -55,113 -55,182 v 53 h 45 c 40,0 47,4 77,41 l 33,40 57,-6 c 86,-10 106,8 145,135 5,19 50,-33 87,-101"/>
      <path class="zone" d="m 3460,3210 c 74,-38 105,-110 98,-234 -5,-89 -33,-160 -67,-171 -11,-3 -37,-1 -58,4 -53,15 -50,16 -99,-34 -47,-49 -65,-53 -122,-29 -49,20 -90,60 -113,109 -25,55 -24,62 16,80 19,9 39,23 46,31 7,9 31,14 66,14 59,0 101,18 123,53 18,30 40,115 40,160 0,44 12,47 70,17"/>
      <path class="zone" d="m 3239,3470 c 113,-57 166,-229 117,-377 -25,-74 -52,-95 -134,-102 -48,-5 -76,-13 -96,-29 -51,-39 -97,-24 -127,41 -26,59 -24,68 25,119 59,62 87,138 93,253 2,50 6,96 8,103 6,19 71,14 114,-8"/>
      <path class="zone" d="m 2956,3694 c 68,-45 96,-77 127,-144 28,-62 29,-69 23,-153 -9,-121 -38,-207 -85,-257 -53,-56 -79,-54 -143,12 -27,28 -61,68 -74,88 -24,36 -25,39 -14,126 11,81 7,262 -6,306 -7,23 40,47 92,48 28,0 53,-8 80,-26"/>
      <path class="zone" d="m 2672,3794 c 23,-16 55,-46 72,-67 l 31,-39 v -183 c 0,-134 -3,-187 -13,-197 -17,-17 -182,21 -268,61 -96,45 -97,48 -84,248 7,92 13,168 13,169 89,40 106,44 155,41 38,-3 64,-12 94,-33"/>
      <path class="zone" d="m 2262,3918 c 21,-6 63,-34 93,-62 l 55,-51 -14,-193 c -8,-116 -19,-198 -26,-207 -10,-12 -38,-14 -164,-9 -167,6 -203,15 -217,53 -6,14 -13,93 -16,176 -5,132 -4,155 12,188 42,89 170,137 277,105"/>
    </g>
    <g id="zone-ul" class="${(0, $da98d0425d3716de$export$56cc687933817664)(sectorClassData.upper_left)}">
      <path class="zone" d="m 177,2244 c 35,-24 44,-25 104,-20 57,6 69,4 92,-14 43,-34 93,-50 157,-50 h 60 v -32 c -1,-46 -58,-148 -99,-175 -42,-29 -78,-29 -142,-2 -40,18 -62,21 -115,16 -77,-6 -100,8 -114,68 -18,77 -8,235 14,235 3,0 22,-12 43,-26"/>
      <path class="zone" d="m 235,2556 c 27,-19 55,-26 120,-31 62,-5 101,-15 145,-36 33,-15 76,-31 96,-35 45,-8 58,-38 51,-117 -7,-83 -43,-149 -86,-160 -48,-12 -125,8 -177,45 -43,31 -45,31 -95,20 -45,-11 -57,-10 -88,5 -20,10 -41,29 -48,43 -16,32 -17,166 -1,211 11,33 37,79 44,79 2,0 19,-11 39,-24"/>
      <path class="zone" d="m 360,2893 c 5,-22 23,-55 39,-72 29,-31 31,-32 93,-25 l 63,6 33,-41 c 28,-35 38,-41 71,-41 33,0 40,-4 45,-26 12,-48 -26,-186 -59,-214 -20,-17 -71,-8 -143,25 -35,16 -82,28 -122,31 -85,7 -144,28 -160,59 -21,39 -8,143 27,213 31,62 96,150 100,135"/>
      <path class="zone" d="m 570,3050 c 25,-49 64,-70 131,-70 40,0 58,-5 81,-25 16,-14 38,-25 49,-25 16,0 19,-4 13,-22 -30,-99 -103,-167 -181,-170 -31,-1 -41,5 -69,38 -33,39 -34,39 -106,39 h -73 l -25,50 c -34,69 -36,208 -2,272 23,44 59,74 107,90 l 30,10 12,-74 c 7,-41 22,-91 33,-113"/>
      <path class="zone" d="m 800,3436 c 0,-134 34,-239 101,-311 38,-41 41,-49 36,-82 -8,-46 -36,-85 -70,-97 -20,-7 -34,-4 -71,21 -25,17 -43,33 -40,36 -29,-9 -45,-8 -81,6 -56,21 -81,69 -94,173 -7,61 -5,81 12,135 25,77 45,109 89,142 35,27 99,46 130,38 13,-3 17,-15 17,-56"/>
      <path class="zone" d="m 1104,3717 29,-13 v -221 c 0,-186 -2,-225 -16,-246 -31,-48 -115,-126 -143,-133 -24,-6 -33,-1 -69,38 -55,61 -76,128 -82,259 -5,99 -4,109 21,161 30,63 88,121 150,149 48,22 70,23 110,6"/>
      <path class="zone" d="m 1447,3812 c 61,-20 59,-12 69,-230 8,-163 7,-165 -78,-208 -67,-34 -245,-76 -268,-64 -25,14 -35,134 -23,276 8,99 13,116 37,149 49,64 139,110 191,98 11,-3 43,-12 72,-21"/>
      <path class="zone" d="m 1815,3919 c 25,-7 58,-29 89,-60 l 48,-48 -4,-173 c -2,-110 -8,-181 -16,-195 -18,-32 -67,-41 -230,-45 -111,-2 -145,0 -151,11 -9,13 -16,94 -27,291 l -7,115 47,43 c 26,24 61,50 79,57 39,17 118,19 172,4"/>
    </g>
    <g id="zone-ll" class="${(0, $da98d0425d3716de$export$56cc687933817664)(sectorClassData.lower_left)}">
      <path class="zone" d="m 1795,439 c 60,-6 120,-15 133,-20 l 25,-10 -6,-107 C 1937,128 1904,51 1831,29 1757,7 1679,73 1649,184 c -16,59 -8,244 11,256 19,12 6,12 135,-1"/>
      <path class="zone" d="m 1476,495 c 43,-8 93,-25 113,-38 l 35,-24 2,-144 c 2,-129 0,-146 -18,-171 -23,-34 -67,-58 -103,-58 -64,0 -139,76 -162,163 -13,53 -18,268 -6,280 10,11 55,8 139,-8"/>
      <path class="zone" d="m 1237,611 c 77,-56 83,-70 76,-179 -3,-53 -1,-128 5,-166 13,-80 9,-89 -53,-117 -91,-42 -161,-10 -205,93 -20,47 -22,63 -16,144 8,115 27,180 65,222 38,41 74,42 128,3"/>
      <path class="zone" d="m 1053,715 c 18,-9 40,-27 51,-41 18,-25 18,-26 -2,-47 -36,-39 -62,-112 -71,-207 -6,-50 -16,-99 -23,-107 -21,-26 -90,-53 -135,-53 -33,0 -48,6 -71,30 -42,42 -66,119 -58,185 9,78 43,180 72,214 23,27 29,29 72,24 26,-3 63,0 82,5 48,14 48,14 83,-3"/>
      <path class="zone" d="m 761,934 c 28,-10 60,-13 87,-10 53,7 80,-9 122,-72 57,-86 34,-127 -70,-124 -30,0 -63,-1 -73,-4 -32,-10 -83,-134 -102,-248 -6,-38 -7,-38 -42,-33 -47,8 -61,22 -95,92 -23,49 -28,73 -28,134 0,111 18,197 48,233 42,50 81,58 153,32"/>
      <path class="zone" d="m 555,1201 c 114,-8 133,-16 171,-69 15,-20 49,-59 75,-87 80,-86 70,-132 -23,-99 -54,19 -128,18 -156,-2 -38,-26 -62,-88 -74,-194 L 536,650 h -29 c -62,0 -137,68 -200,181 -48,86 -60,141 -43,205 33,123 97,193 166,178 14,-3 70,-9 125,-13"/>
      <path class="zone" d="m 280,1454 c 33,-14 45,-14 70,-4 20,8 49,10 87,5 48,-6 63,-13 89,-41 34,-35 62,-105 66,-164 3,-35 3,-35 -37,-34 -22,1 -72,5 -111,9 l -71,8 -40,-36 c -37,-33 -56,-67 -83,-140 -9,-27 -10,-27 -39,-13 -64,34 -109,133 -118,261 -5,73 -3,83 17,109 25,31 72,55 107,56 13,0 41,-7 63,-16"/>
      <path class="zone" d="m 337,1759 c 72,-13 123,-47 123,-83 0,-12 6,-30 14,-41 20,-31 28,-73 20,-122 l -7,-45 -54,7 c -35,4 -65,2 -84,-5 -23,-10 -36,-10 -60,0 -66,28 -170,3 -198,-48 -7,-13 -15,-4 -36,43 -15,33 -29,76 -32,96 -14,98 63,176 197,199 25,4 47,8 49,9 2,0 33,-4 68,-10"/>
    </g>
    <g id="zone-lr" class="${(0, $da98d0425d3716de$export$56cc687933817664)(sectorClassData.lower_right)}">
      <path class="zone" d="m 2256,446 c 17,-13 19,-27 19,-133 0,-116 -1,-119 -35,-182 -45,-82 -90,-110 -150,-92 -78,23 -110,95 -117,267 l -6,122 41,7 c 48,8 166,22 203,24 14,0 34,-5 45,-13"/>
      <path class="zone" d="m 2581,498 c 17,-31 6,-242 -14,-290 C 2517,90 2431,42 2353,90 c -62,37 -68,58 -64,209 2,104 6,140 18,153 20,23 88,48 154,58 93,13 107,12 120,-12"/>
      <path class="zone" d="m 2803,623 c 39,-42 56,-92 67,-200 13,-122 -2,-183 -59,-243 -32,-34 -44,-40 -80,-40 -43,0 -107,27 -130,53 -9,12 -10,33 -1,98 7,47 8,118 5,168 l -7,87 57,52 c 68,62 105,69 148,25"/>
      <path class="zone" d="m 3014,724 c 58,-1 73,-5 87,-23 26,-32 57,-121 70,-199 10,-60 9,-73 -11,-124 -36,-96 -93,-126 -181,-96 -76,25 -85,39 -92,130 -7,96 -28,169 -64,216 -24,31 -24,34 -8,58 21,33 73,56 105,47 14,-4 56,-8 94,-9"/>
      <path class="zone" d="m 3277,940 c 40,-24 58,-58 72,-141 18,-107 14,-171 -15,-245 -29,-71 -68,-107 -113,-102 -22,3 -26,11 -38,73 -15,73 -53,167 -80,197 -12,13 -30,17 -77,16 -90,-2 -106,5 -106,51 0,26 9,51 29,78 44,60 66,73 120,67 28,-4 61,0 86,10 55,20 84,19 122,-4"/>
      <path class="zone" d="m 3570,1201 c 40,-29 81,-120 87,-192 5,-60 2,-70 -36,-145 -65,-130 -143,-204 -215,-204 -27,0 -29,5 -41,124 -7,79 -40,153 -76,171 -37,19 -107,19 -154,0 -20,-9 -45,-13 -56,-10 -37,12 -20,56 50,126 25,25 57,61 70,79 32,43 75,60 158,61 37,1 82,5 98,9 40,11 85,4 115,-19"/>
      <path class="zone" d="m 3750,1758 c 63,-19 117,-64 135,-113 20,-52 16,-82 -22,-167 l -26,-59 -32,31 c -44,43 -100,55 -160,34 -36,-12 -53,-13 -80,-4 -19,6 -54,8 -83,4 -46,-6 -50,-5 -55,17 -12,42 -7,105 8,125 8,10 15,27 15,37 1,92 152,140 300,95"/>
      <path class="zone" d="m 3756,1464 c 57,-27 73,-59 69,-136 -7,-123 -52,-234 -108,-268 -40,-25 -47,-25 -47,-2 0,32 -50,120 -87,153 -36,31 -38,31 -107,24 -39,-4 -89,-8 -111,-9 l -40,-1 2,44 c 3,53 48,148 83,173 34,24 112,34 158,19 31,-10 43,-10 72,3 45,20 74,20 116,0"/>
    </g>
    ${$84db147239ed44e7$var$OUTLINES}
  </g>
</svg>
`;
const $84db147239ed44e7$var$ToothSVG6 = (sectorClassData)=>(0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)`
<svg class="tooth-svg" viewBox="0 0 392 395" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(0,395) scale(0.1,-0.1)" fill="none" stroke="var(--divider-color, #d1d5db)" stroke-width="4">
    <g id="zone-ur" class="${(0, $da98d0425d3716de$export$56cc687933817664)(sectorClassData.upper_right)}">
      <path class="zone" d="m 3816,2201 c 10,-49 -10,-185 -31,-217 -16,-25 -19,-26 -90,-19 -63,6 -79,4 -114,-14 -53,-27 -120,-28 -154,-1 -37,30 -87,122 -90,167 l -2,38 75,5 c 63,4 84,10 126,37 47,30 53,32 119,27 64,-5 72,-3 100,20 27,23 31,23 42,9 7,-9 16,-32 19,-52"/>
      <path class="zone" d="m 3767,2512 c 13,-33 18,-72 17,-131 -1,-84 -1,-84 -38,-118 -37,-34 -38,-34 -106,-27 -66,6 -70,5 -113,-26 -37,-26 -58,-33 -110,-37 -61,-5 -67,-4 -90,21 -30,32 -50,100 -50,171 0,59 14,85 45,85 10,0 57,16 104,35 55,23 100,35 132,35 59,0 114,15 144,39 29,24 41,15 65,-47"/>
      <path class="zone" d="m 3664,2829 c 33,-60 59,-163 52,-204 -11,-56 -42,-75 -152,-89 -59,-8 -116,-22 -141,-34 -22,-12 -60,-26 -83,-31 -38,-8 -45,-7 -65,14 -30,29 -55,113 -55,182 v 53 h 45 c 40,0 47,4 77,41 l 33,40 57,-6 c 86,-10 106,8 145,135 5,19 50,-33 87,-101"/>
      <path class="zone" d="m 3460,3210 c 74,-38 105,-110 98,-234 -5,-89 -33,-160 -67,-171 -11,-3 -37,-1 -58,4 -53,15 -50,16 -99,-34 -47,-49 -65,-53 -122,-29 -49,20 -90,60 -113,109 -25,55 -24,62 16,80 19,9 39,23 46,31 7,9 31,14 66,14 59,0 101,18 123,53 18,30 40,115 40,160 0,44 12,47 70,17"/>
      <path class="zone" d="m 3239,3470 c 113,-57 166,-229 117,-377 -25,-74 -52,-95 -134,-102 -48,-5 -76,-13 -96,-29 -51,-39 -97,-24 -127,41 -26,59 -24,68 25,119 59,62 87,138 93,253 2,50 6,96 8,103 6,19 71,14 114,-8"/>
    </g>
    <g id="zone-uf" class="${(0, $da98d0425d3716de$export$56cc687933817664)(sectorClassData.upper_front)}">
      <path class="zone" d="m 2956,3694 c 68,-45 96,-77 127,-144 28,-62 29,-69 23,-153 -9,-121 -38,-207 -85,-257 -53,-56 -79,-54 -143,12 -27,28 -61,68 -74,88 -24,36 -25,39 -14,126 11,81 7,262 -6,306 -7,23 40,47 92,48 28,0 53,-8 80,-26"/>
      <path class="zone" d="m 2672,3794 c 23,-16 55,-46 72,-67 l 31,-39 v -183 c 0,-134 -3,-187 -13,-197 -17,-17 -182,21 -268,61 -96,45 -97,48 -84,248 7,92 13,168 13,169 89,40 106,44 155,41 38,-3 64,-12 94,-33"/>
      <path class="zone" d="m 2262,3918 c 21,-6 63,-34 93,-62 l 55,-51 -14,-193 c -8,-116 -19,-198 -26,-207 -10,-12 -38,-14 -164,-9 -167,6 -203,15 -217,53 -6,14 -13,93 -16,176 -5,132 -4,155 12,188 42,89 170,137 277,105"/>
      <path class="zone" d="m 1104,3717 29,-13 v -221 c 0,-186 -2,-225 -16,-246 -31,-48 -115,-126 -143,-133 -24,-6 -33,-1 -69,38 -55,61 -76,128 -82,259 -5,99 -4,109 21,161 30,63 88,121 150,149 48,22 70,23 110,6"/>
      <path class="zone" d="m 1447,3812 c 61,-20 59,-12 69,-230 8,-163 7,-165 -78,-208 -67,-34 -245,-76 -268,-64 -25,14 -35,134 -23,276 8,99 13,116 37,149 49,64 139,110 191,98 11,-3 43,-12 72,-21"/>
      <path class="zone" d="m 1815,3919 c 25,-7 58,-29 89,-60 l 48,-48 -4,-173 c -2,-110 -8,-181 -16,-195 -18,-32 -67,-41 -230,-45 -111,-2 -145,0 -151,11 -9,13 -16,94 -27,291 l -7,115 47,43 c 26,24 61,50 79,57 39,17 118,19 172,4"/>
    </g>
    <g id="zone-ul" class="${(0, $da98d0425d3716de$export$56cc687933817664)(sectorClassData.upper_left)}">
      <path class="zone" d="m 177,2244 c 35,-24 44,-25 104,-20 57,6 69,4 92,-14 43,-34 93,-50 157,-50 h 60 v -32 c -1,-46 -58,-148 -99,-175 -42,-29 -78,-29 -142,-2 -40,18 -62,21 -115,16 -77,-6 -100,8 -114,68 -18,77 -8,235 14,235 3,0 22,-12 43,-26"/>
      <path class="zone" d="m 235,2556 c 27,-19 55,-26 120,-31 62,-5 101,-15 145,-36 33,-15 76,-31 96,-35 45,-8 58,-38 51,-117 -7,-83 -43,-149 -86,-160 -48,-12 -125,8 -177,45 -43,31 -45,31 -95,20 -45,-11 -57,-10 -88,5 -20,10 -41,29 -48,43 -16,32 -17,166 -1,211 11,33 37,79 44,79 2,0 19,-11 39,-24"/>
      <path class="zone" d="m 360,2893 c 5,-22 23,-55 39,-72 29,-31 31,-32 93,-25 l 63,6 33,-41 c 28,-35 38,-41 71,-41 33,0 40,-4 45,-26 12,-48 -26,-186 -59,-214 -20,-17 -71,-8 -143,25 -35,16 -82,28 -122,31 -85,7 -144,28 -160,59 -21,39 -8,143 27,213 31,62 96,150 100,135"/>
      <path class="zone" d="m 570,3050 c 25,-49 64,-70 131,-70 40,0 58,-5 81,-25 16,-14 38,-25 49,-25 16,0 19,-4 13,-22 -30,-99 -103,-167 -181,-170 -31,-1 -41,5 -69,38 -33,39 -34,39 -106,39 h -73 l -25,50 c -34,69 -36,208 -2,272 23,44 59,74 107,90 l 30,10 12,-74 c 7,-41 22,-91 33,-113"/>
      <path class="zone" d="m 800,3436 c 0,-134 34,-239 101,-311 38,-41 41,-49 36,-82 -8,-46 -36,-85 -70,-97 -20,-7 -34,-4 -71,21 -25,17 -43,33 -40,36 -29,-9 -45,-8 -81,6 -56,21 -81,69 -94,173 -7,61 -5,81 12,135 25,77 45,109 89,142 35,27 99,46 130,38 13,-3 17,-15 17,-56"/>
    </g>
    <g id="zone-ll" class="${(0, $da98d0425d3716de$export$56cc687933817664)(sectorClassData.lower_left)}">
      <path class="zone" d="m 1053,715 c 18,-9 40,-27 51,-41 18,-25 18,-26 -2,-47 -36,-39 -62,-112 -71,-207 -6,-50 -16,-99 -23,-107 -21,-26 -90,-53 -135,-53 -33,0 -48,6 -71,30 -42,42 -66,119 -58,185 9,78 43,180 72,214 23,27 29,29 72,24 26,-3 63,0 82,5 48,14 48,14 83,-3"/>
      <path class="zone" d="m 761,934 c 28,-10 60,-13 87,-10 53,7 80,-9 122,-72 57,-86 34,-127 -70,-124 -30,0 -63,-1 -73,-4 -32,-10 -83,-134 -102,-248 -6,-38 -7,-38 -42,-33 -47,8 -61,22 -95,92 -23,49 -28,73 -28,134 0,111 18,197 48,233 42,50 81,58 153,32"/>
      <path class="zone" d="m 555,1201 c 114,-8 133,-16 171,-69 15,-20 49,-59 75,-87 80,-86 70,-132 -23,-99 -54,19 -128,18 -156,-2 -38,-26 -62,-88 -74,-194 L 536,650 h -29 c -62,0 -137,68 -200,181 -48,86 -60,141 -43,205 33,123 97,193 166,178 14,-3 70,-9 125,-13"/>
      <path class="zone" d="m 280,1454 c 33,-14 45,-14 70,-4 20,8 49,10 87,5 48,-6 63,-13 89,-41 34,-35 62,-105 66,-164 3,-35 3,-35 -37,-34 -22,1 -72,5 -111,9 l -71,8 -40,-36 c -37,-33 -56,-67 -83,-140 -9,-27 -10,-27 -39,-13 -64,34 -109,133 -118,261 -5,73 -3,83 17,109 25,31 72,55 107,56 13,0 41,-7 63,-16"/>
      <path class="zone" d="m 337,1759 c 72,-13 123,-47 123,-83 0,-12 6,-30 14,-41 20,-31 28,-73 20,-122 l -7,-45 -54,7 c -35,4 -65,2 -84,-5 -23,-10 -36,-10 -60,0 -66,28 -170,3 -198,-48 -7,-13 -15,-4 -36,43 -15,33 -29,76 -32,96 -14,98 63,176 197,199 25,4 47,8 49,9 2,0 33,-4 68,-10"/>
    </g>
    <g id="zone-lf" class="${(0, $da98d0425d3716de$export$56cc687933817664)(sectorClassData.lower_front)}">
      <path class="zone" d="m 1795,439 c 60,-6 120,-15 133,-20 l 25,-10 -6,-107 C 1937,128 1904,51 1831,29 1757,7 1679,73 1649,184 c -16,59 -8,244 11,256 19,12 6,12 135,-1"/>
      <path class="zone" d="m 1476,495 c 43,-8 93,-25 113,-38 l 35,-24 2,-144 c 2,-129 0,-146 -18,-171 -23,-34 -67,-58 -103,-58 -64,0 -139,76 -162,163 -13,53 -18,268 -6,280 10,11 55,8 139,-8"/>
      <path class="zone" d="m 1237,611 c 77,-56 83,-70 76,-179 -3,-53 -1,-128 5,-166 13,-80 9,-89 -53,-117 -91,-42 -161,-10 -205,93 -20,47 -22,63 -16,144 8,115 27,180 65,222 38,41 74,42 128,3"/>
      <path class="zone" d="m 2256,446 c 17,-13 19,-27 19,-133 0,-116 -1,-119 -35,-182 -45,-82 -90,-110 -150,-92 -78,23 -110,95 -117,267 l -6,122 41,7 c 48,8 166,22 203,24 14,0 34,-5 45,-13"/>
      <path class="zone" d="m 2581,498 c 17,-31 6,-242 -14,-290 C 2517,90 2431,42 2353,90 c -62,37 -68,58 -64,209 2,104 6,140 18,153 20,23 88,48 154,58 93,13 107,12 120,-12"/>
      <path class="zone" d="m 2803,623 c 39,-42 56,-92 67,-200 13,-122 -2,-183 -59,-243 -32,-34 -44,-40 -80,-40 -43,0 -107,27 -130,53 -9,12 -10,33 -1,98 7,47 8,118 5,168 l -7,87 57,52 c 68,62 105,69 148,25"/>
    </g>
    <g id="zone-lr" class="${(0, $da98d0425d3716de$export$56cc687933817664)(sectorClassData.lower_right)}">
      <path class="zone" d="m 3014,724 c 58,-1 73,-5 87,-23 26,-32 57,-121 70,-199 10,-60 9,-73 -11,-124 -36,-96 -93,-126 -181,-96 -76,25 -85,39 -92,130 -7,96 -28,169 -64,216 -24,31 -24,34 -8,58 21,33 73,56 105,47 14,-4 56,-8 94,-9"/>
      <path class="zone" d="m 3277,940 c 40,-24 58,-58 72,-141 18,-107 14,-171 -15,-245 -29,-71 -68,-107 -113,-102 -22,3 -26,11 -38,73 -15,73 -53,167 -80,197 -12,13 -30,17 -77,16 -90,-2 -106,5 -106,51 0,26 9,51 29,78 44,60 66,73 120,67 28,-4 61,0 86,10 55,20 84,19 122,-4"/>
      <path class="zone" d="m 3570,1201 c 40,-29 81,-120 87,-192 5,-60 2,-70 -36,-145 -65,-130 -143,-204 -215,-204 -27,0 -29,5 -41,124 -7,79 -40,153 -76,171 -37,19 -107,19 -154,0 -20,-9 -45,-13 -56,-10 -37,12 -20,56 50,126 25,25 57,61 70,79 32,43 75,60 158,61 37,1 82,5 98,9 40,11 85,4 115,-19"/>
      <path class="zone" d="m 3750,1758 c 63,-19 117,-64 135,-113 20,-52 16,-82 -22,-167 l -26,-59 -32,31 c -44,43 -100,55 -160,34 -36,-12 -53,-13 -80,-4 -19,6 -54,8 -83,4 -46,-6 -50,-5 -55,17 -12,42 -7,105 8,125 8,10 15,27 15,37 1,92 152,140 300,95"/>
      <path class="zone" d="m 3756,1464 c 57,-27 73,-59 69,-136 -7,-123 -52,-234 -108,-268 -40,-25 -47,-25 -47,-2 0,32 -50,120 -87,153 -36,31 -38,31 -107,24 -39,-4 -89,-8 -111,-9 l -40,-1 2,44 c 3,53 48,148 83,173 34,24 112,34 158,19 31,-10 43,-10 72,3 45,20 74,20 116,0"/>
    </g>
    ${$84db147239ed44e7$var$OUTLINES}
  </g>
</svg>
`;
const $84db147239ed44e7$export$d760b013da4dfa06 = (sectorClassData, numSectors = 4)=>{
    if (numSectors === 6) return $84db147239ed44e7$var$ToothSVG6(sectorClassData);
    return $84db147239ed44e7$var$ToothSVG4(sectorClassData);
};


const $3cb0a15594fd43d6$export$cd21dc7a72bbb52c = {
    bluetooth: 'M17.71 7.71L12 2h-1v7.59L6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 11 14.41V22h1l5.71-5.71-4.3-4.29 4.3-4.29zM13 5.83l1.88 1.88L13 9.59V5.83zm1.88 10.46L13 18.17v-3.76l1.88 1.88z',
    // Shown in place of the plain glyph while a session is running
    // (mdiBluetoothTransfer). The three connection states differ in weight
    // already, but a second cue that survives any theme is worth the one
    // extra path: weight says how present the connection is, shape says
    // whether anything is moving over it.
    bluetooth_transfer: 'M14.71,7.71L10.41,12L14.71,16.29L9,22H8V14.41L3.41,19L2,17.59L7.59,12L2,6.41L3.41,5L8,9.59V2H9L14.71,7.71M10,5.83V9.59L11.88,7.71L10,5.83M11.88,16.29L10,14.41V18.17L11.88,16.29M22,8H20V11H18V8H16L19,4L22,8M22,16L19,20L16,16H18V13H20V16H22Z',
    // And in place of it when there is no connection at all
    // (mdiBluetoothOff). Weight alone already told the three states apart, but
    // it needs a second icon to compare against and there is usually only one
    // on screen; shape stands on its own.
    bluetooth_off: 'M13,5.83L14.88,7.71L13.28,9.31L14.69,10.72L17.71,7.7L12,2H11V7.03L13,9.03M5.41,4L4,5.41L10.59,12L5,17.59L6.41,19L11,14.41V22H12L16.29,17.71L18.59,20L20,18.59M13,18.17V14.41L14.88,16.29',
    // The ESP bridge, in three states like Bluetooth beside it. The third one
    // is not a guess: philips_sonicare_ble only creates the bridge entity when
    // the transport actually is the bridge (binary_sensor.py), so a connected
    // handle means the bridge is carrying it.
    network: 'M15,20A1,1 0 0,0 14,19H13V17H17A2,2 0 0,0 19,15V5A2,2 0 0,0 17,3H7A2,2 0 0,0 5,5V15A2,2 0 0,0 7,17H11V19H10A1,1 0 0,0 9,20H2V22H9A1,1 0 0,0 10,23H14A1,1 0 0,0 15,22H22V20H15M7,15V5H17V15H7Z',
    network_active: 'M15,20A1,1 0 0,0 14,19H13V17H17A2,2 0 0,0 19,15V5A2,2 0 0,0 17,3H7A2,2 0 0,0 5,5V15A2,2 0 0,0 7,17H11V19H10A1,1 0 0,0 9,20H2V22H9A1,1 0 0,0 10,23H14A1,1 0 0,0 15,22H22V20H15M7,15V5H17V15H7M12,14L16,10H13V6H11V10H8L12,14Z',
    network_off: 'M1.04,5.27L5,9.23V15A2,2 0 0,0 7,17H11V19H10A1,1 0 0,0 9,20H2V22H9A1,1 0 0,0 10,23H14A1,1 0 0,0 15,22H17.77L19.77,24L21.04,22.72L2.32,4L1.04,5.27M7,11.23L10.77,15H7V11.23M15,20A1,1 0 0,0 14,19H13V17.23L15.77,20H15M22,20V21.14L20.86,20H22M7,6.14L5.14,4.28C5.43,3.53 6.16,3 7,3H17A2,2 0 0,1 19,5V15C19,15.85 18.47,16.57 17.72,16.86L15.86,15H17V5H7V6.14Z',
    // Charging station (mdiPowerPlug). Shown next to the Bluetooth icon when
    // the handle is paired with one — a path indicator, never a fault: a
    // station that is merely idle looks exactly like a working one.
    charger: 'M16,7V3H14V7H10V3H8V7H8C7,7 6,8 6,9V14.5L9.5,18V21H14.5V18L18,14.5V9C18,8 17,7 16,7Z'
};
const $3cb0a15594fd43d6$export$1e083828221390e5 = {
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
// --- Oral-B display face (FF0A), latched at the end of a session ------------
// oralb_live mirrors the handle's own display as `sensor.*_smiley`: `off`,
// `standard` and `special_2`..`special_11`. Raw paths rather than `mdi:` names
// so @mdi/js stays out of the bundle, matching CONN_ICONS above.
//
// The glyphs are standard MDI emoticons, not copies of what the handle draws.
// They name the tier a value falls into; the handle's own drawing for the same
// value differs between generations, so tracing one would be wrong on the
// other. Values still undecoded render a question mark plus their raw name,
// which is what turns every installed card into a reporter for issue #20 — a
// face would have to pick a mouth, and every mouth is a verdict we cannot back
// yet.
// MDI has no face with star eyes (mdi:star-face is a star-SHAPED face), so
// special_10 is drawn here: the standard outline ring and happy mouth with the
// eyes replaced by two 5-point stars, cut fat enough to read at 34 px.
const $3cb0a15594fd43d6$var$SMILEY_STAR_EYES = 'M12,2C6.47,2 2,6.47 2,12C2,17.53 6.47,22 12,22C17.53,22 22,17.53 22,12C22,6.47 17.53,2 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20ZM12,18C14.33,18 16.3,16.54 17.11,14.5H6.89C7.69,16.54 9.67,18 12,18ZM8.50,6.00L9.50,7.92L11.64,8.28L10.12,9.83L10.44,11.97L8.50,11.00L6.56,11.97L6.88,9.83L5.36,8.28L7.50,7.92ZM15.50,6.00L16.50,7.92L18.64,8.28L17.12,9.83L17.44,11.97L15.50,11.00L13.56,11.97L13.88,9.83L12.36,8.28L14.50,7.92Z';
// mdi:medal — special_11 is "time AND pressure fulfilled", a standard met, not
// a rank won, so deliberately not a podium or trophy.
const $3cb0a15594fd43d6$var$SMILEY_MEDAL = 'M20,2H4V4L9.81,8.36C6.14,9.57 4.14,13.53 5.35,17.2C6.56,20.87 10.5,22.87 14.19,21.66C17.86,20.45 19.86,16.5 18.65,12.82C17.95,10.71 16.3,9.05 14.19,8.36L20,4V2M14.94,19.5L12,17.78L9.06,19.5L9.84,16.17L7.25,13.93L10.66,13.64L12,10.5L13.34,13.64L16.75,13.93L14.16,16.17L14.94,19.5Z';
// mdi:emoticon-happy-outline
const $3cb0a15594fd43d6$var$SMILEY_HAPPY = 'M20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12M22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2A10,10 0 0,1 22,12M10,9.5C10,10.3 9.3,11 8.5,11C7.7,11 7,10.3 7,9.5C7,8.7 7.7,8 8.5,8C9.3,8 10,8.7 10,9.5M17,9.5C17,10.3 16.3,11 15.5,11C14.7,11 14,10.3 14,9.5C14,8.7 14.7,8 15.5,8C16.3,8 17,8.7 17,9.5M12,17.23C10.25,17.23 8.71,16.5 7.81,15.42L9.23,14C9.68,14.72 10.75,15.23 12,15.23C13.25,15.23 14.32,14.72 14.77,14L16.19,15.42C15.29,16.5 13.75,17.23 12,17.23Z';
// mdi:emoticon-neutral-outline
const $3cb0a15594fd43d6$var$SMILEY_NEUTRAL = 'M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M8.5,11A1.5,1.5 0 0,1 7,9.5A1.5,1.5 0 0,1 8.5,8A1.5,1.5 0 0,1 10,9.5A1.5,1.5 0 0,1 8.5,11M17,9.5A1.5,1.5 0 0,1 15.5,11A1.5,1.5 0 0,1 14,9.5A1.5,1.5 0 0,1 15.5,8A1.5,1.5 0 0,1 17,9.5M16,14V16H8V14H16Z';
// mdi:emoticon-sad-outline
const $3cb0a15594fd43d6$var$SMILEY_SAD = 'M20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12M22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2A10,10 0 0,1 22,12M15.5,8C16.3,8 17,8.7 17,9.5C17,10.3 16.3,11 15.5,11C14.7,11 14,10.3 14,9.5C14,8.7 14.7,8 15.5,8M10,9.5C10,10.3 9.3,11 8.5,11C7.7,11 7,10.3 7,9.5C7,8.7 7.7,8 8.5,8C9.3,8 10,8.7 10,9.5M12,14C13.75,14 15.29,14.72 16.19,15.81L14.77,17.23C14.32,16.5 13.25,16 12,16C10.75,16 9.68,16.5 9.23,17.23L7.81,15.81C8.71,14.72 10.25,14 12,14Z';
// mdi:help-circle-outline — the undecoded marker
const $3cb0a15594fd43d6$var$SMILEY_UNKNOWN = 'M11,18H13V16H11V18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,6A4,4 0 0,0 8,10H10A2,2 0 0,1 12,8A2,2 0 0,1 14,10C14,12 11,11.75 11,15H13C13,12.75 16,12.5 16,10A4,4 0 0,0 12,6Z';
const $3cb0a15594fd43d6$export$51416f8ac832a017 = {
    perfect: {
        path: $3cb0a15594fd43d6$var$SMILEY_MEDAL,
        color: 'green'
    },
    excellent: {
        path: $3cb0a15594fd43d6$var$SMILEY_STAR_EYES,
        color: 'green'
    },
    good: {
        path: $3cb0a15594fd43d6$var$SMILEY_HAPPY,
        color: 'green'
    },
    fair: {
        path: $3cb0a15594fd43d6$var$SMILEY_NEUTRAL,
        color: 'amber'
    },
    poor: {
        path: $3cb0a15594fd43d6$var$SMILEY_SAD,
        color: 'red'
    }
};
const $3cb0a15594fd43d6$export$8dd0e14f6e3f7b38 = {
    // `standard` is the bottom of the scale, not the everyday face it was
    // taken for. Measured 2026-08 on both handles: the value appears in the
    // second a session ends, holds the ~30 s the display stays lit and then
    // sleeps to `off`, exactly as every other result face does - and between
    // sessions the reading is `off`, never this. Three sessions under 30 s
    // produced it on an iO6 and an iO8 alike, each with a frowning handle
    // display. A capture from an earlier night shows it as the first rung
    // rather than a value beside the scale: within one session the face went
    // 0, 1, 2, 4, 5, 6 and never back.
    standard: 'poor',
    // 2–6 decoded 2026-08 from advertisement captures photographed against
    // the handle display, on an iO6 and an iO8 alike (issue #20). The value
    // only ever climbs within a session - six recorded sessions, not one step
    // back - so what is decoded is the order, and the tiers below follow it.
    //
    // Deliberately no seconds: the captures put the same value at 70 s and at
    // 81 s and two different values at 70 s on the two handles, so the handle
    // is weighing more than the clock. How far somebody got is what the value
    // reports; how long that took is not the same question.
    special_2: 'fair',
    special_3: 'fair',
    special_4: 'good',
    special_5: 'good',
    special_6: 'excellent',
    special_10: 'excellent',
    special_11: 'perfect'
};
const $3cb0a15594fd43d6$export$d36f2381693bb845 = (state)=>{
    if (!state || state === 'off') return null;
    return $3cb0a15594fd43d6$export$51416f8ac832a017[$3cb0a15594fd43d6$export$8dd0e14f6e3f7b38[state]] || {
        path: $3cb0a15594fd43d6$var$SMILEY_UNKNOWN,
        color: 'muted',
        code: state
    };
};


var $76eee68ef692a3c3$exports = {};
$76eee68ef692a3c3$exports = JSON.parse('{"conn_via_charger":"Live data via the charging station","conn_charger_paired":"Charging station paired","conn_bt_active":"Live data over Bluetooth","conn_bt_connected":"Bluetooth connected","conn_bt_charger_active":"Live data over Bluetooth to the charging station","conn_bt_charger_connected":"Bluetooth connected to the charging station","conn_bt_disconnected":"No Bluetooth connection","conn_bridge_online":"ESP bridge online","conn_bridge_active":"ESP bridge carrying live data","conn_bridge_offline":"ESP bridge offline","conn_device_info":"Device information","chip_battery":"Battery","chip_pressure":"Pressure","chip_intensity":"Intensity","chip_mode":"Mode","chip_score":"Score","chip_head":"Head","chip_head_days":"Head \xb7 days","chip_head_time":"Head \xb7 time","chip_head_type":"Head Type","session":"Session","complete":"Complete","done_title":"Brushing complete!","recap_source_live":"Watched this session end","recap_source_history":"Reconstructed from recorded history","recap_source_device":"Read from the brush\'s own record","recap_source_counted":"Counted by Home Assistant as you brushed","recap_source_reading":"Taken from the values left after the session","done_sextants":"All 6 sextants finished","done_quadrants":"All 4 quadrants finished","aborted_title":"Brushing stopped early","aborted_quadrants":"{x} of {y} quadrants finished","aborted_sextants":"{x} of {y} sextants finished","smiley_unknown_hint":"Unknown display face \u2014 please report it in issue #20","verdict_computed":"Worked out from the session, not shown by the brush","pressure_low":"Low","pressure_normal":"Normal","pressure_medium":"Medium","pressure_high":"High","pressure_button_pressed":"Button pressed","pressure_power_button_pressed":"Power button pressed","intensity_low":"Low","intensity_medium":"Medium","intensity_high":"High","status_idle":"Idle","status_running":"Running","status_charging":"Charging","status_selection_menu":"Selection Menu","status_initializing":"Connecting\u2026","status_unavailable":"Unavailable","status_unknown":"Unknown","status_off":"Off","status_standby":"Standby","status_run":"Running","status_charge":"Charging","status_shutdown":"Shutdown","status_post_brushing_statistics":"Summary","status_post_brushing_summary":"Summary","status_session_summary":"Summary","status_setup":"Setup","status_sleeping":"Sleeping","status_transport":"Transport","status_flight_menu":"Flight menu","status_charge_forbidden":"Charging blocked","status_final_test":"Final test","status_pcb_test":"PCB test","status_calibration_test":"Calibration test","zone_upper_right":"Upper right","zone_upper_front":"Upper front","zone_upper_left":"Upper left","zone_lower_left":"Lower left","zone_lower_front":"Lower front","zone_lower_right":"Lower right","mode_daily_clean":"Daily Clean","mode_deep_clean":"Deep Clean","mode_gum_care":"Gum Care","mode_intense":"Intense","mode_massage":"Massage","mode_off":"Off","mode_sensitive":"Sensitive","mode_settings":"Settings","mode_super_sensitive":"Super Sensitive","mode_tongue_clean":"Tongue Clean","mode_tongue_cleaning":"Tongue Clean","mode_turbo":"Turbo","mode_whiten":"Whiten","mode_whitening":"Whitening","mode_gentle_white":"Gentle White","mode_smart_adapt":"Smart Adapt","mode_unknown":"Unknown","mode_clean":"Clean","mode_white_plus":"White+","mode_gum_health":"Gum Health","mode_deep_clean_plus":"Deep Clean+","mode_tongue_care":"Tongue Care","config_device":"Device","config_title":"Title (Optional)","config_subtitle":"Show device name as subtitle","config_hold_duration":"Keep finished session for","config_show_verdict":"Show session verdict","config_device_recap":"Use the device\'s own record","config_history_recap":"Rebuild missed sessions from history","hold_until_next_session":"Until the next session","completed_just_now":"just now","completed_ago_minutes":"{n} min ago","completed_ago_hours":"{n} h ago","config_accent_color":"Accent color","config_accent_color_ring":"Leave empty to follow the brush\'s own ring color:","config_tooth_color":"Tooth color","config_tooth_colors":"Tooth colors","color_tooth":"Teeth","color_active":"Active","color_done":"Done","config_active_color":"Active sector color","config_done_color":"Completed sector color","config_num_sectors":"Number of sectors","config_sector_order":"Sector order","config_layout":"Layout","config_layout_hint":"Place each reading as a chip (top row, max 4) or a corner marker. Each reading can be used once.","config_layout_chips":"Chips (max. 4)","config_layout_chip":"Chip","config_layout_corners":"Corner markers","config_head_display":"Head value","head_display_remaining":"% remaining","head_display_used":"% used","head_display_sessions":"Sessions left","config_progress_size":"Progress bar size","progress_size_slim":"Slim (default)","progress_size_bold":"Bold","progress_size_xl":"Extra large","config_scale":"Scale (graphic, status & progress)","layout_none":"\u2014 None \u2014","pos_top_left":"Top left","pos_top_right":"Top right","pos_bottom_left":"Bottom left","pos_bottom_right":"Bottom right","config_show_header":"Show header","config_tooth_style":"Style","tooth_style_teeth":"Teeth ring (default)","tooth_style_none":"Hidden \u2014 large timer + progress bar","group_device":"Device","group_header":"Header","group_teeth":"Visualization","group_recap":"Session summary","config_show_recap":"Show session summary","group_sectors":"Sectors","group_value_display":"Value display","config_value_display_hint":"These settings only take effect while the reading is actually shown, i.e. placed as a chip or corner marker.","config_sector_mode_device":"Sectors reported by device","config_sector_mode_time":"Sectors calculated from routine time","config_sector_revisit_hint":"Note: some modes revisit specific zones (e.g. Sonicare White+ polishes the front teeth again). Reordering zones here can be confusing in those modes if the brush\'s start-quadrant preference isn\'t adjusted accordingly.","config_select_device":"Please enter the device id","device_not_found":"Toothbrush device not found \u2014 please pick your device in the card editor.","config_reset_all":"Reset all options","config_reset_all_confirm":"Reset all options to their defaults? The device selection is kept."}');


var $238d401f28c1db46$exports = {};
$238d401f28c1db46$exports = JSON.parse('{"conn_via_charger":"Live-Daten \xfcber die Ladestation","conn_charger_paired":"Ladestation gekoppelt","conn_bt_active":"Live-Daten \xfcber Bluetooth","conn_bt_connected":"Bluetooth verbunden","conn_bt_charger_active":"Live-Daten per Bluetooth an die Ladestation","conn_bt_charger_connected":"Per Bluetooth mit der Ladestation verbunden","conn_bt_disconnected":"Keine Bluetooth-Verbindung","conn_bridge_online":"ESP-Bridge online","conn_bridge_active":"ESP-Bridge \xfcbertr\xe4gt Daten","conn_bridge_offline":"ESP-Bridge offline","conn_device_info":"Ger\xe4teinformationen","chip_battery":"Akku","chip_pressure":"Druck","chip_intensity":"Intensit\xe4t","chip_mode":"Modus","chip_score":"Score","chip_head":"Kopf","chip_head_days":"Kopf \xb7 Tage","chip_head_time":"Kopf \xb7 Zeit","chip_head_type":"Kopftyp","session":"Sitzung","complete":"Fertig","done_title":"Putzen abgeschlossen!","recap_source_live":"Ende dieser Sitzung mitverfolgt","recap_source_history":"Aus dem Verlauf rekonstruiert","recap_source_device":"Aus dem Speicher der B\xfcrste gelesen","recap_source_counted":"Von Home Assistant beim Putzen mitgez\xe4hlt","recap_source_reading":"Aus den nach der Sitzung stehengebliebenen Werten","done_sextants":"Alle 6 Sextanten fertig","done_quadrants":"Alle 4 Quadranten fertig","aborted_title":"Putzen vorzeitig abgebrochen","aborted_quadrants":"{x} von {y} Quadranten fertig","aborted_sextants":"{x} von {y} Sextanten fertig","smiley_unknown_hint":"Unbekanntes Display-Gesicht \u2014 bitte in Issue #20 melden","verdict_computed":"Aus der Sitzung errechnet, nicht von der B\xfcrste angezeigt","pressure_low":"Niedrig","pressure_normal":"Normal","pressure_medium":"Mittel","pressure_high":"Hoch","pressure_button_pressed":"Taste gedr\xfcckt","pressure_power_button_pressed":"Power-Taste gedr\xfcckt","intensity_low":"Niedrig","intensity_medium":"Mittel","intensity_high":"Hoch","status_idle":"Bereit","status_running":"Putzen","status_charging":"Laden","status_selection_menu":"Auswahl","status_initializing":"Verbinde\u2026","status_unavailable":"Nicht verf\xfcgbar","status_unknown":"Unbekannt","status_off":"Aus","status_standby":"Bereit","status_run":"Putzen","status_charge":"Laden","status_shutdown":"Ausschalten","status_post_brushing_statistics":"Zusammenfassung","status_post_brushing_summary":"Zusammenfassung","status_session_summary":"Zusammenfassung","status_setup":"Einrichtung","status_sleeping":"Schlafmodus","status_transport":"Transportmodus","status_flight_menu":"Flugmodus-Men\xfc","status_charge_forbidden":"Laden gesperrt","status_final_test":"Endtest","status_pcb_test":"PCB-Test","status_calibration_test":"Kalibrierungstest","zone_upper_right":"Oben rechts","zone_upper_front":"Oben vorne","zone_upper_left":"Oben links","zone_lower_left":"Unten links","zone_lower_front":"Unten vorne","zone_lower_right":"Unten rechts","mode_daily_clean":"T\xe4gliche Reinigung","mode_deep_clean":"Tiefenreinigung","mode_gum_care":"Zahnfleischschutz","mode_intense":"Intensiv","mode_massage":"Massage","mode_off":"Aus","mode_sensitive":"Sensitiv","mode_settings":"Einstellungen","mode_super_sensitive":"Extrasensitiv","mode_tongue_clean":"Zungenreinigung","mode_tongue_cleaning":"Zungenreinigung","mode_turbo":"Turbo","mode_whiten":"Aufhellen","mode_whitening":"Aufhellung","mode_gentle_white":"Gentle White","mode_smart_adapt":"Smart Adapt","mode_unknown":"Unbekannt","mode_clean":"Reinigung","mode_white_plus":"White+","mode_gum_health":"Zahnfleischschutz","mode_deep_clean_plus":"Tiefenreinigung+","mode_tongue_care":"Zungenpflege","config_device":"Ger\xe4t","config_title":"Titel (Optional)","config_subtitle":"Ger\xe4tename als Untertitel anzeigen","config_hold_duration":"Abgeschlossene Sitzung anzeigen f\xfcr","config_show_verdict":"Sitzungsbewertung anzeigen","config_device_recap":"Aufzeichnung des Ger\xe4ts verwenden","config_history_recap":"Verpasste Sitzungen aus dem Verlauf rekonstruieren","hold_until_next_session":"Bis zur n\xe4chsten Sitzung","completed_just_now":"gerade eben","completed_ago_minutes":"vor {n} min","completed_ago_hours":"vor {n} Std.","config_accent_color":"Akzentfarbe","config_accent_color_ring":"Leer lassen, um der Ringfarbe der B\xfcrste zu folgen:","config_tooth_color":"Zahnfarbe","config_tooth_colors":"Zahn-Farben","color_tooth":"Z\xe4hne","color_active":"Aktiv","color_done":"Fertig","config_active_color":"Farbe aktiver Sektor","config_done_color":"Farbe fertiger Sektor","config_num_sectors":"Anzahl Sektoren","config_sector_order":"Sektorreihenfolge","config_layout":"Layout","config_layout_hint":"Jeden Wert als Chip (obere Reihe, max. 4) oder als Eck-Markierung platzieren. Jeder Wert nur einmal.","config_layout_chips":"Chips (max. 4)","config_layout_chip":"Chip","config_layout_corners":"Eck-Markierungen","config_head_display":"Kopf-Anzeige","head_display_remaining":"% verbleibend","head_display_used":"% verbraucht","head_display_sessions":"Verbleibende Sessions","config_progress_size":"Fortschrittsbalken-Gr\xf6\xdfe","progress_size_slim":"Schmal (Standard)","progress_size_bold":"Kr\xe4ftig","progress_size_xl":"Extra gro\xdf","config_scale":"Skalierung (Grafik, Status & Fortschritt)","layout_none":"\u2014 Keine \u2014","pos_top_left":"Oben links","pos_top_right":"Oben rechts","pos_bottom_left":"Unten links","pos_bottom_right":"Unten rechts","config_show_header":"Header anzeigen","config_tooth_style":"Stil","tooth_style_teeth":"Zahnkranz (Standard)","tooth_style_none":"Ausgeblendet \u2014 gro\xdfer Timer + Fortschrittsbalken","group_device":"Ger\xe4t","group_header":"Header","group_teeth":"Visualisierung","group_recap":"Sitzungs-Zusammenfassung","config_show_recap":"Sitzungs-Zusammenfassung anzeigen","group_sectors":"Sektoren","group_value_display":"Werte-Darstellung","config_value_display_hint":"Diese Einstellungen wirken nur, wenn der jeweilige Wert auch angezeigt wird, also als Chip oder Eck-Markierung platziert ist.","config_sector_mode_device":"Sektoren vom Ger\xe4t gemeldet","config_sector_mode_time":"Sektoren aus Putzzeit berechnet","config_sector_revisit_hint":"Hinweis: Manche Modi kehren zu bestimmten Zonen zur\xfcck (z.B. poliert Sonicare White+ die Frontz\xe4hne erneut). Eine abweichende Reihenfolge kann in diesen Modi verwirrend wirken, wenn der Startquadrant der B\xfcrste nicht entsprechend angepasst ist.","config_select_device":"Bitte Ger\xe4te-ID eingeben","device_not_found":"Zahnb\xfcrsten-Ger\xe4t nicht gefunden \u2014 bitte im Card-Editor ein Ger\xe4t ausw\xe4hlen.","config_reset_all":"Alle Optionen zur\xfccksetzen","config_reset_all_confirm":"Alle Optionen auf Standard zur\xfccksetzen? Die Ger\xe4teauswahl bleibt erhalten."}');


var $450b7740649a7c34$exports = {};
$450b7740649a7c34$exports = JSON.parse('{"conn_via_charger":"Live-gegevens via het oplaadstation","conn_charger_paired":"Oplaadstation gekoppeld","conn_bt_active":"Live-gegevens via Bluetooth","conn_bt_connected":"Bluetooth verbonden","conn_bt_charger_active":"Live data via Bluetooth naar het laadstation","conn_bt_charger_connected":"Via Bluetooth verbonden met het laadstation","conn_bt_disconnected":"Geen Bluetooth-verbinding","conn_bridge_online":"ESP-bridge online","conn_bridge_active":"ESP-bridge draagt live gegevens over","conn_bridge_offline":"ESP-bridge offline","conn_device_info":"Apparaatinformatie","chip_battery":"Batterij","chip_pressure":"Druk","chip_intensity":"Intensiteit","chip_mode":"Modus","chip_score":"Score","chip_head":"Kop","chip_head_days":"Kop \xb7 dagen","chip_head_time":"Kop \xb7 tijd","chip_head_type":"Koptype","session":"Sessie","complete":"Afgerond","done_title":"Klaar met poetsen!","recap_source_live":"Het einde van deze sessie is meegekeken","recap_source_history":"Gereconstrueerd uit de geschiedenis","recap_source_device":"Uit het geheugen van de borstel gelezen","recap_source_counted":"Door Home Assistant meegeteld tijdens het poetsen","recap_source_reading":"Afgeleid uit de waarden die na de sessie bleven staan","done_sextants":"Alle 6 sectoren afgerond","done_quadrants":"Alle 4 sectoren afgerond","aborted_title":"Poetsen voortijdig gestopt","aborted_quadrants":"{x} van {y} sectoren afgerond","aborted_sextants":"{x} van {y} sectoren afgerond","smiley_unknown_hint":"Onbekend displaygezicht \u2014 meld het in issue #20","verdict_computed":"Berekend uit de sessie, niet getoond door de borstel","pressure_low":"Laag","pressure_normal":"Normaal","pressure_medium":"Midden","pressure_high":"Hoog","pressure_button_pressed":"Knop ingedrukt","pressure_power_button_pressed":"Aan/uit-knop ingedrukt","intensity_low":"Laag","intensity_medium":"Midden","intensity_high":"Hoog","status_idle":"Rustend","status_running":"Draait","status_charging":"Opladen","status_selection_menu":"Selectie Menu","status_initializing":"Verbinden\u2026","status_unavailable":"Niet beschikbaar","status_unknown":"Onbekend","status_off":"Uit","status_standby":"Standby","status_run":"Draait","status_charge":"Laden","status_shutdown":"Afsluiten","status_post_brushing_statistics":"Samenvatting","status_post_brushing_summary":"Samenvatting","status_session_summary":"Samenvatting","status_setup":"Instellen","status_sleeping":"Slaapstand","status_transport":"Transport","status_flight_menu":"Vliegtuigmenu","status_charge_forbidden":"Opladen geblokkeerd","status_final_test":"Eindtest","status_pcb_test":"PCB-test","status_calibration_test":"Kalibratietest","zone_upper_right":"Boven rechts","zone_upper_front":"Boven voor","zone_upper_left":"Boven links","zone_lower_left":"Onder links","zone_lower_front":"Onder voor","zone_lower_right":"Onder rechts","mode_daily_clean":"Dagelijkse reiniging","mode_deep_clean":"Diepe reiniging","mode_gum_care":"Tandvlees verzorging","mode_intense":"Intens","mode_massage":"Massage","mode_off":"Uit","mode_sensitive":"Voorzichtig","mode_settings":"Instellingen","mode_super_sensitive":"Super voorzichtig","mode_tongue_clean":"Tong reiniging","mode_tongue_cleaning":"Tong reiniging","mode_turbo":"Turbo","mode_whiten":"Bleken","mode_whitening":"Bleken","mode_gentle_white":"Gentle White","mode_smart_adapt":"Smart Adapt","mode_unknown":"Onbekend","mode_clean":"Reinigen","mode_white_plus":"Bleek+","mode_gum_health":"Tandvlees gezondheid","mode_deep_clean_plus":"Diepe reiniging+","mode_tongue_care":"Tongreiniging","config_device":"Apparaat","config_title":"Titel (optioneel)","config_subtitle":"Toon apparaatnaam als onderschrift","config_hold_duration":"Voltooide sessie tonen gedurende","config_show_verdict":"Sessiebeoordeling tonen","config_device_recap":"Eigen registratie van het apparaat gebruiken","config_history_recap":"Gemiste sessies uit de geschiedenis herstellen","hold_until_next_session":"Tot de volgende sessie","completed_just_now":"zojuist","completed_ago_minutes":"{n} min geleden","completed_ago_hours":"{n} u geleden","config_accent_color":"Accentkleur","config_accent_color_ring":"Laat leeg om de ringkleur van de borstel te volgen:","config_tooth_color":"Tandkleur","config_tooth_colors":"Tandkleuren","color_tooth":"Tanden","color_active":"Actief","color_done":"Klaar","config_active_color":"Kleur actieve sector","config_done_color":"Kleur voltooide sector","config_num_sectors":"Aantal sectoren","config_sector_order":"Sectorvolgorde","config_layout":"Lay-out","config_layout_hint":"Plaats elke waarde als chip (bovenste rij, max. 4) of als hoek-markering. Elke waarde \xe9\xe9n keer.","config_layout_chips":"Chips (max. 4)","config_layout_chip":"Chip","config_layout_corners":"Hoek-markeringen","config_head_display":"Kop-waarde","head_display_remaining":"% resterend","head_display_used":"% gebruikt","head_display_sessions":"Resterende sessies","config_progress_size":"Voortgangsbalk-grootte","progress_size_slim":"Smal (standaard)","progress_size_bold":"Dik","progress_size_xl":"Extra groot","config_scale":"Schaal (weergave, status & voortgang)","layout_none":"\u2014 Geen \u2014","pos_top_left":"Linksboven","pos_top_right":"Rechtsboven","pos_bottom_left":"Linksonder","pos_bottom_right":"Rechtsonder","config_show_header":"Koptekst tonen","config_tooth_style":"Stijl","tooth_style_teeth":"Tandenring (standaard)","tooth_style_none":"Verborgen \u2014 grote timer + voortgangsbalk","group_device":"Apparaat","group_header":"Koptekst","group_teeth":"Visualisatie","group_recap":"Sessieoverzicht","config_show_recap":"Sessieoverzicht tonen","group_sectors":"Sectoren","group_value_display":"Waardeweergave","config_value_display_hint":"Deze instellingen gelden alleen wanneer de waarde ook wordt weergegeven, dus geplaatst als chip of hoek-markering.","config_sector_mode_device":"Sectoren gerapporteerd door apparaat","config_sector_mode_time":"Sectoren berekend op basis van routine tijd","config_sector_revisit_hint":"Let op: sommige modi bezoeken bepaalde zones opnieuw (bijv. Sonicare White+ poetst de voortanden nogmaals). Een afwijkende volgorde kan in die modi verwarrend zijn als de startkwadrant-voorkeur van de borstel niet wordt aangepast.","config_select_device":"Vul het apparaat-id in","device_not_found":"Tandenborstel-apparaat niet gevonden \u2014 kies je apparaat in de kaart-editor.","config_reset_all":"Alle opties resetten","config_reset_all_confirm":"Alle opties terugzetten naar standaard? De apparaatkeuze blijft behouden."}');


var $23fa3c3f63e48c30$exports = {};
$23fa3c3f63e48c30$exports = JSON.parse('{"conn_via_charger":"\u0414\u0430\u043D\u043D\u044B\u0435 \u0432 \u0440\u0435\u0430\u043B\u044C\u043D\u043E\u043C \u0432\u0440\u0435\u043C\u0435\u043D\u0438 \u0447\u0435\u0440\u0435\u0437 \u0437\u0430\u0440\u044F\u0434\u043D\u0443\u044E \u0441\u0442\u0430\u043D\u0446\u0438\u044E","conn_charger_paired":"\u0417\u0430\u0440\u044F\u0434\u043D\u0430\u044F \u0441\u0442\u0430\u043D\u0446\u0438\u044F \u0441\u043E\u043F\u0440\u044F\u0436\u0435\u043D\u0430","conn_bt_active":"\u0414\u0430\u043D\u043D\u044B\u0435 \u0432 \u0440\u0435\u0430\u043B\u044C\u043D\u043E\u043C \u0432\u0440\u0435\u043C\u0435\u043D\u0438 \u043F\u043E Bluetooth","conn_bt_connected":"Bluetooth \u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0451\u043D","conn_bt_charger_active":"\u0414\u0430\u043D\u043D\u044B\u0435 \u043F\u0435\u0440\u0435\u0434\u0430\u044E\u0442\u0441\u044F \u043F\u043E Bluetooth \u043D\u0430 \u0437\u0430\u0440\u044F\u0434\u043D\u0443\u044E \u0441\u0442\u0430\u043D\u0446\u0438\u044E","conn_bt_charger_connected":"Bluetooth \u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0451\u043D \u043A \u0437\u0430\u0440\u044F\u0434\u043D\u043E\u0439 \u0441\u0442\u0430\u043D\u0446\u0438\u0438","conn_bt_disconnected":"\u041D\u0435\u0442 \u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u044F \u043F\u043E Bluetooth","conn_bridge_online":"ESP-\u043C\u043E\u0441\u0442 \u0432 \u0441\u0435\u0442\u0438","conn_bridge_active":"ESP-\u043C\u043E\u0441\u0442 \u043F\u0435\u0440\u0435\u0434\u0430\u0451\u0442 \u0434\u0430\u043D\u043D\u044B\u0435","conn_bridge_offline":"ESP-\u043C\u043E\u0441\u0442 \u043D\u0435 \u0432 \u0441\u0435\u0442\u0438","conn_device_info":"\u0418\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u044F \u043E\u0431 \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u0435","chip_battery":"\u0411\u0430\u0442\u0430\u0440\u0435\u044F","chip_pressure":"\u041D\u0430\u0436\u0438\u043C","chip_intensity":"\u0418\u043D\u0442\u0435\u043D\u0441\u0438\u0432\u043D\u043E\u0441\u0442\u044C","chip_mode":"\u0420\u0435\u0436\u0438\u043C","chip_score":"\u041E\u0446\u0435\u043D\u043A\u0430","chip_head":"\u041D\u0430\u0441\u0430\u0434\u043A\u0430","chip_head_days":"\u041D\u0430\u0441\u0430\u0434\u043A\u0430 \xb7 \u0434\u043D\u0438","chip_head_time":"\u041D\u0430\u0441\u0430\u0434\u043A\u0430 \xb7 \u0432\u0440\u0435\u043C\u044F","chip_head_type":"\u0422\u0438\u043F \u043D\u0430\u0441\u0430\u0434\u043A\u0438","session":"\u0421\u0435\u0430\u043D\u0441","complete":"\u0413\u043E\u0442\u043E\u0432\u043E","done_title":"\u0427\u0438\u0441\u0442\u043A\u0430 \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u0430!","recap_source_live":"\u0417\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u0438\u0435 \u0441\u0435\u0430\u043D\u0441\u0430 \u043E\u0442\u0441\u043B\u0435\u0436\u0435\u043D\u043E","recap_source_history":"\u0412\u043E\u0441\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u043E \u0438\u0437 \u0438\u0441\u0442\u043E\u0440\u0438\u0438","recap_source_device":"\u041F\u0440\u043E\u0447\u0438\u0442\u0430\u043D\u043E \u0438\u0437 \u043F\u0430\u043C\u044F\u0442\u0438 \u0449\u0451\u0442\u043A\u0438","recap_source_counted":"\u041F\u043E\u0434\u0441\u0447\u0438\u0442\u0430\u043D\u043E Home Assistant \u0432\u043E \u0432\u0440\u0435\u043C\u044F \u0447\u0438\u0441\u0442\u043A\u0438","recap_source_reading":"\u041E\u043F\u0440\u0435\u0434\u0435\u043B\u0435\u043D\u043E \u043F\u043E \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u044F\u043C, \u043E\u0441\u0442\u0430\u0432\u0448\u0438\u043C\u0441\u044F \u043F\u043E\u0441\u043B\u0435 \u0447\u0438\u0441\u0442\u043A\u0438","done_sextants":"\u0412\u0441\u0435 6 \u0441\u0435\u043A\u0441\u0442\u0430\u043D\u0442\u043E\u0432 \u0433\u043E\u0442\u043E\u0432\u044B","done_quadrants":"\u0412\u0441\u0435 4 \u043A\u0432\u0430\u0434\u0440\u0430\u043D\u0442\u0430 \u0433\u043E\u0442\u043E\u0432\u044B","aborted_title":"\u0427\u0438\u0441\u0442\u043A\u0430 \u043F\u0440\u0435\u0440\u0432\u0430\u043D\u0430 \u0440\u0430\u043D\u044C\u0448\u0435 \u0432\u0440\u0435\u043C\u0435\u043D\u0438","aborted_quadrants":"{x} \u0438\u0437 {y} \u043A\u0432\u0430\u0434\u0440\u0430\u043D\u0442\u043E\u0432 \u0433\u043E\u0442\u043E\u0432\u043E","aborted_sextants":"{x} \u0438\u0437 {y} \u0441\u0435\u043A\u0441\u0442\u0430\u043D\u0442\u043E\u0432 \u0433\u043E\u0442\u043E\u0432\u043E","smiley_unknown_hint":"\u041D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u043E\u0435 \u0432\u044B\u0440\u0430\u0436\u0435\u043D\u0438\u0435 \u043D\u0430 \u0434\u0438\u0441\u043F\u043B\u0435\u0435 \u2014 \u0441\u043E\u043E\u0431\u0449\u0438\u0442\u0435 \u0432 issue #20","verdict_computed":"\u0420\u0430\u0441\u0441\u0447\u0438\u0442\u0430\u043D\u043E \u043F\u043E \u0441\u0435\u0430\u043D\u0441\u0443, \u0430 \u043D\u0435 \u043F\u043E\u043A\u0430\u0437\u0430\u043D\u043E \u0449\u0451\u0442\u043A\u043E\u0439","pressure_low":"\u0421\u043B\u0430\u0431\u044B\u0439","pressure_normal":"\u041D\u043E\u0440\u043C\u0430\u043B\u044C\u043D\u044B\u0439","pressure_medium":"\u0421\u0440\u0435\u0434\u043D\u0438\u0439","pressure_high":"\u0421\u0438\u043B\u044C\u043D\u044B\u0439","pressure_button_pressed":"\u041D\u0430\u0436\u0430\u0442\u0430 \u043A\u043D\u043E\u043F\u043A\u0430","pressure_power_button_pressed":"\u041D\u0430\u0436\u0430\u0442\u0430 \u043A\u043D\u043E\u043F\u043A\u0430 \u043F\u0438\u0442\u0430\u043D\u0438\u044F","intensity_low":"\u041D\u0438\u0437\u043A\u0430\u044F","intensity_medium":"\u0421\u0440\u0435\u0434\u043D\u044F\u044F","intensity_high":"\u0412\u044B\u0441\u043E\u043A\u0430\u044F","status_idle":"\u041E\u0436\u0438\u0434\u0430\u043D\u0438\u0435","status_running":"\u0427\u0438\u0441\u0442\u043A\u0430","status_charging":"\u0417\u0430\u0440\u044F\u0434\u043A\u0430","status_selection_menu":"\u041C\u0435\u043D\u044E \u0432\u044B\u0431\u043E\u0440\u0430","status_initializing":"\u041F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435\u2026","status_unavailable":"\u041D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u043D\u043E","status_unknown":"\u041D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u043E","status_off":"\u0412\u044B\u043A\u043B.","status_standby":"\u041E\u0436\u0438\u0434\u0430\u043D\u0438\u0435","status_run":"\u0427\u0438\u0441\u0442\u043A\u0430","status_charge":"\u0417\u0430\u0440\u044F\u0434\u043A\u0430","status_shutdown":"\u0412\u044B\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435","status_post_brushing_statistics":"\u0418\u0442\u043E\u0433\u0438 \u0447\u0438\u0441\u0442\u043A\u0438","status_post_brushing_summary":"\u0418\u0442\u043E\u0433\u0438 \u0447\u0438\u0441\u0442\u043A\u0438","status_session_summary":"\u0418\u0442\u043E\u0433\u0438 \u0447\u0438\u0441\u0442\u043A\u0438","status_setup":"\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430","status_sleeping":"\u0421\u043F\u044F\u0449\u0438\u0439 \u0440\u0435\u0436\u0438\u043C","status_transport":"\u0422\u0440\u0430\u043D\u0441\u043F\u043E\u0440\u0442\u043D\u044B\u0439 \u0440\u0435\u0436\u0438\u043C","status_flight_menu":"\u041C\u0435\u043D\u044E \u043F\u043E\u043B\u0451\u0442\u0430","status_charge_forbidden":"\u0417\u0430\u0440\u044F\u0434\u043A\u0430 \u0437\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u043D\u0430","status_final_test":"\u0424\u0438\u043D\u0430\u043B\u044C\u043D\u044B\u0439 \u0442\u0435\u0441\u0442","status_pcb_test":"\u0422\u0435\u0441\u0442 \u043F\u043B\u0430\u0442\u044B","status_calibration_test":"\u0422\u0435\u0441\u0442 \u043A\u0430\u043B\u0438\u0431\u0440\u043E\u0432\u043A\u0438","zone_upper_right":"\u0421\u0432\u0435\u0440\u0445\u0443 \u0441\u043F\u0440\u0430\u0432\u0430","zone_upper_front":"\u0421\u0432\u0435\u0440\u0445\u0443 \u0441\u043F\u0435\u0440\u0435\u0434\u0438","zone_upper_left":"\u0421\u0432\u0435\u0440\u0445\u0443 \u0441\u043B\u0435\u0432\u0430","zone_lower_left":"\u0421\u043D\u0438\u0437\u0443 \u0441\u043B\u0435\u0432\u0430","zone_lower_front":"\u0421\u043D\u0438\u0437\u0443 \u0441\u043F\u0435\u0440\u0435\u0434\u0438","zone_lower_right":"\u0421\u043D\u0438\u0437\u0443 \u0441\u043F\u0440\u0430\u0432\u0430","mode_daily_clean":"\u0415\u0436\u0435\u0434\u043D\u0435\u0432\u043D\u0430\u044F \u0447\u0438\u0441\u0442\u043A\u0430","mode_deep_clean":"\u0413\u043B\u0443\u0431\u043E\u043A\u0430\u044F \u0447\u0438\u0441\u0442\u043A\u0430","mode_gum_care":"\u0423\u0445\u043E\u0434 \u0437\u0430 \u0434\u0451\u0441\u043D\u0430\u043C\u0438","mode_intense":"\u0418\u043D\u0442\u0435\u043D\u0441\u0438\u0432\u043D\u044B\u0439","mode_massage":"\u041C\u0430\u0441\u0441\u0430\u0436","mode_off":"\u0412\u044B\u043A\u043B.","mode_sensitive":"\u0411\u0435\u0440\u0435\u0436\u043D\u044B\u0439","mode_settings":"\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438","mode_super_sensitive":"\u0421\u0443\u043F\u0435\u0440\u0431\u0435\u0440\u0435\u0436\u043D\u044B\u0439","mode_tongue_clean":"\u0427\u0438\u0441\u0442\u043A\u0430 \u044F\u0437\u044B\u043A\u0430","mode_tongue_cleaning":"\u0427\u0438\u0441\u0442\u043A\u0430 \u044F\u0437\u044B\u043A\u0430","mode_turbo":"\u0422\u0443\u0440\u0431\u043E","mode_whiten":"\u041E\u0442\u0431\u0435\u043B\u0438\u0432\u0430\u043D\u0438\u0435","mode_whitening":"\u041E\u0442\u0431\u0435\u043B\u0438\u0432\u0430\u043D\u0438\u0435","mode_gentle_white":"Gentle White","mode_smart_adapt":"Smart Adapt","mode_unknown":"\u041D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u044B\u0439","mode_clean":"\u0427\u0438\u0441\u0442\u043A\u0430","mode_white_plus":"White+","mode_gum_health":"\u0417\u0434\u043E\u0440\u043E\u0432\u044C\u0435 \u0434\u0451\u0441\u0435\u043D","mode_deep_clean_plus":"\u0413\u043B\u0443\u0431\u043E\u043A\u0430\u044F \u0447\u0438\u0441\u0442\u043A\u0430+","mode_tongue_care":"\u0423\u0445\u043E\u0434 \u0437\u0430 \u044F\u0437\u044B\u043A\u043E\u043C","config_device":"\u0423\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u043E","config_title":"\u0417\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A (\u043D\u0435\u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u043E)","config_subtitle":"\u041F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0442\u044C \u0438\u043C\u044F \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u0430 \u043A\u0430\u043A \u043F\u043E\u0434\u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A","config_hold_duration":"\u041F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0442\u044C \u0437\u0430\u0432\u0435\u0440\u0448\u0451\u043D\u043D\u044B\u0439 \u0441\u0435\u0430\u043D\u0441","config_show_verdict":"\u041F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0442\u044C \u043E\u0446\u0435\u043D\u043A\u0443 \u0441\u0435\u0430\u043D\u0441\u0430","config_device_recap":"\u0418\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u044C \u0437\u0430\u043F\u0438\u0441\u044C \u0441\u0430\u043C\u043E\u0433\u043E \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u0430","config_history_recap":"\u0412\u043E\u0441\u0441\u0442\u0430\u043D\u0430\u0432\u043B\u0438\u0432\u0430\u0442\u044C \u043F\u0440\u043E\u043F\u0443\u0449\u0435\u043D\u043D\u044B\u0435 \u0441\u0435\u0430\u043D\u0441\u044B \u0438\u0437 \u0438\u0441\u0442\u043E\u0440\u0438\u0438","hold_until_next_session":"\u0414\u043E \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0435\u0433\u043E \u0441\u0435\u0430\u043D\u0441\u0430","completed_just_now":"\u0442\u043E\u043B\u044C\u043A\u043E \u0447\u0442\u043E","completed_ago_minutes":"{n} \u043C\u0438\u043D \u043D\u0430\u0437\u0430\u0434","completed_ago_hours":"{n} \u0447 \u043D\u0430\u0437\u0430\u0434","config_accent_color":"\u0410\u043A\u0446\u0435\u043D\u0442\u043D\u044B\u0439 \u0446\u0432\u0435\u0442","config_accent_color_ring":"\u041E\u0441\u0442\u0430\u0432\u044C\u0442\u0435 \u043F\u0443\u0441\u0442\u044B\u043C, \u0447\u0442\u043E\u0431\u044B \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u044C \u0446\u0432\u0435\u0442 \u043A\u043E\u043B\u044C\u0446\u0430 \u0449\u0451\u0442\u043A\u0438:","config_tooth_color":"\u0426\u0432\u0435\u0442 \u0437\u0443\u0431\u043E\u0432","config_tooth_colors":"\u0426\u0432\u0435\u0442\u0430 \u0437\u0443\u0431\u043E\u0432","color_tooth":"\u0417\u0443\u0431\u044B","color_active":"\u0410\u043A\u0442\u0438\u0432\u043D\u044B\u0439","color_done":"\u0413\u043E\u0442\u043E\u0432\u044B\u0439","config_active_color":"\u0426\u0432\u0435\u0442 \u0430\u043A\u0442\u0438\u0432\u043D\u043E\u0433\u043E \u0441\u0435\u043A\u0442\u043E\u0440\u0430","config_done_color":"\u0426\u0432\u0435\u0442 \u0437\u0430\u0432\u0435\u0440\u0448\u0451\u043D\u043D\u043E\u0433\u043E \u0441\u0435\u043A\u0442\u043E\u0440\u0430","config_num_sectors":"\u0427\u0438\u0441\u043B\u043E \u0441\u0435\u043A\u0442\u043E\u0440\u043E\u0432","config_sector_order":"\u041F\u043E\u0440\u044F\u0434\u043E\u043A \u0441\u0435\u043A\u0442\u043E\u0440\u043E\u0432","config_layout":"\u041C\u0430\u043A\u0435\u0442","config_layout_hint":"\u0420\u0430\u0437\u043C\u0435\u0441\u0442\u0438\u0442\u0435 \u043A\u0430\u0436\u0434\u043E\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435 \u043A\u0430\u043A \u0447\u0438\u043F (\u0432\u0435\u0440\u0445\u043D\u0438\u0439 \u0440\u044F\u0434, \u043C\u0430\u043A\u0441. 4) \u0438\u043B\u0438 \u043A\u0430\u043A \u0443\u0433\u043B\u043E\u0432\u043E\u0439 \u043C\u0430\u0440\u043A\u0435\u0440. \u041A\u0430\u0436\u0434\u043E\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435 \u043C\u043E\u0436\u043D\u043E \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u044C \u043E\u0434\u0438\u043D \u0440\u0430\u0437.","config_layout_chips":"\u0427\u0438\u043F\u044B (\u043C\u0430\u043A\u0441. 4)","config_layout_chip":"\u0427\u0438\u043F","config_layout_corners":"\u0423\u0433\u043B\u043E\u0432\u044B\u0435 \u043C\u0430\u0440\u043A\u0435\u0440\u044B","config_head_display":"\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u0435\u043B\u044C \u043D\u0430\u0441\u0430\u0434\u043A\u0438","head_display_remaining":"% \u043E\u0441\u0442\u0430\u043B\u043E\u0441\u044C","head_display_used":"% \u0438\u0437\u0440\u0430\u0441\u0445\u043E\u0434\u043E\u0432\u0430\u043D\u043E","head_display_sessions":"\u041E\u0441\u0442\u0430\u043B\u043E\u0441\u044C \u0441\u0435\u0430\u043D\u0441\u043E\u0432","config_progress_size":"\u0420\u0430\u0437\u043C\u0435\u0440 \u0438\u043D\u0434\u0438\u043A\u0430\u0442\u043E\u0440\u0430 \u043F\u0440\u043E\u0433\u0440\u0435\u0441\u0441\u0430","progress_size_slim":"\u0422\u043E\u043D\u043A\u0438\u0439 (\u043F\u043E \u0443\u043C\u043E\u043B\u0447\u0430\u043D\u0438\u044E)","progress_size_bold":"\u0422\u043E\u043B\u0441\u0442\u044B\u0439","progress_size_xl":"\u041E\u0447\u0435\u043D\u044C \u0431\u043E\u043B\u044C\u0448\u043E\u0439","config_scale":"\u041C\u0430\u0441\u0448\u0442\u0430\u0431 (\u0433\u0440\u0430\u0444\u0438\u043A\u0430, \u0441\u0442\u0430\u0442\u0443\u0441 \u0438 \u043F\u0440\u043E\u0433\u0440\u0435\u0441\u0441)","layout_none":"\u2014 \u041D\u0435\u0442 \u2014","pos_top_left":"\u0421\u0432\u0435\u0440\u0445\u0443 \u0441\u043B\u0435\u0432\u0430","pos_top_right":"\u0421\u0432\u0435\u0440\u0445\u0443 \u0441\u043F\u0440\u0430\u0432\u0430","pos_bottom_left":"\u0421\u043D\u0438\u0437\u0443 \u0441\u043B\u0435\u0432\u0430","pos_bottom_right":"\u0421\u043D\u0438\u0437\u0443 \u0441\u043F\u0440\u0430\u0432\u0430","config_show_header":"\u041F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0442\u044C \u0448\u0430\u043F\u043A\u0443","config_tooth_style":"\u0421\u0442\u0438\u043B\u044C","tooth_style_teeth":"\u0417\u0443\u0431\u043D\u043E\u0439 \u0440\u044F\u0434 (\u043F\u043E \u0443\u043C\u043E\u043B\u0447\u0430\u043D\u0438\u044E)","tooth_style_none":"\u0421\u043A\u0440\u044B\u0442\u043E \u2014 \u0431\u043E\u043B\u044C\u0448\u043E\u0439 \u0442\u0430\u0439\u043C\u0435\u0440 + \u0438\u043D\u0434\u0438\u043A\u0430\u0442\u043E\u0440 \u043F\u0440\u043E\u0433\u0440\u0435\u0441\u0441\u0430","group_device":"\u0423\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u043E","group_header":"\u0428\u0430\u043F\u043A\u0430","group_teeth":"\u0412\u0438\u0437\u0443\u0430\u043B\u0438\u0437\u0430\u0446\u0438\u044F","group_recap":"\u0418\u0442\u043E\u0433\u0438 \u0441\u0435\u0430\u043D\u0441\u0430","config_show_recap":"\u041F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0442\u044C \u0438\u0442\u043E\u0433\u0438 \u0441\u0435\u0430\u043D\u0441\u0430","group_sectors":"\u0421\u0435\u043A\u0442\u043E\u0440\u044B","group_value_display":"\u041E\u0442\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0439","config_value_display_hint":"\u042D\u0442\u0438 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u0434\u0435\u0439\u0441\u0442\u0432\u0443\u044E\u0442, \u0442\u043E\u043B\u044C\u043A\u043E \u0435\u0441\u043B\u0438 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435 \u043E\u0442\u043E\u0431\u0440\u0430\u0436\u0430\u0435\u0442\u0441\u044F \u2014 \u0442\u043E \u0435\u0441\u0442\u044C \u0440\u0430\u0437\u043C\u0435\u0449\u0435\u043D\u043E \u043A\u0430\u043A \u0447\u0438\u043F \u0438\u043B\u0438 \u0443\u0433\u043B\u043E\u0432\u043E\u0439 \u043C\u0430\u0440\u043A\u0435\u0440.","config_sector_mode_device":"\u0421\u0435\u043A\u0442\u043E\u0440\u044B \u0441\u043E\u043E\u0431\u0449\u0430\u0435\u0442 \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u043E","config_sector_mode_time":"\u0421\u0435\u043A\u0442\u043E\u0440\u044B \u0440\u0430\u0441\u0441\u0447\u0438\u0442\u044B\u0432\u0430\u044E\u0442\u0441\u044F \u043F\u043E \u0432\u0440\u0435\u043C\u0435\u043D\u0438 \u0447\u0438\u0441\u0442\u043A\u0438","config_sector_revisit_hint":"\u041F\u0440\u0438\u043C\u0435\u0447\u0430\u043D\u0438\u0435: \u043D\u0435\u043A\u043E\u0442\u043E\u0440\u044B\u0435 \u0440\u0435\u0436\u0438\u043C\u044B \u043F\u043E\u0432\u0442\u043E\u0440\u043D\u043E \u043F\u0440\u043E\u0445\u043E\u0434\u044F\u0442 \u043E\u0442\u0434\u0435\u043B\u044C\u043D\u044B\u0435 \u0437\u043E\u043D\u044B (\u043D\u0430\u043F\u0440\u0438\u043C\u0435\u0440, Sonicare White+ \u0435\u0449\u0451 \u0440\u0430\u0437 \u043F\u043E\u043B\u0438\u0440\u0443\u0435\u0442 \u043F\u0435\u0440\u0435\u0434\u043D\u0438\u0435 \u0437\u0443\u0431\u044B). \u0418\u0437\u043C\u0435\u043D\u0451\u043D\u043D\u044B\u0439 \u043F\u043E\u0440\u044F\u0434\u043E\u043A \u0437\u043E\u043D \u043C\u043E\u0436\u0435\u0442 \u0441\u0431\u0438\u0432\u0430\u0442\u044C \u0441 \u0442\u043E\u043B\u043A\u0443 \u0432 \u0442\u0430\u043A\u0438\u0445 \u0440\u0435\u0436\u0438\u043C\u0430\u0445, \u0435\u0441\u043B\u0438 \u0441\u0442\u0430\u0440\u0442\u043E\u0432\u044B\u0439 \u043A\u0432\u0430\u0434\u0440\u0430\u043D\u0442 \u0449\u0451\u0442\u043A\u0438 \u043D\u0435 \u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043D \u0441\u043E\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0435\u043D\u043D\u043E.","config_select_device":"\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0438\u0434\u0435\u043D\u0442\u0438\u0444\u0438\u043A\u0430\u0442\u043E\u0440 \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u0430","device_not_found":"\u0417\u0443\u0431\u043D\u0430\u044F \u0449\u0451\u0442\u043A\u0430 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u0430 \u2014 \u0432\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u043E \u0432 \u0440\u0435\u0434\u0430\u043A\u0442\u043E\u0440\u0435 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438.","config_reset_all":"\u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C \u0432\u0441\u0435 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438","config_reset_all_confirm":"\u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C \u0432\u0441\u0435 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u043A \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u044F\u043C \u043F\u043E \u0443\u043C\u043E\u043B\u0447\u0430\u043D\u0438\u044E? \u0412\u044B\u0431\u043E\u0440 \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u0430 \u0441\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u0441\u044F."}');


var $eab4c30116570dd8$exports = {};
$eab4c30116570dd8$exports = JSON.parse('{"conn_via_charger":"Livedata via ladestationen","conn_charger_paired":"Ladestation parret","conn_bt_active":"Livedata via Bluetooth","conn_bt_connected":"Bluetooth forbundet","conn_bt_charger_active":"Live data via Bluetooth til ladestationen","conn_bt_charger_connected":"Bluetooth forbundet til ladestationen","conn_bt_disconnected":"Ingen Bluetooth-forbindelse","conn_bridge_online":"ESP-bro online","conn_bridge_active":"ESP-bro overf\xf8rer livedata","conn_bridge_offline":"ESP-bro offline","conn_device_info":"Enhedsoplysninger","chip_battery":"Batteri","chip_pressure":"Tryk","chip_intensity":"Intensitet","chip_mode":"Tilstand","chip_score":"Score","chip_head":"B\xf8rstehoved","chip_head_days":"Hoved \xb7 dage","chip_head_time":"Hoved \xb7 tid","chip_head_type":"B\xf8rstehovedtype","session":"Session","complete":"F\xe6rdig","done_title":"B\xf8rstning fuldf\xf8rt!","recap_source_live":"Slutningen af denne session blev observeret","recap_source_history":"Rekonstrueret ud fra historikken","recap_source_device":"L\xe6st fra b\xf8rstens egen hukommelse","recap_source_counted":"Talt med af Home Assistant, mens du b\xf8rstede","recap_source_reading":"Udledt af de v\xe6rdier, der stod tilbage efter sessionen","done_sextants":"Alle 6 sektorer f\xe6rdige","done_quadrants":"Alle 4 sektorer f\xe6rdige","aborted_title":"B\xf8rstning stoppet for tidligt","aborted_quadrants":"{x} af {y} sektorer f\xe6rdige","aborted_sextants":"{x} af {y} sektorer f\xe6rdige","smiley_unknown_hint":"Ukendt displayansigt \u2014 rapport\xe9r det venligst i issue #20","verdict_computed":"Beregnet ud fra sessionen, ikke vist af b\xf8rsten","pressure_low":"Lavt","pressure_normal":"Normalt","pressure_medium":"Middel","pressure_high":"H\xf8jt","pressure_button_pressed":"Knap trykket","pressure_power_button_pressed":"T\xe6nd/sluk-knap trykket","intensity_low":"Lav","intensity_medium":"Middel","intensity_high":"H\xf8j","status_idle":"Klar","status_running":"B\xf8rster","status_charging":"Oplader","status_selection_menu":"Menu","status_initializing":"Forbinder\u2026","status_unavailable":"Ikke tilg\xe6ngelig","status_unknown":"Ukendt","status_off":"Slukket","status_standby":"Standby","status_run":"B\xf8rster","status_charge":"Oplader","status_shutdown":"Slukker","status_post_brushing_statistics":"Opsummering","status_post_brushing_summary":"Opsummering","status_session_summary":"Opsummering","status_setup":"Ops\xe6tning","status_sleeping":"Dvale","status_transport":"Transport","status_flight_menu":"Flymenu","status_charge_forbidden":"Opladning blokeret","status_final_test":"Sluttest","status_pcb_test":"PCB-test","status_calibration_test":"Kalibreringstest","zone_upper_right":"\xd8verst til h\xf8jre","zone_upper_front":"\xd8verst foran","zone_upper_left":"\xd8verst til venstre","zone_lower_left":"Nederst til venstre","zone_lower_front":"Nederst foran","zone_lower_right":"Nederst til h\xf8jre","mode_daily_clean":"Daglig reng\xf8ring","mode_deep_clean":"Dyb reng\xf8ring","mode_gum_care":"Tandk\xf8dspleje","mode_intense":"Intensiv","mode_massage":"Massage","mode_off":"Fra","mode_sensitive":"Sensitiv","mode_settings":"Indstillinger","mode_super_sensitive":"Ekstra sensitiv","mode_tongue_clean":"Tungerensning","mode_tongue_cleaning":"Tungerensning","mode_turbo":"Turbo","mode_whiten":"Blegning","mode_whitening":"Blegning","mode_gentle_white":"Gentle White","mode_smart_adapt":"Smart Adapt","mode_unknown":"Ukendt","mode_clean":"Reng\xf8ring","mode_white_plus":"White+","mode_gum_health":"Tandk\xf8dssundhed","mode_deep_clean_plus":"Dyb reng\xf8ring+","mode_tongue_care":"Tungepleje","config_device":"Enhed","config_title":"Titel (valgfri)","config_subtitle":"Vis enhedsnavn som undertitel","config_hold_duration":"Vis afsluttet session i","config_show_verdict":"Vis sessionsvurdering","config_device_recap":"Brug enhedens egen registrering","config_history_recap":"Genskab mistede sessioner fra historikken","hold_until_next_session":"Indtil n\xe6ste session","completed_just_now":"lige nu","completed_ago_minutes":"for {n} min. siden","completed_ago_hours":"for {n} t. siden","config_accent_color":"Accentfarve","config_accent_color_ring":"Lad st\xe5 tomt for at f\xf8lge b\xf8rstens ringfarve:","config_tooth_color":"Tandfarve","config_tooth_colors":"Tandfarver","color_tooth":"T\xe6nder","color_active":"Aktiv","color_done":"F\xe6rdig","config_active_color":"Farve for aktiv sektor","config_done_color":"Farve for f\xe6rdig sektor","config_num_sectors":"Antal sektorer","config_sector_order":"Sektorr\xe6kkef\xf8lge","config_layout":"Layout","config_layout_hint":"Placer hver v\xe6rdi som en chip (\xf8verste r\xe6kke, maks. 4) eller som en hj\xf8rnemark\xf8r. Hver v\xe6rdi kan kun bruges \xe9n gang.","config_layout_chips":"Chips (maks. 4)","config_layout_chip":"Chip","config_layout_corners":"Hj\xf8rnemark\xf8rer","config_head_display":"V\xe6rdi for b\xf8rstehoved","head_display_remaining":"% tilbage","head_display_used":"% brugt","head_display_sessions":"Sessioner tilbage","config_progress_size":"St\xf8rrelse p\xe5 statusbj\xe6lke","progress_size_slim":"Smal (standard)","progress_size_bold":"Kraftig","progress_size_xl":"Ekstra stor","config_scale":"Skalering (grafik, status og forl\xf8b)","layout_none":"\u2014 Ingen \u2014","pos_top_left":"\xd8verst til venstre","pos_top_right":"\xd8verst til h\xf8jre","pos_bottom_left":"Nederst til venstre","pos_bottom_right":"Nederst til h\xf8jre","config_show_header":"Vis overskrift","config_tooth_style":"Stil","tooth_style_teeth":"Tandprofil (standard)","tooth_style_none":"Skjult \u2014 stor timer + statusbj\xe6lke","group_device":"Enhed","group_header":"Overskrift","group_teeth":"Visualisering","group_recap":"Sessionsopsummering","config_show_recap":"Vis sessionsopsummering","group_sectors":"Sektorer","group_value_display":"V\xe6rdivisning","config_value_display_hint":"Disse indstillinger har kun effekt, n\xe5r v\xe6rdien faktisk vises, dvs. er placeret som chip eller hj\xf8rnemark\xf8r.","config_sector_mode_device":"Sektorer rapporteret af enheden","config_sector_mode_time":"Sektorer beregnet ud fra b\xf8rstetid","config_sector_revisit_hint":"Bem\xe6rk: Nogle tilstande vender tilbage til bestemte zoner (fx b\xf8rster Sonicare White+ fort\xe6nderne igen). En \xe6ndret r\xe6kkef\xf8lge kan virke forvirrende i disse tilstande, hvis b\xf8rstens startsektor ikke er tilpasset.","config_select_device":"Indtast enheds-id","device_not_found":"Tandb\xf8rsten blev ikke fundet \u2014 v\xe6lg din enhed i kort-editoren.","config_reset_all":"Nulstil alle indstillinger","config_reset_all_confirm":"Nulstil alle indstillinger til standard? Enhedsvalget bevares."}');


var $a5b51f5cad334ccc$exports = {};
$a5b51f5cad334ccc$exports = JSON.parse('{"conn_via_charger":"Podatki v \u017Eivo prek polnilne postaje","conn_charger_paired":"Polnilna postaja povezana","conn_bt_active":"Podatki v \u017Eivo prek Bluetootha","conn_bt_connected":"Bluetooth povezan","conn_bt_charger_active":"Podatki v \u017Eivo prek Bluetootha do polnilne postaje","conn_bt_charger_connected":"Bluetooth povezan s polnilno postajo","conn_bt_disconnected":"Ni povezave Bluetooth","conn_bridge_online":"Most ESP povezan","conn_bridge_active":"Most ESP prena\u0161a podatke v \u017Eivo","conn_bridge_offline":"Most ESP ni povezan","conn_device_info":"Informacije o napravi","chip_battery":"Baterija","chip_pressure":"Pritisk","chip_intensity":"Intenzivnost","chip_mode":"Na\u010Din","chip_score":"Ocena","chip_head":"Glava","chip_head_days":"Glava \xb7 dnevi","chip_head_time":"Glava \xb7 \u010Das","chip_head_type":"Vrsta glave","session":"Seja","complete":"Kon\u010Dano","done_title":"\u0160\u010Detkanje kon\u010Dano!","recap_source_live":"Konec te seje je bil opazovan","recap_source_history":"Rekonstruirano iz zgodovine","recap_source_device":"Prebrano iz spomina \u0161\u010Detke","recap_source_counted":"Home Assistant je sejo pre\u0161tel med \u0161\u010Detkanjem","recap_source_reading":"Povzeto po vrednostih, ki so ostale po seji","done_sextants":"Vseh 6 sekstantov kon\u010Danih","done_quadrants":"Vsi 4 kvadranti kon\u010Dani","aborted_title":"\u0160\u010Detkanje pred\u010Dasno prekinjeno","aborted_quadrants":"{x} od {y} kvadrantov kon\u010Danih","aborted_sextants":"{x} od {y} sekstantov kon\u010Danih","smiley_unknown_hint":"Neznan obraz na zaslonu \u2014 prosimo, sporo\u010Dite v issue #20","verdict_computed":"Izra\u010Dunano iz seje, \u0161\u010Detka tega ne prikazuje","pressure_low":"Nizek","pressure_normal":"Normalen","pressure_medium":"Srednji","pressure_high":"Visok","pressure_button_pressed":"Pritisnjen gumb","pressure_power_button_pressed":"Pritisnjen gumb za vklop","intensity_low":"Nizka","intensity_medium":"Srednja","intensity_high":"Visoka","status_idle":"V mirovanju","status_running":"\u0160\u010Detkanje","status_charging":"Polnjenje","status_selection_menu":"Meni za izbiro","status_initializing":"Povezovanje\u2026","status_unavailable":"Ni na voljo","status_unknown":"Neznano","status_off":"Izklopljeno","status_standby":"V pripravljenosti","status_run":"\u0160\u010Detkanje","status_charge":"Polnjenje","status_shutdown":"Izklop","status_post_brushing_statistics":"Povzetek","status_post_brushing_summary":"Povzetek","status_session_summary":"Povzetek","status_setup":"Nastavitev","status_sleeping":"Spanje","status_transport":"Transport","status_flight_menu":"Letalski meni","status_charge_forbidden":"Polnjenje blokirano","status_final_test":"Kon\u010Dni test","status_pcb_test":"Test vezja","status_calibration_test":"Kalibracijski test","zone_upper_right":"Zgoraj desno","zone_upper_front":"Zgoraj spredaj","zone_upper_left":"Zgoraj levo","zone_lower_left":"Spodaj levo","zone_lower_front":"Spodaj spredaj","zone_lower_right":"Spodaj desno","mode_daily_clean":"Dnevno \u010Di\u0161\u010Denje","mode_deep_clean":"Globinsko \u010Di\u0161\u010Denje","mode_gum_care":"Nega dlesni","mode_intense":"Intenzivno","mode_massage":"Masa\u017Ea","mode_off":"Izklop","mode_sensitive":"Ob\u010Dutljivo","mode_settings":"Nastavitve","mode_super_sensitive":"Zelo ob\u010Dutljivo","mode_tongue_clean":"\u010Ci\u0161\u010Denje jezika","mode_tongue_cleaning":"\u010Ci\u0161\u010Denje jezika","mode_turbo":"Turbo","mode_whiten":"Beljenje","mode_whitening":"Beljenje","mode_gentle_white":"Gentle White","mode_smart_adapt":"Smart Adapt","mode_unknown":"Neznano","mode_clean":"\u010Ci\u0161\u010Denje","mode_white_plus":"White+","mode_gum_health":"Zdravje dlesni","mode_deep_clean_plus":"Globinsko \u010Di\u0161\u010Denje+","mode_tongue_care":"Nega jezika","config_device":"Naprava","config_title":"Naslov (neobvezno)","config_subtitle":"Prika\u017Ei ime naprave kot podnaslov","config_hold_duration":"Prika\u017Ei kon\u010Dano sejo za","config_show_verdict":"Prika\u017Ei oceno seje","config_device_recap":"Uporabi napravino lastno evidenco","config_history_recap":"Obnovi zamujene seje iz zgodovine","hold_until_next_session":"Do naslednje seje","completed_just_now":"pravkar","completed_ago_minutes":"pred {n} min","completed_ago_hours":"pred {n} h","config_accent_color":"Barva poudarka","config_accent_color_ring":"Pustite prazno, da sledi barvi obro\u010Dka \u0161\u010Detke:","config_tooth_color":"Barva zob","config_tooth_colors":"Barve zob","color_tooth":"Zobje","color_active":"Aktiven","color_done":"Kon\u010Dan","config_active_color":"Barva aktivnega sektorja","config_done_color":"Barva kon\u010Danega sektorja","config_num_sectors":"\u0160tevilo sektorjev","config_sector_order":"Vrstni red sektorjev","config_layout":"Postavitev","config_layout_hint":"Vsako vrednost postavite kot \u010Dip (zgornja vrstica, najve\u010D 4) ali kot kotno oznako. Vsako vrednost lahko uporabite enkrat.","config_layout_chips":"\u010Cipi (najve\u010D 4)","config_layout_chip":"\u010Cip","config_layout_corners":"Kotne oznake","config_head_display":"Vrednost glave","head_display_remaining":"% preostalo","head_display_used":"% porabljeno","head_display_sessions":"Preostale seje","config_progress_size":"Velikost vrstice napredka","progress_size_slim":"Ozka (privzeto)","progress_size_bold":"Krepka","progress_size_xl":"Zelo velika","config_scale":"Merilo (grafika, stanje in napredek)","layout_none":"\u2014 Brez \u2014","pos_top_left":"Zgoraj levo","pos_top_right":"Zgoraj desno","pos_bottom_left":"Spodaj levo","pos_bottom_right":"Spodaj desno","config_show_header":"Prika\u017Ei naslovno vrstico","config_tooth_style":"Slog","tooth_style_teeth":"Zobni lok (privzeto)","tooth_style_none":"Skrito \u2014 velik \u010Dasovnik + vrstica napredka","group_device":"Naprava","group_header":"Naslovna vrstica","group_teeth":"Vizualizacija","group_recap":"Povzetek seje","config_show_recap":"Prika\u017Ei povzetek seje","group_sectors":"Sektorji","group_value_display":"Prikaz vrednosti","config_value_display_hint":"Te nastavitve u\u010Dinkujejo le, kadar je vrednost dejansko prikazana, torej postavljena kot \u010Dip ali kotna oznaka.","config_sector_mode_device":"Sektorje sporo\u010Da naprava","config_sector_mode_time":"Sektorji izra\u010Dunani iz \u010Dasa \u0161\u010Detkanja","config_sector_revisit_hint":"Opomba: nekateri na\u010Dini se vra\u010Dajo v dolo\u010Dena obmo\u010Dja (npr. Sonicare White+ ponovno polira sprednje zobe). Spremenjen vrstni red je lahko v teh na\u010Dinih zavajajo\u010D, \u010De za\u010Detni kvadrant \u0161\u010Detke ni ustrezno prilagojen.","config_select_device":"Vnesite ID naprave","device_not_found":"Zobna \u0161\u010Detka ni bila najdena \u2014 izberite napravo v urejevalniku kartice.","config_reset_all":"Ponastavi vse mo\u017Enosti","config_reset_all_confirm":"Ponastavim vse mo\u017Enosti na privzete vrednosti? Izbira naprave se ohrani."}');


const $d8078e452c66bdbe$var$LOCALES = {
    en: (/*@__PURE__*/$parcel$interopDefault($76eee68ef692a3c3$exports)),
    de: (/*@__PURE__*/$parcel$interopDefault($238d401f28c1db46$exports)),
    nl: (/*@__PURE__*/$parcel$interopDefault($450b7740649a7c34$exports)),
    ru: (/*@__PURE__*/$parcel$interopDefault($23fa3c3f63e48c30$exports)),
    da: (/*@__PURE__*/$parcel$interopDefault($eab4c30116570dd8$exports)),
    sl: (/*@__PURE__*/$parcel$interopDefault($a5b51f5cad334ccc$exports))
};
function $d8078e452c66bdbe$export$625550452a3fa3ec(hass, key) {
    const lang = hass?.language || 'en';
    const locale = $d8078e452c66bdbe$var$LOCALES[lang] || $d8078e452c66bdbe$var$LOCALES.en;
    return locale[key] || $d8078e452c66bdbe$var$LOCALES.en[key] || key;
}


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
 */ function $c32e617c3becedab$export$98b044737b007ca6(locale) {
    const format = locale?.time_format ?? 'language';
    if (format === '12') return true;
    if (format === '24') return false;
    const language = format === 'system' ? undefined : locale?.language;
    try {
        const cycle = new Intl.DateTimeFormat(language, {
            hour: 'numeric'
        }).resolvedOptions().hourCycle;
        return cycle === 'h11' || cycle === 'h12';
    } catch  {
        return false;
    }
}
/** The language tag to format in, or undefined to leave it to the browser. */ function $c32e617c3becedab$var$tag(hass) {
    return hass?.locale?.language || hass?.language || undefined;
}
function $c32e617c3becedab$export$8b492ed8828f789c(hass, timestampMs) {
    const ampm = $c32e617c3becedab$export$98b044737b007ca6(hass?.locale);
    try {
        return new Date(timestampMs).toLocaleString($c32e617c3becedab$var$tag(hass), {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: ampm ? 'numeric' : '2-digit',
            minute: '2-digit',
            hourCycle: ampm ? 'h12' : 'h23'
        });
    } catch  {
        return new Date(timestampMs).toLocaleString();
    }
}


// The completion latch, as a plain state transition.
//
// Neither integration keeps reporting a session once it is over: Oral-B
// freezes its last advertised values and then wipes them, Sonicare powers
// itself off. So a finished session has to be held by the card rather than
// read back from the handle, and issues #4, #5, #11 and #18 all landed here.
//
// This used to live inside render(), mutating nine fields as a side effect of
// drawing. Pulled out, it is a function of the previous state and what the
// device currently reports - which is what it always was, only now it can be
// tested by feeding it states instead of by replaying a session through a
// whole card.
//
// It stays pure on purpose. The two things it cannot do itself - forgetting a
// dismissal and asking the recorder - are reported back as flags for the
// caller to act on.
const $b973a26f761c9c78$export$918b2e620e4fca36 = 120; // 2 minutes target
const $b973a26f761c9c78$export$2a3bc4b7d268e4d6 = 10;
// A session counts as finished slightly short of its target: a handle can
// power off a beat before the last duration sample lands exactly on it.
const $b973a26f761c9c78$var$COMPLETION_TOLERANCE = 0.9;
// Readings that are not a face at all: the display asleep, and Home
// Assistant's own placeholders for a reading it does not have. Latched, the
// last two would put a "please report this face" badge on screen for what is
// plumbing, not data.
//
// `standard` is deliberately NOT here. It reads like a resting value and was
// taken for one, but it is the bottom rung of the scale - the frown a handle
// shows after a session barely begun, climbing from there with the brushing
// time. Measured on two handles: it appears in the second a session ends,
// holds the ~30 s the display stays lit and then sleeps to `off`, exactly as
// every other result face does.
//
// Known cost of reading it: a face sensor refreshed only over a connection
// can come to rest on it, and a resting frown latched onto a later session
// would condemn one nobody has finished. That exposure is not particular to
// this value - a resting `special_5` would praise the same session - so it is
// carried here rather than paid for with a rule for one face.
const $b973a26f761c9c78$var$NON_VERDICT_FACES = new Set([
    'off',
    'unknown',
    'unavailable'
]);
function $b973a26f761c9c78$export$efabde77493fd6f1(face) {
    return !!face && !$b973a26f761c9c78$var$NON_VERDICT_FACES.has(face);
}
function $b973a26f761c9c78$export$45f28d9c2b1af70() {
    return {
        peakDuration: 0,
        completed: false,
        completedDuration: 0,
        completedAt: 0,
        completedIsFull: false,
        wasActiveSession: false,
        sessionRoutineLength: 0,
        // The pacing of the routine this session is running, one entry per
        // step. Latched for the same reason as its length: a recap is read
        // after the fact, and by then the handle may be set to another mode
        // whose steps are neither as many nor as long.
        sessionStepSeconds: null,
        holdDismissed: false,
        stashedRecap: null,
        face: null,
        completedFace: null,
        completedScore: null,
        completedFromStash: false,
        // Seconds of the recapped session brushed too hard, where the record
        // says so. Only ever arrives with a recap rebuilt from such a record,
        // so it is null wherever one is established by another route - not
        // knowing is its own answer, and a different one from none.
        completedPressure: null,
        // The routine the recapped session was running, where the recap knows
        // it. The live reading is no substitute: by the time a recap is on
        // screen the handle may have been switched to another routine, or
        // report none at all.
        completedTarget: 0,
        completedStepSeconds: null,
        // Which route established the recap on screen: the latch watching a
        // session end (null), a rebuild from history, or the handle's own
        // record. Part of the latch state rather than the card's own, so it
        // is dropped and restored with the recap it describes.
        completedSource: null,
        // The session the handle had most recently filed when this one
        // started - the mark against which a record arriving later is judged
        // to belong to the session just watched. Handles number their
        // sessions in order, so a higher number is a later session and needs
        // no clock to say so. Null where the session was not seen starting.
        baselineSessionId: null
    };
}
function $b973a26f761c9c78$export$912b1850c5c72a40(prev, { active: active, duration: duration, routineLength: routineLength, now: now, holdCompleted: holdCompleted, hasRoutineEntity: hasRoutineEntity = false, hasDurationEntity: hasDurationEntity = false, durationLastChanged: durationLastChanged = null, displayFace: displayFace = null, displayScore: displayScore = null, faceWindow: faceWindow = false, stepSeconds: stepSeconds = null }) {
    const state = {
        ...prev
    };
    let sessionStarted = false;
    let needsRecap = false;
    if (active) {
        if (!prev.wasActiveSession) {
            // A new session began. Stash whatever recap is on screen: a real
            // session replaces it, a seconds-long button fumble puts it back.
            sessionStarted = true;
            state.stashedRecap = prev.completed ? {
                duration: prev.completedDuration,
                at: prev.completedAt,
                full: prev.completedIsFull,
                face: prev.completedFace,
                score: prev.completedScore,
                pressure: prev.completedPressure,
                target: prev.completedTarget,
                steps: prev.completedStepSeconds,
                source: prev.completedSource
            } : null;
            state.peakDuration = 0;
            state.completed = false;
            state.completedAt = 0;
            state.holdDismissed = false;
            state.sessionRoutineLength = 0;
            state.sessionStepSeconds = null;
            state.face = null;
            state.completedFromStash = false;
        }
        state.peakDuration = Math.max(state.peakDuration, duration);
        if (routineLength > 0) // Snapshot the routine governing THIS session: by the time it ends
        // the routine_length sensor may already read unavailable.
        state.sessionRoutineLength = routineLength;
        if (Array.isArray(stepSeconds) && stepSeconds.length) // Same snapshot, for how the routine paces itself. Kept beside
        // the length rather than derived from it, because the number of
        // steps is the mode's business and not the clock's.
        state.sessionStepSeconds = stepSeconds;
    } else if (prev.wasActiveSession) {
        // The session just ended. Full and aborted runs both get a recap,
        // worded differently; a fumble below the floor restores the stash.
        const endTarget = (state.sessionRoutineLength || $b973a26f761c9c78$export$918b2e620e4fca36) * $b973a26f761c9c78$var$COMPLETION_TOLERANCE;
        if (holdCompleted && state.peakDuration >= $b973a26f761c9c78$export$2a3bc4b7d268e4d6) {
            state.completed = true;
            state.completedIsFull = state.peakDuration >= endTarget;
            state.completedDuration = state.peakDuration;
            state.completedAt = now;
            state.completedFromStash = false;
            // This session was watched, not read: whatever the last recap
            // knew about the routine and the pressure was the last one's.
            // Watching says nothing about pressure, so it is unknown until a
            // record says otherwise - not zero, which would read as none.
            state.completedSource = null;
            state.completedPressure = null;
            state.completedTarget = state.sessionRoutineLength;
            state.completedStepSeconds = state.sessionStepSeconds;
        } else if (holdCompleted && state.stashedRecap) {
            state.completed = true;
            state.completedIsFull = state.stashedRecap.full;
            state.completedDuration = state.stashedRecap.duration;
            state.completedAt = state.stashedRecap.at;
            state.face = state.stashedRecap.face;
            // The restored session's own score, not the sensor's: the fumble
            // that was just discarded has already overwritten the sensor.
            state.completedScore = state.stashedRecap.score ?? null;
            state.completedPressure = state.stashedRecap.pressure ?? null;
            state.completedTarget = state.stashedRecap.target ?? 0;
            state.completedStepSeconds = state.stashedRecap.steps ?? null;
            state.completedSource = state.stashedRecap.source ?? null;
            state.completedFromStash = true;
        } else {
            state.completed = false;
            state.completedIsFull = false;
            state.completedDuration = 0;
            state.completedAt = 0;
            state.face = null;
            state.completedPressure = null;
            state.completedTarget = 0;
            state.completedStepSeconds = null;
            state.completedSource = null;
            state.completedFromStash = false;
        }
        state.peakDuration = 0;
        state.stashedRecap = null;
    } else if (holdCompleted && !state.holdDismissed && (!hasRoutineEntity || routineLength > 0) && duration >= $b973a26f761c9c78$export$2a3bc4b7d268e4d6) {
        // Issue #5: derive the recap from the current state alone. The frozen
        // post-session values still describe the last session even if the card
        // never saw it end - dashboard closed while brushing, or reloaded
        // afterwards. Skipped while an existing routine_length sensor is
        // unreadable, so an aborted long routine cannot slip past the shorter
        // default target.
        //
        // Issue #11: a reading that differs from the adopted duration is a
        // newer session, or a late tail sample of one - the timer keeps ticking
        // for a few seconds after the end - so its timestamp and value are
        // adopted, downwards too.
        if (!state.completed || duration !== state.completedDuration) {
            state.completedAt = Date.parse(durationLastChanged) || now;
            state.completedDuration = duration;
            // Not watched: worked out from readings the handle left standing
            // after the session, which is a different thing to have seen it
            // happen and has to say so - this branch runs when the card was
            // closed while somebody brushed, or reloaded afterwards.
            //
            // Set only where the session is established here. This branch
            // runs on every render once a recap is up, and a session the
            // card did watch end would otherwise be relabelled a moment
            // later by the reading that outlived it.
            state.completedSource = 'reading';
        }
        state.completed = true;
        state.completedFromStash = false;
        state.completedPressure = null;
        state.completedTarget = 0;
        // Not cleared here: the mark belongs to the session that just ended,
        // and this is the moment a record of it is about to be waited for.
        // It is set when a session starts and dropped with the recap.
        state.completedIsFull = duration >= (routineLength || $b973a26f761c9c78$export$918b2e620e4fca36) * $b973a26f761c9c78$var$COMPLETION_TOLERANCE;
    } else if (holdCompleted && !state.holdDismissed && !state.completed && hasDurationEntity) // Issue #11: Oral-B wipes the reported values seconds after powering
    // off, and an aborted run can leave a frozen below-target one, so the
    // current state often proves nothing. The last session is rebuilt from
    // recorder history instead.
    //
    // Issue #18: deliberately no routine_length gate. The query resolves
    // the target from history and declines the recap itself if neither
    // source can name one, so an integration whose sensors go unavailable
    // on disconnect still gets its session back.
    needsRecap = true;
    // The result face is not shown while the motor runs: the brush switches to
    // a summary state first, and that state is not `active`. So the latch keeps
    // adopting a face for as long as the caller holds the window open, and
    // completedFace fills in a beat after the recap appears rather than at the
    // transition. `off` is the display asleep, never a verdict — and `unknown`
    // and `unavailable` are Home Assistant placeholders, not values the handle
    // showed: latched, they would put a "please report this face" badge on
    // screen for what is plumbing, not data.
    //
    // `standard` is adopted like any other face. It is the bottom of the
    // scale, not the everyday face an earlier reading of this file assumed -
    // see the note beside NON_VERDICT_FACES, including what that costs.
    if (faceWindow && $b973a26f761c9c78$export$efabde77493fd6f1(displayFace)) state.face = displayFace;
    state.completedFace = state.completed ? state.face : null;
    // The score arrives with the switch-off itself rather than after a summary
    // state, so it needs no window of its own - but it can still land a render
    // late. Adopting it for as long as the recap is held covers that, and
    // cannot stray into the next session: starting one clears the recap first.
    // Xiaomi is the only integration that reports one, and only at the end of
    // a session; between sessions the sensor keeps the last value, which is
    // exactly what makes it safe to read here. Except for a recap restored
    // from the stash: the discarded fumble has already written its own score
    // to the sensor, so the restored session keeps the score it was stashed
    // with instead.
    if (state.completed && !active && !state.completedFromStash && displayScore !== null && displayScore !== '') state.completedScore = displayScore;
    else if (!state.completed) state.completedScore = null;
    state.wasActiveSession = active;
    return {
        state: state,
        sessionStarted: sessionStarted,
        needsRecap: needsRecap
    };
}


// Which zone the card highlights, and which ones it shows as done.
//
// The second state machine that used to live inside render(). Three different
// devices want three different answers here, and the branch that runs decides
// what the four remembered values are even for:
//
//   * A handle whose integration decodes every sector itself. The reported
//     value is taken as-is and nothing has to be remembered.
//   * A handle that revisits sectors on purpose - Sonicare's White+ and Gum
//     Health walk the six zones and then return to two of them. The zone is
//     taken as-is here too, but a zone already finished has to stay finished
//     when the reading jumps backwards.
//   * Everything else, where the pre-2026.8 oralb_ble mapping had no entries
//     for sectors 5 and 6 and wrapped back to 4 instead. While brushing a
//     sector only moves forward, so a value that does not exceed the highest
//     one seen is read as the next one.
//
// Which of the three applies is passed in as two flags rather than decided
// here: this module knows nothing about integrations, only about behaviour.
/** The state a card starts with. */ function $19924b6af6e06bb0$export$e4cc5c0ab851a015() {
    return {
        highestSector: -1,
        lastRawIndex: -1,
        correctedIndex: -1,
        wasActive: false,
        visitedSectors: null
    };
}
function $19924b6af6e06bb0$export$3f32d9c2202e56e3(state) {
    return {
        ...state,
        highestSector: -1,
        lastRawIndex: -1,
        correctedIndex: -1
    };
}
function $19924b6af6e06bb0$export$ed42d00b6a9a8b37(sector) {
    const match = String(sector).match(/(\d+)/);
    if (!match) return -1;
    const index = parseInt(match[1]) - 1;
    return index >= 0 ? index : -1;
}
function $19924b6af6e06bb0$export$2c0026facbbde936(options) {
    return Array.isArray(options) && options.includes('sector_5');
}
function $19924b6af6e06bb0$export$9494d08c8f9e7fd0(prev, { rawIndex: rawIndex, active: active, maxIndex: maxIndex }) {
    let state = prev;
    // A session beginning starts from scratch rather than from the old peak.
    if (!prev.wasActive && active) state = $19924b6af6e06bb0$export$3f32d9c2202e56e3(state);
    state = {
        ...state,
        wasActive: active
    };
    if (!active || rawIndex === -1) return {
        state: $19924b6af6e06bb0$export$3f32d9c2202e56e3(state),
        index: rawIndex
    };
    // The same raw value again is the handle repeating itself, not progress -
    // without this the card would walk through the zones on its own.
    if (rawIndex === state.lastRawIndex) return {
        state: state,
        index: state.correctedIndex
    };
    state = {
        ...state,
        lastRawIndex: rawIndex
    };
    if (rawIndex > state.highestSector) state = {
        ...state,
        highestSector: rawIndex,
        correctedIndex: rawIndex
    };
    else {
        // The reading stalled or went backwards: that is the wrap, so move on.
        const corrected = Math.min(state.highestSector + 1, maxIndex);
        state = {
            ...state,
            highestSector: corrected,
            correctedIndex: corrected
        };
    }
    return {
        state: state,
        index: state.correctedIndex
    };
}
function $19924b6af6e06bb0$export$d4ffc2e2aaef11ec(prev, { rawIndex: rawIndex, active: active }) {
    if (!active) return {
        state: {
            ...prev,
            visitedSectors: null
        },
        count: 0
    };
    const visited = new Set(prev.visitedSectors || []);
    if (rawIndex >= 0) visited.add(rawIndex);
    return {
        state: {
            ...prev,
            visitedSectors: visited
        },
        count: visited.size
    };
}
function $19924b6af6e06bb0$export$fbe194d49df99db9(prev, { sector: sector, active: active, zoneCount: zoneCount, duration: duration, routineLength: routineLength, allowsRevisits: allowsRevisits = false, sectorsAreUpstreamDecoded: sectorsAreUpstreamDecoded = false }) {
    const maxIndex = zoneCount - 1;
    const rawIndex = $19924b6af6e06bb0$export$ed42d00b6a9a8b37(sector);
    if (sector === 'success') return {
        state: prev,
        index: -1,
        doneCount: null
    };
    const clamped = rawIndex >= 0 ? Math.min(rawIndex, maxIndex) : -1;
    if (allowsRevisits) {
        // Time and observation combined, taking whichever is further along, so
        // that a revisit cannot un-finish a zone: after the initial sweep the
        // raw sector jumps back, but every zone has genuinely been brushed.
        const timeBasedDone = Math.min(zoneCount, Math.floor(zoneCount * duration / routineLength));
        const visited = $19924b6af6e06bb0$export$d4ffc2e2aaef11ec(prev, {
            rawIndex: rawIndex,
            active: active
        });
        return {
            state: visited.state,
            index: clamped,
            doneCount: Math.max(timeBasedDone, visited.count)
        };
    }
    if (sectorsAreUpstreamDecoded) // Clear the workaround's latch so that falling back to it - the entity
    // going briefly unavailable - starts cleanly rather than mid-session.
    return {
        state: $19924b6af6e06bb0$export$3f32d9c2202e56e3({
            ...prev,
            wasActive: false
        }),
        index: clamped,
        doneCount: null
    };
    const corrected = $19924b6af6e06bb0$export$9494d08c8f9e7fd0(prev, {
        rawIndex: rawIndex,
        active: active,
        maxIndex: maxIndex
    });
    return {
        state: corrected.state,
        index: corrected.index,
        doneCount: null
    };
}


var $7bfe0f8b5ad5b7ee$exports = {};
$7bfe0f8b5ad5b7ee$exports = "ha-card {\n  overflow: visible;\n  container-type: inline-size;\n}\n\n.device-not-found {\n  color: var(--secondary-text-color);\n  padding: 16px 18px;\n  font-size: 13px;\n}\n\n.card-header {\n  border-bottom: 1px solid var(--divider-color, #f3f4f6);\n  border-top-left-radius: var(--ha-card-border-radius, 12px);\n  border-top-right-radius: var(--ha-card-border-radius, 12px);\n  justify-content: space-between;\n  align-items: center;\n  padding: 16px 18px 12px;\n  display: flex;\n  position: relative;\n  overflow: hidden;\n}\n\n.card-header:before {\n  content: \"\";\n  background: var(--accent-color, transparent);\n  opacity: .12;\n  pointer-events: none;\n  transition: background .5s;\n  position: absolute;\n  inset: 0;\n}\n\n.header-accent {\n  background: var(--accent-color);\n  border-radius: 3px;\n  flex-shrink: 0;\n  width: 4px;\n  height: 28px;\n  transition: background .4s;\n}\n\n.header-title {\n  align-items: center;\n  gap: 8px;\n  display: flex;\n}\n\n.header-title h2 {\n  color: var(--primary-text-color);\n  letter-spacing: -.01em;\n  margin: 0;\n  font-size: 15px;\n  font-weight: 700;\n}\n\n.header-sub {\n  color: var(--secondary-text-color);\n  font-size: 12px;\n  font-weight: 400;\n}\n\n.header-icons {\n  align-items: center;\n  gap: 10px;\n  display: flex;\n}\n\n.header-icons svg:not(.conn-icon) {\n  width: 16px;\n  height: 16px;\n}\n\n.conn-icon {\n  width: 18px;\n  height: 18px;\n  color: var(--primary-color, #3b82f6);\n  fill: currentColor;\n  cursor: pointer;\n  opacity: .55;\n  transition: color .4s, opacity .4s;\n}\n\n.conn-icon.active {\n  color: #0082fc;\n  opacity: 1;\n}\n\n.conn-icon.disconnected {\n  color: var(--disabled-text-color, #9ca3af);\n  opacity: .3;\n}\n\n.more-info-btn {\n  cursor: pointer;\n  opacity: .5;\n  transition: opacity .2s;\n  color: var(--secondary-text-color) !important;\n}\n\n.more-info-btn:hover {\n  opacity: 1;\n}\n\n.init-wrap {\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  padding: 24px 0 32px;\n  display: flex;\n  overflow: hidden;\n}\n\n.init-rings {\n  flex-shrink: 0;\n  justify-content: center;\n  align-items: center;\n  width: 180px;\n  height: 180px;\n  display: flex;\n  position: relative;\n}\n\n.init-ring {\n  border: 2px solid var(--primary-color, #3b82f6);\n  opacity: 0;\n  border-radius: 50%;\n  animation: 3s ease-out infinite initPulse;\n  position: absolute;\n}\n\n.init-ring-1 {\n  width: 70px;\n  height: 70px;\n  animation-delay: 0s;\n}\n\n.init-ring-2 {\n  width: 70px;\n  height: 70px;\n  animation-delay: 1s;\n}\n\n.init-ring-3 {\n  width: 70px;\n  height: 70px;\n  animation-delay: 2s;\n}\n\n@keyframes initPulse {\n  0% {\n    opacity: .6;\n    width: 70px;\n    height: 70px;\n  }\n\n  100% {\n    opacity: 0;\n    width: 190px;\n    height: 190px;\n  }\n}\n\n.init-bt {\n  z-index: 1;\n  width: 52px;\n  height: 52px;\n  animation: 2s ease-in-out infinite initBtPulse;\n  position: relative;\n}\n\n.init-bt svg {\n  width: 52px;\n  height: 52px;\n}\n\n@keyframes initBtPulse {\n  0%, 100% {\n    opacity: .5;\n    transform: scale(.95);\n  }\n\n  50% {\n    opacity: 1;\n    transform: scale(1.05);\n  }\n}\n\n.init-label {\n  color: var(--primary-color, #3b82f6);\n  margin-top: 6px;\n  font-size: 13px;\n  font-weight: 500;\n}\n\n.chips-row {\n  gap: 8px;\n  padding: 12px 14px;\n  display: flex;\n}\n\n.chips-row > * {\n  flex: 1;\n  min-width: 0;\n}\n\n.chip {\n  background: var(--card-background-color, #f9fafb);\n  border: 1px solid var(--divider-color, #e5e7eb);\n  cursor: pointer;\n  border-radius: 10px;\n  grid-template-rows: auto auto;\n  grid-template-columns: auto 1fr;\n  align-items: center;\n  gap: 1px 8px;\n  padding: 8px 10px;\n  display: grid;\n}\n\n.chip-icon {\n  grid-row: 1 / 3;\n  justify-content: center;\n  align-items: center;\n  display: flex;\n}\n\n.chip-icon ha-icon {\n  --mdc-icon-size: 24px;\n}\n\n.head-type-letter {\n  color: var(--primary-text-color);\n  font-weight: 800;\n  display: none;\n}\n\n.chip-icon .brushhead-svg {\n  width: 19px;\n  height: 24px;\n}\n\n.chip-icon.green {\n  color: #16a34a;\n}\n\n.chip-icon.blue {\n  color: #2563eb;\n}\n\n.chip-icon.amber {\n  color: #d97706;\n}\n\n.chip-icon.red {\n  color: #dc2626;\n}\n\n.chip-icon.muted {\n  color: var(--disabled-text-color, #9ca3af);\n}\n\n.chip-icon.int-low {\n  color: #0891b2;\n}\n\n.chip-icon.int-med {\n  color: #7c3aed;\n}\n\n.chip-icon.int-high {\n  color: #db2777;\n}\n\n.chip-icon.gold {\n  color: #c47f16;\n}\n\n.chip-label {\n  color: var(--secondary-text-color);\n  text-transform: uppercase;\n  letter-spacing: .06em;\n  font-size: 9px;\n  font-weight: 600;\n}\n\n.chip-value {\n  color: var(--primary-text-color);\n  text-transform: capitalize;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  font-size: 12px;\n  font-weight: 700;\n  line-height: 1;\n  overflow: hidden;\n}\n\n.chip-value.green {\n  color: #16a34a;\n}\n\n.chip-value.blue {\n  color: #2563eb;\n}\n\n.chip-value.amber {\n  color: #d97706;\n}\n\n.chip-value.red {\n  color: #dc2626;\n}\n\n.chip-value.int-low {\n  color: #0891b2;\n}\n\n.chip-value.int-med {\n  color: #7c3aed;\n}\n\n.chip-value.int-high {\n  color: #db2777;\n}\n\n.chip-value.gold {\n  color: #c47f16;\n}\n\n.chip-value.muted {\n  color: var(--disabled-text-color, #9ca3af);\n}\n\n.chip-value.prose {\n  text-transform: none;\n}\n\n.chip-value.wrap {\n  white-space: normal;\n  -webkit-line-clamp: 2;\n  line-clamp: 2;\n  -webkit-box-orient: vertical;\n  font-size: 11px;\n  line-height: 1.15;\n  display: -webkit-box;\n}\n\n.pressure-bars {\n  grid-row: 1 / 3;\n  justify-content: center;\n  align-items: flex-end;\n  gap: 2px;\n  display: flex;\n}\n\n.pb {\n  background: var(--divider-color, #e5e7eb);\n  border-radius: 2px;\n  width: 4px;\n  transition: background .3s;\n}\n\n.pb:first-child {\n  height: 5px;\n}\n\n.pb:nth-child(2) {\n  height: 9px;\n}\n\n.pb:nth-child(3) {\n  height: 13px;\n}\n\n.pb:nth-child(4) {\n  height: 18px;\n}\n\n.p-low .pb:first-child {\n  background: #d97706;\n}\n\n.p-normal .pb:first-child, .p-normal .pb:nth-child(2) {\n  background: #16a34a;\n}\n\n.p-high .pb {\n  background: #dc2626;\n}\n\n.intensity-dial {\n  width: 24px;\n  height: 24px;\n  display: block;\n}\n\n.id-track {\n  fill: none;\n  stroke: var(--divider-color, #e5e7eb);\n  stroke-width: 2.8px;\n  stroke-linecap: round;\n}\n\n.id-arc {\n  fill: none;\n  stroke: currentColor;\n  stroke-width: 2.8px;\n  stroke-linecap: round;\n  opacity: .55;\n  transition: stroke-dasharray .3s;\n}\n\n.id-needle {\n  stroke: currentColor;\n  stroke-width: 1.8px;\n  stroke-linecap: round;\n}\n\n.id-hub {\n  fill: currentColor;\n}\n\n.mode-chip-wrap {\n  position: relative;\n}\n\n.chip.selectable {\n  cursor: pointer;\n}\n\n.mode-caret {\n  opacity: .5;\n  font-size: 10px;\n}\n\n.chip-select-hint {\n  display: none;\n}\n\n.dropdown-backdrop {\n  z-index: 9;\n  position: fixed;\n  inset: 0;\n}\n\n.mode-dropdown {\n  z-index: 10;\n  background: var(--card-background-color, #fff);\n  border: 1px solid var(--divider-color, #e5e7eb);\n  border-radius: 12px;\n  min-width: 160px;\n  animation: .15s ease-out dropdown-in;\n  position: absolute;\n  top: calc(100% + 4px);\n  right: 0;\n  overflow: hidden;\n  box-shadow: 0 4px 16px #0000001f;\n}\n\n@keyframes dropdown-in {\n  from {\n    opacity: 0;\n    transform: translateY(-4px);\n  }\n\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n\n.mode-option {\n  cursor: pointer;\n  color: var(--primary-text-color);\n  align-items: center;\n  gap: 10px;\n  padding: 10px 14px;\n  font-size: 13px;\n  font-weight: 500;\n  transition: background .15s;\n  display: flex;\n}\n\n.mode-option:hover {\n  background: var(--secondary-background-color, #f3f4f6);\n}\n\n.mode-option.active {\n  color: #2563eb;\n  font-weight: 600;\n}\n\n.mode-option ha-icon {\n  --mdc-icon-size: 20px;\n  color: inherit;\n}\n\n.mode-option:not(:last-child) {\n  border-bottom: 1px solid var(--divider-color, #f3f4f6);\n}\n\n.visual-area {\n  flex-direction: column;\n  align-items: center;\n  padding: 4px 14px 10px;\n  display: flex;\n  position: relative;\n}\n\n.card-header + .visual-area, .visual-area:first-child {\n  padding-top: 16px;\n}\n\n.tooth-wrap {\n  width: calc(210px * var(--tb-scale, 1));\n  height: calc(210px * var(--tb-scale, 1));\n  justify-content: center;\n  align-items: center;\n  display: flex;\n  position: relative;\n}\n\n.tooth-svg {\n  width: 100%;\n  height: 100%;\n}\n\n.zone {\n  fill: var(--tb-tooth-color, var(--divider-color, #f3f4f6));\n  transition: fill .3s;\n}\n\n.brushing .zone {\n  fill: var(--tb-active-color, #93c5fd);\n  animation: .8s ease-in-out infinite alternate brush-zone;\n}\n\n@keyframes brush-zone {\n  from {\n    opacity: .6;\n  }\n\n  to {\n    opacity: 1;\n  }\n}\n\n.done .zone {\n  fill: var(--tb-done-color, #bbf7d0) !important;\n}\n\n.center-info {\n  text-align: center;\n  pointer-events: none;\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n}\n\n.session-label {\n  font-size: calc(9px * var(--tb-scale, 1));\n  color: var(--secondary-text-color);\n  text-transform: uppercase;\n  letter-spacing: .1em;\n  margin-bottom: 2px;\n  font-weight: 600;\n  display: block;\n}\n\n.timer-display {\n  font-size: calc(30px * var(--tb-scale, 1));\n  color: var(--primary-text-color);\n  letter-spacing: -1px;\n  font-variant-numeric: tabular-nums;\n  font-weight: 400;\n  line-height: 1;\n  transition: color .4s;\n}\n\n.timer-display.active {\n  color: var(--primary-color, #2563eb);\n}\n\n.center-info.standalone {\n  pointer-events: auto;\n  cursor: pointer;\n  padding: 10px 0 4px;\n  position: static;\n  transform: none;\n}\n\n.center-info.standalone .timer-display {\n  font-size: calc(52px * var(--tb-scale, 1));\n  letter-spacing: -2px;\n}\n\n.status-row {\n  grid-template-columns: calc(66px * var(--tb-scale, 1)) 1fr calc(66px * var(--tb-scale, 1));\n  align-items: center;\n  width: calc(100% + 8px);\n  margin: 2px -4px 10px;\n  display: grid;\n}\n\n.status-row .card-corner {\n  position: static;\n}\n\n.status-text-wrap {\n  text-align: center;\n  cursor: pointer;\n}\n\n.status-main {\n  font-size: calc(14px * var(--tb-scale, 1));\n  color: var(--primary-text-color);\n  text-transform: capitalize;\n  font-weight: 600;\n  transition: color .4s;\n}\n\n.status-main.active {\n  color: var(--primary-color, #2563eb);\n}\n\n.status-sub {\n  font-size: calc(11px * var(--tb-scale, 1));\n  color: var(--secondary-text-color);\n  text-transform: capitalize;\n  margin-top: 1px;\n}\n\n.progress-wrap {\n  opacity: 0;\n  width: 100%;\n  height: 0;\n  padding: 0 14px;\n  transition: opacity .4s, height .4s;\n  overflow: hidden;\n}\n\n.progress-wrap.visible {\n  opacity: 1;\n  height: auto;\n  padding: 0 14px 10px;\n}\n\n.progress-track {\n  height: calc(var(--tb-bar-height, 4px) * var(--tb-scale, 1));\n  gap: 3px;\n  display: flex;\n}\n\n.progress-wrap.bar-bold {\n  --tb-bar-height: 8px;\n}\n\n.progress-wrap.bar-xl {\n  --tb-bar-height: 12px;\n}\n\n.progress-seg {\n  background: var(--divider-color, #e5e7eb);\n  border-radius: calc(var(--tb-bar-height, 4px) * var(--tb-scale, 1) / 2);\n  flex: 1;\n  overflow: hidden;\n}\n\n.progress-fill {\n  border-radius: calc(var(--tb-bar-height, 4px) * var(--tb-scale, 1) / 2);\n  height: 100%;\n  transition: width .5s;\n}\n\n.progress-labels {\n  font-size: calc(10px * var(--tb-scale, 1));\n  color: var(--secondary-text-color);\n  justify-content: space-between;\n  margin-top: 4px;\n  display: flex;\n}\n\n.progress-labels span:first-child {\n  text-transform: capitalize;\n}\n\n.done-badge {\n  background: var(--card-background-color, #f0fdf4);\n  text-align: center;\n  border-top: 1px solid #bbf7d0;\n  padding: 10px 14px;\n  display: none;\n  position: relative;\n}\n\n.done-dismiss {\n  cursor: pointer;\n  color: var(--secondary-text-color, #888);\n  background: none;\n  border: none;\n  padding: 2px 4px;\n  font-size: 16px;\n  line-height: 1;\n  position: absolute;\n  top: 6px;\n  right: 10px;\n}\n\n.done-dismiss:hover {\n  color: var(--primary-text-color, #333);\n}\n\n.done-badge.show {\n  animation: .4s cubic-bezier(.34, 1.56, .64, 1) pop-in;\n  display: block;\n}\n\n@keyframes pop-in {\n  from {\n    opacity: 0;\n    transform: scaleY(.7);\n  }\n\n  to {\n    opacity: 1;\n    transform: scaleY(1);\n  }\n}\n\n.done-badge p {\n  color: #15803d;\n  margin: 0;\n  font-size: 13px;\n  font-weight: 600;\n}\n\n.done-badge span {\n  color: #16a34a;\n  font-size: 11px;\n}\n\n.done-age {\n  color: var(--secondary-text-color, #888);\n  font-size: 11px;\n  font-weight: 400;\n}\n\n.done-badge.aborted {\n  border-top-color: #fde68a;\n}\n\n.done-badge.aborted p {\n  color: #b45309;\n}\n\n.done-badge.aborted span {\n  color: #d97706;\n}\n\n.done-badge.severe {\n  border-top-color: #fecaca;\n}\n\n.done-badge.severe p {\n  color: #b91c1c;\n}\n\n.done-badge.severe span {\n  color: #dc2626;\n}\n\n.done-body {\n  justify-content: center;\n  align-items: center;\n  gap: 11px;\n  padding-left: 16px;\n  padding-right: 16px;\n  display: flex;\n}\n\n.done-face {\n  flex-direction: column;\n  flex: none;\n  align-items: center;\n  gap: 1px;\n  display: flex;\n}\n\n.done-smiley {\n  width: 34px;\n  height: 34px;\n}\n\n.done-text {\n  text-align: left;\n}\n\n.done-body.text-only .done-text {\n  text-align: center;\n}\n\n.done-face-code {\n  letter-spacing: -.02em;\n  color: var(--disabled-text-color, #9ca3af);\n  font-family: ui-monospace, SFMono-Regular, Consolas, monospace;\n  font-size: 8.5px;\n  line-height: 1;\n}\n\n.done-smiley.green {\n  color: #16a34a;\n}\n\n.done-smiley.amber {\n  color: #d97706;\n}\n\n.done-smiley.red {\n  color: #dc2626;\n}\n\n.done-smiley.muted {\n  color: var(--disabled-text-color, #9ca3af);\n}\n\n.done-score {\n  --mdc-icon-size: 30px;\n  width: 30px;\n  height: 30px;\n}\n\n.done-face-value {\n  font-size: 12px;\n  font-weight: 700;\n  line-height: 1;\n}\n\n.done-score.red, .done-face-value.red {\n  color: #dc2626;\n}\n\n.done-score.amber, .done-face-value.amber {\n  color: #d97706;\n}\n\n.done-score.gold, .done-face-value.gold {\n  color: #c47f16;\n}\n\n.card-corner {\n  width: calc(66px * var(--tb-scale, 1));\n  cursor: pointer;\n  opacity: .85;\n  z-index: 1;\n  flex-direction: column;\n  align-items: center;\n  gap: 1px;\n  transition: opacity .2s;\n  display: flex;\n  position: absolute;\n}\n\n.card-corner:hover {\n  opacity: 1;\n}\n\n.card-corner.tl {\n  top: 6px;\n  left: 10px;\n}\n\n.card-corner.tr {\n  top: 6px;\n  right: 10px;\n}\n\n.corner-ico .intensity-dial {\n  width: 100%;\n  height: 100%;\n}\n\n.corner-ico .pressure-bars {\n  width: 100%;\n  height: 100%;\n  transform: scale(var(--tb-scale, 1));\n  transform-origin: center;\n}\n\n.corner-ico {\n  --mdc-icon-size: calc(22px * var(--tb-scale, 1));\n  width: calc(22px * var(--tb-scale, 1));\n  height: calc(22px * var(--tb-scale, 1));\n}\n\n.corner-lbl {\n  font-size: calc(8px * var(--tb-scale, 1));\n  letter-spacing: .06em;\n  text-transform: uppercase;\n  color: var(--secondary-text-color);\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  max-width: 100%;\n  font-weight: 700;\n  overflow: hidden;\n}\n\n.corner-val {\n  font-size: calc(11px * var(--tb-scale, 1));\n  font-variant-numeric: tabular-nums;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  max-width: 100%;\n  font-weight: 800;\n  overflow: hidden;\n}\n\n.corner-val.wrap {\n  white-space: normal;\n  font-size: calc(10px * var(--tb-scale, 1));\n  text-align: center;\n  -webkit-line-clamp: 2;\n  line-clamp: 2;\n  -webkit-box-orient: vertical;\n  line-height: 1.15;\n  display: -webkit-box;\n}\n\n.corner-ico.green, .corner-val.green {\n  color: #16a34a;\n}\n\n.corner-ico.blue, .corner-val.blue {\n  color: #2563eb;\n}\n\n.corner-ico.amber, .corner-val.amber {\n  color: #d97706;\n}\n\n.corner-ico.red, .corner-val.red {\n  color: #dc2626;\n}\n\n.corner-ico.muted, .corner-val.muted {\n  color: var(--disabled-text-color, #9ca3af);\n}\n\n.corner-ico.int-low, .corner-val.int-low {\n  color: #0891b2;\n}\n\n.corner-ico.int-med, .corner-val.int-med {\n  color: #7c3aed;\n}\n\n.corner-ico.int-high, .corner-val.int-high {\n  color: #db2777;\n}\n\n.corner-ico.gold, .corner-val.gold {\n  color: #c47f16;\n}\n\n.brushhead-svg {\n  width: calc(17px * var(--tb-scale, 1));\n  height: calc(22px * var(--tb-scale, 1));\n}\n\n.brushhead-pct {\n  color: var(--secondary-text-color);\n  font-size: 9px;\n  font-weight: 600;\n}\n\n@container (width <= 350px) {\n  .chip {\n    grid-template-columns: 1fr;\n    justify-items: center;\n    row-gap: 0;\n    padding: 8px 4px;\n    position: relative;\n  }\n\n  .chip-icon, .pressure-bars {\n    grid-row: auto;\n  }\n\n  .chip-label, .chip-value {\n    display: none;\n  }\n\n  .chip-icon.has-letter {\n    position: relative;\n  }\n\n  .chip-icon.has-letter .head-type-letter {\n    font-size: 10px;\n    line-height: 1;\n    display: block;\n    position: absolute;\n    bottom: -1px;\n    right: -4px;\n  }\n\n  .chip-select-hint {\n    --mdc-icon-size: 12px;\n    color: #2563eb;\n    opacity: .6;\n    display: block;\n    position: absolute;\n    bottom: 2px;\n    right: 2px;\n  }\n\n  .tooth-wrap {\n    width: calc(180px * var(--tb-scale, 1));\n    height: calc(180px * var(--tb-scale, 1));\n  }\n\n  .timer-display {\n    font-size: calc(26px * var(--tb-scale, 1));\n  }\n\n  .card-corner {\n    width: calc(54px * var(--tb-scale, 1));\n  }\n\n  .card-corner.tl {\n    left: 2px;\n  }\n\n  .card-corner.tr {\n    right: 2px;\n  }\n\n  .status-row {\n    grid-template-columns: calc(54px * var(--tb-scale, 1)) 1fr calc(54px * var(--tb-scale, 1));\n    width: calc(100% + 24px);\n    margin-left: -12px;\n    margin-right: -12px;\n  }\n}\n";


// AUTO-GENERATED by scripts/gen_build_info.mjs at build time. Do not edit or commit.
const $de15c9db4b7b9358$export$17b81730949de002 = "2026-08-24T18:44Z";


const $930552a63f9e9686$export$d5e7ce6d07daf10f = "0.36.0";
const $930552a63f9e9686$export$1a6ef95039f86f17 = {
    oralb: {
        translationKey: 'toothbrush_state',
        broadcast: true
    },
    // Oral-B Live (custom integration) mirrors the built-in oralb translation
    // keys on purpose, so every reading below maps through the shared branch
    // in findDeviceEntities and no separate handling is needed. It does hold a
    // connection, though, and reports the handle as unavailable when it drops.
    oralb_live: {
        translationKey: 'toothbrush_state'
    },
    philips_sonicare_ble: {
        translationKey: 'handle_state'
    },
    xiaomi_ble: {
        idSuffix: '_toothbrush',
        broadcast: true
    },
    laifen_ble: {
        translationKey: 'status',
        idSuffix: '_status'
    }
};
// How long a broadcasting handle may stay quiet before the card stops claiming
// it is there.
//
// A resting handle does not advertise at all, so this only has to cover the
// tail after a session: a capture from two iO handles on 2026-08-13 showed one
// going silent the moment its session ended and the other carrying on for 96 s.
// Two minutes clears that with room to spare, and being generous costs nothing
// - the icon simply goes dark a little later.
//
// The consequence is deliberate: for a handle that only broadcasts, this icon
// is dark almost all day and lights up around a session. That is the truth of
// it. There is no connection to a brush sitting in its holder, and the old
// behaviour - permanently "connected" because the last advertised values were
// still readable - was the alternative.
const $930552a63f9e9686$var$BROADCAST_SILENCE_SECONDS = 120;
const $930552a63f9e9686$export$ca79bccd8b43d665 = new Set([
    'idle',
    'session_summary',
    'post_brushing_summary',
    'post_brushing_statistics'
]);
function $930552a63f9e9686$export$c7389aaeaea1415e({ integration: integration, connectionState: connectionState, status: status, lastUpdated: lastUpdated, now: now }) {
    if (connectionState !== undefined && connectionState !== null) return connectionState === 'on';
    if ($930552a63f9e9686$export$1a6ef95039f86f17[integration]?.broadcast === true) {
        const at = Date.parse(lastUpdated);
        return Number.isFinite(at) && (now - at) / 1000 < $930552a63f9e9686$var$BROADCAST_SILENCE_SECONDS;
    }
    return status !== 'unavailable' && status !== 'unknown';
}
function $930552a63f9e9686$export$f8997d7b344b36dd(entity) {
    const m = $930552a63f9e9686$export$1a6ef95039f86f17[entity.platform];
    if (!m) return false;
    return m.translationKey && entity.translation_key === m.translationKey || m.idSuffix && entity.entity_id.endsWith(m.idSuffix) || false;
}
// Progress-bar gradient endpoints (blue → green across the full track).
// The track is sliced into one sub-bar per sector, so each sub-bar gets
// its slice of this gradient instead of restarting it per segment.
const $930552a63f9e9686$var$PROGRESS_GRADIENT_FROM = [
    0x3b,
    0x82,
    0xf6
];
const $930552a63f9e9686$var$PROGRESS_GRADIENT_TO = [
    0x16,
    0xa3,
    0x4a
];
function $930552a63f9e9686$var$progressColorAt(fraction) {
    const c = $930552a63f9e9686$var$PROGRESS_GRADIENT_FROM.map((v, i)=>Math.round(v + ($930552a63f9e9686$var$PROGRESS_GRADIENT_TO[i] - v) * fraction));
    return `rgb(${c[0]},${c[1]},${c[2]})`;
}
// The intensity gauge sweeps 240° of a circle of radius 8.5 around (12, 13):
// from the lower left, clockwise over the top, to the lower right. Declared
// once because the track and the filled arc trace the same line, and
// `pathLength="100"` lets the fill be set as a percentage.
const $930552a63f9e9686$var$INTENSITY_ARC = 'M4.64 17.25 A8.5 8.5 0 1 1 19.36 17.25';
const $930552a63f9e9686$export$5055f2a665f9cd1e = [
    'lower_left',
    'lower_right',
    'upper_left',
    'upper_right'
];
const $930552a63f9e9686$export$d18f9bb4634fc18d = [
    'lower_left',
    'lower_front',
    'lower_right',
    'upper_right',
    'upper_front',
    'upper_left'
];
const $930552a63f9e9686$export$bde3a8f4155c4c5 = [
    {
        name: 'Blue',
        color: '#0085FF'
    },
    {
        name: 'Light Blue',
        color: '#AEF0FF'
    },
    {
        name: 'Turquoise',
        color: '#4CEAC8'
    },
    {
        name: 'Light Green',
        color: '#CBF68F'
    },
    {
        name: 'Yellow',
        color: '#FFDC00'
    },
    {
        name: 'Orange',
        color: '#FF782C'
    },
    {
        name: 'Pink',
        color: '#F825BB'
    },
    {
        name: 'Purple',
        color: '#7036CF'
    },
    {
        name: 'Light Purple',
        color: '#D9C1FF'
    },
    {
        name: 'White',
        color: '#FFFFFF'
    }
];
const $930552a63f9e9686$export$90cb18bb95996ff0 = '#FFFFFF';
// The `#RRGGBB` an integration reports for the handle's own light ring.
const $930552a63f9e9686$var$RING_COLOR_PATTERN = /^#[0-9a-f]{6}$/i;
// What an Oral-B handle stores for its ring is not a screen colour but the
// drive level of three LEDs behind a diffuser, and the three are not equally
// bright per unit of drive. The handle's own "white" is the calibration: the
// drive that makes the ring look white says how much each channel is worth.
//
// Measured on two iO handles by stepping through the colour menu and reading
// the value back for each name (21 August 2026):
//
//   white   44CF63     yellow  80FF00     blue   0F5BCC
//   pink    B2091A     orange  FC7000     turquoise 00FF3D
//
// Scaling each channel by 255/white and clamping turns white into white by
// construction - and then puts yellow at hue 60 and orange at hue 32, exactly
// where their names say. Five colours the factors were not derived from land
// on their own names, which is what makes this a measurement rather than a
// fit.
const $930552a63f9e9686$var$RING_LED_WHITE = [
    0x44,
    0xCF,
    0x63
];
// Only Oral-B handles are known to report drive levels. Another integration
// that one day reports a real screen colour must not have it stretched.
const $930552a63f9e9686$var$RING_LED_PLATFORM = /^oralb/;
/** A drive-level triple as the colour the ring shows. */ function $930552a63f9e9686$var$correctRingDrive(value) {
    const channels = [
        1,
        3,
        5
    ].map((i)=>parseInt(value.slice(i, i + 2), 16));
    return '#' + channels.map((channel, i)=>Math.min(255, Math.round(channel * 255 / $930552a63f9e9686$var$RING_LED_WHITE[i]))).map((channel)=>channel.toString(16).padStart(2, '0').toUpperCase()).join('');
}
function $930552a63f9e9686$export$3377c1afbe28d21(hass, entityIds) {
    const ringEntityId = entityIds?.ring_color;
    const ring = ringEntityId ? hass?.states?.[ringEntityId]?.state : null;
    if (typeof ring !== 'string') return null;
    const value = ring.trim();
    if (!$930552a63f9e9686$var$RING_COLOR_PATTERN.test(value)) return null;
    const platform = hass?.entities?.[ringEntityId]?.platform || '';
    return $930552a63f9e9686$var$RING_LED_PLATFORM.test(platform) ? $930552a63f9e9686$var$correctRingDrive(value) : value;
}
function $930552a63f9e9686$export$c8ce324ef1c101d6(config, hass, entityIds) {
    const configured = (config?.accent_color || '').trim();
    if (configured) return configured;
    return $930552a63f9e9686$export$3377c1afbe28d21(hass, entityIds) || $930552a63f9e9686$export$90cb18bb95996ff0;
}
const $930552a63f9e9686$export$40ce16d54e81e005 = {
    green: '#16a34a',
    amber: '#d97706',
    red: '#dc2626'
};
const $930552a63f9e9686$export$334d820851c0d6af = [
    'battery',
    'pressure',
    'intensity',
    'mode',
    'score',
    'brush_head',
    'head_time',
    'head_type'
];
const $930552a63f9e9686$export$b6dc3c540a3cf071 = [
    'top_left',
    'top_right',
    'bottom_left',
    'bottom_right'
];
function $930552a63f9e9686$export$367d6925611d406e(layout, ids) {
    if (!ids) return layout;
    const hasPressure = !!(ids.pressure_state || ids.pressure);
    const hasIntensity = !!ids.intensity;
    // Devices with neither contact feedback nor a mode reading (e.g. Xiaomi)
    // would render a lone battery chip under the classic default; give them a
    // battery/score/brush-head row instead. Only the untouched default is
    // rewritten — an explicit layout is respected as-is.
    if (layout.defaulted && !hasPressure && !hasIntensity && !ids.mode && !ids.mode_select && ids.score) return {
        chips: [
            'battery',
            'score',
            'brush_head'
        ],
        corners: {}
    };
    // Only the neutral default 'pressure' is rewritten, and only for handles
    // that have intensity but no pressure — an explicit choice is left intact so
    // a device exposing both can carry either (or both).
    const swap = (p)=>{
        if (p === 'pressure' && !hasPressure && hasIntensity) return 'intensity';
        return p;
    };
    const seen = new Set();
    const keep = (p)=>{
        const q = swap(p);
        if (seen.has(q)) return null;
        seen.add(q);
        return q;
    };
    const chips = layout.chips.map(keep).filter(Boolean);
    const corners = {};
    for (const [k, v] of Object.entries(layout.corners)){
        const q = keep(v);
        if (q) corners[k] = q;
    }
    return {
        chips: chips,
        corners: corners
    };
}
function $930552a63f9e9686$export$d859d72b10c9a984(config) {
    const raw = config?.layout;
    if (!raw || typeof raw !== 'object') // `defaulted` lets resolveLayoutForDevice swap in a device-appropriate
    // default without ever touching an explicitly configured layout.
    return {
        chips: [
            'battery',
            'pressure',
            'mode'
        ],
        corners: {
            top_right: 'brush_head'
        },
        defaulted: true
    };
    const seen = new Set();
    const take = (p)=>{
        if (!$930552a63f9e9686$export$334d820851c0d6af.includes(p) || seen.has(p)) return false;
        seen.add(p);
        return true;
    };
    const chips = [];
    if (Array.isArray(raw.chips)) for (const p of raw.chips){
        if (chips.length >= 4) break;
        if (take(p)) chips.push(p);
    }
    const corners = {};
    for (const pos of $930552a63f9e9686$export$b6dc3c540a3cf071){
        const p = raw.corners?.[pos];
        if (p && take(p)) corners[pos] = p;
    }
    return {
        chips: chips,
        corners: corners
    };
}
function $930552a63f9e9686$export$23f5d0f4bf90bc55(hass, deviceId) {
    const entityKeys = {
        sector: null,
        duration: null,
        mode: null,
        pressure: null,
        pressure_state: null,
        intensity: null,
        battery: null,
        status: null,
        base_entity: null,
        number_of_sectors: null,
        model_number: null,
        routine_length: null,
        routine_length_number: null,
        integration: null,
        brushhead_wear: null,
        brushhead_type: null,
        refill_days: null,
        refill_brushing_time: null,
        brushhead_sessions: null,
        activity: null,
        mode_select: null,
        esp_bridge_alive: null,
        ble_connected: null,
        score: null,
        pacer_30s: null,
        smiley: null,
        last_session: null,
        last_session_duration: null,
        ring_color: null
    };
    const allEntities = hass.entities;
    for(const entityId in allEntities){
        const entity = allEntities[entityId];
        if (entity.device_id !== deviceId) continue;
        if (!entityKeys.integration && entity.platform) entityKeys.integration = entity.platform;
        const state = hass.states[entityId];
        const deviceClass = state?.attributes?.device_class;
        // xiaomi_ble: the library names entities itself (no translation_key),
        // so readings are matched by entity_id suffix. The broadcast carries
        // no live duration or sectors — those are synthesized from time.
        if (entity.platform === 'xiaomi_ble') {
            if (entity.entity_id.endsWith('_toothbrush')) entityKeys.status = entity.entity_id;
            else if (entity.entity_id.endsWith('_score')) entityKeys.score = entity.entity_id;
            else if (entity.entity_id.endsWith('_consumable')) {
                // Xiaomi reports the percentage LEFT on the head; the card
                // tracks wear, so the reading is inverted where it's used.
                // The sensor comes from MiBeacon object 0x1013, defined as
                // "Remaining amount of consumables" with a "Remaining
                // percentage, range 0~100" — so it is what is left, not what
                // has been used. xiaomi_ble's own parser only calls it
                // "Consumable (in percent)" and leaves the direction open,
                // which is why the definition is cited here rather than the
                // integration.
                entityKeys.brushhead_wear = entity.entity_id;
                entityKeys.brushhead_remaining = true;
            }
        }
        // laifen_ble: handled entirely here (note the continue) because two of
        // its translation_keys collide with mappings below — its `mode` exists
        // as both sensor and select, and its `brushing_time` is the configured
        // session length in minutes, not the elapsed time the shared branch
        // expects. Releases up to 3.0.2 ship no translation_keys, so every
        // role also matches by entity_id suffix (always English there).
        if (entity.platform === 'laifen_ble') {
            const tk = entity.translation_key;
            const domain = entityId.split('.')[0];
            const match = (dom, key, suffix)=>domain === dom && (tk === key || !tk && entityId.endsWith(suffix));
            if (match('sensor', 'status', '_status')) entityKeys.status = entityId;
            else if (match('sensor', 'timer', '_timer')) // Synthetic elapsed seconds; keeps counting across short
            // pauses and only resets after ~60s of idle.
            entityKeys.duration = entityId;
            else if (match('sensor', 'brushing_duration', '_brushing_duration')) {
                // Configured session length in seconds (models with an
                // adjustable duration). Preferred over brushing_time.
                entityKeys.routine_length = entityId;
                entityKeys.routine_length_minutes = false;
            } else if (match('number', 'brushing_duration', '_brushing_duration_adjustment')) // The adjustable session length, in minutes. On the Wave (V1)
            // this is the only source: 3.0.3 drops the Brushing Time sensor
            // there, and the Brushing Duration sensor above is registered
            // on every device but stays unavailable unless the handle
            // reports the key (Wave Pro does, Wave does not). Kept beside
            // the sensor instead of replacing it, so the mapping stays a
            // pure registry lookup and the value side takes whichever of
            // the two actually reads. Neither handle reports the duration
            // back, so this reads "unknown" until it has been set once —
            // then the default applies, as it did before.
            entityKeys.routine_length_number = entityId;
            else if (match('sensor', 'brushing_time', '_brushing_time') && entityKeys.routine_length === null) {
                // Session length in minutes; fixed-duration models report 0,
                // which the renderer treats as "unknown" (2-minute default).
                entityKeys.routine_length = entityId;
                entityKeys.routine_length_minutes = true;
            } else if (match('select', 'mode', '_mode')) entityKeys.mode_select = entityId;
            else if (match('sensor', 'mode', '_mode')) entityKeys.mode = entityId;
            else if (match('sensor', 'active_strength', '_strength')) // The vibration strength the handle is currently running at.
            // A level, not a category: 1-10 in the ordinary modes and
            // 11-20 in the high-frequency one, so the value says which
            // scale it is on without the mode having to be read.
            //
            // The read-only sensor rather than the `vibration_strength`
            // number beside it: the chip reports what the handle is doing,
            // and the number is the control for changing it.
            entityKeys.intensity = entityId;
            else if (match('binary_sensor', 'over_pressure_active', '_pressing_too_hard')) entityKeys.pressure = entityId;
            else if (match('binary_sensor', 'connection', '_connection')) entityKeys.ble_connected = entityId;
            else if (match('switch', 'reminder_30s', '_30s_reminder')) // The handle's own 30-second pacer — used to align the
            // card's time-based sectors with the device's buzz rhythm.
            entityKeys.pacer_30s = entityId;
            else if (entityKeys.battery === null && deviceClass === 'battery') entityKeys.battery = entityId;
            continue;
        }
        // Shared translation_keys (OralB + Sonicare >= 0.8)
        if (entity.translation_key === 'sector') entityKeys.sector = entity.entity_id;
        else if (entity.translation_key === 'number_of_sectors') entityKeys.number_of_sectors = entity.entity_id;
        else if (entity.translation_key === 'mode') entityKeys.mode = entity.entity_id;
        else if (entity.translation_key === 'pressure') entityKeys.pressure = entity.entity_id;
        else if (entity.translation_key === 'toothbrush_state') entityKeys.status = entity.entity_id;
        else if (entity.translation_key === 'smiley') // oralb_live only: the handle's own display face, shown in the
        // done badge rather than as a chip — it is a session result, and
        // between sessions the sensor reads `off`.
        entityKeys.smiley = entity.entity_id;
        else if (entity.translation_key === 'refill_days' || entity.translation_key === 'refill_brushing_time') // Oral-B counts a brush head down rather than up: days left and
        // brushing hours left, both absolute remainders with no lifetime
        // total behind them, so neither can honestly become a wear
        // percentage. They also sit on the toothbrush itself rather than
        // on a brush-head device of their own, which is why they are
        // matched here and not in the related-device pass below.
        entityKeys[entity.translation_key === 'refill_days' ? 'refill_days' : 'refill_brushing_time'] = entity.entity_id;
        else if (entity.translation_key === 'last_session') // The handle's own record of the session it last finished, read
        // back from the device rather than watched happening. It is the
        // one source that still knows what a session was after the fact,
        // which is exactly when a card that was closed needs to be told.
        entityKeys.last_session = entity.entity_id;
        else if (entity.translation_key === 'last_session_duration') entityKeys.last_session_duration = entity.entity_id;
        else if (entity.translation_key === 'ring_color') // The colour the handle's own light ring is set to, which the card
        // can adopt as its accent. Only the selected device's is read: a
        // charging station publishes the colour of its own ring under a
        // key of its own, and that one belongs to a different device.
        entityKeys.ring_color = entity.entity_id;
        // Sonicare translation_keys
        if (entity.translation_key === 'handle_state') entityKeys.status = entity.entity_id;
        else if (entity.translation_key === 'brushing_mode') entityKeys.mode = entity.entity_id;
        else if (entity.translation_key === 'pressure_state') // Categorical pressure state (ok / optimal / too_high). Kept
        // separate so it can take precedence over the raw grams
        // 'pressure' sensor and the 'intensity' fallback regardless of
        // entity iteration order.
        //
        // The `pressure_alert` binary sensor beside it is deliberately not
        // mapped: philips_sonicare_ble gates both on the same IMU service,
        // so it never exists without this one, and this one always wins
        // where the value is read. It was mapped when the card first
        // learned Sonicare — one day after the integration gained
        // pressure_state — and only ever competed with the raw grams
        // sensor for the same slot, which is a number in a chip that shows
        // a word.
        entityKeys.pressure_state = entity.entity_id;
        else if (entity.translation_key === 'intensity') entityKeys.intensity = entity.entity_id;
        else if (entity.translation_key === 'model_number') entityKeys.model_number = entity.entity_id;
        else if (entity.translation_key === 'activity') entityKeys.activity = entity.entity_id;
        else if (entity.translation_key === 'brushing_time') entityKeys.duration = entity.entity_id;
        else if (entity.translation_key === 'brushing_mode_select') entityKeys.mode_select = entity.entity_id;
        else if (entity.translation_key === 'esp_bridge_alive') entityKeys.esp_bridge_alive = entity.entity_id;
        else if (entity.translation_key === 'routine_length') entityKeys.routine_length = entity.entity_id;
        if (deviceClass) {
            if (entityKeys.battery === null && deviceClass === 'battery') entityKeys.battery = entity.entity_id;
            else if (entityKeys.duration === null && deviceClass === 'duration') entityKeys.duration = entity.entity_id;
        }
        if (entityKeys.status === null && entityKeys.base_entity === null) {
            if (!entity.entity_id.includes('_') || entity.entity_id.endsWith(deviceId)) entityKeys.base_entity = entity.entity_id;
        }
    }
    if (entityKeys.status !== null) {
        entityKeys.base_entity = entityKeys.status;
        entityKeys.status = null;
    }
    // Search related devices (child + same config entry) for additional entities
    if (hass.devices) {
        const mainDevice = hass.devices[deviceId];
        const configEntries = mainDevice?.config_entries || [];
        const relatedDevices = Object.values(hass.devices).filter((d)=>d.id !== deviceId && (d.via_device_id === deviceId || d.config_entries?.some((ce)=>configEntries.includes(ce))));
        for (const related of relatedDevices)for(const entityId in allEntities){
            const entity = allEntities[entityId];
            if (entity.device_id !== related.id) continue;
            if (entity.translation_key === 'brushhead_wear') entityKeys.brushhead_wear = entity.entity_id;
            else if (entity.translation_key === 'brushhead_type') entityKeys.brushhead_type = entity.entity_id;
            else if (entity.translation_key === 'brushhead_sessions_left') entityKeys.brushhead_sessions = entity.entity_id;
            else if (entity.translation_key === 'esp_bridge_alive') entityKeys.esp_bridge_alive = entity.entity_id;
            else if (entity.translation_key === 'ble_connected') entityKeys.ble_connected = entity.entity_id;
        }
    }
    return entityKeys;
}
class $930552a63f9e9686$export$e2f41388bb2b94a0 extends (0, $528e4332d1e3099e$export$3f2f9f5909897157) {
    set hass(hass) {
        this._hass = hass;
        // retry entity discovery until base_entity is found
        if ((!this._entityIds || !this._entityIds.base_entity) && this.config?.device_id) this._entityIds = this._findAndMapEntitiesInConfig(hass, this.config.device_id);
        this.requestUpdate();
    }
    get hass() {
        return this._hass;
    }
    constructor(){
        super();
        this._applySectorState((0, $19924b6af6e06bb0$export$e4cc5c0ab851a015)());
        this._historyRecapState = null;
        this._historyRecapRetryAt = 0;
        // Completion latch (issue #4): persist the finished-session view. The
        // rules live in session-state.js; the card only holds the values.
        this._applySessionState((0, $b973a26f761c9c78$export$45f28d9c2b1af70)());
    }
    /** The latch state, gathered from the fields the card renders from. */ _sessionState() {
        return {
            peakDuration: this._peakDuration,
            completed: this._completed,
            completedDuration: this._completedDuration,
            completedAt: this._completedAt,
            completedIsFull: this._completedIsFull,
            wasActiveSession: this._wasActiveSession,
            sessionRoutineLength: this._sessionRoutineLength,
            sessionStepSeconds: this._sessionStepSeconds,
            holdDismissed: this._holdDismissed,
            stashedRecap: this._stashedRecap,
            face: this._face,
            completedFace: this._completedFace,
            completedScore: this._completedScore,
            completedSource: this._completedSource,
            completedPressure: this._completedPressure,
            completedTarget: this._completedTarget,
            completedStepSeconds: this._completedStepSeconds,
            completedFromStash: this._completedFromStash,
            baselineSessionId: this._baselineSessionId
        };
    }
    /**
     * Write a latch state back onto those fields.
     *
     * They stay individual properties rather than one object because the
     * template and the dismiss handling read them by name, and because lit
     * change detection is per property.
     */ _applySessionState(state) {
        this._peakDuration = state.peakDuration;
        this._completed = state.completed;
        this._completedDuration = state.completedDuration;
        this._completedAt = state.completedAt;
        this._completedIsFull = state.completedIsFull;
        this._wasActiveSession = state.wasActiveSession;
        this._sessionRoutineLength = state.sessionRoutineLength;
        this._sessionStepSeconds = state.sessionStepSeconds;
        this._holdDismissed = state.holdDismissed;
        this._stashedRecap = state.stashedRecap;
        this._face = state.face;
        this._completedFace = state.completedFace;
        this._completedScore = state.completedScore;
        this._completedSource = state.completedSource;
        this._completedPressure = state.completedPressure;
        this._completedTarget = state.completedTarget;
        this._completedStepSeconds = state.completedStepSeconds;
        this._completedFromStash = state.completedFromStash;
        this._baselineSessionId = state.baselineSessionId;
    }
    // --- Dismiss persistence (issue #4/#5/#11) ---
    // localStorage only stores the dismissed marker (× on the badge) per
    // device — it suppresses re-deriving the same session until a new one
    // starts. The recap itself is re-derived on load from frozen sensor
    // values or recorder history, so it works on any browser or device.
    _holdStorageKey(deviceId) {
        return `toothbrush-card-hold-${deviceId}`;
    }
    _loadDismissed(deviceId) {
        try {
            const raw = localStorage.getItem(this._holdStorageKey(deviceId));
            return !!(raw && JSON.parse(raw)?.dismissed);
        } catch (e) {
            return false;
        }
    }
    _dismissHold() {
        this._completed = false;
        this._completedAt = 0;
        this._completedDuration = 0;
        this._completedIsFull = false;
        this._holdDismissed = true;
        // The zones belong to the session, not to the card, so they go with
        // it: on a handle that reports revisits the visited set is what holds
        // a zone finished, and kept it would mark the ring for a session no
        // longer on screen.
        this._applySectorState((0, $19924b6af6e06bb0$export$e4cc5c0ab851a015)());
        const deviceId = this.config?.device_id;
        if (deviceId) try {
            localStorage.setItem(this._holdStorageKey(deviceId), JSON.stringify({
                dismissed: true
            }));
        } catch (e) {}
        this.requestUpdate();
    }
    _clearDismissed(deviceId) {
        try {
            localStorage.removeItem(this._holdStorageKey(deviceId));
        } catch (e) {}
    }
    // --- History recap (issue #11) ---
    // When the post-session values are already wiped, the last session is
    // rebuilt from recorder history: one WebSocket query for the duration
    // entity, then a scan for the last "mountain" (rise to a peak, then
    // wiped back to 0). Only the peak and its timestamp are needed — the
    // completed view renders all zones as done. Opt out with
    // `history_recap: false`.
    //
    // The routine length rides along in the same query (issue #18). It decides
    // whether the session counts as complete, and the current state is the
    // wrong source for it twice over: it describes the routine set *now*, not
    // the one that governed the past session, and an integration that connects
    // actively (oralb_live) reports it as unavailable once the brush is back on
    // the charger — precisely when this rebuild has to run.
    // How far back an unbounded recap may reach. Mirrors the history
    // rebuild's own lookback, so both sources age out together.
    static MAX_RECAP_AGE_MS = 2592000000;
    // How far apart two accounts of a session may be dated and still be the
    // same session. Only the record needs the room: it dates a session from
    // the handle's counter, to within a minute, while history dates it from
    // the reading itself.
    //
    // Must stay above the minute the record is given further down when it
    // offers itself against a session already on the badge. A rebuilt
    // session that displaces a record is offered that record again on the
    // very next render, and only that minute turns it away; were this the
    // smaller of the two, every rebuild would be taken back one render after
    // it arrived - and never asked for again, the query having already run.
    static RECORD_CLOCK_SLACK_MS = 120000;
    /**
     * A record's session number, or null where there is none.
     *
     * Integrations that number their sessions report a count; those that do
     * not report the field as `null` - and `Number(null)` is 0, a perfectly
     * finite number that would compare equal to another record's absent one
     * and read as "the same session" for every session ever recorded.
     */ static _sessionNumber(raw) {
        if (raw === null || raw === undefined || raw === '') return null;
        const n = Number(raw);
        return Number.isFinite(n) ? n : null;
    }
    _recapFromLastSession(hass, config, entityIds, routineFromEntity, notBefore = 0) {
        // The handle's own record of its last session, if the integration
        // offers one. Preferred over rebuilding the session from recorder
        // history for three reasons: it is what the device concluded rather
        // than what a series of readings implies, it needs no recorder and
        // no round trip, and it is right even where history is blind — a
        // session brushed while Home Assistant was down leaves no rows to
        // reconstruct, but the handle still remembers it.
        //
        // Returns whether a recap was built, so the caller knows whether the
        // history query is still needed.
        const stateObj = entityIds.last_session ? hass.states[entityIds.last_session] : null;
        if (!stateObj || stateObj.state === 'unknown' || stateObj.state === 'unavailable') return false;
        const attrs = stateObj.attributes || {};
        const startedAt = Date.parse(stateObj.state);
        if (!Number.isFinite(startedAt)) return false;
        // The duration lives on the record, but the integrations that expose
        // one also expose it as a reading of its own — either will do.
        const duration = Number(attrs.duration_seconds ?? (entityIds.last_session_duration ? hass.states[entityIds.last_session_duration]?.state : NaN));
        if (!Number.isFinite(duration) || duration < (0, $b973a26f761c9c78$export$2a3bc4b7d268e4d6)) return false;
        // The state is when the session BEGAN. Both handles that file a
        // record stamp it as the session starts - it is the quantity they
        // measure, and the end is arithmetic on top of it - so that is what
        // the integrations report. A recap is about an ending, though: it
        // says how long ago somebody finished brushing, and it has to be
        // told apart from the session before it. So the end is worked out
        // here, once, and everything below deals in it.
        const endedAt = startedAt + duration * 1000;
        const fromStore = !attrs.source || attrs.source === 'retained_session';
        // The verdict the handle showed when this session ended, as the
        // record filed it. The live face sensor is no substitute: the display
        // goes back to sleep about a minute later, so a dashboard opened
        // afterwards - or a Home Assistant that restarted in between - never
        // sees one. The record outlives both.
        //
        // Whether the field is there at all separates two different silences.
        // An integration that does not file faces says nothing about the
        // session's verdict, and whatever the card watched the display show
        // still stands. One that files the field and leaves it empty is
        // saying it captured no verdict for this session - which is a
        // reading, and the reason the field is never filled with a stand-in.
        const recordFace = (0, $b973a26f761c9c78$export$efabde77493fd6f1)(attrs.display_face) ? attrs.display_face : null;
        const recordFilesFace = attrs.display_face !== undefined;
        // Already on the badge, unchanged. The branch that offers a record
        // now runs on every render for as long as a better one could still
        // arrive, and adopting this one again would request a render from
        // inside a render - and go round for as long as the handle takes.
        // It passed every check below when it was first adopted.
        if (this._completedSource === 'device' && this._completedAt === endedAt && this._completedDuration === duration && this._completedFromStore === fromStore) {
            // Except for the face, which arrives after the record it belongs
            // to. A handle is switched off before it shows its verdict, so
            // the integration files the session first and fills the face in
            // over the seconds that follow - by which point everything above
            // matches and this recap would otherwise be left as it was.
            if (recordFace && this._face !== recordFace) {
                this._face = recordFace;
                this._completedFace = recordFace;
                this.requestUpdate();
            }
            return true;
        }
        // Replacing a recap that is already on screen, rather than building
        // the first one: only a record of that same session or a later one
        // will do. A handle that files its record late still holds the
        // previous session's until it does, and that one is not this one.
        //
        // Sessions are numbered in order, so where both the mark taken at the
        // start of this session and the record's own number are known, the
        // question is settled by comparing them - a later number is a later
        // session, and no clock is involved. The times are the fallback, and
        // a poor one: the record's is reconstructed from the handle's own
        // counter while the mark is taken whenever the card got round to
        // rendering, so the two drift apart for reasons that have nothing to
        // do with which session is which.
        if (notBefore) {
            // How far before the mark a record may be dated and still be
            // this session. The mark is meant to be the moment a session was
            // seen to end - which it is where the card watched one, and
            // where the recorder placed one, both accurate to seconds.
            //
            // Not where the recap was worked out from the readings left
            // standing: there the mark is the last time the duration reading
            // changed, and on a handle that has been away that is when it
            // came back - minutes or hours after the session it describes.
            // The handle's own record of that very session then reads as an
            // older one and is thrown away, which is how a correct record
            // went unused after a reload. So the allowance there is the
            // window the recap is shown for at all: anything older is not
            // this session by any reading, and anything newer cannot be
            // ruled out.
            //
            // The numbers are unaffected either way - they never involve a
            // clock, and they settle it wherever both sides have one.
            const holdWindow = config.hold_duration !== undefined ? (Number(config.hold_duration) || 0) * 3600000 : 1800000;
            const slack = this._completedSource === 'reading' ? holdWindow || this.constructor.MAX_RECAP_AGE_MS : 60000;
            const recordId = this.constructor._sessionNumber(attrs.session_id);
            const mark = this._baselineSessionId;
            if (mark !== null && mark !== undefined && recordId !== null) {
                // Same number as the mark: the handle is still holding the
                // session it had before this one, and that is not this one.
                if (recordId === mark) return false;
                // Lower: the numbering went backwards, which it cannot do by
                // counting - a handle reset, or a device that numbers its
                // sessions some other way entirely. Either way the mark says
                // nothing about this record, so it is dropped and the times
                // decide, as they did before there was a mark at all.
                if (recordId < mark) {
                    this._baselineSessionId = null;
                    if (endedAt < notBefore - slack) return false;
                }
            } else if (endedAt < notBefore - slack) return false;
        }
        // With no hold window there is nothing to expire a recap, and a
        // record outlives restarts - so an ancient one would sit there as
        // the current session forever. The same bound the history rebuild
        // uses for its lookback applies here.
        const holdHours = config.hold_duration !== undefined ? Number(config.hold_duration) || 0 : 0.5;
        if (holdHours <= 0 && Date.now() - endedAt > this.constructor.MAX_RECAP_AGE_MS) return false;
        // The integration says so when the handle has finished a session it
        // has not written down yet: some only file the record as they switch
        // off, a minute or more after the motor stops. Until the newer one
        // arrives, this record describes the session before the one somebody
        // just brushed, and showing it as the recap would be worse than
        // showing nothing - the reading is right, the claim is not.
        if (attrs.superseded) return false;
        // The integration says how it arrived at the time. "collection" means
        // only that the session was already over when the record was read -
        // it could be days old, and the badge would announce it as just now.
        // A recap is a when as much as a what, so without a trustworthy when
        // there is nothing honest to show.
        if (attrs.time_source === 'collection') return false;
        // Same precedence as the history rebuild: an explicit setting wins,
        // then what the record itself says it was aiming for, then the
        // current reading. A device that reports a routine but cannot name
        // one right now gets no recap rather than a wrong verdict.
        const target = Number(config.routine_length) || Number(attrs.target_duration_seconds) || routineFromEntity || (entityIds.routine_length || entityIds.routine_length_number ? 0 : (0, $b973a26f761c9c78$export$918b2e620e4fca36));
        if (!target) return false;
        // Whether the recap on screen is another account of this same
        // session or of a different one, decided before the fields below
        // overwrite it. Two accounts of one session are dated apart: the
        // record works its ending out from the handle's counter, while a
        // watched one is stamped whenever the card got round to noticing -
        // so the slack the rest of the file already uses for that question
        // settles this one too.
        const sameSessionAsBadge = this._completed && this._completedAt > 0 && Math.abs(this._completedAt - endedAt) <= this.constructor.RECORD_CLOCK_SLACK_MS;
        this._completed = true;
        this._completedIsFull = duration >= target * 0.9;
        this._completedDuration = duration;
        this._completedAt = endedAt;
        this._completedSource = 'device';
        // Read from the handle, or added up by the integration as it watched?
        // Both arrive as this one reading, and the badge must not credit the
        // handle with a session Home Assistant counted itself. Only one value
        // means "read": the others name how the readings reached the
        // integration, which is a different question, and a record from
        // before the field existed is from an integration that only read.
        this._completedFromStore = fromStore;
        // The record's verdict, where it has one. Latched rather than only
        // shown, so it stays put once the handle's display goes back to
        // sleep and the live face reads as nothing again.
        //
        // With no verdict on the record, a face the card watched the display
        // show is kept - but only for the session it was watching. A record
        // of a different session arrives with its own verdict or with none,
        // and neither is the one still on screen, so that face goes with the
        // recap it belonged to. Nothing is put in its place.
        if (recordFace) this._face = recordFace;
        else if (recordFilesFace && !sameSessionAsBadge) this._face = null;
        this._completedFace = this._face;
        this._completedTarget = target;
        // Not every record carries it, and a missing reading is not a
        // reading of none: a session brushed far too hard and one where the
        // handle simply never measured would then look identical, and the
        // second would be praised for it. Absent stays absent, and the
        // verdict below declines rather than guesses.
        const pressure = Number(attrs.pressure_seconds);
        this._completedPressure = Number.isFinite(pressure) ? pressure : null;
        // The record knows how the routine it describes was paced, which the
        // handle no longer does once somebody switches mode. Only from the
        // record: a session rebuilt from readings has no claim on it.
        const steps = Array.isArray(attrs.step_times_seconds) ? attrs.step_times_seconds.map(Number) : null;
        this._completedStepSeconds = steps && steps.length && steps.every((value)=>Number.isFinite(value) && value > 0) ? steps : null;
        this.requestUpdate();
        return true;
    }
    async _maybeLoadRecapFromHistory(hass, config, entityIds, routineFromEntity) {
        if (this._historyRecapState) return;
        if (Date.now() < this._historyRecapRetryAt) return;
        this._historyRecapState = 'pending';
        // The query may outlive this configuration: captured so a device
        // switch in the editor neither blocks the new device's own query nor
        // shows it this device's session.
        const forDevice = config.device_id;
        const holdHours = config.hold_duration !== undefined ? Number(config.hold_duration) || 0 : 0.5;
        // Sessions older than the hold window would be hidden anyway; with
        // hold_duration: 0 ("until next session") there is no time limit, so
        // look back generously — the recorder returns only what it still
        // retains (purge default: 10 days).
        const windowHours = holdHours > 0 ? holdHours : 720;
        const end = new Date();
        const start = new Date(end.getTime() - windowHours * 3600000);
        let rows = [];
        let routineRows = [];
        let routineNumberRows = [];
        try {
            const resp = await hass.callWS({
                type: 'history/history_during_period',
                start_time: start.toISOString(),
                end_time: end.toISOString(),
                entity_ids: [
                    entityIds.duration,
                    entityIds.routine_length,
                    entityIds.routine_length_number
                ].filter(Boolean),
                minimal_response: true,
                no_attributes: true,
                significant_changes_only: false
            });
            rows = resp?.[entityIds.duration] || [];
            routineRows = entityIds.routine_length ? resp?.[entityIds.routine_length] || [] : [];
            routineNumberRows = entityIds.routine_length_number ? resp?.[entityIds.routine_length_number] || [] : [];
        } catch (e) {
            // Recorder still starting, or a transient socket error — retry on
            // a later render instead of giving up for the page's lifetime:
            // for oralb_live this query is the only way back to a recap. The
            // cooldown keeps a recorder that is down from being hammered.
            console.warn('toothbrush-card: history recap query failed', e);
            if (this.config?.device_id === forDevice) {
                this._historyRecapState = null;
                this._historyRecapRetryAt = Date.now() + 30000;
            }
            return;
        }
        // The world may have moved on while the query ran — including to
        // another device, whose state this stale result must not touch.
        if (this.config?.device_id !== forDevice) return;
        this._historyRecapState = 'done';
        // Somebody brushing right now, and a recap somebody has already
        // dismissed, are both answers of their own - neither is a question a
        // query that set off some time ago gets to reopen on arrival.
        if (this._wasActiveSession || this._holdDismissed) return;
        const session = this._lastSessionFromHistory(rows, (0, $b973a26f761c9c78$export$2a3bc4b7d268e4d6));
        if (!session) return;
        // A record is already on the badge. It describes the same session
        // better than a series of readings does - it knows the routine that
        // was running, how hard it was brushed and which session it was - so
        // it is only displaced by a session that is genuinely later, not by
        // one that merely looks it.
        //
        // What "genuinely later" has to survive is the record's own clock: it
        // times a session by the handle's counter rather than by watching one
        // end, and lands within a minute of the truth. History has no such
        // slack - the peak and the wipe that follows it arrive together, so
        // its timestamp is the ending. Twice the record's worst case is
        // therefore the mark, and it still sits below the closest two real
        // sessions can end to one another, since a session takes minutes to
        // brush.
        const displacesTheRecord = this._completedSource === 'device' && session.endedAt > this._completedAt + this.constructor.RECORD_CLOCK_SLACK_MS;
        if (this._completed && !displacesTheRecord) return;
        // An explicit config value wins outright — it exists because the
        // entity's reading is not to be trusted. Then history, then the
        // current entity reading; without any of them the plain default
        // applies — but not for a device that does report a routine, since
        // measuring an aborted long routine against the short default would
        // announce it as complete.
        const target = Number(config.routine_length) || this._routineAtFromHistory(routineRows, session.endedAt, entityIds.routine_length_minutes) || this._routineAtFromHistory(routineNumberRows, session.endedAt, true) || routineFromEntity || (entityIds.routine_length || entityIds.routine_length_number ? 0 : (0, $b973a26f761c9c78$export$918b2e620e4fca36));
        if (!target) return;
        this._completed = true;
        this._completedIsFull = session.duration >= target * 0.9;
        this._completedDuration = session.duration;
        this._completedAt = session.endedAt;
        this._completedSource = 'history';
        this._completedTarget = target;
        // Recorder rows are durations only; a rebuilt session knows nothing
        // about pressure and must not inherit the last one's.
        this._completedPressure = null;
        // Nor its verdict. This branch only ever runs for a session later
        // than the one on the badge, and the face there was that session's -
        // read from its record or watched on the display. Recorder history
        // has no face of its own to put in its place, and none is the honest
        // answer: the session it rebuilt was one nobody was there to see.
        this._face = null;
        this._completedFace = null;
        this.requestUpdate();
    }
    _lastSessionFromHistory(rows, minDuration) {
        // rows: chronological history states; WS compressed keys are
        // s/lu (state / last_updated epoch seconds), REST-style objects
        // use state/last_updated. Returns the newest "mountain" that
        // reached minDuration — shorter blips are skipped, so a button
        // fumble after a real session doesn't hide the recap.
        let last = null;
        let peak = 0;
        let peakTs = 0;
        let prev = 0;
        for (const row of rows){
            const v = parseFloat(row.s !== undefined ? row.s : row.state);
            if (!Number.isFinite(v)) continue;
            const ts = row.lu !== undefined ? row.lu * 1000 : Date.parse(row.last_updated) || 0;
            // A rise out of zero (or a big drop while still positive — two
            // sessions without an observed wipe in between) starts a new
            // mountain; otherwise the peak just keeps growing.
            if (v > 0 && (prev <= 0 || v < prev - 60)) {
                if (peak >= minDuration) last = {
                    duration: peak,
                    endedAt: peakTs
                };
                peak = v;
                peakTs = ts;
            } else if (v >= peak) {
                peak = v;
                peakTs = ts;
            }
            prev = v;
        }
        if (peak >= minDuration) last = {
            duration: peak,
            endedAt: peakTs
        };
        return last;
    }
    _routineAtFromHistory(rows, endedAt, minutes) {
        // The routine length in force when that session ended — rows are
        // chronological, so the last one at or before the peak wins. Same unit
        // handling as the live read. 0 means history could not say (entity not
        // recorded, or only written after the session).
        let seconds = 0;
        for (const row of rows){
            const ts = row.lu !== undefined ? row.lu * 1000 : Date.parse(row.last_updated) || 0;
            if (ts > endedAt) break;
            const v = parseFloat(row.s !== undefined ? row.s : row.state);
            // Skips unavailable/unknown, which is the whole point here.
            if (Number.isFinite(v) && v > 0) seconds = Math.round(v * (minutes ? 60 : 1));
        }
        return seconds;
    }
    connectedCallback() {
        super.connectedCallback();
        if (!this._interval) this._interval = setInterval(()=>this.requestUpdate(), 1000);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        if (this._interval) {
            clearInterval(this._interval);
            this._interval = null;
        }
    }
    setConfig(config) {
        if (!config.device_id) throw new Error('Please enter the device id');
        const deviceChanged = this.config?.device_id !== config.device_id;
        this.config = config;
        if (deviceChanged) {
            // Remap entities and drop the previous device's session state so a
            // held recap from device A never renders for device B; then adopt
            // device B's own persisted hold, if any.
            this._entityIds = null;
            this._historyRecapState = null;
            this._historyRecapRetryAt = 0;
            this._applySessionState({
                ...(0, $b973a26f761c9c78$export$45f28d9c2b1af70)(),
                holdDismissed: this._loadDismissed(config.device_id)
            });
        }
        if (this._hass && !this._entityIds) this._entityIds = this._findAndMapEntitiesInConfig(this._hass, config.device_id);
    }
    getCardSize() {
        return 5;
    }
    /**
     * Inline style for the <ha-card>, exposing the accent color plus the
     * optional tooth/active/done color overrides (issue #6). Colors left
     * unset fall back to the CSS defaults; an accent left unset follows the
     * handle's own ring colour where the device reports one.
     */ _cardStyle() {
        const c = this.config || {};
        const accent = $930552a63f9e9686$export$c8ce324ef1c101d6(c, this._hass, this._entityIds);
        let style = `--accent-color: ${accent}`;
        if (c.tooth_color) style += `; --tb-tooth-color: ${c.tooth_color}`;
        if (c.active_color) style += `; --tb-active-color: ${c.active_color}`;
        if (c.done_color) style += `; --tb-done-color: ${c.done_color}`;
        // Visual-area scale (issue #8): ring, timer, status, corner markers
        // and progress bar. Header and chips keep their size.
        const scale = Number(c.scale);
        if (Number.isFinite(scale) && scale > 0 && scale !== 1) style += `; --tb-scale: ${Math.min(2, Math.max(0.8, scale))}`;
        return style;
    }
    _showMoreInfo(entityId = null) {
        const targetEntityId = entityId || this._entityIds?.base_entity;
        if (!this._hass || !targetEntityId) return;
        this.dispatchEvent(new CustomEvent('hass-more-info', {
            bubbles: true,
            composed: true,
            detail: {
                entityId: targetEntityId
            }
        }));
    }
    _showDeviceInfo() {
        if (!this.config?.device_id) return;
        history.pushState(null, '', `/config/devices/device/${this.config.device_id}`);
        window.dispatchEvent(new CustomEvent('location-changed', {
            bubbles: true,
            composed: true
        }));
    }
    // --- Sector resolution ---
    // The rules live in sector-state.js. These stay as methods because the
    // template and the tests reach for them by name, and because the state is
    // still held as individual properties.
    _sectorState() {
        return {
            highestSector: this._highestSector,
            lastRawIndex: this._lastRawIndex,
            correctedIndex: this._correctedIndex,
            wasActive: this._wasActive,
            visitedSectors: this._visitedSectors
        };
    }
    _applySectorState(state) {
        this._highestSector = state.highestSector;
        this._lastRawIndex = state.lastRawIndex;
        this._correctedIndex = state.correctedIndex;
        this._wasActive = state.wasActive;
        this._visitedSectors = state.visitedSectors;
    }
    _resetSectorCorrection() {
        this._applySectorState((0, $19924b6af6e06bb0$export$3f32d9c2202e56e3)(this._sectorState()));
    }
    /** Looks the enum options up; deciding what they mean is sector-state's. */ _sectorEntityDecodesAllSectors(hass, sectorEntityId) {
        if (!sectorEntityId) return false;
        return (0, $19924b6af6e06bb0$export$2c0026facbbde936)(hass.states[sectorEntityId]?.attributes?.options);
    }
    _correctSectorIndex(rawIndex, active, maxIndex) {
        const result = (0, $19924b6af6e06bb0$export$9494d08c8f9e7fd0)(this._sectorState(), {
            rawIndex: rawIndex,
            active: active,
            maxIndex: maxIndex
        });
        this._applySectorState(result.state);
        return result.index;
    }
    _trackVisitedSector(rawIndex, active) {
        const result = (0, $19924b6af6e06bb0$export$d4ffc2e2aaef11ec)(this._sectorState(), {
            rawIndex: rawIndex,
            active: active
        });
        this._applySectorState(result.state);
        return result.count;
    }
    _parseRawSectorIndex(sector) {
        return (0, $19924b6af6e06bb0$export$ed42d00b6a9a8b37)(sector);
    }
    _getSectorData(sector, activeIndex, sectorOrder, doneCount = null) {
        const sectorClassMaps = {};
        sectorOrder.forEach((s)=>{
            sectorClassMaps[s] = {
                done: false,
                brushing: false
            };
        });
        if (sector === 'success') {
            sectorOrder.forEach((s)=>{
                sectorClassMaps[s].done = true;
            });
            return sectorClassMaps;
        }
        if (activeIndex === -1 || activeIndex >= sectorOrder.length) {
            // No zone is being brushed - idle, or a finished session being
            // held. A count can still be known there: a recap that stopped
            // early carries how far it got, and the ring is where that shows
            // as something other than a number in a sentence.
            if (doneCount) sectorOrder.forEach((name, index)=>{
                if (index < doneCount) sectorClassMaps[name].done = true;
            });
            return sectorClassMaps;
        }
        // Time-based doneCount (Sonicare-Pfad) erlaubt Revisits ohne Done-Reset;
        // Fallback ist index-basiertes Progress-Marking (Oral-B).
        const effectiveDone = doneCount !== null ? Math.max(doneCount, activeIndex) : activeIndex;
        sectorOrder.forEach((sectorName, index)=>{
            if (index === activeIndex) sectorClassMaps[sectorName].brushing = true;
            else if (index < effectiveDone) sectorClassMaps[sectorName].done = true;
        });
        return sectorClassMaps;
    }
    _getSectorLabel(sector, activeIndex, sectorOrder) {
        if (sector === 'success') return (0, $d8078e452c66bdbe$export$625550452a3fa3ec)(this._hass, 'complete');
        if (activeIndex >= 0 && activeIndex < sectorOrder.length) return (0, $d8078e452c66bdbe$export$625550452a3fa3ec)(this._hass, 'zone_' + sectorOrder[activeIndex]);
        return '';
    }
    _getBatteryChipColor(level) {
        const l = parseInt(level, 10);
        if (l <= 15) return 'red';
        if (l <= 30) return 'amber';
        return 'green';
    }
    _getPressureClass(pressure) {
        const p = String(pressure).toLowerCase();
        if (p === 'high') return 'p-high';
        if (p === 'low') return 'p-low';
        if (p === 'normal' || p === 'medium') return 'p-normal';
        return '';
    }
    _getPressureColor(pressure) {
        const p = String(pressure).toLowerCase();
        if (p === 'high') return 'red';
        if (p === 'low') return 'amber';
        if (p === 'normal' || p === 'medium') return 'green';
        return '';
    }
    /**
     * Reduce an intensity reading to low / medium / high for icon and colour.
     *
     * Named levels pass through. A numeric one is graded within the scale it
     * sits on: Laifen reports 1-10 in the ordinary modes and 11-20 in the
     * high-frequency one, so the value itself says which applies and the mode
     * never has to be read. Returns null for anything unreadable, which the
     * callers render as neutral rather than guessing.
     */ _intensityLevel(intensity) {
        const v = String(intensity).toLowerCase();
        if (v === 'low' || v === 'medium' || v === 'high') return v;
        const n = Number(v);
        if (!Number.isFinite(n) || n <= 0) return null;
        const highFrequency = n > 10;
        const min = highFrequency ? 11 : 1;
        const max = highFrequency ? 20 : 10;
        const position = (n - min) / (max - min);
        return position >= 0.67 ? 'high' : position >= 0.34 ? 'medium' : 'low';
    }
    /**
     * Where a reading sits on its scale, 0…1, for the gauge arc and needle.
     *
     * Continuous rather than stepped: a Laifen handle reports 1-10, and the
     * three speedometer icons MDI offers could express almost none of that.
     * The scale is chosen by the value itself - 1-10 in the ordinary modes,
     * 11-20 in the high-frequency one - so the mode never has to be read, and
     * 11 sits at the bottom of its own scale rather than at the top of the
     * other. Returns 0 for anything unreadable.
     *
     * The floor of 0.08 keeps the weakest setting visible: a running handle at
     * strength 1 should read as "on and low", not as "no reading".
     */ _intensityFraction(intensity) {
        const level = this._intensityLevel(intensity);
        if (!level) return 0;
        const n = Number(String(intensity).toLowerCase());
        if (!Number.isFinite(n)) return ({
            low: 0.12,
            medium: 0.5,
            high: 1
        })[level];
        const highFrequency = n > 10;
        const min = highFrequency ? 11 : 1;
        const max = highFrequency ? 20 : 10;
        return 0.08 + 0.92 * ((n - min) / (max - min));
    }
    /**
     * The needle tip for a fraction, on a 240° arc of radius `radius`
     * around (12, 13) — from 210° at the lower left, clockwise to -30°.
     */ _intensityNeedle(fraction, radius) {
        const radians = (210 - 240 * fraction) * Math.PI / 180;
        return {
            x: 12 + radius * Math.cos(radians),
            y: 13 - radius * Math.sin(radians)
        };
    }
    /**
     * The pressure staircase, shared by the chip and the corner marker.
     *
     * How many bars light up comes from the class, not from here, so the
     * markup is the same wherever it is placed.
     */ _pressureBars(pressureClass) {
        return (0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)`
            <div class="pressure-bars ${pressureClass}">
                <div class="pb"></div><div class="pb"></div><div class="pb"></div><div class="pb"></div>
            </div>`;
    }
    /**
     * The gauge itself, shared by the chip and the corner marker.
     *
     * Carries no colour of its own: the caller's wrapper sets it, and every
     * stroke picks it up through currentColor.
     */ _intensityDial(intensity) {
        const fraction = this._intensityFraction(intensity);
        const needle = this._intensityNeedle(fraction, 5.2);
        return (0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)`
            <svg class="intensity-dial" viewBox="0 0 24 24">
                <path class="id-track" d="${$930552a63f9e9686$var$INTENSITY_ARC}" pathLength="100"/>
                <path class="id-arc" d="${$930552a63f9e9686$var$INTENSITY_ARC}" pathLength="100"
                      stroke-dasharray="${Math.round(fraction * 100)} 100"/>
                <line class="id-needle" x1="12" y1="13"
                      x2="${needle.x.toFixed(2)}" y2="${needle.y.toFixed(2)}"/>
                <circle class="id-hub" cx="12" cy="13" r="1.5"/>
            </svg>`;
    }
    _getIntensityColor(intensity) {
        // Own, non-alarming level scale — intensity is a chosen setting, so a
        // high level must never read as a warning (unlike pressure's red).
        const level = this._intensityLevel(intensity);
        if (level === 'high') return 'int-high';
        if (level === 'medium') return 'int-med';
        if (level === 'low') return 'int-low';
        return 'muted';
    }
    _normalizeLayout(config) {
        return $930552a63f9e9686$export$d859d72b10c9a984(config);
    }
    /**
     * How long each pacing step of the running routine lasts, in seconds,
     * where the integration says so (`sector_times_seconds`).
     *
     * A step is one buzz of the handle, not one zone, and the two are not
     * the same number: the Sonicare modes that revisit sectors take eight
     * (White+) or ten (Gum Health) steps over six zones. Dividing the
     * routine by the zone count therefore draws the boundaries where
     * nothing happens - by the end of a Gum Health routine, a third of a
     * step out.
     *
     * Two names, because the integrations mean subtly different things by
     * their lists. `step_times_seconds` is one entry per buzz and is what
     * this wants; `sector_times_seconds` is oralb_live's, one entry per
     * zone, which is the same thing there and only there - its own sector
     * reading says `supports_revisits: false`, so a zone cannot come round
     * twice. Should a handle ever revisit and publish only per-zone times,
     * the per-step list is the one that would have to arrive; hence the
     * order.
     *
     * Read from whichever entity carries it: Sonicare puts it on the mode,
     * where the pacing belongs - it changes when somebody switches routine,
     * not while brushing, and it is there before a session starts. oralb_live
     * puts its own list on the sector count and the routine length, because
     * there the division is a setting of the handle rather than of the mode.
     * Only
     * a list of positive numbers counts; an integration that has the field
     * but no value for it (oralb_live before the pacer has been read) says
     * `null`, and the bar falls back to equal segments.
     */ _routineStepSeconds(hass, entityIds) {
        for (const attribute of [
            'step_times_seconds',
            'sector_times_seconds'
        ])for (const key of [
            'mode',
            'sector',
            'number_of_sectors',
            'routine_length'
        ]){
            const entityId = entityIds[key];
            const raw = entityId ? hass.states[entityId]?.attributes?.[attribute] : null;
            if (!Array.isArray(raw) || !raw.length) continue;
            const seconds = raw.map(Number);
            if (seconds.every((value)=>Number.isFinite(value) && value > 0)) return seconds;
        }
        return null;
    }
    _isActive(status) {
        // Case-insensitive: laifen_ble reports capitalized states.
        const s = String(status).toLowerCase();
        return s === 'running' || s === 'run';
    }
    /**
     * Searching for all needed entities.
     */ _findAndMapEntitiesInConfig(hass, deviceId) {
        return $930552a63f9e9686$export$23f5d0f4bf90bc55(hass, deviceId);
    }
    render() {
        const config = this.config;
        // config.language overrides the HA profile language for this card (#17)
        const hass = config?.language && this._hass ? Object.assign(Object.create(this._hass), {
            language: config.language
        }) : this._hass;
        if (!hass || !config || !this._entityIds) {
            if (hass && config?.device_id) this._entityIds = this._findAndMapEntitiesInConfig(hass, config.device_id);
            else throw new Error('Please enter the device id');
        }
        const entityIds = this._entityIds;
        const device = hass.devices[config.device_id];
        if (!device) // The config points at a device this instance doesn't have
        // (deleted, or a dashboard copied from another install). A
        // render-time throw would just die unseen in the update promise
        // and leave a dead card — show a hint instead.
        return (0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)`<ha-card><div class="device-not-found">${(0, $d8078e452c66bdbe$export$625550452a3fa3ec)(hass, 'device_not_found')}</div></ha-card>`;
        const deviceName = device.name;
        const manufacturer = device.manufacturer || '';
        const modelNumber = entityIds.model_number ? hass.states[entityIds.model_number]?.state || '' : '';
        const headerTitle = config.title || manufacturer || deviceName;
        const rawSub = config.show_subtitle !== false ? modelNumber || deviceName : '';
        const headerSub = rawSub && headerTitle && rawSub.startsWith(headerTitle) ? rawSub.slice(headerTitle.length).trim() : rawSub;
        // Read sensor states
        const numSectorsFromEntity = entityIds.number_of_sectors ? parseInt(hass.states[entityIds.number_of_sectors]?.state) || null : null;
        let numSectors = config.num_sectors || numSectorsFromEntity || 4;
        const statusEntityId = entityIds.base_entity;
        // Lowercased: laifen_ble capitalizes its states (Running/Idle/Unknown).
        const rawStatus = (statusEntityId ? hass.states[statusEntityId]?.state || 'unknown' : 'unknown').toLowerCase();
        // Binary main state entities (xiaomi_ble) report plain on/off.
        const status = rawStatus === 'on' ? 'running' : rawStatus === 'off' ? 'idle' : rawStatus;
        // The built-in oralb integration reports its states with spaces
        // ("post brushing statistics"), oralb_live underscored — the slug is
        // the one spelling locale keys and status sets are written in.
        const statusSlug = status.replace(/ /g, '_');
        // How the running routine paces itself, where the integration says
        // so. Read here rather than at the bar, because the latch needs it
        // too - it belongs to the session, and the session ends first.
        const liveStepSeconds = this._routineStepSeconds(hass, entityIds);
        const active = this._isActive(status);
        // Without a duration entity (Xiaomi broadcasts no live timer) the
        // session time is how long the state entity has been on — the card's
        // 1s refresh keeps it ticking.
        const duration = entityIds.duration ? parseInt(hass.states[entityIds.duration]?.state) || 0 : active && statusEntityId && hass.states[statusEntityId]?.last_changed ? Math.max(0, Math.floor((Date.now() - new Date(hass.states[statusEntityId].last_changed).getTime()) / 1000)) : 0;
        // Pressure and intensity are distinct readings (a handle reports one or
        // the other): pressure is contact feedback with an ok/too-high reading,
        // intensity is a user-set power level. Each has its own chip, colours
        // and icon and is placed independently in the layout.
        const pressureEntity = entityIds.pressure_state || entityIds.pressure;
        const rawPressure = pressureEntity ? hass.states[pressureEntity]?.state || 'N/A' : 'N/A';
        const pressure = rawPressure === 'unavailable' || rawPressure === 'unknown' ? "\u2013" : rawPressure === 'on' || rawPressure === 'too_high' ? 'high' : rawPressure === 'off' || rawPressure === 'ok' || rawPressure === 'optimal' ? 'normal' : rawPressure;
        const intensityEntity = entityIds.intensity;
        const rawIntensity = intensityEntity ? hass.states[intensityEntity]?.state || 'N/A' : 'N/A';
        const intensity = rawIntensity === 'unavailable' || rawIntensity === 'unknown' || rawIntensity === 'N/A' ? "\u2013" : rawIntensity;
        const rawBattery = entityIds.battery ? hass.states[entityIds.battery]?.state : null;
        const batteryUnavailable = !rawBattery || rawBattery === 'unavailable' || rawBattery === 'unknown';
        const batteryLevel = batteryUnavailable ? 0 : rawBattery;
        const modeSelectState = entityIds.mode_select ? hass.states[entityIds.mode_select] : null;
        const mode = modeSelectState?.state && modeSelectState.state !== 'unavailable' ? modeSelectState.state : entityIds.mode ? hass.states[entityIds.mode]?.state || 'N/A' : 'N/A';
        // Routine length: config override first, then the entity (some report
        // minutes, possibly fractional); devices without a sector entity fall
        // back to the 2-minute default so the time-based sector path can run.
        const routineFromSensor = entityIds.routine_length ? (parseFloat(hass.states[entityIds.routine_length]?.state) || 0) * (entityIds.routine_length_minutes ? 60 : 1) : 0;
        // A settable routine (Laifen number entity, minutes) stands in when no
        // sensor reports one — on the Wave the sensor exists but never leaves
        // "unavailable", so the number is all there is.
        const routineFromEntity = routineFromSensor || (entityIds.routine_length_number ? (parseFloat(hass.states[entityIds.routine_length_number]?.state) || 0) * 60 : 0);
        const routineLength = Number(config.routine_length) || Math.round(routineFromEntity) || (entityIds.sector ? 0 : (0, $b973a26f761c9c78$export$918b2e620e4fca36));
        // With the handle's 30-second pacer enabled, the brush itself buzzes
        // every 30s — advance the time-based sectors in the same rhythm so
        // card and handle switch zones together. Only counts with an
        // anatomical zone mapping (4/6) are eligible: 4 is the default
        // already, so just the 6×30s case (3-minute routine) changes here.
        // An explicit sector configuration always wins.
        if (entityIds.pacer_30s && !config.num_sectors && !numSectorsFromEntity && hass.states[entityIds.pacer_30s]?.state === 'on' && Math.round(routineLength / 30) === 6) numSectors = 6;
        // A brand-new head legitimately reports 0.0 wear (issue #12), so only
        // a non-numeric state (unavailable/unknown) hides the reading.
        const brushheadWearRaw = entityIds.brushhead_wear ? parseFloat(hass.states[entityIds.brushhead_wear]?.state) : NaN;
        let brushheadWear = Number.isFinite(brushheadWearRaw) ? brushheadWearRaw : null;
        // xiaomi_ble reports percentage left; the card tracks wear.
        if (brushheadWear !== null && entityIds.brushhead_remaining) brushheadWear = 100 - brushheadWear;
        // Oral-B's brush-head counters. Absolute remainders, so there is no
        // fill level to draw and no percentage to derive: FF2D carries no
        // lifetime total and no head type. Read straight and shown straight.
        //
        // `refill_state: off` means the handle is not counting at all. A
        // number that never moves is worse than no chip, so it is dropped.
        const refillCounter = (entityId)=>{
            if (!entityId) return null;
            const st = hass.states[entityId];
            if (!st || st.state === 'unknown' || st.state === 'unavailable') return null;
            if (st.attributes?.refill_state === 'off') return null;
            const value = parseFloat(st.state);
            return Number.isFinite(value) ? value : null;
        };
        const refillDays = refillCounter(entityIds.refill_days);
        const refillHours = refillCounter(entityIds.refill_brushing_time);
        // Completion latch (issues #4, #5): keep showing the finished session
        // after it ends. Neither integration keeps reporting a completed
        // session — Oral-B freezes its last advertised values once the brush
        // stops broadcasting (sleepy device, entities stay available) and
        // Sonicare powers itself off at the end — so the done state would
        // otherwise vanish moments after brushing or never appear. We track
        // the peak duration while active and, on the active->inactive
        // transition, latch "completed" if a full routine was reached. The
        // hold survives 'unavailable'/'unknown' and is released only when the
        // next session starts. Opt out with `hold_completed: false`.
        // The 0.9 tolerance covers Sonicare powering off a beat before the
        // last duration sample lands exactly on the routine length.
        const holdCompleted = config.hold_completed !== false;
        const latch = (0, $b973a26f761c9c78$export$912b1850c5c72a40)(this._sessionState(), {
            active: active,
            duration: duration,
            routineLength: routineLength,
            now: Date.now(),
            holdCompleted: holdCompleted,
            hasRoutineEntity: !!entityIds.routine_length,
            hasDurationEntity: !!entityIds.duration,
            durationLastChanged: entityIds.duration ? hass.states[entityIds.duration]?.last_changed : null,
            // The handle shows its verdict in a summary state, which is not
            // `active` — so the window stays open past the end of the session.
            displayFace: entityIds.smiley ? hass.states[entityIds.smiley]?.state : null,
            faceWindow: active || $930552a63f9e9686$export$ca79bccd8b43d665.has(statusSlug),
            // Snapshotted with the session, so a recap keeps the pacing of
            // the routine that ran rather than of whatever is set later.
            stepSeconds: liveStepSeconds,
            // Xiaomi reports a score only when the handle switches off, so it
            // describes the session that just ended rather than the one in
            // progress - which is what makes it belong on the badge.
            displayScore: entityIds.score ? hass.states[entityIds.score]?.state ?? null : null
        });
        this._applySessionState(latch.state);
        if (latch.sessionStarted) {
            // Both belong to the card rather than to the latch: the visited
            // sectors are the other state machine's, and forgetting a
            // dismissal touches localStorage.
            this._visitedSectors = null;
            this._clearDismissed(config.device_id);
            // The session the handle had filed before this one began. Read
            // now because right now it is unambiguous: whatever record is on
            // offer at the start of a session belongs to an earlier one. A
            // record that later reports a higher number is this session's,
            // and says so without either side consulting a clock.
            this._baselineSessionId = this.constructor._sessionNumber(entityIds.last_session ? hass.states[entityIds.last_session]?.attributes?.session_id : null);
        }
        if (latch.needsRecap) {
            // Deliberately the raw entity reading, not `routineLength`: its
            // defaults must not paper over a routine sensor that is currently
            // unreadable — the rebuild declines in that case (a Sonicare's
            // aborted 3-minute routine measured against the 2-minute default
            // would read as complete).
            const target = Math.round(routineFromEntity);
            // Two separate settings, because they are two separate things -
            // one reads what the handle concluded, the other reconstructs a
            // session from readings Home Assistant happened to store, and
            // turning the reconstruction off never meant refusing the
            // handle's own account of itself.
            if (config.device_recap !== false) this._recapFromLastSession(hass, config, entityIds, target);
            // Both, rather than the recorder only if the record declined.
            // Neither source is reliably the later one: a handle that files
            // its record late still holds the session before this one, while
            // a session brushed out of range left no rows to find. Asking
            // only one of them means missing whichever session the other
            // was holding. The record is read first because it is already
            // in hand - the badge appears at once - and the query below
            // settles which of the two sessions is the more recent when it
            // returns.
            if (config.history_recap !== false) this._maybeLoadRecapFromHistory(hass, config, entityIds, target);
        } else if (this._completed && config.device_recap !== false && entityIds.last_session && (this._completedSource !== 'device' || !this._completedFromStore)) // Still worth asking while the reading can improve on what the
        // badge holds. Twice over, because a record arrives in two
        // stages on a handle whose integration counts the session as it
        // watches: its own account first, and the handle's - which knows
        // the session number and how hard it was brushed - whenever the
        // handle gets round to filing it, which can be the next time
        // anything connects. Stopping at the first would leave the badge
        // crediting a source it never read.
        //
        // A session the card watched end, on a handle that files a record
        // of it a moment later. The record is the better account of the
        // same session - it knows the routine that was running and how
        // much of it was brushed too hard - so it takes over once it
        // arrives.
        this._recapFromLastSession(hass, config, entityIds, Math.round(routineFromEntity), this._completedAt);
        // hold_duration in hours; absent = 0.5 h default, explicit 0 = until
        // the next session. After expiry the recap is merely hidden — a later
        // setting change can re-show it.
        const holdHours = config.hold_duration !== undefined ? Number(config.hold_duration) || 0 : 0.5;
        const holdExpired = holdHours > 0 && this._completedAt > 0 && Date.now() - this._completedAt > holdHours * 3600000;
        const showRecap = holdCompleted && this._completed && !active && !holdExpired;
        const showCompleted = showRecap && this._completedIsFull;
        const showAborted = showRecap && !this._completedIsFull;
        // Mode selector
        const canSelectMode = entityIds.mode_select && modeSelectState?.state !== 'unavailable' && !active;
        const modeOptions = canSelectMode ? modeSelectState?.attributes?.options || [] : [];
        if (active && this._showModeDropdown) this._showModeDropdown = false;
        // ESP Bridge
        const espConnected = entityIds.esp_bridge_alive ? hass.states[entityIds.esp_bridge_alive]?.state === 'on' : false;
        // Sonicare: show initializing screen while connecting
        const activity = entityIds.activity ? hass.states[entityIds.activity]?.state : null;
        if (activity === 'initializing') return (0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)`
                <ha-card style="${this._cardStyle()}">
                    ${config.show_header === false ? '' : (0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)`
                    <div class="card-header">
                        <div class="header-title">
                            <div class="header-accent"></div>
                            <h2>${config.title || device.manufacturer || deviceName}</h2>
                            ${headerSub ? (0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)`<span class="header-sub">${headerSub}</span>` : ''}
                        </div>
                        <div class="header-icons">
                            <svg class="conn-icon disconnected" viewBox="0 0 24 24" fill="currentColor">
                                <title>${(0, $d8078e452c66bdbe$export$625550452a3fa3ec)(hass, 'conn_bt_disconnected')}</title>
                                <path d="${(0, $3cb0a15594fd43d6$export$cd21dc7a72bbb52c).bluetooth_off}"/>
                            </svg>
                            ${entityIds.esp_bridge_alive ? (0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)`
                            <svg class="conn-icon ${espConnected ? '' : 'disconnected'}" viewBox="0 0 24 24" fill="currentColor"
                                 @click="${()=>this._showMoreInfo(entityIds.esp_bridge_alive)}">
                                <title>${espConnected ? (0, $d8078e452c66bdbe$export$625550452a3fa3ec)(hass, 'conn_bridge_online') : (0, $d8078e452c66bdbe$export$625550452a3fa3ec)(hass, 'conn_bridge_offline')}</title>
                                <path d="${espConnected ? (0, $3cb0a15594fd43d6$export$cd21dc7a72bbb52c).network : (0, $3cb0a15594fd43d6$export$cd21dc7a72bbb52c).network_off}"/>
                            </svg>` : ''}
                            <svg class="more-info-btn" viewBox="0 0 24 24" fill="currentColor" stroke="none"
                                 @click="${()=>this._showDeviceInfo()}">
                                <title>${(0, $d8078e452c66bdbe$export$625550452a3fa3ec)(hass, 'conn_device_info')}</title>
                                <circle cx="12" cy="5" r="1.5"/>
                                <circle cx="12" cy="12" r="1.5"/>
                                <circle cx="12" cy="19" r="1.5"/>
                            </svg>
                        </div>
                    </div>`}
                    <div class="init-wrap">
                        <div class="init-rings">
                            <div class="init-ring init-ring-1"></div>
                            <div class="init-ring init-ring-2"></div>
                            <div class="init-ring init-ring-3"></div>
                            <div class="init-bt">
                                <svg viewBox="0 0 24 24" fill="var(--primary-color, #3b82f6)">
                                    <path d="M14.5 12.5l4-4-5.5-5.5v8.5l-4-4-1.5 1.5 5 5-5 5 1.5 1.5 4-4v8.5l5.5-5.5z"/>
                                </svg>
                            </div>
                        </div>
                        <div class="init-label">${(0, $d8078e452c66bdbe$export$625550452a3fa3ec)(hass, 'status_initializing')}</div>
                    </div>
                </ha-card>
            `;
        // From HA 2026.8 on, oralb_ble decodes sectors 5/6 itself — take the
        // raw value as-is. Older installations keep the _correctSectorIndex
        // workaround, which only ever compensated the built-in integration's
        // bug of reporting sector 5/6 as 4. oralb_live decodes correctly on
        // every release, so it must never run through the workaround: a
        // legitimately repeated or lower sector after a reconnect would be
        // misread as a wrap and advanced past the real zone.
        const sectorsAreUpstreamDecoded = entityIds.integration === 'oralb_live' || entityIds.integration === 'oralb' && this._sectorEntityDecodesAllSectors(hass, entityIds.sector);
        // Sector: use real entity if available, otherwise compute from time
        let sector;
        if (entityIds.sector) {
            sector = hass.states[entityIds.sector]?.state || 'no_sector';
            // The same oralb_ble release removed the `success` sector value
            // and resets the sector as soon as the motor stops — a finished
            // routine no longer announces itself through the entity, so it is
            // derived here from the reached target (same 0.9 tolerance as the
            // completion latch), keeping the completed view independent of
            // `hold_completed`. Two guards keep the derivation honest: only
            // while the frames are fresh — a broadcast handle that goes
            // offline on its summary screen freezes these values forever, and
            // without the guard the card showed a permanent finished view
            // that neither dismissal nor the hold window could clear — and
            // never against a dismissed recap. Known residue: a mid-session
            // pause within the 0.9 tolerance flashes the finished view until
            // brushing resumes; pause and finish both read idle/no_sector
            // here, the distinguishing bits are masked off upstream. A
            // routine the entity does not report can only come from
            // `routine_length` in the config — without it, a longer routine
            // is measured against the 2-minute default. Older releases
            // deliver `success` directly and pass through unchanged.
            const summaryFresh = !$930552a63f9e9686$export$1a6ef95039f86f17[entityIds.integration]?.broadcast || (Date.now() - Date.parse(hass.states[statusEntityId]?.last_updated ?? '')) / 1000 < $930552a63f9e9686$var$BROADCAST_SILENCE_SECONDS;
            if (sectorsAreUpstreamDecoded && sector === 'no_sector' && !active && summaryFresh && !this._holdDismissed && duration >= (routineLength || (0, $b973a26f761c9c78$export$918b2e620e4fca36)) * 0.9) sector = 'success';
        } else if (routineLength > 0 && active && duration > 0) {
            const sectorDuration = routineLength / numSectors;
            // +1 because _parseRawSectorIndex expects 1-based values (OralB convention)
            const idx = Math.min(numSectors, Math.floor(duration / sectorDuration) + 1);
            sector = String(idx);
        } else if (routineLength > 0 && duration >= routineLength && duration > 0) sector = 'success';
        else sector = 'no_sector';
        // issue #4: while holding a finished session, present it as completed
        // (all zones done, final time) regardless of the now-idle live values.
        if (showCompleted) sector = 'success';
        // A recap that is not on screen takes the session with it. A Sonicare
        // freezes its duration once a session ends and keeps reporting it, so
        // every reading derived from that duration outlives the session it
        // belongs to: the branches above read it as "all zones done", and the
        // timer goes on showing the time the handle stopped at. Both stayed
        // after the × cleared the badge, once the hold window ran out, and on
        // a card opened fresh with that reading already standing.
        //
        // Asked of the recap itself rather than of the reason it is gone, so
        // that every way of losing it is covered. `hold_completed: false` is
        // not one of them: that switches the banner off and says nothing
        // about the session, which the card still shows.
        const sessionWithheld = holdCompleted && !active && !showRecap;
        if (sessionWithheld) sector = 'no_sector';
        // The timer is the one place this shows a reading straight from an
        // entity, so for a few seconds the card prints 0:00 while the sensor
        // behind it still reads 51 - until the handle zeroes it itself. The
        // card is early there, not wrong: the session is not on screen, and
        // nothing else about it is either.
        const displayDuration = sessionWithheld ? 0 : showRecap ? this._completedDuration : duration;
        // Computed values
        const defaultOrder = numSectors === 6 ? $930552a63f9e9686$export$d18f9bb4634fc18d : $930552a63f9e9686$export$5055f2a665f9cd1e;
        const sectorOrder = config.sector_order?.length === numSectors ? config.sector_order : defaultOrder;
        // Sonicare reports anatomical sectors including revisits (White+,
        // Gum Health), so a zone already finished must stay finished when the
        // reading jumps back. Passed to the resolver as behaviour rather than
        // as an integration name.
        const allowsRevisits = entityIds.integration === 'philips_sonicare_ble' && routineLength > 0;
        const resolved = (0, $19924b6af6e06bb0$export$fbe194d49df99db9)(this._sectorState(), {
            sector: sector,
            active: active,
            zoneCount: sectorOrder.length,
            duration: duration,
            routineLength: routineLength,
            allowsRevisits: allowsRevisits,
            sectorsAreUpstreamDecoded: sectorsAreUpstreamDecoded
        });
        this._applySectorState(resolved.state);
        const correctedIndex = resolved.index;
        const targetDuration = routineLength || (0, $b973a26f761c9c78$export$918b2e620e4fca36);
        // What a recap is measured against: the routine that ran, not the one
        // set now. Switching mode after brushing would otherwise redraw the
        // session against a different length - a 3:20 Gum Health run suddenly
        // reported as 32% of a 2:00 Clean. Falls back to the live reading
        // where the session never recorded one.
        const recapTarget = showRecap && this._completedTarget || targetDuration;
        // A session that stopped early, with no zones to show for it. The
        // card only knows which zones were brushed if it was open at the
        // time - reload the page and that is gone, while the recap itself
        // survives in the reading or the record. The badge then said "4 of 6
        // sextants finished" over a ring with nothing marked at all.
        //
        // The count is the one the badge prints, worked out the same way, so
        // the two cannot disagree. Which zones those were is the routine's
        // order, which is what the card already assumes for every handle
        // that reports no sectors of its own. Only where nothing was
        // observed: a session the card did watch keeps what it saw, revisits
        // and all.
        //
        // Zeroed where the session is withheld: on a handle that allows
        // revisits the count is worked out from the running duration and not
        // from `sector`, so clearing the sector alone left every zone marked.
        // The two cases cannot overlap - `showAborted` needs a recap on
        // screen, `sessionWithheld` needs none.
        const doneCount = sessionWithheld ? 0 : showAborted && !resolved.doneCount ? Math.min(sectorOrder.length, Math.floor(displayDuration / (recapTarget / sectorOrder.length))) : resolved.doneCount;
        const sectorClassData = this._getSectorData(sector, correctedIndex, sectorOrder, doneCount);
        const sectorLabel = this._getSectorLabel(sector, correctedIndex, sectorOrder);
        const isSuccess = sector === 'success';
        const batteryColor = batteryUnavailable ? 'muted' : this._getBatteryChipColor(batteryLevel);
        const batteryIsCharging = status === 'charging' || status === 'charge';
        const batteryIconName = batteryUnavailable ? 'mdi:battery-unknown' : this._getBatteryIcon(batteryLevel, batteryIsCharging);
        const pressureColor = this._getPressureColor(pressure);
        const pressureClass = this._getPressureClass(pressure);
        const intensityColor = this._getIntensityColor(intensity);
        const modeUnavailable = mode === 'unavailable' || mode === 'unknown' || mode === 'N/A';
        const modeIcon = modeUnavailable ? 'mdi:brush-variant' : this._getModeIcon(mode);
        const modeLabel = modeUnavailable ? "\u2013" : this._getModeLabel(mode);
        const progressPct = showCompleted ? 100 : Math.min(100, Math.round(displayDuration / recapTarget * 100));
        // The bar is divided by the routine's own steps where they are
        // known, and by the zone count everywhere else. Deliberately not
        // `numSectors`, which counts zones and is right for the ring, the
        // zone order and the "x of y" sentence - only the bar is about
        // pacing. `num_sectors` in the configuration overrides the zone
        // count for those, not this: how often the handle buzzes is the
        // handle's business, not a display setting.
        const segmentSeconds = (showRecap ? this._completedStepSeconds || liveStepSeconds : liveStepSeconds) || Array.from({
            length: numSectors || 1
        }, ()=>1);
        const segmentTotal = segmentSeconds.reduce((sum, value)=>sum + value, 0);
        const statusKey = 'status_' + statusSlug;
        const displayStatus = (0, $d8078e452c66bdbe$export$625550452a3fa3ec)(hass, statusKey) !== statusKey ? (0, $d8078e452c66bdbe$export$625550452a3fa3ec)(hass, statusKey) : status.replace(/_/g, ' ');
        const pressureKey = 'pressure_' + String(pressure).toLowerCase();
        const displayPressure = (0, $d8078e452c66bdbe$export$625550452a3fa3ec)(hass, pressureKey) !== pressureKey ? (0, $d8078e452c66bdbe$export$625550452a3fa3ec)(hass, pressureKey) : pressure.replace(/_/g, ' ');
        const intensityKey = 'intensity_' + String(intensity).toLowerCase();
        const displayIntensity = (0, $d8078e452c66bdbe$export$625550452a3fa3ec)(hass, intensityKey) !== intensityKey ? (0, $d8078e452c66bdbe$export$625550452a3fa3ec)(hass, intensityKey) : intensity.replace(/_/g, ' ');
        const btConnected = $930552a63f9e9686$export$c7389aaeaea1415e({
            integration: entityIds.integration,
            connectionState: entityIds.ble_connected ? hass.states[entityIds.ble_connected]?.state ?? 'off' : null,
            status: status,
            lastUpdated: statusEntityId ? hass.states[statusEntityId]?.last_updated : null,
            now: Date.now()
        });
        const btActive = active || batteryIsCharging;
        // Charging station (oralb_live): the handle talks through an iO Sense
        // instead of holding its single BLE slot for us. Both facts sit on the
        // main entity, so no extra entity lookup is needed. Deliberately not a
        // health signal — an idle station is the normal state between sessions,
        // and losing it only degrades the integration to advertisements.
        const baseAttrs = hass.states[entityIds.base_entity]?.attributes || {};
        const hasCharger = !!baseAttrs.charger_address;
        const viaCharger = baseAttrs.data_source === 'charger_bridge';
        // Age line under the done badge ("2 h ago") — a held recap must not
        // read as a just-finished session the next morning. Ticks via the
        // existing 1 s interval.
        let completedAgo = '';
        if (showRecap && this._completedAt > 0) {
            const mins = Math.floor((Date.now() - this._completedAt) / 60000);
            if (mins < 1) completedAgo = (0, $d8078e452c66bdbe$export$625550452a3fa3ec)(hass, 'completed_just_now');
            else if (mins < 60) completedAgo = (0, $d8078e452c66bdbe$export$625550452a3fa3ec)(hass, 'completed_ago_minutes').replace('{n}', mins);
            else completedAgo = (0, $d8078e452c66bdbe$export$625550452a3fa3ec)(hass, 'completed_ago_hours').replace('{n}', Math.floor(mins / 60));
        }
        // The relative time answers "recently or not", which is what the
        // badge is for. When that is not enough - was it this morning or
        // last night - the exact time is one hover away rather than a
        // second line nobody reads.
        const completedAtLabel = showRecap && this._completedAt > 0 ? (0, $c32e617c3becedab$export$8b492ed8828f789c)(hass, this._completedAt) : '';
        // Where the recap came from. The three sources differ in what they
        // are worth - one was watched happening, one was worked out from
        // recorded history, and one is the brush's own record - and that is
        // worth being able to find out when a reading surprises somebody.
        const completedSourceLabel = showRecap ? (0, $d8078e452c66bdbe$export$625550452a3fa3ec)(hass, {
            device: this._completedFromStore ? 'recap_source_device' : 'recap_source_counted',
            history: 'recap_source_history',
            reading: 'recap_source_reading'
        }[this._completedSource] || 'recap_source_live') : '';
        // ---- Configurable property placement (chips + corners) ----
        const layout = $930552a63f9e9686$export$367d6925611d406e(this._normalizeLayout(config), entityIds);
        const POS_CLASS = {
            top_left: 'tl',
            top_right: 'tr',
            bottom_left: 'bl',
            bottom_right: 'br'
        };
        const brushheadPct = brushheadWear !== null ? Math.round(100 - brushheadWear) : null;
        const scoreState = entityIds.score ? hass.states[entityIds.score]?.state : null;
        const scoreAvailable = scoreState && scoreState !== 'unavailable' && scoreState !== 'unknown';
        // Star shape and colour both step with the score so the icon still
        // reads in the compact icon-only layout (non-numeric scores keep the
        // neutral full gold star).
        const scoreNum = parseFloat(scoreState);
        const scoreTier = !scoreAvailable || isNaN(scoreNum) || scoreNum >= 85 ? 2 : scoreNum >= 60 ? 1 : 0;
        const scoreIcon = [
            'mdi:star-outline',
            'mdi:star-half-full',
            'mdi:star'
        ][scoreTier];
        const scoreColor = [
            'red',
            'amber',
            'gold'
        ][scoreTier];
        // The handle's own display face, latched at the end of the session and
        // shown in the done badge. Undecoded values carry `code` and render a
        // question mark with the raw value, so users can report what their
        // handle actually showed (issue #20).
        // The badge's glyph slot holds whichever verdict the handle gave. The
        // two can never collide - the face is oralb_live, the score is Xiaomi -
        // so they share the place rather than competing for it. That is also
        // why show_verdict is a plain on/off and not a choice between the two:
        // on any given device there is only ever one candidate, so "show the
        // face instead of the score" would be a setting with nothing to switch.
        const showVerdict = showRecap && config.show_verdict !== false;
        // A handle that shows no face of its own can still be given a verdict,
        // but it has to be ours rather than the device's - computed from what
        // the session was, and said to be ours on the badge.
        //
        // Measured against the routine rather than in absolute seconds: two
        // minutes is a whole session on one handle and half of one on
        // another. Pressure only ever lowers the verdict - brushing gently is
        // not an achievement, brushing hard is a fault.
        // Not where the device already gives a verdict of its own - a face
        // from the handle or a score from the integration. They share this
        // one slot on the badge, and a computed opinion must not push a
        // reported fact out of it.
        // Only for a recap read from the handle's own record. That is where
        // the two things a verdict needs actually are - the routine this
        // session ran and how much of it was brushed too hard - and a
        // rebuild from recorder rows knows neither.
        // How far the session got is enough for a verdict on its own; how
        // hard it was brushed is what sharpens the top of the scale.
        //
        // The best face is reserved for the pressure reading, because it is
        // the one thing the clock cannot say: "ran its course" and "ran its
        // course and was brushed gently" are different sessions, and only
        // the second deserves the best of four faces. Without the reading
        // the card gives the best its data supports rather than the best
        // there is - and never praises a session brushed hard throughout for
        // having lasted, which is what a duration-only top mark would do.
        const ownVerdict = showVerdict && this._completedSource === 'device' && !this._completedFace && !Number.isFinite(parseFloat(this._completedScore)) && this._completedDuration > 0 ? (()=>{
            // The routine this session ran, where the recap carries it:
            // measuring a three-minute session against whatever the
            // handle is set to now would judge the wrong routine.
            const ran = this._completedDuration / (this._completedTarget || targetDuration);
            if (ran < 0.5) return 'poor';
            if (ran < 0.9) return 'fair';
            if (!Number.isFinite(this._completedPressure)) return 'good';
            const pressed = this._completedPressure / this._completedDuration;
            return pressed > 0.1 ? 'fair' : pressed > 0.02 ? 'good' : 'excellent';
        })() : null;
        const recapFace = showVerdict ? (0, $3cb0a15594fd43d6$export$d36f2381693bb845)(this._completedFace) || (ownVerdict ? {
            ...(0, $3cb0a15594fd43d6$export$51416f8ac832a017)[ownVerdict],
            computed: true
        } : null) : null;
        const recapScoreNum = showVerdict && !recapFace ? parseFloat(this._completedScore) : NaN;
        const recapScore = Number.isFinite(recapScoreNum) ? {
            value: this._completedScore,
            icon: [
                'mdi:star-outline',
                'mdi:star-half-full',
                'mdi:star'
            ][recapScoreNum >= 85 ? 2 : recapScoreNum >= 60 ? 1 : 0],
            color: [
                'red',
                'amber',
                'gold'
            ][recapScoreNum >= 85 ? 2 : recapScoreNum >= 60 ? 1 : 0]
        } : null;
        // What the badge is coloured by: the harsher of what happened and how
        // it was judged. A session cut short is amber whatever face it wears,
        // and one judged badly is red even where the words only say it ended
        // early - "1 of 6 sextants" beside a red face reads as one verdict,
        // an amber sentence beside a red face as two that disagree.
        //
        // Only ever harsher: a friendly face must not paint an aborted
        // session green, because what the badge says first is what happened,
        // and that did not change.
        const TONE_RANK = {
            green: 0,
            gold: 0,
            muted: 0,
            amber: 1,
            red: 2
        };
        const verdictTone = recapFace?.color ?? recapScore?.color ?? null;
        const badgeTone = Math.max(showAborted ? 1 : 0, TONE_RANK[verdictTone] ?? 0);
        const badgeToneClass = [
            '',
            'aborted',
            'severe'
        ][badgeTone];
        // Brush head type (issue #13): the type sensor carries the short
        // family name and the family letter (the A in "A3") as attributes —
        // one source for every head type. Integrations without them get the
        // full formatted enum text (two-line) and no compact letter. Hidden
        // while no head is attached (state unknown), matching the wear
        // reading.
        const headTypeState = entityIds.brushhead_type ? hass.states[entityIds.brushhead_type] : null;
        const headTypeAttrs = headTypeState?.attributes || {};
        const headTypeLabel = headTypeState && headTypeState.state !== 'unavailable' && headTypeState.state !== 'unknown' ? headTypeAttrs.family_name || (hass.formatEntityState ? hass.formatEntityState(headTypeState) : headTypeState.state) : null;
        const headTypeWrap = headTypeLabel && !headTypeAttrs.family_name;
        const headTypeLetter = headTypeLabel ? headTypeAttrs.family_letter || null : null;
        // Shared brush-head glyph (chip icon and corner marker): the head
        // capsule in side view — bristles sticking out sideways, the typical
        // Sonicare silhouette. The fill steps in quarters instead of tracking
        // the exact percentage: at icon size a continuous fill is unreadable,
        // discrete jumps are not.
        // Head value display (issue #14): % remaining (default), % used, or
        // the integration's estimated sessions left. Sessions fall back to
        // remaining when the sensor is missing or unreadable; the glyph fill
        // and colour always follow wear.
        const headSessionsRaw = entityIds.brushhead_sessions ? parseInt(hass.states[entityIds.brushhead_sessions]?.state) : NaN;
        const headValue = config.head_display === 'used' && brushheadWear !== null ? `${Math.round(brushheadWear)}%` : config.head_display === 'sessions' && Number.isFinite(headSessionsRaw) ? `${headSessionsRaw}\xd7` : `${brushheadPct}%`;
        const bhSteps = brushheadPct > 75 ? 4 : brushheadPct > 50 ? 3 : brushheadPct > 25 ? 2 : 1;
        const bhClipY = 30 - bhSteps * 7.5;
        const bhColor = this._getBrushheadColor(brushheadWear);
        const bhFillHex = $930552a63f9e9686$export$40ce16d54e81e005[bhColor];
        // Both shapes of the head glyph, told apart by what fills it. The wear
        // reading fills to its percentage; a countdown fills to its tier,
        // because Oral-B reports no lifetime total to take a proportion of.
        // `fillHex` of null would draw the bare capsule, which nothing asks
        // for: an unfilled glyph reads as a worn head.
        const headSvg = (fillHex = bhFillHex, steps = bhSteps)=>(0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)`
            <svg viewBox="0 0 24 30" class="brushhead-svg">
                <defs>
                    <clipPath id="bh-fill-${this._bhClipId}-${steps}">
                        <rect x="0" y="${30 - steps * 7.5}" width="24" height="${steps * 7.5}"/>
                    </clipPath>
                </defs>
                <path d="M11,5 C11,1.5 13,0 15.5,0 C18,0 20,1.5 20,5 L20,25 C20,28.5 18,30 15.5,30 C13,30 11,28.5 11,25 Z" fill="none" stroke="var(--secondary-text-color, #888)" stroke-width="2"/>
                <path d="M11,5 C11,1.5 13,0 15.5,0 C18,0 20,1.5 20,5 L20,25 C20,28.5 18,30 15.5,30 C13,30 11,28.5 11,25 Z" fill="${fillHex || 'none'}" opacity="0.8" clip-path="url(#bh-fill-${this._bhClipId}-${steps})"/>
                <line x1="10.5" y1="4" x2="3" y2="4" stroke="var(--secondary-text-color, #888)" stroke-width="1.7"/>
                <line x1="10.5" y1="8" x2="2.5" y2="8" stroke="var(--secondary-text-color, #888)" stroke-width="1.7"/>
                <line x1="10.5" y1="12" x2="3" y2="12" stroke="var(--secondary-text-color, #888)" stroke-width="1.7"/>
                <line x1="10.5" y1="16" x2="4.5" y2="16" stroke="var(--secondary-text-color, #888)" stroke-width="1.7"/>
            </svg>`;
        // What the two counters show and how urgently. The thresholds are on
        // the remainder itself, not on a percentage of anything: "under three
        // days left" is a statement about what is left and needs no lifetime
        // total, which is exactly what makes it honest here.
        // Inclusive at both edges of the warning band: exactly fourteen days
        // left is the last day of the fortnight, not the first day past it,
        // and exactly three is the day the warning is for.
        const refillColor = (value, warn, bad)=>value < bad ? 'red' : value <= warn ? 'amber' : 'green';
        const daysColor = refillDays === null ? 'green' : refillColor(refillDays, 14, 3);
        const hoursColor = refillHours === null ? 'green' : refillColor(refillHours, 2, 0.5);
        // The handle reports fractions the sensor passes through untouched
        // (4.98916666666667 h). One decimal while that still says something,
        // whole hours once it does not.
        const daysValue = refillDays === null ? '' : `${Math.round(refillDays)} d`;
        const hoursValue = refillHours === null ? '' : `${refillHours < 10 ? refillHours.toFixed(1) : Math.round(refillHours)} h`;
        // One slot, two shapes: a wear percentage where the handle reports
        // one, otherwise Oral-B's day counter. Never both — no handle offers
        // both, and the label says which is on screen.
        const headIsCountdown = brushheadPct === null && refillDays !== null;
        const headEntity = headIsCountdown ? entityIds.refill_days : entityIds.brushhead_wear;
        const headLabel = (0, $d8078e452c66bdbe$export$625550452a3fa3ec)(hass, headIsCountdown ? 'chip_head_days' : 'chip_head');
        const headShown = headIsCountdown ? daysValue : headValue;
        const headColor = headIsCountdown ? daysColor : bhColor;
        // The countdown fills to its tier: three quarters, two, one. The
        // handle reports only what is left, never the total, so a proportion
        // would need a scale invented for it - and the tiers are the scale
        // the card already stands behind, stated once as colour and once as
        // height. Never full, which would read as a fresh head, and never
        // empty, which would read as a spent one.
        const countdownSteps = {
            green: 3,
            amber: 2,
            red: 1
        };
        const headGlyph = ()=>headIsCountdown ? headSvg($930552a63f9e9686$export$40ce16d54e81e005[daysColor], countdownSteps[daysColor]) : headSvg(bhFillHex);
        const headAvailable = headIsCountdown || brushheadPct !== null;
        // A property rendered as a full chip. Returns '' when the reading is
        // absent on this device, so the slot collapses instead of showing '–'.
        const chipEl = (prop)=>{
            switch(prop){
                case 'battery':
                    if (!entityIds.battery) return '';
                    return (0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)`<div class="chip" @click="${()=>this._showMoreInfo(entityIds.battery)}">
                        <div class="chip-icon ${batteryColor}"><ha-icon icon="${batteryIconName}"></ha-icon></div>
                        <span class="chip-label">${(0, $d8078e452c66bdbe$export$625550452a3fa3ec)(hass, 'chip_battery')}</span>
                        <div class="chip-value ${batteryColor}">${batteryUnavailable ? "\u2013" : (0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)`${batteryLevel}%`}</div>
                    </div>`;
                case 'pressure':
                    if (!pressureEntity) return '';
                    return (0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)`<div class="chip" @click="${()=>this._showMoreInfo(pressureEntity)}">
                        ${this._pressureBars(pressureClass)}
                        <span class="chip-label">${(0, $d8078e452c66bdbe$export$625550452a3fa3ec)(hass, 'chip_pressure')}</span>
                        <div class="chip-value ${pressureColor}">${displayPressure}</div>
                    </div>`;
                case 'intensity':
                    if (!intensityEntity) return '';
                    return (0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)`<div class="chip" @click="${()=>this._showMoreInfo(intensityEntity)}">
                        <div class="chip-icon ${intensityColor}">${this._intensityDial(intensity)}</div>
                        <span class="chip-label">${(0, $d8078e452c66bdbe$export$625550452a3fa3ec)(hass, 'chip_intensity')}</span>
                        <div class="chip-value ${intensityColor}">${displayIntensity}</div>
                    </div>`;
                case 'mode':
                    if (!entityIds.mode && !entityIds.mode_select) return '';
                    return (0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)`<div class="mode-chip-wrap">
                        <div class="chip ${canSelectMode ? 'selectable' : ''}" @click="${()=>this._handleModeChipClick()}">
                            <div class="chip-icon ${modeUnavailable ? 'muted' : 'blue'}"><ha-icon icon="${modeIcon}"></ha-icon></div>
                            <span class="chip-label">${(0, $d8078e452c66bdbe$export$625550452a3fa3ec)(hass, 'chip_mode')}</span>
                            <div class="chip-value ${modeUnavailable ? '' : 'blue'}">${modeLabel}${canSelectMode ? (0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)`<span class="mode-caret"> ▾</span>` : ''}</div>
                            ${canSelectMode ? (0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)`<ha-icon class="chip-select-hint" icon="mdi:chevron-down"></ha-icon>` : ''}
                        </div>
                        ${this._showModeDropdown && canSelectMode ? (0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)`
                            <div class="dropdown-backdrop" @click="${()=>this._closeModeDropdown()}"></div>
                            <div class="mode-dropdown">
                                ${modeOptions.map((opt)=>(0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)`
                                    <div class="mode-option ${opt === mode ? 'active' : ''}"
                                         @click="${(e)=>{
                            e.stopPropagation();
                            this._selectMode(opt);
                        }}">
                                        <ha-icon icon="${this._getModeIcon(opt)}"></ha-icon>
                                        <span>${this._getModeLabel(opt)}</span>
                                    </div>
                                `)}
                            </div>
                        ` : ''}
                    </div>`;
                case 'score':
                    if (!scoreAvailable) return '';
                    return (0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)`<div class="chip" @click="${()=>this._showMoreInfo(entityIds.score)}">
                        <div class="chip-icon ${scoreColor}"><ha-icon icon="${scoreIcon}"></ha-icon></div>
                        <span class="chip-label">${(0, $d8078e452c66bdbe$export$625550452a3fa3ec)(hass, 'chip_score')}</span>
                        <div class="chip-value ${scoreColor}">${scoreState}</div>
                    </div>`;
                case 'brush_head':
                    if (!headAvailable) return '';
                    return (0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)`<div class="chip" @click="${()=>this._showMoreInfo(headEntity)}">
                        <div class="chip-icon">${headGlyph()}</div>
                        <span class="chip-label">${headLabel}</span>
                        <div class="chip-value ${headColor}">${headShown}</div>
                    </div>`;
                case 'head_time':
                    if (refillHours === null) return '';
                    return (0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)`<div class="chip" @click="${()=>this._showMoreInfo(entityIds.refill_brushing_time)}">
                        <div class="chip-icon">${headSvg($930552a63f9e9686$export$40ce16d54e81e005[hoursColor], countdownSteps[hoursColor])}</div>
                        <span class="chip-label">${(0, $d8078e452c66bdbe$export$625550452a3fa3ec)(hass, 'chip_head_time')}</span>
                        <div class="chip-value ${hoursColor}">${hoursValue}</div>
                    </div>`;
                case 'head_type':
                    if (!headTypeLabel) return '';
                    // In the icon-only compact layout the family letter takes
                    // the icon's place, so the chip still tells the type.
                    return (0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)`<div class="chip" @click="${()=>this._showMoreInfo(entityIds.brushhead_type)}">
                        <div class="chip-icon ${headTypeLetter ? 'has-letter' : ''}">
                            <ha-icon icon="mdi:toothbrush"></ha-icon>
                            ${headTypeLetter ? (0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)`<span class="head-type-letter">${headTypeLetter}</span>` : ''}
                        </div>
                        <span class="chip-label">${(0, $d8078e452c66bdbe$export$625550452a3fa3ec)(hass, 'chip_head_type')}</span>
                        <div class="chip-value prose ${headTypeWrap ? 'wrap' : ''}">${headTypeLabel}</div>
                    </div>`;
                default:
                    return '';
            }
        };
        // A property rendered as a compact corner marker (icon + label + value).
        // brush_head keeps its richer fill glyph; everything else is icon+value.
        const cornerEl = (pos, prop)=>{
            const cls = POS_CLASS[pos];
            if (prop === 'brush_head') {
                if (!headAvailable) return '';
                return (0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)`<div class="card-corner ${cls} brushhead-indicator" @click="${()=>this._showMoreInfo(headEntity)}">
                    ${headGlyph()}
                    <span class="corner-lbl">${headLabel}</span>
                    <span class="corner-val ${headColor}">${headShown}</span>
                </div>`;
            }
            if (prop === 'head_time') {
                if (refillHours === null) return '';
                return (0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)`<div class="card-corner ${cls} brushhead-indicator" @click="${()=>this._showMoreInfo(entityIds.refill_brushing_time)}">
                    ${headSvg($930552a63f9e9686$export$40ce16d54e81e005[hoursColor], countdownSteps[hoursColor])}
                    <span class="corner-lbl">${(0, $d8078e452c66bdbe$export$625550452a3fa3ec)(hass, 'chip_head_time')}</span>
                    <span class="corner-val ${hoursColor}">${hoursValue}</span>
                </div>`;
            }
            const marker = (entityId, icon, colorClass, label, value)=>(0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)`
                <div class="card-corner ${cls}" @click="${()=>this._showMoreInfo(entityId)}">
                    <ha-icon class="corner-ico ${colorClass}" icon="${icon}"></ha-icon>
                    <span class="corner-lbl">${label}</span>
                    <span class="corner-val ${colorClass}">${value}</span>
                </div>`;
            // Same marker, but for the readings the card draws itself rather
            // than picking from MDI.
            const glyphMarker = (entityId, glyph, colorClass, label, value)=>(0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)`
                <div class="card-corner ${cls}" @click="${()=>this._showMoreInfo(entityId)}">
                    <span class="corner-ico ${colorClass}">${glyph}</span>
                    <span class="corner-lbl">${label}</span>
                    <span class="corner-val ${colorClass}">${value}</span>
                </div>`;
            switch(prop){
                case 'battery':
                    if (!entityIds.battery) return '';
                    return marker(entityIds.battery, batteryIconName, batteryColor, (0, $d8078e452c66bdbe$export$625550452a3fa3ec)(hass, 'chip_battery'), batteryUnavailable ? "\u2013" : (0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)`${batteryLevel}%`);
                case 'pressure':
                    if (!pressureEntity) return '';
                    return glyphMarker(pressureEntity, this._pressureBars(pressureClass), pressureColor, (0, $d8078e452c66bdbe$export$625550452a3fa3ec)(hass, 'chip_pressure'), displayPressure);
                case 'intensity':
                    if (!intensityEntity) return '';
                    return glyphMarker(intensityEntity, this._intensityDial(intensity), intensityColor, (0, $d8078e452c66bdbe$export$625550452a3fa3ec)(hass, 'chip_intensity'), displayIntensity);
                case 'mode':
                    if (!entityIds.mode && !entityIds.mode_select) return '';
                    return marker(entityIds.mode_select || entityIds.mode, modeIcon, modeUnavailable ? 'muted' : 'blue', (0, $d8078e452c66bdbe$export$625550452a3fa3ec)(hass, 'chip_mode'), modeLabel);
                case 'score':
                    if (!scoreAvailable) return '';
                    return marker(entityIds.score, scoreIcon, scoreColor, (0, $d8078e452c66bdbe$export$625550452a3fa3ec)(hass, 'chip_score'), scoreState);
                case 'head_type':
                    if (!headTypeLabel) return '';
                    // Fallback labels ride 'wrap' through the colorClass slot:
                    // two-line value, no color. Short labels fit as-is.
                    return marker(entityIds.brushhead_type, 'mdi:toothbrush', headTypeWrap ? 'wrap' : '', (0, $d8078e452c66bdbe$export$625550452a3fa3ec)(hass, 'chip_head_type'), headTypeLabel);
                default:
                    return '';
            }
        };
        const chipEls = layout.chips.map(chipEl).filter((x)=>x !== '');
        // Top corners overlay the visual area (absolute); bottom corners render
        // in-flow inside the status row so they stay on the status-text line.
        const topCornerEls = [
            'top_left',
            'top_right'
        ].filter((pos)=>layout.corners[pos]).map((pos)=>cornerEl(pos, layout.corners[pos])).filter((x)=>x !== '');
        const bottomLeftEl = layout.corners.bottom_left ? cornerEl('bottom_left', layout.corners.bottom_left) : '';
        const bottomRightEl = layout.corners.bottom_right ? cornerEl('bottom_right', layout.corners.bottom_right) : '';
        const showHeader = config.show_header !== false;
        // 'none' drops the tooth ring for a large standalone timer (compact
        // panel setups); anything else renders the classic teeth graphic.
        const showTeeth = config.tooth_style !== 'none';
        return (0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)`
            <ha-card style="${this._cardStyle()}">
                <!-- Header -->
                ${showHeader ? (0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)`
                <div class="card-header">
                    <div class="header-title">
                        <div class="header-accent"></div>
                        <h2>${headerTitle}</h2>
                        ${headerSub ? (0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)`<span class="header-sub">${headerSub}</span>` : ''}
                    </div>
                    <div class="header-icons">
                        <svg class="conn-icon ${btActive ? 'active' : ''} ${!btConnected ? 'disconnected' : ''}"
                             viewBox="0 0 24 24" fill="currentColor">
                            <title>${!btConnected ? (0, $d8078e452c66bdbe$export$625550452a3fa3ec)(hass, 'conn_bt_disconnected') : viaCharger ? btActive ? (0, $d8078e452c66bdbe$export$625550452a3fa3ec)(hass, 'conn_bt_charger_active') : (0, $d8078e452c66bdbe$export$625550452a3fa3ec)(hass, 'conn_bt_charger_connected') : btActive ? (0, $d8078e452c66bdbe$export$625550452a3fa3ec)(hass, 'conn_bt_active') : (0, $d8078e452c66bdbe$export$625550452a3fa3ec)(hass, 'conn_bt_connected')}</title>
                            <path d="${!btConnected ? (0, $3cb0a15594fd43d6$export$cd21dc7a72bbb52c).bluetooth_off : btActive ? (0, $3cb0a15594fd43d6$export$cd21dc7a72bbb52c).bluetooth_transfer : (0, $3cb0a15594fd43d6$export$cd21dc7a72bbb52c).bluetooth}"/>
                        </svg>
                        ${hasCharger ? (0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)`
                        <svg class="conn-icon ${viaCharger ? 'active' : ''}" viewBox="0 0 24 24" fill="currentColor"
                             @click="${()=>this._showMoreInfo(entityIds.base_entity)}">
                            <title>${viaCharger ? (0, $d8078e452c66bdbe$export$625550452a3fa3ec)(hass, 'conn_via_charger') : (0, $d8078e452c66bdbe$export$625550452a3fa3ec)(hass, 'conn_charger_paired')}</title>
                            <path d="${(0, $3cb0a15594fd43d6$export$cd21dc7a72bbb52c).charger}"/>
                        </svg>` : ''}
                        ${entityIds.esp_bridge_alive ? (0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)`
                        <svg class="conn-icon ${espConnected && btActive ? 'active' : ''} ${espConnected ? '' : 'disconnected'}"
                             viewBox="0 0 24 24" fill="currentColor"
                             @click="${()=>this._showMoreInfo(entityIds.esp_bridge_alive)}">
                            <title>${!espConnected ? (0, $d8078e452c66bdbe$export$625550452a3fa3ec)(hass, 'conn_bridge_offline') : btActive ? (0, $d8078e452c66bdbe$export$625550452a3fa3ec)(hass, 'conn_bridge_active') : (0, $d8078e452c66bdbe$export$625550452a3fa3ec)(hass, 'conn_bridge_online')}</title>
                            <path d="${!espConnected ? (0, $3cb0a15594fd43d6$export$cd21dc7a72bbb52c).network_off : btActive ? (0, $3cb0a15594fd43d6$export$cd21dc7a72bbb52c).network_active : (0, $3cb0a15594fd43d6$export$cd21dc7a72bbb52c).network}"/>
                        </svg>` : ''}
                        <svg class="more-info-btn" viewBox="0 0 24 24" fill="currentColor" stroke="none"
                             @click="${()=>this._showDeviceInfo()}">
                            <title>${(0, $d8078e452c66bdbe$export$625550452a3fa3ec)(hass, 'conn_device_info')}</title>
                            <circle cx="12" cy="5" r="1.5"/>
                            <circle cx="12" cy="12" r="1.5"/>
                            <circle cx="12" cy="19" r="1.5"/>
                        </svg>
                    </div>
                </div>` : ''}

                <!-- Chips: configurable via layout.chips (omitted when empty) -->
                ${chipEls.length ? (0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)`<div class="chips-row">${chipEls}</div>` : ''}

                <!-- Tooth visual -->
                <div class="visual-area">
                    ${showTeeth ? (0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)`
                    <div class="tooth-wrap">
                        ${(0, $84db147239ed44e7$export$d760b013da4dfa06)(sectorClassData, numSectors)}
                        <div class="center-info">
                            <span class="session-label">${(0, $d8078e452c66bdbe$export$625550452a3fa3ec)(hass, 'session')}</span>
                            <div class="timer-display ${active ? 'active' : ''}"
                                 @click="${()=>this._showMoreInfo(entityIds.duration)}">
                                ${this._formatTime(displayDuration)}
                            </div>
                        </div>
                    </div>` : (0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)`
                    <div class="center-info standalone" @click="${()=>this._showMoreInfo(entityIds.duration)}">
                        <span class="session-label">${(0, $d8078e452c66bdbe$export$625550452a3fa3ec)(hass, 'session')}</span>
                        <div class="timer-display ${active ? 'active' : ''}">
                            ${this._formatTime(displayDuration)}
                        </div>
                    </div>`}

                    <div class="status-row">
                        <div>${bottomLeftEl}</div>
                        <div class="status-text-wrap" @click="${()=>this._showMoreInfo(entityIds.base_entity)}">
                            <div class="status-main ${active ? 'active' : ''}">${displayStatus}</div>
                            ${sectorLabel ? (0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)`<div class="status-sub">${sectorLabel}</div>` : ''}
                        </div>
                        <div>${bottomRightEl}</div>
                    </div>

                    <div class="progress-wrap ${active || isSuccess || showAborted ? 'visible' : ''} ${config.progress_size === 'bold' ? 'bar-bold' : config.progress_size === 'xl' ? 'bar-xl' : ''}">
                        <div class="progress-track">
                            ${(()=>{
            // Same time-based fill as before, sliced into one
            // sub-bar per step so the boundaries are visible -
            // and each sub-bar as wide as its step is long, so
            // an uneven routine would draw uneven segments.
            let elapsedShare = 0;
            return segmentSeconds.map((seconds)=>{
                const start = elapsedShare / segmentTotal;
                elapsedShare += seconds;
                const end = elapsedShare / segmentTotal;
                const segPct = Math.max(0, Math.min(100, (progressPct / 100 - start) / (end - start) * 100));
                const fill = `width: ${segPct}%; background: linear-gradient(90deg, ${$930552a63f9e9686$var$progressColorAt(start)}, ${$930552a63f9e9686$var$progressColorAt(start + (end - start) * segPct / 100)})`;
                return (0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)`<div class="progress-seg" style="flex-grow: ${seconds}">
                                        <div class="progress-fill" style="${fill}"></div>
                                    </div>`;
            });
        })()}
                        </div>
                        <div class="progress-labels">
                            <span>${sectorLabel || ''}</span>
                            <span>${recapTarget > 0 ? (0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)`${this._formatTime(displayDuration)} / ${this._formatTime(recapTarget)}` : ''}</span>
                            <span>${progressPct}%</span>
                        </div>
                    </div>

                    ${topCornerEls}
                </div>

                <!-- Done badge -->
                <div class="done-badge ${isSuccess || showAborted ? 'show' : ''} ${badgeToneClass}">
                    ${showRecap ? (0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)`
                    <button class="done-dismiss"
                            @click=${()=>this._dismissHold()}>&times;</button>` : ''}
                    <div class="done-body ${recapFace || recapScore ? '' : 'text-only'}">
                        ${recapFace ? (0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)`
                        <div class="done-face">
                            <svg class="done-smiley ${recapFace.color}" viewBox="0 0 24 24"
                                 fill="currentColor">
                                ${recapFace.code ? (0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)`<title>${(0, $d8078e452c66bdbe$export$625550452a3fa3ec)(hass, 'smiley_unknown_hint')}</title>` : recapFace.computed ? (0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)`<title>${(0, $d8078e452c66bdbe$export$625550452a3fa3ec)(hass, 'verdict_computed')}</title>` : ''}
                                <path d="${recapFace.path}"/>
                            </svg>
                            ${recapFace.code ? (0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)`<span class="done-face-code">${recapFace.code}</span>` : ''}
                        </div>` : recapScore ? (0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)`
                        <div class="done-face">
                            <ha-icon class="done-score ${recapScore.color}"
                                     icon="${recapScore.icon}"></ha-icon>
                            <span class="done-face-value ${recapScore.color}">${recapScore.value}</span>
                        </div>` : ''}
                        <div class="done-text">
                            ${showAborted ? (0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)`
                            <p><span title="${completedSourceLabel}">${(0, $d8078e452c66bdbe$export$625550452a3fa3ec)(hass, 'aborted_title')}</span>${completedAgo ? (0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)` <span class="done-age" title="${completedAtLabel}">(${completedAgo})</span>` : ''}</p>
                            <span>${(0, $d8078e452c66bdbe$export$625550452a3fa3ec)(hass, numSectors === 6 ? 'aborted_sextants' : 'aborted_quadrants').replace('{x}', Math.min(numSectors || 4, Math.floor(displayDuration / (recapTarget / (numSectors || 4))))).replace('{y}', numSectors || 4)}</span>` : (0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)`
                            <p><span title="${completedSourceLabel}">&#10003; ${(0, $d8078e452c66bdbe$export$625550452a3fa3ec)(hass, 'done_title')}</span>${completedAgo ? (0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)` <span class="done-age" title="${completedAtLabel}">(${completedAgo})</span>` : ''}</p>
                            <span>${(0, $d8078e452c66bdbe$export$625550452a3fa3ec)(hass, numSectors === 6 ? 'done_sextants' : 'done_quadrants')}</span>`}
                        </div>
                    </div>
                </div>
            </ha-card>
        `;
    }
    get _bhClipId() {
        if (!this.__bhClipId) this.__bhClipId = Math.random().toString(36).slice(2, 8);
        return this.__bhClipId;
    }
    _getBrushheadColor(wear) {
        // Chip colour class (green/amber/red), shared by the glyph fill and
        // the value text so head matches the battery chip sitting next to it.
        if (wear >= 80) return 'red';
        if (wear >= 60) return 'amber';
        return 'green';
    }
    _getBatteryIcon(level, is_charging) {
        const batteryLevel = parseInt(level, 10);
        if (is_charging === true) return 'mdi:battery-charging';
        if (batteryLevel <= 5) return 'mdi:battery-alert-variant-outline';
        const roundedLevel = Math.min(100, Math.ceil(batteryLevel / 10) * 10);
        if (roundedLevel === 0) return 'mdi:battery-outline';
        if (roundedLevel === 100) return 'mdi:battery';
        return `mdi:battery-${roundedLevel}`;
    }
    _getModeIcon(mode) {
        const cleanMode = String(mode).toLowerCase().replace(/ /g, '_');
        return (0, $3cb0a15594fd43d6$export$1e083828221390e5)[cleanMode] || (0, $3cb0a15594fd43d6$export$1e083828221390e5).default;
    }
    _getModeLabel(mode) {
        const cleanMode = String(mode).toLowerCase().replace(/ /g, '_');
        const key = 'mode_' + cleanMode;
        const translated = (0, $d8078e452c66bdbe$export$625550452a3fa3ec)(this._hass, key);
        return translated !== key ? translated : mode.replace(/_/g, ' ');
    }
    _handleModeChipClick() {
        const entityIds = this._entityIds;
        const hass = this._hass;
        if (!hass || !entityIds) return;
        const status = entityIds.base_entity ? hass.states[entityIds.base_entity]?.state : 'unknown';
        const active = this._isActive(status);
        const modeSelectState = entityIds.mode_select ? hass.states[entityIds.mode_select] : null;
        const canSelect = entityIds.mode_select && modeSelectState?.state !== 'unavailable' && !active;
        if (canSelect) {
            this._showModeDropdown = !this._showModeDropdown;
            this.requestUpdate();
        } else this._showMoreInfo(entityIds.mode || entityIds.mode_select);
    }
    _closeModeDropdown() {
        this._showModeDropdown = false;
        this.requestUpdate();
    }
    async _selectMode(option) {
        this._showModeDropdown = false;
        this.requestUpdate();
        await this._hass.callService('select', 'select_option', {
            entity_id: this._entityIds.mode_select,
            option: option
        });
    }
    _formatTime(seconds) {
        const secs = parseInt(seconds);
        if (isNaN(secs) || secs < 0) return '0:00';
        const minutes = Math.floor(secs / 60);
        const remainingSeconds = secs % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    static get styles() {
        return (0, $06bdd16cbb4a41b3$export$8d80f9cac07cdb3)((0, (/*@__PURE__*/$parcel$interopDefault($7bfe0f8b5ad5b7ee$exports))));
    }
    static getConfigElement() {
        return document.createElement('toothbrush-card-editor');
    }
    static getStubConfig(hass) {
        const entry = Object.values(hass.entities).find($930552a63f9e9686$export$f8997d7b344b36dd);
        return {
            device_id: entry ? entry.device_id : ""
        };
    }
}





class $2e9f76afc74d559a$export$eec44ce80a6d3e24 extends (0, $528e4332d1e3099e$export$3f2f9f5909897157) {
    static get properties() {
        return {
            hass: {
                attribute: false
            },
            _config: {
                state: true
            },
            _dragIndex: {
                state: true
            },
            _overIndex: {
                state: true
            }
        };
    }
    constructor(){
        super();
        this._dragIndex = -1;
        this._overIndex = -1;
    }
    setConfig(config) {
        this._config = config;
    }
    get _sectorOrder() {
        const numSectors = this._getNumSectors();
        const defaultOrder = numSectors === 6 ? (0, $930552a63f9e9686$export$d18f9bb4634fc18d) : (0, $930552a63f9e9686$export$5055f2a665f9cd1e);
        if (this._config.sector_order?.length === numSectors) return [
            ...this._config.sector_order
        ];
        return [
            ...defaultOrder
        ];
    }
    _getNumSectors() {
        if (this._config?.num_sectors) return this._config.num_sectors;
        return this._getEntityNumSectors();
    }
    _getEntityNumSectors() {
        if (!this.hass || !this._config?.device_id) return 4;
        for(const entityId in this.hass.entities){
            const entity = this.hass.entities[entityId];
            if (entity.device_id === this._config.device_id && entity.translation_key === 'number_of_sectors') return parseInt(this.hass.states[entityId]?.state) || 4;
        }
        return 4;
    }
    _hasSectorEntity() {
        if (!this.hass || !this._config?.device_id) return false;
        return Object.values(this.hass.entities).some((e)=>e.device_id === this._config.device_id && e.translation_key === 'sector');
    }
    /**
     * The handle's own ring colour, if this device reports one. Read through
     * the card's own reader, so the hint can never promise an accent the card
     * would not paint.
     */ _ringColor() {
        if (!this.hass || !this._config?.device_id) return null;
        return (0, $930552a63f9e9686$export$3377c1afbe28d21)(this.hass, this._deviceIds());
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
    /** Whether this device keeps a record of its own sessions. */ _hasSessionRecord() {
        if (!this.hass || !this._config?.device_id) return false;
        return !!this._deviceIds().last_session;
    }
    /**
     * Whether a session could be reconstructed from stored readings.
     *
     * The rebuild works off the elapsed-time reading, so a device without one
     * has nothing to rebuild from and the switch would do nothing.
     */ _canRebuildFromHistory() {
        if (!this.hass || !this._config?.device_id) return false;
        return !!this._deviceIds().duration;
    }
    _fireConfig(config) {
        this.dispatchEvent(new CustomEvent('config-changed', {
            bubbles: true,
            composed: true,
            detail: {
                config: config
            }
        }));
    }
    _valueChanged(key, value) {
        const newConfig = {
            ...this._config,
            [key]: value
        };
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
        const newConfig = {
            ...this._config
        };
        delete newConfig.hold_completed;
        if (!enabled) newConfig.hold_completed = false;
        this._config = newConfig;
        this._fireConfig(newConfig);
    }
    // The dropdown is now only the duration: '0.5' (default) writes no key,
    // anything else `hold_duration` in hours.
    _holdValue() {
        return this._config.hold_duration !== undefined ? String(this._config.hold_duration) : '0.5';
    }
    _holdChanged(value) {
        const newConfig = {
            ...this._config
        };
        delete newConfig.hold_duration;
        if (value !== undefined && value !== '0.5') newConfig.hold_duration = Number(value);
        this._config = newConfig;
        this._fireConfig(newConfig);
    }
    _deviceOptions() {
        const seen = new Map();
        for(const entityId in this.hass.entities){
            const entity = this.hass.entities[entityId];
            if (!entity.device_id || seen.has(entity.device_id)) continue;
            if (!(0, $930552a63f9e9686$export$f8997d7b344b36dd)(entity)) continue;
            const device = this.hass.devices?.[entity.device_id];
            seen.set(entity.device_id, device?.name_by_user || device?.name || entity.device_id);
        }
        const options = [
            ...seen.entries()
        ].map(([value, label])=>({
                value: value,
                label: label
            })).sort((a, b)=>a.label.localeCompare(b.label));
        // Keep a manually configured device_id visible instead of "Unknown
        // device selected", even if it doesn't qualify above.
        const current = this._config.device_id;
        if (current && !seen.has(current)) {
            const device = this.hass.devices?.[current];
            options.push({
                value: current,
                label: device?.name_by_user || device?.name || current
            });
        }
        return options;
    }
    _deviceChanged(ev) {
        const deviceId = ev.detail.value;
        const newConfig = {
            ...this._config,
            device_id: deviceId
        };
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
        if (index !== this._overIndex) this._overIndex = index;
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
        [order[index], order[target]] = [
            order[target],
            order[index]
        ];
        this._valueChanged('sector_order', order);
    }
    _dragEnd() {
        this._dragIndex = -1;
        this._overIndex = -1;
    }
    _resetOrder() {
        const newConfig = {
            ...this._config
        };
        delete newConfig.sector_order;
        this._config = newConfig;
        this._fireConfig(newConfig);
    }
    _numSectorsChanged(value) {
        const parsed = parseInt(value);
        const entityValue = this._getEntityNumSectors();
        const newConfig = {
            ...this._config
        };
        if (parsed && parsed !== entityValue) newConfig.num_sectors = parsed;
        else delete newConfig.num_sectors;
        delete newConfig.sector_order;
        this._config = newConfig;
        this._fireConfig(newConfig);
    }
    // --- Layout (property placement) ---
    _deviceIds() {
        if (!this.hass || !this._config?.device_id) return {};
        return (0, $930552a63f9e9686$export$23f5d0f4bf90bc55)(this.hass, this._config.device_id);
    }
    // Effective layout as fixed-length editor slots: chips padded to 4, all four
    // corner keys present (empty string = unset). Resolved for the device so the
    // shared contact slot reads as the reading it actually has (intensity vs
    // pressure).
    _editorLayout() {
        const ids = this._deviceIds();
        const avail = this._availableSet(ids);
        const eff = (0, $930552a63f9e9686$export$367d6925611d406e)((0, $930552a63f9e9686$export$d859d72b10c9a984)(this._config), ids);
        // Drop readings the device doesn't have so the editor never shows a slot
        // filled with something that can't render (e.g. the default head corner
        // on a handle without a brush-head sensor).
        const availChips = eff.chips.filter((p)=>avail.has(p));
        const chips = [
            0,
            1,
            2,
            3
        ].map((i)=>availChips[i] || '');
        const corners = {};
        for (const k of (0, $930552a63f9e9686$export$b6dc3c540a3cf071))corners[k] = avail.has(eff.corners[k]) ? eff.corners[k] : '';
        return {
            chips: chips,
            corners: corners
        };
    }
    // Properties already placed in a slot other than `except` — excluded from
    // that slot's menu so every reading is used at most once.
    _usedElsewhere(except) {
        const L = this._editorLayout();
        const used = new Set();
        L.chips.forEach((p, i)=>{
            if (p && `chip${i}` !== except) used.add(p);
        });
        for (const k of (0, $930552a63f9e9686$export$b6dc3c540a3cf071))if (L.corners[k] && `corner${k}` !== except) used.add(L.corners[k]);
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
            return (0, $d8078e452c66bdbe$export$625550452a3fa3ec)(this.hass, !ids.brushhead_wear && ids.refill_days ? 'chip_head_days' : 'chip_head') || prop;
        }
        return (0, $d8078e452c66bdbe$export$625550452a3fa3ec)(this.hass, 'chip_' + prop) || prop;
    }
    _propOptions(current, usedElsewhere, avail) {
        const opts = [
            {
                value: 'none',
                label: (0, $d8078e452c66bdbe$export$625550452a3fa3ec)(this.hass, 'layout_none') || "\u2014"
            }
        ];
        for (const p of (0, $930552a63f9e9686$export$334d820851c0d6af)){
            if (p !== current && !avail.has(p)) continue;
            if (p === current || !usedElsewhere.has(p)) opts.push({
                value: p,
                label: this._propLabel(p)
            });
        }
        return opts;
    }
    _writeLayout(L) {
        const chips = L.chips.filter(Boolean);
        const corners = {};
        for (const k of (0, $930552a63f9e9686$export$b6dc3c540a3cf071))if (L.corners[k]) corners[k] = L.corners[k];
        const newConfig = {
            ...this._config,
            layout: {
                chips: chips,
                corners: corners
            }
        };
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
        const newConfig = {
            ...this._config
        };
        delete newConfig.layout;
        this._config = newConfig;
        this._fireConfig(newConfig);
    }
    get _hasCustomOptions() {
        return Object.keys(this._config).some((k)=>k !== 'type' && k !== 'device_id');
    }
    _resetAll() {
        if (!confirm((0, $d8078e452c66bdbe$export$625550452a3fa3ec)(this.hass, 'config_reset_all_confirm'))) return;
        const newConfig = {
            type: this._config.type
        };
        if (this._config.device_id) newConfig.device_id = this._config.device_id;
        this._config = newConfig;
        this._fireConfig(newConfig);
    }
    _colorField(key, labelKey, fallback) {
        const value = this._config[key] || '';
        return (0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)`
            <div class="field">
                <div class="section-label">
                    <span>${(0, $d8078e452c66bdbe$export$625550452a3fa3ec)(this.hass, labelKey)}</span>
                    ${value ? (0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)`
                        <button class="reset-btn" @click=${()=>this._valueChanged(key, '')}>Reset</button>
                    ` : ''}
                </div>
                <div class="color-field">
                    <input type="color" class="color-input"
                           .value=${value || fallback}
                           @input=${(ev)=>this._valueChanged(key, ev.target.value)}>
                    <ha-input
                        .value=${value}
                        .placeholder=${fallback}
                        @input=${(ev)=>this._valueChanged(key, ev.target.value)}
                    ></ha-input>
                </div>
            </div>
        `;
    }
    // The three tooth colors as one compact row under a shared heading;
    // the heading's Reset clears all of them.
    _colorRow() {
        const items = [
            [
                'tooth_color',
                'color_tooth',
                '#d1d5db'
            ],
            [
                'active_color',
                'color_active',
                '#93c5fd'
            ],
            [
                'done_color',
                'color_done',
                '#bbf7d0'
            ]
        ];
        const anySet = items.some(([key])=>this._config[key]);
        return (0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)`
            <div class="field">
                <div class="section-label">
                    <span>${(0, $d8078e452c66bdbe$export$625550452a3fa3ec)(this.hass, 'config_tooth_colors')}</span>
                    ${anySet ? (0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)`
                        <button class="reset-btn" @click=${this._resetColors}>Reset</button>
                    ` : ''}
                </div>
                <div class="color-row">
                    ${items.map(([key, labelKey, fallback])=>(0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)`
                        <div class="color-item">
                            <input type="color" class="color-input"
                                   .value=${this._config[key] || fallback}
                                   @input=${(ev)=>this._valueChanged(key, ev.target.value)}>
                            <span class="color-item-lbl">${(0, $d8078e452c66bdbe$export$625550452a3fa3ec)(this.hass, labelKey)}</span>
                        </div>
                    `)}
                </div>
            </div>
        `;
    }
    _resetColors = ()=>{
        const newConfig = {
            ...this._config
        };
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
            top_left: 'pos_top_left',
            top_right: 'pos_top_right',
            bottom_left: 'pos_bottom_left',
            bottom_right: 'pos_bottom_right'
        };
        const selector = (options)=>({
                select: {
                    mode: 'dropdown',
                    options: options
                }
            });
        return (0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)`
            <div class="group-label">
                <span>${(0, $d8078e452c66bdbe$export$625550452a3fa3ec)(this.hass, 'config_layout')}</span>
                <button class="reset-btn" ?disabled=${!this._config.layout}
                        @click=${this._resetLayout}>Reset</button>
            </div>
            <div class="sector-mode-hint">${(0, $d8078e452c66bdbe$export$625550452a3fa3ec)(this.hass, 'config_layout_hint')}</div>

            <div class="sub-label">${(0, $d8078e452c66bdbe$export$625550452a3fa3ec)(this.hass, 'config_layout_chips')}</div>
            ${[
            0,
            1,
            2,
            3
        ].map((i)=>(0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)`
                <div class="field">
                    <ha-selector
                        .hass=${this.hass}
                        .selector=${selector(this._propOptions(L.chips[i], this._usedElsewhere('chip' + i), avail))}
                        .label=${`${(0, $d8078e452c66bdbe$export$625550452a3fa3ec)(this.hass, 'config_layout_chip')} ${i + 1}`}
                        .value=${L.chips[i] || 'none'}
                        @value-changed=${(ev)=>this._layoutChipChanged(i, ev.detail.value)}
                    ></ha-selector>
                </div>
            `)}

            <div class="sub-label">${(0, $d8078e452c66bdbe$export$625550452a3fa3ec)(this.hass, 'config_layout_corners')}</div>
            ${(0, $930552a63f9e9686$export$b6dc3c540a3cf071).map((k)=>(0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)`
                <div class="field">
                    <ha-selector
                        .hass=${this.hass}
                        .selector=${selector(this._propOptions(L.corners[k], this._usedElsewhere('corner' + k), avail))}
                        .label=${(0, $d8078e452c66bdbe$export$625550452a3fa3ec)(this.hass, posLabels[k])}
                        .value=${L.corners[k] || 'none'}
                        @value-changed=${(ev)=>this._layoutCornerChanged(k, ev.detail.value)}
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
        return (0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)`
            <div class="group-label">${(0, $d8078e452c66bdbe$export$625550452a3fa3ec)(this.hass, 'group_value_display')}</div>
            <div class="sector-mode-hint">${(0, $d8078e452c66bdbe$export$625550452a3fa3ec)(this.hass, 'config_value_display_hint')}</div>
            <div class="field">
                <ha-selector
                    .hass=${this.hass}
                    .selector=${{
            select: {
                mode: 'dropdown',
                options: [
                    {
                        value: 'remaining',
                        label: (0, $d8078e452c66bdbe$export$625550452a3fa3ec)(this.hass, 'head_display_remaining')
                    },
                    {
                        value: 'used',
                        label: (0, $d8078e452c66bdbe$export$625550452a3fa3ec)(this.hass, 'head_display_used')
                    },
                    ...ids?.brushhead_sessions ? [
                        {
                            value: 'sessions',
                            label: (0, $d8078e452c66bdbe$export$625550452a3fa3ec)(this.hass, 'head_display_sessions')
                        }
                    ] : []
                ]
            }
        }}
                    .label=${(0, $d8078e452c66bdbe$export$625550452a3fa3ec)(this.hass, 'config_head_display')}
                    .value=${this._config.head_display || 'remaining'}
                    @value-changed=${(ev)=>this._headDisplayChanged(ev.detail.value)}
                ></ha-selector>
            </div>
        `;
    }
    // 1 is the default and maps to no config key.
    _scaleChanged(value) {
        const newConfig = {
            ...this._config
        };
        const n = Number(value);
        if (!Number.isFinite(n) || n === 1) delete newConfig.scale;
        else newConfig.scale = Math.round(n * 10) / 10;
        this._config = newConfig;
        this._fireConfig(newConfig);
    }
    // 'slim' is the default and maps to no config key.
    _progressSizeChanged(value) {
        const newConfig = {
            ...this._config
        };
        if (!value || value === 'slim') delete newConfig.progress_size;
        else newConfig.progress_size = value;
        this._config = newConfig;
        this._fireConfig(newConfig);
    }
    // 'remaining' is the default and maps to no config key.
    _headDisplayChanged(value) {
        const newConfig = {
            ...this._config
        };
        if (!value || value === 'remaining') delete newConfig.head_display;
        else newConfig.head_display = value;
        this._config = newConfig;
        this._fireConfig(newConfig);
    }
    render() {
        if (!this.hass || !this._config) return (0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)``;
        const order = this._sectorOrder;
        const numSectors = this._getNumSectors();
        const defaultOrder = numSectors === 6 ? (0, $930552a63f9e9686$export$d18f9bb4634fc18d) : (0, $930552a63f9e9686$export$5055f2a665f9cd1e);
        const isCustom = this._config.sector_order?.length === numSectors && JSON.stringify(this._config.sector_order) !== JSON.stringify(defaultOrder);
        return (0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)`
            <div class="editor">
                <div class="group-label">${(0, $d8078e452c66bdbe$export$625550452a3fa3ec)(this.hass, 'group_device')}</div>
                <div class="field">
                    <ha-selector
                        .hass=${this.hass}
                        .selector=${{
            select: {
                mode: 'dropdown',
                options: this._deviceOptions()
            }
        }}
                        .value=${this._config.device_id || ''}
                        .label=${(0, $d8078e452c66bdbe$export$625550452a3fa3ec)(this.hass, 'config_device') || 'Device'}
                        @value-changed=${this._deviceChanged}
                    ></ha-selector>
                </div>

                <div class="group-label">${(0, $d8078e452c66bdbe$export$625550452a3fa3ec)(this.hass, 'group_header')}</div>
                <div class="field row">
                    <ha-switch
                        .checked=${this._config.show_header !== false}
                        @change=${(ev)=>this._valueChanged('show_header', ev.target.checked ? '' : false)}
                    ></ha-switch>
                    <span>${(0, $d8078e452c66bdbe$export$625550452a3fa3ec)(this.hass, 'config_show_header')}</span>
                </div>

                ${this._config.show_header !== false ? (0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)`
                <div class="field">
                    <ha-input
                        .label=${(0, $d8078e452c66bdbe$export$625550452a3fa3ec)(this.hass, 'config_title')}
                        .value=${this._config.title || ''}
                        @input=${(ev)=>this._valueChanged('title', ev.target.value)}
                    ></ha-input>
                </div>

                <div class="field row">
                    <ha-switch
                        .checked=${this._config.show_subtitle !== false}
                        @change=${(ev)=>this._valueChanged('show_subtitle', ev.target.checked)}
                    ></ha-switch>
                    <span>${(0, $d8078e452c66bdbe$export$625550452a3fa3ec)(this.hass, 'config_subtitle')}</span>
                </div>

                <div class="field">
                    <div class="section-label">
                        <span>${(0, $d8078e452c66bdbe$export$625550452a3fa3ec)(this.hass, 'config_accent_color')}</span>
                        ${this._config.accent_color ? (0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)`
                            <button class="reset-btn" @click=${()=>this._valueChanged('accent_color', '')}>Reset</button>
                        ` : ''}
                    </div>
                    <div class="color-grid">
                        ${(0, $930552a63f9e9686$export$bde3a8f4155c4c5).map((c)=>(0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)`
                            <button class="color-swatch ${this._config.accent_color === c.color ? 'selected' : ''}"
                                    style="background: ${c.color}"
                                    title="${c.name}"
                                    @click=${()=>this._valueChanged('accent_color', c.color)}>
                            </button>
                        `)}
                    </div>
                    ${this._ringColor() ? (0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)`
                        <div class="sector-mode-hint ring-hint">
                            ${(0, $d8078e452c66bdbe$export$625550452a3fa3ec)(this.hass, 'config_accent_color_ring')}
                            <span class="ring-swatch" style="background: ${this._ringColor()}"></span>
                            ${this._ringColor()}
                        </div>
                    ` : ''}
                </div>` : ''}

                <div class="group-label">${(0, $d8078e452c66bdbe$export$625550452a3fa3ec)(this.hass, 'group_teeth')}</div>
                <div class="field">
                    <ha-selector
                        .hass=${this.hass}
                        .selector=${{
            number: {
                min: 0.8,
                max: 2,
                step: 0.1,
                mode: 'slider'
            }
        }}
                        .label=${(0, $d8078e452c66bdbe$export$625550452a3fa3ec)(this.hass, 'config_scale')}
                        .value=${Number(this._config.scale) || 1}
                        @value-changed=${(ev)=>this._scaleChanged(ev.detail.value)}
                    ></ha-selector>
                </div>
                <div class="field">
                    <ha-selector
                        .hass=${this.hass}
                        .selector=${{
            select: {
                mode: 'dropdown',
                options: [
                    {
                        value: 'slim',
                        label: (0, $d8078e452c66bdbe$export$625550452a3fa3ec)(this.hass, 'progress_size_slim')
                    },
                    {
                        value: 'bold',
                        label: (0, $d8078e452c66bdbe$export$625550452a3fa3ec)(this.hass, 'progress_size_bold')
                    },
                    {
                        value: 'xl',
                        label: (0, $d8078e452c66bdbe$export$625550452a3fa3ec)(this.hass, 'progress_size_xl')
                    }
                ]
            }
        }}
                        .label=${(0, $d8078e452c66bdbe$export$625550452a3fa3ec)(this.hass, 'config_progress_size')}
                        .value=${this._config.progress_size || 'slim'}
                        @value-changed=${(ev)=>this._progressSizeChanged(ev.detail.value)}
                    ></ha-selector>
                </div>
                <div class="field">
                    <ha-selector
                        .hass=${this.hass}
                        .selector=${{
            select: {
                mode: 'dropdown',
                options: [
                    {
                        value: 'teeth',
                        label: (0, $d8078e452c66bdbe$export$625550452a3fa3ec)(this.hass, 'tooth_style_teeth')
                    },
                    {
                        value: 'none',
                        label: (0, $d8078e452c66bdbe$export$625550452a3fa3ec)(this.hass, 'tooth_style_none')
                    }
                ]
            }
        }}
                        .label=${(0, $d8078e452c66bdbe$export$625550452a3fa3ec)(this.hass, 'config_tooth_style')}
                        .value=${this._config.tooth_style === 'none' ? 'none' : 'teeth'}
                        @value-changed=${(ev)=>this._valueChanged('tooth_style', ev.detail.value === 'none' ? 'none' : '')}
                    ></ha-selector>
                </div>

                ${this._config.tooth_style !== 'none' ? this._colorRow() : ''}

                ${this._config.device_id && this._config.tooth_style !== 'none' ? (0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)`
                    <div class="group-label">${(0, $d8078e452c66bdbe$export$625550452a3fa3ec)(this.hass, 'group_sectors')}</div>
                    <div class="field">
                        <ha-selector
                            .hass=${this.hass}
                            .selector=${{
            select: {
                mode: 'dropdown',
                options: [
                    {
                        value: '4',
                        label: '4'
                    },
                    {
                        value: '6',
                        label: '6'
                    }
                ]
            }
        }}
                            .label=${(0, $d8078e452c66bdbe$export$625550452a3fa3ec)(this.hass, 'config_num_sectors')}
                            .value=${String(numSectors)}
                            @value-changed=${(ev)=>this._numSectorsChanged(ev.detail.value)}
                        ></ha-selector>
                    </div>

                    <div class="section-label">
                        <span>${(0, $d8078e452c66bdbe$export$625550452a3fa3ec)(this.hass, 'config_sector_order')}</span>
                        ${isCustom ? (0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)`
                            <button class="reset-btn" @click=${this._resetOrder}>Reset</button>
                        ` : ''}
                    </div>
                    <div class="sector-mode-hint">
                        ${this._hasSectorEntity() ? (0, $d8078e452c66bdbe$export$625550452a3fa3ec)(this.hass, 'config_sector_mode_device') : (0, $d8078e452c66bdbe$export$625550452a3fa3ec)(this.hass, 'config_sector_mode_time')}
                    </div>
                    <div class="sector-revisit-hint">
                        ${(0, $d8078e452c66bdbe$export$625550452a3fa3ec)(this.hass, 'config_sector_revisit_hint')}
                    </div>
                    <div class="sector-list" @dragend=${this._dragEnd}>
                        ${order.map((zone, i)=>(0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)`
                            <div class="sector-item ${this._dragIndex === i ? 'dragging' : ''} ${this._overIndex === i && this._dragIndex !== i ? 'over' : ''}"
                                 draggable="true"
                                 @dragstart=${(ev)=>this._dragStart(ev, i)}
                                 @dragover=${(ev)=>this._dragOver(ev, i)}
                                 @drop=${(ev)=>this._drop(ev, i)}>
                                <span class="grip">☰</span>
                                <span class="sector-num">${i + 1}</span>
                                <span class="sector-label">${(0, $d8078e452c66bdbe$export$625550452a3fa3ec)(this.hass, 'zone_' + zone)}</span>
                                <span class="move-buttons">
                                    <button class="move-btn" ?disabled=${i === 0}
                                            @click=${(ev)=>{
                ev.stopPropagation();
                this._moveItem(i, -1);
            }}>▲</button>
                                    <button class="move-btn" ?disabled=${i === order.length - 1}
                                            @click=${(ev)=>{
                ev.stopPropagation();
                this._moveItem(i, 1);
            }}>▼</button>
                                </span>
                            </div>
                        `)}
                    </div>

                ` : ''}

                ${this._config.device_id ? this._renderLayoutSection() : ''}

                ${this._config.device_id ? this._renderValueDisplaySection() : ''}

                <div class="group-label">${(0, $d8078e452c66bdbe$export$625550452a3fa3ec)(this.hass, 'group_recap')}</div>
                <div class="field row">
                    <ha-switch
                        .checked=${this._recapEnabled()}
                        @change=${(ev)=>this._recapEnabledChanged(ev.target.checked)}
                    ></ha-switch>
                    <span>${(0, $d8078e452c66bdbe$export$625550452a3fa3ec)(this.hass, 'config_show_recap')}</span>
                </div>
                ${this._recapEnabled() ? (0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)`
                    ${this._hasVerdictSource() ? (0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)`
                        <div class="field row indented">
                            <ha-switch
                                .checked=${this._config.show_verdict !== false}
                                @change=${(ev)=>this._valueChanged('show_verdict', ev.target.checked ? '' : false)}
                            ></ha-switch>
                            <span>${(0, $d8078e452c66bdbe$export$625550452a3fa3ec)(this.hass, 'config_show_verdict')}</span>
                        </div>
                    ` : ''}
                    ${this._hasSessionRecord() ? (0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)`
                        <div class="field row indented">
                            <ha-switch
                                .checked=${this._config.device_recap !== false}
                                @change=${(ev)=>this._valueChanged('device_recap', ev.target.checked ? '' : false)}
                            ></ha-switch>
                            <span>${(0, $d8078e452c66bdbe$export$625550452a3fa3ec)(this.hass, 'config_device_recap')}</span>
                        </div>
                    ` : ''}
                    ${this._canRebuildFromHistory() ? (0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)`
                        <div class="field row indented">
                            <ha-switch
                                .checked=${this._config.history_recap !== false}
                                @change=${(ev)=>this._valueChanged('history_recap', ev.target.checked ? '' : false)}
                            ></ha-switch>
                            <span>${(0, $d8078e452c66bdbe$export$625550452a3fa3ec)(this.hass, 'config_history_recap')}</span>
                        </div>
                    ` : ''}
                    <div class="field indented">
                        <ha-selector
                            .hass=${this.hass}
                            .selector=${{
            select: {
                mode: 'dropdown',
                options: [
                    {
                        value: '0.25',
                        label: '15 min'
                    },
                    {
                        value: '0.5',
                        label: '30 min'
                    },
                    {
                        value: '1',
                        label: '1 h'
                    },
                    {
                        value: '4',
                        label: '4 h'
                    },
                    {
                        value: '8',
                        label: '8 h'
                    },
                    {
                        value: '12',
                        label: '12 h'
                    },
                    {
                        value: '24',
                        label: '24 h'
                    },
                    {
                        value: '0',
                        label: (0, $d8078e452c66bdbe$export$625550452a3fa3ec)(this.hass, 'hold_until_next_session')
                    }
                ]
            }
        }}
                            .label=${(0, $d8078e452c66bdbe$export$625550452a3fa3ec)(this.hass, 'config_hold_duration')}
                            .value=${this._holdValue()}
                            @value-changed=${(ev)=>this._holdChanged(ev.detail.value)}
                        ></ha-selector>
                    </div>
                ` : ''}

                <button class="reset-all-btn" ?disabled=${!this._hasCustomOptions}
                        @click=${this._resetAll}>
                    ${(0, $d8078e452c66bdbe$export$625550452a3fa3ec)(this.hass, 'config_reset_all')}
                </button>

                <div class="build-info">
                    Toothbrush Card v${0, $930552a63f9e9686$export$d5e7ce6d07daf10f} · Build ${0, $de15c9db4b7b9358$export$17b81730949de002}
                </div>
            </div>
        `;
    }
    static get styles() {
        return (0, $06bdd16cbb4a41b3$export$dbf350e5966cf602)`
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


customElements.define('toothbrush-card', (0, $930552a63f9e9686$export$e2f41388bb2b94a0));
customElements.define('toothbrush-card-editor', (0, $2e9f76afc74d559a$export$eec44ce80a6d3e24));
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
    getEntitySuggestion: (hass, entityId)=>{
        const entity = hass.entities?.[entityId];
        if (!entity) return null;
        if ((0, $930552a63f9e9686$export$f8997d7b344b36dd)(entity)) // setConfig rejects a falsy device_id — better no suggestion
        // than one whose preview renders an error card.
        return entity.device_id ? {
            config: {
                type: "custom:toothbrush-card",
                device_id: entity.device_id
            }
        } : null;
        const devices = hass.devices || {};
        const picked = devices[entity.device_id];
        if (!picked) return null;
        const candidates = new Set([
            entity.device_id
        ]);
        if (picked.via_device_id) candidates.add(picked.via_device_id);
        for (const d of Object.values(devices))if (d.config_entries?.some((ce)=>picked.config_entries?.includes(ce))) candidates.add(d.id);
        const main = Object.values(hass.entities).find((e)=>candidates.has(e.device_id) && (0, $930552a63f9e9686$export$f8997d7b344b36dd)(e));
        return main ? {
            config: {
                type: "custom:toothbrush-card",
                device_id: main.device_id
            }
        } : null;
    }
});
console.info(`%c TOOTHBRUSH-CARD %c v${(0, $930552a63f9e9686$export$d5e7ce6d07daf10f)} \xb7 ${(0, $de15c9db4b7b9358$export$17b81730949de002)} `, "color:#fff;background:#1c1c1c;padding:2px 6px;border-radius:4px 0 0 4px;font-weight:700", "color:#1c1c1c;background:#42a5f5;padding:2px 6px;border-radius:0 4px 4px 0;font-weight:700");


