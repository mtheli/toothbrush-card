
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






const $84db147239ed44e7$export$d760b013da4dfa06 = (sectorClassData)=>(0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)`
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg
   class="tooth-image base-image"
   version="1.0"
   width="392.000000pt"
   height="395.000000pt"
   viewBox="0 0 392.000000 395.000000"
   preserveAspectRatio="xMidYMid meet"
   id="svg22"
   sodipodi:docname="base.svg"
   inkscape:version="1.4.2 (2aeb623e1d, 2025-05-12)"
   xml:space="preserve"
   xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
   xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:svg="http://www.w3.org/2000/svg"><sodipodi:namedview
     id="namedview22"
     pagecolor="#ffffff"
     bordercolor="#000000"
     borderopacity="0.25"
     inkscape:showpageshadow="2"
     inkscape:pageopacity="0.0"
     inkscape:pagecheckerboard="0"
     inkscape:deskcolor="#d1d1d1"
     inkscape:document-units="pt"
     inkscape:zoom="1.0781141"
     inkscape:cx="148.87107"
     inkscape:cy="341.80056"
     inkscape:window-width="1854"
     inkscape:window-height="1011"
     inkscape:window-x="66"
     inkscape:window-y="32"
     inkscape:window-maximized="1"
     inkscape:current-layer="g4" /><defs
     id="defs22"><inkscape:path-effect
       effect="spiro"
       id="path-effect87"
       is_visible="true"
       lpeversion="1" /><inkscape:path-effect
       effect="spiro"
       id="path-effect86"
       is_visible="true"
       lpeversion="1" /><inkscape:path-effect
       effect="spiro"
       id="path-effect85"
       is_visible="true"
       lpeversion="1" /><inkscape:path-effect
       effect="spiro"
       id="path-effect84"
       is_visible="true"
       lpeversion="1" /><inkscape:path-effect
       effect="spiro"
       id="path-effect83"
       is_visible="true"
       lpeversion="1" /><inkscape:path-effect
       effect="spiro"
       id="path-effect82"
       is_visible="true"
       lpeversion="1" /><inkscape:path-effect
       effect="spiro"
       id="path-effect81"
       is_visible="true"
       lpeversion="1" /><inkscape:path-effect
       effect="spiro"
       id="path-effect80"
       is_visible="true"
       lpeversion="1" /><inkscape:path-effect
       effect="spiro"
       id="path-effect79"
       is_visible="true"
       lpeversion="1" /><inkscape:path-effect
       effect="spiro"
       id="path-effect78"
       is_visible="true"
       lpeversion="1" /><inkscape:path-effect
       effect="spiro"
       id="path-effect77"
       is_visible="true"
       lpeversion="1" /><inkscape:path-effect
       effect="spiro"
       id="path-effect76"
       is_visible="true"
       lpeversion="1" /><inkscape:path-effect
       effect="spiro"
       id="path-effect75"
       is_visible="true"
       lpeversion="1" /><inkscape:path-effect
       effect="spiro"
       id="path-effect74"
       is_visible="true"
       lpeversion="1" /><inkscape:path-effect
       effect="spiro"
       id="path-effect73"
       is_visible="true"
       lpeversion="1" /><inkscape:path-effect
       effect="spiro"
       id="path-effect72"
       is_visible="true"
       lpeversion="1" /><inkscape:path-effect
       effect="spiro"
       id="path-effect71"
       is_visible="true"
       lpeversion="1" /><inkscape:path-effect
       effect="spiro"
       id="path-effect70"
       is_visible="true"
       lpeversion="1" /><inkscape:path-effect
       effect="spiro"
       id="path-effect69"
       is_visible="true"
       lpeversion="1" /><inkscape:path-effect
       effect="spiro"
       id="path-effect68"
       is_visible="true"
       lpeversion="1" /><inkscape:path-effect
       effect="spiro"
       id="path-effect67"
       is_visible="true"
       lpeversion="1" /><inkscape:path-effect
       effect="spiro"
       id="path-effect66"
       is_visible="true"
       lpeversion="1" /><inkscape:path-effect
       effect="spiro"
       id="path-effect65"
       is_visible="true"
       lpeversion="1" /><inkscape:path-effect
       effect="spiro"
       id="path-effect59"
       is_visible="true"
       lpeversion="1" /><inkscape:path-effect
       effect="bspline"
       id="path-effect58"
       is_visible="true"
       lpeversion="1.3"
       weight="33.333333"
       steps="2"
       helper_size="0"
       apply_no_weight="true"
       apply_with_weight="true"
       only_selected="false"
       uniform="false" /></defs><g
     transform="translate(0.000000,395.000000) scale(0.100000,-0.100000)"
     stroke="none"
     id="g22">
    <g
   id="g1" class="upper_right ${(0, $da98d0425d3716de$export$56cc687933817664)(sectorClassData.upper_right)}"
   inkscape:label="upper_right"><path
     id="path23"
     d="m 1962.1732,3483.7088 c 5.8539,18.8622 5.9913,15.8484 6.8268,-6.7088 1,-36 16,-64 42,-78 12,-6 94,-13 189,-16 160,-5 169,-4 181,15 12,19 14,18 55,-13 58,-44 218,-95 298,-95 28,0 36,-4 36,-18 0,-30 110,-154 157,-176 36,-17 42,-25 46,-60 6,-44 33,-86 64,-100 11,-5 27,-31 37,-59 18,-50 84,-132 114,-142 14,-4 17,-19 18,-72 1,-74 25,-156 55,-189 17,-18 18,-25 8,-53 -17,-47 -4,-147 26,-204 14,-28 25,-66 25,-88 0,-65 65,-175 120,-204 39,-20 77,-19 130,7 34,16 66,21 129,22 l 85,1 19,34 c 29,49 37,215 12,262 -13,26 -17,54 -16,116 3,93 -11,155 -43,198 -17,22 -24,49 -28,100 -7,93 -37,168 -96,241 -43,53 -49,67 -55,123 -12,115 -59,182 -148,210 -32,10 -38,18 -48,58 -17,68 -45,115 -90,156 -42,38 -109,62 -146,53 -19,-5 -25,1 -43,43 -27,65 -91,134 -155,166 -58,29 -84,31 -133,10 l -34,-14 -42,45 c -73,79 -152,107 -228,79 -25,-9 -53,-19 -63,-22 -12,-4 -35,11 -72,46 -30,29 -72,59 -92,68 -55,23 -138,20 -201,-7 -50,-22 -112,-78 -112,-102 0,-3.667 -3.5676,-1.8454 -9.2652,3.8834"
     style="display:inline;stroke:#1a1a1a"
     inkscape:label="upper_right_outlines" /><g
     id="g64"
     class="surfaces"
     inkscape:label="upper_right_surfaces"
     style="display:inline;opacity:1"><path
       id="path1"
       d="m 3816,2201 c 10,-49 -10,-185 -31,-217 -16,-25 -19,-26 -90,-19 -63,6 -79,4 -114,-14 -53,-27 -120,-28 -154,-1 -37,30 -87,122 -90,167 l -2,38 75,5 c 63,4 84,10 126,37 47,30 53,32 119,27 64,-5 72,-3 100,20 27,23 31,23 42,9 7,-9 16,-32 19,-52 v 0" /><path
       id="path38"
       d="m 3767,2512 c 13,-33 18,-72 17,-131 -1,-84 -1,-84 -38,-118 -37,-34 -38,-34 -106,-27 -66,6 -70,5 -113,-26 -37,-26 -58,-33 -110,-37 -61,-5 -67,-4 -90,21 -30,32 -50,100 -50,171 0,59 14,85 45,85 10,0 57,16 104,35 55,23 100,35 132,35 59,0 114,15 144,39 29,24 41,15 65,-47 v 0" /><path
       id="path36"
       d="m 3664,2829 c 33,-60 59,-163 52,-204 -11,-56 -42,-75 -152,-89 -59,-8 -116,-22 -141,-34 -22,-12 -60,-26 -83,-31 -38,-8 -45,-7 -65,14 -30,29 -55,113 -55,182 v 53 h 45 c 40,0 47,4 77,41 l 33,40 57,-6 c 86,-10 106,8 145,135 5,19 50,-33 87,-101 v 0" /><path
       id="path34"
       d="m 3460,3210 c 74,-38 105,-110 98,-234 -5,-89 -33,-160 -67,-171 -11,-3 -37,-1 -58,4 -53,15 -50,16 -99,-34 -47,-49 -65,-53 -122,-29 -49,20 -90,60 -113,109 -25,55 -24,62 16,80 19,9 39,23 46,31 7,9 31,14 66,14 59,0 101,18 123,53 18,30 40,115 40,160 0,44 12,47 70,17 v 0" /><path
       id="path32"
       d="m 3239,3470 c 113,-57 166,-229 117,-377 -25,-74 -52,-95 -134,-102 -48,-5 -76,-13 -96,-29 -51,-39 -97,-24 -127,41 -26,59 -24,68 25,119 59,62 87,138 93,253 2,50 6,96 8,103 6,19 71,14 114,-8 v 0" /><path
       id="path30"
       d="m 2956,3694 c 68,-45 96,-77 127,-144 28,-62 29,-69 23,-153 -9,-121 -38,-207 -85,-257 -53,-56 -79,-54 -143,12 -27,28 -61,68 -74,88 -24,36 -25,39 -14,126 11,81 7,262 -6,306 -7,23 40,47 92,48 28,0 53,-8 80,-26 v 0" /><path
       id="path28"
       d="m 2672,3794 c 23,-16 55,-46 72,-67 l 31,-39 v -183 c 0,-134 -3,-187 -13,-197 -17,-17 -182,21 -268,61 -96,45 -97,48 -84,248 7,92 13,168 13,169 89,40 106,44 155,41 38,-3 64,-12 94,-33 v 0" /><path
       id="path26"
       d="m 2262,3918 c 21,-6 63,-34 93,-62 l 55,-51 -14,-193 c -8,-116 -19,-198 -26,-207 -10,-12 -38,-14 -164,-9 -167,6 -203,15 -217,53 -6,14 -13,93 -16,176 -5,132 -4,155 12,188 42,89 170,137 277,105 v 0" /></g><g
     id="g70"
     class="plaque"
     style="display:inline;stroke:none"
     transform="translate(0,-2.5000001e-5)"
     inkscape:label="upper_right_plaque"><path
       style="display:inline"
       d="m 3111.3014,3293.3063 c 4.5755,23.942 7.4545,48.2081 8.6084,72.5561 1.1839,24.982 0.5535,50.0146 1.2298,75.0155 0.3886,14.3676 1.209,28.7235 2.4595,43.0418 13.946,0.3157 27.9085,-0.095 41.8119,-1.2298 17.5163,-1.4297 35.0601,-4.0386 51.6501,-9.8381 23.7003,-8.285 44.8645,-22.93 62.7179,-40.5822 23.0079,-22.7487 40.7354,-50.4728 54.1096,-79.9346 12.956,-28.5407 21.9557,-58.8466 27.0548,-89.7728 7.7177,-46.8084 6.4584,-95.0804 -3.6893,-141.4227 -7.5594,22.8634 -17.9082,44.803 -30.7441,65.1774 -19.393,30.7827 -45.0984,58.4202 -77.4751,75.0156 -22.5822,11.575 -47.6193,17.4347 -72.556,22.1357 -21.5964,4.0713 -43.3416,7.3536 -65.1775,9.8381 z"
       id="path71"
       inkscape:path-effect="#path-effect71"
       inkscape:original-d="m 3111.3014,3293.3063 c 0,0 5.329,48.3707 8.6084,72.5561 3.2794,24.1853 0.8198,49.1905 1.2298,75.0155 0.4102,25.8251 2.4595,43.0418 2.4595,43.0418 0,0 28.2845,-1.2298 41.8119,-1.2298 13.5275,0 34.4334,-6.5587 51.6501,-9.8381 17.2167,-3.2794 41.402,-26.6449 62.7179,-40.5822 21.3159,-13.9373 35.6632,-54.1096 54.1096,-79.9346 18.4465,-25.8251 18.4465,-59.0287 27.0548,-89.7728 8.6084,-30.744 -3.6893,-141.4227 -3.6893,-141.4227 0,0 -20.496,43.4516 -30.7441,65.1774 -10.248,21.7258 -51.65,50.0104 -77.4751,75.0156 -25.825,25.0052 -48.3707,14.7571 -72.556,22.1357 -24.1853,7.3786 -65.1775,9.8381 -65.1775,9.8381 z" /><path
       d="m 2800.1713,3491.2982 -17.2167,194.3027 c 9.9628,10.2991 22.2423,18.3443 35.6631,23.3655 15.2183,5.6937 31.7664,7.4743 47.9608,6.1488 25.4908,-2.0864 49.814,-11.6639 72.5561,-23.3655 33.7535,-17.3673 65.2326,-39.9064 89.7727,-68.8668 23.361,-27.5689 39.8941,-60.24 54.1096,-93.462 7.1537,-16.7183 13.8143,-33.7867 17.2167,-51.6501 3.4718,-18.2281 3.4718,-37.1112 0,-55.3393 -7.8902,22.1449 -17.7817,43.5763 -29.5144,63.9477 -13.9007,24.1357 -30.5674,46.9762 -51.65,65.1775 -19.4708,16.8098 -42.6694,29.4742 -67.637,35.6631 -22.2415,5.5132 -46.2413,5.7442 -67.637,-2.4595 -21.2333,-8.1414 -38.6983,-24.0351 -52.8798,-41.812 -12.5337,-15.7113 -22.9091,-33.142 -30.7441,-51.6501 z"
       id="path70"
       inkscape:path-effect="#path-effect70"
       inkscape:original-d="m 2800.1713,3491.2982 c 0,0 -17.2167,194.3027 -17.2167,194.3027 0,0 23.3656,15.9869 35.6631,23.3655 12.2976,7.3785 31.9739,3.6893 47.9608,6.1488 15.987,2.4595 48.7806,-16.3969 72.5561,-23.3655 23.7754,-6.9687 59.4385,-45.0913 89.7727,-68.8668 30.3342,-23.7754 36.0731,-62.308 54.1096,-93.462 18.0365,-31.154 11.4778,-34.4334 17.2167,-51.6501 5.7389,-17.2166 0,-55.3393 0,-55.3393 0,0 -20.0862,42.6318 -29.5144,63.9477 -9.4281,21.3159 -34.4333,43.8616 -51.65,65.1775 -17.2167,21.3159 -45.5013,23.3655 -67.637,35.6631 -22.1357,12.2976 -44.6814,-2.4595 -67.637,-2.4595 -22.9556,0 -35.2532,-27.0548 -52.8798,-41.812 -17.6266,-14.7571 -30.7441,-51.6501 -30.7441,-51.6501 z" /><path
       d="m 3380.6196,3116.2204 c 2.5984,20.4362 4.649,40.9421 6.1489,61.4882 1.1358,15.5582 1.9558,31.1395 2.4594,46.731 15.5321,-1.092 30.9055,-4.416 45.5013,-9.8381 22.1324,-8.2218 42.4528,-21.3095 59.0286,-38.1227 13.4669,-13.6597 24.4178,-29.6795 33.2037,-46.731 10.0037,-19.415 17.2477,-40.2014 22.1357,-61.4881 6.1901,-26.9573 8.6183,-54.7631 7.3786,-82.3942 -0.9866,-21.9902 -4.2901,-43.8758 -9.8381,-65.1775 -3.395,19.9096 -7.9137,39.6276 -13.5274,59.0287 -6.4564,22.3134 -14.4676,44.425 -27.0548,63.9477 -11.6861,18.125 -27.1173,33.6615 -44.2715,46.731 -8.8014,6.7057 -18.1302,12.8211 -28.2845,17.2167 -8.2377,3.5659 -16.9599,5.9701 -25.8251,7.3786 -8.9345,1.4195 -18.0284,1.8328 -27.0548,1.2297 z"
       id="path72"
       inkscape:path-effect="#path-effect72"
       inkscape:original-d="m 3380.6196,3116.2204 c 0,0 4.0993,40.5822 6.1489,61.4882 2.0496,20.9059 2.4594,46.731 2.4594,46.731 0,0 30.3342,-5.7389 45.5013,-9.8381 15.1671,-4.0992 38.9425,-25.825 59.0286,-38.1227 20.0862,-12.2976 22.1358,-30.7441 33.2037,-46.731 11.0679,-15.9869 14.7571,-41.402 22.1357,-61.4881 7.3786,-20.0862 4.9191,-54.5196 7.3786,-82.3942 2.4595,-27.8747 -9.8381,-65.1775 -9.8381,-65.1775 0,0 -9.0183,39.7624 -13.5274,59.0287 -4.5092,19.2663 -18.0365,42.2218 -27.0548,63.9477 -9.0183,21.7258 -29.5143,30.7441 -44.2715,46.731 -14.7572,15.9869 -18.8564,11.4778 -28.2845,17.2167 -9.4282,5.7388 -17.2167,4.919 -25.8251,7.3786 -8.6083,2.4595 -27.0548,1.2297 -27.0548,1.2297 z" /><path
       d="m 3558.9353,2871.4974 c 3.4965,11.3088 6.3717,22.8097 8.6084,34.4334 2.3456,12.1897 3.9889,24.5145 4.919,36.893 12.4487,-13.0203 24.3504,-26.5636 35.6632,-40.5822 12.9391,-16.0338 25.1249,-32.7158 35.6631,-50.4203 13.2392,-22.2422 23.8074,-45.978 33.2036,-70.0965 8.8026,-22.5947 16.6046,-45.5795 23.3655,-68.8668 7.3176,-25.2047 13.4632,-51.3392 11.0679,-77.4751 -1.4536,-15.8601 -6.0804,-31.4229 -13.5274,-45.5012 1.0494,24.6102 0.2264,49.3001 -2.4595,73.7858 -3.0615,27.9094 -8.6584,55.8997 -20.906,81.1643 -10.9248,22.536 -26.8176,42.2659 -39.3525,63.9477 -5.1945,8.985 -9.9164,18.4481 -17.2166,25.8251 -6.6614,6.7315 -15.1067,11.3526 -23.3656,15.9869 -12.0178,6.7434 -23.9083,13.7137 -35.6631,20.9059 z"
       id="path73"
       inkscape:path-effect="#path-effect73"
       inkscape:original-d="m 3558.9353,2871.4974 c 0,0 5.739,22.5457 8.6084,34.4334 2.8694,11.8878 4.919,36.893 4.919,36.893 0,0 24.1854,-27.4648 35.6632,-40.5822 11.4778,-13.1175 23.3655,-33.6136 35.6631,-50.4203 12.2977,-16.8068 22.1358,-47.5508 33.2036,-70.0965 11.0679,-22.5457 15.5771,-45.0914 23.3655,-68.8668 7.7885,-23.7754 7.3786,-51.65 11.0679,-77.4751 3.6893,-25.825 -13.5274,-45.5012 -13.5274,-45.5012 0,0 -2.0496,49.6004 -2.4595,73.7858 -0.4103,24.1853 -13.5274,53.6996 -20.906,81.1643 -7.3786,27.4648 -27.0548,42.6318 -39.3525,63.9477 -12.2976,21.3159 -11.0678,17.2167 -17.2166,25.8251 -6.1489,8.6083 -15.1671,10.6579 -23.3656,15.9869 -8.1984,5.329 -35.6631,20.9059 -35.6631,20.9059 z" /><path
       d="m 3699.1283,2560.3674 17.2167,15.9869 c 11.1502,-9.8015 21.0876,-20.9812 29.5143,-33.2036 12.048,-17.475 21.0012,-37.1286 25.8251,-57.7989 5.2477,-22.4863 5.582,-45.7832 6.1488,-68.8668 0.5033,-20.4965 1.2089,-41.0212 0,-61.4882 -1.2497,-21.1577 -4.5495,-42.1938 -9.8381,-62.7179 -0.1878,25.0723 -1.8312,50.1335 -4.9191,75.0156 -3.9394,31.7428 -10.2604,63.2991 -20.9059,93.462 -4.0367,11.4375 -8.7059,22.6921 -14.7572,33.2036 -5.5084,9.5685 -12.138,18.4812 -17.2167,28.2845 -6.1258,11.8244 -9.9092,24.8564 -11.0679,38.1228 z"
       id="path74"
       inkscape:path-effect="#path-effect74"
       inkscape:original-d="m 3699.1283,2560.3674 c 0,0 17.2167,15.9869 17.2167,15.9869 0,0 20.4961,-22.5457 29.5143,-33.2036 9.0183,-10.658 16.3969,-38.5326 25.8251,-57.7989 9.4282,-19.2663 4.0992,-45.5013 6.1488,-68.8668 2.0497,-23.3655 0,-40.9921 0,-61.4882 0,-20.496 -9.8381,-62.7179 -9.8381,-62.7179 0,0 -3.6893,49.6005 -4.9191,75.0156 -1.2297,25.4151 -15.167,61.8981 -20.9059,93.462 -5.739,31.5639 -9.4282,22.9556 -14.7572,33.2036 -5.329,10.248 -11.0679,18.4465 -17.2167,28.2845 -6.1488,9.8382 -11.0679,38.1228 -11.0679,38.1228 z" /><path
       d="m 3749.5487,2236.9396 33.2036,27.0548 c 6.5074,-10.0123 11.8815,-20.7606 15.9869,-31.9739 7.487,-20.4498 10.6954,-42.2295 12.2976,-63.9477 1.6618,-22.5263 1.6391,-45.2324 -1.2298,-67.637 -3.0851,-24.0933 -9.4261,-47.6285 -14.7571,-71.3263 -1.2881,-5.7262 -2.518,-11.4655 -3.6893,-17.2167 1.4786,15.1219 2.2994,30.3081 2.4595,45.5013 0.1774,16.8377 -0.4583,33.701 -2.4595,50.4203 -2.2376,18.6946 -6.1764,37.1578 -11.0679,55.3393 -4.519,16.7969 -9.8733,33.4226 -17.2167,49.1906 -3.9531,8.4883 -8.4757,16.7112 -13.5273,24.5953 z"
       id="path75"
       inkscape:path-effect="#path-effect75"
       inkscape:original-d="m 3749.5487,2236.9396 c 0,0 33.2036,27.0548 33.2036,27.0548 0,0 9.8381,-20.906 15.9869,-31.9739 6.1488,-11.0679 8.1984,-42.6318 12.2976,-63.9477 4.0992,-21.3159 -1.2298,-45.9111 -1.2298,-67.637 0,-21.7258 -9.4281,-46.731 -14.7571,-71.3263 -5.329,-24.5952 -3.6893,-17.2167 -3.6893,-17.2167 0,0 1.6397,29.9243 2.4595,45.5013 0.8199,15.577 -1.6397,34.4333 -2.4595,50.4203 -0.8198,15.9869 -7.7885,36.0731 -11.0679,55.3393 -3.2794,19.2663 -11.0678,33.2036 -17.2167,49.1906 -6.1488,15.9869 -13.5274,24.5953 -13.5273,24.5953 z" /></g><g
     id="g63"
     inkscape:label="upper_right_slots"
     style="display:inline"><path
       d="m 3170,3089 c -21,-28 -26,-30 -64,-24 -30,4 -37,3 -26,-4 8,-6 27,-11 42,-11 19,0 29,-7 37,-27 10,-24 11,-24 7,-4 -3,13 4,41 15,62 23,47 18,50 -11,8 z"
       id="path3" /><path
       d="m 3401,2910 c -13,-11 -31,-20 -40,-20 -19,0 -102,-49 -83,-50 7,0 23,7 36,15 21,14 23,14 35,-11 6,-15 14,-24 17,-21 3,3 1,15 -6,26 -9,18 -8,22 12,30 13,5 32,18 42,30 24,26 18,27 -13,1 z"
       id="path5" /><path
       d="m 3452,2681 c 3,-33 0,-37 -52,-63 -39,-20 -46,-27 -25,-22 17,3 44,14 61,24 l 31,18 11,-37 11,-36 -3,38 c -2,34 0,37 24,37 14,1 39,7 55,15 17,8 21,13 10,10 -92,-20 -94,-19 -110,16 l -15,34 z"
       id="path7" /><path
       d="m 3514,2400 c 2,-25 7,-52 10,-60 4,-11 -7,-23 -39,-40 -25,-14 -41,-26 -35,-28 6,-2 27,6 47,18 29,17 38,19 44,8 4,-7 15,-22 24,-33 16,-20 16,-20 6,2 -17,35 -13,43 22,43 18,0 49,11 70,25 50,34 47,40 -5,10 -46,-27 -102,-33 -114,-13 -4,7 -14,35 -21,63 l -13,50 z"
       id="path9" /><path
       d="m 3579,2125 c -4,-36 -9,-42 -49,-62 -50,-26 -39,-31 16,-8 40,16 51,13 65,-19 8,-18 9,-17 4,7 -5,26 -4,27 42,27 27,0 53,4 60,8 6,4 -15,7 -47,7 -32,0 -61,3 -65,7 -4,4 -11,22 -15,40 l -7,33 z"
       id="path11" /></g></g><g
   id="g2" class="upper_left ${(0, $da98d0425d3716de$export$56cc687933817664)(sectorClassData.upper_left)}"
   inkscape:label="upper_left"><path
     id="path24"
     d="m 1960.7348,3821.8834 c -5.1785,5.2069 -12.1166,13.6416 -19.7348,24.1166 -56,75 -189,122 -272,95 -44,-15 -72,-33 -125,-83 l -52,-49 -51,21 c -29,11 -66,20 -84,20 -50,0 -129,-42 -173,-93 -38,-43 -41,-44 -64,-31 -88,48 -247,-44 -296,-173 -16,-41 -19,-43 -58,-43 -58,-1 -116,-30 -159,-81 -31,-36 -51,-81 -72,-165 -2,-5 -23,-16 -46,-23 -83,-25 -129,-94 -145,-220 -6,-43 -17,-67 -54,-117 -57,-75 -89,-154 -97,-243 -4,-44 -14,-78 -29,-101 -33,-51 -48,-121 -41,-198 6,-56 3,-74 -15,-110 -18,-38 -20,-55 -15,-127 3,-46 12,-98 20,-116 23,-55 38,-62 115,-55 60,6 74,4 126,-20 69,-31 110,-27 159,16 44,38 91,133 92,185 0,22 11,60 25,85 27,52 40,183 21,218 -9,17 -8,23 5,30 25,14 64,136 64,201 0,56 2,60 38,87 51,39 68,61 89,114 10,25 34,61 54,80 32,31 59,88 59,128 0,6 10,12 21,12 27,0 146,119 165,166 11,27 20,34 42,34 15,0 71,11 125,25 96,24 170,57 197,90 12,14 15,14 32,-5 19,-20 27,-21 166,-15 222,9 229,11 250,85 1.6455,5.4301 3.0202,9.9938 4.1732,13.7088"
     style="display:inline;stroke:#1a1a1a"
     inkscape:label="upper_left_outlines" /><g
     id="g62"
     class="surfaces"
     inkscape:label="upper_left_surfaces"
     style="display:inline"><path
       id="path39"
       d="m 177,2244 c 35,-24 44,-25 104,-20 57,6 69,4 92,-14 43,-34 93,-50 157,-50 h 60 v -32 c -1,-46 -58,-148 -99,-175 -42,-29 -78,-29 -142,-2 -40,18 -62,21 -115,16 -77,-6 -100,8 -114,68 -18,77 -8,235 14,235 3,0 22,-12 43,-26 v 0" /><path
       id="path37"
       d="m 235,2556 c 27,-19 55,-26 120,-31 62,-5 101,-15 145,-36 33,-15 76,-31 96,-35 45,-8 58,-38 51,-117 -7,-83 -43,-149 -86,-160 -48,-12 -125,8 -177,45 -43,31 -45,31 -95,20 -45,-11 -57,-10 -88,5 -20,10 -41,29 -48,43 -16,32 -17,166 -1,211 11,33 37,79 44,79 2,0 19,-11 39,-24 v 0" /><path
       id="path35"
       d="m 360,2893 c 5,-22 23,-55 39,-72 29,-31 31,-32 93,-25 l 63,6 33,-41 c 28,-35 38,-41 71,-41 33,0 40,-4 45,-26 12,-48 -26,-186 -59,-214 -20,-17 -71,-8 -143,25 -35,16 -82,28 -122,31 -85,7 -144,28 -160,59 -21,39 -8,143 27,213 31,62 96,150 100,135 1,-4 7,-27 13,-50 v 0" /><path
       id="path33"
       d="m 570,3050 c 25,-49 64,-70 131,-70 40,0 58,-5 81,-25 16,-14 38,-25 49,-25 16,0 19,-4 13,-22 -30,-99 -103,-167 -181,-170 -31,-1 -41,5 -69,38 -33,39 -34,39 -106,39 h -73 l -25,50 c -34,69 -36,208 -2,272 23,44 59,74 107,90 l 30,10 12,-74 c 7,-41 22,-91 33,-113 v 0" /><path
       id="path31"
       d="m 800,3436 c 0,-134 34,-239 101,-311 38,-41 41,-49 36,-82 -8,-46 -36,-85 -70,-97 -20,-7 -34,-4 -71,21 -25,17 -43,33 -40,36 4,3 -10,1 -29,-5 -29,-9 -45,-8 -81,6 -56,21 -81,69 -94,173 -7,61 -5,81 12,135 25,77 45,109 89,142 35,27 99,46 130,38 13,-3 17,-15 17,-56 v 0" /><path
       id="path29"
       d="m 1104,3717 29,-13 v -221 c 0,-186 -2,-225 -16,-246 -31,-48 -115,-126 -143,-133 -24,-6 -33,-1 -69,38 -55,61 -76,128 -82,259 -5,99 -4,109 21,161 30,63 88,121 150,149 48,22 70,23 110,6 v 0" /><path
       id="path27"
       d="m 1447,3812 c 61,-20 59,-12 69,-230 8,-163 7,-165 -78,-208 -67,-34 -245,-76 -268,-64 -25,14 -35,134 -23,276 8,99 13,116 37,149 49,64 139,110 191,98 11,-3 43,-12 72,-21 v 0" /><path
       id="path25"
       d="m 1815,3919 c 25,-7 58,-29 89,-60 l 48,-48 -4,-173 c -2,-110 -8,-181 -16,-195 -18,-32 -67,-41 -230,-45 -111,-2 -145,0 -151,11 -9,13 -16,94 -27,291 l -7,115 47,43 c 26,24 61,50 79,57 39,17 118,19 172,4 v 0" /></g><g
     id="g65"
     class="plaque"
     inkscape:label="upper_left_plaque"
     transform="translate(0,-2.5000001e-5)"
     style="display:inline;stroke:none"><path
       d="m 1135.0716,3685.6009 c -1.51,3.6635 -3.9433,6.9108 -6.861,9.592 -2.9176,2.6812 -6.3129,4.8105 -9.8883,6.5187 -7.1507,3.4165 -14.9615,5.1542 -22.6031,7.2548 -10.1219,2.7825 -20.0583,6.2414 -30.2701,8.6734 -10.2118,2.4321 -20.8189,3.8268 -31.2181,2.3944 -17.2037,-2.3696 -32.3086,-12.1535 -47.96075,-19.6762 -11.40926,-5.4835 -23.36125,-9.8511 -34.4334,-15.9869 -15.11035,-8.3736 -28.26157,-19.8642 -40.58213,-31.9738 -17.89119,-17.5849 -34.34562,-36.7287 -47.96077,-57.7989 -11.66903,-18.0584 -21.21756,-37.493 -28.2846,-57.7989 -7.4684,-21.4591 -12.15257,-43.8354 -14.75715,-66.4072 -1.64823,-14.2839 -2.4699,-28.6631 -2.45955,-43.0418 6.23788,29.0961 17.52418,57.1029 33.20363,82.3942 11.6957,18.8654 25.90891,36.3079 43.04175,50.4203 18.55899,15.2871 40.52532,26.5402 63.94769,31.9738 25.20201,5.8465 52.26598,4.7925 76.24528,-4.919 26.279,-10.6429 47.8163,-31.219 62.718,-55.3394 13.7489,-22.2545 22.2417,-47.7329 24.5952,-73.7858 2.8118,43.0206 5.2715,86.0643 7.3786,129.1252 1.1471,23.4424 2.1973,46.9611 6.1488,70.0965 0.8051,4.7138 1.732,9.4231 1.9927,14.1981 0.2608,4.7749 -0.1704,9.6652 -1.9927,14.0865 z"
       id="path65"
       inkscape:path-effect="#path-effect65"
       inkscape:original-d="m 1135.0716,3685.6009 c 0,9.4282 -27.0547,15.577 -39.3524,23.3655 -12.2976,7.7885 -40.1723,6.9686 -61.4882,11.0678 -21.3159,4.0992 -32.7936,-13.5274 -47.96075,-19.6762 -15.1671,-6.1488 -22.54567,-9.8381 -34.4334,-15.9869 -11.88765,-6.1488 -26.64488,-20.4961 -40.58213,-31.9738 -13.93732,-11.4778 -32.79375,-40.1723 -47.96077,-57.7989 -15.1671,-17.6266 -18.0366,-37.7128 -28.2846,-57.7989 -10.248,-20.0861 -9.83812,-44.2715 -14.75715,-66.4072 -4.91902,-22.1358 -2.45955,-43.0418 -2.45955,-43.0418 0,0 22.95563,56.1592 33.20363,82.3942 10.248,26.235 27.46469,34.0235 43.04175,50.4203 15.57697,16.3968 43.45162,20.4961 63.94769,31.9738 20.49601,11.4778 50.83018,-3.2793 76.24528,-4.919 25.4151,-1.6397 41.812,-36.8929 62.718,-55.3394 20.906,-18.4464 24.5952,-73.7858 24.5952,-73.7858 0,0 5.329,86.0835 7.3786,129.1252 2.0496,43.0417 3.6893,45.9112 6.1488,70.0965 2.4596,24.1854 0,18.8564 0,28.2846 z" /><path
       d="m 807.9546,3290.8468 c -4.92829,20.2471 -8.62665,40.7935 -11.0679,61.4882 -5.10438,43.2703 -4.69005,87.1886 1.22978,130.3549 -11.65116,2.979 -23.64062,4.6327 -35.66318,4.9191 -21.36105,0.5088 -42.79996,-3.333 -62.71792,-11.0679 -29.02108,-11.2699 -54.52647,-30.6696 -75.01557,-54.1096 -18.12482,-20.7352 -32.49301,-44.6567 -43.04172,-70.0965 -9.19974,-22.1865 -15.50606,-45.4634 -20.90597,-68.8668 -5.1417,-22.2843 -9.49431,-44.8215 -11.06787,-67.637 -1.98947,-28.8459 0.50919,-57.9969 7.37858,-86.0834 4.49926,7.3846 9.00839,14.7632 13.52739,22.1357 13.8654,22.6208 27.9161,45.3102 45.50125,65.1775 22.58687,25.5182 50.89397,46.0255 82.39415,59.0286 34.40679,14.203 72.50922,19.3404 109.44898,14.7572 z"
       id="path66"
       inkscape:path-effect="#path-effect66"
       inkscape:original-d="m 807.9546,3290.8468 c 36.48292,4.9191 -7.78853,40.1723 -11.0679,61.4882 -3.27938,21.3159 1.22978,130.3549 1.22978,130.3549 0,0 -24.59528,2.4595 -35.66318,4.9191 -11.06782,2.4595 -42.22186,-7.7885 -62.71792,-11.0679 -20.49606,-3.2794 -49.19053,-35.2532 -75.01557,-54.1096 -25.82502,-18.8564 -28.69447,-47.1409 -43.04172,-70.0965 -14.34723,-22.9556 -13.93731,-45.5013 -20.90597,-68.8668 -6.96866,-23.3655 -7.37858,-45.0913 -11.06787,-67.637 -3.68929,-22.5456 7.37858,-86.0834 7.37858,-86.0834 0,0 10.65795,14.7572 13.52739,22.1357 2.86945,7.3786 29.92425,43.0418 45.50125,65.1775 15.57701,22.1357 54.51951,39.3524 82.39415,59.0286 27.87464,19.6763 109.44898,14.7572 109.44898,14.7572 z" /><path
       d="m 534.94709,3118.6799 c 2.32229,3.1328 3.51102,7.0172 3.75967,10.909 0.24866,3.8917 -0.40463,7.7996 -1.49745,11.543 -2.18564,7.4869 -6.09886,14.3707 -8.41104,21.8195 -4.76821,15.3609 -2.43825,31.8769 -2.45953,47.9608 -0.009,6.5756 -0.41964,13.1507 -1.22976,19.6762 -19.91453,-4.3955 -39.33887,-11.008 -57.79888,-19.6762 -23.54161,-11.0543 -45.95275,-25.873 -61.48817,-46.731 -15.23979,-20.4611 -22.97689,-45.4354 -29.51433,-70.0965 -8.43032,-31.8015 -15.35148,-64.2575 -15.98692,-97.1513 -0.43138,-22.3307 2.05587,-44.716 7.37858,-66.4073 6.24211,26.9341 14.89626,53.3086 25.82504,78.7049 9.58327,22.2696 20.92975,43.8125 34.43337,63.9477 6.73604,10.0441 14.1059,19.8394 23.4812,27.4789 9.37529,7.6394 20.99445,13.0258 33.08791,13.1033 8.86882,0.057 17.51659,-2.6965 26.3571,-3.4068 4.42026,-0.3552 8.93291,-0.1879 13.18364,1.0755 4.25072,1.2633 8.2388,3.6878 10.87957,7.2503 z"
       id="path67"
       inkscape:path-effect="#path-effect67"
       inkscape:original-d="m 534.94709,3118.6799 c 16.80676,1.6397 -4.09921,29.5144 -6.14882,44.2715 -2.04961,14.7572 -1.63969,31.9739 -2.45953,47.9608 -0.81984,15.9869 -1.22976,19.6762 -1.22976,19.6762 0,0 -38.94251,-13.1175 -57.79888,-19.6762 -18.85637,-6.5587 -40.58219,-31.154 -61.48817,-46.731 -20.90598,-15.577 -19.2663,-47.1409 -29.51433,-70.0965 -10.24802,-22.9556 -11.47779,-65.1775 -15.98692,-97.1513 -4.50913,-31.9739 7.37858,-66.4073 7.37858,-66.4073 0,0 16.80677,52.47 25.82504,78.7049 9.01826,26.235 22.95558,42.6318 34.43337,63.9477 11.47779,21.3159 40.58219,27.4647 56.56911,40.5822 15.98693,13.1175 33.61354,3.2794 50.42031,4.919 z" /><path
       d="m 359.09092,2871.4974 c -6.39701,13.2294 -10.96305,27.3426 -13.5274,41.812 -1.65366,9.3308 -2.4778,18.8084 -2.45953,28.2846 -15.03678,-14.9822 -29.0199,-31.0217 -41.81195,-47.9608 -22.85618,-30.266 -41.8931,-63.409 -56.56912,-98.3811 -11.61574,-27.6797 -20.51365,-56.5389 -25.82503,-86.0834 -6.26278,-34.8367 -7.50934,-70.5712 -3.68929,-105.7597 l 6.14881,-12.2976 c 0.71959,25.0905 2.77305,50.1428 6.14882,75.0156 3.83076,28.2252 9.37032,56.2419 17.21669,83.6239 8.09362,28.2448 18.99511,56.4022 38.12267,78.7049 19.38858,22.6071 46.87199,38.1219 76.24533,43.0416 z"
       id="path68"
       inkscape:path-effect="#path-effect68"
       inkscape:original-d="m 359.09092,2871.4974 c 0,0 -9.01827,27.8747 -13.5274,41.812 -4.50914,13.9373 -2.45953,28.2846 -2.45953,28.2846 0,0 -28.28455,-32.7937 -41.81195,-47.9608 -13.5274,-15.167 -37.71275,-65.5874 -56.56912,-98.3811 -18.85637,-32.7936 -17.21669,-57.3889 -25.82503,-86.0834 -8.60835,-28.6944 -3.68929,-105.7597 -3.68929,-105.7597 0,0 6.14881,-12.2976 6.14881,-12.2976 0,0 4.50914,50.4203 6.14882,75.0156 1.63969,24.5952 11.47779,55.3393 17.21669,83.6239 5.7389,28.2845 25.41511,52.4699 38.12267,78.7049 12.70755,26.2349 76.24533,43.0416 76.24533,43.0416 z" /><path
       d="m 213.97883,2564.0566 -17.21668,15.9869 c -13.45987,-15.0575 -24.68759,-32.107 -33.20361,-50.4203 -12.75272,-27.4241 -19.31753,-57.3411 -23.36551,-87.3132 -4.6786,-34.6413 -6.10395,-69.9155 -1.22977,-104.5298 2.83327,-20.1207 7.78857,-39.9419 14.75717,-59.0287 l 2.45952,88.543 c 0.92022,33.1278 3.58225,66.4069 12.29763,98.381 9.54621,35.0222 24.99612,68.4274 45.50125,98.3811 z"
       id="path69"
       inkscape:path-effect="#path-effect69"
       inkscape:original-d="m 213.97883,2564.0566 c 0,0 -17.21668,15.9869 -17.21668,15.9869 0,0 -21.72582,-33.2036 -33.20361,-50.4203 -11.4778,-17.2166 -15.57701,-57.7988 -23.36551,-87.3132 -7.7885,-29.5143 -0.81984,-69.6865 -1.22977,-104.5298 -0.40995,-34.8433 14.75717,-59.0287 14.75717,-59.0287 0,0 1.63968,59.0287 2.45952,88.543 0.81984,29.5143 8.19843,65.5873 12.29763,98.381 4.09922,32.7938 45.50125,98.3811 45.50125,98.3811 z" /></g><g
     id="g61"
     style="display:inline"
     inkscape:label="upper_left_slots"><path
       d="m 730,3114 c 0,-5 7,-19 15,-30 8,-10 15,-30 16,-44 1,-17 3,-20 6,-7 3,11 14,17 31,17 15,0 34,5 42,11 11,8 4,9 -27,5 -24,-4 -43,-3 -43,1 -1,13 -40,59 -40,47 z"
       id="path2" /><path
       d="m 519,2901 c 13,-12 30,-21 37,-21 11,0 13,-7 8,-26 -5,-19 -4,-25 5,-20 6,4 11,14 11,22 0,17 1,17 36,-1 16,-8 36,-15 44,-15 14,1 -76,49 -117,64 -10,3 -25,9 -33,12 -8,3 -4,-4 9,-15 z"
       id="path4" /><path
       d="m 461,2694 c -13,-36 -14,-36 -60,-31 -25,2 -55,8 -66,11 -12,5 -10,2 5,-7 14,-8 42,-18 64,-21 38,-7 38,-8 32,-44 -4,-26 -2,-32 4,-22 5,8 10,25 10,38 0,27 -3,26 45,2 22,-11 46,-20 54,-20 8,0 -8,12 -35,26 -27,14 -50,27 -52,28 -1,2 3,17 9,35 6,18 9,34 7,36 -2,3 -10,-12 -17,-31 z"
       id="path6" /><path
       d="m 400,2398 c -7,-29 -17,-59 -23,-65 -15,-19 -48,-16 -100,11 -31,15 -43,18 -35,8 17,-20 71,-42 103,-42 28,0 29,-2 14,-33 -10,-21 -9,-21 5,-3 8,10 17,24 19,29 2,6 21,2 48,-11 25,-12 52,-22 59,-22 8,0 -9,12 -38,26 -29,14 -52,30 -52,34 0,5 5,32 11,60 15,69 5,76 -11,8 z"
       id="path8" /><path
       d="m 329,2121 c -5,-29 -46,-44 -99,-36 -32,4 -33,4 -10,-6 14,-6 41,-8 61,-6 33,4 36,3 32,-17 l -4,-21 13,22 c 12,20 15,20 38,8 14,-8 32,-14 40,-14 8,0 -1,8 -20,18 -24,13 -37,28 -41,48 -5,27 -6,27 -10,4 z"
       id="path10" /></g></g><g
   id="g3" class="lower_left ${(0, $da98d0425d3716de$export$56cc687933817664)(sectorClassData.lower_left)}"
   inkscape:label="lower_left"><path
     id="path40"
     d="M 1959.4501,437.31453 C 1946.2033,435.84607 1925.0502,437.5444 1905,442 c -28,5 -102,11 -165,13 -92,2 -123,6 -155,22 -49,25 -130,43 -194,43 -41,0 -50,4 -69,30 -40,53 -122,112 -153,108 -22,-2 -36,6 -63,35 -19,21 -47,40 -65,43 -21,5 -31,12 -30,23 6,66 -48,155 -110,181 -19,8 -31,20 -31,31 0,11 -26,49 -57,84 -32,36 -73,83 -92,105 -24,29 -43,42 -71,46 -36,6 -38,8 -43,54 -8,64 -41,141 -76,174 -27,26 -28,31 -23,96 4,54 1,75 -12,94 -9,14 -16,34 -16,45 0,11 -12,33 -26,50 -53,64 -210,79 -320,32 -61,-26 -97,-61 -119,-115 -20,-48 -15,-86 28,-181 22,-50 31,-90 34,-140 2,-38 13,-101 24,-139 18,-60 29,-78 78,-125 49,-47 59,-63 64,-100 7,-52 53,-144 109,-219 40,-54 116,-102 163,-102 16,0 26,-16 48,-73 36,-94 46,-106 109,-128 48,-16 54,-21 67,-61 19,-60 55,-104 95,-118 40,-13 114,1 162,31 l 31,19 7,-32 c 10,-51 63,-124 103,-143 31,-15 44,-16 87,-6 27,6 64,23 82,36 l 32,25 21,-33 C 1430,32 1524,12 1605,96 l 41,42 18,-33 c 32,-59 70,-87 123,-92 65,-6 106,21 138,90 14,28 25,62 25,75 0,6.91587 1.6607,13.16745 4.0251,17.22333"
     style="display:inline;stroke:#1a1a1a"
     inkscape:label="lower_left_outlines" /><g
     id="g59"
     class="surfaces"
     inkscape:label="lower_left_surfaces"
     style="display:inline"><path
       id="path12"
       d="m 1795,439 c 60,-6 120,-15 133,-20 l 25,-10 -6,-107 C 1937,128 1904,51 1831,29 1757,7 1679,73 1649,184 c -16,59 -8,244 11,256 19,12 6,12 135,-1 v 0" /><path
       id="path55"
       d="m 1476,495 c 43,-8 93,-25 113,-38 l 35,-24 2,-144 c 2,-129 0,-146 -18,-171 -23,-34 -67,-58 -103,-58 -64,0 -139,76 -162,163 -13,53 -18,268 -6,280 10,11 55,8 139,-8 v 0" /><path
       id="path53"
       d="m 1237,611 c 77,-56 83,-70 76,-179 -3,-53 -1,-128 5,-166 13,-80 9,-89 -53,-117 -91,-42 -161,-10 -205,93 -20,47 -22,63 -16,144 8,115 27,180 65,222 38,41 74,42 128,3 v 0" /><path
       id="path51"
       d="m 1053,715 c 18,-9 40,-27 51,-41 18,-25 18,-26 -2,-47 -36,-39 -62,-112 -71,-207 -6,-50 -16,-99 -23,-107 -21,-26 -90,-53 -135,-53 -33,0 -48,6 -71,30 -42,42 -66,119 -58,185 9,78 43,180 72,214 23,27 29,29 72,24 26,-3 63,0 82,5 48,14 48,14 83,-3 v 0" /><path
       id="path49"
       d="m 761,934 c 28,-10 60,-13 87,-10 53,7 80,-9 122,-72 57,-86 34,-127 -70,-124 -30,0 -63,-1 -73,-4 -32,-10 -83,-134 -102,-248 -6,-38 -7,-38 -42,-33 -47,8 -61,22 -95,92 -23,49 -28,73 -28,134 0,111 18,197 48,233 42,50 81,58 153,32 v 0" /><path
       id="path47"
       d="m 555,1201 c 114,-8 133,-16 171,-69 15,-20 49,-59 75,-87 80,-86 70,-132 -23,-99 -54,19 -128,18 -156,-2 -38,-26 -62,-88 -74,-194 L 536,650 h -29 c -62,0 -137,68 -200,181 -48,86 -60,141 -43,205 33,123 97,193 166,178 14,-3 70,-9 125,-13 v 0" /><path
       id="path45"
       d="m 280,1454 c 33,-14 45,-14 70,-4 20,8 49,10 87,5 48,-6 63,-13 89,-41 34,-35 62,-105 66,-164 3,-35 3,-35 -37,-34 -22,1 -72,5 -111,9 l -71,8 -40,-36 c -37,-33 -56,-67 -83,-140 -9,-27 -10,-27 -39,-13 -64,34 -109,133 -118,261 -5,73 -3,83 17,109 25,31 72,55 107,56 13,0 41,-7 63,-16 v 0" /><path
       id="path43"
       d="m 337,1759 c 72,-13 123,-47 123,-83 0,-12 6,-30 14,-41 20,-31 28,-73 20,-122 l -7,-45 -54,7 c -35,4 -65,2 -84,-5 -23,-10 -36,-10 -60,0 -66,28 -170,3 -198,-48 -7,-13 -15,-4 -36,43 -15,33 -29,76 -32,96 -14,98 63,176 197,199 25,4 47,8 49,9 2,0 33,-4 68,-10 v 0" /></g><g
     id="g82"
     class="plaque"
     inkscape:label="lower_left_plaque"><path
       d="m 1313.3873,274.23717 c 3.1457,-13.46683 6.016,-26.998 8.6084,-40.5822 2.2615,-11.8499 4.3115,-23.74014 6.1488,-35.66317 -14.4039,-10.95278 -29.6274,-20.82749 -45.5012,-29.5143 -15.6617,-8.57077 -32.0218,-16.00927 -49.1906,-20.90595 -13.3034,-3.79423 -26.9895,-6.03619 -40.5822,-8.60835 -14.2312,-2.69299 -28.9375,-5.7537 -43.0417,-2.45955 -15.1935,3.54855 -27.8215,14.10668 -38.1227,25.82505 -8.3481,9.49658 -15.5674,19.9398 -22.1357,30.74407 -6.5782,10.82048 -12.516,22.01504 -18.4465,33.20363 -6.1856,11.66991 -12.382,23.37185 -17.2166,35.6631 -5.5836,14.19547 -9.3144,29.11851 -11.0679,44.27152 4.474,-9.09999 9.8366,-17.76278 15.9869,-25.82505 6.6952,-8.77654 14.3014,-16.81863 22.1357,-24.59527 8.5345,-8.47164 17.5241,-16.76752 28.2846,-22.13573 14.0281,-6.99836 30.0293,-8.54184 45.5013,-11.0679 16.4313,-2.68268 32.6643,-6.5914 49.1905,-8.60835 15.5048,-1.8923 31.2533,-2.10253 46.731,0 12.4085,1.68559 24.7575,4.91328 35.6631,11.0679 7.1414,4.03031 13.6417,9.3418 18.4465,15.98693 6.8568,9.48311 9.9939,21.5836 8.6083,33.20362 z"
       id="path82"
       inkscape:path-effect="#path-effect82"
       inkscape:original-d="m 1313.3873,274.23717 c 0,0 5.739,-26.23499 8.6084,-40.5822 2.8694,-14.34727 6.1488,-35.66317 6.1488,-35.66317 0,0 -31.154,-19.67618 -45.5012,-29.5143 -14.3473,-9.83813 -32.7937,-13.52738 -49.1906,-20.90595 -16.3969,-7.37858 -26.2349,-5.73893 -40.5822,-8.60835 -14.3472,-2.8695 -28.6945,-1.63973 -43.0417,-2.45955 -14.3472,-0.81983 -25.825,18.03652 -38.1227,25.82505 -12.2976,7.78845 -15.167,20.49607 -22.1357,30.74407 -6.9686,10.248 -11.4778,21.3159 -18.4465,33.20363 -6.9686,11.88772 -11.4778,23.77537 -17.2166,35.6631 -5.7389,11.88772 -11.0679,44.27152 -11.0679,44.27152 0,0 10.248,-17.2167 15.9869,-25.82505 5.7389,-8.60835 14.7572,-15.98692 22.1357,-24.59527 7.3786,-8.60835 18.8565,-14.75715 28.2846,-22.13573 9.4282,-7.37857 30.3341,-6.9687 45.5013,-11.0679 15.1671,-4.0992 33.2036,-6.1488 49.1905,-8.60835 15.9869,-2.45947 30.7441,0 46.731,0 15.9869,0 24.1853,7.78853 35.6631,11.0679 11.4779,3.27938 11.8877,10.248 18.4465,15.98693 6.5587,5.73885 8.6083,33.20362 8.6083,33.20362 z" /><path
       d="m 740.31758,455.01237 c 1.08527,-16.96991 3.55568,-33.85104 7.37858,-50.42032 3.85062,-16.68943 9.06424,-33.03637 14.75714,-49.19048 4.83084,-13.70795 10.09621,-27.45636 18.44648,-39.3525 6.67868,-9.51472 15.15625,-17.59435 23.36549,-25.82497 6.64867,-6.66598 13.42081,-13.65434 22.13573,-17.2167 10.36608,-4.2373 22.0213,-3.06446 33.20363,-2.45955 11.46882,0.6204 22.96691,0.56763 34.4334,1.22977 12.88076,0.74381 25.77563,2.40469 38.12265,6.1488 10.56923,3.20501 20.61454,7.89617 30.74407,12.29768 8.75128,3.80263 17.62638,7.41633 25.82505,12.2976 11.04554,6.57623 20.7334,15.42164 28.2845,25.82505 -0.2069,14.35603 0.2036,28.72095 1.2298,43.04175 1.1197,15.62491 2.9711,31.1876 4.919,46.731 1.948,15.54456 3.9945,31.09217 4.9191,46.731 0.7786,13.16972 0.7728,26.48613 3.6893,39.35242 2.4904,10.98624 7.1101,21.48568 13.5274,30.74408 l -77.47512,52.8798 c -5.59236,-13.58894 -11.33168,-27.11739 -17.21663,-40.5822 -5.21734,-11.93732 -10.54912,-23.82458 -15.98693,-35.6631 -5.82475,-12.68092 -11.80673,-25.36881 -19.67625,-36.89288 -8.86125,-12.97635 -19.95241,-24.24181 -30.74407,-35.66317 -8.06039,-8.53072 -16.307,-17.42117 -27.05483,-22.13573 -8.44481,-3.70434 -17.84061,-4.54957 -27.05475,-4.9191 -11.9425,-0.47895 -24.01701,-0.2274 -35.66317,2.45955 -8.82891,2.03697 -17.42904,5.52318 -24.59528,11.0679 -5.50953,4.26287 -10.04384,9.62765 -14.75714,14.75715 -4.70825,5.12399 -9.63316,10.0489 -14.75715,14.75715 z"
       id="path83"
       inkscape:path-effect="#path-effect83"
       inkscape:original-d="m 740.31758,455.01237 c 0,0 5.73889,-34.02344 7.37858,-50.42032 1.63968,-16.3968 9.01829,-32.38373 14.75714,-49.19048 5.73893,-16.80682 12.70755,-27.05482 18.44648,-39.3525 5.73892,-12.2976 15.57697,-16.80675 23.36549,-25.82497 7.78853,-9.0183 14.34728,-11.0679 22.13573,-17.2167 7.78853,-6.1488 22.54568,-1.22978 33.20363,-2.45955 10.65794,-1.22978 22.95554,1.22977 34.4334,1.22977 11.47777,0 25.41509,4.0992 38.12265,6.1488 12.70755,2.0496 20.08612,7.37858 30.74407,12.29768 10.65795,4.91902 17.2167,8.1984 25.82505,12.2976 8.60835,4.0992 28.2845,25.82505 28.2845,25.82505 0,0 0.8199,29.5143 1.2298,43.04175 0.4103,13.52737 3.2794,30.33412 4.919,46.731 1.6398,16.3968 3.2794,31.97385 4.9191,46.731 1.6397,14.75715 2.4596,25.4151 3.6893,39.35242 1.2298,13.93733 13.5274,30.74408 13.5274,30.74408 0,0 -77.47512,52.8798 -77.47512,52.8798 0,0 -11.88765,-26.23493 -17.21663,-40.5822 -5.32898,-14.3472 -10.24808,-23.77538 -15.98693,-35.6631 -5.73892,-11.88773 -13.11749,-25.00523 -19.67625,-36.89288 -6.55875,-11.88772 -20.49607,-23.36557 -30.74407,-35.66317 -10.248,-12.2976 -18.44648,-14.75715 -27.05483,-22.13573 -8.60835,-7.37857 -18.4464,-3.27937 -27.05475,-4.9191 -8.60834,-1.63965 -22.95562,2.0496 -35.66317,2.45955 -12.70755,0.41025 -16.80675,7.78853 -24.59528,11.0679 -7.78845,3.27938 -9.42817,9.01823 -14.75714,14.75715 -5.32897,5.73885 -14.75715,14.75715 -14.75715,14.75715 z" /><path
       d="m 721.87112,493.13503 c 2.80903,-2.32809 4.92027,-5.46455 6.13041,-8.90639 1.21014,-3.44183 1.52845,-7.17877 1.03409,-10.7935 -0.98871,-7.22946 -5.21112,-13.79642 -10.85379,-18.42276 -6.3119,-5.17503 -14.3064,-8.0538 -22.4118,-9.01482 -8.1054,-0.96102 -16.34082,-0.0862 -24.3192,1.63624 -17.45447,3.7681 -34.25318,11.82184 -46.73102,24.59528 -12.53136,12.82823 -20.0673,29.56148 -28.28455,45.50122 -8.23463,15.97346 -17.38894,31.49781 -24.59527,47.96078 -7.20406,16.4578 -12.42856,33.8362 -14.75717,51.6501 -1.86488,14.26633 -1.86488,28.77534 0,43.04167 8.05743,-12.49924 15.05909,-25.67883 20.90598,-39.35242 4.9114,-11.48585 9.01845,-23.33773 14.75716,-34.4334 5.55635,-10.74308 12.61905,-20.70444 20.90598,-29.5143 8.35453,-8.88174 17.89323,-16.5486 27.0548,-24.59528 7.22094,-6.34221 14.24832,-12.95512 22.13574,-18.4464 9.57664,-6.66733 20.4593,-11.63523 31.97385,-13.52745 4.67816,-0.76878 9.43278,-1.02975 14.09118,-1.91038 4.6584,-0.88063 9.3134,-2.44294 12.96361,-5.46819 z"
       id="path84"
       inkscape:path-effect="#path-effect84"
       inkscape:original-d="m 721.87112,493.13503 c 9.01827,-2.45948 -1.63968,-24.59528 -3.68929,-38.12265 -2.0496,-13.52738 -31.56393,-4.50915 -46.731,-7.37858 -15.16709,-2.86942 -31.56393,16.80675 -46.73102,24.59528 -15.16708,7.78852 -18.44645,29.92425 -28.28455,45.50122 -9.83811,15.57698 -16.39685,31.5639 -24.59527,47.96078 -8.19842,16.39687 -9.83811,34.4334 -14.75717,51.6501 -4.91905,17.21662 0,43.04167 0,43.04167 0,0 14.34725,-27.05475 20.90598,-39.35242 6.55874,-12.2976 9.42819,-22.54568 14.75716,-34.4334 5.32898,-11.88765 13.93733,-19.26623 20.90598,-29.5143 6.96866,-10.248 18.85637,-17.2167 27.0548,-24.59528 8.19842,-7.37857 13.11747,-12.2976 22.13574,-18.4464 9.01827,-6.14887 22.13574,-8.19847 31.97385,-13.52745 9.83811,-5.32897 18.03653,-4.91902 27.05479,-7.37857 z" /><path
       d="m 544.78519,787.04848 c 1.40441,-17.60657 0.99159,-35.35756 -1.22976,-52.87981 -2.03453,-16.04856 -5.57784,-31.8843 -7.37858,-47.96077 -1.23401,-11.01683 -1.64545,-22.1257 -1.22976,-33.20362 -14.83388,-0.67105 -29.75328,0.57225 -44.27148,3.68932 -15.75564,3.38275 -31.00028,8.95805 -45.50125,15.98693 -12.83637,6.22202 -25.20994,13.65898 -35.66314,23.3655 -11.32331,10.51448 -20.10682,23.40462 -29.51432,35.6631 -12.08428,15.74646 -25.32881,30.59866 -36.89291,46.731 -15.95605,22.25926 -28.54891,46.72403 -40.58219,71.32627 -8.86091,18.11626 -17.45724,36.37264 -27.05479,54.10965 -6.29124,11.6267 -13.05099,23.11692 -17.21669,35.6631 -7.56846,22.79452 -6.09337,47.58458 -2.45953,71.32625 4.03755,26.3794 10.63732,52.3659 19.67622,77.4751 -0.55562,-13.124 -0.14422,-26.2887 1.22975,-39.3524 1.35583,-12.8912 3.65454,-25.7069 7.37859,-38.1227 5.17787,-17.26276 13.06897,-33.61467 22.13574,-49.19052 15.04854,-25.85197 33.40374,-49.73807 54.10959,-71.32628 19.59154,-20.42642 41.34118,-38.84856 65.17747,-54.10957 18.08434,-11.57837 37.28721,-21.29365 56.5691,-30.74408 10.40322,-5.09882 20.89231,-10.14741 31.97386,-13.52737 9.95819,-3.03733 20.33534,-4.69769 30.74408,-4.9191 z"
       id="path85"
       inkscape:path-effect="#path-effect85"
       inkscape:original-d="m 544.78519,787.04848 c 0,0 -0.40995,-35.66311 -1.22976,-52.87981 -0.81984,-17.2167 -5.32898,-31.15402 -7.37858,-47.96077 -2.0496,-16.80675 -1.22976,-33.20362 -1.22976,-33.20362 0,0 -30.33417,3.27937 -44.27148,3.68932 -13.93732,0.41025 -29.92425,10.248 -45.50125,15.98693 -15.57701,5.73885 -23.36551,15.16702 -35.66314,23.3655 -12.29764,8.1984 -19.67622,24.18532 -29.51432,35.6631 -9.83811,11.47777 -24.59527,30.74407 -36.89291,46.731 -12.29764,15.98692 -27.05479,48.37072 -40.58219,71.32627 -13.5274,22.95563 -18.03653,35.25323 -27.05479,54.10965 -9.01827,18.85635 -11.4778,23.77538 -17.21669,35.6631 -5.7389,11.88773 -1.63969,47.55083 -2.45953,71.32625 -0.81984,23.7755 19.67622,77.4751 19.67622,77.4751 0,0 1.22975,-26.2349 1.22975,-39.3524 0,-13.1174 4.91906,-25.0052 7.37859,-38.1227 2.45952,-13.11747 15.577,-33.61347 22.13574,-49.19052 6.55874,-15.57698 35.25321,-47.14088 54.10959,-71.32628 18.85637,-24.18532 44.27149,-36.07305 65.17747,-54.10957 20.90597,-18.03653 36.48297,-20.08613 56.5691,-30.74408 20.08614,-10.65795 21.72583,-9.0183 31.97386,-13.52737 10.24802,-4.50915 30.74408,-4.9191 30.74408,-4.9191 z" /><path
       d="m 261.93961,1106.787 c 3.21255,-3.6304 4.74073,-8.564 4.75101,-13.4117 0.0103,-4.8477 -1.40859,-9.6177 -3.51184,-13.9853 -4.2065,-8.7354 -11.04159,-15.9192 -15.99633,-24.253 -4.67297,-7.8599 -7.63083,-16.7334 -8.60835,-25.8251 -14.2463,6.1741 -27.55992,14.4951 -39.35243,24.5953 -13.90858,11.9126 -25.5942,26.1705 -36.8929,40.5822 -14.26935,18.2008 -28.14533,36.9341 -38.12267,57.7988 -11.45258,23.9497 -17.4812,50.1095 -22.13574,76.2454 -4.852581,27.2479 -8.306584,54.7598 -9.838105,82.3941 -1.157233,20.8807 -1.216392,41.8052 -1.22976,62.718 -0.0039,6.1488 -0.0039,12.2976 0,18.4464 4.588686,6.7981 9.515855,13.3676 14.757155,19.6762 6.86092,8.258 14.26037,16.0685 22.13574,23.3655 -1.3846,-10.1924 -2.20611,-20.4612 -2.45953,-30.7441 -0.41487,-16.8336 0.69219,-33.6746 2.45953,-50.4203 2.52612,-23.9352 6.40062,-47.715 11.06787,-71.3263 4.43833,-22.4532 9.61098,-44.8202 17.21669,-66.4072 4.8247,-13.6937 10.65142,-27.1036 18.44646,-39.3524 7.53403,-11.8387 16.80998,-22.4499 25.82502,-33.2037 4.35692,-5.1973 8.67752,-10.4563 13.6537,-15.0641 4.97617,-4.6078 10.66986,-8.5765 17.09039,-10.7608 5.244,-1.784 10.81685,-2.3329 16.21442,-3.5773 5.39756,-1.2444 10.85891,-3.3424 14.52967,-7.4906 z"
       id="path86"
       inkscape:path-effect="#path-effect86"
       inkscape:original-d="m 261.93961,1106.787 c 10.24803,-3.6893 -9.83811,-34.0235 -14.75716,-51.65 -4.91906,-17.6267 -8.60835,-25.8251 -8.60835,-25.8251 0,0 -25.82503,16.3968 -39.35243,24.5953 -13.52739,8.1984 -24.59526,27.4647 -36.8929,40.5822 -12.29763,13.1174 -26.23496,38.5326 -38.12267,57.7988 -11.88771,19.2663 -13.93731,50.8303 -22.13574,76.2454 -8.198418,25.4151 -6.968658,54.9294 -9.838105,82.3941 -2.869448,27.4647 -0.40995,40.9921 -1.22976,62.718 -0.819848,21.7257 0,18.4464 0,18.4464 0,0 9.838105,13.5274 14.757155,19.6762 4.91906,6.1488 22.13574,23.3655 22.13574,23.3655 0,0 -1.63968,-20.9059 -2.45953,-30.7441 -0.81984,-9.8381 2.45953,-32.7936 2.45953,-50.4203 0,-17.6266 6.96866,-47.9608 11.06787,-71.3263 4.09922,-23.3655 11.4778,-44.6814 17.21669,-66.4072 5.7389,-21.7258 11.88771,-25.825 18.44646,-39.3524 6.55873,-13.5274 17.21668,-21.7258 25.82502,-33.2037 8.60835,-11.4777 20.49606,-17.2166 30.74409,-25.8249 10.24803,-8.6084 20.49606,-7.3786 30.74409,-11.0679 z" /><path
       d="m 82.394153,1415.4576 c 3.90032,10.395 9.774517,20.0455 17.216685,28.2846 7.911132,8.7583 17.590572,15.9126 28.284552,20.9059 -6.86009,8.0695 -13.03806,16.7187 -18.44644,25.8251 -9.858028,16.5986 -17.108555,34.6166 -23.36551,52.8798 -7.263438,21.201 -13.259611,42.9333 -15.986925,65.1774 -2.300358,18.7618 -2.254974,37.8019 0,56.5692 1.497624,12.4642 3.967084,24.8115 7.378582,36.8929 -9.582478,-6.6377 -17.957569,-15.0128 -24.59527,-24.5953 -6.588748,-9.5118 -11.42487,-20.1105 -15.986924,-30.7441 -6.936712,-16.1687 -13.399169,-32.8788 -14.757162,-50.4202 -0.918992,-11.8707 0.529802,-23.7775 1.229764,-35.6632 0.851395,-14.4571 0.631891,-29.2087 4.919054,-43.0417 4.456766,-14.3802 13.505905,-26.8497 19.676214,-40.5822 5.431984,-12.0893 8.624118,-25.1437 14.757161,-36.8929 4.888924,-9.3658 11.612044,-17.7697 19.676219,-24.5953 z"
       id="path87"
       inkscape:path-effect="#path-effect87"
       inkscape:original-d="m 82.394153,1415.4576 c 6.558735,-8.1984 11.887709,19.2663 17.216685,28.2846 5.328972,9.0182 28.284552,20.9059 28.284552,20.9059 0,0 -12.70755,17.2167 -18.44644,25.8251 -5.7389,8.6083 -15.577007,35.2532 -23.36551,52.8798 -7.788503,17.6266 -10.65795,44.2715 -15.986925,65.1774 -5.328975,20.906 0,36.8929 0,56.5692 0,19.6762 7.378582,36.8929 7.378582,36.8929 0,0 -15.986926,-15.987 -24.59527,-24.5953 -8.608344,-8.6083 -10.248029,-20.496 -15.986924,-30.7441 -5.738897,-10.248 -9.838108,-33.6135 -14.757162,-50.4202 -4.919053,-16.8069 1.229764,-24.1854 1.229764,-35.6632 0,-11.4778 2.869448,-27.8747 4.919054,-43.0417 2.049605,-15.1671 13.527397,-27.4648 19.676214,-40.5822 6.148817,-13.1175 9.428186,-24.1854 14.757161,-36.8929 5.328975,-12.7076 19.676218,-24.5953 19.676219,-24.5953 z" /></g><g
     id="g57"
     style="display:inline"
     transform="translate(0,-2.5000001e-5)"
     inkscape:label="lower_left_slots"><path
       d="m 296,1683 c 5,-22 2,-23 -48,-25 l -53,-1 55,-6 55,-6 12,-70 12,-70 -3,72 -3,72 46,6 c 76,10 80,14 9,11 -59,-3 -67,-1 -77,18 -11,21 -11,21 -5,-1 z"
       id="path14" /><path
       d="m 348,1375 c 4,-22 1,-25 -22,-25 -34,0 -75,-21 -101,-51 l -20,-24 26,23 c 31,27 84,44 116,36 13,-4 33,-22 44,-43 19,-33 19,-25 3,28 -5,17 0,20 37,24 43,3 43,4 -9,5 -46,2 -54,5 -62,27 -5,14 -11,25 -13,25 -2,0 -2,-11 1,-25 z"
       id="path16" /><path
       d="m 455,1124 c 11,-8 31,-17 45,-20 43,-9 100,-36 94,-45 -3,-5 -24,-9 -47,-9 -23,-1 -55,-8 -72,-16 -16,-8 -21,-12 -10,-9 11,4 48,9 82,12 63,6 95,-5 89,-30 -1,-7 -1,-9 1,-5 3,4 19,5 36,3 l 32,-5 -32,15 c -38,18 -42,32 -10,38 17,3 16,5 -8,6 -35,2 -80,35 -70,51 5,8 1,8 -11,0 -15,-9 -30,-7 -72,9 -62,25 -74,26 -47,5 z"
       id="path18" /><path
       d="m 830,900 c -8,-5 -33,-7 -55,-5 -39,5 -39,5 -10,-6 43,-17 68,-40 55,-53 -5,-5 -10,-15 -10,-20 0,-6 5,-5 12,2 7,7 26,13 42,13 27,2 28,2 6,6 -38,7 -54,32 -33,55 18,20 16,23 -7,8 z"
       id="path20" /><path
       d="m 937,688 c 2,-5 15,-8 28,-8 13,0 32,-11 42,-24 15,-19 21,-21 31,-10 10,11 10,14 -2,14 -8,0 -21,8 -28,18 -12,16 -82,26 -71,10 z"
       id="path22" /></g></g><g
   id="g4" class="lower_right ${(0, $da98d0425d3716de$export$56cc687933817664)(sectorClassData.lower_right)}"
   inkscape:label="lower_right"><path
     id="path41"
     d="m 1954.0251,195.22333 c 1.7381,2.98164 3.8565,4.77667 5.9749,4.77667 6,0 10,-10 10,-22 1,-33 33,-99 63,-127 34,-31 103,-39 146,-16 18,9 46,38 63,65 l 30,48 31,-35 c 80,-91 165,-77 254,40 l 21,27 53,-27 c 36,-19 68,-28 101,-28 41,0 52,5 83,35 20,20 46,61 58,92 22,52 24,55 42,41 32,-23 123,-45 155,-38 44,10 87,58 106,120 16,50 20,54 55,60 21,4 49,15 62,26 21,16 60,94 81,162 3,9 15,17 28,17 99,1 239,167 270,318 12,54 18,64 55,91 67,48 113,163 113,281 0,42 9,77 35,137 63,145 40,230 -79,288 -59,29 -181,42 -241,26 -66,-17 -114,-57 -115,-94 0,-10 -8,-32 -17,-50 -12,-22 -16,-53 -15,-100 2,-65 0,-71 -33,-109 -39,-46 -65,-114 -65,-170 0,-32 -3,-38 -20,-38 -41,0 -87,-28 -110,-66 -13,-22 -47,-62 -77,-91 -36,-35 -53,-60 -53,-77 0,-17 -7,-27 -22,-31 -56,-17 -133,-124 -126,-174 4,-26 1,-30 -25,-35 -16,-3 -46,-23 -65,-43 -24,-26 -42,-37 -58,-35 -34,5 -76,-21 -132,-83 -47,-51 -54,-55 -96,-55 -70,0 -146,-19 -203,-51 -30,-17 -55,-25 -58,-19 -3,6 -27,10 -53,10 -63,0 -223,-20 -242,-30 -2.3166,-1.287 -5.9583,-2.17647 -10.5499,-2.68547"
     style="display:inline;stroke:#1a1a1a"
     transform="translate(0,-2.5000001e-5)"
     inkscape:label="lower_right_outlines" /><g
     id="g60"
     class="surfaces"
     style="display:inline"
     transform="translate(0,-2.5000001e-5)"
     inkscape:label="lower_right_surfaces"><path
       id="path56"
       d="m 2256,446 c 17,-13 19,-27 19,-133 0,-116 -1,-119 -35,-182 -45,-82 -90,-110 -150,-92 -78,23 -110,95 -117,267 l -6,122 41,7 c 48,8 166,22 203,24 14,0 34,-5 45,-13 v 0" /><path
       id="path54"
       d="m 2581,498 c 17,-31 6,-242 -14,-290 C 2517,90 2431,42 2353,90 c -62,37 -68,58 -64,209 2,104 6,140 18,153 20,23 88,48 154,58 93,13 107,12 120,-12 v 0" /><path
       id="path52"
       d="m 2803,623 c 39,-42 56,-92 67,-200 13,-122 -2,-183 -59,-243 -32,-34 -44,-40 -80,-40 -43,0 -107,27 -130,53 -9,12 -10,33 -1,98 7,47 8,118 5,168 l -7,87 57,52 c 68,62 105,69 148,25 v 0" /><path
       id="path50"
       d="m 3014,724 c 58,-1 73,-5 87,-23 26,-32 57,-121 70,-199 10,-60 9,-73 -11,-124 -36,-96 -93,-126 -181,-96 -76,25 -85,39 -92,130 -7,96 -28,169 -64,216 -24,31 -24,34 -8,58 21,33 73,56 105,47 14,-4 56,-8 94,-9 v 0" /><path
       id="path48"
       d="m 3277,940 c 40,-24 58,-58 72,-141 18,-107 14,-171 -15,-245 -29,-71 -68,-107 -113,-102 -22,3 -26,11 -38,73 -15,73 -53,167 -80,197 -12,13 -30,17 -77,16 -90,-2 -106,5 -106,51 0,26 9,51 29,78 44,60 66,73 120,67 28,-4 61,0 86,10 55,20 84,19 122,-4 v 0" /><path
       id="path46"
       d="m 3570,1201 c 40,-29 81,-120 87,-192 5,-60 2,-70 -36,-145 -65,-130 -143,-204 -215,-204 -27,0 -29,5 -41,124 -7,79 -40,153 -76,171 -37,19 -107,19 -154,0 -20,-9 -45,-13 -56,-10 -37,12 -20,56 50,126 25,25 57,61 70,79 32,43 75,60 158,61 37,1 82,5 98,9 40,11 85,4 115,-19 v 0" /><path
       id="path44"
       d="m 3756,1464 c 57,-27 73,-59 69,-136 -7,-123 -52,-234 -108,-268 -40,-25 -47,-25 -47,-2 0,32 -50,120 -87,153 -36,31 -38,31 -107,24 -39,-4 -89,-8 -111,-9 l -40,-1 2,44 c 3,53 48,148 83,173 34,24 112,34 158,19 31,-10 43,-10 72,3 45,20 74,20 116,0 v 0" /><path
       id="path42"
       d="m 3750,1758 c 63,-19 117,-64 135,-113 20,-52 16,-82 -22,-167 l -26,-59 -32,31 c -44,43 -100,55 -160,34 -36,-12 -53,-13 -80,-4 -19,6 -54,8 -83,4 -46,-6 -50,-5 -55,17 -12,42 -7,105 8,125 8,10 15,27 15,37 1,92 152,140 300,95 v 0" /></g><g
     id="g76"
     class="plaque"
     transform="matrix(9.9999998,0,0,-9.9999998,0,3950)"
     inkscape:label="lower_right_plaque"><path
       d="m 384.67,225.29266 v 3.68929 c 0,2.87165 -0.41232,5.73253 -1.22977,8.48537 -0.52079,1.75382 -1.09893,3.49437 -1.84464,5.165 -0.85578,1.91722 -1.9308,3.73648 -3.19738,5.41096 0.88401,0.79503 1.74531,1.61532 2.58249,2.45952 0.71472,0.72072 1.41187,1.45887 2.09061,2.21358 0.63028,-1.48691 1.28628,-2.96292 1.96761,-4.42715 0.89046,-1.91366 1.82526,-3.80972 2.58251,-5.77989 0.71842,-1.86916 1.27542,-3.80367 1.59869,-5.77988 0.23985,-1.46627 0.34856,-2.98286 0,-4.42715 -0.35939,-1.48915 -1.18524,-2.82247 -2.0906,-4.05822 -0.75735,-1.03372 -1.57932,-2.02009 -2.45952,-2.95143 z"
       id="path76"
       inkscape:path-effect="#path-effect76"
       inkscape:original-d="m 384.67,225.29266 c 0,0 0,2.41853 0,3.68929 0,1.27075 -0.81984,5.6979 -1.22977,8.48537 -0.40992,2.78746 -1.22976,3.40234 -1.84464,5.165 -0.61489,1.76267 -3.19738,5.41096 -3.19738,5.41096 0,0 1.68067,1.63968 2.58249,2.45952 0.90183,0.81985 2.09061,2.21358 2.09061,2.21358 0,0 1.27075,-2.86944 1.96761,-4.42715 0.69687,-1.5577 1.72167,-3.85326 2.58251,-5.77989 0.86083,-1.92663 1.06579,-3.85325 1.59869,-5.77988 0.5329,-1.92663 0,-2.95144 0,-4.42715 0,-1.47572 -1.39373,-2.70548 -2.0906,-4.05822 -0.69687,-1.35274 -2.45952,-2.95143 -2.45952,-2.95143 z" /><path
       d="m 377.90631,250.37984 c 0.85785,0.60122 1.64401,1.30462 2.33655,2.0906 0.78403,0.88982 1.4478,1.88547 1.96762,2.95143 0.30199,2.23972 0.34335,4.51448 0.12298,6.7637 -0.23618,2.41058 -0.77045,4.78155 -1.35275,7.13263 -0.72066,2.90971 -1.51852,5.80589 -2.58249,8.60834 -0.88771,2.33818 -1.96805,4.62118 -3.44335,6.64073 -0.97806,1.33887 -2.12809,2.55671 -3.44334,3.56631 -1.40309,1.07703 -2.99093,1.91274 -4.6731,2.45952 -0.0635,-1.25703 -0.31302,-2.50451 -0.73785,-3.68928 -0.39107,-1.09061 -0.93047,-2.12793 -1.5987,-3.07442 1.65209,-0.7736 3.22155,-1.72353 4.6731,-2.82845 1.76272,-1.34178 3.36219,-2.92622 4.55013,-4.79608 1.61618,-2.54392 2.41572,-5.51947 2.95144,-8.48537 0.5064,-2.80357 0.79716,-5.64256 0.98381,-8.48537 0.19349,-2.94693 0.27555,-5.90117 0.24595,-8.85429 z"
       id="path77"
       inkscape:path-effect="#path-effect77"
       inkscape:original-d="m 377.90631,250.37984 c 0,0 1.47571,1.39373 2.33655,2.0906 0.86083,0.69686 1.96762,2.95143 1.96762,2.95143 0,0 0.082,4.46814 0.12298,6.7637 0.041,2.29555 -0.98381,4.71409 -1.35275,7.13263 -0.36892,2.41853 -1.63968,5.73889 -2.58249,8.60834 -0.94282,2.86945 -2.29557,4.42715 -3.44335,6.64073 -1.14777,2.21357 -2.29555,2.37753 -3.44334,3.56631 -1.14777,1.18877 -4.6731,2.45952 -4.6731,2.45952 0,0 -0.45091,-2.37754 -0.73785,-3.68928 -0.28695,-1.31175 -1.5987,-3.07442 -1.5987,-3.07442 0,0 3.1564,-1.96762 4.6731,-2.82845 1.51671,-0.86084 2.99243,-3.11541 4.55013,-4.79608 1.5577,-1.68068 1.92663,-5.65691 2.95144,-8.48537 1.0248,-2.82846 0.69686,-5.65691 0.98381,-8.48537 0.28694,-2.82845 0.24595,-8.85429 0.24595,-8.85429 z" /><path
       d="m 363.64105,286.78084 c 0.65222,1.57525 1.10777,3.23181 1.35274,4.91905 0.3308,2.27842 0.27704,4.6011 0,6.88668 -0.26997,2.22728 -0.75448,4.43904 -1.59869,6.51774 -1.06526,2.623 -2.67773,4.97973 -4.1812,7.37858 -1.29258,2.06238 -2.51396,4.17293 -3.93524,6.14882 -1.17265,1.63024 -2.48029,3.16595 -3.93524,4.55012 -1.60559,1.52748 -3.40236,2.876 -5.41097,3.81227 -2.743,1.27859 -5.85465,1.75398 -8.85429,1.35274 v -6.2718 c 0,-2.46829 -0.083,-4.94439 -0.49191,-7.37857 1.32457,-0.0175 2.64714,-0.18278 3.93525,-0.49191 2.18844,-0.5252 4.27068,-1.46544 6.14882,-2.70548 2.23481,-1.47553 4.16838,-3.35889 6.02584,-5.28798 1.92161,-1.99571 3.78755,-4.06579 5.28798,-6.39477 1.53173,-2.37755 2.66016,-4.99017 3.68929,-7.62453 0.69842,-1.7878 1.35454,-3.59213 1.96762,-5.41096 z"
       id="path78"
       inkscape:path-effect="#path-effect78"
       inkscape:original-d="m 363.64105,286.78084 c 0,0 0.81985,3.27937 1.35274,4.91905 0.5329,1.63968 -0.082,4.6731 0,6.88668 0.082,2.21357 -0.98381,4.26318 -1.59869,6.51774 -0.61489,2.25457 -2.82846,4.96005 -4.1812,7.37858 -1.35274,2.41854 -2.6235,4.05822 -3.93524,6.14882 -1.31175,2.0906 -2.5825,3.07441 -3.93524,4.55012 -1.35275,1.47572 -3.60731,2.50053 -5.41097,3.81227 -1.80365,1.31175 -8.85429,1.35274 -8.85429,1.35274 0,0 0,-4.09921 0,-6.2718 0,-2.17257 -0.49191,-7.37857 -0.49191,-7.37857 0,0 2.70549,-0.32794 3.93525,-0.49191 1.22976,-0.16397 4.01723,-1.88564 6.14882,-2.70548 2.13159,-0.81984 4.01722,-3.52532 6.02584,-5.28798 2.00861,-1.76266 3.52532,-4.18119 5.28798,-6.39477 1.76266,-2.21358 2.45952,-5.08302 3.68929,-7.62453 1.22976,-2.54151 1.96762,-5.41096 1.96762,-5.41096 z" /><path
       d="m 334.37268,321.33719 c -0.11458,1.80769 -0.27863,3.61224 -0.4919,5.41096 -0.24784,2.09032 -0.56816,4.19555 -1.35275,6.14882 -0.80963,2.01561 -2.09425,3.8137 -3.56631,5.41095 -1.43993,1.56238 -3.06578,2.94811 -4.79607,4.1812 -1.70818,1.21733 -3.52062,2.28832 -5.41096,3.19739 l -0.12298,3.19738 c 1.0327,0.31107 2.12098,0.43664 3.19739,0.36893 1.66218,-0.10456 3.28807,-0.67378 4.6731,-1.5987 1.87561,-1.25253 3.27007,-3.10607 4.42714,-5.04202 1.13252,-1.89488 2.0763,-3.90989 2.70548,-6.02585 0.62128,-2.0894 0.93096,-4.25615 1.35274,-6.39477 0.31271,-1.5856 0.68986,-3.18167 0.61488,-4.79607 -0.0663,-1.42652 -0.49302,-2.83488 -1.22976,-4.05822 z"
       id="path79"
       inkscape:path-effect="#path-effect79"
       inkscape:original-d="m 334.37268,321.33719 c 0,0 -0.32794,3.52532 -0.4919,5.41096 -0.16397,1.88564 -0.90183,4.09921 -1.35275,6.14882 -0.4509,2.0496 -2.37753,3.6073 -3.56631,5.41095 -1.18877,1.80366 -3.19738,2.78747 -4.79607,4.1812 -1.5987,1.39373 -5.41096,3.19739 -5.41096,3.19739 0,0 -0.12298,3.19738 -0.12298,3.19738 0,0 2.17258,0.24595 3.19739,0.36893 1.0248,0.12297 3.1154,-1.14778 4.6731,-1.5987 1.55769,-0.4509 2.95143,-3.32036 4.42714,-5.04202 1.47572,-1.72167 1.80365,-4.01723 2.70548,-6.02585 0.90183,-2.00861 0.90183,-4.22218 1.35274,-6.39477 0.45092,-2.17257 0.40992,-3.19738 0.61488,-4.79607 0.20497,-1.5987 -1.22976,-4.05822 -1.22976,-4.05822 z" /><path
       d="m 316.41814,343.84186 v 4.6731 c 0,0.36034 -0.006,0.72372 -0.0861,1.07509 -0.0799,0.35137 -0.23283,0.68686 -0.45371,0.97157 -0.22088,0.2847 -0.50544,0.5162 -0.81585,0.6992 -0.31042,0.18299 -0.64556,0.31965 -0.9809,0.45152 -1.55876,0.61298 -3.15269,1.15204 -4.79607,1.47572 -0.72267,0.14234 -1.45847,0.24297 -2.19428,0.20979 -0.7358,-0.0332 -1.47502,-0.20529 -2.10989,-0.57872 -0.67089,-0.39462 -1.19716,-0.99491 -1.64775,-1.62956 -0.45059,-0.63465 -0.83767,-1.31333 -1.30368,-1.93675 -1.02607,-1.37265 -2.40982,-2.44522 -3.44334,-3.81227 -1.28805,-1.70372 -1.96924,-3.77498 -2.70549,-5.77989 -0.64037,-1.74382 -1.33773,-3.46671 -2.09059,-5.165 -0.93145,0.829 -1.82377,1.70079 -2.70548,2.5825 l -2.33655,2.33655 c -0.42023,0.42023 -0.83395,0.85684 -1.12609,1.37438 -0.29214,0.51754 -0.46144,1.10584 -0.47261,1.70003 0.23705,1.34762 0.44209,2.70087 0.61489,4.05822 0.18751,1.47294 0.33703,2.95042 0.4919,4.42715 0.18466,1.76074 0.37701,3.52132 0.49191,5.28798 0.10116,1.55534 0.14219,3.11459 0.12297,4.6731 0.80764,1.03804 1.81537,1.9198 2.95143,2.5825 1.08033,0.63019 2.26424,1.05864 3.44334,1.47572 1.05193,0.37209 2.10885,0.73871 3.19739,0.98381 1.61035,0.36259 3.26881,0.45455 4.91905,0.49191 1.28255,0.029 2.59048,0.0222 3.81227,-0.36893 0.98265,-0.31459 1.87241,-0.86699 2.70548,-1.47572 0.79866,-0.58358 1.55848,-1.22649 2.21357,-1.96762 0.93012,-1.05228 1.63491,-2.28664 2.21358,-3.56631 0.59916,-1.32499 1.06864,-2.7041 1.59869,-4.05822 0.61551,-1.57245 1.31866,-3.13084 1.59869,-4.79608 0.36567,-2.17449 -0.0316,-4.46966 -1.10678,-6.39477 z"
       id="path80"
       inkscape:path-effect="#path-effect80"
       inkscape:original-d="m 316.41814,343.84186 c 0,0 0,3.07441 0,4.6731 0,1.59869 -1.55771,2.04961 -2.33656,3.19738 -0.77884,1.14778 -3.19738,1.0658 -4.79607,1.47572 -1.59869,0.40993 -2.86945,-0.24595 -4.30417,-0.36893 -1.43473,-0.12297 -1.96763,-2.41853 -2.95143,-3.56631 -0.98382,-1.14778 -2.29557,-2.50052 -3.44334,-3.81227 -1.14778,-1.31175 -1.80366,-3.85326 -2.70549,-5.77989 -0.90182,-1.92663 -2.09059,-5.165 -2.09059,-5.165 0,0 -1.92663,1.80365 -2.70548,2.5825 -0.77885,0.77885 -1.47572,1.47572 -2.33655,2.33655 -0.86084,0.86084 -1.5987,3.07441 -1.5987,3.07441 0,0 0.40992,2.70548 0.61489,4.05822 0.20496,1.35274 0.24595,3.03341 0.4919,4.42715 0.24596,1.39373 0.40992,3.44334 0.49191,5.28798 0.082,1.84464 0.12297,4.6731 0.12297,4.6731 0,0 1.96763,1.68068 2.95143,2.5825 0.98382,0.90183 2.33656,0.98381 3.44334,1.47572 1.10679,0.49191 2.04961,0.65587 3.19739,0.98381 1.14778,0.32794 3.36136,0.28695 4.91905,0.49191 1.5577,0.20496 2.50052,-0.24596 3.81227,-0.36893 1.31175,-0.12298 1.76266,-0.98382 2.70548,-1.47572 0.94282,-0.4919 1.47572,-1.31175 2.21357,-1.96762 0.73786,-0.65587 1.51671,-2.37754 2.21358,-3.56631 0.69687,-1.18878 1.0248,-2.66449 1.59869,-4.05822 0.57389,-1.39374 1.06579,-3.19739 1.59869,-4.79608 0.5329,-1.59869 -1.10678,-6.39477 -1.10678,-6.39477 z" /><path
       d="m 286.53488,360.68962 c 0.0479,1.25444 -0.16275,2.51818 -0.61488,3.68929 -0.5669,1.46839 -1.51287,2.78503 -2.70548,3.81227 -1.49446,1.28724 -3.33143,2.10151 -5.165,2.82845 -2.09789,0.83174 -4.26538,1.58101 -6.51775,1.72167 -1.76256,0.11007 -3.52428,-0.15593 -5.28798,-0.24595 -1.28532,-0.0656 -2.606,-0.0433 -3.81227,-0.49191 -1.43349,-0.53313 -2.59788,-1.74409 -3.07441,-3.19738 -0.38972,0.98302 -0.63898,2.02159 -0.73786,3.07441 -0.0653,0.69482 -0.0653,1.39577 0,2.09059 0.72094,1.06126 1.64422,1.98455 2.70548,2.70549 0.92632,0.62928 1.94826,1.10098 2.95143,1.59869 1.27232,0.63125 2.5433,1.31629 3.93525,1.59869 1.41022,0.28611 2.86889,0.14324 4.30417,0.24596 1.02804,0.0736 2.08012,0.27143 3.07441,0 0.56327,-0.15376 1.077,-0.452 1.55358,-0.78932 0.47657,-0.33733 0.92257,-0.71618 1.39785,-1.05533 1.00467,-0.71692 2.15543,-1.27032 2.95143,-2.21357 0.85532,-1.01355 1.19485,-2.34922 1.72167,-3.56632 0.5397,-1.24685 1.28878,-2.38942 1.96763,-3.56631 0.77645,-1.34609 1.47298,-2.77024 1.72167,-4.30418 0.21313,-1.31463 0.0848,-2.68313 -0.36894,-3.93524 z"
       id="path81"
       inkscape:path-effect="#path-effect81"
       inkscape:original-d="m 286.53488,360.68962 c 0,0 -0.45091,2.41853 -0.61488,3.68929 -0.16397,1.27075 -1.76266,2.54151 -2.70548,3.81227 -0.94282,1.27075 -3.52532,1.88563 -5.165,2.82845 -1.63969,0.94282 -4.26318,1.14778 -6.51775,1.72167 -2.25457,0.57389 -3.60731,-0.16397 -5.28798,-0.24595 -1.68068,-0.082 -2.45953,-0.32794 -3.81227,-0.49191 -1.35274,-0.16397 -3.07441,-3.19738 -3.07441,-3.19738 0,0 -0.4919,2.04961 -0.73786,3.07441 -0.24595,1.0248 0,2.09059 0,2.09059 0,0 1.88564,1.88565 2.70548,2.70549 0.81984,0.81984 1.80366,1.0248 2.95143,1.59869 1.14778,0.57388 2.74647,1.0248 3.93525,1.59869 1.18877,0.57389 2.86944,0.16397 4.30417,0.24596 1.43472,0.082 2.00861,0 3.07441,0 1.06579,0 2.00861,-1.31175 2.95143,-1.84465 0.94282,-0.5329 1.96762,-1.47572 2.95143,-2.21357 0.98381,-0.73786 1.10679,-2.37755 1.72167,-3.56632 0.61488,-1.18878 1.31175,-2.33655 1.96763,-3.56631 0.65587,-1.22977 1.14777,-2.82846 1.72167,-4.30418 0.57388,-1.47571 -0.36894,-3.93524 -0.36894,-3.93524 z" /></g><g
     id="g58"
     style="display:inline"
     inkscape:label="lower_right_slots"><path
       d="m 3613,1697 c -10,-21 -16,-23 -74,-21 l -64,3 53,-9 c 29,-4 56,-11 59,-14 4,-3 6,-39 6,-78 l -1,-73 8,69 c 5,38 12,72 17,77 4,4 31,10 58,12 l 50,3 -54,2 c -51,2 -53,3 -47,27 8,31 2,32 -11,2 z"
       id="path13" /><path
       d="m 3555,1380 c -5,-17 -16,-20 -63,-22 l -57,-2 48,-3 c 41,-4 48,-7 42,-21 -4,-9 -10,-28 -12,-42 -4,-20 -1,-18 14,10 27,51 60,59 122,28 28,-14 46,-19 39,-11 -19,23 -65,43 -98,43 -27,0 -30,3 -25,20 3,11 4,20 1,20 -2,0 -8,-9 -11,-20 z"
       id="path15" /><path
       d="m 3320,1144 c 0,-5 4,-15 9,-23 13,-20 -28,-51 -71,-52 -30,-2 -30,-2 -5,-6 36,-6 34,-20 -5,-38 l -33,-15 30,5 c 17,4 35,13 41,21 13,16 78,18 138,5 24,-6 35,-6 29,0 -5,5 -35,13 -66,17 -32,4 -59,12 -60,17 -1,6 25,19 58,30 56,19 109,44 93,45 -3,0 -32,-10 -63,-22 l -58,-22 -18,23 c -11,13 -19,19 -19,15 z"
       id="path17" /><path
       d="m 3082,898 c 18,-11 -2,-41 -33,-49 l -24,-7 23,-1 c 13,-1 33,-6 45,-13 20,-10 21,-10 9,5 -19,22 -2,48 40,63 33,11 33,11 -20,11 -29,-1 -46,-4 -40,-9 z"
       id="path19" /><path
       d="m 2920,707 c 0,-11 -13,-24 -32,-32 -18,-8 -25,-14 -16,-15 9,0 19,-6 21,-12 4,-10 6,-9 6,1 1,19 31,40 58,41 12,0 25,5 28,10 4,7 -3,8 -20,4 -18,-4 -30,-2 -36,7 -7,11 -9,10 -9,-4 z"
       id="path21" /></g></g></g></svg>
`;


const $3cb0a15594fd43d6$export$1e083828221390e5 = {
    "daily_clean": "mdi:repeat-once",
    "deep_clean": "mdi:water",
    "gum_care": "mdi:tooth-outline",
    "intense": "mdi:shape-circle-plus",
    "massage": "mdi:spa",
    "off": "mdi:power",
    "sensitive": "mdi:feather",
    "settings": "mdi:cog-outline",
    "super_sensitive": "mdi:feather",
    "tongue_cleaning": "mdi:gate-and",
    "turbo": "mdi:car-turbocharger",
    "whiten": "mdi:shimmer",
    "whitening": "mdi:shimmer",
    "default": "mdi:brush-variant"
};


var $7bfe0f8b5ad5b7ee$exports = {};
$7bfe0f8b5ad5b7ee$exports = ".card-content {\n  text-align: center;\n  flex-direction: column;\n  gap: 15px;\n  padding: 16px;\n  display: flex;\n}\n\n.title {\n  margin: 0 0 10px;\n  font-size: 1.2em;\n}\n\n.image-stack {\n  width: 100%;\n  margin: 0 auto;\n  padding-bottom: 75%;\n  position: relative;\n}\n\n.tooth-image {\n  object-fit: contain;\n  width: 100%;\n  height: 100%;\n  position: absolute;\n  top: 0;\n  left: 0;\n}\n\n.base-image, .active-sector {\n  width: 100%;\n  height: 100%;\n  top: 0;\n  left: 0;\n}\n\n.status-overlay, .time-overlay, .pressure-overlay {\n  color: var(--primary-text-color);\n  cursor: pointer;\n  font-weight: 500;\n  position: absolute;\n  left: 50%;\n  transform: translateX(-50%);\n}\n\n.status-overlay {\n  text-transform: capitalize;\n  color: var(--secondary-text-color);\n  font-size: 1.1em;\n  top: 30%;\n}\n\n.battery-container {\n  align-items: center;\n  gap: 4px;\n  display: inline-flex;\n}\n\n.battery-icon {\n  display: inline-block;\n  transform: rotate(90deg);\n}\n\n.time-overlay {\n  font-size: 56px;\n  font-weight: var(--ha-font-weight-normal);\n  font-family: var(--ha-font-family-body);\n  align-items: center;\n  gap: 5px;\n  display: flex;\n  top: 50%;\n  transform: translate(-50%, -50%);\n}\n\n.time-overlay ha-icon {\n  --mdc-icon-size: 1.2em;\n}\n\n.pressure-overlay {\n  align-items: center;\n  gap: 5px;\n  font-size: 1.1em;\n  font-weight: 700;\n  display: flex;\n  top: 65%;\n}\n\n.pressure-overlay ha-icon {\n  --mdc-icon-size: 1.2em;\n}\n\n.stats-container {\n  border-top: 1px solid var(--divider-color);\n  justify-content: space-around;\n  width: 100%;\n  padding-top: 10px;\n  display: flex;\n}\n\n.mode-container {\n  align-items: center;\n  gap: 4px;\n  display: flex;\n}\n\n.mode-icon {\n  --mdc-icon-size: 20px;\n  color: var(--primary-color);\n}\n\n.mode-level {\n  color: var(--primary-text-color);\n  text-transform: capitalize;\n  font-size: 1.1em;\n  font-weight: 500;\n}\n\n.stat-item {\n  cursor: pointer;\n  flex-direction: column;\n  align-items: center;\n  display: flex;\n}\n\n.stat-item .label {\n  color: var(--secondary-text-color);\n  margin-bottom: 2px;\n  font-size: .8em;\n}\n\n.surfaces {\n  fill: #fff;\n  stroke: #000;\n  stroke-width: 1px;\n  transition: fill .5s;\n}\n\n.plaque {\n  fill: #e3dbdb;\n  fill-rule: evenodd;\n  stroke: none;\n  stroke-width: .75px;\n}\n\n@keyframes blinkTooth {\n  0%, 100% {\n    fill: #fff;\n  }\n\n  50% {\n    fill: #aee4ff;\n  }\n}\n\n@keyframes blinkPlaque {\n  0%, 100% {\n    fill: #e3dbdb;\n  }\n\n  50% {\n    fill: #aee4ff;\n  }\n}\n\n.cleaning .surfaces {\n  stroke: #ccc;\n  stroke-width: 3px;\n  filter: url(\"#shadow\");\n  animation: 1s ease-in-out infinite blinkTooth;\n}\n\n.cleaning .plaque {\n  stroke: none;\n  stroke-width: .75px;\n  filter: url(\"#shadow\");\n  animation: 1s ease-in-out infinite blinkPlaque;\n}\n\n.cleaned .surfaces {\n  fill: #fff;\n}\n\n.cleaned .plaque {\n  fill: none;\n}\n";


class $930552a63f9e9686$export$e2f41388bb2b94a0 extends (0, $528e4332d1e3099e$export$3f2f9f5909897157) {
    set hass(hass) {
        this._hass = hass;
        // determinig all required entitys (if not already done)
        if (!this._entityIds && this.config?.device_id) this._entityIds = this._findAndMapEntitiesInConfig(hass, this.config.device_id);
        this.requestUpdate();
    }
    get hass() {
        return this._hass;
    }
    /*
     * Timer to update the display periodically
     */ connectedCallback() {
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
        // remember config
        this.config = config;
        // lazy init (if not already done by set hass)
        if (this._hass && !this._entityIds) this._entityIds = this._findAndMapEntitiesInConfig(this._hass, config.device_id);
    }
    getCardSize() {
        return 4;
    }
    _showMoreInfo(entityId = null) {
        const targetEntityId = entityId || this._entityIds?.base_entity;
        if (!this._hass || !targetEntityId) {
            console.error("Unable to open target entity. No target defined.");
            return;
        }
        // 2. Event auslösen
        this.dispatchEvent(new CustomEvent('hass-more-info', {
            bubbles: true,
            composed: true,
            detail: {
                entityId: targetEntityId
            }
        }));
    }
    _getSectorData(sector) {
        const allSectors = [
            'lower_left',
            'lower_right',
            'upper_left',
            'upper_right'
        ];
        // helper function to determine the active sector
        const getActiveIndex = (input)=>{
            switch(input){
                case 'sector_1':
                case 'sector 1':
                case '1':
                    return 0;
                case 'sector_2':
                case 'sector 2':
                case '2':
                    return 1;
                case 'sector_3':
                case 'sector 3':
                case '3':
                    return 2;
                case 'sector_4':
                case 'sector 4':
                case '4':
                    return 3;
                default:
                    return -1;
            }
        };
        // determine the currently active sector
        const activeIndex = getActiveIndex(sector);
        // Preparing the result object
        const sectorClassMaps = {
            lower_left: {
                cleaned: false,
                cleaning: false
            },
            lower_right: {
                cleaned: false,
                cleaning: false
            },
            upper_left: {
                cleaned: false,
                cleaning: false
            },
            upper_right: {
                cleaned: false,
                cleaning: false
            }
        };
        // success: all sectors are cleaned
        if (sector === 'success') {
            allSectors.forEach((sectorName)=>{
                sectorClassMaps[sectorName].cleaned = true;
            });
            return sectorClassMaps;
        }
        // unknown: all sectors remain unclean
        if (activeIndex === -1) return sectorClassMaps;
        // in progress: mark previously passed sectors as clean
        allSectors.forEach((sectorName, index)=>{
            if (index < activeIndex) sectorClassMaps[sectorName].cleaned = true;
            else if (index === activeIndex) sectorClassMaps[sectorName].cleaning = true;
        });
        return sectorClassMaps;
    }
    /**
     * Searching for all needed entities.
     * 
     * @param {Object} hass the home assistant object
     * @param {string} deviceId the device id
     * @returns {Object} 
     */ _findAndMapEntitiesInConfig(hass, deviceId) {
        const entityKeys = {
            sector: null,
            duration: null,
            mode: null,
            pressure: null,
            battery: null,
            status: null,
            base_entity: null
        };
        // getting all known entities
        const allEntities = hass.entities;
        // searching for entities that belong to the device
        for(const entityId in allEntities){
            const entity = allEntities[entityId];
            if (entity.device_id !== deviceId) continue;
            // getting the entity state and device-lcass
            const state = hass.states[entityId];
            const deviceClass = state?.attributes?.device_class;
            // determine entity type based on translation-key (see /workspaces/ha-core/homeassistant/components/oralb/sensor.py)
            if (entity.translation_key === 'sector') entityKeys.sector = entity.entity_id;
            else if (entity.translation_key === 'mode') entityKeys.mode = entity.entity_id;
            else if (entity.translation_key === 'pressure') entityKeys.pressure = entity.entity_id;
            else if (entity.translation_key === 'toothbrush_state') entityKeys.status = entity.entity_id;
            // determine entity type based on device-class
            if (deviceClass) {
                if (entityKeys.battery === null && deviceClass === 'battery') entityKeys.battery = entity.entity_id;
                else if (entityKeys.duration === null && deviceClass === 'duration') entityKeys.duration = entity.entity_id;
            }
            // fallback for the status object
            if (entityKeys.status === null && entityKeys.base_entity === null) {
                if (!entity.entity_id.includes('_') || entity.entity_id.endsWith(deviceId)) entityKeys.base_entity = entity.entity_id;
            }
        }
        // finalize status id
        if (entityKeys.status !== null) {
            entityKeys.base_entity = entityKeys.status;
            entityKeys.status = null;
        }
        return entityKeys;
    }
    render() {
        const hass = this._hass;
        const config = this.config;
        // Lazy init if required
        if (!hass || !config || !this._entityIds) {
            // Falls _hass vorhanden, aber _entityIds null ist (was nicht passieren sollte),
            // versuchen Sie das Mapping noch einmal. Sonst leere Card zeigen.
            if (hass && config?.device_id) this._entityIds = this._findAndMapEntitiesInConfig(hass, config.device_id);
            else throw new Error('Please enter the device id');
        }
        // getting the device and name
        const device = hass.devices[config.device_id];
        const deviceName = device.name;
        // getting all neccessary sensors
        const entityIds = this._entityIds; // Abruf der gespeicherten IDs
        // Zustandswerte direkt über die gespeicherte Map abrufen
        const sector = entityIds.sector ? hass.states[entityIds.sector]?.state || 'no_sector' : 'no_sector';
        const duration = entityIds.duration ? hass.states[entityIds.duration]?.state || 0 : 0;
        const pressure = entityIds.pressure ? hass.states[entityIds.pressure]?.state || 'N/A' : 'N/A';
        const batteryLevel = entityIds.battery ? hass.states[entityIds.battery]?.state || 0 : 0;
        // mode
        const mode = entityIds.mode ? hass.states[entityIds.mode]?.state || 'N/A' : 'N/A';
        const modeIcon = this._getModeIcon(mode);
        // status (using the base entity)
        const statusEntityId = entityIds.base_entity;
        const status = statusEntityId ? hass.states[statusEntityId]?.state || 'unknown' : 'unknown';
        // getting the battery status
        const batteryIsCharging = status == "charging";
        const batteryIconName = this._getBatteryIcon(batteryLevel, batteryIsCharging);
        const batteryIconColor = this._getBatteryColor(batteryLevel);
        const sectorClassData = this._getSectorData(sector);
        // rendering the html
        return (0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)`
            <ha-card>
                <div class="card-content">
                    <h1 class="title">
                        ${deviceName}
                    </h1>

                    <div class="image-stack">
                        <!-- the tooth svg -->
                        ${(0, $84db147239ed44e7$export$d760b013da4dfa06)(sectorClassData)}

                        <!-- the current status of the brush -->
                        <div class="status-overlay" @click="${()=>this._showMoreInfo(entityIds.base_entity)}">${status}</div>
                        
                        <!-- the duration since start -->
                        <div class="time-overlay" @click="${()=>this._showMoreInfo(entityIds.duration)}">
                            <span>${this._formatTime(duration)}</span>
                        </div>

                        <div class="pressure-overlay" @click="${()=>this._showMoreInfo(entityIds.pressure)}">
                            <ha-icon icon="mdi:tooth-outline"></ha-icon>
                            Pressure: ${pressure}
                        </div>
                    </div>

                    <div class="stats-container">
                        <div class="stat-item" @click="${()=>this._showMoreInfo(entityIds.mode)}">
                            <span class="label">Mode:</span>
                            <div class="mode-container">
                                <ha-icon class="value mode-icon" .icon="${modeIcon}"></ha-icon> 
                                <span class="value mode-level">${mode}</span>
                            </div>
                        </div>
                        <div class="stat-item" @click="${()=>this._showMoreInfo(entityIds.battery)}">
                            <span class="label">Battery:</span>
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
    _getBatteryColor(level) {
        if (level <= 15) return 'red';
        if (level <= 30) return 'orange';
        return 'var(--paper-item-icon-color)';
    }
    /**
     * Determine the proper image for battery 
     * See: https://pictogrammers.com/library/mdi/ 
     */ _getBatteryIcon(level, is_charging) {
        // parsing battery level string to int
        const batteryLevel = parseInt(level, 10);
        // determine if charging is active
        if (is_charging === true) return 'mdi:battery-charging';
        // battery level less than or equal 5% is alert
        if (batteryLevel <= 5) return 'mdi:battery-alert-variant-outline';
        // calculate level 
        const roundedLevel = Math.min(100, Math.ceil(batteryLevel / 10) * 10);
        // battery level is less then 10%
        if (roundedLevel === 0) return 'mdi:battery-outline';
        // battery level is greater than 90%
        if (roundedLevel === 100) return 'mdi:battery';
        // return icon name e.g. 'mdi:battery-80'
        return `mdi:battery-${roundedLevel}`;
    }
    // Innerhalb Ihrer LitElement Card-Klasse
    _getModeIcon(mode) {
        const cleanMode = String(mode).toLowerCase().replace(/ /g, '_');
        return (0, $3cb0a15594fd43d6$export$1e083828221390e5)[cleanMode] || (0, $3cb0a15594fd43d6$export$1e083828221390e5).default;
    }
    /**
     * Format duraction 
     * @param {*} seconds 
     * @returns 
     */ _formatTime(seconds) {
        const secs = parseInt(seconds);
        if (isNaN(secs) || secs < 0) return '00:00';
        const minutes = Math.floor(secs / 60);
        const remainingSeconds = secs % 60;
        const padSeconds = (num)=>num.toString().padStart(2, '0');
        const formattedMinutes = minutes.toString();
        return `${formattedMinutes}:${padSeconds(remainingSeconds)}`;
    }
    static get styles() {
        return (0, $06bdd16cbb4a41b3$export$8d80f9cac07cdb3)((0, (/*@__PURE__*/$parcel$interopDefault($7bfe0f8b5ad5b7ee$exports))));
    }
    /**
     * The properties to configure
     */ static getConfigForm() {
        return {
            schema: [
                {
                    name: "device_id",
                    required: true,
                    selector: {
                        device: {
                            filter: {
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
        return {
            device_id: ""
        };
    }
}


customElements.define('toothbrush-card', (0, $930552a63f9e9686$export$e2f41388bb2b94a0));
window.customCards = window.customCards || [];
window.customCards.push({
    type: "toothbrush-card",
    name: "Toothbrush Card",
    description: "A custom card to display the status of your toothbrush."
});


