import { useEffect } from 'react';

export default function useScrollReveal() {
  useEffect(() => {
    const targets = document.querySelectorAll('.content-block, .feature-card, .stat-card, .search-teaser-content, .tram-info-box, .route-card, .bus-chip');
    
    targets.forEach((el, i) => {
      // Avoid applying if already observed/revealed
      if (el.style.opacity === '1') return;
      el.style.opacity = '0';
      el.style.transform = 'translateY(36px)';
      el.style.transition = `opacity 0.65s ease ${i % 4 * 0.1}s, transform 0.65s ease ${i % 4 * 0.1}s`;
    });

    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    targets.forEach(el => io.observe(el));

    return () => io.disconnect();
  }, []);
}
