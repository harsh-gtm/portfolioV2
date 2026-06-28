import React, { useEffect, useRef } from "react";
import "./styles.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimateLines from "@/components/TextAnimation/AnimateLines";
import AnimateChars from "@/components/TextAnimation/AnimateChars";
import Timeline from "@/components/Timeline/timeline";

gsap.registerPlugin(ScrollTrigger);

const Section1 = () => {
  const revealerRef = useRef(null);
  const revealer1Ref = useRef(null);
  const revealer2Ref = useRef(null);
  const pathRef = useRef(null);
  const sliderTrackRef = useRef(null);
  const sliderWrapperRef = useRef(null);

  useEffect(() => {
    const revealer = revealerRef.current;
    const revealer1 = revealer1Ref.current;
    const revealer2 = revealer2Ref.current;
    const path = pathRef.current;

    if (!path) return;

    const length = path.getTotalLength();

    gsap.set(path, {
      strokeDasharray: length,
      strokeDashoffset: length,
    });

    const triggers = [
      ScrollTrigger.create({
        trigger: ".pinned",
        start: "top top",
        endTrigger: ".whitespace",
        end: "bottom top",
        pin: true,
        pinSpacing: false,
      }),

      ScrollTrigger.create({
        trigger: ".info",
        start: "top top",
        endTrigger: ".whitespace",
        end: "bottom top",
        pin: true,
        pinSpacing: false,
      }),

      ScrollTrigger.create({
        trigger: ".pinned",
        start: "top top",
        endTrigger: ".info",
        end: "bottom bottom",
        onUpdate: (self) => {
          const progress = self.progress;
          const rotation = progress * 360;

          const clipPath = `polygon(
            ${45 - 45 * progress}% 0%,
            ${55 + 45 * progress}% 0%,
            ${55 + 45 * progress}% 100%,
            ${45 - 45 * progress}% 100%
          )`;

          gsap.set(revealer, { rotation });
          gsap.set([revealer1, revealer2], { clipPath, ease: "none" });
        },
      }),

      ScrollTrigger.create({
        trigger: ".info",
        start: "top top",
        end: "bottom 50%",
        onUpdate: (self) => {
          const baseLeft = window.innerWidth <= 1500 ? 10 : 25;
          const offsetLeft = window.innerWidth <= 1500 ? 40 : 25;
          const left = baseLeft + offsetLeft * self.progress;

          gsap.set(revealer, { left: `${left}%` });
          gsap.set(sliderTrackRef.current, {
            x: `-${self.progress * 500}px`,
          });
        },
      }),

      ScrollTrigger.create({
        trigger: ".whitespace",
        start: "top 50%",
        end: "bottom bottom",
        onUpdate: (self) => {
          gsap.set(revealer, { scale: 1 + 15 * self.progress });
        },
      }),

      ScrollTrigger.create({
        trigger: ".content",
        start: "top top",
        endTrigger: ".info",
        end: "bottom center",
        scrub: 1,
        onUpdate: (self) => {
          path.style.strokeDashoffset = length * (1 - self.progress);
        },
      }),
    ];

    return () => {
      triggers.forEach((t) => t.kill());
    };
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
              ref={pathRef}
              className="line"
              d="M3-9C0 2-5 19-11 18-17 18-17 13-15 11 0 2 16 12 24 19 40 34 10 28-7 27-24 27-6 39 11 33 28 29 1 37 3 51"
              fill="none"
              stroke="red"
              strokeWidth="3"
              strokeLinecap="round"
              style={{ strokeDasharray: 1, strokeDashoffset: 1 }}
            />
          </svg>
        </div>
      </div>

      <div className="info">
        <AnimateLines delay={1}>
          <p>
            I build with a simple goal: turning ambitious ideas into something
            that can create meaningful impact
          </p>
        </AnimateLines>
        {/* <div className="slider-wrapper" ref={sliderWrapperRef}>
          <div className="slider-track" ref={sliderTrackRef}>
            <div
              className="slider-item"
              style={{ backgroundColor: "red" }}
            ></div>
            <div
              className="slider-item"
              style={{ backgroundColor: "blue" }}
            ></div>
            <div
              className="slider-item"
              style={{ backgroundColor: "green" }}
            ></div>
            <div
              className="slider-item"
              style={{ backgroundColor: "yellow" }}
            ></div>
            <div
              className="slider-item"
              style={{ backgroundColor: "yellow" }}
            ></div>
            <div
              className="slider-item"
              style={{ backgroundColor: "yellow" }}
            ></div>
            <div
              className="slider-item"
              style={{ backgroundColor: "yellow" }}
            ></div>
            <div
              className="slider-item"
              style={{ backgroundColor: "yellow" }}
            ></div>
            <div
              className="slider-item"
              style={{ backgroundColor: "yellow" }}
            ></div>
            <div
              className="slider-item"
              style={{ backgroundColor: "yellow" }}
            ></div>
          </div>
        </div>*/}
      </div>

      <div className="whitespace"></div>

      <div className="pinned">
        <div className="revealer" ref={revealerRef}>
          <div className="revealer-1" ref={revealer1Ref}></div>
          <div className="revealer-2" ref={revealer2Ref}></div>
        </div>
      </div>
    </>
  );
};

export default Section1;
