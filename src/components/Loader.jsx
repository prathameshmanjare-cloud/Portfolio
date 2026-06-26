import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from './Loader.module.css';

export default function Loader({ onComplete }) {
  const loaderRef = useRef(null);
  const countRef = useRef(null);
  const barRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      onComplete();
      return;
    }

    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      onComplete();
    };

    const obj = { val: 0 };
    const tl = gsap.timeline();

    tl.to(obj, {
      val: 100,
      duration: 1.8,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (countRef.current) countRef.current.textContent = Math.round(obj.val);
        if (barRef.current) barRef.current.style.width = obj.val + '%';
      },
    }).to(loaderRef.current, {
      yPercent: -100,
      duration: 0.8,
      ease: 'power4.inOut',
      onComplete: finish,
    });

    return () => tl.kill();
  }, [onComplete]);

  return (
    <div ref={loaderRef} className={styles.loader}>
      <div ref={overlayRef} className={styles.overlay} />
      <div className={styles.content}>
        <span className={styles.label}>Loading</span>
        <div className={styles.counter}>
          <span ref={countRef}>0</span>
          <span>%</span>
        </div>
        <div className={styles.track}>
          <div ref={barRef} className={styles.bar} />
        </div>
      </div>
    </div>
  );
}
