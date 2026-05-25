"use client";

import "./style.css";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import * as THREE from "three";
import { vertexShader, fragmentShader } from "./shaders";
import { content } from "./data";

export default function Sectiontwo() {
  const sliderRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(SplitText);

    const slider = sliderRef.current;
    if (!slider) return;

    // --- TEXT SPLITTING & ANIMATION HELPERS ---
    const splitTitle = (container) => {
      if (!container) return null;
      const heading = container.querySelector(".slide-title h1");
      if (!heading) return null;
      return SplitText.create(heading, {
        type: "words, chars",
        mask: "chars",
        wordsClass: "word",
        charsClass: "char",
      });
    };

    const splitDescription = (container) => {
      if (!container) return [];
      const paragraphs = container.querySelectorAll(".slide-description p");
      const allLines = [];
      paragraphs.forEach((p) => {
        const split = SplitText.create(p, {
          type: "lines",
          mask: "lines",
          linesClass: "line",
        });
        allLines.push(...split.lines);
      });
      return allLines;
    };

    const buildSlideContent = (slideData) => {
      const el = document.createElement("div");
      el.className = "slide-content";
      el.style.opacity = "0";
      el.innerHTML = `
        <div class="slide-title">
          <h1>${slideData.title}</h1>
        </div>
        <div class="slide-description">
          <p>${slideData.description}</p>
        </div>
      `;
      return el;
    };

    const animateTextOut = (container) => {
      const titleSplit = splitTitle(container);
      const lines = splitDescription(container);
      const tl = gsap.timeline();
      if (titleSplit) {
        tl.to(titleSplit.chars, {
          y: "-100%",
          duration: 0.6,
          stagger: 0.02,
          ease: "power2.inOut",
        });
      }
      tl.to(
        lines,
        {
          y: "-100%",
          duration: 0.6,
          stagger: 0.02,
          ease: "power2.inOut",
        },
        0.1,
      );
      return tl;
    };

    const animateTextIn = (container) => {
      const titleSplit = splitTitle(container);
      const lines = splitDescription(container);
      const chars = titleSplit ? titleSplit.chars : [];
      gsap.set([chars, lines], { y: "100%" });
      gsap.set(container, { opacity: 1 });
      const tl = gsap.timeline();
      tl.to(chars, {
        y: "0%",
        duration: 0.5,
        stagger: 0.02,
        ease: "power2.inOut",
      }).to(
        lines,
        {
          y: "0%",
          duration: 0.5,
          stagger: 0.05,
          ease: "power2.inOut",
        },
        0.1,
      );
      return tl;
    };

    // --- STATE & THREE.JS SETUP ---
    let currentIndex = 0;
    const slides = content;
    let isTransitioning = false;
    let rippleTween = null;
    let animationFrameId = null;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0.01, 10);
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    slider.prepend(renderer.domElement);

    const textures = [];
    const rippleConfig = {
      waveFreq: 25.0,
      wavePow: 0.035,
      waveWidth: 0.5,
      falloff: 10.0,
      boostStrength: 0.5,
      crossfadeWidth: 0.05,
      duration: 3.0,
      endValue: 1.0,
      ease: "power2.out",
    };

    let uniforms;
    let material;
    let plane;

    async function init() {
      const textureLoader = new THREE.TextureLoader();

      for (const slide of slides) {
        const texture = await new Promise((resolve) =>
          textureLoader.load(slide.image, resolve),
        );
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        textures.push(texture);
      }

      uniforms = {
        uTexCurrent: { value: textures[0] },
        uTexNext: { value: textures[1] || textures[0] },
        uProgress: { value: 0.0 },
        uResolution: { value: new THREE.Vector2() },
        uImageRes: { value: new THREE.Vector2(1920, 1280) },
        uWaveFreq: { value: rippleConfig.waveFreq },
        uWavePow: { value: rippleConfig.wavePow },
        uWaveWidth: { value: rippleConfig.waveWidth },
        uFalloff: { value: rippleConfig.falloff },
        uBoostStrength: { value: rippleConfig.boostStrength },
        uCrossfadeWidth: { value: rippleConfig.crossfadeWidth },
        uMobile: { value: window.innerWidth <= 1000 ? 1.0 : 0.0 },
      };

      material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms,
        transparent: true,
      });

      plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material);
      scene.add(plane);

      handleResize();
      window.addEventListener("resize", handleResize);
      window.addEventListener("wheel", handleScroll, { passive: false });

      animateInitialText();
      render();
    }

    function getMaxCornerDist() {
      const ratio = window.innerHeight / window.innerWidth;
      const cx = 0.5;
      const cy = 0.5 * ratio;
      return Math.sqrt(cx * cx + cy * cy);
    }

    function handleResize() {
      const width = slider.clientWidth;
      const height = slider.clientHeight;
      renderer.setSize(width, height);
      if (uniforms) {
        uniforms.uResolution.value.set(width, height);
        uniforms.uMobile.value = window.innerWidth <= 1000 ? 1.0 : 0.0;
      }
      rippleConfig.endValue = getMaxCornerDist() + rippleConfig.waveWidth;
      rippleConfig.duration = window.innerWidth <= 1000 ? 1.5 : 3.0;
    }

    function animateInitialText() {
      const initialSlide = slider.querySelector(".slide-content");
      if (!initialSlide) return;
      const initialTitle = splitTitle(initialSlide);
      const initialLines = splitDescription(initialSlide);

      if (initialTitle) {
        gsap.fromTo(
          initialTitle.chars,
          { y: "100%" },
          { y: "0%", duration: 0.8, stagger: 0.025, ease: "power2.out" },
        );
      }

      if (initialLines.length > 0) {
        gsap.fromTo(
          initialLines,
          { y: "100%" },
          {
            y: "0%",
            duration: 0.8,
            stagger: 0.025,
            ease: "power2.out",
            delay: 0.2,
          },
        );
      }
    }

    // --- TWO-WAY SCROLL DETECTION ---
    function handleScroll(e) {
      if (isTransitioning) return;
      if (Math.abs(e.deltaY) < 15) return; // Discard minor trackpad/scroll wheel artifacts

      let targetIndex = currentIndex;

      if (e.deltaY > 0) {
        // Scroll down -> Next Slide
        targetIndex = (currentIndex + 1) % slides.length;
      } else if (e.deltaY < 0) {
        // Scroll up -> Previous Slide
        targetIndex = (currentIndex - 1 + slides.length) % slides.length;
      }

      // Only transition if the index calculation points to a different slide
      if (targetIndex !== currentIndex) {
        e.preventDefault();
        runTransition(targetIndex);
      }
    }

    function runTransition(nextIndex) {
      isTransitioning = true;

      if (rippleTween) {
        rippleTween.kill();
        uniforms.uProgress.value = 0.0;
        rippleTween = null;
      }

      const currentSlide = slider.querySelector(".slide-content");
      const exitTimeline = animateTextOut(currentSlide);

      // Pre-assign correct textures based on movement direction
      uniforms.uTexCurrent.value = textures[currentIndex];
      uniforms.uTexNext.value = textures[nextIndex];
      uniforms.uProgress.value = 0.0;

      let clickUnlocked = false;

      rippleTween = gsap.to(uniforms.uProgress, {
        value: rippleConfig.endValue,
        duration: rippleConfig.duration,
        ease: rippleConfig.ease,
        delay: 0.3,
        onUpdate() {
          if (!clickUnlocked && uniforms.uProgress.value > 0.7) {
            clickUnlocked = true;
            currentIndex = nextIndex;
            isTransitioning = false;
          }
        },
        onComplete() {
          uniforms.uTexCurrent.value = textures[currentIndex];
          uniforms.uProgress.value = 0.0;
          rippleTween = null;

          if (!clickUnlocked) {
            currentIndex = nextIndex;
            isTransitioning = false;
          }
        },
      });

      exitTimeline.then(() => {
        if (currentSlide) currentSlide.remove();

        const nextSlide = buildSlideContent(slides[nextIndex]);
        slider.appendChild(nextSlide);

        requestAnimationFrame(() => {
          animateTextIn(nextSlide);
        });
      });
    }

    function render() {
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(render);
    }

    init();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("wheel", handleScroll);
      cancelAnimationFrame(animationFrameId);
      if (rippleTween) rippleTween.kill();
    };
  }, []);

  return (
    <div className="slider" ref={sliderRef}>
      <div className="slide-content">
        <div className="slide-title">
          <h1>{content[0].title}</h1>
        </div>
        <div className="slide-description">
          <p>{content[0].description}</p>
        </div>
      </div>
    </div>
  );
}
