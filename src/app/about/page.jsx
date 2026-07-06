"use client";

import { motion, AnimatePresence } from "motion/react";
import "./styles.css";

// Break the text into logical chunks that fit your paragraph wrapping
const chunks = [
  { text: "THE WRATH OF GOD LIES SLEEPING. ", color: "#fff" },
  { text: "IT WAS HID A MILLION YEARS BEFORE MEN WERE ", color: "#fff" },
  { text: "AND ONLY MEN HAVE THE POWER TO WAKE IT. ", color: "#8b0000" }, // Deep red
  { text: "HELL AIN'T HALF FULL. HEAR ME. ", color: "#fff" },
  {
    text: "YE CARRY WAR OF A MADMAN'S MAKING ONTO A FOREIGN LAND. ",
    color: "#fff",
  },
  { text: "YE'LL WAKE MORE THAN THE DOGS.", color: "#fff" },
];

export default function Sectiontwo() {
  return (
    <div className="main">
      <AnimatePresence mode="wait">
        <motion.div
          key="quote-wrapper"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1.5 } }}
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
                  transition={{ delay: i * 5, duration: 3 }}
                  style={{ color: chunk.color }}
                >
                  {chunk.text}
                </motion.span>
              ))}
            </p>
            <motion.footer
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 30, duration: 2 }}
            >
              CORMAC MCCARTHY, <i>BLOOD MERIDIAN</i>
            </motion.footer>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
