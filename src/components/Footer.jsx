import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import styles from './Footer.module.css';

export default function Footer() {
  const btnRef = useRef(null);

  useGSAP(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;
    gsap.from(btnRef.current, {
      scrollTrigger: { trigger: btnRef.current, start: 'top 95%' },
      opacity: 0,
      y: 20,
      duration: 0.5,
      ease: 'power2.out',
    });
  });

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <span className={styles.copy}>
          Designed &amp; Built by{' '}
          <span className={styles.name}>Prathamesh Manjare</span>
          {' '}· 2026
        </span>
        <button ref={btnRef} className={styles.backTop} onClick={scrollTop} aria-label="Back to top">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 19V5M5 12L12 5L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to top
        </button>
      </div>
    </footer>
  );
}
