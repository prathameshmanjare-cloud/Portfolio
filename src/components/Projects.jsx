import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { FiExternalLink } from 'react-icons/fi';
import { FiGithub } from 'react-icons/fi';
import { projects } from '../data/projects';
import styles from './Projects.module.css';

gsap.registerPlugin(ScrollTrigger);

function ProjectCard({ project, index }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(card, {
      rotateY: x * 14,
      rotateX: -y * 14,
      duration: 0.4,
      ease: 'power2.out',
      transformPerspective: 800,
    });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: 'power2.out',
    });
  };

  return (
    <div
      ref={cardRef}
      className={styles.card}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className={styles.imageWrapper}>
        <img
          src={project.image}
          alt={project.name}
          className={styles.image}
          loading="lazy"
        />
      </div>
      <div className={styles.body}>
        <h3 className={styles.title}>{project.name}</h3>
        <p className={styles.desc}>{project.description}</p>
        <div className={styles.techs}>
          {project.tech.map((t) => (
            <span key={t} className={styles.pill}>{t}</span>
          ))}
        </div>
        <div className={styles.links}>
          <a href={project.live} target="_blank" rel="noopener noreferrer" className={styles.linkBtn}>
            <FiExternalLink size={14} /> Live Site
          </a>
          <a href={project.github} target="_blank" rel="noopener noreferrer" className={styles.linkBtnGhost}>
            <FiGithub size={14} /> GitHub
          </a>
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const gridRef = useRef(null);

  useGSAP(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    /* Title chars stagger */
    const chars = titleRef.current?.querySelectorAll(`.${styles.titleChar}`);
    if (chars) {
      gsap.from(chars, {
        scrollTrigger: { trigger: titleRef.current, start: 'top 85%' },
        y: 40,
        opacity: 0,
        stagger: 0.04,
        duration: 0.6,
        ease: 'power3.out',
      });
    }

    /* Cards fly in */
    const cards = gridRef.current?.querySelectorAll(`.${styles.card}`);
    if (cards) {
      gsap.from(cards, {
        scrollTrigger: { trigger: gridRef.current, start: 'top 80%' },
        y: 60,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: 'power3.out',
      });
    }
  }, { scope: sectionRef });

  const titleText = 'Selected Work';

  return (
    <section id="work" ref={sectionRef} className={`${styles.section} section`}>
      <div className="container">
        <p className="section-label">Projects</p>
        <h2 ref={titleRef} className={styles.sectionTitle}>
          {titleText.split('').map((ch, i) => (
            <span key={i} className={styles.titleChar}>{ch === ' ' ? ' ' : ch}</span>
          ))}
        </h2>
        <div ref={gridRef} className={styles.grid}>
          {projects.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
