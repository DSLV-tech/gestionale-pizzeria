import { useState, useMemo } from "react";

const DEFAULT_INGREDIENTI = [
    { id: 1, nome: "Farina", quantita: 1000, unita: "g", costoPerKg: 0.65, colore: "#f5e6c8" },
    { id: 2, nome: "Acqua", quantita: 620, unita: "g", costoPerKg: 0.001, colore: "#c8e6f5" },
    { id: 3, nome: "Lievito di birra fresco", quantita: 3, unita: "g", costoPerKg: 3.5, colore: "#e6c8f5" },
    { id: 4, nome: "Sale", quantita: 25, unita: "g", costoPerKg: 0.4, colore: "#f5f5c8" },
    { id: 5, nome: "Olio EVO", quantita: 30, unita: "g", costoPerKg: 5.2, colore: "#d4f5c8" },
];

const DEFAULT_INDIRETTI = [
    { id: 1, nome: "Legna / Gas forno", icona: "🪵", costoMensile: 280, categoria: "energia" },
    { id: 2, nome: "Elettricità", icona: "⚡", costoMensile: 180, categoria: "energia" },
    { id: 3, nome: "Scarti di produzione", icona: "🗑️", costoMensile: 60, categoria: "produzione" },
    { id: 4, nome: "Tovaglieria & carta", icona: "🧻", costoMensile: 90, categoria: "sala" },
    { id: 5, nome: "Detersivi & pulizia", icona: "🧹", costoMensile: 45, categoria: "sala" },
    { id: 6, nome: "Packaging & asporto", icona: "📦", costoMensile: 70, categoria: "sala" },
];

const CATEGORIE = {
    energia: { label: "Energia", colore: "#e8a020" },
    produzione: { label: "Produzione", colore: "#c05050" },
    sala: { label: "Sala & Servizio", colore: "#5080c0" },
};

function fmt4(val) {
    return val.toLocaleString("it-IT", { style: "currency", currency: "EUR", minimumFractionDigits: 4 });
}
function fmt2(val) {
    return val.toLocaleString("it-IT", { style: "currency", currency: "EUR", minimumFractionDigits: 2 });
}

const inputStyle = {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(139,90,43,0.3)",
    borderRadius: "6px", color: "#f0e6d3", fontSize: "14px",
    fontFamily: "Georgia, serif", outline: "none", padding: "4px 8px",
    textAlign: "right", width: "100%", boxSizing: "border-box",
};
const delBtnStyle = {
    background: "transparent", border: "none", color: "#7a4030",
    cursor: "pointer", fontSize: "20px", padding: "0", lineHeight: 1,
    transition: "color 0.2s",
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
    const addIng = () => {
        const n = { id: nextIngId, nome: "Nuovo ingrediente", quantita: 0, unita: "g", costoPerKg: 0, colore: "#e0d0c0" };
        setIngredienti(p => [...p, n]);
        setNextIngId(x => x + 1);
    };
    const updInd = (id, k, v) => setIndiretti(p => p.map(i => i.id === id ? { ...i, [k]: v } : i));
    const delInd = (id) => setIndiretti(p => p.filter(i => i.id !== id));
    const addInd = () => {
        const n = { id: nextIndId, nome: "Nuova voce", icona: "📋", costoMensile: 0, categoria: "sala" };
        setIndiretti(p => [...p, n]);
        setNextIndId(x => x + 1);
    };

    return (
        <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #1a0e05 0%, #2d1a0a 50%, #1a0e05 100%)", fontFamily: "'Georgia', serif", color: "#f0e6d3" }}>

            {/* ── Header ── */}
            <div style={{ background: "linear-gradient(180deg, #3d1f0a 0%, #2d1208 100%)", borderBottom: "2px solid #8b5a2b", padding: "28px 40px 20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontSize: "34px" }}>🍕</span>
                    <div>
                        <h1 style={{ margin: 0, fontSize: "26px", fontWeight: "normal", color: "#f5d5a0", letterSpacing: "0.04em" }}>Calcolatore Costo Pallina</h1>
                        <p style={{ margin: 0, fontSize: "12px", color: "#a0845a", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                            Ingredienti · Costi Indiretti · Food Cost Reale
                        </p>
                    </div>
                </div>
            </div>

            <div style={{ padding: "28px 40px", maxWidth: "960px", margin: "0 auto" }}>

                {/* ── Controlli globali ── */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "28px" }}>
                    <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(139,90,43,0.4)", borderRadius: "12px", padding: "20px" }}>
                        <label style={{ display: "block", fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#a0845a", marginBottom: "10px" }}>⚖️ Peso target pallina</label>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <input type="range" min="200" max="350" step="10" value={pesoPallina} onChange={e => setPesoPallina(Number(e.target.value))} style={{ flex: 1, accentColor: "#c47d3a" }} />
                            <div style={{ background: "#c47d3a", color: "#fff", borderRadius: "8px", padding: "5px 12px", fontSize: "18px", fontWeight: "bold", minWidth: "72px", textAlign: "center" }}>{pesoPallina}g</div>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#7a6040", marginTop: "4px" }}>
                            <span>200g</span><span>250g</span><span>300g</span><span>350g</span>
                        </div>
                    </div>

                    <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(80,100,180,0.4)", borderRadius: "12px", padding: "20px" }}>
                        <label style={{ display: "block", fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#8090c0", marginBottom: "10px" }}>📅 Pizze prodotte al mese</label>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <input type="range" min="500" max="10000" step="100" value={pizzeMensili} onChange={e => setPizzeMensili(Number(e.target.value))} style={{ flex: 1, accentColor: "#5080c0" }} />
                            <div style={{ background: "#5080c0", color: "#fff", borderRadius: "8px", padding: "5px 12px", fontSize: "18px", fontWeight: "bold", minWidth: "72px", textAlign: "center" }}>{pizzeMensili.toLocaleString("it-IT")}</div>
                        </div>
                        <div style={{ fontSize: "11px", color: "#7a7090", marginTop: "6px" }}>
                            ≈ {Math.round(pizzeMensili / 26)} pizze/giorno lavorativo · I costi indiretti vengono suddivisi su questo volume
                        </div>
                    </div>
                </div>

                {/* ── Tabs ── */}
                <div style={{ display: "flex", marginBottom: "20px", borderRadius: "10px", overflow: "hidden", border: "1px solid rgba(139,90,43,0.4)" }}>
                    {[
                        { key: "ingredienti", label: "🌾 Ingredienti impasto" },
                        { key: "indiretti", label: "⚙️ Costi indiretti" },
                    ].map((tab, idx) => (
                        <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
                            flex: 1, padding: "12px", border: "none", cursor: "pointer", fontFamily: "Georgia, serif", fontSize: "13px",
                            background: activeTab === tab.key ? "rgba(196,125,58,0.22)" : "rgba(255,255,255,0.03)",
                            color: activeTab === tab.key ? "#f5c57a" : "#a0845a",
                            borderRight: idx === 0 ? "1px solid rgba(139,90,43,0.4)" : "none",
                            transition: "all 0.2s",
                        }}>{tab.label}</button>
                    ))}
                </div>

                {/* ── Tab Ingredienti ── */}
                {activeTab === "ingredienti" && (
                    <div style={{ marginBottom: "28px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                            <span style={{ fontSize: "12px", color: "#7a6040" }}>
                                Impasto: <strong style={{ color: "#f0e6d3" }}>{totali.pesoTotale}g</strong> → <strong style={{ color: "#c47d3a" }}>{totali.numeroPalline} palline</strong> da {pesoPallina}g
                            </span>
                            <button onClick={addIng} style={{ background: "transparent", border: "1px solid #8b5a2b", color: "#c47d3a", borderRadius: "6px", padding: "5px 12px", cursor: "pointer", fontSize: "12px", fontFamily: "inherit" }}>+ Aggiungi</button>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 100px 130px 120px 36px", gap: "8px", padding: "6px 12px", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#7a6040" }}>
                            <span>Ingrediente</span><span style={{ textAlign: "right" }}>Qtà (g)</span><span style={{ textAlign: "right" }}>€ / kg</span><span style={{ textAlign: "right" }}>Costo riga</span><span></span>
                        </div>

                        {ingredienti.map(ing => {
                            const costoRiga = (Number(ing.quantita) / 1000) * Number(ing.costoPerKg);
                            const perc = totali.pesoTotale > 0 ? (Number(ing.quantita) / totali.pesoTotale) * 100 : 0;
                            const farinaQ = Number(ingredienti.find(i => i.nome.toLowerCase().includes("farin"))?.quantita || 1);
                            return (
                                <div key={ing.id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(139,90,43,0.22)", borderRadius: "8px", marginBottom: "6px", overflow: "hidden" }}>
                                    <div style={{ height: "3px", background: `linear-gradient(90deg, ${ing.colore} ${perc}%, transparent ${perc}%)`, opacity: 0.7 }} />
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 100px 130px 120px 36px", gap: "8px", padding: "10px 12px", alignItems: "center" }}>
                                        <input value={ing.nome} onChange={e => updIng(ing.id, "nome", e.target.value)} style={{ background: "transparent", border: "none", color: "#f0e6d3", fontSize: "14px", fontFamily: "inherit", outline: "none" }} />
                                        <input type="number" min="0" value={ing.quantita} onChange={e => updIng(ing.id, "quantita", e.target.value)} style={inputStyle} />
                                        <input type="number" min="0" step="0.01" value={ing.costoPerKg} onChange={e => updIng(ing.id, "costoPerKg", e.target.value)} style={inputStyle} />
                                        <div style={{ textAlign: "right", fontSize: "14px", color: costoRiga > 0 ? "#f5c57a" : "#7a6040" }}>{fmt4(costoRiga)}</div>
                                        <button onClick={() => delIng(ing.id)} style={delBtnStyle} onMouseEnter={e => e.target.style.color = "#c04030"} onMouseLeave={e => e.target.style.color = "#7a4030"}>×</button>
                                    </div>
                                    <div style={{ padding: "0 12px 8px", fontSize: "11px", color: "#7a6040", display: "flex", gap: "16px" }}>
                                        <span>{perc.toFixed(1)}% sul totale</span>
                                        {ing.nome.toLowerCase().includes("acqua") && (
                                            <span style={{ color: "#6a9ab0" }}>💧 Idratazione: {((Number(ing.quantita) / farinaQ) * 100).toFixed(0)}%</span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* ── Tab Costi Indiretti ── */}
                {activeTab === "indiretti" && (
                    <div style={{ marginBottom: "28px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                            <span style={{ fontSize: "12px", color: "#7a6040" }}>
                                Totale mensile: <strong style={{ color: "#f0e6d3" }}>{fmt2(totali.costoIndirettoMensile)}</strong> · su <strong style={{ color: "#5080c0" }}>{pizzeMensili.toLocaleString("it-IT")} pizze</strong>
                            </span>
                            <button onClick={addInd} style={{ background: "transparent", border: "1px solid #506090", color: "#8090d0", borderRadius: "6px", padding: "5px 12px", cursor: "pointer", fontSize: "12px", fontFamily: "inherit" }}>+ Aggiungi voce</button>
                        </div>

                        {Object.entries(CATEGORIE).map(([catKey, cat]) => {
                            const voci = indiretti.filter(i => i.categoria === catKey);
                            if (voci.length === 0) return null;
                            const totCat = voci.reduce((s, i) => s + Number(i.costoMensile), 0);
                            return (
                                <div key={catKey} style={{ marginBottom: "20px" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 12px", marginBottom: "6px", background: `${cat.colore}18`, borderLeft: `3px solid ${cat.colore}`, borderRadius: "0 6px 6px 0" }}>
                                        <span style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: cat.colore }}>{cat.label}</span>
                                        <span style={{ fontSize: "12px", color: "#a0a0c0" }}>{fmt2(totCat)}/mese</span>
                                    </div>

                                    {voci.map(voce => {
                                        const perPizza = pizzeMensili > 0 ? Number(voce.costoMensile) / pizzeMensili : 0;
                                        return (
                                            <div key={voce.id} style={{ display: "grid", gridTemplateColumns: "36px 1fr 160px 120px 36px", gap: "8px", padding: "10px 12px", alignItems: "center", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(139,90,43,0.2)", borderRadius: "8px", marginBottom: "6px" }}>
                                                <input value={voce.icona} onChange={e => updInd(voce.id, "icona", e.target.value)} style={{ background: "transparent", border: "none", color: "#f0e6d3", fontSize: "18px", fontFamily: "inherit", outline: "none", textAlign: "center" }} />
                                                <input value={voce.nome} onChange={e => updInd(voce.id, "nome", e.target.value)} style={{ background: "transparent", border: "none", color: "#f0e6d3", fontSize: "14px", fontFamily: "inherit", outline: "none" }} />
                                                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                                    <span style={{ fontSize: "11px", color: "#7a6040", whiteSpace: "nowrap" }}>€/mese</span>
                                                    <input type="number" min="0" step="1" value={voce.costoMensile} onChange={e => updInd(voce.id, "costoMensile", e.target.value)} style={{ ...inputStyle, width: "90px" }} />
                                                </div>
                                                <div style={{ textAlign: "right", fontSize: "13px", color: "#8090d0" }}>
                                                    {fmt4(perPizza)} <span style={{ fontSize: "10px", color: "#6060a0" }}>/pizza</span>
                                                </div>
                                                <button onClick={() => delInd(voce.id)} style={delBtnStyle} onMouseEnter={e => e.target.style.color = "#c04030"} onMouseLeave={e => e.target.style.color = "#7a4030"}>×</button>
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })}

                        {/* Voce con categoria non standard */}
                        {(() => {
                            const extra = indiretti.filter(i => !Object.keys(CATEGORIE).includes(i.categoria));
                            if (extra.length === 0) return null;
                            return (
                                <div>
                                    <div style={{ padding: "6px 12px", marginBottom: "6px", borderLeft: "3px solid #808080", background: "#80808018", borderRadius: "0 6px 6px 0" }}>
                                        <span style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#a0a0a0" }}>Altro</span>
                                    </div>
                                    {extra.map(voce => {
                                        const perPizza = pizzeMensili > 0 ? Number(voce.costoMensile) / pizzeMensili : 0;
                                        return (
                                            <div key={voce.id} style={{ display: "grid", gridTemplateColumns: "36px 1fr 160px 120px 36px", gap: "8px", padding: "10px 12px", alignItems: "center", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(139,90,43,0.2)", borderRadius: "8px", marginBottom: "6px" }}>
                                                <input value={voce.icona} onChange={e => updInd(voce.id, "icona", e.target.value)} style={{ background: "transparent", border: "none", color: "#f0e6d3", fontSize: "18px", fontFamily: "inherit", outline: "none", textAlign: "center" }} />
                                                <input value={voce.nome} onChange={e => updInd(voce.id, "nome", e.target.value)} style={{ background: "transparent", border: "none", color: "#f0e6d3", fontSize: "14px", fontFamily: "inherit", outline: "none" }} />
                                                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                                    <span style={{ fontSize: "11px", color: "#7a6040", whiteSpace: "nowrap" }}>€/mese</span>
                                                    <input type="number" min="0" step="1" value={voce.costoMensile} onChange={e => updInd(voce.id, "costoMensile", e.target.value)} style={{ ...inputStyle, width: "90px" }} />
                                                </div>
                                                <div style={{ textAlign: "right", fontSize: "13px", color: "#8090d0" }}>{fmt4(perPizza)} <span style={{ fontSize: "10px", color: "#6060a0" }}>/pizza</span></div>
                                                <button onClick={() => delInd(voce.id)} style={delBtnStyle} onMouseEnter={e => e.target.style.color = "#c04030"} onMouseLeave={e => e.target.style.color = "#7a4030"}>×</button>
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })()}
                    </div>
                )}

                {/* ── Riepilogo ── */}
                <div style={{ background: "linear-gradient(135deg, rgba(90,45,10,0.7) 0%, rgba(50,25,5,0.9) 100%)", border: "1px solid #8b5a2b", borderRadius: "16px", padding: "28px", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: 0, right: 0, width: "220px", height: "220px", background: "radial-gradient(circle, rgba(196,125,58,0.08) 0%, transparent 70%)", borderRadius: "50%", transform: "translate(30%,-30%)" }} />

                    <h2 style={{ margin: "0 0 22px 0", fontSize: "12px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#a0845a" }}>Riepilogo Costo Reale per Pallina</h2>

                    {/* Barra breakdown */}
                    <div style={{ marginBottom: "24px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#a0845a", marginBottom: "6px" }}>
                            <span>🌾 Ingredienti: {fmt4(totali.costoIngPallina)} ({percIng.toFixed(0)}%)</span>
                            <span>⚙️ Indiretti: {fmt4(totali.costoIndirettoPerPizza)} ({percInd.toFixed(0)}%)</span>
                        </div>
                        <div style={{ height: "10px", borderRadius: "5px", overflow: "hidden", background: "rgba(0,0,0,0.3)" }}>
                            <div style={{ display: "flex", height: "100%" }}>
                                <div style={{ width: `${percIng}%`, background: "linear-gradient(90deg, #c47d3a, #e8a040)", transition: "width 0.4s" }} />
                                <div style={{ width: `${percInd}%`, background: "linear-gradient(90deg, #4060a0, #6080c0)", transition: "width 0.4s" }} />
                            </div>
                        </div>
                    </div>

                    {/* Cards riassunto */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "16px", marginBottom: "24px" }}>
                        {[
                            { label: "Costo ingredienti", value: fmt4(totali.costoIngPallina), colore: "#c47d3a", bg: "rgba(196,125,58,0.1)" },
                            { label: "Costi indiretti", value: fmt4(totali.costoIndirettoPerPizza), colore: "#6080c0", bg: "rgba(80,128,192,0.1)" },
                            { label: "★ Costo totale pallina", value: fmt4(totali.costoTotalePallina), colore: "#f5c57a", bg: "rgba(245,197,122,0.12)", grande: true },
                            { label: "Palline dall'impasto", value: totali.numeroPalline, colore: "#a0c080", bg: "rgba(100,160,80,0.1)" },
                        ].map((c, i) => (
                            <div key={i} style={{ background: c.bg, border: `1px solid ${c.colore}40`, borderRadius: "10px", padding: "14px" }}>
                                <div style={{ fontSize: "10px", letterSpacing: "0.08em", textTransform: "uppercase", color: c.colore, marginBottom: "8px" }}>{c.label}</div>
                                <div style={{ fontSize: c.grande ? "26px" : "20px", fontWeight: "bold", color: c.colore, lineHeight: 1 }}>{c.value}</div>
                            </div>
                        ))}
                    </div>

                    {/* Incidenza su prezzi di vendita */}
                    <div style={{ background: "rgba(0,0,0,0.25)", borderRadius: "10px", padding: "18px" }}>
                        <div style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#7a6040", marginBottom: "14px" }}>
                            Incidenza impasto (costo reale completo) al variare del prezzo pizza
                        </div>
                        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                            {[6, 7, 8, 9, 10, 12, 14].map(prezzo => {
                                const perc = totali.costoTotalePallina > 0 ? (totali.costoTotalePallina / prezzo) * 100 : 0;
                                const colore = perc < 6 ? "#6abf7a" : perc < 12 ? "#f5c57a" : "#e07a5f";
                                return (
                                    <div key={prezzo} style={{ textAlign: "center", minWidth: "44px" }}>
                                        <div style={{ fontSize: "12px", color: "#a0845a", marginBottom: "4px" }}>€{prezzo}</div>
                                        <div style={{ fontSize: "17px", fontWeight: "bold", color: colore }}>{perc.toFixed(1)}%</div>
                                        <div style={{ fontSize: "9px", color: "#7a6040", marginTop: "2px" }}>impasto</div>
                                    </div>
                                );
                            })}
                        </div>
                        <div style={{ fontSize: "11px", color: "#5a5040", marginTop: "12px", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "10px" }}>
                            * Ingredienti + costi indiretti ripartiti — non include manodopera, affitto e margine su condimenti
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
