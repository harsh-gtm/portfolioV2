"use client";

import { RGBA_ASTC_10x5_Format } from "three";
import styles from "./style.module.css";
import * as THREE from "three";
import { texture } from "three/src/nodes/accessors/TextureNode";

export default function Sectiontwo() {
  const initScene = () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );

    const renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector("canvas"),
      antialias: true,
      powerPreference: "high-performance",
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000);

    const parentWidth = 20;
    const parentHeight = 75;
    const curvature = 35;

    const segmentsX = 200;
    const segmentsY = 200;

    const parentGeometry = new THREE.PlaneGeometry(
      parentWidth,
      parentHeight,
      segmentsX,
      segmentsY,
    );

    const position = parentGeometry.attributes.position.array;

    for (i = 0; i < position.length; i += 3) {
      const y = position[i + 1];
      const distanceFromCenter = Math.abs(y / (parentHeight / 2));

      position[i + 2] = Math.pow(distanceFromCenter, 2) * curvature;
    }

    parentGeometry.computeVertexNormals();

    const totalSlides = 7;
    const slideHeight = 15;
    const gap = 0.5;
    const cycleHeigh = totalSlides * (slideHeight + gap);

    const textureCanvas = document.createElement("canvas");
    const ctx = textureCanvas.getContext("2d", {
      alpha: false,
      willReadFrequently: false,
    });

    textureCanvas.width = 2048;
    textureCanvas.height = 8192;
  };

  return (
    <div className={styles.body}>
      <footer>
        <p>Expirament 0104</p>
        <p>2026</p>
      </footer>
      <div className={styles.sliderWrapper}>
        <canvas></canvas>
      </div>

      <div className={styles.overlay}>
        <p></p>
      </div>
    </div>
  );
}
