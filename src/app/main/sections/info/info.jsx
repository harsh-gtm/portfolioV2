import React from "react";
import "./styles.css";
import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimateLines from "@/components/TextAnimation/AnimateLines";
import AnimateChars from "@/components/TextAnimation/AnimateChars";

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
      </div>

      <div className="timeline">
        <div>---------------------------------</div>
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
