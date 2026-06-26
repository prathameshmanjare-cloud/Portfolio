import { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import styles from './Navbar.module.css';

const NAV_LINKS = ['Home', 'Work', 'Skills', 'About', 'Contact'];

export default function Navbar() {
  const navRef = useRef(null);
  const itemsRef = useRef([]);
  const [active, setActive] = useState('Home');
  const [scrolled, setScrolled] = useState(false);

  useGSAP(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;
    gsap.from(itemsRef.current, {
      y: -20,
      opacity: 0,
      stagger: 0.08,
      duration: 0.7,
      ease: 'power3.out',
      delay: 2.4,
    });
  }, { scope: navRef });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });

    const sections = NAV_LINKS.map((l) =>
      document.getElementById(l.toLowerCase() === 'home' ? 'hero' : l.toLowerCase())
    ).filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            const label = id === 'hero' ? 'Home' : id.charAt(0).toUpperCase() + id.slice(1);
            setActive(label);
          }
        });
      },
      { threshold: 0.4 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id === 'home' ? 'hero' : id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav ref={navRef} className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        <a className={styles.logo} href="#hero" onClick={(e) => { e.preventDefault(); scrollTo('hero'); }}>
          PM
        </a>
        <ul className={styles.links}>
          {NAV_LINKS.map((link, i) => (
            <li key={link} ref={(el) => (itemsRef.current[i] = el)}>
              <a
                href={`#${link.toLowerCase() === 'home' ? 'hero' : link.toLowerCase()}`}
                className={`${styles.link} ${active === link ? styles.active : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo(link.toLowerCase());
                }}
              >
                {link}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
