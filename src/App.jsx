import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Toast from './components/Toast'
import Home from './routes/Home'
import Builder from './routes/Builder'

export default function App() {
  return (
    <div className="font-[var(--font-sans)] bg-[var(--color-bg)] text-[var(--color-text-1)] min-h-screen flex items-center justify-center p-5">
      <div className="flex min-h-[780px] max-w-[1100px] w-full rounded-[10px] overflow-hidden border border-[var(--color-border)] relative">
        <Toast />
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-[var(--color-bg)]">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/builder" element={<Builder />} />
            <Route path="/builder/:topicSlug" element={<Builder />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
