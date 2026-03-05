import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import useScrollReveal from '../hooks/useScrollReveal';
import './RoutesPage.css';

const TYPE_COLORS = { city: '#BE123C', suburban: '#0369a1', ac: '#065f46', district: '#92400e' };
const TYPE_LABELS = { city: 'City', suburban: 'Suburban', ac: 'AC', district: 'District' };

export default function RoutesPage() {
  useScrollReveal();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialMode = searchParams.get('mode') || 'routes';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [activeType, setActiveType] = useState('all');
  const [searchMode, setSearchMode] = useState(initialMode);
  
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRoutes = useCallback(async (query, type) => {
    setLoading(true);
    setError(null);
    try {
      const p = new URLSearchParams();
      if (query) p.append('q', query.trim());
      if (type && type !== 'all') p.append('type', type);
      
      const res = await fetch(`/api/routes?${p.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch routes');
      const data = await res.json();
      setRoutes(data);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchRoutes(searchQuery, activeType);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, activeType, fetchRoutes]);

  const handleTypeChange = (type) => {
    setActiveType(type);
    setSearchQuery(''); // Reset search when clicking category
  };

  return (
    <main className="page-content">
      <div className="page-header">
        <h1>Search for Routes</h1>
        <p>Find your bus route from 700+ routes across Kolkata &amp; West Bengal</p>
      </div>

      <div className="search-modes" style={{ maxWidth: '820px', margin: '0 auto 1.5rem' }}>
        <label className="search-mode-label">
          <input 
            type="radio" 
            name="search_mode" 
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
            name="search_mode" 
            value="places" 
            checked={searchMode === 'places'}
            onChange={(e) => setSearchMode(e.target.value)}
          />
          <span className="custom-radio"></span>
          Places
        </label>
      </div>

      <div className="route-search-wrap" style={{ maxWidth: '820px', margin: '0 auto 1.2rem' }}>
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Route number, from or destination (e.g. 30A, Howrah)…"
          aria-label="Search routes" 
          autoComplete="off" 
        />
        <button onClick={() => fetchRoutes(searchQuery, activeType)}>Search</button>
      </div>

      <div className="filter-bar">
        <button className={`filter-chip ${activeType === 'all' ? 'active' : ''}`} data-type="all" onClick={() => handleTypeChange('all')}>All</button>
        <button className={`filter-chip ${activeType === 'city' ? 'active' : ''}`} data-type="city" onClick={() => handleTypeChange('city')}>🏙 City</button>
        <button className={`filter-chip ${activeType === 'suburban' ? 'active' : ''}`} data-type="suburban" onClick={() => handleTypeChange('suburban')}>🌆 Suburban</button>
        <button className={`filter-chip ${activeType === 'ac' ? 'active' : ''}`} data-type="ac" onClick={() => handleTypeChange('ac')}>❄️ AC Buses</button>
        <button className={`filter-chip ${activeType === 'district' ? 'active' : ''}`} data-type="district" onClick={() => handleTypeChange('district')}>🗺 District</button>
      </div>

      {loading && !error && (
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div className="no-results"><strong>Loading routes...</strong></div>
        </div>
      )}

      {error && !loading && (
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div className="no-results" style={{ color: 'red' }}><strong>{error}</strong></div>
        </div>
      )}

      {!loading && !error && (
        <>
          <p className="result-meta">{routes.length} route{routes.length !== 1 && 's'} found</p>
          <div className="route-list" style={{ maxWidth: '820px', margin: '0 auto' }}>
            {routes.length === 0 ? (
              <div className="no-results">
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                <strong>No routes found</strong>
                <p>Try searching by route number (e.g. "30A"), origin, or destination (e.g. "Howrah").</p>
              </div>
            ) : (
              routes.map((r, i) => {
                const color = TYPE_COLORS[r.type] || '#BE123C';
                const label = TYPE_LABELS[r.type] || '';
                return (
                  <Link 
                    to={`/route-details?route_num=${encodeURIComponent(r.num)}`} 
                    key={`${r.num}-${i}`}
                    className="route-card card-animate" 
                    style={{ textDecoration: 'none', color: 'inherit', display: 'flex', animationDelay: `${i * 0.04}s` }}
                  >
                    <div className="route-num" style={{ background: color }}>{r.num}</div>
                    <div className="route-info">
                      <strong>{r.from} ↔ {r.to}</strong>
                      <span>{r.via}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="route-type-badge" style={{
                        background: `${color}20`,
                        color: color,
                        border: `1px solid ${color}40`,
                        fontSize: '0.72rem',
                        padding: '2px 8px',
                        borderRadius: '20px',
                        fontWeight: '600',
                        whiteSpace: 'nowrap'
                      }}>{label}</span>
                      <div className="route-arrow" style={{ color: color }}>›</div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </>
      )}
    </main>
  );
}
