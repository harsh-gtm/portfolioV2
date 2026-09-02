"use client";

import styles from "./style.module.css";

const SECTIONS = [
  {
    label: "Finished",
    projects: [
      { title: "Latent Space", color: "#8FA687" },
      { title: "Signal Path", color: "#C98374" },
      { title: "Field Notes", color: "#7C93A8" },
      { title: "Paper Cuts", color: "#D4A657" },
      { title: "Low Orbit", color: "#8B6F9E" },
      { title: "Nightshift Radio", color: "#6E7B8B" },
    ],
  },
  {
    label: "Work in progress",
    projects: [
      { title: "Glasswing", color: "#C98374" },
      { title: "Continuum", color: "#8FA687" },
      { title: "Driftwood", color: "#D4A657" },
    ],
  },
  {
    label: "Planned",
    projects: [
      { title: "Marrow", color: "#7C93A8" },
      { title: "Terra Nova", color: "#8B6F9E" },
      { title: "Halcyon", color: "#6E7B8B" },
      { title: "Undertow", color: "#C98374" },
    ],
  },
];

export default function ProjectsPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Projects.</h1>

      <div className={styles.sections}>
        {SECTIONS.map((section) => (
          <section className={styles.section} key={section.label}>
            <div className={styles.sectionLabelCol}>
              <h2 className={styles.sectionLabel}>{section.label}</h2>
            </div>

            <div className={styles.grid}>
              {section.projects.map((project) => (
                <div className={styles.card} key={project.title}>
                  <div
                    className={styles.thumb}
                    style={{ backgroundColor: project.color }}
                  />
                  <p className={styles.cardTitle}>{project.title}</p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
