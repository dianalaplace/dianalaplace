import { useState, useMemo } from 'react'
import { examQuestions, EXAM_SUBJECTS } from '../data/examData.js'
import { SUBJECT_COLORS } from '../data/flashcardsData.js'

export default function ExamPractice({ examResults, onAnswer }) {
  const [subject, setSubject] = useState('all')
  const [qIndex, setQIndex] = useState(0)
  const [selected, setSelected] = useState(new Set())
  const [submitted, setSubmitted] = useState(false)

  const filtered = useMemo(() => {
    return subject === 'all'
      ? examQuestions
      : examQuestions.filter(q => q.subject === subject)
  }, [subject])

  const safeIndex = Math.min(qIndex, Math.max(0, filtered.length - 1))
  const q = filtered[safeIndex]

  const correctCount = filtered.filter(q => examResults[q.id] === true).length
  const answeredCount = filtered.filter(q => examResults[q.id] !== undefined).length
  const totalPts = filtered.reduce((s, q) => s + q.points, 0)
  const earnedPts = filtered
    .filter(q => examResults[q.id] === true)
    .reduce((s, q) => s + q.points, 0)

  const handleSubject = (s) => {
    setSubject(s)
    setQIndex(0)
    setSelected(new Set())
    setSubmitted(false)
  }

  const handleSelect = (optId) => {
    if (submitted) return
    if (q.type === 'single') {
      setSelected(new Set([optId]))
    } else {
      setSelected(prev => {
        const next = new Set(prev)
        if (next.has(optId)) next.delete(optId)
        else next.add(optId)
        return next
      })
    }
  }

  const handleSubmit = () => {
    if (selected.size === 0) return
    const correctIds = new Set(q.options.filter(o => o.correct).map(o => o.id))
    const isCorrect =
      selected.size === correctIds.size &&
      [...selected].every(id => correctIds.has(id))
    onAnswer(q.id, isCorrect)
    setSubmitted(true)
  }

  const handleNext = () => {
    if (safeIndex < filtered.length - 1) setQIndex(i => i + 1)
    else setQIndex(0)
    setSelected(new Set())
    setSubmitted(false)
  }

  const handleRetry = () => {
    setSelected(new Set())
    setSubmitted(false)
  }

  const goTo = (idx) => {
    setQIndex(idx)
    setSelected(new Set())
    setSubmitted(false)
  }

  const getOptionClass = (opt) => {
    if (!submitted) return selected.has(opt.id) ? 'selected' : ''
    if (opt.correct && selected.has(opt.id)) return 'correct'
    if (!opt.correct && selected.has(opt.id)) return 'wrong'
    if (opt.correct && !selected.has(opt.id)) return 'missed'
    return ''
  }

  const getNavClass = (fq) => {
    const r = examResults[fq.id]
    if (r === undefined) return fq.id === q.id ? 'current' : ''
    return r ? 'correct-nav' : 'wrong-nav'
  }

  const subjectColor = SUBJECT_COLORS[q?.subject] || '#6366f1'

  return (
    <div>
      <div className="exam-header">
        <h1 style={{ fontSize: '1.8rem', fontWeight: 700 }}>Exam Practice</h1>
        <div className="exam-score-pill">
          <strong>{correctCount}</strong>/{filtered.length} correct &nbsp;·&nbsp;
          <strong>{earnedPts}</strong>/{totalPts} pts
          {answeredCount > 0 && (
            <> &nbsp;·&nbsp; {Math.round((correctCount / answeredCount) * 100)}% acc</>
          )}
        </div>
      </div>

      <div className="tab-bar">
        {EXAM_SUBJECTS.map(s => (
          <button
            key={s.id}
            className={`tab-btn ${subject === s.id ? 'active' : ''}`}
            onClick={() => handleSubject(s.id)}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Question Navigator */}
      <div className="q-navigator">
        <div className="section-title" style={{ marginBottom: '0.5rem' }}>
          Questions
        </div>
        <div className="q-nav-grid">
          {filtered.map((fq, i) => (
            <button
              key={fq.id}
              className={`q-nav-btn ${getNavClass(fq)} ${i === safeIndex ? 'current' : ''}`}
              onClick={() => goTo(i)}
              title={`Q${fq.id}: ${fq.points}pts`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Question Card */}
      {q && (
        <div className="question-card" style={{ borderTop: `3px solid ${subjectColor}` }}>
          <div className="question-card-top">
            <span className="question-source">{q.source}</span>
            <div className="question-badges">
              <span className="badge badge-points">{q.points} pt{q.points > 1 ? 's' : ''}</span>
              <span className={`badge ${q.type === 'multi' ? 'badge-multi' : 'badge-single'}`}>
                {q.type === 'multi' ? 'Multi-select' : 'Single'}
              </span>
            </div>
          </div>

          <div className="question-text">{q.question}</div>
          {q.type === 'multi' && (
            <div className="question-type-hint">Select all correct answers</div>
          )}

          <div className="options-list">
            {q.options.map(opt => (
              <button
                key={opt.id}
                className={`option-btn ${getOptionClass(opt)}`}
                onClick={() => handleSelect(opt.id)}
                disabled={submitted}
              >
                <span className="option-letter">{opt.id.toUpperCase()}</span>
                <span>{opt.text}</span>
              </button>
            ))}
          </div>

          {submitted && (
            <div className="explanation-panel">
              <strong>Explanation: </strong>{q.explanation}
            </div>
          )}

          <div className="exam-actions">
            {!submitted ? (
              <button
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={selected.size === 0}
              >
                Submit Answer
              </button>
            ) : (
              <>
                <button className="btn btn-ghost" onClick={handleRetry}>
                  ↺ Retry
                </button>
                <button className="btn btn-primary" onClick={handleNext}>
                  {safeIndex < filtered.length - 1 ? 'Next →' : 'Back to Start'}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
