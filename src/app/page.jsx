"use client";
import styles from "./page.module.css";
import Hero from "./hero/Hero";
import { useState } from "react";

export default function Home() {
  const [blurActive, setBlurActive] = useState(false);

  return (
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 21,
          pointerEvents: "none",
          backdropFilter: blurActive ? "blur(8px)" : "blur(0px)",
          WebkitBackdropFilter: blurActive ? "blur(8px)" : "blur(0px)",
          transition:
            "backdrop-filter 0.5s ease, -webkit-backdrop-filter 0.5s ease",
          background: "transparent",
        }}
      />
      <div className={styles.wrapper}>
        <Hero onHoverChange={setBlurActive} />
      </div>
    </>
  );
}
