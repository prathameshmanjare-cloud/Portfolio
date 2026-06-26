import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { skills } from '../data/skills';
import styles from './Skills.module.css';

gsap.registerPlugin(ScrollTrigger);

function SkillBar({ name, level }) {
  const barRef = useRef(null);
  const labelRef = useRef(null);

  return (
    <div className={styles.skillItem}>
      <div className={styles.skillHeader}>
        <span className={styles.skillName}>{name}</span>
        <span ref={labelRef} className={styles.skillPct}>{level}%</span>
      </div>
      <div className={styles.track}>
        <div ref={barRef} className={styles.bar} data-level={level} />
      </div>
    </div>
  );
}

function SkillColumn({ title, file, items }) {
  const colRef = useRef(null);

  useGSAP(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      colRef.current?.querySelectorAll(`.${styles.bar}`).forEach((b) => {
        b.style.width = b.dataset.level + '%';
      });
      return;
    }

    const bars = colRef.current?.querySelectorAll(`.${styles.bar}`);
    if (!bars) return;

    gsap.from(bars, {
      scrollTrigger: { trigger: colRef.current, start: 'top 80%' },
      width: '0%',
      duration: 1.2,
      stagger: 0.12,
      ease: 'expo.out',
      onStart: () => {
        bars.forEach((b) => { b.style.width = '0%'; });
      },
    });

    bars.forEach((b) => {
      gsap.to(b, {
        scrollTrigger: { trigger: colRef.current, start: 'top 80%' },
        width: b.dataset.level + '%',
        duration: 1.2,
        ease: 'expo.out',
        delay: Array.from(bars).indexOf(b) * 0.12,
      });
    });
  }, { scope: colRef });

  return (
    <div ref={colRef} className={styles.column}>
      <div className={styles.termBar}>
        <span className={`${styles.dot} ${styles.red}`} />
        <span className={`${styles.dot} ${styles.yellow}`} />
        <span className={`${styles.dot} ${styles.green}`} />
        <span className={styles.termTitle}>{file}</span>
      </div>
      <div className={styles.colBody}>
        <h3 className={styles.colTitle}>{title}</h3>
        <div className={styles.skillList}>
          {items.map((s) => <SkillBar key={s.name} name={s.name} level={s.level} />)}
        </div>
      </div>
    </div>
  );
}

export default function Skills() {
  const sectionRef = useRef(null);

  useGSAP(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;
    gsap.from(sectionRef.current?.querySelector(`.${styles.titleWrap}`), {
      scrollTrigger: { trigger: sectionRef.current, start: 'top 85%' },
      y: 30,
      opacity: 0,
      duration: 0.7,
      ease: 'power3.out',
    });
  }, { scope: sectionRef });

  return (
    <section id="skills" ref={sectionRef} className={`${styles.section} section`}>
      <div className="container">
        <div className={styles.titleWrap}>
          <p className="section-label">Expertise</p>
          <h2 className="section-title">What I Work With</h2>
        </div>
        <div className={styles.grid}>
          <SkillColumn title="Frontend" file="frontend.js" items={skills.frontend} />
          <SkillColumn title="Backend" file="backend.py" items={skills.backend} />
          <SkillColumn title="Tools & Others" file="tools.sh" items={skills.tools} />
        </div>
      </div>
    </section>
  );
}
