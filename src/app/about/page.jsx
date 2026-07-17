"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./styles.css";
import image1 from "../../../public/aboutME.png";
import image2 from "../../../public/ascii-magic-3.png";
import image3 from "../../../public/ascii-magic-4.png";
import image4 from "../../../public/ascii-magic-6.png";

gsap.registerPlugin(ScrollTrigger);

const spotlightItems = [
  { name: "Data Science", img: image1.src },
  { name: "Machine Learning", img: image2.src },
  { name: "Web Development", img: image3.src },
  { name: "Quantitative Finance", img: image4.src },
];

export default function Sectiontwo() {
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

  useEffect(() => {
    const introTextElements = introTextRefs.current;
    const titleElements = titleRefs.current;
    const imageElements = imgRefs.current;
    let currentActiveIndex = 0;

    const LEFT_MARGIN = 96;
    const ARC_BULGE = 220;
    const ARC_X_OFFSET = 150;

    const arcConfig = {
        startX: 0,
        startY: 0,
        endY: 0,
        controlX: 0,
        controlY: 0,
      };

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
        const stagger = 0.2;
        const activeSpan = 0.6;

        const startTime = index * stagger;

        return (overallProgress - startTime) / activeSpan;
      }

    imageElements.forEach((img) => gsap.set(img, { opacity: 0 }));
    gsap.set(titlesContainerRef.current, { opacity: 0 });
    gsap.set(headerRef.current, { opacity: 0 });
    gsap.set(linesWrapperRef.current, { opacity: 0 });
    const initialY = window.innerHeight;
    gsap.set(titlesWrapperRef.current, { transform: `translateY(${initialY}px)` });

    let isRevealed = false;
    let revealTimeoutId = null;

    function showTitles() {
      if (revealTimeoutId) return;
      revealTimeoutId = setTimeout(() => {
        gsap.to([headerRef.current, linesWrapperRef.current, titlesContainerRef.current], {
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
        });
        isRevealed = true;
        revealTimeoutId = null;
      }, 500);
    }

    function hideTitles() {
      if (revealTimeoutId) {
        clearTimeout(revealTimeoutId);
        revealTimeoutId = null;
      }
      if (isRevealed) {
        gsap.to([headerRef.current, linesWrapperRef.current, titlesContainerRef.current], {
          opacity: 0,
          duration: 0.5,
          ease: "power2.out",
        });
        isRevealed = false;
      }
    }

    positionLines();

    const trigger = ScrollTrigger.create({
      trigger: spotlightRef.current,
      start: "top top",
      end: `+=${window.innerHeight * 10}`,
      pin: true,
      pinSpacing: true,
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;

        if (progress > 0.2 && progress <= 0.95) {
            showTitles();
          } else {
            hideTitles();
          }

        if (progress <= 0.2) {
          const animationProgress = progress / 0.2;
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
        } else if (progress > 0.25 && progress <= 0.95) {
          gsap.set(bgWrapperRef.current, { transform: "scale(1)" });
          gsap.set(bgImgRef.current, { transform: "scale(1)" });
          gsap.set(introTextElements[0], { opacity: 0 });
          gsap.set(introTextElements[1], { opacity: 0 });

          const switchProgress = (progress - 0.25) / 0.7;
          const viewportHeight = window.innerHeight;
          const titlesContainerHeight = titlesWrapperRef.current.scrollHeight;
          const startPosition = viewportHeight;
          const targetPosition = -titlesContainerHeight;
          const totalDistance = startPosition - targetPosition;
          const currentY = startPosition - switchProgress * totalDistance;

          gsap.set(titlesWrapperRef.current, {
            transform: `translateY(${currentY}px)`,
          });

          imageElements.forEach((img, index) => {
            const imageProgress = getImgProgressState(index, switchProgress);

            const FADE_BUFFER = 0.25;
            let opacity;
            if (imageProgress < 0) {
              opacity = 1 - Math.min(1, Math.abs(imageProgress) / FADE_BUFFER);
            } else if (imageProgress > 1) {
              opacity = 1 - Math.min(1, (imageProgress - 1) / FADE_BUFFER);
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
              titleElements[currentActiveIndex].classList.remove("is-active");
            }
            titleElements[closestIndex].classList.add("is-active");
            bgImgRef.current.src = spotlightItems[closestIndex].img;
            currentActiveIndex = closestIndex;
          }
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


    positionLines();
    window.addEventListener("resize", positionLines);

    return () => {
      trigger.kill();
      if (revealTimeoutId) clearTimeout(revealTimeoutId);
    };
  }, []);

  return (
    <div className="intro spotlight" ref={spotlightRef}>
      <div className="intro-text-wrapper">
        <p className="intro-text" ref={(el) => (introTextRefs.current[0] = el)}>
          About
        </p>
        <p className="intro-text" ref={(el) => (introTextRefs.current[1] = el)}>
          Me
        </p>
      </div>

      <div className="intro-bg-image spotlight-bg-img" ref={bgWrapperRef}>
        <img
          ref={bgImgRef}
          src={spotlightItems[0].img}
          alt=""
          className="object-cover absolute w-full h-full overflow-hidden will-change-transform"
        />
      </div>

      <div className="spotlight-titles-container" ref={titlesContainerRef}>
        <div className="spotlight-titles" ref={titlesWrapperRef}>
          {spotlightItems.map((item, index) => (
            <h1
              key={item.name}
              ref={(el) => (titleRefs.current[index] = el)}
              className={index === 0 ? "is-active" : ""}
            >
              {item.name}
            </h1>
          ))}
        </div>
      </div>

      <div className="spotlight-lines-wrapper" ref={linesWrapperRef}>
        <svg className="spotlight-lines" width="100%" height="100%">
          <line ref={lineTopRef} className="spotlight-line" />
          <line ref={lineBottomRef} className="spotlight-line" />
        </svg>
      </div>

      <div className="spotlight-images">
        {spotlightItems.map((item, index) => (
          <div
            className="spotlight-img"
            key={item.name}
            ref={(el) => (imgRefs.current[index] = el)}
          >
            <img src={item.img} alt="" />
          </div>
        ))}
      </div>

      <div className="spotlight-header" ref={headerRef}>
        <p>My Interests</p>
      </div>
    </div>
  );
}
