import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import useScrollReveal from '../hooks/useScrollReveal';
import './RouteDetails.css';

export default function RouteDetails() {
  useScrollReveal();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const routeNum = searchParams.get('route_num');

  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!routeNum) {
      setError('No route specified.');
      setLoading(false);
      return;
    }

    const fetchRoute = async () => {
      try {
        const res = await fetch(`/api/routes/${encodeURIComponent(routeNum)}`);
        if (!res.ok) throw new Error('Route not found');
        const data = await res.json();
        setRoute(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRoute();
  }, [routeNum]);

  const typeColors = { city: '#BE123C', suburban: '#0369a1', ac: '#065f46', district: '#92400e' };
  const color = route ? (typeColors[route.type] || '#333') : '#333';

  return (
    <>
      <header className="secondary-hero details-hero">
        <button className="back-btn" onClick={() => navigate(-1)}>&larr; Back to Routes</button>
        <div className="header-content">
          <h1 id="detail-route-num" className="animate-card">{route ? route.num : '--'}</h1>
          <p id="detail-route-name" className="animate-card" style={{ animationDelay: '0.1s' }}>
            {loading ? 'Loading route details...' : error ? 'Not Found' : `${route.from} ↔ ${route.to}`}
          </p>
          <div id="detail-route-badges" className="route-badges animate-card" style={{ animationDelay: '0.2s' }}>
            {route && (
              <>
                <span className="filter-chip active" style={{ background: color, borderColor: color, color: '#fff' }}>
                  {route.type.toUpperCase()}
                </span>
                <span className="filter-chip">Via {route.via}</span>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="page-content" style={{ backgroundColor: 'var(--cream)', padding: '4rem 1.5rem', minHeight: '60vh' }}>
        <div className="container" style={{ maxWidth: '700px', margin: '0 auto' }}>
          
          <div className="alignment-container content-block" style={{ flexDirection: 'column', display: 'flex', gap: 0 }}>
            <h2 className="alignment-title">VIA / ALIGNMENT</h2>
            <div id="alignment-list" className="alignment-list">
              
              {loading && <div className="no-results"><strong>Fetching route stops...</strong></div>}
              {error && <div className="no-results" style={{ color: 'red' }}><strong>{error}</strong></div>}
              
              {!loading && !error && route && (!route.stops || route.stops.length === 0) && (
                <div className="no-results"><strong>No stop information available.</strong></div>
              )}

              {!loading && !error && route && route.stops && route.stops.map((stop, index) => {
                const itemClass = index === 0 ? 'start' : 'regular';
                
                return (
                  <div 
                    key={`${stop}-${index}`}
                    className={`alignment-item ${itemClass}`}
                    style={{
                      opacity: 0,
                      transform: 'translateX(-15px)',
                      transition: `opacity 0.4s ease ${index * 0.1}s, transform 0.4s ease ${index * 0.1}s`,
                    }}
                    ref={(el) => {
                      if (el) {
                        setTimeout(() => {
                          el.style.opacity = '1';
                          el.style.transform = 'translateX(0)';
                        }, 50);
                      }
                    }}
                  >
                    <div className="alignment-pin"></div>
                    <div className="stop-name">{stop}</div>
                  </div>
                );
              })}

            </div>
          </div>

        </div>
      </main>
    </>
  );
}
