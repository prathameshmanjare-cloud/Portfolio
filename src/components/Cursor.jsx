import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from './Cursor.module.css';

export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || window.matchMedia('(pointer: coarse)').matches) return;

    const moveDot = gsap.quickTo(dotRef.current, 'x', { duration: 0.1, ease: 'none' });
    const moveDotY = gsap.quickTo(dotRef.current, 'y', { duration: 0.1, ease: 'none' });
    const moveRing = gsap.quickTo(ringRef.current, 'x', { duration: 0.45, ease: 'power3.out' });
    const moveRingY = gsap.quickTo(ringRef.current, 'y', { duration: 0.45, ease: 'power3.out' });

    const onMove = (e) => {
      moveDot(e.clientX);
      moveDotY(e.clientY);
      moveRing(e.clientX);
      moveRingY(e.clientY);
    };

    const onEnterInteractive = () => {
      gsap.to(ringRef.current, { scale: 1.8, borderColor: 'var(--accent-cyan)', duration: 0.25 });
      gsap.to(dotRef.current, { scale: 0, duration: 0.25 });
    };

    const onLeaveInteractive = () => {
      gsap.to(ringRef.current, { scale: 1, borderColor: 'var(--accent-violet)', duration: 0.25 });
      gsap.to(dotRef.current, { scale: 1, duration: 0.25 });
    };

    window.addEventListener('mousemove', onMove);

    const interactives = document.querySelectorAll('a, button, input, textarea, [role="button"]');
    interactives.forEach((el) => {
      el.addEventListener('mouseenter', onEnterInteractive);
      el.addEventListener('mouseleave', onLeaveInteractive);
    });

    // Use MutationObserver to catch dynamically added elements
    const observer = new MutationObserver(() => {
      const els = document.querySelectorAll('a, button, input, textarea, [role="button"]');
      els.forEach((el) => {
        el.removeEventListener('mouseenter', onEnterInteractive);
        el.removeEventListener('mouseleave', onLeaveInteractive);
        el.addEventListener('mouseenter', onEnterInteractive);
        el.addEventListener('mouseleave', onLeaveInteractive);
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', onMove);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className={styles.dot} />
      <div ref={ringRef} className={styles.ring} />
    </>
  );
}
