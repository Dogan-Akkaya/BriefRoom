import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Toast from './components/Toast'
import Landing from './routes/Landing'
import Builder from './routes/Builder'
import Popular from './routes/Popular'
import Methodology from './routes/Methodology'
import StaticPage from './routes/StaticPage'
import Reports from './routes/Reports'
import ReportDetail from './routes/ReportDetail'
import Explore from './routes/Explore'
import WizardScreen1 from './components/explore/WizardScreen1'
import WizardScreen2 from './components/explore/WizardScreen2'
import UnderConstructionWall from './components/UnderConstructionWall'

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null } }
  static getDerivedStateFromError(error) { return { error } }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 40, color: '#FF4562', background: '#0A0E1A', minHeight: '100vh', fontFamily: 'monospace' }}>
          <h1>Runtime Error</h1>
          <pre style={{ whiteSpace: 'pre-wrap', marginTop: 20, color: '#E8ECF1' }}>{this.state.error.message}</pre>
          <pre style={{ whiteSpace: 'pre-wrap', marginTop: 10, color: 'rgba(232,236,241,0.4)', fontSize: 12 }}>{this.state.error.stack}</pre>
        </div>
      )
    }
    return this.props.children
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <div style={{ minHeight: '100vh', background: '#0A0E1A', color: '#E8ECF1', fontFamily: "'Satoshi','DM Sans',sans-serif", position: 'relative' }}>
        <Toast />
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          {/* Custom Builder wizard — walled in v1 */}
          <Route path="/explore" element={
            <UnderConstructionWall title="Custom Builder is in progress">
              <Explore />
            </UnderConstructionWall>
          }>
            <Route index element={<WizardScreen1 />} />
            <Route path=":dim/:value" element={<WizardScreen2 />} />
            <Route path=":dim/:value/:dim2/:value2" element={<WizardScreen2 />} />
          </Route>
          {/* Legacy /builder (no id) redirects into the wizard */}
          <Route path="/builder" element={<Navigate to="/explore" replace />} />
          {/* Per-category Builder — walled in v1 */}
          <Route path="/builder/:categoryId" element={
            <UnderConstructionWall title="Custom Builder is in progress">
              <Builder />
            </UnderConstructionWall>
          } />
          {/* Popular Charts — walled in v1 */}
          <Route path="/popular" element={
            <UnderConstructionWall title="Popular Charts is in progress">
              <Popular />
            </UnderConstructionWall>
          } />
          <Route path="/methodology" element={<Methodology />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/reports/:reportId" element={<ReportDetail />} />
          <Route path="/page/:slug" element={<StaticPage />} />
        </Routes>
      </div>
    </ErrorBoundary>
  )
}
