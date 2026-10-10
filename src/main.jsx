import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import I18nProvider from './i18n/I18nProvider.jsx'
import { LazyMotion, MotionConfig } from 'framer-motion'

const loadMotionFeatures = () => import('./motionFeatures.js').then(mod => mod.default)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <I18nProvider>
      <LazyMotion features={loadMotionFeatures} strict>
        <MotionConfig reducedMotion="user">
          <App />
        </MotionConfig>
      </LazyMotion>
    </I18nProvider>
  </StrictMode>,
)
