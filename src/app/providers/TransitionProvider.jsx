"use client";
import { TransitionRouter } from "next-transition-router";
import gsap from "gsap";
import { useRef, useEffect, useState } from "react";

const ROWS = 4;
const COLS = 16;

const TransitionProvider = ({ children }) => {
  const blocksRef = useRef([]);
  const timelineRef = useRef(null);
  const [dims, setDims] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const update = () =>
      setDims({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const blockWidth = dims.w / COLS;
  const blockHeight = dims.h / ROWS;

  const getRowBlocks = (row) =>
    blocksRef.current.slice(row * COLS, row * COLS + COLS);

  const killActiveTimeline = () => {
    if (timelineRef.current) {
      timelineRef.current.kill();
      timelineRef.current = null;
    }
  };

  const animateIn = (onComplete) => {
    killActiveTimeline();
    const tl = gsap.timeline({ onComplete });
    [0, 1, 2, 3].forEach((row) => {
      tl.to(
        getRowBlocks(row),
        {
          scaleX: 1,
          duration: 0.6,
          ease: "power3.inOut",
          stagger: { each: 0.025, from: row % 2 === 0 ? "start" : "end" },
        },
        "<",
      );
    });
    timelineRef.current = tl;
    return tl;
  };

  const animateOut = (onComplete) => {
    killActiveTimeline();
    const tl = gsap.timeline({ onComplete });
    [0, 1, 2, 3].forEach((row) => {
      tl.to(
        getRowBlocks(row),
        {
          scaleX: 0,
          duration: 0.6,
          ease: "power3.inOut",
          stagger: { each: 0.025, from: row % 2 === 0 ? "start" : "end" },
        },
        "<",
      );
    });
    timelineRef.current = tl;
    return tl;
  };

  useEffect(() => {
    gsap.set(blocksRef.current, { scaleX: 0 });
  }, [dims]);

  return (
    <TransitionRouter
      auto
      leave={(next) => {
        const tl = animateIn(next);
        return () => tl.kill();
      }}
      enter={(next) => {
        const tl = animateOut(next);
        return () => tl.kill();
      }}
    >
      <div className="transition-grid">
        {Array.from({ length: ROWS * COLS }).map((_, i) => {
          const row = Math.floor(i / COLS);
          const col = i % COLS;
          return (
            <div
              key={i}
              ref={(el) => (blocksRef.current[i] = el)}
              className="transition-block"
              style={{
                position: "absolute",
                width: blockWidth + 1,
                height: blockHeight + 1,
                left: col * blockWidth,
                top: row * blockHeight,
                transformOrigin: row % 2 === 0 ? "left center" : "right center",
              }}
            />
          );
        })}
      </div>
      {children}
    </TransitionRouter>
  );
};

export default TransitionProvider;
