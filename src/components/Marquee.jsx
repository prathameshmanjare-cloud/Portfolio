import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import styles from './Marquee.module.css';

const ITEMS = [
  'ReactJS', 'Node.js', 'Python', 'FastAPI', 'Java',
  'MySQL', 'REST APIs', 'JWT', 'OOP', 'Git',
  'HTML & CSS', 'Postman', 'Vercel', 'LMS', 'SQL',
];

export default function Marquee() {
  const trackRef = useRef(null);

  useGSAP(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const track = trackRef.current;
    if (!track) return;
    const totalWidth = track.scrollWidth / 2;

    gsap.to(track, {
      x: -totalWidth,
      duration: 30,
      ease: 'none',
      repeat: -1,
    });
  });

  const doubled = [...ITEMS, ...ITEMS];

  return (
    <div className={styles.wrapper}>
      <div className={styles.mask}>
        <div ref={trackRef} className={styles.track}>
          {doubled.map((item, i) => (
            <span key={i} className={styles.item}>
              <span className={styles.dot}>·</span>
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
