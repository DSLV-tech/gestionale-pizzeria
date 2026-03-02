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

// ── Brand Design System — Da Marcolino Official ──
const C = { rosso: '#C8392B', rosso2: '#9B2D20', giallo: '#E8B840', verde: '#2D6A2D', grigio: '#777777' };
const BG = { carta: '#EDE8DC', bianco: '#F9F6EF', nero: '#111111', border: 'rgba(17,17,17,0.15)' };
const T = { 100: '#111111', 300: '#444444', 500: '#777777', inv: '#F9F6EF' };

const inSt = {
    background: 'rgba(17,17,17,0.05)', border: '1px solid rgba(17,17,17,0.18)',
    borderRadius: '4px', color: '#111111', fontSize: '13px',
    fontFamily: "'Oswald', sans-serif", fontWeight: 500,
    outline: 'none', padding: '4px 8px', textAlign: 'right',
    width: '100%', boxSizing: 'border-box', transition: 'border-color 0.15s',
};
const dBtn = {
    background: 'transparent', border: 'none', color: C.grigio,
    cursor: 'pointer', fontSize: '18px', padding: '0', lineHeight: 1,
};
// FIX B4: hover via classe CSS .del-btn
const delBtnClass = "del-btn";

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
    // FIX B3: pre-costruiamo una Map una sola volta invece di fare O(n²) lookups.
    const pizzeCalc = useMemo(() => {
        // Map nome-esatto → costo
        const magMap = new Map();
        magazzino.forEach(m => magMap.set(m.nome.toLowerCase().trim(), m.costo));
        // Anche un array per le ricerche parziali (molto più raro)
        const magEntries = Array.from(magMap.entries());

        const lookup = (nome, fallback) => {
            const key = nome.toLowerCase().trim();
            // 1) Corrispondenza esatta — O(1)
            if (magMap.has(key)) return { prezzo: magMap.get(key), daMAG: true };
            // 2) Corrispondenza parziale — O(n), eseguita solo se necessario
            for (const [magNome, costo] of magEntries) {
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
        <div style={{ minHeight: '100vh', background: BG.carta, fontFamily: "'Source Serif 4', Georgia, serif", color: T[100] }}>

            {/* HEADER brand Da Marcolino */}
            <div style={{ background: BG.nero, padding: '0' }}>
                {/* Striscia top rossa */}
                <div style={{ background: C.rosso, padding: '5px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: '9px', fontWeight: 600, letterSpacing: '5px', textTransform: 'uppercase', color: 'rgba(249,246,239,0.7)' }}>Gestionale Interno · Da Marcolino</span>
                    <span style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '10px', fontStyle: 'italic', color: 'rgba(249,246,239,0.6)' }}>Stroppiana (VC) · Vercelli</span>
                </div>
                {/* Corpo header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap', padding: '18px 32px' }}>
                    {/* Logo SVG brand */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', borderRight: '1px solid rgba(249,246,239,0.12)', paddingRight: '24px', marginRight: '8px' }}>
                        <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '9px', fontWeight: 600, letterSpacing: '5px', textTransform: 'uppercase', color: C.rosso, lineHeight: 1, marginBottom: '6px' }}>Trattoria · Pizzeria</div>
                        <img src={`${import.meta.env.BASE_URL}scritta.svg`} alt="Da Marcolino" style={{ height: '38px', width: 'auto', filter: 'brightness(0) invert(1)', display: 'block', marginBottom: '4px' }} />
                        <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '9px', fontWeight: 400, letterSpacing: '3px', textTransform: 'uppercase', color: 'rgba(249,246,239,0.4)', marginTop: '1px' }}>Pannello di Gestione</div>
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '10px', fontWeight: 600, color: C.rosso, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '4px' }}>Moduli</div>
                        <div style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '12px', fontStyle: 'italic', color: 'rgba(249,246,239,0.5)', letterSpacing: '0.04em' }}>Impasto · Costi Indiretti · Manodopera · Magazzino · Menu &amp; Food Cost</div>
                    </div>
                    {/* KPI */}
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                        <div style={{ background: 'rgba(200,57,43,0.15)', border: `1px solid ${C.rosso}55`, borderRadius: '6px', padding: '10px 18px', textAlign: 'right' }}>
                            <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '9px', fontWeight: 600, color: C.rosso, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '3px' }}>Costo Pallina</div>
                            <div style={{ fontFamily: "'Alfa Slab One', serif", fontSize: '24px', color: BG.bianco, lineHeight: 1 }}>{fmt4(base.tot)}</div>
                        </div>
                        {alertCount > 0 && (
                            <div style={{ background: 'rgba(200,57,43,0.15)', border: `2px solid ${C.rosso}`, borderRadius: '6px', padding: '10px 14px', textAlign: 'center', cursor: 'pointer' }}
                                onClick={() => setActiveTab('magazzino')}>
                                <div style={{ fontSize: '18px' }}>⚠️</div>
                                <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '10px', fontWeight: 600, color: C.rosso, textTransform: 'uppercase', letterSpacing: '1px' }}>{alertCount} scorte basse</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div style={{ padding: '20px 32px', maxWidth: '1200px', margin: '0 auto' }}>

                {/* SLIDER */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '18px' }}>
                    {[
                        { label: '⚖️ Peso pallina', min: 200, max: 350, step: 10, val: pesoPallina, set: setPesoPallina, col: C.rosso, unit: 'g', sub: `${base.nPalline} palline dall’impasto` },
                        { label: '📅 Pizze/mese', min: 500, max: 10000, step: 100, val: pizzeMensili, set: setPizzeMensili, col: C.verde, unit: '', sub: `≈${Math.round(pizzeMensili / 26)} pizze/giorno lavorativo` },
                    ].map(s => (
                        <div key={s.label} style={{ background: BG.bianco, border: `1px solid ${BG.border}`, borderRadius: '6px', padding: '14px 18px', borderLeft: `3px solid ${s.col}` }}>
                            <label style={{ display: 'block', fontFamily: "'Oswald', sans-serif", fontSize: '9px', fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase', color: s.col, marginBottom: '10px' }}>{s.label}</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <input type="range" min={s.min} max={s.max} step={s.step} value={s.val} onChange={e => s.set(Number(e.target.value))} style={{ flex: 1, accentColor: s.col }} />
                                <div style={{ background: s.col, color: BG.bianco, borderRadius: '4px', padding: '4px 12px', fontFamily: "'Bebas Neue', 'Oswald', sans-serif", fontSize: '18px', minWidth: '72px', textAlign: 'center', letterSpacing: '1px' }}>{s.val.toLocaleString('it-IT')}{s.unit}</div>
                            </div>
                            <div style={{ fontFamily: "'Source Serif 4', serif", fontStyle: 'italic', fontSize: '11px', color: T[500], marginTop: '5px' }}>{s.sub}</div>
                        </div>
                    ))}
                </div>

                {/* TABS */}
                <div style={{ display: 'flex', marginBottom: '18px', borderBottom: `3px solid ${BG.nero}`, gap: '0' }}>
                    {TABS.map((t, i) => (
                        <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
                            padding: '9px 18px', border: 'none', cursor: 'pointer',
                            fontFamily: "'Oswald', sans-serif", fontSize: '11px', fontWeight: 600,
                            letterSpacing: '2px', textTransform: 'uppercase',
                            background: activeTab === t.key ? BG.nero : 'transparent',
                            color: activeTab === t.key ? BG.bianco : T[500],
                            borderRight: i < TABS.length - 1 ? `1px solid ${BG.border}` : 'none',
                            transition: 'all 0.15s',
                        }}>
                            {t.label}
                            {t.key === 'magazzino' && alertCount > 0 && <span style={{ marginLeft: '5px', background: C.rosso, color: BG.bianco, borderRadius: '10px', padding: '0 5px', fontSize: '10px' }}>{alertCount}</span>}
                        </button>
                    ))}
                </div>

                {/* ══ TAB IMPASTO ══ */}
                {activeTab === 'ingredienti' && (
                    <div style={{ marginBottom: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <span style={{ fontSize: '12px', color: T[500] }}>Impasto: <b style={{ color: T[100] }}>{base.pesoTot}g</b> → <b style={{ color: C.giallo }}>{base.nPalline} palline</b></span>
                            <button onClick={() => { setIngredienti(p => [...p, { id: nids.ing, nome: 'Nuovo', quantita: 0, costoPerKg: 0, colore: C.giallo }]); setNids(n => ({ ...n, ing: n.ing + 1 })); }} style={{ background: 'transparent', border: `1px solid ${C.giallo}66`, color: C.giallo, borderRadius: '6px', padding: '4px 10px', cursor: 'pointer', fontSize: '12px', fontFamily: 'inherit' }}>+ Aggiungi</button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px 120px 110px 30px', gap: '6px', padding: '4px 10px', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: T[700] }}>
                            <span>Ingrediente</span><span style={{ textAlign: 'right' }}>Qtà g</span><span style={{ textAlign: 'right' }}>€/kg</span><span style={{ textAlign: 'right' }}>Costo</span><span></span>
                        </div>
                        {(() => {
                            // FIX B2: farinaQ calcolata una sola volta fuori dal map()
                            const fQ = Number(ingredienti.find(i => i.nome.toLowerCase().includes("farin"))?.quantita || 1);
                            return ingredienti.map(ing => {
                                const cr = (Number(ing.quantita) / 1000) * Number(ing.costoPerKg);
                                const pct = base.pesoTot > 0 ? (Number(ing.quantita) / base.pesoTot) * 100 : 0;
                                return (
                                    <div key={ing.id} style={{ background: BG.bianco, border: `1px solid ${BG.border}`, borderRadius: '8px', marginBottom: '5px', overflow: 'hidden' }}>
                                        <div style={{ height: '3px', background: `linear-gradient(90deg,${ing.colore} ${pct}%,transparent ${pct}%)`, opacity: 0.8 }} />
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px 120px 110px 30px', gap: '6px', padding: '8px 10px', alignItems: 'center' }}>
                                            <input value={ing.nome} onChange={e => updIng(ing.id, 'nome', e.target.value)} style={{ background: 'transparent', border: 'none', color: T[100], fontSize: '13px', fontFamily: 'Inter, system-ui, sans-serif', outline: 'none' }} />
                                            <input type="number" min="0" value={ing.quantita} onChange={e => updIng(ing.id, 'quantita', e.target.value)} style={inSt} />
                                            <input type="number" min="0" step="0.01" value={ing.costoPerKg} onChange={e => updIng(ing.id, 'costoPerKg', e.target.value)} style={inSt} />
                                            <div style={{ textAlign: 'right', fontSize: '13px', color: cr > 0 ? C.giallo : T[700] }}>{fmt4(cr)}</div>
                                            <button onClick={() => setIngredienti(p => p.filter(i => i.id !== ing.id))} style={dBtn} className={delBtnClass}>×</button>
                                        </div>
                                        <div style={{ padding: '0 10px 6px', fontSize: '10px', color: T[500], display: 'flex', gap: '12px' }}>
                                            <span>{pct.toFixed(1)}%</span>
                                            {ing.nome.toLowerCase().includes('acqua') && <span style={{ color: C.verde }}>💧 Idrat. {((Number(ing.quantita) / fQ) * 100).toFixed(0)}%</span>}
                                        </div>
                                    </div>
                                );
                            });
                        })()}
                    </div>
                )}

                {/* ══ TAB INDIRETTI ══ */}
                {activeTab === "indiretti" && (
                    <div style={{ marginBottom: "20px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                            <span style={{ fontSize: "12px", color: T[500] }}>Mensile: <b style={{ color: T[100] }}>{fmt2(base.indMens)}</b> → <b style={{ color: C.verde }}>{fmt4(base.indPizza)}</b>/pizza</span>
                            <button onClick={() => { setIndiretti(p => [...p, { id: nids.ind, nome: "Nuova voce", icona: "📋", costoMensile: 0, cat: "sala" }]); setNids(n => ({ ...n, ind: n.ind + 1 })); }} style={{ background: "transparent", border: "1px solid #506090", color: C.verde, borderRadius: "6px", padding: "4px 10px", cursor: "pointer", fontSize: "12px", fontFamily: "inherit" }}>+ Aggiungi</button>
                        </div>
                        {Object.entries(CAT_IND).map(([ck, cv]) => {
                            const voci = indiretti.filter(i => i.cat === ck);
                            if (!voci.length) return null;
                            const tot = voci.reduce((s, i) => s + Number(i.costoMensile), 0);
                            return (
                                <div key={ck} style={{ marginBottom: "16px" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 10px", marginBottom: "5px", background: `${cv.colore}18`, borderLeft: `3px solid ${cv.colore}`, borderRadius: "0 6px 6px 0" }}>
                                        <span style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: cv.colore }}>{cv.label}</span>
                                        <span style={{ fontSize: "12px", color: T[500] }}>{fmt2(tot)}/mese</span>
                                    </div>
                                    {voci.map(v => (
                                        <div key={v.id} style={{ display: "grid", gridTemplateColumns: "30px 1fr 150px 110px 30px", gap: "6px", padding: "8px 10px", alignItems: "center", background: BG.bianco, border: `1px solid ${BG.border}`, borderRadius: "7px", marginBottom: "4px" }}>
                                            <input value={v.icona} onChange={e => updInd(v.id, "icona", e.target.value)} style={{ background: "transparent", border: "none", color: T[100], fontSize: "16px", fontFamily: "inherit", outline: "none", textAlign: "center" }} />
                                            <input value={v.nome} onChange={e => updInd(v.id, "nome", e.target.value)} style={{ background: "transparent", border: "none", color: T[100], fontSize: "13px", fontFamily: "inherit", outline: "none" }} />
                                            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                                <span style={{ fontSize: "10px", color: T[500], whiteSpace: "nowrap" }}>€/mese</span>
                                                <input type="number" min="0" value={v.costoMensile} onChange={e => updInd(v.id, "costoMensile", e.target.value)} style={{ ...inSt, width: "80px" }} />
                                            </div>
                                            <div style={{ textAlign: "right", fontSize: "12px", color: C.verde }}>{fmt4(pizzeMensili > 0 ? Number(v.costoMensile) / pizzeMensili : 0)}<span style={{ fontSize: "9px", color: T[500] }}>/pz</span></div>
                                            <button onClick={() => setIndiretti(p => p.filter(i => i.id !== v.id))} style={dBtn} className={delBtnClass}>×</button>
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
                            <span style={{ fontSize: "12px", color: T[500] }}>Mensile: <b style={{ color: T[100] }}>{fmt2(base.manMens)}</b> → <b style={{ color: C.rosso }}>{fmt4(base.manPizza)}</b>/pizza</span>
                            <button onClick={() => { setManodopera(p => [...p, { id: nids.man, ruolo: "Nuovo ruolo", icona: "🧑‍🍳", costoOrario: 10, oreGiornaliere: 8, giorniMese: 26 }]); setNids(n => ({ ...n, man: n.man + 1 })); }} style={{ background: "transparent", border: "1px solid #7050a0", color: C.rosso, borderRadius: "6px", padding: "4px 10px", cursor: "pointer", fontSize: "12px", fontFamily: "inherit" }}>+ Aggiungi</button>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "30px 1fr 90px 100px 90px 110px 30px", gap: "6px", padding: "4px 10px", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: T[500] }}>
                            <span></span><span>Ruolo</span><span style={{ textAlign: "right" }}>€/ora</span><span style={{ textAlign: "right" }}>Ore/gg</span><span style={{ textAlign: "right" }}>Gg/mese</span><span style={{ textAlign: "right" }}>Mensile</span><span></span>
                        </div>
                        {manodopera.map(m => {
                            const cm = Number(m.costoOrario) * Number(m.oreGiornaliere) * Number(m.giorniMese);
                            return (
                                <div key={m.id} style={{ background: BG.bianco, border: `1px solid ${BG.border}`, borderRadius: "9px", marginBottom: "7px", overflow: "hidden" }}>
                                    <div style={{ height: "3px", background: `linear-gradient(90deg,${C.rosso},${C.rosso2})`, opacity: 0.5 }} />
                                    <div style={{ display: "grid", gridTemplateColumns: "30px 1fr 90px 100px 90px 110px 30px", gap: "6px", padding: "10px 10px", alignItems: "center" }}>
                                        <input value={m.icona} onChange={e => updMan(m.id, "icona", e.target.value)} style={{ background: "transparent", border: "none", color: T[100], fontSize: "16px", fontFamily: "inherit", outline: "none", textAlign: "center" }} />
                                        <input value={m.ruolo} onChange={e => updMan(m.id, "ruolo", e.target.value)} style={{ background: "transparent", border: "none", color: T[100], fontSize: "13px", fontFamily: "inherit", outline: "none" }} />
                                        <input type="number" min="0" step="0.5" value={m.costoOrario} onChange={e => updMan(m.id, "costoOrario", e.target.value)} style={{ ...inSt, borderColor: BG.border }} />
                                        <input type="number" min="0" max="24" step="0.5" value={m.oreGiornaliere} onChange={e => updMan(m.id, "oreGiornaliere", e.target.value)} style={{ ...inSt, borderColor: BG.border }} />
                                        <input type="number" min="0" max="31" value={m.giorniMese} onChange={e => updMan(m.id, "giorniMese", e.target.value)} style={{ ...inSt, borderColor: BG.border }} />
                                        <div style={{ textAlign: "right" }}>
                                            <div style={{ fontSize: "14px", fontWeight: "bold", color: C.rosso }}>{fmt2(cm)}</div>
                                            <div style={{ fontSize: "10px", color: T[500] }}>{fmt4(pizzeMensili > 0 ? cm / pizzeMensili : 0)}/pz</div>
                                        </div>
                                        <button onClick={() => setManodopera(p => p.filter(x => x.id !== m.id))} style={dBtn} className={delBtnClass}>×</button>
                                    </div>
                                </div>
                            );
                        })}
                        <div style={{ background: `rgba(200,57,43,0.06)`, border: `1px dashed ${C.rosso}28`, borderRadius: "9px", padding: "10px 14px", fontSize: "11px", color: T[500], lineHeight: 1.6 }}>
                            💡 Inserire il <b style={{ color: C.rosso }}>costo orario lordo aziendale</b> (netto + contributi + ratei). Solitamente +40–50% dello stipendio netto.
                        </div>
                    </div>
                )}

                {/* ══ TAB MAGAZZINO ══ */}
                {activeTab === "magazzino" && (
                    <div style={{ marginBottom: "20px" }}>
                        {/* Filtri categorie + pulsante aggiunta */}
                        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px", alignItems: "center" }}>
                            <span style={{ fontSize: "11px", color: T[500], marginRight: "4px" }}>Categoria:</span>
                            {catsMag.map(ck => {
                                const info = ck === "tutte" ? { label: "Tutte", colore: C.giallo } : CAT_MAG[ck];
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
                            <span style={{ marginLeft: "auto", fontSize: "11px", color: C.rosso }}>
                                {alertCount > 0 ? `⚠️ ${alertCount} prodotti sotto scorta minima` : "✅ Tutte le scorte ok"}
                            </span>
                            <button
                                onClick={() => {
                                    setMagazzino(p => [...p, { id: nids.mag, nome: "Nuovo prodotto", cat: magFilter === "tutte" ? "dispensa" : magFilter, u: "kg", costo: 0, scorta: 0, min: 0 }]);
                                    setNids(n => ({ ...n, mag: n.mag + 1 }));
                                }}
                                style={{ background: "transparent", border: `1px solid ${C.giallo}66`, color: C.giallo, borderRadius: "6px", padding: "3px 10px", cursor: "pointer", fontSize: "12px", fontFamily: "inherit" }}
                            >+ Prodotto</button>
                        </div>

                        {/* Header colonne */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 55px 80px 80px 80px 90px", gap: "6px", padding: "4px 10px", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: T[500], marginBottom: "4px" }}>
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
                                        <span style={{ fontSize: "11px", color: T[500] }}>{voci.length} prodotti · {voci.filter(m => Number(m.scorta) <= Number(m.min)).length} alert</span>
                                    </div>
                                    {voci.map(m => {
                                        const isLow = Number(m.scorta) <= Number(m.min);
                                        const isZero = Number(m.scorta) === 0;
                                        const stato = isZero ? { label: "ESAURITO", col: C.rosso } : isLow ? { label: "BASSO", col: C.giallo } : { label: "OK", col: C.verde };
                                        return (
                                            <div key={m.id} style={{
                                                display: "grid", gridTemplateColumns: "1fr 55px 80px 80px 80px 90px",
                                                gap: "6px", padding: "8px 10px", alignItems: "center",
                                                background: BG.bianco,
                                                border: `1px solid ${isLow ? `${C.rosso}33` : BG.border}`,
                                                borderRadius: "7px", marginBottom: "4px",
                                            }}>
                                                <input value={m.nome} onChange={e => updMag(m.id, "nome", e.target.value)} style={{ background: "transparent", border: "none", color: T[100], fontSize: "13px", fontFamily: "inherit", outline: "none" }} />
                                                <div style={{ textAlign: "center", fontSize: "11px", color: T[500] }}>{m.u}</div>
                                                <input type="number" min="0" step="0.01" value={m.costo} onChange={e => updMag(m.id, "costo", e.target.value)} style={{ ...inSt, fontSize: "12px" }} />
                                                <input type="number" min="0" step="0.1" value={m.scorta} onChange={e => updMag(m.id, "scorta", e.target.value)} style={{ ...inSt, fontSize: "13px", fontWeight: "bold", color: isLow ? C.giallo : T[100] }} />
                                                <input type="number" min="0" step="0.1" value={m.min} onChange={e => updMag(m.id, "min", e.target.value)} style={{ ...inSt, fontSize: "12px", color: T[500] }} />
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
                            <div style={{ background: BG.bianco, border: `1px solid ${C.verde}40`, borderRadius: "9px", padding: "10px 14px", display: "flex", alignItems: "center", gap: "10px" }}>
                                <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", color: C.verde }}>🎯 Target FC</span>
                                <input type="range" min="20" max="40" step="1" value={targetFC} onChange={e => setTargetFC(Number(e.target.value))} style={{ width: "80px", accentColor: C.verde }} />
                                <div style={{ background: C.verde, color: BG.bianco, borderRadius: "6px", padding: "3px 10px", fontSize: "15px", fontWeight: "bold", minWidth: "46px", textAlign: "center" }}>{targetFC}%</div>
                            </div>
                            <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                                {catsFiltro.map(cat => (
                                    <button key={cat} onClick={() => setMenuFilter(cat)} style={{
                                        background: menuFilter === cat ? (cat === "Tutte" ? C.giallo : (CAT_PIZZA[cat] || C.giallo)) : "transparent",
                                        border: `1px solid ${cat === "Tutte" ? C.giallo : (CAT_PIZZA[cat] || C.giallo)}`,
                                        color: menuFilter === cat ? BG.bianco : (cat === "Tutte" ? C.giallo : (CAT_PIZZA[cat] || C.giallo)),
                                        borderRadius: "16px", padding: "3px 11px", cursor: "pointer", fontSize: "11px", fontFamily: "inherit",
                                    }}>{cat}</button>
                                ))}
                            </div>
                            <div style={{ marginLeft: "auto", fontSize: "11px", color: T[500], display: "flex", gap: "12px" }}>
                                <span>🟢 &lt;{targetFC - 5}%</span><span>🟡 {targetFC - 5}–{targetFC + 5}%</span><span>🔴 &gt;{targetFC + 5}%</span>
                            </div>
                        </div>

                        {/* Header colonne */}
                        <div style={{ display: "grid", gridTemplateColumns: "24px 1fr 110px 100px 100px 80px 28px", gap: "6px", padding: "4px 10px", fontSize: "10px", letterSpacing: "0.08em", textTransform: "uppercase", color: T[500], marginBottom: "4px" }}>
                            <span>#</span><span>Pizza</span><span style={{ textAlign: "right" }}>Costo tot.</span><span style={{ textAlign: "right" }}>Prezzo sugg.</span><span style={{ textAlign: "right" }}>Prezzo menu</span><span style={{ textAlign: "right" }}>FC%</span><span></span>
                        </div>

                        {pizzeFilt.length === 0 && (
                            <div style={{ textAlign: "center", padding: "40px", color: T[500], fontSize: "13px" }}>
                                Nessuna pizza trovata per la categoria selezionata.
                            </div>
                        )}
                        {(menuFilter === "Tutte" ? Object.keys(CAT_PIZZA) : [menuFilter]).map(cat => {
                            const cc = CAT_PIZZA[cat];
                            const pizcat = pizzeFilt.filter(p => p.cat === cat);
                            if (!pizcat.length) return null;
                            return (
                                <div key={cat} style={{ marginBottom: "22px" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "7px 12px", marginBottom: "8px", background: `${cc}18`, borderLeft: `4px solid ${cc}`, borderRadius: "0 8px 8px 0" }}>
                                        <span style={{ fontSize: "13px", fontWeight: "bold", color: cc }}>{cat}</span>
                                        <span style={{ fontSize: "11px", color: `${cc}88` }}>{pizcat.length} pizze</span>
                                        <span style={{ marginLeft: "auto", fontSize: "11px", color: T[500] }}>Media: <b style={{ color: cc }}>{fmt2(pizcat.reduce((s, p) => s + p.priceFin, 0) / pizcat.length)}</b></span>
                                    </div>
                                    {pizcat.map(piz => {
                                        const fcc = fcColor(piz.fc);
                                        const isEx = expandedPizza === piz.id;
                                        return (
                                            <div key={piz.id} style={{ background: BG.bianco, border: `1px solid ${BG.border}`, borderRadius: "9px", marginBottom: "5px", overflow: "hidden" }}>
                                                <div style={{ display: "grid", gridTemplateColumns: "24px 1fr 110px 100px 100px 80px 28px", gap: "6px", padding: "10px 10px", alignItems: "center", cursor: "pointer" }}
                                                    onClick={() => setExpandedPizza(isEx ? null : piz.id)}>
                                                    <span style={{ fontSize: "12px", color: T[500], fontStyle: "italic" }}>{piz.id}</span>
                                                    <div>
                                                        <div style={{ fontSize: "14px", color: T[100] }}>{piz.nome}</div>
                                                        <div style={{ fontSize: "10px", color: T[500], marginTop: "1px" }}>{piz.cond.slice(0, 3).map(c => c.nome).join(", ")}{piz.cond.length > 3 ? "…" : ""}</div>
                                                    </div>
                                                    <div style={{ textAlign: "right", fontSize: "13px", color: C.giallo }}>{fmt4(piz.costoTot)}</div>
                                                    <div style={{ textAlign: "right", fontSize: "13px", color: cc, fontWeight: "bold" }}>{fmt2(piz.priceSugg)}</div>
                                                    <input type="number" min="0" step="0.5"
                                                        value={prezziPersonalizzati[piz.id] ?? piz.prezzoMenu}
                                                        onChange={e => { e.stopPropagation(); setPrezziPersonalizzati(prev => ({ ...prev, [piz.id]: Number(e.target.value) })); }}
                                                        onClick={e => e.stopPropagation()}
                                                        style={{ ...inSt, fontSize: "14px", fontWeight: "bold", color: T[100], background: 'rgba(17,17,17,0.08)', borderColor: `${cc}55` }}
                                                    />
                                                    <div style={{ textAlign: "right", fontSize: "14px", fontWeight: "bold", color: fcc }}>{piz.fc.toFixed(1)}%</div>
                                                    <span style={{ color: T[500], fontSize: "14px", textAlign: "center" }}>{isEx ? "▲" : "▼"}</span>
                                                </div>
                                                {isEx && (
                                                    <div style={{ borderTop: `1px solid ${BG.border}`, padding: "12px 12px", background: 'rgba(17,17,17,0.04)' }}>
                                                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                                                            <div>
                                                                <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", color: T[500], marginBottom: "8px" }}>Condimenti</div>
                                                                {piz.cond.map((cd, i) => {
                                                                    const cr = (cd.grammi / 1000) * cd.prezzoKgEff;
                                                                    return (
                                                                        <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", borderBottom: `1px solid ${BG.border}`, fontSize: "12px", alignItems: "center" }}>
                                                                            <span style={{ color: T[300] }}>
                                                                                {cd.nome}
                                                                                <span style={{ color: T[500] }}> ({cd.grammi}g)</span>
                                                                                {cd.daMAG
                                                                                    ? <span title="Prezzo aggiornato dal Magazzino" style={{ marginLeft: "5px", background: `${C.verde}20`, border: `1px solid ${C.verde}50`, color: C.verde, borderRadius: "4px", padding: "0 4px", fontSize: "9px", letterSpacing: "0.05em" }}>🔗 MAG</span>
                                                                                    : <span title="Prezzo non trovato in Magazzino — valore predefinito" style={{ marginLeft: "5px", background: `${C.giallo}20`, border: `1px solid ${C.giallo}40`, color: C.giallo, borderRadius: "4px", padding: "0 4px", fontSize: "9px", letterSpacing: "0.05em" }}>⚠ STD</span>
                                                                                }
                                                                            </span>
                                                                            <span style={{ color: C.giallo }}>{fmt4(cr)}</span>
                                                                        </div>
                                                                    );
                                                                })}
                                                                <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0 0", fontSize: "12px", fontWeight: "bold" }}>
                                                                    <span style={{ color: T[500] }}>Tot. condimenti</span>
                                                                    <span style={{ color: C.giallo }}>{fmt4(piz.costoCond)}</span>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", color: T[500], marginBottom: "8px" }}>Breakdown costo</div>
                                                                {[
                                                                    { l: "Impasto", v: base.ingPall, col: C.giallo },
                                                                    { l: "Indiretti", v: base.indPizza, col: C.verde },
                                                                    { l: "Manodopera", v: base.manPizza, col: C.rosso },
                                                                    { l: "Condimenti", v: piz.costoCond, col: T[300] },
                                                                ].map(r => (
                                                                    <div key={r.l} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "3px 0", borderBottom: `1px solid ${BG.border}` }}>
                                                                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                                                            <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: r.col, flexShrink: 0 }} />
                                                                            <span style={{ fontSize: "12px", color: T[300] }}>{r.l}</span>
                                                                        </div>
                                                                        <span style={{ fontSize: "12px", color: r.col }}>{fmt4(r.v)}</span>
                                                                    </div>
                                                                ))}
                                                                <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0 3px", borderTop: `1px solid ${BG.border}`, marginTop: "4px" }}>
                                                                    <span style={{ fontSize: "12px", color: T[300], fontWeight: "bold" }}>Costo totale</span>
                                                                    <span style={{ fontSize: "14px", fontWeight: "bold", color: C.giallo }}>{fmt4(piz.costoTot)}</span>
                                                                </div>
                                                                <div style={{ display: "flex", justifyContent: "space-between", padding: "3px 0" }}>
                                                                    <span style={{ fontSize: "12px", color: T[500] }}>Prezzo menu</span>
                                                                    <span style={{ fontSize: "14px", fontWeight: "bold", color: cc }}>{fmt2(piz.priceFin)}</span>
                                                                </div>
                                                                <div style={{ display: "flex", justifyContent: "space-between", padding: "3px 0" }}>
                                                                    <span style={{ fontSize: "12px", color: T[500] }}>Margine lordo</span>
                                                                    <span style={{ fontSize: "14px", fontWeight: "bold", color: C.verde }}>{fmt2(piz.margine)}</span>
                                                                </div>
                                                                <div style={{ marginTop: "8px" }}>
                                                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: T[500], marginBottom: "4px" }}>
                                                                        <span>Food Cost</span><span style={{ color: fcc, fontWeight: "bold" }}>{piz.fc.toFixed(1)}%</span>
                                                                    </div>
                                                                    <div style={{ height: "5px", borderRadius: "3px", background: 'rgba(17,17,17,0.1)' }}>
                                                                        <div style={{ width: `${Math.min(piz.fc, 100)}%`, height: "100%", borderRadius: "3px", background: `linear-gradient(90deg,${C.verde},${fcc})`, transition: "width 0.4s" }} />
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
                        <div style={{ background: BG.bianco, border: `1px solid ${BG.border}`, borderRadius: "13px", padding: "20px", marginTop: "8px" }}>
                            <h3 style={{ margin: "0 0 14px 0", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: T[500] }}>Riepilogo Menu — {pizzeCalc.length} ricette</h3>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: "10px" }}>
                                {[
                                    { l: "Prezzo minimo", v: fmt2(Math.min(...pizzeCalc.map(p => p.priceFin))), col: C.verde },
                                    { l: "Prezzo massimo", v: fmt2(Math.max(...pizzeCalc.map(p => p.priceFin))), col: C.rosso },
                                    { l: "Prezzo medio", v: fmt2(pizzeCalc.reduce((s, p) => s + p.priceFin, 0) / pizzeCalc.length), col: C.giallo },
                                    { l: "FC% medio", v: (pizzeCalc.reduce((s, p) => s + p.fc, 0) / pizzeCalc.length).toFixed(1) + "%", col: T[300] },
                                    { l: "Margine medio", v: fmt2(pizzeCalc.reduce((s, p) => s + p.margine, 0) / pizzeCalc.length), col: C.verde },
                                    { l: "Ricette totali", v: pizzeCalc.length, col: T[500] },
                                ].map((c, i) => (
                                    <div key={i} style={{ background: 'rgba(17,17,17,0.05)', border: `1px solid ${BG.border}`, borderRadius: "8px", padding: "10px" }}>
                                        <div style={{ fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.08em", color: c.col, marginBottom: "5px" }}>{c.l}</div>
                                        <div style={{ fontSize: "17px", fontWeight: "bold", color: c.col }}>{c.v}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* COSTO PALLINA (non visibile nella tab menu) */}
                {activeTab !== 'menu' && (
                    <div style={{ background: BG.nero, border: `3px solid ${BG.nero}`, borderRadius: '6px', padding: '20px', marginTop: '14px' }}>
                        <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '10px', fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase', color: C.rosso, marginBottom: '14px' }}>Riepilogo Costo Pallina</div>
                        <div style={{ marginBottom: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Oswald', sans-serif", fontSize: '9px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(249,246,239,0.5)', marginBottom: '5px', flexWrap: 'wrap', gap: '4px' }}>
                                <span>🌾 Ingredienti {percIng.toFixed(0)}%</span>
                                <span>⚙️ Indiretti {percInd.toFixed(0)}%</span>
                                <span>👷 Manodopera {percMan.toFixed(0)}%</span>
                            </div>
                            <div style={{ height: '6px', borderRadius: '3px', overflow: 'hidden', background: 'rgba(249,246,239,0.1)', display: 'flex' }}>
                                <div style={{ width: `${percIng}%`, background: C.giallo, transition: 'width 0.4s' }} />
                                <div style={{ width: `${percInd}%`, background: C.verde, transition: 'width 0.4s' }} />
                                <div style={{ width: `${percMan}%`, background: C.rosso, transition: 'width 0.4s' }} />
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(120px,1fr))', gap: '10px' }}>
                            {[
                                { l: 'Ingredienti', v: base.ingPall, col: C.giallo },
                                { l: 'Indiretti', v: base.indPizza, col: C.verde },
                                { l: 'Manodopera', v: base.manPizza, col: C.rosso },
                                { l: '★ Costo tot.', v: base.tot, col: BG.bianco, g: true },
                            ].map((c, i) => (
                                <div key={i} style={{ background: `rgba(249,246,239,0.05)`, border: `1px solid rgba(249,246,239,0.1)`, borderLeft: `3px solid ${c.col}`, borderRadius: '4px', padding: '10px 12px' }}>
                                    <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '9px', textTransform: 'uppercase', letterSpacing: '2px', color: c.col, marginBottom: '6px', fontWeight: 600 }}>{c.l}</div>
                                    <div style={{ fontFamily: c.g ? "'Alfa Slab One', serif" : "'Oswald', sans-serif", fontSize: c.g ? '20px' : '16px', fontWeight: c.g ? 'normal' : 700, color: c.col }}>{fmt4(c.v)}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
