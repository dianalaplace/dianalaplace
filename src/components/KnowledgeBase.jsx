import { useState, useMemo } from 'react'
import { knowledgeBase } from '../data/knowledgeBaseData.js'
import { SUBJECT_COLORS, SUBJECT_LABELS } from '../data/flashcardsData.js'

const KB_SUBJECTS = [
  { id: 'all', label: 'All' },
  { id: 'Algorithms', label: '⚡ Algorithms' },
  { id: 'ML', label: '🤖 ML / PyTorch' },
  { id: 'Math1', label: '∑ Mathematics 1' },
  { id: 'Math2', label: '∫ Mathematics 2' },
  { id: 'Statistics', label: '📊 Statistics' },
]

export default function KnowledgeBase() {
  const [subject, setSubject] = useState('all')
  const [search, setSearch] = useState('')
  const [openIds, setOpenIds] = useState(new Set())

  const filtered = useMemo(() => {
    let list = subject === 'all' ? knowledgeBase : knowledgeBase.filter(k => k.subject === subject)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(k =>
        k.title.toLowerCase().includes(q) ||
        k.content.toLowerCase().includes(q)
      )
    }
    return list
  }, [subject, search])

  const toggle = (id) => {
    setOpenIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div>
      <div className="dashboard-header">
        <h1>Knowledge Base</h1>
        <p>Quick-reference cards for formulas, definitions, and key concepts.</p>
      </div>

      <div className="tab-bar">
        {KB_SUBJECTS.map(s => (
          <button
            key={s.id}
            className={`tab-btn ${subject === s.id ? 'active' : ''}`}
            onClick={() => setSubject(s.id)}
          >
            {s.label}
          </button>
        ))}
      </div>

      <input
        className="search-input"
        placeholder="Search topics, formulas, concepts..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <div>No results found.</div>
        </div>
      ) : (
        <div className="kb-grid">
          {filtered.map(item => {
            const isOpen = openIds.has(item.id)
            const color = SUBJECT_COLORS[item.subject] || '#6366f1'
            return (
              <div key={item.id} className={`kb-card ${isOpen ? 'open' : ''}`}>
                <div className="kb-card-header" onClick={() => toggle(item.id)}>
                  <div className="kb-header-left">
                    <div className="kb-subject-dot" style={{ background: color }} />
                    <span className="kb-title">{item.title}</span>
                  </div>
                  <span className="kb-chevron">▼</span>
                </div>
                {isOpen && (
                  <div className="kb-body">
                    {item.content}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
