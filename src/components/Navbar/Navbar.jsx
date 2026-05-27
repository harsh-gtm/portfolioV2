"use client";
import React from "react";
import "./Navbar.css";
import { useTransitionRouter } from "next-view-transitions";
import slideInOut from "../PageTransition/PageTransition";

const Navbar = () => {
  const router = useTransitionRouter();

  const prefetch = (path) => router.prefetch(path);

  return (
    <nav className="nav">
      <div className="home">
        <div className="link">
          <a
            onMouseEnter={() => prefetch("/")}
            onClick={(e) => {
              e.preventDefault();
              router.push("/", { onTransitionReady: slideInOut });
            }}
            href="/"
          >
            Home
          </a>
        </div>
      </div>
      <div className="links">
        <div className="link">
          <a
            onMouseEnter={() => prefetch("/about")}
            onClick={(e) => {
              e.preventDefault();
              router.push("/about", { onTransitionReady: slideInOut });
            }}
            href="/about"
          >
            Who Am I?
          </a>
        </div>
        <div className="link">
          <a
            onMouseEnter={() => prefetch("/projects")}
            onClick={(e) => {
              e.preventDefault();
              router.push("/projects", { onTransitionReady: slideInOut });
            }}
            href="/projects"
          >
            Projects
          </a>
        </div>
        <div className="link">
          <a
            onMouseEnter={() => prefetch("/blog")}
            onClick={(e) => {
              e.preventDefault();
              router.push("/blog", { onTransitionReady: slideInOut });
            }}
            href="/blog"
          >
            Blog
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
