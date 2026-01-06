import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'
import CreateCapsuleForm from './components/CreateCapsuleForm'
import CapsuleCard from './components/CapsuleCard'
import { Hourglass } from 'lucide-react'

function App() {
  const [capsules, setCapsules] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchCapsules = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/capsules')
      // Sort by unlock date
      const sorted = response.data.sort((a, b) => new Date(a.unlockDate) - new Date(b.unlockDate))
      setCapsules(sorted)
    } catch (error) {
      console.error("Error fetching capsules:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCapsules()
  }, [])

  return (
    <div className="app-container">
      <header>
        <h1><Hourglass size={48} style={{ verticalAlign: 'middle', marginRight: '1rem', color: 'var(--accent-color)' }} /> Time Capsule Vault</h1>
        <p style={{ fontSize: '1.2rem', color: '#aaa' }}>Send a message to the future.</p>
      </header>

      <main>
        <section className="create-section" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <CreateCapsuleForm onCapsuleCreated={fetchCapsules} />
        </section>

        <section className="list-section">
          <h2>Your Capsules</h2>
          {loading ? (
            <p>Loading timelines...</p>
          ) : capsules.length === 0 ? (
            <p style={{ fontStyle: 'italic', opacity: 0.7 }}>No capsules found. Create one above!</p>
          ) : (
            <div className="grid-container">
              {capsules.map(capsule => (
                <CapsuleCard key={capsule.id} capsule={capsule} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default App
