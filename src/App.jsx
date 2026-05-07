import { useState, useEffect } from 'react'
import Navbar from './components/Navbar.jsx'
import Dashboard from './components/Dashboard.jsx'
import Flashcards from './components/Flashcards.jsx'
import ExamPractice from './components/ExamPractice.jsx'
import KnowledgeBase from './components/KnowledgeBase.jsx'

// ── localStorage helpers ──────────────────────────────────────────────────────
const loadSet = (key) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch { return new Set() }
}

const saveSet = (key, set) => {
  localStorage.setItem(key, JSON.stringify([...set]))
}

const loadObj = (key) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : {}
  } catch { return {} }
}

// ── Streak tracking ───────────────────────────────────────────────────────────
const updateStreak = () => {
  const today = new Date().toDateString()
  const raw = localStorage.getItem('streak_data')
  if (!raw) {
    localStorage.setItem('streak_data', JSON.stringify({ lastDate: today, streak: 1 }))
    return
  }
  const data = JSON.parse(raw)
  if (data.lastDate === today) return
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const newStreak = data.lastDate === yesterday.toDateString() ? data.streak + 1 : 1
  localStorage.setItem('streak_data', JSON.stringify({ lastDate: today, streak: newStreak }))
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState('dashboard')
  const [knownIds, setKnownIds] = useState(() => loadSet('flashcard_known'))
  const [reviewIds, setReviewIds] = useState(() => loadSet('flashcard_review'))
  const [examResults, setExamResults] = useState(() => loadObj('exam_results'))

  useEffect(() => { updateStreak() }, [])

  const handleKnown = (id) => {
    const next = new Set(knownIds)
    next.add(id)
    const rev = new Set(reviewIds)
    rev.delete(id)
    setKnownIds(next)
    setReviewIds(rev)
    saveSet('flashcard_known', next)
    saveSet('flashcard_review', rev)
  }

  const handleReview = (id) => {
    const rev = new Set(reviewIds)
    rev.add(id)
    const known = new Set(knownIds)
    known.delete(id)
    setReviewIds(rev)
    setKnownIds(known)
    saveSet('flashcard_review', rev)
    saveSet('flashcard_known', known)
  }

  const handleAnswer = (qId, isCorrect) => {
    const next = { ...examResults, [qId]: isCorrect }
    setExamResults(next)
    localStorage.setItem('exam_results', JSON.stringify(next))
  }

  const pageProps = { knownIds, reviewIds, examResults, setPage }

  return (
    <div className="app">
      <Navbar page={page} setPage={setPage} />
      <main className="page-content">
        {page === 'dashboard' && (
          <Dashboard
            knownIds={knownIds}
            reviewIds={reviewIds}
            examResults={examResults}
            setPage={setPage}
          />
        )}
        {page === 'flashcards' && (
          <Flashcards
            knownIds={knownIds}
            reviewIds={reviewIds}
            onKnown={handleKnown}
            onReview={handleReview}
          />
        )}
        {page === 'exam' && (
          <ExamPractice
            examResults={examResults}
            onAnswer={handleAnswer}
          />
        )}
        {page === 'kb' && <KnowledgeBase />}
      </main>
    </div>
  )
}
