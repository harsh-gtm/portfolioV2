import React from "react";
import "./styles.css";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useEffect } from "react";
import gsap from "gsap";

const Initatives = () => {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".first-blurb",
        start: "top center",
        end: "+=150%",
        pin: true,
        pinSpacing: true,
        scrub: 1,
      },
    });

    tl.to({}, { duration: 0.5 });

    tl.set(".rect", {
      clipPath: "polygon(0% 50%, 100% 50%, 100% 50%, 0% 50%)",
    });

    tl.to(".rect", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      ease: "none",
    });

    tl.to(".rect", {
      scaleX: 60,
      transformOrigin: "center center",
      ease: "none",
    });
  }, []);

  return (
    <>
      <div className="first-blurb">
        <h1 className="text">
          My interests range from CS, machine learning, Quantitative finance,
          and data science
        </h1>
      </div>

      <div className="rect-container">
        <div className="rect"></div>
      </div>
    </>
  );
};

export default Initatives;
