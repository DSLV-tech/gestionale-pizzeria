# Guida Tecnica & Architettura — Gestionale Pizzeria

---

## 1. Panoramica del Progetto

Un gestionale web per pizzeria con tre macro-funzionalità:
- **Gestione Menu & Ricette** — ingredienti, preparazioni, varianti
- **Calcolo Food Cost** — costo per piatto, margine, % food cost
- **Ordini Fornitori & Magazzino** — tre reparti (Pizzeria, Ristorante, Bar) con scorte parzialmente condivise

---

## 2. Stack Tecnologico Consigliato

### Frontend
| Tecnologia | Ruolo |
|---|---|
| **React** (Vite) | UI framework principale |
| **TailwindCSS** | Styling rapido e responsivo |
| **React Query** | Gestione stato server / cache |
| **React Hook Form + Zod** | Form e validazione |
| **Recharts** | Grafici food cost e dashboard |

### Backend
| Tecnologia | Ruolo |
|---|---|
| **Node.js + Express** (o Fastify) | API REST |
| **PostgreSQL** | Database relazionale principale |
| **Prisma** | ORM — migrations, type safety |
| **JWT + bcrypt** | Autenticazione utenti |
| **Zod** | Validazione input lato server |

### Infrastruttura
| Tecnologia | Ruolo |
|---|---|
| **Docker + Docker Compose** | Ambiente locale e produzione |
| **Railway / Render** | Deploy backend + DB (low cost) |
| **Vercel / Netlify** | Deploy frontend |
| **Cloudinary** (opzionale) | Upload foto piatti |

---

## 3. Architettura Generale

```
┌─────────────────────────────────────────────────────┐
│                   BROWSER (React SPA)                │
│  ┌──────────┐  ┌──────────┐  ┌────────────────────┐ │
│  │  Menu &  │  │ Food     │  │ Magazzino & Ordini  │ │
│  │ Ricette  │  │ Cost     │  │ Pizzeria/Rist./Bar  │ │
│  └──────────┘  └──────────┘  └────────────────────┘ │
└────────────────────────┬────────────────────────────┘
                         │ HTTP REST (JSON)
┌────────────────────────▼────────────────────────────┐
│                  API SERVER (Node.js)                │
│  /api/ingredienti   /api/ricette   /api/food-cost    │
│  /api/magazzino     /api/ordini    /api/fornitori    │
└────────────────────────┬────────────────────────────┘
                         │ Prisma ORM
┌────────────────────────▼────────────────────────────┐
│                   PostgreSQL DB                      │
│  ingredienti  •  ricette  •  reparti                 │
│  scorte       •  fornitori  •  ordini                │
└─────────────────────────────────────────────────────┘
```

---

## 4. Modello Dati (Schema Prisma)

### Concetto chiave: ingredienti globali, scorte per reparto

```prisma
// ─── INGREDIENTI (globali, condivisi tra reparti) ───
model Ingrediente {
  id            Int      @id @default(autoincrement())
  nome          String   @unique
  unita_misura  String   // kg, lt, pz, ecc.
  costo_unitario Decimal // costo per unità di misura
  categoria     String   // latticini, carni, bevande...
  fornitore_id  Int?

  fornitore     Fornitore?      @relation(fields: [fornitore_id], references: [id])
  scorte        ScortaReparto[]
  componenti    ComponenteRicetta[]

  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

// ─── SCORTE PER REPARTO ───
model ScortaReparto {
  id               Int    @id @default(autoincrement())
  ingrediente_id   Int
  reparto          Reparto  // enum: PIZZERIA | RISTORANTE | BAR
  quantita_attuale Decimal
  quantita_minima  Decimal  // soglia per alert riordino
  quantita_ideale  Decimal  // quantità target dopo rifornimento

  ingrediente      Ingrediente @relation(fields: [ingrediente_id], references: [id])

  @@unique([ingrediente_id, reparto])
}

enum Reparto {
  PIZZERIA
  RISTORANTE
  BAR
}

// ─── RICETTE ───
model Ricetta {
  id           Int    @id @default(autoincrement())
  nome         String
  reparto      Reparto
  categoria    String   // pizza, antipasto, cocktail...
  prezzo_vendita Decimal
  porzioni     Int    @default(1)
  note         String?

  componenti   ComponenteRicetta[]
}

model ComponenteRicetta {
  id             Int     @id @default(autoincrement())
  ricetta_id     Int
  ingrediente_id Int
  quantita       Decimal // quantità usata per porzione
  unita_misura   String

  ricetta        Ricetta     @relation(fields: [ricetta_id], references: [id])
  ingrediente    Ingrediente @relation(fields: [ingrediente_id], references: [id])
}

// ─── FORNITORI ───
model Fornitore {
  id        Int    @id @default(autoincrement())
  nome      String
  contatto  String?
  email     String?
  telefono  String?
  note      String?

  ingredienti Ingrediente[]
  ordini      Ordine[]
}

// ─── ORDINI RIFORNIMENTO ───
model Ordine {
  id           Int          @id @default(autoincrement())
  fornitore_id Int
  reparto      Reparto
  stato        StatoOrdine  @default(BOZZA)
  data_ordine  DateTime     @default(now())
  data_consegna DateTime?
  note         String?

  fornitore    Fornitore     @relation(fields: [fornitore_id], references: [id])
  righe        RigaOrdine[]
}

model RigaOrdine {
  id             Int     @id @default(autoincrement())
  ordine_id      Int
  ingrediente_id Int
  quantita       Decimal
  costo_unitario Decimal // snapshot del costo al momento dell'ordine
  
  ordine         Ordine      @relation(fields: [ordine_id], references: [id])
  ingrediente    Ingrediente @relation(fields: [ingrediente_id], references: [id])
}

enum StatoOrdine {
  BOZZA
  INVIATO
  CONFERMATO
  CONSEGNATO
  ANNULLATO
}
```

---

## 5. Logica Food Cost

Il food cost si calcola automaticamente dalle ricette:

```
Costo ricetta = Σ (quantità_componente × costo_unitario_ingrediente)

Food Cost % = (Costo ricetta / Prezzo vendita) × 100
```

**Soglie di riferimento:**
- 🟢 Food Cost < 28% → ottimo margine
- 🟡 Food Cost 28–35% → nella norma
- 🔴 Food Cost > 35% → da ottimizzare

### Endpoint API suggerito
```
GET /api/ricette/:id/food-cost
→ {
    costo_ingredienti: 2.40,
    prezzo_vendita: 9.00,
    food_cost_percentuale: 26.7,
    margine_lordo: 6.60
  }
```

---

## 6. Logica Ordini & Magazzino

### Generazione automatica ordine

Al click su **"Genera Ordine Automatico"** per un reparto:

```
Per ogni ingrediente del reparto:
  SE quantita_attuale < quantita_minima:
    quantita_da_ordinare = quantita_ideale - quantita_attuale
    aggiungi alla bozza d'ordine
```

Il sistema raggruppa le righe per fornitore, generando **un ordine per fornitore**.

### Flusso operativo
```
Controllo scorte → Alert ingredienti sotto soglia
       ↓
Genera bozza ordine (per reparto)
       ↓
Revisione manuale (aggiungi/modifica quantità)
       ↓
Stato: BOZZA → INVIATO (email/WhatsApp al fornitore)
       ↓
Conferma arrivo merce → aggiornamento automatico scorte
       ↓
Stato: CONSEGNATO
```

---

## 7. Struttura Cartelle del Progetto

```
pizzeria-gestionale/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Menu/          # Lista ricette per reparto
│   │   │   ├── FoodCost/      # Analisi costi e margini
│   │   │   ├── Magazzino/     # Scorte per reparto
│   │   │   └── Ordini/        # Bozze e storico ordini
│   │   ├── components/        # Componenti riutilizzabili
│   │   ├── hooks/             # Custom hooks (useRicette, useFoodCost...)
│   │   └── api/               # Client HTTP (Axios/Fetch)
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── ingredienti.ts
│   │   │   ├── ricette.ts
│   │   │   ├── magazzino.ts
│   │   │   └── ordini.ts
│   │   ├── middleware/        # Auth, error handling
│   │   └── utils/             # food-cost.ts, ordine-auto.ts
│   ├── prisma/
│   │   └── schema.prisma
│   └── package.json
│
└── docker-compose.yml
```

---

## 8. Roadmap di Sviluppo Consigliata

### Fase 1 — Fondamenta (2–3 settimane)
1. Setup progetto (Vite + Express + PostgreSQL + Prisma)
2. Autenticazione JWT (login, ruoli: admin / operatore)
3. CRUD Ingredienti con gestione unità di misura

### Fase 2 — Menu & Food Cost (2 settimane)
4. CRUD Ricette con componenti
5. Calcolo food cost in tempo reale
6. Visualizzazione margini con grafici

### Fase 3 — Magazzino & Ordini (2–3 settimane)
7. Gestione scorte per reparto (con soglie alert)
8. Generazione automatica bozze ordine
9. Workflow ordine: bozza → inviato → consegnato

### Fase 4 — Rifinitura (1–2 settimane)
10. Storico ordini e report spese per periodo
11. Notifiche alert scorte basse
12. Export PDF ordini per i fornitori

---

## 9. Considerazioni Aggiuntive

**Ingredienti condivisi tra reparti**
Gli ingredienti sono definiti una sola volta (es. "mozzarella fior di latte") ma ogni reparto ha la propria scheda scorte indipendente. Se un ingrediente viene acquistato, la consegna aggiorna solo il reparto dell'ordine.

**Ruoli utente suggeriti**
- `ADMIN` — accesso completo, gestione fornitori e prezzi
- `CAPO_REPARTO` — gestisce ordini e scorte del proprio reparto
- `CHEF` — visualizza ricette e food cost, non può modificare prezzi

**Scalabilità futura**
- Integrazione con cassa (POS) per consumo automatico scorte
- App mobile per inventario rapido con barcode scanner
- Multi-locale (stessa catena, più sedi)
