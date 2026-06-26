import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';
import styles from './Contact.module.css';

gsap.registerPlugin(ScrollTrigger);

const SOCIALS = [
  { icon: FiGithub, href: 'https://github.com/prathameshmanjare-cloud', label: 'GitHub' },
  { icon: FiLinkedin, href: 'https://linkedin.com/in/prathamesh-manjare', label: 'LinkedIn' },
];

export default function Contact() {
  const sectionRef = useRef(null);
  const formRef = useRef(null);
  const checkRef = useRef(null);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ email: '', message: '' });

  useGSAP(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    gsap.from(sectionRef.current?.querySelector(`.${styles.inner}`), {
      scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      y: 60,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out',
    });
  }, { scope: sectionRef });

  const handleSubmit = (e) => {
    e.preventDefault();
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    setSent(true);

    if (!prefersReduced && checkRef.current) {
      const path = checkRef.current.querySelector('path');
      const length = path.getTotalLength();
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      gsap.to(checkRef.current, { opacity: 1, duration: 0.3, ease: 'power2.out' });
      gsap.to(path, { strokeDashoffset: 0, duration: 0.7, ease: 'power3.out', delay: 0.1 });
    }
  };

  return (
    <section id="contact" ref={sectionRef} className={`${styles.section} section`}>
      <div className="container">
        <div className={styles.inner}>
          <div className={styles.heading}>
            <p className="section-label">Get In Touch</p>
            <h2 className={styles.title}>Let's build something.</h2>
            <p className={styles.sub}>
              Open to freelance, collaboration, or full-time opportunities.
              Drop a message and I'll get back within 24 hours.
            </p>
          </div>

          <div className={styles.window}>
            <div className={styles.termBar}>
              <span className={`${styles.dot} ${styles.red}`} />
              <span className={`${styles.dot} ${styles.yellow}`} />
              <span className={`${styles.dot} ${styles.green}`} />
              <span className={styles.termTitle}>contact.sh</span>
            </div>
            <div className={styles.windowBody}>
          {!sent ? (
            <form ref={formRef} className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="email">Your Email</label>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="you@domain.com"
                  className={styles.input}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="message">Message</label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  placeholder="What are you building?"
                  className={styles.textarea}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
              </div>
              <button type="submit" className={styles.btn}>Send Message →</button>
            </form>
          ) : (
            <div className={styles.success}>
              <svg
                ref={checkRef}
                className={styles.check}
                viewBox="0 0 60 60"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="30" cy="30" r="28" stroke="var(--accent-violet)" strokeWidth="2" />
                <path d="M18 30L26 38L42 22" stroke="var(--accent-cyan)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className={styles.successText}>Message sent. I'll be in touch soon.</p>
            </div>
          )}
            </div>
          </div>

          <div className={styles.socials}>
            {SOCIALS.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label={label}
              >
                <Icon size={20} />
              </a>
            ))}
            <a href="mailto:prathameshmanjare3@gmail.com" className={styles.socialLink} aria-label="Email">
              <FiMail size={20} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
