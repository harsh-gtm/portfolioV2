"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./styles.module.css";
import image1 from "../../../public/aboutME.png";
import image2 from "../../../public/ascii-magic-3.png";
import image3 from "../../../public/ascii-magic-4.png";
import image4 from "../../../public/ascii-magic-6.png";
import Navbar from "@/components/Navbar/Navbar";

gsap.registerPlugin(ScrollTrigger);

const spotlightItems = [
  { name: "Data Science", img: image1.src },
  { name: "Machine Learning", img: image2.src },
  { name: "Web Development", img: image3.src },
  { name: "Quantitative Finance", img: image4.src },
];

export default function Sectiontwo() {
  const rootRef = useRef(null);
  const spotlightRef = useRef(null);
  const introTextRefs = useRef([]);
  const bgWrapperRef = useRef(null);
  const bgImgRef = useRef(null);
  const titlesContainerRef = useRef(null);
  const titlesWrapperRef = useRef(null);
  const linesWrapperRef = useRef(null);
  const headerRef = useRef(null);
  const titleRefs = useRef([]);
  const imgRefs = useRef([]);
  const lineTopRef = useRef(null);
  const lineBottomRef = useRef(null);
  const navRef = useRef(null);
  const paragraphRefs = useRef([]);

  // New refs — replace string selectors (".aboutme", ".container",
  // ".text-block .word", ".scroll-indicator") that broke once class
  // names became hashed by CSS Modules.
  const aboutmeRef = useRef(null);
  const containerRef = useRef(null);
  const textBlockRef = useRef(null);
  const scrollIndicatorRef = useRef(null);

  useEffect(() => {
    let handleResize = () => {};

    const ctx = gsap.context(() => {
      const introTextElements = introTextRefs.current;
      const titleElements = titleRefs.current;
      const imageElements = imgRefs.current;
      let currentActiveIndex = 0;

      const LEFT_MARGIN = 96;
      const ARC_BULGE = 220;
      const ARC_X_OFFSET = 150;

      const PHASE1_END = 0.2;
      const PHASE2_END = 0.95;

      const FADE_BUFFER_RATIO = 0.25;
      const OVERLAP_FACTOR = 0.5;
      const numImages = spotlightItems.length;
      const activeSpan =
        1 / ((numImages - 1) * OVERLAP_FACTOR + (1 + FADE_BUFFER_RATIO));
      const stagger = OVERLAP_FACTOR * activeSpan;

      const arcConfig = {
        startX: 0,
        startY: 0,
        endY: 0,
        controlX: 0,
        controlY: 0,
      };

      gsap.set(navRef.current?.querySelectorAll(".link"), {
        autoAlpha: 0,
        yPercent: 40,
      });

      function getBezierPosition(t) {
        const x =
          (1 - t) * (1 - t) * arcConfig.startX +
          2 * (1 - t) * t * arcConfig.controlX +
          t * t * arcConfig.startX;
        const y =
          (1 - t) * (1 - t) * arcConfig.startY +
          2 * (1 - t) * t * arcConfig.controlY +
          t * t * arcConfig.endY;
        return { x, y };
      }

      function getImgProgressState(index, overallProgress) {
        const startTime = index * stagger;
        return (overallProgress - startTime) / activeSpan;
      }

      function resetImages() {
        imageElements.forEach((img) => gsap.set(img, { opacity: 0 }));
      }

      function applyTitleSpacing() {
        titleElements.forEach((title, i) => {
          if (i < titleElements.length - 1) {
            title.style.marginBottom = `20px`;
          }
        });
      }

      function resetTitles() {
        const initialY = window.innerHeight;
        gsap.set(titlesWrapperRef.current, {
          transform: `translateY(${initialY}px)`,
        });
        titleElements.forEach((title, i) => {
          title.classList.toggle(styles.isActive, i === 0);
        });
        currentActiveIndex = 0;
        if (bgImgRef.current) bgImgRef.current.src = spotlightItems[0].img;
      }

      resetImages();
      gsap.set(titlesContainerRef.current, { opacity: 0 });
      gsap.set(headerRef.current, { opacity: 0 });
      gsap.set(linesWrapperRef.current, { opacity: 0 });
      resetTitles();

      let isRevealed = false;

      function showTitles() {
        if (isRevealed) return;
        gsap.to(
          [
            headerRef.current,
            linesWrapperRef.current,
            titlesContainerRef.current,
          ],
          {
            opacity: 1,
            duration: 0.2,
            ease: "power2.out",
            overwrite: true,
          },
        );
        isRevealed = true;
      }

      function hideTitles() {
        if (!isRevealed) return;
        gsap.to(
          [
            headerRef.current,
            linesWrapperRef.current,
            titlesContainerRef.current,
          ],
          {
            opacity: 0,
            duration: 0.2,
            ease: "power2.out",
            overwrite: true,
          },
        );
        isRevealed = false;
      }

      const tl = gsap.timeline();

      tl.to(navRef.current?.querySelectorAll(".link"), {
        autoAlpha: 1,
        yPercent: 0,
        duration: 0.9,
        ease: "power4.out",
        stagger: 0.1,
        delay: 0.5,
      });

      ScrollTrigger.create({
        trigger: spotlightRef.current,
        start: "top top",
        end: `+=${window.innerHeight * 10}`,
        pin: true,
        pinSpacing: true,
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;

          if (progress > PHASE1_END && progress <= PHASE2_END) {
            showTitles();
          } else {
            hideTitles();
          }

          if (progress <= PHASE1_END) {
            const animationProgress = progress / PHASE1_END;
            const moveDistance = window.innerWidth * 0.6;

            gsap.set(introTextElements[0], {
              x: -animationProgress * moveDistance,
              opacity: 1,
            });
            gsap.set(introTextElements[1], {
              x: animationProgress * moveDistance,
              opacity: 1,
            });

            gsap.set(bgWrapperRef.current, {
              transform: `scale(${animationProgress})`,
            });
            gsap.set(bgImgRef.current, {
              transform: `scale(${1.5 - animationProgress * 0.5})`,
            });

            resetImages();
            resetTitles();
          } else if (progress <= PHASE2_END) {
            gsap.set(bgWrapperRef.current, { transform: "scale(1)" });
            gsap.set(bgImgRef.current, { transform: "scale(1)" });
            gsap.set(introTextElements[0], { opacity: 0 });
            gsap.set(introTextElements[1], { opacity: 0 });

            const switchProgress =
              (progress - PHASE1_END) / (PHASE2_END - PHASE1_END);
            const viewportHeight = window.innerHeight;
            const titlesContainerHeight = titlesWrapperRef.current.scrollHeight;
            const startPosition = viewportHeight - 100;
            const targetPosition = -titlesContainerHeight;
            const totalDistance = startPosition - targetPosition;
            const currentY = startPosition - switchProgress * totalDistance;

            gsap.set(titlesWrapperRef.current, {
              transform: `translateY(${currentY}px)`,
            });

            imageElements.forEach((img, index) => {
              const imageProgress = getImgProgressState(index, switchProgress);

              let opacity;
              if (imageProgress < 0) {
                opacity =
                  1 - Math.min(1, Math.abs(imageProgress) / FADE_BUFFER_RATIO);
              } else if (imageProgress > 1) {
                opacity =
                  1 - Math.min(1, (imageProgress - 1) / FADE_BUFFER_RATIO);
              } else {
                opacity = 1;
              }

              if (opacity <= 0) {
                gsap.set(img, { opacity: 0 });
              } else {
                const pos = getBezierPosition(imageProgress);
                gsap.set(img, {
                  x: pos.x - 70,
                  y: pos.y - 50,
                  opacity,
                });
              }
            });

            const viewportMiddle = viewportHeight / 2;
            let closestIndex = 0;
            let closestDistance = Infinity;

            titleElements.forEach((title, index) => {
              const titleRect = title.getBoundingClientRect();
              const titleCenter = titleRect.top + titleRect.height / 2;
              const distanceFromCenter = Math.abs(titleCenter - viewportMiddle);
              if (distanceFromCenter < closestDistance) {
                closestDistance = distanceFromCenter;
                closestIndex = index;
              }
            });

            if (closestIndex !== currentActiveIndex) {
              if (titleElements[currentActiveIndex]) {
                titleElements[currentActiveIndex].classList.remove(
                  styles.isActive,
                );
              }
              titleElements[closestIndex].classList.add(styles.isActive);
              bgImgRef.current.src = spotlightItems[closestIndex].img;
              currentActiveIndex = closestIndex;
            }
          } else {
            gsap.set(bgWrapperRef.current, { transform: "scale(1)" });
            gsap.set(bgImgRef.current, { transform: "scale(1)" });

            const titlesContainerHeight = titlesWrapperRef.current.scrollHeight;
            gsap.set(titlesWrapperRef.current, {
              transform: `translateY(${-titlesContainerHeight}px)`,
            });
            resetImages();
          }
        },
      });

      function positionLines() {
        const w = window.innerWidth;
        const h = window.innerHeight;
        const originX = LEFT_MARGIN + 140;
        const originY = h / 2;
        const wedgeEndX = w / 2;

        if (lineTopRef.current) {
          lineTopRef.current.setAttribute("x1", originX);
          lineTopRef.current.setAttribute("y1", originY);
          lineTopRef.current.setAttribute("x2", wedgeEndX);
          lineTopRef.current.setAttribute("y2", 0);
        }
        if (lineBottomRef.current) {
          lineBottomRef.current.setAttribute("x1", originX);
          lineBottomRef.current.setAttribute("y1", originY);
          lineBottomRef.current.setAttribute("x2", wedgeEndX);
          lineBottomRef.current.setAttribute("y2", h);
        }

        if (titlesContainerRef.current) {
          const containerLeft = originX;
          const containerWidth = w - originX;
          const wedgeFraction = (wedgeEndX - originX) / containerWidth;

          titlesContainerRef.current.style.left = `${containerLeft}px`;
          titlesContainerRef.current.style.width = `${containerWidth}px`;
          titlesContainerRef.current.style.clipPath = `polygon(
            0% 50%,
            ${wedgeFraction * 100}% 0%,
            100% 0%,
            100% 100%,
            ${wedgeFraction * 100}% 100%
          )`;
        }

        arcConfig.startX = wedgeEndX + ARC_X_OFFSET;
        arcConfig.startY = 0;
        arcConfig.endY = h;
        arcConfig.controlX = wedgeEndX + ARC_BULGE + ARC_X_OFFSET;
        arcConfig.controlY = h / 2;
      }

      handleResize = () => {
        positionLines();
        applyTitleSpacing();
      };

      positionLines();
      applyTitleSpacing();
      window.addEventListener("resize", handleResize);

      // Was: document-wide ".text-block .word" / ".scroll-indicator"
      // string queries — now scoped to this component's own refs, which
      // also sidesteps the CSS Modules hashed-class-name problem entirely.
      const words = textBlockRef.current.querySelectorAll(`.${styles.word}`);
      const scrollIndicatorEl = scrollIndicatorRef.current;

      const aboutTl = gsap.timeline({
        scrollTrigger: {
          trigger: aboutmeRef.current,
          start: "top top",
          end: "bottom bottom",
          pin: containerRef.current,
          pinSpacing: true,
          scrub: true,
          onUpdate: (self) => {
            if (scrollIndicatorEl) {
              scrollIndicatorEl.style.setProperty("--progress", self.progress);
            }
          },
        },
      });

      aboutTl.to(words, {
        opacity: 1,
        stagger: 0.02,
        ease: "none",
      });
    }, rootRef);

    return () => {
      window.removeEventListener("resize", handleResize);
      ctx.revert();
    };
  }, []);

  return (
    <div ref={rootRef}>
      <div className={`${styles.intro} spotlight`} ref={spotlightRef}>
        <div className={styles.introTextWrapper}>
          <p
            className={styles.introText}
            ref={(el) => (introTextRefs.current[0] = el)}
          >
            About
          </p>
          <p
            className={styles.introText}
            ref={(el) => (introTextRefs.current[1] = el)}
          >
            Me
          </p>
        </div>

        <div
          className={`${styles.introBgImage} spotlight-bg-img`}
          ref={bgWrapperRef}
        >
          <img
            ref={bgImgRef}
            src={spotlightItems[0].img}
            alt=""
            className="object-cover absolute w-full h-full overflow-hidden will-change-transform"
          />
        </div>

        <div
          className={styles.spotlightTitlesContainer}
          ref={titlesContainerRef}
        >
          <div className={styles.spotlightTitles} ref={titlesWrapperRef}>
            {spotlightItems.map((item, index) => (
              <h1
                key={item.name}
                ref={(el) => (titleRefs.current[index] = el)}
                className={index === 0 ? styles.isActive : ""}
              >
                {item.name}
              </h1>
            ))}
          </div>
        </div>

        <div className={styles.spotlightLinesWrapper} ref={linesWrapperRef}>
          <svg className="spotlight-lines" width="100%" height="100%">
            <line ref={lineTopRef} className={styles.spotlightLine} />
            <line ref={lineBottomRef} className={styles.spotlightLine} />
          </svg>
        </div>

        <div className={styles.spotlightImages}>
          {spotlightItems.map((item, index) => (
            <div
              className={styles.spotlightImg}
              key={item.name}
              ref={(el) => (imgRefs.current[index] = el)}
            >
              <img src={item.img} alt="" />
            </div>
          ))}
        </div>

        <div className={styles.spotlightHeader} ref={headerRef}>
          <p>My Interests</p>
        </div>
      </div>

      <div className={styles.aboutme} ref={aboutmeRef}>
        <div className={styles.container} ref={containerRef}>
          <div className={styles.hero}>
            <nav className={styles.aboutmeNav} ref={navRef}>
              <div className={styles.positionsNav}>
                <h1>Positions</h1>
                <p>- Disent: Frontend Development</p>
                <p>- Somy Technologies: Frontend Development</p>
                <p>- FIRST Robotics (Competed Internationally): 2021-2025</p>
              </div>

              <div className={styles.awardsNav}>
                <h1>Awards</h1>
                <p>- Lockheed Martin CyberQuest 1st Place: 2024</p>
              </div>

              <div
                className={styles.scrollIndicator}
                ref={scrollIndicatorRef}
              ></div>
            </nav>
            <div className={styles.aboutText}>
              <div className={styles.textBlock} ref={textBlockRef}>
                {[
                  `Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.`,
                  `Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.`,
                  `Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.`,
                ].map((text, pIndex) => (
                  <p
                    key={pIndex}
                    ref={(el) => (paragraphRefs.current[pIndex] = el)}
                  >
                    {text.split(" ").map((word, wIndex) => (
                      <span
                        key={wIndex}
                        className={styles.word}
                        style={{
                          opacity: 0,
                          display: "inline-block",
                          marginRight: "0.25em",
                        }}
                      >
                        {word}
                      </span>
                    ))}
                  </p>
                ))}
              </div>
            </div>

            <div className="marquee">
              <div className="marquee-track"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
