import { useState, useMemo } from "react";

// ── Brand Design System — Da Marcolino Official ──
const C = { rosso: '#C8392B', rosso2: '#9B2D20', giallo: '#E8B840', verde: '#2D6A2D', grigio: '#777777' };
const BG = { carta: '#EDE8DC', bianco: '#F9F6EF', nero: '#111111', border: 'rgba(17,17,17,0.15)' };
const T = { 100: '#111111', 300: '#444444', 500: '#777777', inv: '#F9F6EF' };

const DEFAULT_INGREDIENTI = [
    { id: 1, nome: "Farina", quantita: 1000, unita: "g", costoPerKg: 0.65, colore: C.giallo },
    { id: 2, nome: "Acqua", quantita: 620, unita: "g", costoPerKg: 0.001, colore: C.verde },
    { id: 3, nome: "Lievito di birra fresco", quantita: 3, unita: "g", costoPerKg: 3.5, colore: C.rosso },
    { id: 4, nome: "Sale", quantita: 25, unita: "g", costoPerKg: 0.4, colore: C.grigio },
    { id: 5, nome: "Olio EVO", quantita: 30, unita: "g", costoPerKg: 5.2, colore: '#8B6914' },
];

const DEFAULT_INDIRETTI = [
    { id: 1, nome: "Legna / Gas forno", icona: "🪵", costoMensile: 280, cat: "energia" },
    { id: 2, nome: "Elettricità", icona: "⚡", costoMensile: 180, cat: "energia" },
    { id: 3, nome: "Scarti di produzione", icona: "🗑️", costoMensile: 60, cat: "produzione" },
    { id: 4, nome: "Tovaglieria & carta", icona: "🧻", costoMensile: 90, cat: "sala" },
    { id: 5, nome: "Detersivi & pulizia", icona: "🧹", costoMensile: 45, cat: "sala" },
    { id: 6, nome: "Packaging & asporto", icona: "📦", costoMensile: 70, cat: "sala" },
];

const CATEGORIE = {
    energia: { label: "Energia", colore: C.giallo },
    produzione: { label: "Produzione", colore: C.rosso },
    sala: { label: "Sala & Servizio", colore: C.verde },
};

function fmt4(val) { return val.toLocaleString("it-IT", { style: "currency", currency: "EUR", minimumFractionDigits: 4 }); }
function fmt2(val) { return val.toLocaleString("it-IT", { style: "currency", currency: "EUR", minimumFractionDigits: 2 }); }

const inputStyle = {
    background: 'rgba(17,17,17,0.05)', border: '1px solid rgba(17,17,17,0.18)',
    borderRadius: '4px', color: T[100], fontSize: '13px',
    fontFamily: "'Oswald', sans-serif", fontWeight: 500,
    outline: 'none', padding: '4px 8px', textAlign: 'right',
    width: '100%', boxSizing: 'border-box',
};
const delBtnStyle = {
    background: 'transparent', border: 'none', color: C.grigio,
    cursor: 'pointer', fontSize: '20px', padding: '0', lineHeight: 1,
    transition: 'color 0.2s',
};

export default function CalcolatorePallina() {
    const [ingredienti, setIngredienti] = useState(DEFAULT_INGREDIENTI);
    const [indiretti, setIndiretti] = useState(DEFAULT_INDIRETTI);
    const [pesoPallina, setPesoPallina] = useState(280);
    const [pizzeMensili, setPizzeMensili] = useState(3000);
    const [nextIngId, setNextIngId] = useState(6);
    const [nextIndId, setNextIndId] = useState(7);
    const [activeTab, setActiveTab] = useState("ingredienti");

    const totali = useMemo(() => {
        const pesoTotale = ingredienti.reduce((s, i) => s + Number(i.quantita), 0);
        const costoImpasto = ingredienti.reduce((s, i) => s + (Number(i.quantita) / 1000) * Number(i.costoPerKg), 0);
        const numeroPalline = pesoTotale > 0 ? Math.floor(pesoTotale / pesoPallina) : 0;
        const costoIngPallina = numeroPalline > 0 ? costoImpasto / numeroPalline : 0;
        const costoIndirettoMensile = indiretti.reduce((s, i) => s + Number(i.costoMensile), 0);
        const costoIndirettoPerPizza = pizzeMensili > 0 ? costoIndirettoMensile / pizzeMensili : 0;
        const costoTotalePallina = costoIngPallina + costoIndirettoPerPizza;
        return { pesoTotale, costoImpasto, numeroPalline, costoIngPallina, costoIndirettoMensile, costoIndirettoPerPizza, costoTotalePallina };
    }, [ingredienti, indiretti, pesoPallina, pizzeMensili]);

    const percIng = totali.costoTotalePallina > 0 ? (totali.costoIngPallina / totali.costoTotalePallina) * 100 : 50;
    const percInd = 100 - percIng;

    const updIng = (id, k, v) => setIngredienti(p => p.map(i => i.id === id ? { ...i, [k]: v } : i));
    const delIng = (id) => setIngredienti(p => p.filter(i => i.id !== id));
    const addIng = () => { setIngredienti(p => [...p, { id: nextIngId, nome: "Nuovo ingrediente", quantita: 0, unita: "g", costoPerKg: 0, colore: C.giallo }]); setNextIngId(x => x + 1); };
    const updInd = (id, k, v) => setIndiretti(p => p.map(i => i.id === id ? { ...i, [k]: v } : i));
    const delInd = (id) => setIndiretti(p => p.filter(i => i.id !== id));
    const addInd = () => { setIndiretti(p => [...p, { id: nextIndId, nome: "Nuova voce", icona: "📋", costoMensile: 0, cat: "sala" }]); setNextIndId(x => x + 1); };

    return (
        <div style={{ minHeight: "100vh", background: BG.carta, fontFamily: "'Source Serif 4', Georgia, serif", color: T[100] }}>

            {/* ── Header brand ── */}
            <div style={{ background: BG.nero, padding: '0' }}>
                {/* Striscia top rossa */}
                <div style={{ background: C.rosso, padding: '5px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: '9px', fontWeight: 600, letterSpacing: '5px', textTransform: 'uppercase', color: 'rgba(249,246,239,0.7)' }}>Calcolatore Costo Pallina</span>
                    <span style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '10px', fontStyle: 'italic', color: 'rgba(249,246,239,0.6)' }}>Stroppiana (VC) · Vercelli</span>
                </div>
                {/* Corpo header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap', padding: '18px 32px' }}>
                    {/* Logo SVG brand */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', borderRight: '1px solid rgba(249,246,239,0.12)', paddingRight: '24px', marginRight: '8px' }}>
                        <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '9px', fontWeight: 600, letterSpacing: '5px', textTransform: 'uppercase', color: C.rosso, lineHeight: 1, marginBottom: '6px' }}>Trattoria · Pizzeria</div>
                        <img src={`${import.meta.env.BASE_URL}scritta.svg`} alt="Da Marcolino" style={{ height: '38px', width: 'auto', filter: 'brightness(0) invert(1)', display: 'block', marginBottom: '4px' }} />
                        <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '9px', fontWeight: 400, letterSpacing: '3px', textTransform: 'uppercase', color: 'rgba(249,246,239,0.4)', marginTop: '1px' }}>Calcolatore Impasto</div>
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '10px', fontWeight: 600, color: C.rosso, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '4px' }}>Ingredienti · Indiretti · Food Cost</div>
                        <div style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '12px', fontStyle: 'italic', color: 'rgba(249,246,239,0.5)', letterSpacing: '0.04em' }}>Ingredienti impasto · Costi indiretti · Costo reale per pallina</div>
                    </div>
                    {/* KPI costo pallina */}
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                        <div style={{ background: 'rgba(200,57,43,0.15)', border: `1px solid ${C.rosso}55`, borderRadius: '6px', padding: '10px 18px', textAlign: 'right' }}>
                            <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '9px', fontWeight: 600, color: C.rosso, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '3px' }}>Costo Totale Pallina</div>
                            <div style={{ fontFamily: "'Alfa Slab One', serif", fontSize: '24px', color: BG.bianco, lineHeight: 1 }}>{fmt4(totali.costoTotalePallina)}</div>
                        </div>
                    </div>
                </div>
            </div>


            <div style={{ padding: '24px 40px', maxWidth: '960px', margin: '0 auto' }}>

                {/* ── Controlli globali ── */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                    {[
                        { label: '⚖️ Peso target pallina', min: 200, max: 350, step: 10, val: pesoPallina, set: setPesoPallina, col: C.rosso, unit: 'g', sub: `${totali.numeroPalline} palline dall'impasto` },
                        { label: '📅 Pizze prodotte al mese', min: 500, max: 10000, step: 100, val: pizzeMensili, set: setPizzeMensili, col: C.verde, unit: '', sub: `≈ ${Math.round(pizzeMensili / 26)} pizze/giorno lavorativo` },
                    ].map(s => (
                        <div key={s.label} style={{ background: BG.bianco, border: `1px solid ${BG.border}`, borderLeft: `3px solid ${s.col}`, borderRadius: '6px', padding: '14px 18px' }}>
                            <label style={{ display: 'block', fontFamily: "'Oswald', sans-serif", fontSize: '9px', fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase', color: s.col, marginBottom: '10px' }}>{s.label}</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <input type="range" min={s.min} max={s.max} step={s.step} value={s.val} onChange={e => s.set(Number(e.target.value))} style={{ flex: 1, accentColor: s.col }} />
                                <div style={{ background: s.col, color: BG.bianco, borderRadius: '4px', padding: '4px 12px', fontFamily: "'Bebas Neue', 'Oswald', sans-serif", fontSize: '18px', minWidth: '72px', textAlign: 'center', letterSpacing: '1px' }}>{s.val.toLocaleString('it-IT')}{s.unit}</div>
                            </div>
                            <div style={{ fontFamily: "'Source Serif 4', serif", fontStyle: 'italic', fontSize: '11px', color: T[500], marginTop: '5px' }}>{s.sub}</div>
                        </div>
                    ))}
                </div>

                {/* ── Tabs ── */}
                <div style={{ display: 'flex', marginBottom: '18px', borderBottom: `3px solid ${BG.nero}` }}>
                    {[
                        { key: "ingredienti", label: "🌾 Ingredienti impasto" },
                        { key: "indiretti", label: "⚙️ Costi indiretti" },
                    ].map((tab, idx) => (
                        <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
                            padding: '9px 20px', border: 'none', cursor: 'pointer',
                            fontFamily: "'Oswald', sans-serif", fontSize: '11px', fontWeight: 600,
                            letterSpacing: '2px', textTransform: 'uppercase',
                            background: activeTab === tab.key ? BG.nero : 'transparent',
                            color: activeTab === tab.key ? BG.bianco : T[500],
                            borderRight: idx === 0 ? `1px solid ${BG.border}` : 'none',
                            transition: 'all 0.15s',
                        }}>{tab.label}</button>
                    ))}
                </div>

                {/* ── Tab Ingredienti ── */}
                {activeTab === "ingredienti" && (
                    <div style={{ marginBottom: '28px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <span style={{ fontFamily: "'Source Serif 4', serif", fontStyle: 'italic', fontSize: '12px', color: T[500] }}>
                                Impasto: <strong style={{ color: T[100] }}>{totali.pesoTotale}g</strong> → <strong style={{ color: C.rosso }}>{totali.numeroPalline} palline</strong> da {pesoPallina}g
                            </span>
                            <button onClick={addIng} style={{ background: 'transparent', border: `1px solid ${C.giallo}66`, color: C.giallo, borderRadius: '4px', padding: '5px 12px', cursor: 'pointer', fontSize: '12px', fontFamily: 'inherit' }}>+ Aggiungi</button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 130px 120px 36px', gap: '8px', padding: '4px 10px', fontFamily: "'Oswald', sans-serif", fontSize: '9px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: T[500] }}>
                            <span>Ingrediente</span><span style={{ textAlign: 'right' }}>Qtà (g)</span><span style={{ textAlign: 'right' }}>€ / kg</span><span style={{ textAlign: 'right' }}>Costo riga</span><span></span>
                        </div>

                        {ingredienti.map(ing => {
                            const costoRiga = (Number(ing.quantita) / 1000) * Number(ing.costoPerKg);
                            const perc = totali.pesoTotale > 0 ? (Number(ing.quantita) / totali.pesoTotale) * 100 : 0;
                            const farinaQ = Number(ingredienti.find(i => i.nome.toLowerCase().includes("farin"))?.quantita || 1);
                            return (
                                <div key={ing.id} style={{ background: BG.bianco, border: `1px solid ${BG.border}`, borderRadius: '6px', marginBottom: '5px', overflow: 'hidden' }}>
                                    <div style={{ height: '3px', background: `linear-gradient(90deg, ${ing.colore} ${perc}%, transparent ${perc}%)`, opacity: 0.8 }} />
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 130px 120px 36px', gap: '8px', padding: '10px 10px', alignItems: 'center' }}>
                                        <input value={ing.nome} onChange={e => updIng(ing.id, "nome", e.target.value)} style={{ background: 'transparent', border: 'none', color: T[100], fontSize: '13px', fontFamily: 'inherit', outline: 'none' }} />
                                        <input type="number" min="0" value={ing.quantita} onChange={e => updIng(ing.id, "quantita", e.target.value)} style={inputStyle} />
                                        <input type="number" min="0" step="0.01" value={ing.costoPerKg} onChange={e => updIng(ing.id, "costoPerKg", e.target.value)} style={inputStyle} />
                                        <div style={{ textAlign: 'right', fontSize: '13px', color: costoRiga > 0 ? C.giallo : T[500] }}>{fmt4(costoRiga)}</div>
                                        <button onClick={() => delIng(ing.id)} style={delBtnStyle} className="del-btn">×</button>
                                    </div>
                                    <div style={{ padding: '0 10px 7px', fontFamily: "'Source Serif 4', serif", fontStyle: 'italic', fontSize: '11px', color: T[500], display: 'flex', gap: '14px' }}>
                                        <span>{perc.toFixed(1)}% sul totale</span>
                                        {ing.nome.toLowerCase().includes("acqua") && (
                                            <span style={{ color: C.verde }}>💧 Idratazione: {((Number(ing.quantita) / farinaQ) * 100).toFixed(0)}%</span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* ── Tab Costi Indiretti ── */}
                {activeTab === "indiretti" && (
                    <div style={{ marginBottom: '28px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <span style={{ fontFamily: "'Source Serif 4', serif", fontStyle: 'italic', fontSize: '12px', color: T[500] }}>
                                Totale mensile: <strong style={{ color: T[100] }}>{fmt2(totali.costoIndirettoMensile)}</strong> · su <strong style={{ color: C.verde }}>{pizzeMensili.toLocaleString("it-IT")} pizze</strong>
                            </span>
                            <button onClick={addInd} style={{ background: 'transparent', border: `1px solid ${C.verde}55`, color: C.verde, borderRadius: '4px', padding: '5px 12px', cursor: 'pointer', fontSize: '12px', fontFamily: 'inherit' }}>+ Aggiungi voce</button>
                        </div>

                        {Object.entries(CATEGORIE).map(([catKey, cat]) => {
                            const voci = indiretti.filter(i => i.cat === catKey);
                            if (voci.length === 0) return null;
                            const totCat = voci.reduce((s, i) => s + Number(i.costoMensile), 0);
                            return (
                                <div key={catKey} style={{ marginBottom: '16px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 12px', marginBottom: '5px', background: `${cat.colore}15`, borderLeft: `3px solid ${cat.colore}`, borderRadius: '0 4px 4px 0' }}>
                                        <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: '10px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: cat.colore }}>{cat.label}</span>
                                        <span style={{ fontFamily: "'Source Serif 4', serif", fontStyle: 'italic', fontSize: '12px', color: T[500] }}>{fmt2(totCat)}/mese</span>
                                    </div>
                                    {voci.map(voce => {
                                        const perPizza = pizzeMensili > 0 ? Number(voce.costoMensile) / pizzeMensili : 0;
                                        return (
                                            <div key={voce.id} style={{ display: 'grid', gridTemplateColumns: '36px 1fr 160px 120px 36px', gap: '8px', padding: '10px 12px', alignItems: 'center', background: BG.bianco, border: `1px solid ${BG.border}`, borderRadius: '6px', marginBottom: '5px' }}>
                                                <input value={voce.icona} onChange={e => updInd(voce.id, "icona", e.target.value)} style={{ background: 'transparent', border: 'none', color: T[100], fontSize: '18px', fontFamily: 'inherit', outline: 'none', textAlign: 'center' }} />
                                                <input value={voce.nome} onChange={e => updInd(voce.id, "nome", e.target.value)} style={{ background: 'transparent', border: 'none', color: T[100], fontSize: '13px', fontFamily: 'inherit', outline: 'none' }} />
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: '10px', fontWeight: 500, color: T[500], whiteSpace: 'nowrap' }}>€/mese</span>
                                                    <input type="number" min="0" step="1" value={voce.costoMensile} onChange={e => updInd(voce.id, "costoMensile", e.target.value)} style={{ ...inputStyle, width: '90px' }} />
                                                </div>
                                                <div style={{ textAlign: 'right', fontFamily: "'Oswald', sans-serif", fontSize: '13px', fontWeight: 500, color: cat.colore }}>
                                                    {fmt4(perPizza)} <span style={{ fontSize: '10px', color: T[500] }}>/pizza</span>
                                                </div>
                                                <button onClick={() => delInd(voce.id)} style={delBtnStyle} className="del-btn">×</button>
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* ── Riepilogo ── */}
                <div style={{ background: BG.nero, borderRadius: '6px', padding: '24px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '10px', fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase', color: C.rosso, marginBottom: '16px' }}>Riepilogo Costo Reale per Pallina</div>

                    {/* Barra breakdown */}
                    <div style={{ marginBottom: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Oswald', sans-serif", fontSize: '9px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(249,246,239,0.5)', marginBottom: '5px' }}>
                            <span>🌾 Ingredienti: {fmt4(totali.costoIngPallina)} ({percIng.toFixed(0)}%)</span>
                            <span>⚙️ Indiretti: {fmt4(totali.costoIndirettoPerPizza)} ({percInd.toFixed(0)}%)</span>
                        </div>
                        <div style={{ height: '8px', borderRadius: '4px', overflow: 'hidden', background: 'rgba(249,246,239,0.08)', display: 'flex' }}>
                            <div style={{ width: `${percIng}%`, background: C.giallo, transition: 'width 0.4s' }} />
                            <div style={{ width: `${percInd}%`, background: C.verde, transition: 'width 0.4s' }} />
                        </div>
                    </div>

                    {/* Cards riassunto */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginBottom: '20px' }}>
                        {[
                            { label: "Costo ingredienti", value: fmt4(totali.costoIngPallina), col: C.giallo, bg: `${C.giallo}12` },
                            { label: "Costi indiretti", value: fmt4(totali.costoIndirettoPerPizza), col: C.verde, bg: `${C.verde}12` },
                            { label: "★ Costo totale pallina", value: fmt4(totali.costoTotalePallina), col: BG.bianco, bg: 'rgba(249,246,239,0.1)', grande: true },
                            { label: "Palline dall'impasto", value: totali.numeroPalline, col: C.rosso, bg: `${C.rosso}12` },
                        ].map((c, i) => (
                            <div key={i} style={{ background: c.bg, border: `1px solid rgba(249,246,239,0.1)`, borderLeft: `3px solid ${c.col}`, borderRadius: '4px', padding: '12px 14px' }}>
                                <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '9px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: c.col, marginBottom: '6px' }}>{c.label}</div>
                                <div style={{ fontFamily: c.grande ? "'Alfa Slab One', serif" : "'Oswald', sans-serif", fontSize: c.grande ? '22px' : '18px', fontWeight: c.grande ? 'normal' : 700, color: c.col, lineHeight: 1 }}>{c.value}</div>
                            </div>
                        ))}
                    </div>

                    {/* Incidenza su prezzi di vendita */}
                    <div style={{ background: 'rgba(249,246,239,0.04)', border: '1px solid rgba(249,246,239,0.08)', borderRadius: '4px', padding: '16px' }}>
                        <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '9px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(249,246,239,0.4)', marginBottom: '12px' }}>
                            Incidenza impasto al variare del prezzo pizza
                        </div>
                        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                            {[6, 7, 8, 9, 10, 12, 14].map(prezzo => {
                                const perc = totali.costoTotalePallina > 0 ? (totali.costoTotalePallina / prezzo) * 100 : 0;
                                const colore = perc < 6 ? C.verde : perc < 12 ? C.giallo : C.rosso;
                                return (
                                    <div key={prezzo} style={{ textAlign: 'center', minWidth: '44px' }}>
                                        <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '11px', fontWeight: 400, color: 'rgba(249,246,239,0.45)', marginBottom: '3px' }}>€{prezzo}</div>
                                        <div style={{ fontFamily: "'Bebas Neue', 'Oswald', sans-serif", fontSize: '20px', color: colore, letterSpacing: '1px' }}>{perc.toFixed(1)}%</div>
                                        <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '8px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', color: 'rgba(249,246,239,0.25)', marginTop: '2px' }}>impasto</div>
                                    </div>
                                );
                            })}
                        </div>
                        <div style={{ fontFamily: "'Source Serif 4', serif", fontStyle: 'italic', fontSize: '10px', color: 'rgba(249,246,239,0.25)', marginTop: '10px', borderTop: '1px solid rgba(249,246,239,0.06)', paddingTop: '8px' }}>
                            * Ingredienti + costi indiretti ripartiti — non include manodopera, affitto e margine su condimenti
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
