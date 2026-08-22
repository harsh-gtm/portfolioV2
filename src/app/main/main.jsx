"use client";

import Image from "next/image";
import styles from "./hero.module.css";
import { clsx } from "clsx";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/all";
import { useEffect, useRef } from "react";
import Navbar from "@/components/Navbar/Navbar";

import bgImage from "../../../public/bg2.jpg";

const LETTERS = [
  { char: "H" },
  { char: "A" },
  { char: "R", isR: true },
  { char: "S" },
  { char: "H" },
];

const LETTER_GAP = 40; // px of room between letters in the starting position of the word

const U_SPREAD = 18; // vw between each letter's final x
const U_DEPTH = 45; // vh — how far R sags below the H's
const U_DROP = 38; // vh — overall group drop as it breaks apart
const U_TILT = 5; // deg outward lean at the ends

function getFinalTransform(index) {
  const t = index - 2;
  const x = t * U_SPREAD;
  const y = U_DROP + U_DEPTH * (1 - (t * t) / 4);
  const r = t * U_TILT;
  return { x, y, r };
}

export default function Hero() {
  const progressValue = useRef({ value: 0 });
  const counterRef = useRef(null);
  const preloaderCounterRef = useRef(null);
  const progressBarRef = useRef(null);
  const navRef = useRef(null);
  const scrollIndicatorRef = useRef(null);
  const wrapperRef = useRef(null);
  const animatedSecionRef = useRef(null);

  const outerRefs = useRef([]);
  const idleRefs = useRef([]);
  const rGreenRef = useRef(null);

  const updateCounter = () => {
    if (counterRef.current)
      counterRef.current.textContent = Math.floor(progressValue.current.value);
  };

  useEffect(() => {
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    gsap.registerPlugin(CustomEase, SplitText, ScrollTrigger);
    CustomEase.create("hop", "0.9, 0, 0.1, 1");

    const imageContainers = document.querySelectorAll(
      `.${styles.imageContainer}`,
    );
    imageContainers.forEach((el) => {
      el.style.willChange = "clip-path";
    });

    const widths = idleRefs.current.map((el) => el?.offsetWidth || 0);
    const totalWidth =
      widths.reduce((sum, w) => sum + w, 0) + LETTER_GAP * (widths.length - 1);

    let cursor = -totalWidth / 2;
    const startX = widths.map((w) => {
      const center = cursor + w / 2;
      cursor += w + LETTER_GAP;
      return center;
    });

    outerRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.set(el, {
        xPercent: -50,
        yPercent: -50,
        x: startX[i],
        y: 0,
        rotation: 0,
        autoAlpha: 0,
      });
    });

    if (rGreenRef.current) {
      gsap.set(rGreenRef.current, { clipPath: "inset(100% 0% 0% 0%)" });
    }

    gsap.set(scrollIndicatorRef.current, { autoAlpha: 0, yPercent: 60 });
    gsap.set(navRef.current?.querySelectorAll(".link"), {
      autoAlpha: 0,
      yPercent: 40,
    });

    document.body.style.overflow = "hidden";

    const runExitAnimation = () => {
      document.body.style.overflow = "";

      const counterRefCurrent = counterRef.current;
      counterRefCurrent.innerText = "100";
      const counterSplit = SplitText.create(counterRefCurrent, {
        type: "chars",
        charsClass: "char",
        mask: "chars",
      });

      const exitTl = gsap.timeline({
        onComplete: () => ScrollTrigger.refresh(),
      });

      exitTl
        .to(
          `.${styles.imageContainer}`,
          {
            clipPath: "polygon(35% 35%, 65% 35%, 65% 65%, 35% 65%)",
            duration: 1.5,
            ease: "hop",
          },
          "+=1",
        )
        .to(
          progressBarRef.current,
          { scaleX: 0, duration: 1.5, ease: "power4.inOut" },
          "<",
        )
        .to(
          `.${styles.imageContainer}`,
          {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            duration: 2,
            ease: "hop",
          },
          "+=0.5",
        )
        .to(
          counterSplit.chars,
          {
            x: "-100%",
            duration: 0.75,
            ease: "power3.out",
            stagger: 0.1,
            onComplete: () => {
              gsap.delayedCall(0.1, () =>
                preloaderCounterRef.current?.remove(),
              );
              imageContainers.forEach((el) => (el.style.willChange = "auto"));
            },
          },
          "<",
        )
        .to(
          outerRefs.current,
          {
            autoAlpha: 1,
            duration: 1,
            stagger: 0.08,
            ease: "power3.out",
          },
          "-=1",
        )
        .to(
          navRef.current?.querySelectorAll(".link"),
          {
            autoAlpha: 1,
            yPercent: 0,
            duration: 0.9,
            ease: "power4.out",
            stagger: 0.1,
          },
          "-=0.6",
        )
        .fromTo(
          scrollIndicatorRef.current,
          { autoAlpha: 0, y: 40 },
          { autoAlpha: 1, y: 0, duration: 1, ease: "power4.out" },
          "-=0.5",
        );

      const layers = document.querySelectorAll(`.${styles.parallax}`);
      const setters = Array.from(layers).map((layer) => {
        const depth = Number(layer.dataset.depth) || 0.05;
        layer.style.willChange = "transform";
        return {
          depth,
          x: gsap.quickSetter(layer, "x", "px"),
          y: gsap.quickSetter(layer, "y", "px"),
        };
      });

      let rafId = null;
      let mouseX = 0;
      let mouseY = 0;

      const onMouseMove = (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;

        if (rafId) return;
        rafId = requestAnimationFrame(() => {
          setters.forEach(({ depth, x: setX, y: setY }) => {
            setX(-mouseX * depth * 180);
            setY(-mouseY * depth * 150);
          });
          rafId = null;
        });
      };

      window.addEventListener("mousemove", onMouseMove, { passive: true });

      return () => {
        window.removeEventListener("mousemove", onMouseMove);
        if (rafId) cancelAnimationFrame(rafId);
        layers.forEach((layer) => (layer.style.willChange = "auto"));
      };
    };

    const loadTl = gsap.timeline({ onComplete: runExitAnimation });

    loadTl
      .to(progressValue.current, {
        value: 100,
        duration: 2.5,
        ease: "power2.inOut",
        onUpdate: updateCounter,
      })
      .to(
        progressBarRef.current,
        { scaleX: 1, duration: 2.5, ease: "power2.inOut" },
        "<",
      );

    // --- Letter Animation on Scroll  ---
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: animatedSecionRef.current,
        start: "top top",
        end: "+=150%",
        scrub: 0.6,
        markers: true,
      },
    });

    outerRefs.current.forEach((el, i) => {
      if (!el) return;
      const { x, y, r } = getFinalTransform(i);
      scrollTl.to(
        el,
        {
          x: `${x}vw`,
          y: `${y}vh`,
          rotation: r,
          duration: 1,
          ease: "power1.inOut",
        },
        0,
      );
    });

    // R: white -> green, revealed bottom to top, finishing as scroll ends
    if (rGreenRef.current) {
      scrollTl.fromTo(
        rGreenRef.current,
        { clipPath: "inset(100% 0% 0% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 0.6, ease: "none" },
        0.4,
      );
    }

    return () => {
      gsap.killTweensOf("*");
      ScrollTrigger.getAll().forEach((st) => st.kill());
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <Navbar ref={navRef} />

      <div className={styles.preloaderCounter} ref={preloaderCounterRef}>
        <h1 ref={counterRef}>0</h1>
      </div>

      <div className={styles.animatedSection} ref={animatedSecionRef}>
        {/* Section 1 — top image */}
        <div className={styles.section}>
          <div className={clsx(styles.bg, styles.imageContainer)}>
            <Image
              src={bgImage}
              fill
              priority
              placeholder="blur"
              alt=""
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
          </div>

          <div className={styles.progressBar} ref={progressBarRef}>
            <div className={styles.progress} />
          </div>
        </div>

        {/* The letters*/}
        <div className={styles.animatedLetters}>
          {LETTERS.map((letter, i) => (
            <div
              key={i}
              className={styles.letterOuter}
              ref={(el) => (outerRefs.current[i] = el)}
            >
              <div
                className={styles.letterIdle}
                ref={(el) => (idleRefs.current[i] = el)}
              >
                <span className={styles.letterChar}>{letter.char}</span>
                {letter.isR && (
                  <span
                    className={clsx(styles.letterChar, styles.letterCharGreen)}
                    ref={rGreenRef}
                    aria-hidden="true"
                  >
                    {letter.char}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Section 2 — bottom image */}
        <div className={styles.section}>
          <div className={clsx(styles.bg, styles.imageContainer)}>
            <Image
              src={bgImage}
              fill
              placeholder="blur"
              alt=""
              style={{
                objectFit: "cover",
                objectPosition: "center",
                transform: "scaleY(-1)",
              }}
            />
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.introSection}></div>
      </div>

      <div className={styles.section}>
        <div className={styles.section}></div>
      </div>
    </div>
  );
}
