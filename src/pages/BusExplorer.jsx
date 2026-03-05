import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import useScrollReveal from '../hooks/useScrollReveal';
import './BusExplorer.css';

const CAT_LABELS = {
  kolkata:  'Kolkata City Routes',
  suburban: 'Suburban Routes',
  ac:       'AC Bus Routes',
  district: 'District Routes',
};
const CAT_COLORS = { kolkata: '#BE123C', suburban: '#0369a1', ac: '#065f46', district: '#92400e' };

export default function BusExplorer() {
  useScrollReveal();
  const [activeTab, setActiveTab] = useState('all');
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fadeKey, setFadeKey] = useState(0); // For animating tab switches

  const fetchExplorerData = useCallback(async (cat) => {
    setLoading(true);
    setError(null);
    try {
      let fetchedData = {};
      
      if (cat === 'all') {
        const res = await fetch('/api/routes');
        if (!res.ok) throw new Error('Failed to fetch explorer data');
        const routes = await res.json();
        
        const grouped = { kolkata: [], suburban: [], ac: [], district: [] };
        routes.forEach(r => {
          if (r.type === 'city') grouped.kolkata.push(r);
          else if (grouped[r.type]) grouped[r.type].push(r);
        });
        fetchedData = grouped;
      } else {
        const typeArg = cat === 'kolkata' ? 'city' : cat;
        const res = await fetch(`/api/routes?type=${typeArg}`);
        if (!res.ok) throw new Error('Failed to fetch explorer data');
        fetchedData[cat] = await res.json();
      }
      
      setData(fetchedData);
      setFadeKey(prev => prev + 1); // Trigger re-render animation
    } catch (err) {
      if (err.name !== 'AbortError') setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExplorerData(activeTab);
  }, [activeTab, fetchExplorerData]);

  return (
    <main className="page-content">
      <div className="page-header">
        <h1>Bus Explorer</h1>
        <p>Browse bus routes by area and category – click any chip to see full details</p>
      </div>

      <img src="/images/wb-bus.png" alt="West Bengal Bus" className="explorer-hero-img" />

      <div className="explorer-intro">
        <strong>How to use:</strong> Select a category tab below to filter routes by area.
        Click any route chip to jump directly to its full details in the{' '}
        <Link to="/routes" style={{ color: 'var(--maroon)', fontWeight: 600 }}>Route Search</Link> page.
      </div>

      <div className="tab-bar">
        <button className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>🗺 All Routes</button>
        <button className={`tab-btn ${activeTab === 'kolkata' ? 'active' : ''}`} onClick={() => setActiveTab('kolkata')}>🏙 Kolkata City</button>
        <button className={`tab-btn ${activeTab === 'suburban' ? 'active' : ''}`} onClick={() => setActiveTab('suburban')}>🌆 Suburban</button>
        <button className={`tab-btn ${activeTab === 'ac' ? 'active' : ''}`} onClick={() => setActiveTab('ac')}>❄️ AC Buses</button>
        <button className={`tab-btn ${activeTab === 'district' ? 'active' : ''}`} onClick={() => setActiveTab('district')}>🗺 District</button>
      </div>

      <div id="explorer-content" key={fadeKey} style={{ animation: 'cardIn 0.3s ease-out' }}>
        {loading && <div className="no-results"><strong>Loading explorer data...</strong></div>}
        {error && <div className="no-results" style={{ color: 'red' }}><strong>{error}</strong></div>}
        
        {!loading && !error && Object.entries(data).map(([key, routes]) => {
          if (!routes || !routes.length) return null;
          const color = CAT_COLORS[key] || '#BE123C';
          
          return (
            <section key={key} style={{ marginBottom: '2rem' }}>
              <h2 className="category-title" style={{ borderLeft: `4px solid ${color}`, paddingLeft: '0.8rem', color: color }}>
                {CAT_LABELS[key]}
              </h2>
              <div className="bus-grid">
                {routes.map((r, i) => (
                  <Link 
                    to={`/route-details?route_num=${encodeURIComponent(r.num)}`}
                    key={`${r.num}-${i}`}
                    className="bus-chip"
                    style={{
                      textDecoration: 'none',
                      borderTop: `3px solid ${color}`,
                      animation: `cardIn 0.4s ease ${i * 0.05}s both`
                    }}
                  >
                    <div className="chip-num" style={{ color: color }}>{r.num}</div>
                    <div className="chip-route">{r.from} ↔ {r.to}</div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
