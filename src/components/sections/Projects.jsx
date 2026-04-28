import { useState } from 'react';
import { projects } from '../../data/projects';
import PlanetCard from '../canvas/PlanetCard';
import '../styles/projects.css';

function ProjectModal({ project, onClose }) {
  return (
    <div className="project-modal-overlay" onClick={onClose}>
      <div className="project-modal" onClick={e => e.stopPropagation()}>
        <button className="project-modal-close" onClick={onClose}>✕</button>
        <div className="project-modal-icon">{project.icon}</div>
        <h3 className="project-modal-title">{project.title}</h3>
        <p className="project-modal-subtitle">{project.subtitle} · {project.year}</p>
        <p className="project-modal-desc">{project.description}</p>
        <div className="project-tech-list">
          {project.tech.map(t => (
            <span key={t} className="project-tech" style={{ borderColor: `${project.color}40`, color: project.color }}>{t}</span>
          ))}
        </div>
        <div className="project-links">
          <a href={project.links.github} className="project-link" data-cursor="pointer">
            ⌥ GitHub
          </a>
          <a href={project.links.live} className="project-link" data-cursor="pointer">
            ↗ Live Demo
          </a>
        </div>
      </div>
    </div>
  );
}

function ProjectItem({ project }) {
  const [hovered, setHovered] = useState(false);
  const [modal,   setModal]   = useState(false);

  return (
    <>
      <div
        className="project-card"
        style={{ '--project-color': project.color }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => setModal(true)}
        data-cursor="pointer"
      >
        <div className="project-planet-wrap">
          <PlanetCard
            planetColor={project.planetColor}
            ringColor={project.ringColor}
            hovered={hovered}
          />
        </div>

        <div className="project-body">
          <span className={`project-status-badge ${project.status === 'Completed' ? 'completed' : 'progress'}`}>
            <span className="project-status-dot" />
            {project.status}
          </span>
          <h3 className="project-title">{project.title}</h3>
          <p className="project-subtitle">{project.subtitle}</p>
          <p className="project-desc">{project.description}</p>
          <div className="project-tech-list">
            {project.tech.slice(0, 3).map(t => (
              <span key={t} className="project-tech">{t}</span>
            ))}
          </div>
          <div className="project-links">
            <a href={project.links.github} className="project-link" onClick={e => e.stopPropagation()}>⌥ Code</a>
            <a href={project.links.live}   className="project-link" onClick={e => e.stopPropagation()}>↗ Demo</a>
          </div>
        </div>
      </div>

      {modal && <ProjectModal project={project} onClose={() => setModal(false)} />}
    </>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="section projects">
      <h2 className="section-title">Projects</h2>
      <p className="section-subtitle">// universe.explore() —— click to expand</p>
      <div className="projects-grid">
        {projects.map(p => <ProjectItem key={p.id} project={p} />)}
      </div>
    </section>
  );
}
