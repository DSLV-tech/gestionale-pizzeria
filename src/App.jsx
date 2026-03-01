import { useState, Fragment } from 'react'
import GestionalePizzeria from './components/GestionaleDaMarcolino.jsx'
import CalcolatorePallina from './components/CalcolatorePallina.jsx'

const MODULES = [
    { key: 'gestionale', label: 'Gestionale', icon: '🍕' },
    { key: 'calcolatore', label: 'Calcolatore Pallina', icon: '⚖️' },
]

export default function App() {
    const [activeModule, setActiveModule] = useState('gestionale')

    return (
        <div>
            {/* ── Barra di navigazione tra i moduli ── */}
            <nav className="app-nav">
                {MODULES.map((m, i) => (
                    <Fragment key={m.key}>
                        {i > 0 && <div className="app-nav-divider" />}
                        <button
                            className={`app-nav-btn${activeModule === m.key ? ' active' : ''}`}
                            onClick={() => setActiveModule(m.key)}
                        >
                            <span className="nav-icon">{m.icon}</span>
                            {m.label}
                        </button>
                    </Fragment>
                ))}
            </nav>

            {/* ── Modulo attivo ── */}
            {activeModule === 'gestionale' && <GestionalePizzeria />}
            {activeModule === 'calcolatore' && <CalcolatorePallina />}
        </div>
    )
}
