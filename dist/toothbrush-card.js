
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
    lan_connect: 'M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z',
    lan_disconnect: 'M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM17 7h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z'
};
const $3cb0a15594fd43d6$export$1e083828221390e5 = {
    // OralB modes
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
    // Sonicare modes
    "clean": "mdi:toothbrush-electric",
    "white_plus": "mdi:shimmer",
    "gum_health": "mdi:tooth-outline",
    "deep_clean_plus": "mdi:water",
    "tongue_care": "mdi:emoticon-tongue-outline",
    "default": "mdi:brush-variant"
};


var $76eee68ef692a3c3$exports = {};
$76eee68ef692a3c3$exports = JSON.parse('{"chip_battery":"Battery","chip_pressure":"Pressure","chip_intensity":"Intensity","chip_mode":"Mode","chip_score":"Score","chip_head":"Head","session":"Session","complete":"Complete","done_title":"Brushing complete!","done_sextants":"All 6 sextants finished","done_quadrants":"All 4 quadrants finished","pressure_low":"Low","pressure_normal":"Normal","pressure_medium":"Medium","pressure_high":"High","intensity_low":"Low","intensity_medium":"Medium","intensity_high":"High","status_idle":"Idle","status_running":"Running","status_charging":"Charging","status_selection_menu":"Selection Menu","status_initializing":"Connecting\u2026","status_unavailable":"Unavailable","status_unknown":"Unknown","status_off":"Off","status_standby":"Standby","status_run":"Running","status_charge":"Charging","status_shutdown":"Shutdown","zone_upper_right":"Upper right","zone_upper_front":"Upper front","zone_upper_left":"Upper left","zone_lower_left":"Lower left","zone_lower_front":"Lower front","zone_lower_right":"Lower right","mode_daily_clean":"Daily Clean","mode_deep_clean":"Deep Clean","mode_gum_care":"Gum Care","mode_intense":"Intense","mode_massage":"Massage","mode_off":"Off","mode_sensitive":"Sensitive","mode_settings":"Settings","mode_super_sensitive":"Super Sensitive","mode_tongue_cleaning":"Tongue Clean","mode_turbo":"Turbo","mode_whiten":"Whiten","mode_whitening":"Whitening","mode_unknown":"Unknown","mode_clean":"Clean","mode_white_plus":"White+","mode_gum_health":"Gum Health","mode_deep_clean_plus":"Deep Clean+","mode_tongue_care":"Tongue Care","config_device":"Device","config_title":"Title (Optional)","config_subtitle":"Show device name as subtitle","hold_off":"Off","config_hold_duration":"Keep finished session for","hold_until_next_session":"Until the next session","completed_just_now":"just now","completed_ago_minutes":"{n} min ago","completed_ago_hours":"{n} h ago","config_accent_color":"Accent color","config_tooth_color":"Tooth color","config_active_color":"Active sector color","config_done_color":"Completed sector color","config_num_sectors":"Number of sectors","config_sector_order":"Sector order","config_layout":"Layout","config_layout_hint":"Place each reading as a chip (top row, max 3) or a corner marker. Each reading can be used once.","config_layout_chips":"Chips (max. 3)","config_layout_chip":"Chip","config_layout_corners":"Corner markers","layout_none":"\u2014 None \u2014","pos_top_left":"Top left","pos_top_right":"Top right","pos_bottom_left":"Bottom left","pos_bottom_right":"Bottom right","config_show_header":"Show header","config_tooth_style":"Style","tooth_style_teeth":"Teeth ring (default)","tooth_style_none":"Hidden \u2014 large timer + progress bar","group_device":"Device","group_header":"Header","group_teeth":"Teeth graphic","group_behavior":"Behavior","config_sector_mode_device":"Sectors reported by device","config_sector_mode_time":"Sectors calculated from routine time","config_sector_revisit_hint":"Note: some modes revisit specific zones (e.g. Sonicare White+ polishes the front teeth again). Reordering zones here can be confusing in those modes if the brush\'s start-quadrant preference isn\'t adjusted accordingly.","config_select_device":"Please enter the device id","config_reset_all":"Reset all options","config_reset_all_confirm":"Reset all options to their defaults? The device selection is kept."}');


var $238d401f28c1db46$exports = {};
$238d401f28c1db46$exports = JSON.parse('{"chip_battery":"Akku","chip_pressure":"Druck","chip_intensity":"Intensit\xe4t","chip_mode":"Modus","chip_score":"Score","chip_head":"Kopf","session":"Sitzung","complete":"Fertig","done_title":"Putzen abgeschlossen!","done_sextants":"Alle 6 Sextanten fertig","done_quadrants":"Alle 4 Quadranten fertig","pressure_low":"Niedrig","pressure_normal":"Normal","pressure_medium":"Mittel","pressure_high":"Hoch","intensity_low":"Niedrig","intensity_medium":"Mittel","intensity_high":"Hoch","status_idle":"Bereit","status_running":"Putzen","status_charging":"Laden","status_selection_menu":"Auswahl","status_initializing":"Verbinde\u2026","status_unavailable":"Nicht verf\xfcgbar","status_unknown":"Unbekannt","status_off":"Aus","status_standby":"Bereit","status_run":"Putzen","status_charge":"Laden","status_shutdown":"Ausschalten","zone_upper_right":"Oben rechts","zone_upper_front":"Oben vorne","zone_upper_left":"Oben links","zone_lower_left":"Unten links","zone_lower_front":"Unten vorne","zone_lower_right":"Unten rechts","mode_daily_clean":"T\xe4gliche Reinigung","mode_deep_clean":"Tiefenreinigung","mode_gum_care":"Zahnfleischschutz","mode_intense":"Intensiv","mode_massage":"Massage","mode_off":"Aus","mode_sensitive":"Sensitiv","mode_settings":"Einstellungen","mode_super_sensitive":"Extrasensitiv","mode_tongue_cleaning":"Zungenreinigung","mode_turbo":"Turbo","mode_whiten":"Aufhellen","mode_whitening":"Aufhellung","mode_unknown":"Unbekannt","mode_clean":"Reinigung","mode_white_plus":"White+","mode_gum_health":"Zahnfleischschutz","mode_deep_clean_plus":"Tiefenreinigung+","mode_tongue_care":"Zungenpflege","config_device":"Ger\xe4t","config_title":"Titel (Optional)","config_subtitle":"Ger\xe4tename als Untertitel anzeigen","hold_off":"Aus","config_hold_duration":"Abgeschlossene Sitzung anzeigen f\xfcr","hold_until_next_session":"Bis zur n\xe4chsten Sitzung","completed_just_now":"gerade eben","completed_ago_minutes":"vor {n} min","completed_ago_hours":"vor {n} Std.","config_accent_color":"Akzentfarbe","config_tooth_color":"Zahnfarbe","config_active_color":"Farbe aktiver Sektor","config_done_color":"Farbe fertiger Sektor","config_num_sectors":"Anzahl Sektoren","config_sector_order":"Sektorreihenfolge","config_layout":"Layout","config_layout_hint":"Jeden Wert als Chip (obere Reihe, max. 3) oder als Eck-Markierung platzieren. Jeder Wert nur einmal.","config_layout_chips":"Chips (max. 3)","config_layout_chip":"Chip","config_layout_corners":"Eck-Markierungen","layout_none":"\u2014 Keine \u2014","pos_top_left":"Oben links","pos_top_right":"Oben rechts","pos_bottom_left":"Unten links","pos_bottom_right":"Unten rechts","config_show_header":"Header anzeigen","config_tooth_style":"Stil","tooth_style_teeth":"Zahnkranz (Standard)","tooth_style_none":"Ausgeblendet \u2014 gro\xdfer Timer + Fortschrittsbalken","group_device":"Ger\xe4t","group_header":"Header","group_teeth":"Zahn-Grafik","group_behavior":"Verhalten","config_sector_mode_device":"Sektoren vom Ger\xe4t gemeldet","config_sector_mode_time":"Sektoren aus Putzzeit berechnet","config_sector_revisit_hint":"Hinweis: Manche Modi kehren zu bestimmten Zonen zur\xfcck (z.B. poliert Sonicare White+ die Frontz\xe4hne erneut). Eine abweichende Reihenfolge kann in diesen Modi verwirrend wirken, wenn der Startquadrant der B\xfcrste nicht entsprechend angepasst ist.","config_select_device":"Bitte Ger\xe4te-ID eingeben","config_reset_all":"Alle Optionen zur\xfccksetzen","config_reset_all_confirm":"Alle Optionen auf Standard zur\xfccksetzen? Die Ger\xe4teauswahl bleibt erhalten."}');


var $450b7740649a7c34$exports = {};
$450b7740649a7c34$exports = JSON.parse('{"chip_battery":"Batterij","chip_pressure":"Druk","chip_intensity":"Intensiteit","chip_mode":"Modus","chip_score":"Score","chip_head":"Kop","session":"Sessie","complete":"Afgerond","done_title":"Klaar met poetsen!","done_sextants":"Alle 6 sectoren afgerond","done_quadrants":"Alle 4 sectoren afgerond","pressure_low":"Laag","pressure_normal":"Normaal","pressure_medium":"Midden","pressure_high":"Hoog","intensity_low":"Laag","intensity_medium":"Midden","intensity_high":"Hoog","status_idle":"Rustend","status_running":"Draait","status_charging":"Opladen","status_selection_menu":"Selectie Menu","status_initializing":"Verbinden\u2026","status_unavailable":"Niet beschikbaar","status_unknown":"Onbekend","status_off":"Uit","status_standby":"Standby","status_run":"Draait","status_charge":"Laden","status_shutdown":"Afsluiten","zone_upper_right":"Boven rechts","zone_upper_front":"Boven voor","zone_upper_left":"Boven links","zone_lower_left":"Onder links","zone_lower_front":"Onder voor","zone_lower_right":"Onder rechts","mode_daily_clean":"Dagelijkse reiniging","mode_deep_clean":"Diepe reiniging","mode_gum_care":"Tandvlees verzorging","mode_intense":"Intens","mode_massage":"Massage","mode_off":"Uit","mode_sensitive":"Voorzichtig","mode_settings":"Instellingen","mode_super_sensitive":"Super voorzichtig","mode_tongue_cleaning":"Tong reiniging","mode_turbo":"Turbo","mode_whiten":"Bleken","mode_whitening":"Bleken","mode_unknown":"Onbekend","mode_clean":"Reinigen","mode_white_plus":"Bleek+","mode_gum_health":"Tandvlees gezondheid","mode_deep_clean_plus":"Diepe reiniging+","mode_tongue_care":"Tongreiniging","config_device":"Apparaat","config_title":"Titel (optioneel)","config_subtitle":"Toon apparaatnaam als onderschrift","hold_off":"Uit","config_hold_duration":"Voltooide sessie tonen gedurende","hold_until_next_session":"Tot de volgende sessie","completed_just_now":"zojuist","completed_ago_minutes":"{n} min geleden","completed_ago_hours":"{n} u geleden","config_accent_color":"Accentkleur","config_tooth_color":"Tandkleur","config_active_color":"Kleur actieve sector","config_done_color":"Kleur voltooide sector","config_num_sectors":"Aantal sectoren","config_sector_order":"Sectorvolgorde","config_layout":"Lay-out","config_layout_hint":"Plaats elke waarde als chip (bovenste rij, max. 3) of als hoek-markering. Elke waarde \xe9\xe9n keer.","config_layout_chips":"Chips (max. 3)","config_layout_chip":"Chip","config_layout_corners":"Hoek-markeringen","layout_none":"\u2014 Geen \u2014","pos_top_left":"Linksboven","pos_top_right":"Rechtsboven","pos_bottom_left":"Linksonder","pos_bottom_right":"Rechtsonder","config_show_header":"Koptekst tonen","config_tooth_style":"Stijl","tooth_style_teeth":"Tandenring (standaard)","tooth_style_none":"Verborgen \u2014 grote timer + voortgangsbalk","group_device":"Apparaat","group_header":"Koptekst","group_teeth":"Tandenweergave","group_behavior":"Gedrag","config_sector_mode_device":"Sectoren gerapporteerd door apparaat","config_sector_mode_time":"Sectoren berekend op basis van routine tijd","config_sector_revisit_hint":"Let op: sommige modi bezoeken bepaalde zones opnieuw (bijv. Sonicare White+ poetst de voortanden nogmaals). Een afwijkende volgorde kan in die modi verwarrend zijn als de startkwadrant-voorkeur van de borstel niet wordt aangepast.","config_select_device":"Vul het apparaat-id in","config_reset_all":"Alle opties resetten","config_reset_all_confirm":"Alle opties terugzetten naar standaard? De apparaatkeuze blijft behouden."}');


const $d8078e452c66bdbe$var$LOCALES = {
    en: (/*@__PURE__*/$parcel$interopDefault($76eee68ef692a3c3$exports)),
    de: (/*@__PURE__*/$parcel$interopDefault($238d401f28c1db46$exports)),
    nl: (/*@__PURE__*/$parcel$interopDefault($450b7740649a7c34$exports))
};
function $d8078e452c66bdbe$export$625550452a3fa3ec(hass, key) {
    const lang = hass?.language || 'en';
    const locale = $d8078e452c66bdbe$var$LOCALES[lang] || $d8078e452c66bdbe$var$LOCALES.en;
    return locale[key] || $d8078e452c66bdbe$var$LOCALES.en[key] || key;
}


var $7bfe0f8b5ad5b7ee$exports = {};
$7bfe0f8b5ad5b7ee$exports = "ha-card {\n  overflow: visible;\n  container-type: inline-size;\n}\n\n.card-header {\n  border-bottom: 1px solid var(--divider-color, #f3f4f6);\n  border-top-left-radius: var(--ha-card-border-radius, 12px);\n  border-top-right-radius: var(--ha-card-border-radius, 12px);\n  justify-content: space-between;\n  align-items: center;\n  padding: 16px 18px 12px;\n  display: flex;\n  position: relative;\n  overflow: hidden;\n}\n\n.card-header:before {\n  content: \"\";\n  background: var(--accent-color, transparent);\n  opacity: .12;\n  pointer-events: none;\n  transition: background .5s;\n  position: absolute;\n  inset: 0;\n}\n\n.header-accent {\n  background: var(--accent-color);\n  border-radius: 3px;\n  flex-shrink: 0;\n  width: 4px;\n  height: 28px;\n  transition: background .4s;\n}\n\n.header-title {\n  align-items: center;\n  gap: 8px;\n  display: flex;\n}\n\n.header-title h2 {\n  color: var(--primary-text-color);\n  letter-spacing: -.01em;\n  margin: 0;\n  font-size: 15px;\n  font-weight: 700;\n}\n\n.header-sub {\n  color: var(--secondary-text-color);\n  font-size: 12px;\n  font-weight: 400;\n}\n\n.header-icons {\n  align-items: center;\n  gap: 10px;\n  display: flex;\n}\n\n.header-icons svg:not(.conn-icon) {\n  width: 16px;\n  height: 16px;\n}\n\n.conn-icon {\n  width: 18px;\n  height: 18px;\n  color: var(--primary-color, #3b82f6);\n  fill: currentColor;\n  cursor: pointer;\n  opacity: 1;\n  transition: color .4s, opacity .4s;\n}\n\n.conn-icon.active {\n  color: #0082fc;\n}\n\n.conn-icon.disconnected {\n  color: var(--disabled-text-color, #9ca3af);\n  opacity: .3;\n}\n\n.more-info-btn {\n  cursor: pointer;\n  opacity: .5;\n  transition: opacity .2s;\n  color: var(--secondary-text-color) !important;\n}\n\n.more-info-btn:hover {\n  opacity: 1;\n}\n\n.init-wrap {\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  padding: 24px 0 32px;\n  display: flex;\n  overflow: hidden;\n}\n\n.init-rings {\n  flex-shrink: 0;\n  justify-content: center;\n  align-items: center;\n  width: 180px;\n  height: 180px;\n  display: flex;\n  position: relative;\n}\n\n.init-ring {\n  border: 2px solid var(--primary-color, #3b82f6);\n  opacity: 0;\n  border-radius: 50%;\n  animation: 3s ease-out infinite initPulse;\n  position: absolute;\n}\n\n.init-ring-1 {\n  width: 70px;\n  height: 70px;\n  animation-delay: 0s;\n}\n\n.init-ring-2 {\n  width: 70px;\n  height: 70px;\n  animation-delay: 1s;\n}\n\n.init-ring-3 {\n  width: 70px;\n  height: 70px;\n  animation-delay: 2s;\n}\n\n@keyframes initPulse {\n  0% {\n    opacity: .6;\n    width: 70px;\n    height: 70px;\n  }\n\n  100% {\n    opacity: 0;\n    width: 190px;\n    height: 190px;\n  }\n}\n\n.init-bt {\n  z-index: 1;\n  width: 52px;\n  height: 52px;\n  animation: 2s ease-in-out infinite initBtPulse;\n  position: relative;\n}\n\n.init-bt svg {\n  width: 52px;\n  height: 52px;\n}\n\n@keyframes initBtPulse {\n  0%, 100% {\n    opacity: .5;\n    transform: scale(.95);\n  }\n\n  50% {\n    opacity: 1;\n    transform: scale(1.05);\n  }\n}\n\n.init-label {\n  color: var(--primary-color, #3b82f6);\n  margin-top: 6px;\n  font-size: 13px;\n  font-weight: 500;\n}\n\n.chips-row {\n  grid-template-columns: 1fr 1fr 1fr;\n  gap: 8px;\n  padding: 12px 14px;\n  display: grid;\n}\n\n.chip {\n  background: var(--card-background-color, #f9fafb);\n  border: 1px solid var(--divider-color, #e5e7eb);\n  cursor: pointer;\n  border-radius: 10px;\n  grid-template-rows: auto auto;\n  grid-template-columns: auto 1fr;\n  align-items: center;\n  gap: 1px 8px;\n  padding: 8px 10px;\n  display: grid;\n}\n\n.chip-icon {\n  grid-row: 1 / 3;\n  justify-content: center;\n  align-items: center;\n  display: flex;\n}\n\n.chip-icon ha-icon {\n  --mdc-icon-size: 24px;\n}\n\n.chip-icon .brushhead-svg {\n  width: 19px;\n  height: 24px;\n}\n\n.chip-icon.green {\n  color: #16a34a;\n}\n\n.chip-icon.blue {\n  color: #2563eb;\n}\n\n.chip-icon.amber {\n  color: #d97706;\n}\n\n.chip-icon.red {\n  color: #dc2626;\n}\n\n.chip-icon.muted {\n  color: var(--disabled-text-color, #9ca3af);\n}\n\n.chip-icon.int-low {\n  color: #0891b2;\n}\n\n.chip-icon.int-med {\n  color: #7c3aed;\n}\n\n.chip-icon.int-high {\n  color: #db2777;\n}\n\n.chip-icon.gold {\n  color: #c47f16;\n}\n\n.chip-label {\n  color: var(--secondary-text-color);\n  text-transform: uppercase;\n  letter-spacing: .06em;\n  font-size: 9px;\n  font-weight: 600;\n}\n\n.chip-value {\n  color: var(--primary-text-color);\n  text-transform: capitalize;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  font-size: 12px;\n  font-weight: 700;\n  line-height: 1;\n  overflow: hidden;\n}\n\n.chip-value.green {\n  color: #16a34a;\n}\n\n.chip-value.blue {\n  color: #2563eb;\n}\n\n.chip-value.amber {\n  color: #d97706;\n}\n\n.chip-value.red {\n  color: #dc2626;\n}\n\n.chip-value.int-low {\n  color: #0891b2;\n}\n\n.chip-value.int-med {\n  color: #7c3aed;\n}\n\n.chip-value.int-high {\n  color: #db2777;\n}\n\n.chip-value.gold {\n  color: #c47f16;\n}\n\n.chip-value.muted {\n  color: var(--disabled-text-color, #9ca3af);\n}\n\n.pressure-bars {\n  grid-row: 1 / 3;\n  justify-content: center;\n  align-items: flex-end;\n  gap: 2px;\n  display: flex;\n}\n\n.pb {\n  background: var(--divider-color, #e5e7eb);\n  border-radius: 2px;\n  width: 4px;\n  transition: background .3s;\n}\n\n.pb:first-child {\n  height: 5px;\n}\n\n.pb:nth-child(2) {\n  height: 9px;\n}\n\n.pb:nth-child(3) {\n  height: 13px;\n}\n\n.pb:nth-child(4) {\n  height: 18px;\n}\n\n.p-low .pb:first-child {\n  background: #d97706;\n}\n\n.p-normal .pb:first-child, .p-normal .pb:nth-child(2) {\n  background: #16a34a;\n}\n\n.p-high .pb {\n  background: #dc2626;\n}\n\n.mode-chip-wrap {\n  position: relative;\n}\n\n.chip.selectable {\n  cursor: pointer;\n}\n\n.mode-caret {\n  opacity: .5;\n  font-size: 10px;\n}\n\n.chip-select-hint {\n  display: none;\n}\n\n.dropdown-backdrop {\n  z-index: 9;\n  position: fixed;\n  inset: 0;\n}\n\n.mode-dropdown {\n  z-index: 10;\n  background: var(--card-background-color, #fff);\n  border: 1px solid var(--divider-color, #e5e7eb);\n  border-radius: 12px;\n  min-width: 160px;\n  animation: .15s ease-out dropdown-in;\n  position: absolute;\n  top: calc(100% + 4px);\n  right: 0;\n  overflow: hidden;\n  box-shadow: 0 4px 16px #0000001f;\n}\n\n@keyframes dropdown-in {\n  from {\n    opacity: 0;\n    transform: translateY(-4px);\n  }\n\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n\n.mode-option {\n  cursor: pointer;\n  color: var(--primary-text-color);\n  align-items: center;\n  gap: 10px;\n  padding: 10px 14px;\n  font-size: 13px;\n  font-weight: 500;\n  transition: background .15s;\n  display: flex;\n}\n\n.mode-option:hover {\n  background: var(--secondary-background-color, #f3f4f6);\n}\n\n.mode-option.active {\n  color: #2563eb;\n  font-weight: 600;\n}\n\n.mode-option ha-icon {\n  --mdc-icon-size: 20px;\n  color: inherit;\n}\n\n.mode-option:not(:last-child) {\n  border-bottom: 1px solid var(--divider-color, #f3f4f6);\n}\n\n.visual-area {\n  flex-direction: column;\n  align-items: center;\n  padding: 4px 14px 10px;\n  display: flex;\n  position: relative;\n}\n\n.card-header + .visual-area, .visual-area:first-child {\n  padding-top: 16px;\n}\n\n.tooth-wrap {\n  justify-content: center;\n  align-items: center;\n  width: 210px;\n  height: 210px;\n  display: flex;\n  position: relative;\n}\n\n.tooth-svg {\n  width: 100%;\n  height: 100%;\n}\n\n.zone {\n  fill: var(--tb-tooth-color, var(--divider-color, #f3f4f6));\n  transition: fill .3s;\n}\n\n.brushing .zone {\n  fill: var(--tb-active-color, #93c5fd);\n  animation: .8s ease-in-out infinite alternate brush-zone;\n}\n\n@keyframes brush-zone {\n  from {\n    opacity: .6;\n  }\n\n  to {\n    opacity: 1;\n  }\n}\n\n.done .zone {\n  fill: var(--tb-done-color, #bbf7d0) !important;\n}\n\n.center-info {\n  text-align: center;\n  pointer-events: none;\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n}\n\n.session-label {\n  color: var(--secondary-text-color);\n  text-transform: uppercase;\n  letter-spacing: .1em;\n  margin-bottom: 2px;\n  font-size: 9px;\n  font-weight: 600;\n  display: block;\n}\n\n.timer-display {\n  color: var(--primary-text-color);\n  letter-spacing: -1px;\n  font-variant-numeric: tabular-nums;\n  font-size: 30px;\n  font-weight: 400;\n  line-height: 1;\n  transition: color .4s;\n}\n\n.timer-display.active {\n  color: var(--primary-color, #2563eb);\n}\n\n.center-info.standalone {\n  pointer-events: auto;\n  cursor: pointer;\n  padding: 10px 0 4px;\n  position: static;\n  transform: none;\n}\n\n.center-info.standalone .timer-display {\n  letter-spacing: -2px;\n  font-size: 52px;\n}\n\n.status-row {\n  grid-template-columns: 66px 1fr 66px;\n  align-items: center;\n  width: calc(100% + 8px);\n  margin: 2px -4px 10px;\n  display: grid;\n}\n\n.status-row .card-corner {\n  position: static;\n}\n\n.status-text-wrap {\n  text-align: center;\n  cursor: pointer;\n}\n\n.status-main {\n  color: var(--primary-text-color);\n  text-transform: capitalize;\n  font-size: 14px;\n  font-weight: 600;\n  transition: color .4s;\n}\n\n.status-main.active {\n  color: var(--primary-color, #2563eb);\n}\n\n.status-sub {\n  color: var(--secondary-text-color);\n  text-transform: capitalize;\n  margin-top: 1px;\n  font-size: 11px;\n}\n\n.progress-wrap {\n  opacity: 0;\n  width: 100%;\n  height: 0;\n  padding: 0 14px;\n  transition: opacity .4s, height .4s;\n  overflow: hidden;\n}\n\n.progress-wrap.visible {\n  opacity: 1;\n  height: auto;\n  padding: 0 14px 10px;\n}\n\n.progress-track {\n  gap: 3px;\n  height: 4px;\n  display: flex;\n}\n\n.progress-seg {\n  background: var(--divider-color, #e5e7eb);\n  border-radius: 2px;\n  flex: 1;\n  overflow: hidden;\n}\n\n.progress-fill {\n  border-radius: 2px;\n  height: 100%;\n  transition: width .5s;\n}\n\n.progress-labels {\n  color: var(--secondary-text-color);\n  justify-content: space-between;\n  margin-top: 4px;\n  font-size: 10px;\n  display: flex;\n}\n\n.progress-labels span:first-child {\n  text-transform: capitalize;\n}\n\n.done-badge {\n  background: var(--card-background-color, #f0fdf4);\n  text-align: center;\n  border-top: 1px solid #bbf7d0;\n  padding: 10px 14px;\n  display: none;\n  position: relative;\n}\n\n.done-dismiss {\n  cursor: pointer;\n  color: var(--secondary-text-color, #888);\n  background: none;\n  border: none;\n  padding: 2px 4px;\n  font-size: 16px;\n  line-height: 1;\n  position: absolute;\n  top: 6px;\n  right: 10px;\n}\n\n.done-dismiss:hover {\n  color: var(--primary-text-color, #333);\n}\n\n.done-badge.show {\n  animation: .4s cubic-bezier(.34, 1.56, .64, 1) pop-in;\n  display: block;\n}\n\n@keyframes pop-in {\n  from {\n    opacity: 0;\n    transform: scaleY(.7);\n  }\n\n  to {\n    opacity: 1;\n    transform: scaleY(1);\n  }\n}\n\n.done-badge p {\n  color: #15803d;\n  margin: 0;\n  font-size: 13px;\n  font-weight: 600;\n}\n\n.done-badge span {\n  color: #16a34a;\n  font-size: 11px;\n}\n\n.done-age {\n  color: var(--secondary-text-color, #888);\n  font-size: 11px;\n  font-weight: 400;\n}\n\n.card-corner {\n  cursor: pointer;\n  opacity: .85;\n  z-index: 1;\n  flex-direction: column;\n  align-items: center;\n  gap: 1px;\n  width: 66px;\n  transition: opacity .2s;\n  display: flex;\n  position: absolute;\n}\n\n.card-corner:hover {\n  opacity: 1;\n}\n\n.card-corner.tl {\n  top: 6px;\n  left: 10px;\n}\n\n.card-corner.tr {\n  top: 6px;\n  right: 10px;\n}\n\n.corner-ico {\n  --mdc-icon-size: 22px;\n  width: 22px;\n  height: 22px;\n}\n\n.corner-lbl {\n  letter-spacing: .06em;\n  text-transform: uppercase;\n  color: var(--secondary-text-color);\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  max-width: 100%;\n  font-size: 8px;\n  font-weight: 700;\n  overflow: hidden;\n}\n\n.corner-val {\n  font-variant-numeric: tabular-nums;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  max-width: 100%;\n  font-size: 11px;\n  font-weight: 800;\n  overflow: hidden;\n}\n\n.corner-ico.green, .corner-val.green {\n  color: #16a34a;\n}\n\n.corner-ico.blue, .corner-val.blue {\n  color: #2563eb;\n}\n\n.corner-ico.amber, .corner-val.amber {\n  color: #d97706;\n}\n\n.corner-ico.red, .corner-val.red {\n  color: #dc2626;\n}\n\n.corner-ico.muted, .corner-val.muted {\n  color: var(--disabled-text-color, #9ca3af);\n}\n\n.corner-ico.int-low, .corner-val.int-low {\n  color: #0891b2;\n}\n\n.corner-ico.int-med, .corner-val.int-med {\n  color: #7c3aed;\n}\n\n.corner-ico.int-high, .corner-val.int-high {\n  color: #db2777;\n}\n\n.corner-ico.gold, .corner-val.gold {\n  color: #c47f16;\n}\n\n.brushhead-svg {\n  width: 17px;\n  height: 22px;\n}\n\n.brushhead-pct {\n  color: var(--secondary-text-color);\n  font-size: 9px;\n  font-weight: 600;\n}\n\n@container (width <= 350px) {\n  .chip {\n    grid-template-columns: 1fr;\n    justify-items: center;\n    row-gap: 0;\n    padding: 8px 4px;\n    position: relative;\n  }\n\n  .chip-icon, .pressure-bars {\n    grid-row: auto;\n  }\n\n  .chip-label, .chip-value {\n    display: none;\n  }\n\n  .chip-select-hint {\n    --mdc-icon-size: 12px;\n    color: #2563eb;\n    opacity: .6;\n    display: block;\n    position: absolute;\n    bottom: 2px;\n    right: 2px;\n  }\n\n  .tooth-wrap {\n    width: 180px;\n    height: 180px;\n  }\n\n  .timer-display {\n    font-size: 26px;\n  }\n\n  .card-corner {\n    width: 54px;\n  }\n\n  .card-corner.tl {\n    left: 2px;\n  }\n\n  .card-corner.tr {\n    right: 2px;\n  }\n\n  .status-row {\n    grid-template-columns: 54px 1fr 54px;\n    width: calc(100% + 24px);\n    margin-left: -12px;\n    margin-right: -12px;\n  }\n}\n";


const $930552a63f9e9686$export$d5e7ce6d07daf10f = "0.21.0";
const $930552a63f9e9686$var$BRUSHING_DURATION = 120; // 2 minutes target
const $930552a63f9e9686$export$1a6ef95039f86f17 = {
    oralb: {
        translationKey: 'toothbrush_state'
    },
    philips_sonicare_ble: {
        translationKey: 'handle_state'
    },
    xiaomi_ble: {
        idSuffix: '_toothbrush'
    }
};
function $930552a63f9e9686$export$f8997d7b344b36dd(entity) {
    const m = $930552a63f9e9686$export$1a6ef95039f86f17[entity.platform];
    if (!m) return false;
    if (m.translationKey) return entity.translation_key === m.translationKey;
    return entity.entity_id.endsWith(m.idSuffix);
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
const $930552a63f9e9686$export$334d820851c0d6af = [
    'battery',
    'pressure',
    'intensity',
    'mode',
    'score',
    'brush_head'
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
        if (chips.length >= 3) break;
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
        integration: null,
        brushhead_wear: null,
        activity: null,
        mode_select: null,
        esp_bridge_alive: null,
        ble_connected: null,
        score: null
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
                entityKeys.brushhead_wear = entity.entity_id;
                entityKeys.brushhead_remaining = true;
            }
        }
        // Shared translation_keys (OralB + Sonicare >= 0.8)
        if (entity.translation_key === 'sector') entityKeys.sector = entity.entity_id;
        else if (entity.translation_key === 'number_of_sectors') entityKeys.number_of_sectors = entity.entity_id;
        else if (entity.translation_key === 'mode') entityKeys.mode = entity.entity_id;
        else if (entity.translation_key === 'pressure') entityKeys.pressure = entity.entity_id;
        else if (entity.translation_key === 'toothbrush_state') entityKeys.status = entity.entity_id;
        // Sonicare translation_keys
        if (entity.translation_key === 'handle_state') entityKeys.status = entity.entity_id;
        else if (entity.translation_key === 'brushing_mode') entityKeys.mode = entity.entity_id;
        else if (entity.translation_key === 'pressure_alert') entityKeys.pressure = entity.entity_id;
        else if (entity.translation_key === 'pressure_state') // Categorical pressure state (ok / optimal / too_high). Kept
        // separate so it can take precedence over the raw grams
        // 'pressure' sensor and the 'intensity' fallback regardless of
        // entity iteration order.
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
        this._highestSector = -1;
        this._lastRawIndex = -1;
        this._correctedIndex = -1;
        this._wasActive = false;
        // Completion latch (issue #4): persist the finished-session view.
        this._peakDuration = 0;
        this._completed = false;
        this._completedDuration = 0;
        this._wasActiveSession = false;
        this._sessionRoutineLength = 0;
        this._completedAt = 0;
        this._holdDismissed = false;
    }
    // --- Held-session persistence (issue #4/#5 follow-up) ---
    // The completion latch survives page reloads via localStorage: Oral-B
    // brushes wipe their reported session data ~seconds after powering off,
    // so after a reload there is often nothing left to re-derive from the
    // sensors. Stored per device, cleared when the next session starts.
    _holdStorageKey(deviceId) {
        return `toothbrush-card-hold-${deviceId}`;
    }
    _loadHeldSession(deviceId) {
        try {
            const raw = localStorage.getItem(this._holdStorageKey(deviceId));
            const held = raw ? JSON.parse(raw) : null;
            if (!held) return null;
            // A dismissed marker (X on the badge) suppresses re-deriving the
            // same session from frozen sensor values until a new one starts.
            if (held.dismissed) return {
                dismissed: true
            };
            return held.completedAt > 0 && held.duration > 0 ? held : null;
        } catch (e) {
            return null;
        }
    }
    _dismissHold() {
        this._completed = false;
        this._completedAt = 0;
        this._completedDuration = 0;
        this._holdDismissed = true;
        const deviceId = this.config?.device_id;
        if (deviceId) try {
            localStorage.setItem(this._holdStorageKey(deviceId), JSON.stringify({
                dismissed: true
            }));
        } catch (e) {}
        this.requestUpdate();
    }
    _saveHeldSession(deviceId, completedAt, duration) {
        try {
            localStorage.setItem(this._holdStorageKey(deviceId), JSON.stringify({
                completedAt: completedAt,
                duration: duration
            }));
        } catch (e) {}
    }
    _clearHeldSession(deviceId) {
        try {
            localStorage.removeItem(this._holdStorageKey(deviceId));
        } catch (e) {}
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
            this._peakDuration = 0;
            this._wasActiveSession = false;
            this._sessionRoutineLength = 0;
            const held = this._loadHeldSession(config.device_id);
            this._holdDismissed = !!held?.dismissed;
            this._completed = !!held && !held.dismissed;
            this._completedDuration = this._completed ? held.duration : 0;
            this._completedAt = this._completed ? held.completedAt : 0;
        }
        if (this._hass && !this._entityIds) this._entityIds = this._findAndMapEntitiesInConfig(this._hass, config.device_id);
    }
    getCardSize() {
        return 5;
    }
    /**
     * Inline style for the <ha-card>, exposing the accent color plus the
     * optional tooth/active/done color overrides (issue #6). Colors left
     * unset fall back to the CSS defaults.
     */ _cardStyle() {
        const c = this.config || {};
        let style = `--accent-color: ${c.accent_color || '#FFFFFF'}`;
        if (c.tooth_color) style += `; --tb-tooth-color: ${c.tooth_color}`;
        if (c.active_color) style += `; --tb-active-color: ${c.active_color}`;
        if (c.done_color) style += `; --tb-done-color: ${c.done_color}`;
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
    /**
     * Workaround for oralb_ble mapping bug: 6-sector brushes wrap back to
     * sector 4 instead of reporting sectors 5/6. During active brushing
     * sectors only move forward, so if we see a sector ≤ the highest
     * already seen, we advance to the next one instead.
     */ _correctSectorIndex(rawIndex, active, maxIndex) {
        if (!this._wasActive && active) {
            this._highestSector = -1;
            this._lastRawIndex = -1;
            this._correctedIndex = -1;
        }
        this._wasActive = active;
        if (!active || rawIndex === -1) {
            this._highestSector = -1;
            this._lastRawIndex = -1;
            this._correctedIndex = -1;
            return rawIndex;
        }
        // Same raw value as last render — return cached result
        if (rawIndex === this._lastRawIndex) return this._correctedIndex;
        this._lastRawIndex = rawIndex;
        if (rawIndex > this._highestSector) {
            this._highestSector = rawIndex;
            this._correctedIndex = rawIndex;
        } else {
            // Sector went backwards or repeated — advance
            const corrected = Math.min(this._highestSector + 1, maxIndex);
            this._highestSector = corrected;
            this._correctedIndex = corrected;
        }
        return this._correctedIndex;
    }
    _trackVisitedSector(rawIndex, active) {
        if (!active) {
            this._visitedSectors = null;
            return 0;
        }
        if (!this._visitedSectors) this._visitedSectors = new Set();
        if (rawIndex >= 0) this._visitedSectors.add(rawIndex);
        return this._visitedSectors.size;
    }
    _parseRawSectorIndex(sector) {
        const match = String(sector).match(/(\d+)/);
        if (match) {
            const idx = parseInt(match[1]) - 1;
            return idx >= 0 ? idx : -1;
        }
        return -1;
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
        if (activeIndex === -1 || activeIndex >= sectorOrder.length) return sectorClassMaps;
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
    _getIntensityIcon(intensity) {
        // Graded speedometer, matching the integration's intensity control.
        const v = String(intensity).toLowerCase();
        if (v === 'high') return 'mdi:speedometer';
        if (v === 'low') return 'mdi:speedometer-slow';
        return 'mdi:speedometer-medium';
    }
    _getIntensityColor(intensity) {
        // Own, non-alarming level scale — intensity is a chosen setting, so a
        // high level must never read as a warning (unlike pressure's red).
        const v = String(intensity).toLowerCase();
        if (v === 'high') return 'int-high';
        if (v === 'medium') return 'int-med';
        if (v === 'low') return 'int-low';
        return 'muted';
    }
    _normalizeLayout(config) {
        return $930552a63f9e9686$export$d859d72b10c9a984(config);
    }
    _isActive(status) {
        return status === 'running' || status === 'run';
    }
    /**
     * Searching for all needed entities.
     */ _findAndMapEntitiesInConfig(hass, deviceId) {
        return $930552a63f9e9686$export$23f5d0f4bf90bc55(hass, deviceId);
    }
    render() {
        const hass = this._hass;
        const config = this.config;
        if (!hass || !config || !this._entityIds) {
            if (hass && config?.device_id) this._entityIds = this._findAndMapEntitiesInConfig(hass, config.device_id);
            else throw new Error('Please enter the device id');
        }
        const entityIds = this._entityIds;
        const device = hass.devices[config.device_id];
        const deviceName = device.name;
        const manufacturer = device.manufacturer || '';
        const modelNumber = entityIds.model_number ? hass.states[entityIds.model_number]?.state || '' : '';
        const headerTitle = config.title || manufacturer || deviceName;
        const rawSub = config.show_subtitle !== false ? modelNumber || deviceName : '';
        const headerSub = rawSub && headerTitle && rawSub.startsWith(headerTitle) ? rawSub.slice(headerTitle.length).trim() : rawSub;
        // Read sensor states
        const numSectorsFromEntity = entityIds.number_of_sectors ? parseInt(hass.states[entityIds.number_of_sectors]?.state) || null : null;
        const numSectors = config.num_sectors || numSectorsFromEntity || 4;
        const statusEntityId = entityIds.base_entity;
        const rawStatus = statusEntityId ? hass.states[statusEntityId]?.state || 'unknown' : 'unknown';
        // Binary main state entities (xiaomi_ble) report plain on/off.
        const status = rawStatus === 'on' ? 'running' : rawStatus === 'off' ? 'idle' : rawStatus;
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
        // Routine length: config override first, then the entity; synthetic-
        // timer devices (no duration entity) fall back to the 2-minute default
        // so the time-based sector path can run.
        const routineLength = Number(config.routine_length) || (entityIds.routine_length ? parseInt(hass.states[entityIds.routine_length]?.state) || 0 : 0) || (entityIds.duration ? 0 : $930552a63f9e9686$var$BRUSHING_DURATION);
        let brushheadWear = entityIds.brushhead_wear ? parseFloat(hass.states[entityIds.brushhead_wear]?.state) || null : null;
        // xiaomi_ble reports percentage left; the card tracks wear.
        if (brushheadWear !== null && entityIds.brushhead_remaining) brushheadWear = 100 - brushheadWear;
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
        if (active) {
            if (!this._wasActiveSession) {
                // New session started — drop any held completion.
                this._peakDuration = 0;
                this._completed = false;
                this._completedAt = 0;
                this._holdDismissed = false;
                this._visitedSectors = null;
                this._sessionRoutineLength = 0;
                this._clearHeldSession(config.device_id);
            }
            this._peakDuration = Math.max(this._peakDuration, duration);
            if (routineLength > 0) // Snapshot the routine governing THIS session; at the end the
            // routine_length sensor may already read unavailable (0).
            this._sessionRoutineLength = routineLength;
        } else if (this._wasActiveSession) {
            // Session just ended — latch if (nearly) a full routine was reached.
            const endTarget = (this._sessionRoutineLength || $930552a63f9e9686$var$BRUSHING_DURATION) * 0.9;
            this._completed = holdCompleted && this._peakDuration >= endTarget;
            this._completedDuration = this._peakDuration;
            this._peakDuration = 0;
            if (this._completed) {
                this._completedAt = Date.now();
                this._saveHeldSession(config.device_id, this._completedAt, this._completedDuration);
            }
        } else if (holdCompleted && !this._holdDismissed && (!entityIds.routine_length || routineLength > 0) && duration >= (routineLength || $930552a63f9e9686$var$BRUSHING_DURATION) * 0.9) {
            // Issue #5: also derive completion from the current state alone —
            // the frozen post-session values prove a finished session even if
            // the card never observed the transition (dashboard closed while
            // brushing, or reloaded afterwards). Skipped while an existing
            // routine_length sensor is unreadable, so an aborted long routine
            // can't slip past the shorter default target.
            // Issue #11: the hold restored from localStorage may belong to an
            // OLDER session. A reading that differs from the held duration is
            // a newer session (or a late tail sample of it — brush_time still
            // ticks up for a few seconds after the end), so adopt its
            // timestamp and value, downwards too. An identical reading is the
            // same session: an HA restart restores the exact value but
            // re-stamps last_changed, so there the held timestamp wins.
            if (!this._completed || duration !== this._completedDuration) {
                this._completedAt = Date.parse(hass.states[entityIds.duration]?.last_changed) || Date.now();
                this._completedDuration = duration;
                this._saveHeldSession(config.device_id, this._completedAt, duration);
            }
            this._completed = true;
        }
        this._wasActiveSession = active;
        // hold_duration in hours; absent = 0.5 h default, explicit 0 = until
        // the next session. After expiry the recap is merely hidden — a later
        // setting change can re-show it.
        const holdHours = config.hold_duration !== undefined ? Number(config.hold_duration) || 0 : 0.5;
        const holdExpired = holdHours > 0 && this._completedAt > 0 && Date.now() - this._completedAt > holdHours * 3600000;
        const showCompleted = holdCompleted && this._completed && !active && !holdExpired;
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
                                <path d="${(0, $3cb0a15594fd43d6$export$cd21dc7a72bbb52c).bluetooth}"/>
                            </svg>
                            ${entityIds.esp_bridge_alive ? (0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)`
                            <svg class="conn-icon ${espConnected ? '' : 'disconnected'}" viewBox="0 0 24 24" fill="currentColor"
                                 @click="${()=>this._showMoreInfo(entityIds.esp_bridge_alive)}">
                                <path d="${espConnected ? (0, $3cb0a15594fd43d6$export$cd21dc7a72bbb52c).lan_connect : (0, $3cb0a15594fd43d6$export$cd21dc7a72bbb52c).lan_disconnect}"/>
                            </svg>` : ''}
                            <svg class="more-info-btn" viewBox="0 0 24 24" fill="currentColor" stroke="none"
                                 @click="${()=>this._showDeviceInfo()}">
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
        // Sector: use real entity if available, otherwise compute from time
        let sector;
        if (entityIds.sector) sector = hass.states[entityIds.sector]?.state || 'no_sector';
        else if (routineLength > 0 && active && duration > 0) {
            const sectorDuration = routineLength / numSectors;
            // +1 because _parseRawSectorIndex expects 1-based values (OralB convention)
            const idx = Math.min(numSectors, Math.floor(duration / sectorDuration) + 1);
            sector = String(idx);
        } else if (routineLength > 0 && duration >= routineLength && duration > 0) sector = 'success';
        else sector = 'no_sector';
        // issue #4: while holding a finished session, present it as completed
        // (all zones done, final time) regardless of the now-idle live values.
        if (showCompleted) sector = 'success';
        const displayDuration = showCompleted ? this._completedDuration : duration;
        // Computed values
        const defaultOrder = numSectors === 6 ? $930552a63f9e9686$export$d18f9bb4634fc18d : $930552a63f9e9686$export$5055f2a665f9cd1e;
        const sectorOrder = config.sector_order?.length === numSectors ? config.sector_order : defaultOrder;
        const rawSectorIndex = this._parseRawSectorIndex(sector);
        // Sonicare meldet anatomische Sektoren inklusive Revisits (White+,
        // Gum Health) — dort den _correctSectorIndex-Workaround umgehen und
        // Done-Zonen zeit-basiert markieren, damit Revisits die bereits
        // abgeschlossenen Zonen nicht zurücksetzen. Oral-B braucht den
        // Workaround weiterhin (Integration meldet Sektor 5/6 als 4).
        const allowsRevisits = entityIds.integration === 'philips_sonicare_ble' && routineLength > 0;
        let correctedIndex;
        let doneCount = null;
        if (sector === 'success') correctedIndex = -1;
        else if (allowsRevisits) {
            correctedIndex = rawSectorIndex >= 0 ? Math.min(rawSectorIndex, sectorOrder.length - 1) : -1;
            // doneCount kombiniert Zeit-Fortschritt und tatsächlich beobachtete
            // Sektoren. Wir nutzen das Maximum, damit nach einem Revisit (White+:
            // nach 120s alle Zonen einmal durch) die bereits besuchten Zonen
            // "done" bleiben, auch wenn der Raw-Sektor wieder zurückspringt.
            const timeBasedDone = Math.min(sectorOrder.length, Math.floor(sectorOrder.length * duration / routineLength));
            const visitedSize = this._trackVisitedSector(rawSectorIndex, active);
            doneCount = Math.max(timeBasedDone, visitedSize);
        } else correctedIndex = this._correctSectorIndex(rawSectorIndex, active, sectorOrder.length - 1);
        const sectorClassData = this._getSectorData(sector, correctedIndex, sectorOrder, doneCount);
        const sectorLabel = this._getSectorLabel(sector, correctedIndex, sectorOrder);
        const isSuccess = sector === 'success';
        const batteryColor = batteryUnavailable ? 'muted' : this._getBatteryChipColor(batteryLevel);
        const batteryIsCharging = status === 'charging' || status === 'charge';
        const batteryIconName = batteryUnavailable ? 'mdi:battery-unknown' : this._getBatteryIcon(batteryLevel, batteryIsCharging);
        const pressureColor = this._getPressureColor(pressure);
        const pressureClass = this._getPressureClass(pressure);
        const intensityIcon = this._getIntensityIcon(intensity);
        const intensityColor = this._getIntensityColor(intensity);
        const modeUnavailable = mode === 'unavailable' || mode === 'unknown' || mode === 'N/A';
        const modeIcon = modeUnavailable ? 'mdi:brush-variant' : this._getModeIcon(mode);
        const modeLabel = modeUnavailable ? "\u2013" : this._getModeLabel(mode);
        const targetDuration = routineLength || $930552a63f9e9686$var$BRUSHING_DURATION;
        const progressPct = showCompleted ? 100 : Math.min(100, Math.round(displayDuration / targetDuration * 100));
        const statusKey = 'status_' + status;
        const displayStatus = (0, $d8078e452c66bdbe$export$625550452a3fa3ec)(hass, statusKey) !== statusKey ? (0, $d8078e452c66bdbe$export$625550452a3fa3ec)(hass, statusKey) : status.replace(/_/g, ' ');
        const pressureKey = 'pressure_' + String(pressure).toLowerCase();
        const displayPressure = (0, $d8078e452c66bdbe$export$625550452a3fa3ec)(hass, pressureKey) !== pressureKey ? (0, $d8078e452c66bdbe$export$625550452a3fa3ec)(hass, pressureKey) : pressure.replace(/_/g, ' ');
        const intensityKey = 'intensity_' + String(intensity).toLowerCase();
        const displayIntensity = (0, $d8078e452c66bdbe$export$625550452a3fa3ec)(hass, intensityKey) !== intensityKey ? (0, $d8078e452c66bdbe$export$625550452a3fa3ec)(hass, intensityKey) : intensity.replace(/_/g, ' ');
        const btConnected = entityIds.ble_connected ? hass.states[entityIds.ble_connected]?.state === 'on' : status !== 'unavailable' && status !== 'unknown';
        const btActive = active || batteryIsCharging;
        // Age line under the done badge ("2 h ago") — a held recap must not
        // read as a just-finished session the next morning. Ticks via the
        // existing 1 s interval.
        let completedAgo = '';
        if (showCompleted && this._completedAt > 0) {
            const mins = Math.floor((Date.now() - this._completedAt) / 60000);
            if (mins < 1) completedAgo = (0, $d8078e452c66bdbe$export$625550452a3fa3ec)(hass, 'completed_just_now');
            else if (mins < 60) completedAgo = (0, $d8078e452c66bdbe$export$625550452a3fa3ec)(hass, 'completed_ago_minutes').replace('{n}', mins);
            else completedAgo = (0, $d8078e452c66bdbe$export$625550452a3fa3ec)(hass, 'completed_ago_hours').replace('{n}', Math.floor(mins / 60));
        }
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
        // Shared brush-head glyph (chip icon and corner marker): the head
        // capsule in side view — bristles sticking out sideways, the typical
        // Sonicare silhouette. The fill steps in quarters instead of tracking
        // the exact percentage: at icon size a continuous fill is unreadable,
        // discrete jumps are not.
        const bhSteps = brushheadPct > 75 ? 4 : brushheadPct > 50 ? 3 : brushheadPct > 25 ? 2 : 1;
        const bhClipY = 30 - bhSteps * 7.5;
        const bhColor = this._getBrushheadColor(brushheadWear);
        const bhFillHex = {
            green: '#16a34a',
            amber: '#d97706',
            red: '#dc2626'
        }[bhColor];
        const headSvg = ()=>(0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)`
            <svg viewBox="0 0 24 30" class="brushhead-svg">
                <defs>
                    <clipPath id="bh-fill-${this._bhClipId}">
                        <rect x="0" y="${bhClipY}" width="24" height="${30 - bhClipY}"/>
                    </clipPath>
                </defs>
                <path d="M11,5 C11,1.5 13,0 15.5,0 C18,0 20,1.5 20,5 L20,25 C20,28.5 18,30 15.5,30 C13,30 11,28.5 11,25 Z" fill="none" stroke="var(--secondary-text-color, #888)" stroke-width="2"/>
                <path d="M11,5 C11,1.5 13,0 15.5,0 C18,0 20,1.5 20,5 L20,25 C20,28.5 18,30 15.5,30 C13,30 11,28.5 11,25 Z" fill="${bhFillHex}" opacity="0.8" clip-path="url(#bh-fill-${this._bhClipId})"/>
                <line x1="10.5" y1="4" x2="3" y2="4" stroke="var(--secondary-text-color, #888)" stroke-width="1.7"/>
                <line x1="10.5" y1="8" x2="2.5" y2="8" stroke="var(--secondary-text-color, #888)" stroke-width="1.7"/>
                <line x1="10.5" y1="12" x2="3" y2="12" stroke="var(--secondary-text-color, #888)" stroke-width="1.7"/>
                <line x1="10.5" y1="16" x2="4.5" y2="16" stroke="var(--secondary-text-color, #888)" stroke-width="1.7"/>
            </svg>`;
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
                        <div class="pressure-bars ${pressureClass}">
                            <div class="pb"></div><div class="pb"></div><div class="pb"></div><div class="pb"></div>
                        </div>
                        <span class="chip-label">${(0, $d8078e452c66bdbe$export$625550452a3fa3ec)(hass, 'chip_pressure')}</span>
                        <div class="chip-value ${pressureColor}">${displayPressure}</div>
                    </div>`;
                case 'intensity':
                    if (!intensityEntity) return '';
                    return (0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)`<div class="chip" @click="${()=>this._showMoreInfo(intensityEntity)}">
                        <div class="chip-icon ${intensityColor}"><ha-icon icon="${intensityIcon}"></ha-icon></div>
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
                    if (brushheadPct === null) return '';
                    return (0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)`<div class="chip" @click="${()=>this._showMoreInfo(entityIds.brushhead_wear)}">
                        <div class="chip-icon">${headSvg()}</div>
                        <span class="chip-label">${(0, $d8078e452c66bdbe$export$625550452a3fa3ec)(hass, 'chip_head')}</span>
                        <div class="chip-value ${bhColor}">${brushheadPct}%</div>
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
                if (brushheadPct === null) return '';
                return (0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)`<div class="card-corner ${cls} brushhead-indicator" @click="${()=>this._showMoreInfo(entityIds.brushhead_wear)}">
                    ${headSvg()}
                    <span class="corner-lbl">${(0, $d8078e452c66bdbe$export$625550452a3fa3ec)(hass, 'chip_head')}</span>
                    <span class="corner-val ${bhColor}">${brushheadPct}%</span>
                </div>`;
            }
            const marker = (entityId, icon, colorClass, label, value)=>(0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)`
                <div class="card-corner ${cls}" @click="${()=>this._showMoreInfo(entityId)}">
                    <ha-icon class="corner-ico ${colorClass}" icon="${icon}"></ha-icon>
                    <span class="corner-lbl">${label}</span>
                    <span class="corner-val ${colorClass}">${value}</span>
                </div>`;
            switch(prop){
                case 'battery':
                    if (!entityIds.battery) return '';
                    return marker(entityIds.battery, batteryIconName, batteryColor, (0, $d8078e452c66bdbe$export$625550452a3fa3ec)(hass, 'chip_battery'), batteryUnavailable ? "\u2013" : (0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)`${batteryLevel}%`);
                case 'pressure':
                    if (!pressureEntity) return '';
                    return marker(pressureEntity, 'mdi:gauge', pressureColor, (0, $d8078e452c66bdbe$export$625550452a3fa3ec)(hass, 'chip_pressure'), displayPressure);
                case 'intensity':
                    if (!intensityEntity) return '';
                    return marker(intensityEntity, intensityIcon, intensityColor, (0, $d8078e452c66bdbe$export$625550452a3fa3ec)(hass, 'chip_intensity'), displayIntensity);
                case 'mode':
                    if (!entityIds.mode && !entityIds.mode_select) return '';
                    return marker(entityIds.mode_select || entityIds.mode, modeIcon, modeUnavailable ? 'muted' : 'blue', (0, $d8078e452c66bdbe$export$625550452a3fa3ec)(hass, 'chip_mode'), modeLabel);
                case 'score':
                    if (!scoreAvailable) return '';
                    return marker(entityIds.score, scoreIcon, scoreColor, (0, $d8078e452c66bdbe$export$625550452a3fa3ec)(hass, 'chip_score'), scoreState);
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
                            <path d="${(0, $3cb0a15594fd43d6$export$cd21dc7a72bbb52c).bluetooth}"/>
                        </svg>
                        ${entityIds.esp_bridge_alive ? (0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)`
                        <svg class="conn-icon ${espConnected ? '' : 'disconnected'}" viewBox="0 0 24 24" fill="currentColor"
                             @click="${()=>this._showMoreInfo(entityIds.esp_bridge_alive)}">
                            <path d="${espConnected ? (0, $3cb0a15594fd43d6$export$cd21dc7a72bbb52c).lan_connect : (0, $3cb0a15594fd43d6$export$cd21dc7a72bbb52c).lan_disconnect}"/>
                        </svg>` : ''}
                        <svg class="more-info-btn" viewBox="0 0 24 24" fill="currentColor" stroke="none"
                             @click="${()=>this._showDeviceInfo()}">
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

                    <div class="progress-wrap ${active || isSuccess ? 'visible' : ''}">
                        <div class="progress-track">
                            ${Array.from({
            length: numSectors || 1
        }, (_, i)=>{
            // Same time-based fill as before, sliced into one
            // sub-bar per sector so the boundaries are visible.
            const n = numSectors || 1;
            const segPct = Math.max(0, Math.min(100, (progressPct / 100 * n - i) * 100));
            const fill = `width: ${segPct}%; background: linear-gradient(90deg, ${$930552a63f9e9686$var$progressColorAt(i / n)}, ${$930552a63f9e9686$var$progressColorAt((i + segPct / 100) / n)})`;
            return (0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)`<div class="progress-seg">
                                    <div class="progress-fill" style="${fill}"></div>
                                </div>`;
        })}
                        </div>
                        <div class="progress-labels">
                            <span>${sectorLabel || ''}</span>
                            <span>${targetDuration > 0 ? (0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)`${this._formatTime(displayDuration)} / ${this._formatTime(targetDuration)}` : ''}</span>
                            <span>${progressPct}%</span>
                        </div>
                    </div>

                    ${topCornerEls}
                </div>

                <!-- Done badge -->
                <div class="done-badge ${isSuccess ? 'show' : ''}">
                    ${showCompleted ? (0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)`
                    <button class="done-dismiss"
                            @click=${()=>this._dismissHold()}>&times;</button>` : ''}
                    <p>&#10003; ${(0, $d8078e452c66bdbe$export$625550452a3fa3ec)(hass, 'done_title')}${completedAgo ? (0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)` <span class="done-age">(${completedAgo})</span>` : ''}</p>
                    <span>${(0, $d8078e452c66bdbe$export$625550452a3fa3ec)(hass, numSectors === 6 ? 'done_sextants' : 'done_quadrants')}</span>
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
    // One dropdown drives both hold keys: 'off' → hold_completed:false,
    // '0.5' (default) → no keys, anything else → hold_duration in hours.
    _holdValue() {
        if (this._config.hold_completed === false) return 'off';
        return this._config.hold_duration !== undefined ? String(this._config.hold_duration) : '0.5';
    }
    _holdChanged(value) {
        const newConfig = {
            ...this._config
        };
        delete newConfig.hold_completed;
        delete newConfig.hold_duration;
        if (value === 'off') newConfig.hold_completed = false;
        else if (value !== undefined && value !== '0.5') newConfig.hold_duration = Number(value);
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
    // Effective layout as fixed-length editor slots: chips padded to 3, all four
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
            availChips[0] || '',
            availChips[1] || '',
            availChips[2] || ''
        ];
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
        if (ids.brushhead_wear) a.add('brush_head');
        return a;
    }
    _propLabel(prop) {
        return (0, $d8078e452c66bdbe$export$625550452a3fa3ec)(this.hass, 'chip_' + (prop === 'brush_head' ? 'head' : prop)) || prop;
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
                    <ha-textfield
                        .value=${value}
                        .placeholder=${fallback}
                        @input=${(ev)=>this._valueChanged(key, ev.target.value)}
                    ></ha-textfield>
                </div>
            </div>
        `;
    }
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
            2
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
                    <ha-textfield
                        .label=${(0, $d8078e452c66bdbe$export$625550452a3fa3ec)(this.hass, 'config_title')}
                        .value=${this._config.title || ''}
                        @input=${(ev)=>this._valueChanged('title', ev.target.value)}
                    ></ha-textfield>
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
                </div>` : ''}

                <div class="group-label">${(0, $d8078e452c66bdbe$export$625550452a3fa3ec)(this.hass, 'group_teeth')}</div>
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

                ${this._config.tooth_style !== 'none' ? (0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)`
                ${this._colorField('tooth_color', 'config_tooth_color', '#d1d5db')}
                ${this._colorField('active_color', 'config_active_color', '#93c5fd')}
                ${this._colorField('done_color', 'config_done_color', '#bbf7d0')}` : ''}

                ${this._config.device_id && this._config.tooth_style !== 'none' ? (0, $d33ef1320595a3ac$export$c0bb0b647f701bb5)`
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

                <div class="group-label">${(0, $d8078e452c66bdbe$export$625550452a3fa3ec)(this.hass, 'group_behavior')}</div>
                <div class="field">
                    <ha-selector
                        .hass=${this.hass}
                        .selector=${{
            select: {
                mode: 'dropdown',
                options: [
                    {
                        value: 'off',
                        label: (0, $d8078e452c66bdbe$export$625550452a3fa3ec)(this.hass, 'hold_off')
                    },
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

                <button class="reset-all-btn" ?disabled=${!this._hasCustomOptions}
                        @click=${this._resetAll}>
                    ${(0, $d8078e452c66bdbe$export$625550452a3fa3ec)(this.hass, 'config_reset_all')}
                </button>
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
            .sector-mode-hint {
                font-size: 12px;
                color: var(--secondary-text-color, #888);
                font-style: italic;
                margin-bottom: 8px;
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
            .color-field ha-textfield {
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
console.info(`%c TOOTHBRUSH-CARD %c v${(0, $930552a63f9e9686$export$d5e7ce6d07daf10f)} `, "color:#fff;background:#1c1c1c;padding:2px 6px;border-radius:4px 0 0 4px;font-weight:700", "color:#1c1c1c;background:#42a5f5;padding:2px 6px;border-radius:0 4px 4px 0;font-weight:700");


