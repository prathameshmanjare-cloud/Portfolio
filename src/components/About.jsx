import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import styles from './About.module.css';

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { value: 2, suffix: '+', label: 'Years Coding' },
  { value: 5, suffix: '+', label: 'Projects Shipped' },
  { value: 8, suffix: '.64', label: 'MCA CGPA' },
  { value: 6, suffix: ' mo', label: 'Industry Intern' },
];

export default function About() {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const textRef = useRef(null);
  const statsRef = useRef([]);

  useGSAP(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReduced) {
      gsap.from(imageRef.current, {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        x: -60,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
      });

      /* Gentle floating loop */
      gsap.to(`.${styles.avatarWrapper}`, {
        y: -14,
        duration: 2.6,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });

      /* Rotating accent ring */
      gsap.to(`.${styles.ring}`, {
        rotate: 360,
        duration: 18,
        ease: 'none',
        repeat: -1,
      });

      /* Shine sweep on hover */
      const avatar = imageRef.current?.querySelector(`.${styles.avatar}`);
      const shine = imageRef.current?.querySelector(`.${styles.shine}`);
      if (avatar && shine) {
        const sweep = () => {
          gsap.fromTo(shine,
            { xPercent: -120, opacity: 0.9 },
            { xPercent: 120, opacity: 0, duration: 0.8, ease: 'power2.out' }
          );
        };
        avatar.addEventListener('mouseenter', sweep);
      }

      gsap.from(textRef.current?.children, {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        x: 60,
        opacity: 0,
        stagger: 0.12,
        duration: 0.9,
        ease: 'power3.out',
      });
    }

    /* Count-up for stats */
    STATS.forEach((stat, i) => {
      const el = statsRef.current[i];
      if (!el) return;
      const numEl = el.querySelector('[data-count]');
      if (!numEl) return;

      if (prefersReduced) {
        numEl.textContent = stat.value;
        return;
      }

      const obj = { val: 0 };
      gsap.to(obj, {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        val: stat.value,
        duration: 1.5,
        ease: 'power2.out',
        delay: i * 0.15,
        onUpdate: () => { numEl.textContent = Math.round(obj.val); },
      });
    });
  }, { scope: sectionRef });

  return (
    <section id="about" ref={sectionRef} className={`${styles.section} section`}>
      <div className="container">
        <div className={styles.grid}>
          <div ref={imageRef} className={styles.imageCol}>
            <div className={styles.avatarWrapper}>
              <div className={styles.avatar}>
                <img src="/prathamesh.JPG" alt="Prathamesh Manjare" className={styles.photo} />
                <span className={styles.shine} />
              </div>
              <div className={styles.ring} />
              <div className={styles.avatarGlow} />
            </div>
          </div>

          <div ref={textRef} className={styles.textCol}>
            <p className="section-label">About Me</p>
            <h2 className={styles.heading}>Crafting code that<br />means something.</h2>
            <p className={styles.bio}>
              I'm Prathamesh Manjare, a Software Developer and MCA student at MIT World Peace University, Pune.
              I interned at Inteliment Technologies building enterprise platforms, from LMS systems and
              license management to full deployment pipelines, using ReactJS, Python, and FastAPI.
            </p>
            <p className={styles.bio}>
              Outside code, I serve as President of the Rotaract Club of Pune City Fortune, leading community
              initiatives and events. I care about software that solves real problems and feels alive to use.
            </p>

            <div className={styles.stats}>
              {STATS.map((stat, i) => (
                <div key={stat.label} ref={(el) => (statsRef.current[i] = el)} className={styles.stat}>
                  <div className={styles.statValue}>
                    <span data-count>{0}</span>
                    <span className={styles.suffix}>{stat.suffix}</span>
                  </div>
                  <span className={styles.statLabel}>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
