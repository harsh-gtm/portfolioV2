"use client";
import styles from "./page.module.css";
import Hero from "./main/main";

export default function Home() {
  return (
    <>
      <div className={styles.wrapper}>
        <Hero />
      </div>
    </>
  );
}
