import { useState, useEffect } from 'react';
import useScrollReveal from '../hooks/useScrollReveal';
import './Trams.css';

export default function Trams() {
  useScrollReveal();
  const [trams, setTrams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrams = async () => {
      try {
        const res = await fetch('/api/trams');
        if (!res.ok) throw new Error('Failed to fetch tram routes');
        const data = await res.json();
        setTrams(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrams();
  }, []);

  return (
    <main className="page-content">
      <div className="page-header tram-page-header">
        <h1>🚃 Trams</h1>
        <p>Kolkata's iconic heritage trams — one of Asia's last surviving tram networks</p>
      </div>

      <img src="/images/tram.png" alt="Kolkata Tram" className="tram-hero-img" />

      <div className="tram-info-box">
        <p>
          Kolkata has one of the oldest tram networks in Asia, operated by the{' '}
          <strong>Calcutta Tramways Company (CTC)</strong>. These heritage trams are a
          beloved part of the city's identity, concentrated in Kolkata's central areas.
          They run at a leisurely pace, offering a unique glimpse into the city's colonial past.
        </p>
      </div>

      <h2 className="tram-section-title">Active Tram Routes</h2>

      <div className="route-list" style={{ maxWidth: '820px', margin: '0 auto' }}>
        {loading && <div className="no-results"><strong>Loading tram routes...</strong></div>}
        {error && <div className="no-results" style={{ color: 'red' }}><strong>{error}</strong></div>}
        
        {!loading && !error && trams.length > 0 && trams.map((t, i) => (
          <div 
            key={`${t.num}-${i}`}
            className="route-card tram-card"
            style={{
              opacity: 0,
              transform: 'translateY(30px)',
              transition: `opacity 0.5s ease ${i * 0.08}s, transform 0.5s ease ${i * 0.08}s`,
            }}
            ref={(el) => {
              if (el) {
                // Inline reveal logic for trams
                setTimeout(() => {
                  el.style.opacity = '1';
                  el.style.transform = 'translateY(0)';
                }, 50);
              }
            }}
          >
            <div className="route-num tram-num">{t.num}</div>
            <div className="route-info">
              <strong>{t.from} ↔ {t.to}</strong>
              <span>{t.via}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '3px' }}>
              <span style={{ fontSize: '0.75rem', background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '20px', fontWeight: '600' }}>
                🕐 {t.freq}
              </span>
              <div className="route-arrow" style={{ color: '#15803d' }}>›</div>
            </div>
          </div>
        ))}
      </div>

      <div className="tram-info-box" style={{ marginTop: '2rem' }}>
        <strong>🕐 Operating Hours:</strong> Approximately <strong>6:00 AM – 10:30 PM</strong>.
        Frequent intervals during peak hours (8–10 AM, 5–8 PM).<br/>
        <strong>💳 Fare:</strong> Starting from ₹7. Concessional passes available for students and seniors.<br/>
        <strong>📍 Note:</strong> For the most accurate schedule, check the nearest tram stop or
        contact the Calcutta Tramways Company.
      </div>
    </main>
  );
}
