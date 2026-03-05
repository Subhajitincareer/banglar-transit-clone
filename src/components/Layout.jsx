import { Link, Outlet } from 'react-router-dom';
import { useState } from 'react';

export default function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="navbar" id="navbar">
        <div className="nav-container">
          <Link to="/" className="nav-logo">বাংলার<span>TRANSIT</span></Link>
          <button 
            className={`hamburger ${isMenuOpen ? 'open' : ''}`} 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <span></span><span></span><span></span>
          </button>
          <nav className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
            <Link to="/routes" className="nav-link" onClick={() => setIsMenuOpen(false)}>Search for routes</Link>
            <Link to="/trams" className="nav-link" onClick={() => setIsMenuOpen(false)}>Trams</Link>
            <Link to="/bus-explorer" className="nav-link" onClick={() => setIsMenuOpen(false)}>Bus Explorer</Link>
          </nav>
        </div>
      </header>

      <Outlet />

      <footer className="footer">
        <div className="footer-container">
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="footer-link">Go to our Facebook page</a>
          <a href="mailto:bangapopb@gmail.com" className="footer-link">Contact us at bangapopb@gmail.com</a>
        </div>
      </footer>
    </>
  );
}
