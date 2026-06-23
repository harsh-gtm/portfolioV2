"use client";

import { useRef } from "react";
import React from "react";
import SplitText from "gsap/SplitText";
import ScrollTrigger from "gsap/ScrollTrigger";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText);

const AnimateChars = ({ children, animateOnScroll = true, delay = 0 }) => {
  const containerRef = useRef(null);
  const splitRef = useRef([]);
  const chars = useRef([]);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      splitRef.current = [];
      chars.current = [];

      let elements = [];
      if (containerRef.current.hasAttribute("data-copy-wrapper")) {
        elements = Array.from(containerRef.current.children);
      } else {
        elements = [containerRef.current];
      }

      elements.forEach((element) => {
        const split = SplitText.create(element, {
          type: "chars",
          mask: "chars",
          charsClass: "char",
        });

        splitRef.current.push(split);
        chars.current.push(...split.chars);
      });

      gsap.set(chars.current, { y: "60%", opacity: 0 });

      const animationProps = {
        y: "0%",
        opacity: 1,
        duration: 0.8,
        stagger: 0.03,
        ease: "power4.out",
        delay: delay,
      };

      if (animateOnScroll) {
        gsap.to(chars.current, {
          ...animationProps,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            once: true,
          },
        });
      } else {
        gsap.to(chars.current, animationProps);
      }

      return () => {
        splitRef.current.forEach((split) => split.revert());
      };
    },
    {
      scope: containerRef,
      dependencies: [animateOnScroll, delay],
    },
  );

  return (
    <div ref={containerRef} data-copy-wrapper="true">
      {children}
    </div>
  );
};

export default AnimateChars;
