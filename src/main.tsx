import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'

// Dev preview for testing components
function App() {
  return (
    <div>
      <h1>iodine-ui</h1>
      <p>Component development preview</p>
    </div>
  )
}

createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
