"use client";

import Image from "next/image";
import styles from "./hero.module.css";
import { clsx } from "clsx";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/all";
import { useEffect, useRef, useCallback } from "react";
import Navbar from "@/components/Navbar/Navbar";

import bgImage from "../../../public/bg2.jpg";

const LETTERS = [
  { char: "H" },
  { char: "A" },
  { char: "R", isR: true },
  { char: "S" },
  { char: "H" },
];

const LETTER_GAP = 40;
const U_SPREAD = 18;
const U_DEPTH = 35;
const U_DROP = 45;
const U_TILT = 5;

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
  const imageAnimationSectionRef = useRef(null);
  const rowRefs = useRef([]);
  const textWrapperRef = useRef(null);

  const horizontalPinRef = useRef(null);
  const horizontalTrackRef = useRef(null);
  const horizontalLineRef = useRef(null);

  const outerRefs = useRef([]);
  const idleRefs = useRef([]);
  const rGreenRef = useRef(null);

  const updateCounter = () => {
    if (counterRef.current)
      counterRef.current.textContent = Math.floor(progressValue.current.value);
  };

  const generateRows = useCallback(() => {
    const rows = [];
    for (let i = 1; i <= 3; i++) {
      rows.push(
        <div
          className={styles.imageAnimationRows}
          key={i}
          ref={(el) => (rowRefs.current[i - 1] = el)}
        >
          <div className={clsx(styles.card, styles.cardleft)} data-side="left">
            <img
              src={`/row-img-${2 * i - 1}.jpg`}
              alt=""
              className={styles.rowImages}
              loading="lazy"
            />
          </div>
          <div
            className={clsx(styles.card, styles.cardRight)}
            data-side="right"
          >
            <img
              src={`/row-img-${2 * i}.jpg`}
              alt=""
              className={styles.rowImages}
              loading="lazy"
            />
          </div>
        </div>,
      );
    }
    return rows;
  }, []);

  useEffect(() => {
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    gsap.registerPlugin(CustomEase, SplitText, ScrollTrigger);
    CustomEase.create("hop", "0.9, 0, 0.1, 1");

    document.body.style.overflow = "hidden";

    const rafId = requestAnimationFrame(() => {
      const imageContainers = document.querySelectorAll(
        `.${styles.imageContainer}`,
      );
      imageContainers.forEach((el) => {
        el.style.willChange = "clip-path, transform";
      });

      const widths = idleRefs.current.map((el) => el?.offsetWidth || 100);
      const totalWidth =
        widths.reduce((sum, w) => sum + w, 0) +
        LETTER_GAP * (widths.length - 1);

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
          force3D: true,
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

      const runExitAnimation = () => {
        document.body.style.overflow = "";

        const counterRefCurrent = counterRef.current;
        if (!counterRefCurrent) return;
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
              duration: 1.2,
              ease: "hop",
            },
            "+=0.5",
          )
          .to(
            progressBarRef.current,
            { scaleX: 0, duration: 1.2, ease: "power4.inOut" },
            "<",
          )
          .to(
            `.${styles.imageContainer}`,
            {
              clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
              duration: 1.5,
              ease: "hop",
            },
            "+=0.3",
          )
          .to(
            counterSplit.chars,
            {
              x: "-100%",
              duration: 0.6,
              ease: "power3.out",
              stagger: 0.08,
              onComplete: () => {
                preloaderCounterRef.current?.remove();
                imageContainers.forEach((el) => (el.style.willChange = "auto"));
              },
            },
            "<",
          )
          .to(
            outerRefs.current,
            {
              autoAlpha: 1,
              duration: 0.8,
              stagger: 0.06,
              ease: "power3.out",
            },
            "-=0.8",
          )
          .to(
            navRef.current?.querySelectorAll(".link"),
            {
              autoAlpha: 1,
              yPercent: 0,
              duration: 0.8,
              ease: "power4.out",
              stagger: 0.08,
            },
            "-=0.5",
          )
          .fromTo(
            scrollIndicatorRef.current,
            { autoAlpha: 0, y: 30 },
            { autoAlpha: 1, y: 0, duration: 0.8, ease: "power4.out" },
            "-=0.4",
          );

        const layers = document.querySelectorAll(`.${styles.parallax}`);
        layers.forEach((layer) => {
          layer.style.willChange = "transform";
        });

        let mouseX = 0;
        let mouseY = 0;
        let mouseRafId = null;

        const onMouseMove = (e) => {
          mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
          mouseY = (e.clientY / window.innerHeight - 0.5) * 2;

          if (mouseRafId) return;
          mouseRafId = requestAnimationFrame(() => {
            layers.forEach((layer) => {
              const depth = Number(layer.dataset.depth) || 0.05;
              const setX = gsap.quickSetter(layer, "x", "px");
              const setY = gsap.quickSetter(layer, "y", "px");
              setX(-mouseX * depth * 180);
              setY(-mouseY * depth * 150);
            });
            mouseRafId = null;
          });
        };

        window.addEventListener("mousemove", onMouseMove, { passive: true });

        return () => {
          window.removeEventListener("mousemove", onMouseMove);
          if (mouseRafId) cancelAnimationFrame(mouseRafId);
          layers.forEach((layer) => (layer.style.willChange = "auto"));
        };
      };

      const loadTl = gsap.timeline({ onComplete: runExitAnimation });

      loadTl
        .to(progressValue.current, {
          value: 100,
          duration: 2,
          ease: "power2.inOut",
          onUpdate: updateCounter,
        })
        .to(
          progressBarRef.current,
          { scaleX: 1, duration: 2, ease: "power2.inOut" },
          "<",
        );

      // --- Letter Animation on Scroll ---
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: animatedSecionRef.current,
          start: "top top",
          end: "+=150%",
          scrub: 0.5,
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
            force3D: true,
          },
          0,
        );
      });

      if (rGreenRef.current) {
        scrollTl.fromTo(
          rGreenRef.current,
          { clipPath: "inset(100% 0% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 0.6, ease: "none" },
          0.4,
        );
      }

      if (
        horizontalPinRef.current &&
        horizontalTrackRef.current &&
        horizontalLineRef.current
      ) {
        gsap.set(horizontalTrackRef.current, { xPercent: 0, force3D: true });
        gsap.set(horizontalLineRef.current, { attr: { x2: 0 } });

        const horizontalTl = gsap.timeline({
          scrollTrigger: {
            trigger: horizontalPinRef.current,
            start: "top top",
            end: "+=200%",
            scrub: true,
            pin: true,
            anticipatePin: 1,
          },
        });

        horizontalTl
          .to(
            horizontalTrackRef.current,
            { xPercent: -50, ease: "none", duration: 1 },
            0,
          )
          .to(
            horizontalLineRef.current,
            { attr: { x2: 50 }, ease: "none", duration: 1 },
            0,
          );
      }

      const animateImagesOnScrollSettings = {
        trigger: imageAnimationSectionRef.current,
        start: "top 25%",
        toggleActions: "play reverse play reverse",
      };

      const leftXValues = [-800, -900, -400];
      const rightXValues = [800, 900, 400];
      const leftRotationValues = [-30, -20, -35];
      const rightRotationValues = [30, 20, 35];
      const yValues = [100, -150, -400];

      rowRefs.current.forEach((row, index) => {
        if (!row) return;
        const cardLeft = row.querySelector('[data-side="left"]');
        const cardRight = row.querySelector('[data-side="right"]');

        if (cardLeft) {
          gsap.to(cardLeft, {
            x: leftXValues[index],
            y: yValues[index],
            rotate: leftRotationValues[index],
            force3D: true,
            scrollTrigger: {
              trigger: imageAnimationSectionRef.current,
              start: "top center",
              end: "150% bottom",
              scrub: true,
            },
          });
        }

        if (cardRight) {
          gsap.to(cardRight, {
            x: rightXValues[index],
            y: yValues[index],
            rotate: rightRotationValues[index],
            force3D: true,
            scrollTrigger: {
              trigger: imageAnimationSectionRef.current,
              start: "top center",
              end: "150% bottom",
              scrub: true,
            },
          });
        }
      });

      if (textWrapperRef.current) {
        gsap.to(textWrapperRef.current.querySelectorAll("p"), {
          y: 0,
          stagger: 0.08,
          duration: 0.4,
          ease: "power1.out",
          scrollTrigger: animateImagesOnScrollSettings,
        });
      }
    });

    return () => {
      cancelAnimationFrame(rafId);
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

      <div className={styles.horizontalPin} ref={horizontalPinRef}>
        <div className={styles.horizontalViewport}>
          <svg
            className={styles.horizontalLineSvg}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <line
              ref={horizontalLineRef}
              x1="0"
              y1="50"
              x2="0"
              y2="50"
              vectorEffect="non-scaling-stroke"
              className={styles.horizontalLine}
            />
          </svg>

          <div className={styles.horizontalTrack} ref={horizontalTrackRef}>
            <div className={styles.horizontalPanel}>
              <div className={clsx(styles.bg, styles.imageContainer)}>
                <Image
                  src={bgImage}
                  fill
                  placeholder="blur"
                  alt=""
                  style={{ objectFit: "cover", objectPosition: "center" }}
                />
              </div>
            </div>

            <div className={styles.horizontalPanel}>
              <div className={clsx(styles.bg, styles.imageContainer)}>
                <Image
                  src={bgImage}
                  fill
                  placeholder="blur"
                  alt=""
                  style={{
                    objectFit: "cover",
                    objectPosition: "center",
                    transform: "scaleX(-1)",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.imageAnimationWrapper}>
        <div
          className={styles.imageAnimationSection}
          ref={imageAnimationSectionRef}
        >
          <div className={styles.imageAnimationContent}>
            <div className={styles.imageAnimationText} ref={textWrapperRef}>
              <div className={styles.imageAnimationTextLine}>
                <p>My Interests:</p>
              </div>
              <div className={styles.imageAnimationTextLine}>
                <p>ML, Quant Dev, and Frontend Dev</p>
              </div>
              <div className={styles.imageAnimationTextLine}>
                <p>My projects and technical write-ups on these topics</p>
              </div>
            </div>
          </div>
          {generateRows()}
        </div>
      </div>
    </div>
  );
}
