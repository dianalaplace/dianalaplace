import { flashcards, SUBJECT_COLORS, SUBJECT_LABELS } from '../data/flashcardsData.js'
import { examQuestions } from '../data/examData.js'

const SUBJECTS = ['Algorithms', 'ML', 'Math1', 'Math2', 'Statistics']

export default function Dashboard({ knownIds, reviewIds, examResults, setPage }) {
  const totalCards = flashcards.length
  const knownCount = knownIds.size
  const totalExam = examQuestions.length
  const correctCount = Object.values(examResults).filter(Boolean).length

  const topicsCovered = new Set(flashcards.filter(c => knownIds.has(c.id)).map(c => c.topic)).size

  const getStreakDays = () => {
    const raw = localStorage.getItem('streak_data')
    if (!raw) return 0
    const { lastDate, streak } = JSON.parse(raw)
    const today = new Date().toDateString()
    return lastDate === today ? streak : 0
  }

  const subjectProgress = SUBJECTS.map(subj => {
    const cards = flashcards.filter(c => c.subject === subj)
    const known = cards.filter(c => knownIds.has(c.id)).length
    return {
      subj,
      label: SUBJECT_LABELS[subj],
      color: SUBJECT_COLORS[subj],
      pct: cards.length ? Math.round((known / cards.length) * 100) : 0,
      known,
      total: cards.length,
    }
  })

  const stats = [
    { icon: '🗂', value: `${knownCount}/${totalCards}`, label: 'Flashcards Known' },
    { icon: '✓', value: `${correctCount}/${totalExam}`, label: 'Exam Correct' },
    { icon: '📚', value: topicsCovered, label: 'Topics Covered' },
    { icon: '🔥', value: getStreakDays(), label: 'Streak Days' },
  ]

  const navCards = [
    {
      id: 'flashcards',
      icon: '🃏',
      title: 'Flashcards',
      desc: `${totalCards} cards across 5 subjects. Flip, rate yourself, track progress.`,
    },
    {
      id: 'exam',
      icon: '📝',
      title: 'Exam Practice',
      desc: `${totalExam} real exam questions with explanations and score tracking.`,
    },
    {
      id: 'kb',
      icon: '📖',
      title: 'Knowledge Base',
      desc: 'Compact reference cards for formulas, algorithms, and key concepts.',
    },
  ]

  return (
    <div>
      <div className="dashboard-header">
        <h1>Welcome back 👋</h1>
        <p>Track your study progress across all subjects below.</p>
      </div>

      <div className="stat-grid">
        {stats.map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="nav-cards">
        {navCards.map(c => (
          <div key={c.id} className="nav-card" onClick={() => setPage(c.id)}>
            <div className="nav-card-icon">{c.icon}</div>
            <h3>{c.title}</h3>
            <p>{c.desc}</p>
          </div>
        ))}
      </div>

      <div className="section-title">Subject Breakdown</div>
      <div className="subject-breakdown">
        {subjectProgress.map(s => (
          <div key={s.subj} className="subject-row">
            <div className="subject-name">{s.label}</div>
            <div className="progress-bar-track">
              <div
                className="progress-bar-fill"
                style={{ width: `${s.pct}%`, background: s.color }}
              />
            </div>
            <div className="pct">{s.pct}%</div>
          </div>
        ))}
      </div>
    </div>
  )
}
