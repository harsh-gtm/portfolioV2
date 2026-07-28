"use client";
import React, { forwardRef } from "react";
import "./Navbar.css";
import { useTransitionRouter } from "next-view-transitions";
import slideInOut from "../PageTransition/PageTransition";

const Navbar = forwardRef((props, ref) => {
  const router = useTransitionRouter();

  const handleNavigate = (e, href) => {
    e.preventDefault();

    router.push(href, {
      onTransitionReady: () => {
        setTimeout(() => {
          slideInOut();
        }, 0);
      },
    });
  };

  return (
    <nav className="navContainer" ref={ref}>
      <div className="home">
        <div className="link">
          <a href="/" onClick={(e) => handleNavigate(e, "/")}>Home</a>
        </div>
      </div>
      <div className="links">
        <div className="link">
          <a href="/about" onClick={(e) => handleNavigate(e, "/about")}>About Me</a>
        </div>
        <div className="link">
          <a href="/projects" onClick={(e) => handleNavigate(e, "/projects")}>Projects</a>
        </div>
        <div className="link">
          <a href="/blog" onClick={(e) => handleNavigate(e, "/blog")}>Blog</a>
        </div>
      </div>
    </nav>
  );
});

export default Navbar;
