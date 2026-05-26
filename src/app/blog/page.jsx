"use client";

import "./style.css";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import * as THREE from "three";
import { vertexShader, fragmentShader } from "./shaders";
import { content } from "./data";

// ─── Color utility ────────────────────────────────────────────────────────────
// Deterministic HSL color seeded by a string (title).
// Same title always produces the same color — no flickering on re-render.
function seededColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash) % 360;
  // Slightly desaturated, mid-brightness — works well as a full-bleed bg
  return { h, s: 52, l: 38 };
}

// Convert HSL → [r, g, b] 0-255 for DataTexture
function hslToRgb(h, s, l) {
  s /= 100;
  l /= 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [
    Math.round(f(0) * 255),
    Math.round(f(8) * 255),
    Math.round(f(4) * 255),
  ];
}

// Build a 1×1 THREE.DataTexture from a slide entry.
// If slide.image is provided, returns null (caller loads a real texture instead).
function makeColorTexture(slide) {
  const { h, s, l } = seededColor(slide.title);
  const [r, g, b] = hslToRgb(h, s, l);
  const data = new Uint8Array([r, g, b, 255]);
  const tex = new THREE.DataTexture(data, 1, 1, THREE.RGBAFormat);
  tex.needsUpdate = true;
  return tex;
}

export default function Sectiontwo() {
  const sliderRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(SplitText);

    const slider = sliderRef.current;
    if (!slider) return;

    // ── Text helpers ────────────────────────────────────────────────────────
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
        { y: "-100%", duration: 0.6, stagger: 0.02, ease: "power2.inOut" },
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
        { y: "0%", duration: 0.5, stagger: 0.05, ease: "power2.inOut" },
        0.1,
      );
      return tl;
    };

    // ── State & Three.js setup ───────────────────────────────────────────────
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

    // textures[i] is either a loaded THREE.Texture (image) or a DataTexture (color)
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

    async function init() {
      const textureLoader = new THREE.TextureLoader();

      // Load image texture OR create a 1×1 color DataTexture
      for (const slide of slides) {
        if (slide.image) {
          const texture = await new Promise((resolve) =>
            textureLoader.load(slide.image, resolve),
          );
          texture.minFilter = THREE.LinearFilter;
          texture.magFilter = THREE.LinearFilter;
          texture.wrapS = THREE.ClampToEdgeWrapping;
          texture.wrapT = THREE.ClampToEdgeWrapping;
          textures.push(texture);
        } else {
          // No image → deterministic solid-color texture
          textures.push(makeColorTexture(slide));
        }
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
        // When 1.0 the shader should skip cover-fit math and just stretch the
        // 1×1 color texture to fill — add this uniform if your shader supports
        // it, otherwise the DataTexture already fills fine at any resolution.
        uIsColorCurrent: { value: slides[0].image ? 0.0 : 1.0 },
        uIsColorNext: { value: (slides[1] ?? slides[0]).image ? 0.0 : 1.0 },
      };

      material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms,
        transparent: true,
      });

      const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material);
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

    // ── Scroll ───────────────────────────────────────────────────────────────
    function handleScroll(e) {
      if (isTransitioning) return;
      if (Math.abs(e.deltaY) < 15) return;

      let targetIndex = currentIndex;
      if (e.deltaY > 0) {
        targetIndex = (currentIndex + 1) % slides.length;
      } else if (e.deltaY < 0) {
        targetIndex = (currentIndex - 1 + slides.length) % slides.length;
      }

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

      // Assign textures — DataTexture or real image, same API either way
      uniforms.uTexCurrent.value = textures[currentIndex];
      uniforms.uTexNext.value = textures[nextIndex];
      uniforms.uProgress.value = 0.0;

      // Tell the shader whether each slot is a flat color (optional — only
      // needed if your fragment shader uses uIsColorCurrent / uIsColorNext
      // to skip cover-fit UV math for 1×1 textures).
      uniforms.uIsColorCurrent.value = slides[currentIndex].image ? 0.0 : 1.0;
      uniforms.uIsColorNext.value = slides[nextIndex].image ? 0.0 : 1.0;

      let clickUnlocked = false;
      const currentSlide = slider.querySelector(".slide-content");
      const exitTimeline = animateTextOut(currentSlide);

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
          uniforms.uIsColorCurrent.value = slides[currentIndex].image
            ? 0.0
            : 1.0;
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
        requestAnimationFrame(() => animateTextIn(nextSlide));
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
