"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import gsap from "gsap";
import "./styles.css";
import AnimateText from "@/components/TextAnimation/AnimateText";
import { useState } from "react";

const chunks = [
  { text: "THE WRATH OF GOD LIES SLEEPING. ", color: "#fff" },
  { text: "IT WAS HID A MILLION YEARS BEFORE MEN WERE ", color: "#fff" },
  { text: "AND ONLY MEN HAVE THE POWER TO WAKE IT. ", color: "#8b0000" },
  { text: "HELL AIN'T HALF FULL. HEAR ME. ", color: "#fff" },
  {
    text: "YE CARRY WAR OF A MADMAN'S MAKING ONTO A FOREIGN LAND. ",
    color: "#fff",
  },
  { text: "YE'LL WAKE MORE THAN THE DOGS.", color: "#fff" },
];

export default function Sectiontwo() {
  const revealRef = useRef(null);
  const [showHeading, setShowHeading] = useState(false);

  useEffect(() => {
    gsap.set(revealRef.current, {
      clipPath: "polygon(50% 49.5%, 50% 49.5%, 50% 51%, 50% 51%)",
      scale: 1.5,
    });

    const tl = gsap.timeline({ delay: 32 });

    tl.to(revealRef.current, {
      duration: 1.5,
      clipPath: "polygon(0% 49.5%, 100% 49.5%, 100% 51%, 0% 51%)",
      ease: "power2.inOut",
    }).to(revealRef.current, {
      duration: 1.5,
      delay: 1,
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      scale: 1,
      ease: "power2.inOut",
      onComplete: () => setShowHeading(true),
    });

    return () => tl.kill();
  }, []);

  return (
    <div className="main">
      <div ref={revealRef} className="reveal-layer" />

      <AnimatePresence mode="wait">
        <motion.div
          key="quote-wrapper"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 5 }}
          exit={{ opacity: 0, transition: { duration: 4 } }}
          className="quote-container"
        >
          <div className="vertical-line" />
          <div className="text-block">
            <p>
              {chunks.map((chunk, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 4 + 4, duration: 2 }}
                  style={{ color: chunk.color }}
                >
                  {chunk.text}
                </motion.span>
              ))}
            </p>
            <motion.footer
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 27, duration: 2 }}
            >
              CORMAC MCCARTHY, <i>BLOOD MERIDIAN</i>
            </motion.footer>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="about-me-wrapper">
        {showHeading && (
          <AnimateText type="chars">
            <h1>ABOUT ME</h1>
          </AnimateText>
        )}
      </div>
    </div>
  );
}
