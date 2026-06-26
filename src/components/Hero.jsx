import { useEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import styles from './Hero.module.css';

const NAME = 'Prathamesh Manjare';
const ROLE_CHARS = 'Software Developer & MCA @ MIT WPU';

/* Code lines typed into the terminal */
const CODE_LINES = [
  { t: 'const dev = {', c: 'plain' },
  { t: "  name: 'Prathamesh Manjare',", c: 'str' },
  { t: "  role: 'Software Developer',", c: 'str' },
  { t: "  stack: ['React', 'FastAPI', 'Java'],", c: 'arr' },
  { t: '  shipsRealProducts: true,', c: 'bool' },
  { t: '};', c: 'plain' },
  { t: '', c: 'plain' },
  { t: 'dev.build();  // → live on the internet', c: 'comment' },
];

function splitChars(str) {
  return str.split('').map((ch, i) => (
    <span key={i} className={styles.char}>{ch === ' ' ? ' ' : ch}</span>
  ));
}

/* Split into words so letters never break mid-word */
function splitWords(str) {
  let idx = 0;
  return str.split(' ').map((word, w) => (
    <span key={w} className={styles.word}>
      {word.split('').map((ch) => (
        <span key={idx++} className={styles.char}>{ch}</span>
      ))}
      {' '}
    </span>
  ));
}

export default function Hero() {
  const sectionRef = useRef(null);
  const nameRef = useRef(null);
  const roleRef = useRef(null);
  const btnRef = useRef(null);
  const canvasRef = useRef(null);
  const chevronRef = useRef(null);
  const termRef = useRef(null);
  const lineRefs = useRef([]);

  /* Particle canvas */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let W, H;

    const resize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const COUNT = 50;
    const dots = Array.from({ length: COUNT }, () => ({
      x: Math.random() * (W || 800),
      y: Math.random() * (H || 600),
      r: Math.random() * 1.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.4 + 0.08,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      dots.forEach((d) => {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0) d.x = W;
        if (d.x > W) d.x = 0;
        if (d.y < 0) d.y = H;
        if (d.y > H) d.y = 0;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(109, 40, 217, ${d.alpha})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  /* Terminal typing animation */
  useGSAP(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const lines = lineRefs.current.filter(Boolean);
    if (prefersReduced) {
      lines.forEach((el, i) => { el.textContent = CODE_LINES[i].t; });
      return;
    }

    const tl = gsap.timeline({ delay: 2.6 });

    lines.forEach((el, i) => {
      const full = CODE_LINES[i].t;
      if (!full) return;
      const obj = { n: 0 };
      tl.to(obj, {
        n: full.length,
        duration: Math.max(full.length * 0.03, 0.12),
        ease: 'none',
        onUpdate: () => { el.textContent = full.slice(0, Math.round(obj.n)); },
      });
    });

    return () => tl.kill();
  }, { scope: sectionRef });

  /* Hero entrance timeline */
  useGSAP(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const nameChars = nameRef.current?.querySelectorAll(`.${styles.char}`);
    const roleChars = roleRef.current?.querySelectorAll(`.${styles.char}`);

    const tl = gsap.timeline({ delay: 2.2 });

    tl.from(canvasRef.current, { opacity: 0, duration: 0.8, ease: 'power2.out' })
      .from(termRef.current, {
        opacity: 0,
        y: 40,
        scale: 0.92,
        duration: 0.9,
        ease: 'back.out(1.3)',
      }, '-=0.3')
      .from(nameChars, {
        opacity: 0,
        y: 30,
        stagger: 0.03,
        duration: 0.5,
        ease: 'power3.out',
      }, '-=0.5')
      .from(roleChars, {
        opacity: 0,
        y: 20,
        stagger: 0.018,
        duration: 0.4,
        ease: 'power2.out',
      }, '-=0.2')
      .from(btnRef.current?.children, {
        opacity: 0,
        y: 24,
        stagger: 0.12,
        duration: 0.6,
        ease: 'back.out(1.4)',
      }, '-=0.1')
      .from(chevronRef.current, {
        opacity: 0,
        y: -10,
        duration: 0.5,
        ease: 'power2.out',
      }, '-=0.2');

    /* Chevron bounce loop */
    gsap.to(chevronRef.current, {
      y: 10,
      repeat: -1,
      yoyo: true,
      duration: 0.9,
      ease: 'power1.inOut',
      delay: 3.5,
    });
  }, { scope: sectionRef });

  return (
    <section id="hero" ref={sectionRef} className={styles.hero}>
      <canvas ref={canvasRef} className={styles.canvas} />

      <div className={styles.inner}>
        <div className={styles.left}>
          <p className={styles.greeting}>
            <span className={styles.mono}>// welcome</span>
          </p>
          <h1 ref={nameRef} className={styles.name}>
            {splitChars(NAME)}
          </h1>
          <p ref={roleRef} className={styles.role}>
            {splitChars(ROLE_CHARS)}
          </p>
          <p className={styles.bio}>
            Software developer from Pune. I build full-stack apps that solve real problems,
            from enterprise LMS platforms to vehicle rental systems. President, Rotaract Club of Pune City Fortune.
          </p>
          <div ref={btnRef} className={styles.buttons}>
            <a href="#work" className={styles.btnPrimary} onClick={(e) => { e.preventDefault(); document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' }); }}>
              View My Work
            </a>
            <a
              href="https://drive.google.com/uc?export=download&id=1bcm01beDORitOXDXSZEF7vZdcOmFGyAC"
              className={styles.btnGhost}
              target="_blank"
              rel="noopener noreferrer"
            >
              Download CV
            </a>
          </div>
        </div>

        <div className={styles.right}>
          <div ref={termRef} className={styles.terminal}>
            <div className={styles.termBar}>
              <span className={`${styles.dot} ${styles.red}`} />
              <span className={`${styles.dot} ${styles.yellow}`} />
              <span className={`${styles.dot} ${styles.green}`} />
              <span className={styles.termTitle}>developer.js</span>
            </div>
            <div className={styles.termBody}>
              {CODE_LINES.map((line, i) => (
                <div key={i} className={styles.codeRow}>
                  <span className={styles.lineNum}>{i + 1}</span>
                  <code
                    ref={(el) => (lineRefs.current[i] = el)}
                    className={`${styles.codeLine} ${styles[line.c]}`}
                  />
                </div>
              ))}
              <span className={styles.cursor} />
            </div>
          </div>
        </div>
      </div>

      <div ref={chevronRef} className={styles.chevron}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M6 9L12 15L18 9" stroke="var(--accent-violet)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </section>
  );
}
