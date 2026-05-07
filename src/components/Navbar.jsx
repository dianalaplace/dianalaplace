export default function Navbar({ page, setPage }) {
  const links = [
    { id: 'dashboard', label: 'Dashboard', icon: '⊞' },
    { id: 'flashcards', label: 'Flashcards', icon: '⟷' },
    { id: 'exam', label: 'Exam Practice', icon: '✎' },
    { id: 'kb', label: 'Knowledge Base', icon: '⊟' },
  ]

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="navbar-brand">Exam<span>Prep</span></div>
        <ul className="navbar-links">
          {links.map(l => (
            <li key={l.id}>
              <a
                className={page === l.id ? 'active' : ''}
                onClick={() => setPage(l.id)}
              >
                {l.icon} <span className="nav-label">{l.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
