// TimelineDial.jsx
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./styles.css";

const TICKS_PER_YEAR = 4;
const START_YEAR = 2027;
const END_YEAR = 2020;
const TOTAL_TICKS = (START_YEAR - END_YEAR) * TICKS_PER_YEAR + 1;
const ROW_H = 48;

export default function Timeline() {
  const outerRef = useRef(null);
  const innerRef = useRef(null);

  const ticks = Array.from({ length: TOTAL_TICKS }, (_, i) => ({
    isMajor: i % TICKS_PER_YEAR === 0,
    year: START_YEAR - Math.floor(i / TICKS_PER_YEAR),
  }));

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const totalH = (TOTAL_TICKS - 1) * ROW_H;

    // Outer strip (years) scrolls down
    ScrollTrigger.create({
      trigger: ".pinned",
      start: "top top",
      endTrigger: ".info",
      end: "bottom bottom",
      onUpdate: (self) => {
        gsap.to(outerRef.current, {
          y: -self.progress * totalH * 0.5,
          ease: "none",
          duration: 0,
        });
        // Inner dial scrolls up (opposite)
        gsap.to(innerRef.current, {
          y: self.progress * totalH * 0.5,
          ease: "none",
          duration: 0,
        });
      },
    });
  }, []);

  return (
    <div className="timeline-dial">
      {/* Outer: dashes + year labels, scroll down */}
      <div className="timeline-strip timeline-strip--outer" ref={outerRef}>
        {ticks.map((t, i) => (
          <div
            key={i}
            className={`tick-row${t.isMajor ? " tick-row--major" : ""}`}
          >
            <div className="tick-dashes tick-dashes--left">
              <span />
              <span />
              <span />
            </div>
            <div className="tick-pip" />
            <div className="tick-dashes tick-dashes--right">
              <span />
              <span />
              <span />
              <span className="tick-year">{t.isMajor ? t.year : ""}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Inner: pips only, scroll up */}
      <div className="timeline-strip timeline-strip--inner" ref={innerRef}>
        {ticks.map((t, i) => (
          <div
            key={i}
            className={`tick-row${t.isMajor ? " tick-row--major" : ""}`}
          >
            <div className="tick-dashes tick-dashes--left">
              <span />
              <span />
              <span />
            </div>
            <div className="tick-pip tick-pip--active" />
            <div className="tick-dashes tick-dashes--right">
              <span />
              <span />
              <span />
              <span className="tick-year" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
