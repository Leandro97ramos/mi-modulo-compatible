import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// --- ESTILOS PRIMEREACT V8 (Legacy Stack) ---
// 1. Tema (puedes cambiar 'lara-light-indigo' por otro si prefieres)
import "primereact/resources/themes/lara-light-indigo/theme.css";  
// 2. Core CSS (Estructura base)
import "primereact/resources/primereact.min.css";                  
// 3. Iconos
import "primeicons/primeicons.css";                                  
// 4. PrimeFlex (Sistema de grillas v3)
import "primeflex/primeflex.css";                                    

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)