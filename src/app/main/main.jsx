"use client";

import Image from "next/image";
import styles from "./hero.module.css";
import { clsx } from "clsx";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/all";
import { useEffect, useRef, useState } from "react";
import { useTransitionRouter } from "next-view-transitions";
import Info from "./sections/info/info";
import Initatives from "./sections/initiatives/initatives";
import Navbar from "@/components/Navbar/Navbar";

import bgImage from "../../../public/bg.png";
import innerLayer from "../../../public/innerLayer_v2.png";
import outerLayer from "../../../public/OuterLayer.png";

export default function Hero() {
  const router = useTransitionRouter();
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const progressValue = useRef({ value: 0 });
  const counterRef = useRef(null);
  const preloaderCounterRef = useRef(null);
  const progressBarRef = useRef(null);
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const navRef = useRef(null);
  const scrollIndicatorRef = useRef(null);

  const updateCounter = () => {
    if (counterRef.current)
      counterRef.current.textContent = Math.floor(progressValue.current.value);
  };

  const handleEnter = (i) => {
    setHoveredIndex(i);
  };

  const handleLeave = () => {
    setHoveredIndex(null);
  };

  useEffect(() => {
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    gsap.registerPlugin(CustomEase, SplitText);
    CustomEase.create("hop", "0.9, 0, 0.1, 1");

    const imageContainers = document.querySelectorAll(
      `.${styles.imageContainer}`,
    );
    imageContainers.forEach((el) => {
      el.style.willChange = "clip-path";
    });

    gsap.set(firstNameRef.current, { autoAlpha: 0, yPercent: 60 });
    gsap.set(lastNameRef.current, { autoAlpha: 0, yPercent: 60 });
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

      const exitTl = gsap.timeline();

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
          [firstNameRef.current, lastNameRef.current],
          { autoAlpha: 1, yPercent: 0, duration: 1.2, ease: "power4.out" },
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
        const isInnerLayer = layer.classList.contains(styles.innerLayer);
        layer.style.willChange = "transform";
        return {
          depth,
          baseX: isInnerLayer ? 47 : 0,
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
          setters.forEach(({ depth, baseX, x: setX, y: setY }) => {
            setX(baseX - mouseX * depth * 180);
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
        value: 25,
        duration: 0.6,
        ease: "power2.out",
        onUpdate: updateCounter,
      })
      .to(progressBarRef.current, { scaleX: 0.25, duration: 0.6 }, "<")
      .to({}, { duration: 0.4 })
      .to(progressValue.current, {
        value: 60,
        duration: 0.8,
        ease: "power2.out",
        onUpdate: updateCounter,
      })
      .to(progressBarRef.current, { scaleX: 0.6, duration: 0.8 }, "<")
      .to({}, { duration: 0.5 })
      .to(progressValue.current, {
        value: 85,
        duration: 0.6,
        ease: "power2.out",
        onUpdate: updateCounter,
      })
      .to(progressBarRef.current, { scaleX: 0.85, duration: 0.6 }, "<")
      .to({}, { duration: 0.3 })
      .to(progressValue.current, {
        value: 100,
        duration: 1,
        ease: "power4.out",
        onUpdate: updateCounter,
      })
      .to(
        progressBarRef.current,
        { scaleX: 1, duration: 1, ease: "power4.out" },
        "<",
      );

    return () => {
      gsap.killTweensOf("*");
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div>
      <main className={styles.main}>
        <Navbar ref={navRef} />
        <div className={styles.vignette} />

        <div className={styles.preloaderCounter} ref={preloaderCounterRef}>
          <h1 ref={counterRef}>0</h1>
        </div>

        <Image
          src={bgImage}
          fill
          priority
          placeholder="blur"
          alt=""
          data-depth="0.03"
          className={clsx(styles.bg, styles.parallax, styles.imageContainer)}
          style={{ objectFit: "cover", objectPosition: "center" }}
        />

        <Image
          src={innerLayer}
          fill
          alt=""
          placeholder="blur"
          data-depth="0.06"
          className={clsx(
            styles.innerLayer,
            styles.parallax,
            styles.imageContainer,
          )}
          style={{ objectFit: "cover", objectPosition: "center" }}
        />

        <Image
          src={outerLayer}
          fill
          alt=""
          placeholder="blur"
          data-depth="0.1"
          className={clsx(
            styles.outerLayer,
            styles.parallax,
            styles.imageContainer,
          )}
          style={{ objectFit: "cover", objectPosition: "center" }}
        />

        <div className={styles.mainContent}>
          <h2 className={styles.firstName} ref={firstNameRef}>
            Harsh
          </h2>
          <h2 className={styles.lastName} ref={lastNameRef}>
            Gautam
          </h2>
        </div>

        <div className={styles.progressBar} ref={progressBarRef}>
          <div className={styles.progress} />
        </div>

        <div className={styles.scrollIndicator} ref={scrollIndicatorRef}>
          <span className={styles.scrollText}>scroll</span>
          <div className={styles.arrow}>↓</div>
        </div>
      </main>

      <Info />
      <Initatives />
    </div>
  );
}
