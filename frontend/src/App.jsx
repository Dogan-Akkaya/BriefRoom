import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Toast from './components/Toast'
import Landing from './routes/Landing'
import Builder from './routes/Builder'

export default function App() {
  return (
    <div style={{ minHeight: '100vh', background: '#0A0E1A', color: '#E8ECF1', fontFamily: "'Satoshi','DM Sans',sans-serif", position: 'relative' }}>
      <Toast />
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/builder" element={<Builder />} />
        <Route path="/builder/:categoryId" element={<Builder />} />
      </Routes>
    </div>
  )
}
