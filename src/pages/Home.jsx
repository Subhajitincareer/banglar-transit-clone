import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useScrollReveal from '../hooks/useScrollReveal';

const StatCard = ({ target, label, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    let triggered = false;
    const duration = 1600;

    const animateCounter = () => {
      const start = performance.now();
      const update = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.floor(eased * target));
        if (progress < 1) requestAnimationFrame(update);
      };
      requestAnimationFrame(update);
    };

    const io = new IntersectionObserver((entries) => {
      if (triggered) return;
      if (entries.some(e => e.isIntersecting)) {
        triggered = true;
        animateCounter();
        io.disconnect();
      }
    }, { threshold: 0.4 });

    if (ref.current) io.observe(ref.current);

    return () => io.disconnect();
  }, [target]);

  return (
    <div className="stat-card" ref={ref}>
      <div className="stat-number">{count}{suffix}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
};

export default function Home() {
  useScrollReveal();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState('routes');
  const [shake, setShake] = useState(false);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/routes?q=${encodeURIComponent(searchQuery.trim())}&mode=${searchMode}`);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 700);
    }
  };

  return (
    <main>
      {/* HERO SECTION */}
      <section className="hero" id="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <p className="hero-sub">YOUR OWN</p>
          <h1 className="hero-title">TRANSPORT<br /><span>GUIDE</span></h1>
          <div className="hero-badge">
            <p>Now Including</p>
            <ul>
              <li>400+ pictures</li>
              <li>700+ routes</li>
            </ul>
          </div>
        </div>
        <div className="hero-scroll-indicator">
          <div className="scroll-arrow"></div>
        </div>
      </section>

      {/* WELCOME SECTION */}
      <section className="welcome-section">
        <div className="content-block">
          <div className="content-img">
            <img src="/images/bus-terminus.png" alt="Garia Nagarik Bus Terminus" loading="lazy" />
          </div>
          <div className="content-text">
            <p>
              We welcome you to <strong>BANGLAR TRANSIT</strong>, where we aim to
              provide you a comprehensive guide on transport within the state of <strong>West Bengal</strong>.
            </p>
          </div>
        </div>

        <div className="content-block reverse">
          <div className="content-img">
            <img src="/images/hero-bg.png" alt="Esplanade Bus Terminus" loading="lazy" />
          </div>
          <div className="content-text">
            <p>
              To get started, you can either search for routes in the{' '}
              <Link to="/routes"><strong>Search for routes</strong></Link> menu
              option, or explore bus routes categorically through the{' '}
              <Link to="/bus-explorer"><strong>Bus Explorer</strong></Link> menu option.
            </p>
          </div>
        </div>

        <div className="content-block">
          <div className="content-img">
            <img src="/images/tram.png" alt="Tollygunge Tram" loading="lazy" />
          </div>
          <div className="content-text">
            <p>
              Now we have tram routes too. Just head on to the{' '}
              <Link to="/trams"><strong>Trams</strong></Link> section.
            </p>
          </div>
        </div>

        <div className="content-block reverse wide-text">
          <div className="content-text">
            <p>
              Currently most of the focus has been made towards the bus services
              in and around Kolkata. But we aim to gradually increase our coverage
              to the whole of West Bengal, and include other modes of transports,
              like autos, magics and trekkers.
            </p>
          </div>
          <div className="content-img">
            <img src="/images/wb-bus.png" alt="West Bengal Bus" loading="lazy" />
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="stats-section">
        <div className="stats-container">
          <StatCard target={700} suffix="+" label="Bus Routes" />
          <StatCard target={400} suffix="+" label="Pictures" />
          <StatCard target={3} suffix="" label="Transport Modes" />
          <StatCard target={1} suffix="" label="Complete Guide" />
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="features-section">
        <h2 className="section-title">What We Offer</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🚌</div>
            <h3>Bus Routes</h3>
            <p>Explore 700+ bus routes covering Kolkata and the surrounding areas of West Bengal. Find the right bus for your journey.</p>
            <Link to="/bus-explorer" className="feature-link">Explore Buses →</Link>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🚃</div>
            <h3>Tram Routes</h3>
            <p>Discover Kolkata's iconic heritage tram routes — one of the few remaining tram networks in Asia.</p>
            <Link to="/trams" className="feature-link">Explore Trams →</Link>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Route Search</h3>
            <p>Quickly search for a specific route by number or destination. Your journey starts here.</p>
            <Link to="/routes" className="feature-link">Search Routes →</Link>
          </div>
        </div>
      </section>

      {/* ROUTE SEARCH TEASER */}
      <section className="search-teaser">
        <div className="search-teaser-content">
          <h2>Find Your Route</h2>
          <p>Search from 700+ routes covering Kolkata and West Bengal</p>
          
          <div className="search-modes">
            <label className="search-mode-label">
              <input 
                type="radio" 
                name="teaser_search_mode" 
                value="routes" 
                checked={searchMode === 'routes'} 
                onChange={(e) => setSearchMode(e.target.value)} 
              />
              <span className="custom-radio"></span>
              Routes
            </label>
            <label className="search-mode-label">
              <input 
                type="radio" 
                name="teaser_search_mode" 
                value="places" 
                checked={searchMode === 'places'} 
                onChange={(e) => setSearchMode(e.target.value)} 
              />
              <span className="custom-radio"></span>
              Places
            </label>
          </div>

          <div className="search-box">
            <input
              type="text"
              placeholder={shake ? "Please enter a route or destination!" : "Enter route number or destination..."}
              aria-label="Search routes"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className={shake ? 'input-shake' : ''}
            />
            <button onClick={handleSearch}>Search</button>
          </div>
        </div>
      </section>
    </main>
  );
}
