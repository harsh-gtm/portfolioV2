"use client";

import Image from "next/image";
import styles from "./hero.module.css";
import { clsx } from "clsx";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/all";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import slideInOut from "../../components/PageTransition/PageTransition";

import bgImage from "../../../public/bg.png";
import innerLayer from "../../../public/innerLayer_v2.png";
import outerLayer from "../../../public/OuterLayer.png";
import { useTransitionRouter } from "next-view-transitions";
import Info from "./sections/info/info";
import Initatives from "./sections/initiatives/initatives";

const NAV_ITEMS = [
  {
    label: "Who am I?",
    href: "/about",
    description:
      "A deeper look into who I am — my background, values, and what drives me to build things.",
  },
  {
    label: "Projects",
    href: "/projects",
    description:
      "A showcase of things I've built — from experiments to finished work. Dig into the details.",
  },
  {
    label: "Blog",
    href: "/blog",
    description: "Writing about what I'm learning and building.",
  },
];

export default function Hero({ onHoverChange }) {
  const router = useTransitionRouter();
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const progressValue = useRef({ value: 0 });
  const counterRef = useRef(null);
  const preloaderCounterRef = useRef(null);
  const progressBarRef = useRef(null);
  const hiRef = useRef(null);
  const navRef = useRef(null);

  const updateCounter = () => {
    if (counterRef.current)
      counterRef.current.textContent = Math.floor(progressValue.current.value);
  };

  const handleEnter = (i) => {
    setHoveredIndex(i);
    onHoverChange(true);
  };

  const handleLeave = () => {
    setHoveredIndex(null);
    onHoverChange(false);
  };

  useEffect(() => {
    gsap.registerPlugin(CustomEase, SplitText);
    CustomEase.create("hop", "0.9, 0, 0.1, 1");

    gsap.set(`.${styles.imageContainer}`, { willChange: "clip-path" });
    gsap.set(hiRef.current, { autoAlpha: 0, yPercent: 60 });
    gsap.set(navRef.current?.querySelectorAll("li"), {
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
              (gsap.delayedCall(0.1, () =>
                preloaderCounterRef.current?.remove(),
              ),
                document
                  .querySelectorAll(`.${styles.imageContainer}`)
                  .forEach((el) => (el.style.willChange = "auto")));
            },
          },
          "<",
        )
        .to(
          hiRef.current,
          { autoAlpha: 1, yPercent: 0, duration: 1.2, ease: "power4.out" },
          "-=1",
        )
        .to(
          navRef.current?.querySelectorAll("li"),
          {
            autoAlpha: 1,
            yPercent: 0,
            duration: 0.9,
            ease: "power4.out",
            stagger: 0.1,
          },
          "-=0.6",
        );

      // Parallax
      const layers = document.querySelectorAll(`.${styles.parallax}`);
      const setters = Array.from(layers).map((layer) => {
        const depth = Number(layer.dataset.depth) || 0.05;
        const isInnerLayer = layer.classList.contains(styles.innerLayer);
        return {
          depth,
          baseX: isInnerLayer ? 47 : 0,
          x: gsap.quickSetter(layer, "x", "px"),
          y: gsap.quickSetter(layer, "y", "px"),
        };
      });

      const handleMouseMove = (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        setters.forEach(({ depth, baseX, x: setX, y: setY }) => {
          setX(baseX - x * depth * 180);
          setY(-y * depth * 150);
        });
      };

      window.addEventListener("mousemove", handleMouseMove);
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
  }, []);

  return (
    <div>
      <main className={styles.main}>
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
          <h2 className={styles.hi} ref={hiRef}>
            Harsh Gautam
          </h2>

          {/* <nav>
            <ul className={styles.navList} ref={navRef}>
              {NAV_ITEMS.map((item, i) => (
                <li
                  key={item.label}
                  className={styles.navItem}
                  onMouseEnter={() => handleEnter(i)}
                  onMouseLeave={handleLeave}
                  onClick={(e) => {
                    e.preventDefault();
                    router.push(item.href, { onTransitionReady: slideInOut });
                  }}
                >
                  <span className={styles.navLabel}>{item.label}</span>

                  <div
                    className={clsx(
                      styles.infoCard,
                      hoveredIndex === i && styles.infoCardVisible,
                    )}
                  >
                    <p className={styles.infoCardTitle}>{item.label}</p>
                    <p className={styles.infoCardDesc}>{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </nav>*/}
        </div>

        <div className={styles.progressBar} ref={progressBarRef}>
          <div className={styles.progress} />
        </div>
      </main>

      <Info />
      <Initatives />
    </div>
  );
}
