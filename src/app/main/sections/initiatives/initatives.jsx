import React from "react";
import "./styles.css";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useEffect } from "react";
import gsap from "gsap";

const Initatives = () => {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.set(".text", { opacity: 0 });

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

    tl.to({}, { duration: 0.3 });

    tl.set(".rect", {
      clipPath: "polygon(0% 50%, 100% 50%, 100% 50%, 0% 50%)",
    });

    tl.to(".rect", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      duration: 0.2,
      ease: "none",
    });

    tl.to(".rect", {
      scaleX: 200,
      transformOrigin: "center center",
      duration: 0.37,
      ease: "none",
    }).to(
      ".text",
      {
        opacity: 1,
        duration: 0.2,
      },
      "-=0.3",
    );
  }, []);

  return (
    <>
      <div className="first-blurb">
        <h1>
          My interests range from CS, machine learning, Quantitative finance,
          and data science
        </h1>
      </div>

      <div className="rect-container">
        <div className="rect"></div>
        <div className="text">
          <h1>And my projects target to help people.</h1>
        </div>
      </div>
    </>
  );
};

export default Initatives;
