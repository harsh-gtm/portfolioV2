import React, { useEffect, useRef } from "react";
import "./styles.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimateLines from "@/components/TextAnimation/AnimateLines";
import AnimateChars from "@/components/TextAnimation/AnimateChars";
import Timeline from "@/components/Timeline/timeline";
import AnimateText from "@/components/TextAnimation/AnimateText";
import Image from "next/image";
// import image1 from "public/infopic1.jpg";
// import image2 from "public/infopic2.jpg";
// import image3 from "public/infopic3.jpg";
// import image4 from "public/infopic4.jpg";
// import image5 from "public/infopic5.jpg";

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
          <AnimateText type="chars" stagger={0.05} scrub={0.5}>
            <h1>Student</h1>
          </AnimateText>
        </div>
        <div className="content-row">
          <AnimateText type="chars" stagger={0.05} scrub={0.5}>
            <h1>Developer</h1>
          </AnimateText>
        </div>

        <div className="svg-container">
          <svg viewBox="0 0 10 10" className="path-svg">
            <path
              ref={pathRef}
              className="line"
              d="M3-9C0 2-5 19-11 18-17 18-17 13-15 11-11 7 8 6 22 25 40 34 36 26 41 36 44 35 40 41 37 52"
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
        <AnimateText type="words">
          <p>
            I build with a simple goal: turning ambitious ideas into something
            that can create meaningful impact
          </p>
        </AnimateText>
        <div className="slider-wrapper" ref={sliderWrapperRef}>
          <div className="slider-track" ref={sliderTrackRef}>
            <Image
              src="/infopic1.jpg"
              alt="Remote image"
              width={500}
              height={300}
            />
            <Image
              src="/infopic2.jpg"
              alt="Remote image"
              width={500}
              height={300}
            />
            <Image
              src="/infopic3.jpg"
              alt="Remote image"
              width={500}
              height={300}
            />
            <Image
              src="/infopic4.jpg"
              alt="Remote image"
              width={500}
              height={300}
            />
            <Image
              src="/infopic5.jpg"
              alt="Remote image"
              width={500}
              height={300}
            />
          </div>
        </div>
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
