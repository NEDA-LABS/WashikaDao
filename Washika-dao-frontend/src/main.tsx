import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './styles/index.css'
import './styles/headerFooter.css'
import './styles/homepage.css'
import './styles/DaoRegistration.css'
import './styles/DaoProfile.css'
import './styles/CreateProposal.css'
import './styles/ViewProposal.css'
import './styles/JoinPlatform.css'
import './styles/JifunzeElimu.css'
import './styles/Owner.css'
import './styles/Funder.css'
import './styles/responsive.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
