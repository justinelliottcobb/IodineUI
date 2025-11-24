import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PlasmaButton, FireButton, VortexButton, ShaderButton } from './index'
import './style.css'

function App() {
  return (
    <div className="preview">
      <h1>iodine-ui</h1>
      <p>Shader-powered React components</p>

      <section>
        <h2>Shader Buttons</h2>
        <div className="button-grid">
          <div className="button-demo">
            <PlasmaButton onClick={() => console.log('Plasma!')}>
              Plasma
            </PlasmaButton>
            <code>PlasmaButton</code>
          </div>

          <div className="button-demo">
            <FireButton onClick={() => console.log('Fire!')}>
              Fire
            </FireButton>
            <code>FireButton</code>
          </div>

          <div className="button-demo">
            <VortexButton onClick={() => console.log('Vortex!')}>
              Vortex
            </VortexButton>
            <code>VortexButton</code>
          </div>
        </div>
      </section>

      <section>
        <h2>Intensity Control</h2>
        <div className="button-grid">
          <div className="button-demo">
            <ShaderButton variant="plasma" intensity={0.3}>
              Low
            </ShaderButton>
            <code>intensity={0.3}</code>
          </div>

          <div className="button-demo">
            <ShaderButton variant="plasma" intensity={0.7}>
              Medium
            </ShaderButton>
            <code>intensity={0.7}</code>
          </div>

          <div className="button-demo">
            <ShaderButton variant="plasma" intensity={1.0}>
              High
            </ShaderButton>
            <code>intensity={1.0}</code>
          </div>
        </div>
      </section>

      <section>
        <h2>States</h2>
        <div className="button-grid">
          <div className="button-demo">
            <FireButton disabled>Disabled</FireButton>
            <code>disabled</code>
          </div>
        </div>
      </section>
    </div>
  )
}

createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
