import { useState, useMemo } from "react";

// ══════════════════════════════════════════════════════════════════
// MAGAZZINO INGREDIENTI — tutte le categorie
// ══════════════════════════════════════════════════════════════════
const CAT_MAG = {
    dispensa: { label: "🏺 Dispensa & Conserve", colore: "#c47d3a" },
    formaggi: { label: "🧀 Formaggi & Latticini", colore: "#e8c040" },
    affettati: { label: "🥩 Affettati & Salumi", colore: "#c05050" },
    verdure: { label: "🥬 Verdure & Ortaggi", colore: "#50a060" },
    pesce: { label: "🐟 Pesce & Molluschi", colore: "#5090c0" },
    fruttasecca: { label: "🌰 Frutta secca & Creme", colore: "#a060c0" },
    materiali: { label: "📦 Materiali & Packaging", colore: "#808080" },
};

const INIT_MAGAZZINO = [
    // ── DISPENSA ──────────────────────────────────────────────────
    { id: 1, nome: "Farina 00", cat: "dispensa", u: "kg", costo: 0.65, scorta: 25, min: 10 },
    { id: 2, nome: "Olio EVO", cat: "dispensa", u: "lt", costo: 5.20, scorta: 10, min: 3 },
    { id: 3, nome: "Pomodoro pelato", cat: "dispensa", u: "kg", costo: 0.90, scorta: 20, min: 8 },
    { id: 4, nome: "Origano", cat: "dispensa", u: "kg", costo: 15.00, scorta: 0.5, min: 0.2 },
    { id: 5, nome: "Rosmarino", cat: "dispensa", u: "kg", costo: 10.00, scorta: 0.3, min: 0.1 },
    { id: 6, nome: "Aglio", cat: "dispensa", u: "kg", costo: 3.00, scorta: 2, min: 0.5 },
    { id: 7, nome: "Sale", cat: "dispensa", u: "kg", costo: 0.40, scorta: 5, min: 2 },
    { id: 8, nome: "Capperi", cat: "dispensa", u: "kg", costo: 8.00, scorta: 1, min: 0.3 },
    { id: 9, nome: "Olive miste", cat: "dispensa", u: "kg", costo: 4.00, scorta: 3, min: 1 },
    { id: 10, nome: "Pomodorini semidry", cat: "dispensa", u: "kg", costo: 6.00, scorta: 3, min: 1 },
    { id: 11, nome: "Pomodori secchi", cat: "dispensa", u: "kg", costo: 8.00, scorta: 1, min: 0.3 },
    { id: 12, nome: "Olio al basilico", cat: "dispensa", u: "lt", costo: 12.00, scorta: 1, min: 0.3 },
    { id: 13, nome: "Olio al tartufo", cat: "dispensa", u: "lt", costo: 35.00, scorta: 0.5, min: 0.1 },
    { id: 14, nome: "Miele", cat: "dispensa", u: "kg", costo: 8.00, scorta: 1, min: 0.3 },
    { id: 15, nome: "Pepe nero", cat: "dispensa", u: "kg", costo: 15.00, scorta: 0.3, min: 0.1 },
    { id: 16, nome: "Crema di zucchine", cat: "dispensa", u: "kg", costo: 5.00, scorta: 2, min: 0.5 },
    { id: 17, nome: "Crema di pistacchio", cat: "dispensa", u: "kg", costo: 28.00, scorta: 1, min: 0.3 },
    { id: 18, nome: "Patatine surgelate", cat: "dispensa", u: "kg", costo: 2.50, scorta: 5, min: 2 },
    // ── FORMAGGI ──────────────────────────────────────────────────
    { id: 20, nome: "Fior di latte", cat: "formaggi", u: "kg", costo: 8.00, scorta: 15, min: 5 },
    { id: 21, nome: "Mozzarella di bufala", cat: "formaggi", u: "kg", costo: 18.00, scorta: 3, min: 1 },
    { id: 22, nome: "Gorgonzola", cat: "formaggi", u: "kg", costo: 12.00, scorta: 2, min: 0.5 },
    { id: 23, nome: "Fontina", cat: "formaggi", u: "kg", costo: 10.00, scorta: 2, min: 0.5 },
    { id: 24, nome: "Provola", cat: "formaggi", u: "kg", costo: 9.00, scorta: 3, min: 1 },
    { id: 25, nome: "Parmigiano / Grana", cat: "formaggi", u: "kg", costo: 22.00, scorta: 2, min: 0.5 },
    { id: 26, nome: "Stracciatella", cat: "formaggi", u: "kg", costo: 15.00, scorta: 2, min: 0.5 },
    { id: 27, nome: "Burrata", cat: "formaggi", u: "kg", costo: 20.00, scorta: 2, min: 0.5 },
    { id: 28, nome: "Brie", cat: "formaggi", u: "kg", costo: 14.00, scorta: 1, min: 0.3 },
    { id: 29, nome: "Toma", cat: "formaggi", u: "kg", costo: 12.00, scorta: 1, min: 0.3 },
    { id: 30, nome: "Ricotta", cat: "formaggi", u: "kg", costo: 5.00, scorta: 3, min: 1 },
    { id: 31, nome: "Pecorino (cialda)", cat: "formaggi", u: "kg", costo: 18.00, scorta: 0.5, min: 0.2 },
    // ── AFFETTATI ─────────────────────────────────────────────────
    { id: 40, nome: "Prosciutto cotto", cat: "affettati", u: "kg", costo: 12.00, scorta: 5, min: 2 },
    { id: 41, nome: "Prosciutto crudo", cat: "affettati", u: "kg", costo: 22.00, scorta: 3, min: 1 },
    { id: 42, nome: "Spianata calabrese", cat: "affettati", u: "kg", costo: 14.00, scorta: 2, min: 0.5 },
    { id: 43, nome: "Nduja", cat: "affettati", u: "kg", costo: 16.00, scorta: 1, min: 0.3 },
    { id: 44, nome: "Pancetta", cat: "affettati", u: "kg", costo: 10.00, scorta: 2, min: 0.5 },
    { id: 45, nome: "Speck", cat: "affettati", u: "kg", costo: 20.00, scorta: 2, min: 0.5 },
    { id: 46, nome: "Bresaola", cat: "affettati", u: "kg", costo: 25.00, scorta: 2, min: 0.5 },
    { id: 47, nome: "Mortadella", cat: "affettati", u: "kg", costo: 10.00, scorta: 2, min: 0.5 },
    { id: 48, nome: "Lardo", cat: "affettati", u: "kg", costo: 12.00, scorta: 1, min: 0.3 },
    { id: 49, nome: "Salsiccia fresca", cat: "affettati", u: "kg", costo: 8.00, scorta: 3, min: 1 },
    { id: 50, nome: "Würstel", cat: "affettati", u: "kg", costo: 5.00, scorta: 2, min: 0.5 },
    // ── VERDURE ───────────────────────────────────────────────────
    { id: 60, nome: "Basilico fresco", cat: "verdure", u: "kg", costo: 20.00, scorta: 0.5, min: 0.2 },
    { id: 61, nome: "Cipolla", cat: "verdure", u: "kg", costo: 1.50, scorta: 3, min: 1 },
    { id: 62, nome: "Melanzane", cat: "verdure", u: "kg", costo: 2.00, scorta: 5, min: 2 },
    { id: 63, nome: "Peperoni", cat: "verdure", u: "kg", costo: 3.00, scorta: 3, min: 1 },
    { id: 64, nome: "Zucchine", cat: "verdure", u: "kg", costo: 2.50, scorta: 3, min: 1 },
    { id: 65, nome: "Rucola", cat: "verdure", u: "kg", costo: 8.00, scorta: 1, min: 0.3 },
    { id: 66, nome: "Funghi trifolati", cat: "verdure", u: "kg", costo: 6.00, scorta: 3, min: 1 },
    { id: 67, nome: "Carciofini sott'olio", cat: "verdure", u: "kg", costo: 8.00, scorta: 2, min: 0.5 },
    { id: 68, nome: "Friarielli", cat: "verdure", u: "kg", costo: 6.00, scorta: 2, min: 0.5 },
    { id: 69, nome: "Radicchio", cat: "verdure", u: "kg", costo: 3.00, scorta: 1, min: 0.3 },
    { id: 70, nome: "Pomodorini datterini", cat: "verdure", u: "kg", costo: 3.50, scorta: 3, min: 1 },
    { id: 71, nome: "Pomodorini gialli", cat: "verdure", u: "kg", costo: 5.00, scorta: 1, min: 0.3 },
    // ── PESCE & MOLLUSCHI ─────────────────────────────────────────
    { id: 80, nome: "Acciughe sott'olio", cat: "pesce", u: "kg", costo: 15.00, scorta: 1, min: 0.3 },
    { id: 81, nome: "Tonno sott'olio", cat: "pesce", u: "kg", costo: 10.00, scorta: 2, min: 0.5 },
    { id: 82, nome: "Calamari (surgelati)", cat: "pesce", u: "kg", costo: 8.00, scorta: 3, min: 1 },
    // ── FRUTTA SECCA ──────────────────────────────────────────────
    { id: 90, nome: "Noci sgusciate", cat: "fruttasecca", u: "kg", costo: 12.00, scorta: 1, min: 0.3 },
    { id: 91, nome: "Granella di pistacchio", cat: "fruttasecca", u: "kg", costo: 30.00, scorta: 0.5, min: 0.2 },
    // ── MATERIALI & PACKAGING ─────────────────────────────────────
    { id: 100, nome: "Box pizza (vari)", cat: "materiali", u: "pz", costo: 0.35, scorta: 500, min: 100 },
    { id: 101, nome: "Tovaglioli", cat: "materiali", u: "pz", costo: 0.02, scorta: 1000, min: 300 },
    { id: 102, nome: "Carta forno", cat: "materiali", u: "rotolo", costo: 8.0, scorta: 10, min: 3 },
    { id: 103, nome: "Sacchetti asporto", cat: "materiali", u: "pz", costo: 0.15, scorta: 300, min: 80 },
    { id: 104, nome: "Bicchieri monouso", cat: "materiali", u: "pz", costo: 0.08, scorta: 200, min: 50 },
    { id: 105, nome: "Posate monouso (set)", cat: "materiali", u: "set", costo: 0.12, scorta: 200, min: 50 },
    { id: 106, nome: "Pellicola alimentare", cat: "materiali", u: "rotolo", costo: 5.0, scorta: 5, min: 2 },
    { id: 107, nome: "Guanti monouso (paio)", cat: "materiali", u: "paio", costo: 0.04, scorta: 500, min: 100 },
];

// ══════════════════════════════════════════════════════════════════
// INGREDIENTI IMPASTO
// ══════════════════════════════════════════════════════════════════
const DEFAULT_INGREDIENTI = [
    { id: 1, nome: "Farina 00", quantita: 1000, costoPerKg: 0.65, colore: "#f5e6c8" },
    { id: 2, nome: "Acqua", quantita: 620, costoPerKg: 0.001, colore: "#c8e6f5" },
    { id: 3, nome: "Lievito di birra fresco", quantita: 3, costoPerKg: 3.50, colore: "#e6c8f5" },
    { id: 4, nome: "Sale", quantita: 25, costoPerKg: 0.40, colore: "#f5f5c8" },
    { id: 5, nome: "Olio EVO", quantita: 30, costoPerKg: 5.20, colore: "#d4f5c8" },
];
const DEFAULT_INDIRETTI = [
    { id: 1, nome: "Legna / Gas forno", icona: "🪵", costoMensile: 280, cat: "energia" },
    { id: 2, nome: "Elettricità", icona: "⚡", costoMensile: 180, cat: "energia" },
    { id: 3, nome: "Scarti di produzione", icona: "🗑️", costoMensile: 60, cat: "produzione" },
    { id: 4, nome: "Tovaglieria & carta", icona: "🧻", costoMensile: 90, cat: "sala" },
    { id: 5, nome: "Detersivi & pulizia", icona: "🧹", costoMensile: 45, cat: "sala" },
    { id: 6, nome: "Packaging & asporto", icona: "📦", costoMensile: 70, cat: "sala" },
];
const DEFAULT_MANODOPERA = [
    { id: 1, ruolo: "Pizzaiolo", icona: "👨‍🍳", costoOrario: 14, oreGiornaliere: 8, giorniMese: 26 },
    { id: 2, ruolo: "Aiuto pizzaiolo", icona: "🧑‍🍳", costoOrario: 10, oreGiornaliere: 8, giorniMese: 26 },
];
const CAT_IND = {
    energia: { label: "Energia", colore: "#e8a020" },
    produzione: { label: "Produzione", colore: "#c05050" },
    sala: { label: "Sala & Servizio", colore: "#5080c0" },
};

// helper: condimento { nome, grammi, prezzoKg }
const co = (nome, g, pk) => ({ nome, grammi: g, prezzoKg: pk });

// ══════════════════════════════════════════════════════════════════
// MENU REALE — Da Marcolino
// ══════════════════════════════════════════════════════════════════
const CAT_PIZZA = {
    "Le Classiche": "#c47d3a",
    "I Calzoni": "#8060a0",
    "Le Speciali": "#c04040",
};

const MENU_PIZZE = [
    // ── LE CLASSICHE ─────────────────────────────────────────────
    {
        id: 1, nome: "Focaccia", cat: "Le Classiche", prezzoMenu: 4.0,
        cond: [co("Olio EVO", 15, 5.20), co("Sale", 3, 0.40), co("Rosmarino", 2, 10.00)]
    },
    {
        id: 2, nome: "Marinara", cat: "Le Classiche", prezzoMenu: 4.5,
        cond: [co("Pomodoro", 80, 0.90), co("Aglio", 5, 3.00), co("Basilico fresco", 3, 20.00), co("Origano", 2, 15.00), co("Olio EVO", 10, 5.20)]
    },
    {
        id: 3, nome: "Margherita", cat: "Le Classiche", prezzoMenu: 5.0,
        cond: [co("Fior di latte", 90, 8.00), co("Pomodoro", 80, 0.90), co("Basilico fresco", 3, 20.00), co("Olio EVO", 8, 5.20)]
    },
    {
        id: 4, nome: "Regina", cat: "Le Classiche", prezzoMenu: 8.0,
        cond: [co("Bufala", 100, 18.00), co("Pomodoro", 80, 0.90), co("Basilico fresco", 5, 20.00), co("Olio EVO", 10, 5.20)]
    },
    {
        id: 5, nome: "Prosciutto", cat: "Le Classiche", prezzoMenu: 7.0,
        cond: [co("Fior di latte", 90, 8.00), co("Pomodoro", 80, 0.90), co("Prosciutto cotto", 55, 12.00)]
    },
    {
        id: 6, nome: "Prosciutto e Funghi", cat: "Le Classiche", prezzoMenu: 7.0,
        cond: [co("Fior di latte", 90, 8.00), co("Pomodoro", 80, 0.90), co("Prosciutto cotto", 50, 12.00), co("Funghi trifolati", 45, 6.00)]
    },
    {
        id: 7, nome: "Capricciosa", cat: "Le Classiche", prezzoMenu: 8.0,
        cond: [co("Fior di latte", 85, 8.00), co("Pomodoro", 80, 0.90), co("Prosciutto cotto", 40, 12.00), co("Funghi trifolati", 35, 6.00), co("Carciofini", 30, 8.00), co("Acciughe", 20, 15.00), co("Olive", 20, 4.00)]
    },
    {
        id: 8, nome: "Diavola", cat: "Le Classiche", prezzoMenu: 7.0,
        cond: [co("Fior di latte", 90, 8.00), co("Pomodoro", 80, 0.90), co("Spianata calabrese", 50, 14.00)]
    },
    {
        id: 9, nome: "4 Stagioni", cat: "Le Classiche", prezzoMenu: 7.0,
        cond: [co("Fior di latte", 85, 8.00), co("Pomodoro", 80, 0.90), co("Prosciutto cotto", 35, 12.00), co("Funghi trifolati", 30, 6.00), co("Carciofini", 25, 8.00), co("Olive", 20, 4.00)]
    },
    {
        id: 10, nome: "Napoli", cat: "Le Classiche", prezzoMenu: 7.0,
        cond: [co("Fior di latte", 90, 8.00), co("Pomodoro", 80, 0.90), co("Acciughe", 25, 15.00), co("Origano", 2, 15.00)]
    },
    {
        id: 11, nome: "Romana", cat: "Le Classiche", prezzoMenu: 7.0,
        cond: [co("Fior di latte", 85, 8.00), co("Pomodoro", 80, 0.90), co("Acciughe", 20, 15.00), co("Capperi", 15, 8.00), co("Olive", 20, 4.00), co("Origano", 2, 15.00)]
    },
    {
        id: 12, nome: "Tonno e Cipolla", cat: "Le Classiche", prezzoMenu: 8.0,
        cond: [co("Fior di latte", 90, 8.00), co("Pomodoro", 80, 0.90), co("Tonno", 50, 10.00), co("Cipolla", 25, 1.50)]
    },
    {
        id: 13, nome: "4 Formaggi", cat: "Le Classiche", prezzoMenu: 8.0,
        cond: [co("Fior di latte", 70, 8.00), co("Pomodoro", 60, 0.90), co("Gorgonzola", 35, 12.00), co("Fontina", 35, 10.00), co("Provola", 35, 9.00), co("Parmigiano", 15, 22.00)]
    },
    {
        id: 14, nome: "Vegetariana", cat: "Le Classiche", prezzoMenu: 7.0,
        cond: [co("Fior di latte", 85, 8.00), co("Pomodoro", 80, 0.90), co("Melanzane", 50, 2.00), co("Peperoni", 40, 3.00), co("Zucchine", 40, 2.50)]
    },
    // ── I CALZONI ─────────────────────────────────────────────────
    {
        id: 15, nome: "Calzone Classico", cat: "I Calzoni", prezzoMenu: 7.0,
        cond: [co("Fior di latte", 80, 8.00), co("Ricotta", 60, 5.00), co("Pomodoro", 80, 0.90), co("Prosciutto cotto", 50, 12.00)]
    },
    {
        id: 16, nome: "Calzone Farcito", cat: "I Calzoni", prezzoMenu: 8.0,
        cond: [co("Fior di latte", 80, 8.00), co("Pomodoro", 80, 0.90), co("Prosciutto cotto", 45, 12.00), co("Funghi trifolati", 35, 6.00), co("Carciofini", 30, 8.00), co("Olive", 20, 4.00)]
    },
    {
        id: 17, nome: "Calzone Fritto", cat: "I Calzoni", prezzoMenu: 9.0,
        cond: [co("Fior di latte", 80, 8.00), co("Ricotta", 60, 5.00), co("Pomodoro", 80, 0.90), co("Prosciutto cotto", 50, 12.00)]
    },
    // ── LE SPECIALI ───────────────────────────────────────────────
    {
        id: 18, nome: "Patapizza", cat: "Le Speciali", prezzoMenu: 7.5,
        cond: [co("Fior di latte", 90, 8.00), co("Pomodoro", 80, 0.90), co("Patatine", 90, 2.50)]
    },
    {
        id: 19, nome: "Americana", cat: "Le Speciali", prezzoMenu: 8.0,
        cond: [co("Fior di latte", 85, 8.00), co("Pomodoro", 80, 0.90), co("Würstel", 60, 5.00), co("Patatine", 80, 2.50)]
    },
    {
        id: 20, nome: "Calamari Fritti", cat: "Le Speciali", prezzoMenu: 9.0,
        cond: [co("Fior di latte", 85, 8.00), co("Pomodoro", 80, 0.90), co("Calamari", 90, 8.00)]
    },
    {
        id: 21, nome: "Salsiccia e Friarielli", cat: "Le Speciali", prezzoMenu: 8.0,
        cond: [co("Fior di latte", 80, 8.00), co("Provola", 60, 9.00), co("Salsiccia fresca", 65, 8.00), co("Friarielli", 60, 6.00)]
    },
    {
        id: 22, nome: "Saporita", cat: "Le Speciali", prezzoMenu: 8.0,
        cond: [co("Fior di latte", 85, 8.00), co("Pomodoro", 80, 0.90), co("Salsiccia fresca", 55, 8.00), co("Cipolla", 25, 1.50), co("Gorgonzola", 35, 12.00)]
    },
    {
        id: 23, nome: "Marcolino", cat: "Le Speciali", prezzoMenu: 8.5,
        cond: [co("Fior di latte", 80, 8.00), co("Pomodoro", 70, 0.90), co("Provola", 50, 9.00), co("Pancetta", 40, 10.00), co("Peperoni", 35, 3.00), co("Cipolla", 20, 1.50), co("Olive", 20, 4.00)]
    },
    {
        id: 24, nome: "Estiva", cat: "Le Speciali", prezzoMenu: 8.0,
        cond: [co("Bufala", 100, 18.00), co("Rucola", 15, 8.00), co("Pomodorini semidry", 55, 6.00), co("Olio al basilico", 15, 12.00)]
    },
    {
        id: 25, nome: "Tonnara", cat: "Le Speciali", prezzoMenu: 8.0,
        cond: [co("Fior di latte", 85, 8.00), co("Pomodoro", 70, 0.90), co("Tonno", 50, 10.00), co("Capperi", 15, 8.00), co("Olive", 20, 4.00), co("Pomodorini semidry", 40, 6.00), co("Origano", 2, 15.00)]
    },
    {
        id: 26, nome: "Calabrese", cat: "Le Speciali", prezzoMenu: 8.5,
        cond: [co("Fior di latte", 80, 8.00), co("Pomodoro", 70, 0.90), co("Provola", 55, 9.00), co("Spianata calabrese", 40, 14.00), co("Nduja", 25, 16.00), co("Melanzane fritte", 60, 2.00)]
    },
    {
        id: 27, nome: "Longobarda", cat: "Le Speciali", prezzoMenu: 8.5,
        cond: [co("Fior di latte", 85, 8.00), co("Radicchio", 40, 3.00), co("Gorgonzola", 40, 12.00), co("Speck", 50, 20.00), co("Noci", 20, 12.00)]
    },
    {
        id: 28, nome: "Boscaiola", cat: "Le Speciali", prezzoMenu: 8.5,
        cond: [co("Fior di latte", 85, 8.00), co("Pomodoro", 70, 0.90), co("Funghi trifolati", 55, 6.00), co("Salsiccia fresca", 55, 8.00), co("Rucola", 15, 8.00), co("Parmigiano", 15, 22.00), co("Olio al tartufo", 10, 35.00)]
    },
    {
        id: 29, nome: "Delizia", cat: "Le Speciali", prezzoMenu: 9.0,
        cond: [co("Fior di latte", 85, 8.00), co("Pomodoro", 70, 0.90), co("Prosciutto crudo", 55, 22.00), co("Rucola", 15, 8.00), co("Pomodorini datterini", 40, 3.50), co("Parmigiano", 15, 22.00), co("Olio EVO", 8, 5.20)]
    },
    {
        id: 30, nome: "Bella", cat: "Le Speciali", prezzoMenu: 10.0,
        cond: [co("Fior di latte", 80, 8.00), co("Pomodoro", 70, 0.90), co("Bresaola", 55, 25.00), co("Stracciatella", 80, 15.00), co("Rucola", 15, 8.00), co("Parmigiano", 15, 22.00)]
    },
    {
        id: 31, nome: "Dolcevita", cat: "Le Speciali", prezzoMenu: 8.0,
        cond: [co("Fior di latte", 85, 8.00), co("Prosciutto cotto", 50, 12.00), co("Melanzane fritte", 60, 2.00), co("Pomodori secchi", 30, 8.00), co("Brie", 50, 14.00)]
    },
    {
        id: 32, nome: "Rosita", cat: "Le Speciali", prezzoMenu: 10.0,
        cond: [co("Fior di latte", 70, 8.00), co("Prosciutto crudo", 55, 22.00), co("Burrata", 120, 20.00), co("Pomodorini semidry", 40, 6.00), co("Pomodorini gialli", 30, 5.00), co("Basilico fresco", 4, 20.00)]
    },
    {
        id: 33, nome: "Frecciarossa", cat: "Le Speciali", prezzoMenu: 8.0,
        cond: [co("Fior di latte", 85, 8.00), co("Pomodoro", 80, 0.90), co("Pancetta", 45, 10.00), co("Cipolla", 25, 1.50), co("Zucchine", 40, 2.50), co("Parmigiano", 15, 22.00), co("Pepe nero", 1, 15.00)]
    },
    {
        id: 34, nome: "Parmigiana", cat: "Le Speciali", prezzoMenu: 7.5,
        cond: [co("Fior di latte", 85, 8.00), co("Pomodoro", 80, 0.90), co("Melanzane fritte", 70, 2.00), co("Parmigiano", 20, 22.00), co("Basilico fresco", 3, 20.00)]
    },
    {
        id: 35, nome: "Nerano", cat: "Le Speciali", prezzoMenu: 9.0,
        cond: [co("Fior di latte", 80, 8.00), co("Crema di zucchine", 60, 5.00), co("Provola", 60, 9.00), co("Zucchine fritte", 50, 2.50), co("Pancetta", 40, 10.00)]
    },
    {
        id: 36, nome: "Nordica", cat: "Le Speciali", prezzoMenu: 10.0,
        cond: [co("Fior di latte", 85, 8.00), co("Toma", 80, 12.00), co("Lardo", 30, 12.00), co("Miele", 20, 8.00), co("Noci", 20, 12.00)]
    },
    {
        id: 37, nome: "Mortazza", cat: "Le Speciali", prezzoMenu: 11.0,
        cond: [co("Fior di latte", 80, 8.00), co("Mortadella", 80, 10.00), co("Crema di pistacchio", 40, 28.00), co("Granella di pistacchio", 15, 30.00), co("Burrata", 120, 20.00)]
    },
    {
        id: 38, nome: "Montanara", cat: "Le Speciali", prezzoMenu: 10.0,
        cond: [co("Ricotta", 60, 5.00), co("Gorgonzola", 45, 12.00), co("Speck", 50, 20.00), co("Miele", 20, 8.00), co("Pecorino (cialda)", 20, 18.00)]
    },
    {
        id: 39, nome: "Tramonto italiano", cat: "Le Speciali", prezzoMenu: 10.0,
        cond: [co("Pomodorini semidry", 70, 6.00), co("Rucola", 15, 8.00), co("Stracciatella", 90, 15.00), co("Pomodorini gialli", 40, 5.00)]
    },
];

// ══════════════════════════════════════════════════════════════════
// UTILITIES
// ══════════════════════════════════════════════════════════════════
function fmt4(v) { return v.toLocaleString("it-IT", { style: "currency", currency: "EUR", minimumFractionDigits: 4 }); }
function fmt2(v) { return v.toLocaleString("it-IT", { style: "currency", currency: "EUR", minimumFractionDigits: 2 }); }
function suggested(costo, perc) { return Math.ceil((costo / (perc / 100)) / 0.5) * 0.5; }

const inSt = {
    background: "rgba(255,255,255,0.06)", border: "1px solid rgba(139,90,43,0.3)",
    borderRadius: "6px", color: "#f0e6d3", fontSize: "13px", fontFamily: "Georgia,serif",
    outline: "none", padding: "3px 7px", textAlign: "right", width: "100%", boxSizing: "border-box",
};
const dBtn = {
    background: "transparent", border: "none", color: "#7a4030",
    cursor: "pointer", fontSize: "19px", padding: "0", lineHeight: 1,
};

const TABS = [
    { key: "ingredienti", label: "🌾 Impasto" },
    { key: "indiretti", label: "⚙️ Indiretti" },
    { key: "manodopera", label: "👷 Manodopera" },
    { key: "magazzino", label: "🏪 Magazzino" },
    { key: "menu", label: "📋 Menu" },
];

// ══════════════════════════════════════════════════════════════════
// COMPONENTE
// ══════════════════════════════════════════════════════════════════
export default function GestionalePizzeria() {
    const [ingredienti, setIngredienti] = useState(DEFAULT_INGREDIENTI);
    const [indiretti, setIndiretti] = useState(DEFAULT_INDIRETTI);
    const [manodopera, setManodopera] = useState(DEFAULT_MANODOPERA);
    const [magazzino, setMagazzino] = useState(INIT_MAGAZZINO);
    const [pesoPallina, setPesoPallina] = useState(280);
    const [pizzeMensili, setPizzeMensili] = useState(3000);
    const [targetFC, setTargetFC] = useState(28);
    const [activeTab, setActiveTab] = useState("menu");
    const [menuFilter, setMenuFilter] = useState("Tutte");
    const [magFilter, setMagFilter] = useState("tutte");
    const [expandedPizza, setExpandedPizza] = useState(null);
    const [prezziPersonalizzati, setPrezziPersonalizzati] = useState({});
    const [nids, setNids] = useState({ ing: 6, ind: 7, man: 3, mag: 110 });

    // ── Costo base pallina ────────────────────────────────────────
    const base = useMemo(() => {
        const pesoTot = ingredienti.reduce((s, i) => s + Number(i.quantita), 0);
        const costoImp = ingredienti.reduce((s, i) => s + (Number(i.quantita) / 1000) * Number(i.costoPerKg), 0);
        const nPalline = pesoTot > 0 ? Math.floor(pesoTot / pesoPallina) : 0;
        const ingPall = nPalline > 0 ? costoImp / nPalline : 0;
        const indMens = indiretti.reduce((s, i) => s + Number(i.costoMensile), 0);
        const indPizza = pizzeMensili > 0 ? indMens / pizzeMensili : 0;
        const manMens = manodopera.reduce((s, m) => s + Number(m.costoOrario) * Number(m.oreGiornaliere) * Number(m.giorniMese), 0);
        const manPizza = pizzeMensili > 0 ? manMens / pizzeMensili : 0;
        return { pesoTot, nPalline, ingPall, indMens, indPizza, manMens, manPizza, tot: ingPall + indPizza + manPizza };
    }, [ingredienti, indiretti, manodopera, pesoPallina, pizzeMensili]);

    // ── Calcolo pizze ─────────────────────────────────────────────
    // I prezzi dei condimenti vengono letti dal magazzino (fonte unica di verità).
    const pizzeCalc = useMemo(() => {
        const mp = {};
        magazzino.forEach(m => { mp[m.nome.toLowerCase().trim()] = m.costo; });
        const lookup = (nome, fallback) => {
            const key = nome.toLowerCase().trim();
            if (mp[key] !== undefined) return { prezzo: mp[key], daMAG: true };
            for (const [magNome, costo] of Object.entries(mp)) {
                if (magNome.includes(key) || key.includes(magNome)) return { prezzo: costo, daMAG: true };
            }
            return { prezzo: fallback, daMAG: false };
        };
        return MENU_PIZZE.map(p => {
            const condCalc = p.cond.map(c => {
                const { prezzo, daMAG } = lookup(c.nome, c.prezzoKg);
                return { ...c, prezzoKgEff: prezzo, daMAG };
            });
            const costoCond = condCalc.reduce((s, c) => s + (c.grammi / 1000) * c.prezzoKgEff, 0);
            const costoTot = base.tot + costoCond;
            const priceSugg = suggested(costoTot, targetFC);
            const priceFin = prezziPersonalizzati[p.id] ?? p.prezzoMenu;
            const fc = priceFin > 0 ? (costoTot / priceFin) * 100 : 0;
            const margine = priceFin - costoTot;
            return { ...p, cond: condCalc, costoCond, costoTot, priceSugg, priceFin, fc, margine };
        });
    }, [base, targetFC, prezziPersonalizzati, magazzino]);

    // alert magazzino
    const alertCount = magazzino.filter(m => Number(m.scorta) <= Number(m.min)).length;

    // helpers
    const updIng = (id, k, v) => setIngredienti(p => p.map(i => i.id === id ? { ...i, [k]: v } : i));
    const updInd = (id, k, v) => setIndiretti(p => p.map(i => i.id === id ? { ...i, [k]: v } : i));
    const updMan = (id, k, v) => setManodopera(p => p.map(m => m.id === id ? { ...m, [k]: v } : m));
    const updMag = (id, k, v) => setMagazzino(p => p.map(m => m.id === id ? { ...m, [k]: v } : m));

    const percIng = base.tot > 0 ? (base.ingPall / base.tot) * 100 : 0;
    const percInd = base.tot > 0 ? (base.indPizza / base.tot) * 100 : 0;
    const percMan = base.tot > 0 ? (base.manPizza / base.tot) * 100 : 0;

    const fcColor = (fc) => fc < (targetFC - 5) ? "#6abf7a" : fc < (targetFC + 5) ? "#f5c57a" : "#e07a5f";
    const catsFiltro = ["Tutte", ...Object.keys(CAT_PIZZA)];
    const pizzeFilt = menuFilter === "Tutte" ? pizzeCalc : pizzeCalc.filter(p => p.cat === menuFilter);
    const catsMag = ["tutte", ...Object.keys(CAT_MAG)];
    const magFilt = magFilter === "tutte" ? magazzino : magazzino.filter(m => m.cat === magFilter);

    return (
        <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#0f0a07 0%,#1c1007 50%,#0f0a07 100%)", fontFamily: "'Georgia',serif", color: "#f0e6d3" }}>

            {/* HEADER — brand aggiornato al sito ufficiale */}
            <div style={{ background: "linear-gradient(180deg,#1a0a02 0%,#0f0602 100%)", borderBottom: "3px solid #C94C4C", padding: "0" }}>

                {/* Striscia superiore brand */}
                <div style={{ background: "#C94C4C", padding: "4px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.85)", fontFamily: "Georgia,serif" }}>📍 Vercelli · Piemonte</span>
                    <span style={{ fontSize: "10px", letterSpacing: "0.15em", color: "rgba(255,255,255,0.7)", fontStyle: "italic" }}>Dove il Piemonte incontra la tradizione italiana della pizza.</span>
                </div>

                {/* Corpo header */}
                <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap", padding: "18px 32px 16px" }}>
                    {/* Logo testuale brand */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", borderRight: "1px solid rgba(201,76,76,0.3)", paddingRight: "18px", marginRight: "4px" }}>
                        <div style={{ fontSize: "9px", letterSpacing: "0.35em", textTransform: "uppercase", color: "#C94C4C", fontWeight: "bold", lineHeight: 1 }}>Trattoria · Pizzeria</div>
                        <div style={{ fontSize: "26px", fontStyle: "italic", color: "#fff", lineHeight: 1.1, fontFamily: "Georgia,serif" }}>Da Marcolino</div>
                        <div style={{ fontSize: "8px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginTop: "2px" }}>Gestionale Interno</div>
                    </div>

                    {/* Sottotitolo moduli */}
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "10px", color: "rgba(201,76,76,0.8)", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "3px" }}>Pannello di Gestione</div>
                        <div style={{ fontSize: "11px", color: "rgba(240,230,211,0.5)", letterSpacing: "0.08em" }}>Impasto · Costi Indiretti · Manodopera · Magazzino · Menu & Food Cost</div>
                    </div>

                    {/* KPI costo pallina + alert */}
                    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
                        <div style={{ textAlign: "right", background: "rgba(201,76,76,0.08)", border: "1px solid rgba(201,76,76,0.25)", borderRadius: "10px", padding: "8px 14px" }}>
                            <div style={{ fontSize: "9px", color: "#C94C4C", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "2px" }}>Costo pallina</div>
                            <div style={{ fontSize: "22px", fontWeight: "bold", color: "#fff", lineHeight: 1 }}>{fmt4(base.tot)}</div>
                        </div>
                        {alertCount > 0 && (
                            <div style={{ background: "rgba(201,76,76,0.18)", border: "1px solid #C94C4C", borderRadius: "10px", padding: "8px 14px", textAlign: "center", cursor: "pointer" }}
                                onClick={() => setActiveTab("magazzino")}>
                                <div style={{ fontSize: "18px" }}>⚠️</div>
                                <div style={{ fontSize: "11px", color: "#C94C4C", fontWeight: "bold" }}>{alertCount} scorte basse</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div style={{ padding: "20px 32px", maxWidth: "1100px", margin: "0 auto" }}>

                {/* SLIDER */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "20px" }}>
                    {[
                        { label: "⚖️ Peso pallina", min: 200, max: 350, step: 10, val: pesoPallina, set: setPesoPallina, col: "#C94C4C", unit: "g", sub: `${base.nPalline} palline dall'impasto` },
                        { label: "📅 Pizze/mese", min: 500, max: 10000, step: 100, val: pizzeMensili, set: setPizzeMensili, col: "#5080c0", unit: "", sub: `≈${Math.round(pizzeMensili / 26)} pizze/giorno` },
                    ].map(s => (
                        <div key={s.label} style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${s.col}44`, borderRadius: "10px", padding: "14px" }}>
                            <label style={{ display: "block", fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: s.col, marginBottom: "8px" }}>{s.label}</label>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <input type="range" min={s.min} max={s.max} step={s.step} value={s.val} onChange={e => s.set(Number(e.target.value))} style={{ flex: 1, accentColor: s.col }} />
                                <div style={{ background: s.col, color: "#fff", borderRadius: "7px", padding: "4px 10px", fontSize: "15px", fontWeight: "bold", minWidth: "68px", textAlign: "center" }}>{s.val.toLocaleString("it-IT")}{s.unit}</div>
                            </div>
                            <div style={{ fontSize: "11px", color: "#7a6040", marginTop: "3px" }}>{s.sub}</div>
                        </div>
                    ))}
                </div>

                {/* TABS */}
                <div style={{ display: "flex", marginBottom: "18px", borderRadius: "10px", overflow: "hidden", border: "1px solid rgba(201,76,76,0.35)" }}>
                    {TABS.map((t, i) => (
                        <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
                            flex: 1, padding: "10px 4px", border: "none", cursor: "pointer", fontFamily: "Georgia,serif", fontSize: "11px",
                            background: activeTab === t.key ? "rgba(201,76,76,0.18)" : "rgba(255,255,255,0.03)",
                            color: activeTab === t.key ? "#fff" : "#a0845a",
                            borderRight: i < TABS.length - 1 ? "1px solid rgba(201,76,76,0.25)" : "none",
                            borderBottom: activeTab === t.key ? "2px solid #C94C4C" : "2px solid transparent",
                        }}>
                            {t.label}
                            {t.key === "magazzino" && alertCount > 0 && <span style={{ marginLeft: "4px", background: "#C94C4C", color: "#fff", borderRadius: "10px", padding: "0 5px", fontSize: "10px" }}>{alertCount}</span>}
                        </button>
                    ))}
                </div>

                {/* ══ TAB IMPASTO ══ */}
                {activeTab === "ingredienti" && (
                    <div style={{ marginBottom: "20px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                            <span style={{ fontSize: "12px", color: "#7a6040" }}>Impasto: <b style={{ color: "#f0e6d3" }}>{base.pesoTot}g</b> → <b style={{ color: "#c47d3a" }}>{base.nPalline} palline</b></span>
                            <button onClick={() => { setIngredienti(p => [...p, { id: nids.ing, nome: "Nuovo", quantita: 0, costoPerKg: 0, colore: "#e0d0c0" }]); setNids(n => ({ ...n, ing: n.ing + 1 })); }} style={{ background: "transparent", border: "1px solid #8b5a2b", color: "#c47d3a", borderRadius: "6px", padding: "4px 10px", cursor: "pointer", fontSize: "12px", fontFamily: "inherit" }}>+ Aggiungi</button>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 90px 120px 110px 30px", gap: "6px", padding: "4px 10px", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#7a6040" }}>
                            <span>Ingrediente</span><span style={{ textAlign: "right" }}>Qtà g</span><span style={{ textAlign: "right" }}>€/kg</span><span style={{ textAlign: "right" }}>Costo</span><span></span>
                        </div>
                        {ingredienti.map(ing => {
                            const cr = (Number(ing.quantita) / 1000) * Number(ing.costoPerKg);
                            const pct = base.pesoTot > 0 ? (Number(ing.quantita) / base.pesoTot) * 100 : 0;
                            const fQ = Number(ingredienti.find(i => i.nome.toLowerCase().includes("farin"))?.quantita || 1);
                            return (
                                <div key={ing.id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(139,90,43,0.2)", borderRadius: "8px", marginBottom: "5px", overflow: "hidden" }}>
                                    <div style={{ height: "3px", background: `linear-gradient(90deg,${ing.colore} ${pct}%,transparent ${pct}%)`, opacity: 0.7 }} />
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 90px 120px 110px 30px", gap: "6px", padding: "8px 10px", alignItems: "center" }}>
                                        <input value={ing.nome} onChange={e => updIng(ing.id, "nome", e.target.value)} style={{ background: "transparent", border: "none", color: "#f0e6d3", fontSize: "13px", fontFamily: "inherit", outline: "none" }} />
                                        <input type="number" min="0" value={ing.quantita} onChange={e => updIng(ing.id, "quantita", e.target.value)} style={inSt} />
                                        <input type="number" min="0" step="0.01" value={ing.costoPerKg} onChange={e => updIng(ing.id, "costoPerKg", e.target.value)} style={inSt} />
                                        <div style={{ textAlign: "right", fontSize: "13px", color: cr > 0 ? "#f5c57a" : "#7a6040" }}>{fmt4(cr)}</div>
                                        <button onClick={() => setIngredienti(p => p.filter(i => i.id !== ing.id))} style={dBtn} onMouseEnter={e => e.target.style.color = "#c04030"} onMouseLeave={e => e.target.style.color = "#7a4030"}>×</button>
                                    </div>
                                    <div style={{ padding: "0 10px 6px", fontSize: "10px", color: "#7a6040", display: "flex", gap: "12px" }}>
                                        <span>{pct.toFixed(1)}%</span>
                                        {ing.nome.toLowerCase().includes("acqua") && <span style={{ color: "#6a9ab0" }}>💧 Idrat. {((Number(ing.quantita) / fQ) * 100).toFixed(0)}%</span>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* ══ TAB INDIRETTI ══ */}
                {activeTab === "indiretti" && (
                    <div style={{ marginBottom: "20px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                            <span style={{ fontSize: "12px", color: "#7a6040" }}>Mensile: <b style={{ color: "#f0e6d3" }}>{fmt2(base.indMens)}</b> → <b style={{ color: "#6080c0" }}>{fmt4(base.indPizza)}</b>/pizza</span>
                            <button onClick={() => { setIndiretti(p => [...p, { id: nids.ind, nome: "Nuova voce", icona: "📋", costoMensile: 0, cat: "sala" }]); setNids(n => ({ ...n, ind: n.ind + 1 })); }} style={{ background: "transparent", border: "1px solid #506090", color: "#8090d0", borderRadius: "6px", padding: "4px 10px", cursor: "pointer", fontSize: "12px", fontFamily: "inherit" }}>+ Aggiungi</button>
                        </div>
                        {Object.entries(CAT_IND).map(([ck, cv]) => {
                            const voci = indiretti.filter(i => i.cat === ck);
                            if (!voci.length) return null;
                            const tot = voci.reduce((s, i) => s + Number(i.costoMensile), 0);
                            return (
                                <div key={ck} style={{ marginBottom: "16px" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 10px", marginBottom: "5px", background: `${cv.colore}18`, borderLeft: `3px solid ${cv.colore}`, borderRadius: "0 6px 6px 0" }}>
                                        <span style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: cv.colore }}>{cv.label}</span>
                                        <span style={{ fontSize: "12px", color: "#a0a0c0" }}>{fmt2(tot)}/mese</span>
                                    </div>
                                    {voci.map(v => (
                                        <div key={v.id} style={{ display: "grid", gridTemplateColumns: "30px 1fr 150px 110px 30px", gap: "6px", padding: "8px 10px", alignItems: "center", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(139,90,43,0.18)", borderRadius: "7px", marginBottom: "4px" }}>
                                            <input value={v.icona} onChange={e => updInd(v.id, "icona", e.target.value)} style={{ background: "transparent", border: "none", color: "#f0e6d3", fontSize: "16px", fontFamily: "inherit", outline: "none", textAlign: "center" }} />
                                            <input value={v.nome} onChange={e => updInd(v.id, "nome", e.target.value)} style={{ background: "transparent", border: "none", color: "#f0e6d3", fontSize: "13px", fontFamily: "inherit", outline: "none" }} />
                                            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                                <span style={{ fontSize: "10px", color: "#7a6040", whiteSpace: "nowrap" }}>€/mese</span>
                                                <input type="number" min="0" value={v.costoMensile} onChange={e => updInd(v.id, "costoMensile", e.target.value)} style={{ ...inSt, width: "80px" }} />
                                            </div>
                                            <div style={{ textAlign: "right", fontSize: "12px", color: "#8090d0" }}>{fmt4(pizzeMensili > 0 ? Number(v.costoMensile) / pizzeMensili : 0)}<span style={{ fontSize: "9px", color: "#6060a0" }}>/pz</span></div>
                                            <button onClick={() => setIndiretti(p => p.filter(i => i.id !== v.id))} style={dBtn} onMouseEnter={e => e.target.style.color = "#c04030"} onMouseLeave={e => e.target.style.color = "#7a4030"}>×</button>
                                        </div>
                                    ))}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* ══ TAB MANODOPERA ══ */}
                {activeTab === "manodopera" && (
                    <div style={{ marginBottom: "20px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                            <span style={{ fontSize: "12px", color: "#7a6040" }}>Mensile: <b style={{ color: "#f0e6d3" }}>{fmt2(base.manMens)}</b> → <b style={{ color: "#a060d0" }}>{fmt4(base.manPizza)}</b>/pizza</span>
                            <button onClick={() => { setManodopera(p => [...p, { id: nids.man, ruolo: "Nuovo ruolo", icona: "🧑‍🍳", costoOrario: 10, oreGiornaliere: 8, giorniMese: 26 }]); setNids(n => ({ ...n, man: n.man + 1 })); }} style={{ background: "transparent", border: "1px solid #7050a0", color: "#a060c0", borderRadius: "6px", padding: "4px 10px", cursor: "pointer", fontSize: "12px", fontFamily: "inherit" }}>+ Aggiungi</button>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "30px 1fr 90px 100px 90px 110px 30px", gap: "6px", padding: "4px 10px", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#7a6040" }}>
                            <span></span><span>Ruolo</span><span style={{ textAlign: "right" }}>€/ora</span><span style={{ textAlign: "right" }}>Ore/gg</span><span style={{ textAlign: "right" }}>Gg/mese</span><span style={{ textAlign: "right" }}>Mensile</span><span></span>
                        </div>
                        {manodopera.map(m => {
                            const cm = Number(m.costoOrario) * Number(m.oreGiornaliere) * Number(m.giorniMese);
                            return (
                                <div key={m.id} style={{ background: "rgba(140,80,200,0.06)", border: "1px solid rgba(140,80,200,0.22)", borderRadius: "9px", marginBottom: "7px", overflow: "hidden" }}>
                                    <div style={{ height: "3px", background: "linear-gradient(90deg,#9060c0,#c090e0)", opacity: 0.5 }} />
                                    <div style={{ display: "grid", gridTemplateColumns: "30px 1fr 90px 100px 90px 110px 30px", gap: "6px", padding: "10px 10px", alignItems: "center" }}>
                                        <input value={m.icona} onChange={e => updMan(m.id, "icona", e.target.value)} style={{ background: "transparent", border: "none", color: "#f0e6d3", fontSize: "16px", fontFamily: "inherit", outline: "none", textAlign: "center" }} />
                                        <input value={m.ruolo} onChange={e => updMan(m.id, "ruolo", e.target.value)} style={{ background: "transparent", border: "none", color: "#f0e6d3", fontSize: "13px", fontFamily: "inherit", outline: "none" }} />
                                        <input type="number" min="0" step="0.5" value={m.costoOrario} onChange={e => updMan(m.id, "costoOrario", e.target.value)} style={{ ...inSt, borderColor: "rgba(140,80,200,0.3)" }} />
                                        <input type="number" min="0" max="24" step="0.5" value={m.oreGiornaliere} onChange={e => updMan(m.id, "oreGiornaliere", e.target.value)} style={{ ...inSt, borderColor: "rgba(140,80,200,0.3)" }} />
                                        <input type="number" min="0" max="31" value={m.giorniMese} onChange={e => updMan(m.id, "giorniMese", e.target.value)} style={{ ...inSt, borderColor: "rgba(140,80,200,0.3)" }} />
                                        <div style={{ textAlign: "right" }}>
                                            <div style={{ fontSize: "14px", fontWeight: "bold", color: "#c090e0" }}>{fmt2(cm)}</div>
                                            <div style={{ fontSize: "10px", color: "#8060a0" }}>{fmt4(pizzeMensili > 0 ? cm / pizzeMensili : 0)}/pz</div>
                                        </div>
                                        <button onClick={() => setManodopera(p => p.filter(x => x.id !== m.id))} style={dBtn} onMouseEnter={e => e.target.style.color = "#c04030"} onMouseLeave={e => e.target.style.color = "#7a4030"}>×</button>
                                    </div>
                                </div>
                            );
                        })}
                        <div style={{ background: "rgba(140,80,200,0.06)", border: "1px dashed rgba(140,80,200,0.28)", borderRadius: "9px", padding: "10px 14px", fontSize: "11px", color: "#8060a0", lineHeight: 1.6 }}>
                            💡 Inserire il <b style={{ color: "#c090e0" }}>costo orario lordo aziendale</b> (netto + contributi + ratei). Solitamente +40–50% dello stipendio netto.
                        </div>
                    </div>
                )}

                {/* ══ TAB MAGAZZINO ══ */}
                {activeTab === "magazzino" && (
                    <div style={{ marginBottom: "20px" }}>
                        {/* Filtri categorie */}
                        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px", alignItems: "center" }}>
                            <span style={{ fontSize: "11px", color: "#7a6040", marginRight: "4px" }}>Categoria:</span>
                            {catsMag.map(ck => {
                                const info = ck === "tutte" ? { label: "Tutte", colore: "#c47d3a" } : CAT_MAG[ck];
                                const isAct = magFilter === ck;
                                return (
                                    <button key={ck} onClick={() => setMagFilter(ck)} style={{
                                        background: isAct ? `${info.colore}33` : "transparent",
                                        border: `1px solid ${info.colore}88`,
                                        color: isAct ? info.colore : `${info.colore}88`,
                                        borderRadius: "16px", padding: "3px 10px", cursor: "pointer", fontSize: "11px", fontFamily: "inherit",
                                    }}>{info.label}</button>
                                );
                            })}
                            <span style={{ marginLeft: "auto", fontSize: "11px", color: "#e07060" }}>
                                {alertCount > 0 ? `⚠️ ${alertCount} prodotti sotto scorta minima` : "✅ Tutte le scorte ok"}
                            </span>
                        </div>

                        {/* Header colonne */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 55px 80px 80px 80px 90px", gap: "6px", padding: "4px 10px", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#7a6040", marginBottom: "4px" }}>
                            <span>Ingrediente / Prodotto</span>
                            <span style={{ textAlign: "center" }}>U.M.</span>
                            <span style={{ textAlign: "right" }}>€/unità</span>
                            <span style={{ textAlign: "right" }}>Scorta</span>
                            <span style={{ textAlign: "right" }}>Min.</span>
                            <span style={{ textAlign: "right" }}>Stato</span>
                        </div>

                        {(magFilter === "tutte" ? Object.keys(CAT_MAG) : [magFilter]).map(ck => {
                            const info = CAT_MAG[ck];
                            const voci = magFilt.filter(m => m.cat === ck);
                            if (!voci.length) return null;
                            return (
                                <div key={ck} style={{ marginBottom: "18px" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 10px", marginBottom: "6px", background: `${info.colore}18`, borderLeft: `3px solid ${info.colore}`, borderRadius: "0 7px 7px 0" }}>
                                        <span style={{ fontSize: "12px", letterSpacing: "0.08em", textTransform: "uppercase", color: info.colore }}>{info.label}</span>
                                        <span style={{ fontSize: "11px", color: "#7a6040" }}>{voci.length} prodotti · {voci.filter(m => Number(m.scorta) <= Number(m.min)).length} alert</span>
                                    </div>
                                    {voci.map(m => {
                                        const isLow = Number(m.scorta) <= Number(m.min);
                                        const isZero = Number(m.scorta) === 0;
                                        const stato = isZero ? { label: "ESAURITO", col: "#e05050" } : isLow ? { label: "BASSO", col: "#e8a030" } : { label: "OK", col: "#60b070" };
                                        return (
                                            <div key={m.id} style={{
                                                display: "grid", gridTemplateColumns: "1fr 55px 80px 80px 80px 90px",
                                                gap: "6px", padding: "8px 10px", alignItems: "center",
                                                background: isLow ? "rgba(200,80,40,0.06)" : "rgba(255,255,255,0.025)",
                                                border: `1px solid ${isLow ? "rgba(200,80,40,0.3)" : "rgba(139,90,43,0.18)"}`,
                                                borderRadius: "7px", marginBottom: "4px",
                                            }}>
                                                <input value={m.nome} onChange={e => updMag(m.id, "nome", e.target.value)} style={{ background: "transparent", border: "none", color: "#f0e6d3", fontSize: "13px", fontFamily: "inherit", outline: "none" }} />
                                                <div style={{ textAlign: "center", fontSize: "11px", color: "#7a6040" }}>{m.u}</div>
                                                <input type="number" min="0" step="0.01" value={m.costo} onChange={e => updMag(m.id, "costo", e.target.value)} style={{ ...inSt, fontSize: "12px" }} />
                                                <input type="number" min="0" step="0.1" value={m.scorta} onChange={e => updMag(m.id, "scorta", e.target.value)} style={{ ...inSt, fontSize: "13px", fontWeight: "bold", color: isLow ? "#e8a030" : "#f0e6d3" }} />
                                                <input type="number" min="0" step="0.1" value={m.min} onChange={e => updMag(m.id, "min", e.target.value)} style={{ ...inSt, fontSize: "12px", color: "#a0845a" }} />
                                                <div style={{ textAlign: "right" }}>
                                                    <span style={{ background: `${stato.col}22`, border: `1px solid ${stato.col}66`, color: stato.col, borderRadius: "12px", padding: "2px 8px", fontSize: "10px", fontWeight: "bold", letterSpacing: "0.05em" }}>{stato.label}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* ══ TAB MENU ══ */}
                {activeTab === "menu" && (
                    <div>
                        {/* Controlli */}
                        <div style={{ display: "flex", gap: "14px", alignItems: "center", marginBottom: "16px", flexWrap: "wrap" }}>
                            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(80,180,100,0.4)", borderRadius: "9px", padding: "10px 14px", display: "flex", alignItems: "center", gap: "10px" }}>
                                <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", color: "#60b070" }}>🎯 Target FC</span>
                                <input type="range" min="20" max="40" step="1" value={targetFC} onChange={e => setTargetFC(Number(e.target.value))} style={{ width: "80px", accentColor: "#50a060" }} />
                                <div style={{ background: "#50a060", color: "#fff", borderRadius: "6px", padding: "3px 10px", fontSize: "15px", fontWeight: "bold", minWidth: "46px", textAlign: "center" }}>{targetFC}%</div>
                            </div>
                            <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                                {catsFiltro.map(cat => (
                                    <button key={cat} onClick={() => setMenuFilter(cat)} style={{
                                        background: menuFilter === cat ? (cat === "Tutte" ? "#8b5a2b" : (CAT_PIZZA[cat] || "#8b5a2b")) : "transparent",
                                        border: `1px solid ${cat === "Tutte" ? "#8b5a2b" : (CAT_PIZZA[cat] || "#8b5a2b")}`,
                                        color: menuFilter === cat ? "#fff" : (cat === "Tutte" ? "#c47d3a" : (CAT_PIZZA[cat] || "#c47d3a")),
                                        borderRadius: "16px", padding: "3px 11px", cursor: "pointer", fontSize: "11px", fontFamily: "inherit",
                                    }}>{cat}</button>
                                ))}
                            </div>
                            <div style={{ marginLeft: "auto", fontSize: "11px", color: "#7a6040", display: "flex", gap: "12px" }}>
                                <span>🟢 &lt;{targetFC - 5}%</span><span>🟡 {targetFC - 5}–{targetFC + 5}%</span><span>🔴 &gt;{targetFC + 5}%</span>
                            </div>
                        </div>

                        {/* Header colonne */}
                        <div style={{ display: "grid", gridTemplateColumns: "24px 1fr 110px 100px 100px 80px 28px", gap: "6px", padding: "4px 10px", fontSize: "10px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#7a6040", marginBottom: "4px" }}>
                            <span>#</span><span>Pizza</span><span style={{ textAlign: "right" }}>Costo tot.</span><span style={{ textAlign: "right" }}>Prezzo sugg.</span><span style={{ textAlign: "right" }}>Prezzo menu</span><span style={{ textAlign: "right" }}>FC%</span><span></span>
                        </div>

                        {(menuFilter === "Tutte" ? Object.keys(CAT_PIZZA) : [menuFilter]).map(cat => {
                            const cc = CAT_PIZZA[cat];
                            const pizcat = pizzeFilt.filter(p => p.cat === cat);
                            if (!pizcat.length) return null;
                            return (
                                <div key={cat} style={{ marginBottom: "22px" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "7px 12px", marginBottom: "8px", background: `${cc}18`, borderLeft: `4px solid ${cc}`, borderRadius: "0 8px 8px 0" }}>
                                        <span style={{ fontSize: "13px", fontWeight: "bold", color: cc }}>{cat}</span>
                                        <span style={{ fontSize: "11px", color: `${cc}88` }}>{pizcat.length} pizze</span>
                                        <span style={{ marginLeft: "auto", fontSize: "11px", color: "#7a6040" }}>Media: <b style={{ color: cc }}>{fmt2(pizcat.reduce((s, p) => s + p.priceFin, 0) / pizcat.length)}</b></span>
                                    </div>
                                    {pizcat.map(piz => {
                                        const fcc = fcColor(piz.fc);
                                        const isEx = expandedPizza === piz.id;
                                        return (
                                            <div key={piz.id} style={{ background: "rgba(255,255,255,0.025)", border: `1px solid ${cc}28`, borderRadius: "9px", marginBottom: "5px", overflow: "hidden" }}>
                                                <div style={{ display: "grid", gridTemplateColumns: "24px 1fr 110px 100px 100px 80px 28px", gap: "6px", padding: "10px 10px", alignItems: "center", cursor: "pointer" }}
                                                    onClick={() => setExpandedPizza(isEx ? null : piz.id)}>
                                                    <span style={{ fontSize: "12px", color: `${cc}66`, fontStyle: "italic" }}>{piz.id}</span>
                                                    <div>
                                                        <div style={{ fontSize: "14px", color: "#f0e6d3" }}>{piz.nome}</div>
                                                        <div style={{ fontSize: "10px", color: "#7a6040", marginTop: "1px" }}>{piz.cond.slice(0, 3).map(c => c.nome).join(", ")}{piz.cond.length > 3 ? "…" : ""}</div>
                                                    </div>
                                                    <div style={{ textAlign: "right", fontSize: "13px", color: "#e0c090" }}>{fmt4(piz.costoTot)}</div>
                                                    <div style={{ textAlign: "right", fontSize: "13px", color: cc, fontWeight: "bold" }}>{fmt2(piz.priceSugg)}</div>
                                                    <input type="number" min="0" step="0.5"
                                                        value={prezziPersonalizzati[piz.id] ?? piz.prezzoMenu}
                                                        onChange={e => { e.stopPropagation(); setPrezziPersonalizzati(prev => ({ ...prev, [piz.id]: Number(e.target.value) })); }}
                                                        onClick={e => e.stopPropagation()}
                                                        style={{ ...inSt, fontSize: "14px", fontWeight: "bold", color: "#fff", background: "rgba(255,255,255,0.08)", borderColor: `${cc}55` }}
                                                    />
                                                    <div style={{ textAlign: "right", fontSize: "14px", fontWeight: "bold", color: fcc }}>{piz.fc.toFixed(1)}%</div>
                                                    <span style={{ color: "#7a6040", fontSize: "14px", textAlign: "center" }}>{isEx ? "▲" : "▼"}</span>
                                                </div>
                                                {isEx && (
                                                    <div style={{ borderTop: `1px solid ${cc}18`, padding: "12px 12px", background: "rgba(0,0,0,0.14)" }}>
                                                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                                                            <div>
                                                                <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", color: "#7a6040", marginBottom: "8px" }}>Condimenti</div>
                                                                {piz.cond.map((cd, i) => {
                                                                    const cr = (cd.grammi / 1000) * cd.prezzoKgEff;
                                                                    return (
                                                                        <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", fontSize: "12px", alignItems: "center" }}>
                                                                            <span style={{ color: "#d0c0a0" }}>
                                                                                {cd.nome}
                                                                                <span style={{ color: "#7a6040" }}> ({cd.grammi}g)</span>
                                                                                {cd.daMAG
                                                                                    ? <span title="Prezzo aggiornato dal Magazzino" style={{ marginLeft: "5px", background: "rgba(80,160,100,0.2)", border: "1px solid rgba(80,160,100,0.5)", color: "#60b070", borderRadius: "4px", padding: "0 4px", fontSize: "9px", letterSpacing: "0.05em" }}>🔗 MAG</span>
                                                                                    : <span title="Prezzo non trovato in Magazzino — valore predefinito" style={{ marginLeft: "5px", background: "rgba(180,120,40,0.2)", border: "1px solid rgba(180,120,40,0.4)", color: "#c08040", borderRadius: "4px", padding: "0 4px", fontSize: "9px", letterSpacing: "0.05em" }}>⚠ STD</span>
                                                                                }
                                                                            </span>
                                                                            <span style={{ color: "#f5c57a" }}>{fmt4(cr)}</span>
                                                                        </div>
                                                                    );
                                                                })}
                                                                <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0 0", fontSize: "12px", fontWeight: "bold" }}>
                                                                    <span style={{ color: "#a0845a" }}>Tot. condimenti</span>
                                                                    <span style={{ color: "#f5c57a" }}>{fmt4(piz.costoCond)}</span>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", color: "#7a6040", marginBottom: "8px" }}>Breakdown costo</div>
                                                                {[
                                                                    { l: "Impasto", v: base.ingPall, col: "#c47d3a" },
                                                                    { l: "Indiretti", v: base.indPizza, col: "#6080c0" },
                                                                    { l: "Manodopera", v: base.manPizza, col: "#a060d0" },
                                                                    { l: "Condimenti", v: piz.costoCond, col: "#50a070" },
                                                                ].map(r => (
                                                                    <div key={r.l} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "3px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                                                                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                                                            <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: r.col, flexShrink: 0 }} />
                                                                            <span style={{ fontSize: "12px", color: "#d0c0a0" }}>{r.l}</span>
                                                                        </div>
                                                                        <span style={{ fontSize: "12px", color: r.col }}>{fmt4(r.v)}</span>
                                                                    </div>
                                                                ))}
                                                                <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0 3px", borderTop: "1px solid rgba(255,255,255,0.1)", marginTop: "4px" }}>
                                                                    <span style={{ fontSize: "12px", color: "#f5d5a0", fontWeight: "bold" }}>Costo totale</span>
                                                                    <span style={{ fontSize: "14px", fontWeight: "bold", color: "#f5c57a" }}>{fmt4(piz.costoTot)}</span>
                                                                </div>
                                                                <div style={{ display: "flex", justifyContent: "space-between", padding: "3px 0" }}>
                                                                    <span style={{ fontSize: "12px", color: "#a0845a" }}>Prezzo menu</span>
                                                                    <span style={{ fontSize: "14px", fontWeight: "bold", color: cc }}>{fmt2(piz.priceFin)}</span>
                                                                </div>
                                                                <div style={{ display: "flex", justifyContent: "space-between", padding: "3px 0" }}>
                                                                    <span style={{ fontSize: "12px", color: "#a0845a" }}>Margine lordo</span>
                                                                    <span style={{ fontSize: "14px", fontWeight: "bold", color: "#6abf7a" }}>{fmt2(piz.margine)}</span>
                                                                </div>
                                                                <div style={{ marginTop: "8px" }}>
                                                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#7a6040", marginBottom: "4px" }}>
                                                                        <span>Food Cost</span><span style={{ color: fcc, fontWeight: "bold" }}>{piz.fc.toFixed(1)}%</span>
                                                                    </div>
                                                                    <div style={{ height: "5px", borderRadius: "3px", background: "rgba(0,0,0,0.3)" }}>
                                                                        <div style={{ width: `${Math.min(piz.fc, 100)}%`, height: "100%", borderRadius: "3px", background: `linear-gradient(90deg,#6abf7a,${fcc})`, transition: "width 0.4s" }} />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })}

                        {/* Riepilogo menu */}
                        <div style={{ background: "linear-gradient(135deg,rgba(90,45,10,0.7),rgba(50,25,5,0.9))", border: "1px solid #8b5a2b", borderRadius: "13px", padding: "20px", marginTop: "8px" }}>
                            <h3 style={{ margin: "0 0 14px 0", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#a0845a" }}>Riepilogo Menu — {pizzeCalc.length} ricette</h3>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: "10px" }}>
                                {[
                                    { l: "Prezzo minimo", v: fmt2(Math.min(...pizzeCalc.map(p => p.priceFin))), col: "#6abf7a" },
                                    { l: "Prezzo massimo", v: fmt2(Math.max(...pizzeCalc.map(p => p.priceFin))), col: "#e07a5f" },
                                    { l: "Prezzo medio", v: fmt2(pizzeCalc.reduce((s, p) => s + p.priceFin, 0) / pizzeCalc.length), col: "#f5c57a" },
                                    { l: "FC% medio", v: (pizzeCalc.reduce((s, p) => s + p.fc, 0) / pizzeCalc.length).toFixed(1) + "%", col: "#a060d0" },
                                    { l: "Margine medio", v: fmt2(pizzeCalc.reduce((s, p) => s + p.margine, 0) / pizzeCalc.length), col: "#50a070" },
                                    { l: "Ricette totali", v: pizzeCalc.length, col: "#c47d3a" },
                                ].map((c, i) => (
                                    <div key={i} style={{ background: "rgba(0,0,0,0.2)", border: `1px solid ${c.col}28`, borderRadius: "8px", padding: "10px" }}>
                                        <div style={{ fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.08em", color: c.col, marginBottom: "5px" }}>{c.l}</div>
                                        <div style={{ fontSize: "17px", fontWeight: "bold", color: c.col }}>{c.v}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* COSTO PALLINA sempre visibile (non nel menu) */}
                {activeTab !== "menu" && (
                    <div style={{ background: "linear-gradient(135deg,rgba(90,45,10,0.65),rgba(50,25,5,0.85))", border: "1px solid #8b5a2b", borderRadius: "13px", padding: "20px", marginTop: "12px" }}>
                        <div style={{ fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#a0845a", marginBottom: "12px" }}>Costo Pallina Base</div>
                        <div style={{ marginBottom: "12px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#a0845a", marginBottom: "4px", flexWrap: "wrap", gap: "4px" }}>
                                <span>🌾 Ingredienti {percIng.toFixed(0)}%</span>
                                <span>⚙️ Indiretti {percInd.toFixed(0)}%</span>
                                <span>👷 Manodopera {percMan.toFixed(0)}%</span>
                            </div>
                            <div style={{ height: "8px", borderRadius: "4px", overflow: "hidden", background: "rgba(0,0,0,0.3)", display: "flex" }}>
                                <div style={{ width: `${percIng}%`, background: "linear-gradient(90deg,#c47d3a,#e8a040)", transition: "width 0.4s" }} />
                                <div style={{ width: `${percInd}%`, background: "linear-gradient(90deg,#4060a0,#6080c0)", transition: "width 0.4s" }} />
                                <div style={{ width: `${percMan}%`, background: "linear-gradient(90deg,#7040b0,#a060d0)", transition: "width 0.4s" }} />
                            </div>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", gap: "10px" }}>
                            {[
                                { l: "Ingredienti", v: base.ingPall, col: "#c47d3a" },
                                { l: "Indiretti", v: base.indPizza, col: "#6080c0" },
                                { l: "Manodopera", v: base.manPizza, col: "#a060d0" },
                                { l: "★ Costo totale", v: base.tot, col: "#f5c57a", g: true },
                            ].map((c, i) => (
                                <div key={i} style={{ background: `${c.col}10`, border: `1px solid ${c.col}30`, borderRadius: "8px", padding: "10px" }}>
                                    <div style={{ fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.08em", color: c.col, marginBottom: "5px" }}>{c.l}</div>
                                    <div style={{ fontSize: c.g ? "20px" : "16px", fontWeight: "bold", color: c.col }}>{fmt4(c.v)}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
