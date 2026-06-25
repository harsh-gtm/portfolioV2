import React from "react";
import "./styles.css";
import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimateLines from "@/components/TextAnimation/AnimateLines";
import AnimateChars from "@/components/TextAnimation/AnimateChars";
import Timeline from "@/components/Timeline/timeline";

const Section1 = () => {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.create({
      trigger: ".pinned",
      start: "top top",
      endTrigger: ".whitespace",
      end: "bottom top",
      pin: true,
      pinSpacing: false,
    });

    ScrollTrigger.create({
      trigger: ".info",
      start: "top top",
      endTrigger: ".whitespace",
      end: "bottom top",
      pin: true,
      pinSpacing: false,
    });

    ScrollTrigger.create({
      trigger: ".pinned",
      start: "top top",
      endTrigger: ".info",
      end: "bottom bottom",
      onUpdate: (self) => {
        const rotation = self.progress * 360;
        gsap.to(".revealer", { rotation });
      },
    });

    ScrollTrigger.create({
      trigger: ".pinned",
      start: "top top",
      endTrigger: ".info",
      end: "bottom bottom",
      onUpdate: (self) => {
        const progress = self.progress;
        const clipPath = `polygon(
            ${45 - 45 * progress}% ${0 + 0 * progress}%,
            ${55 + 45 * progress}% ${0 + 0 * progress}%,
            ${55 + 45 * progress}% ${100 - 0 * progress}%,
            ${45 - 45 * progress}% ${100 - 0 * progress}%
          )`;

        gsap.to(".revealer-1, .revealer-2", {
          clipPath: clipPath,
          ease: "none",
          duration: 0,
        });
      },
    });

    ScrollTrigger.create({
      trigger: ".info",
      start: "top top",
      end: "bottom 50%",
      onUpdate: (self) => {
        const baseLeft = window.innerWidth <= 1500 ? 10 : 25;
        const offsetLeft = window.innerWidth <= 1500 ? 40 : 25;

        const progress = self.progress;
        const left = baseLeft + offsetLeft * progress;

        gsap.to(".revealer", {
          left: `${left}%`,
          ease: "none",
          duration: 0,
        });
      },
    });

    ScrollTrigger.create({
      trigger: ".whitespace",
      start: "top 50%",
      end: "bottom bottom",
      onUpdate: (self) => {
        const scale = 1 + 15 * self.progress;
        gsap.to(".revealer", {
          scale: scale,
          ease: "none",
          duration: 0,
        });
      },
    });

    const path = document.querySelector(".line");
    const length = path.getTotalLength();

    // 1. Initially hide the line
    gsap.set(path, {
      strokeDasharray: length,
      strokeDashoffset: length,
    });

    // 2. Animate it as you scroll
    ScrollTrigger.create({
      trigger: ".content", // The section where the text lives
      start: "top top",
      endTrigger: ".info",
      end: "bottom bottom",
      scrub: 1, // Smooth, scroll-linked animation
      onUpdate: (self) => {
        // Calculate how much of the line to reveal based on scroll progress
        const draw = length * (1 - self.progress);
        path.style.strokeDashoffset = draw;
      },
    });
  }, []);

  return (
    <>
      <div className="content">
        <div className="content-row">
          <AnimateChars>
            <h1>Student</h1>
          </AnimateChars>
        </div>
        <div className="content-row">
          <AnimateChars>
            <h1>Developer</h1>
          </AnimateChars>
        </div>

        <div className="svg-container">
          <svg viewBox="0 0 10 10" className="path-svg">
            <path
              className="line"
              d="M3-9C0 2-5 19-11 18-17 18-17 13-15 11 0 2 16 12 24 19 40 34 10 28-7 27-24 27-9 41 11 33"
              fill="none"
              stroke="red"
              strokeWidth="3" // Adjust thickness here
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* <Timeline />*/}
      </div>

      <div className="info">
        <AnimateLines>
          <p>
            I build with a simple goal: turning ambitious ideas into something
            that can create meaningful impact.
          </p>
        </AnimateLines>

        <div className="images">
          <div className="image"></div>
        </div>
      </div>

      <div className="whitespace"></div>

      <div className="pinned">
        <div className="revealer">
          <div className="revealer-1"></div>
          <div className="revealer-2"></div>
        </div>
      </div>
    </>
  );
};

export default Section1;
