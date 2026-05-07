import { useState, useMemo } from 'react'
import { flashcards, SUBJECTS, SUBJECT_COLORS } from '../data/flashcardsData.js'

export default function Flashcards({ knownIds, reviewIds, onKnown, onReview }) {
  const [subject, setSubject] = useState('all')
  const [search, setSearch] = useState('')
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)

  const filtered = useMemo(() => {
    let list = subject === 'all' ? flashcards : flashcards.filter(c => c.subject === subject)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(c =>
        c.question.toLowerCase().includes(q) ||
        c.answer.toLowerCase().includes(q) ||
        c.topic.toLowerCase().includes(q)
      )
    }
    return list
  }, [subject, search])

  const safeIndex = Math.min(index, Math.max(0, filtered.length - 1))
  const card = filtered[safeIndex]

  const handleSubject = (s) => {
    setSubject(s)
    setIndex(0)
    setFlipped(false)
  }

  const handleSearch = (e) => {
    setSearch(e.target.value)
    setIndex(0)
    setFlipped(false)
  }

  const go = (dir) => {
    setIndex(i => Math.max(0, Math.min(filtered.length - 1, i + dir)))
    setFlipped(false)
  }

  const handleKnown = () => { onKnown(card.id); advance() }
  const handleReview = () => { onReview(card.id); advance() }

  const advance = () => {
    if (safeIndex < filtered.length - 1) {
      setIndex(i => i + 1)
    }
    setFlipped(false)
  }

  const subjectColor = card ? SUBJECT_COLORS[card.subject] : '#6366f1'

  return (
    <div>
      <div className="dashboard-header">
        <h1>Flashcards</h1>
        <p>Click a card to reveal the answer. Rate yourself to track progress.</p>
      </div>

      <div className="tab-bar">
        {SUBJECTS.map(s => (
          <button
            key={s.id}
            className={`tab-btn ${subject === s.id ? 'active' : ''}`}
            onClick={() => handleSubject(s.id)}
          >
            {s.label}
          </button>
        ))}
      </div>

      <input
        className="search-input"
        placeholder="Search by topic or content..."
        value={search}
        onChange={handleSearch}
      />

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <div>No cards match your search.</div>
        </div>
      ) : (
        <div className="flashcard-wrapper">
          <div className="flashcard-meta">
            <span className="flashcard-counter">
              Card {safeIndex + 1} of {filtered.length}
            </span>
            <span
              className="flashcard-topic"
              style={{ borderLeft: `3px solid ${subjectColor}` }}
            >
              {card.topic}
            </span>
          </div>

          <div
            className={`flashcard-scene ${flipped ? 'flipped' : ''}`}
            onClick={() => setFlipped(f => !f)}
          >
            <div className="flashcard-inner">
              <div className="flashcard-face flashcard-front">
                <div className="face-label">Question</div>
                <div className="face-text">{card.question}</div>
                {!flipped && (
                  <div className="flip-hint">↕ click to reveal answer</div>
                )}
              </div>
              <div className="flashcard-face flashcard-back">
                <div className="face-label">Answer</div>
                <div className="face-text">{card.answer}</div>
              </div>
            </div>
          </div>

          {flipped && (
            <div className="card-actions">
              <button className="btn btn-success" onClick={handleKnown}>
                Got it ✓
              </button>
              <button className="btn btn-danger" onClick={handleReview}>
                Review again ✗
              </button>
            </div>
          )}

          <div className="card-nav">
            <button
              className="btn btn-ghost"
              disabled={safeIndex === 0}
              onClick={() => go(-1)}
            >
              ← Prev
            </button>
            <button
              className="btn btn-ghost"
              disabled={safeIndex === filtered.length - 1}
              onClick={() => go(1)}
            >
              Next →
            </button>
          </div>

          <div className="flashcard-progress-row">
            <span>Known: <span className="known">{knownIds.size}</span></span>
            <span>To review: <span className="review">{reviewIds.size}</span></span>
            <span style={{ color: 'var(--text-dim)' }}>
              Total: {flashcards.length}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
