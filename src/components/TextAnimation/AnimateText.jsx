"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText);

const AnimateText = ({
  children,

  // SplitText
  type = "words",

  // ScrollTrigger
  start = "top 85%",
  end = "top 40%",
  scrub = 0.35,

  // Animation
  stagger = 0.03,
  duration = 1,
  ease = "power4.out",
  yPercent = 120,
}) => {
  const containerRef = useRef(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const elements = containerRef.current.hasAttribute("data-copy-wrapper")
        ? Array.from(containerRef.current.children)
        : [containerRef.current];

      const splits = [];
      const targets = [];

      elements.forEach((el) => {
        const split = SplitText.create(el, {
          type,
          mask: type,
        });

        splits.push(split);

        if (type === "words") targets.push(...split.words);
        else if (type === "chars") targets.push(...split.chars);
        else if (type === "lines") targets.push(...split.lines);
      });

      gsap.set(targets, {
        yPercent,
        willChange: "transform",
      });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start,
            end,
            scrub,
          },
        })
        .to(targets, {
          yPercent: 0,
          duration,
          ease,
          stagger: {
            each: stagger,
          },
        });

      return () => {
        splits.forEach((split) => split.revert());
      };
    },
    {
      scope: containerRef,
      dependencies: [
        type,
        start,
        end,
        scrub,
        stagger,
        duration,
        ease,
        yPercent,
      ],
    },
  );

  return (
    <div ref={containerRef} data-copy-wrapper>
      {children}
    </div>
  );
};

export default AnimateText;
