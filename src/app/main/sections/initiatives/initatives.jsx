import React from "react";
import "./styles.css";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useEffect } from "react";
import gsap from "gsap";

const Initatives = () => {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.create({
      trigger: ".first-blurb",
      start: "top center",
      endTrigger: ".first-blurb",
      end: "bottom bottom",
      pin: true,
    });
  }, []);

  return (
    <div className="first-blurb">
      <h1 className="text">
        My interests range from SWE, AI/ML, quantitative finance, and data
        analysis
      </h1>
    </div>
  );
};

export default Initatives;
