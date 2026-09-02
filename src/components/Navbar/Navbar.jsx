import "./Navbar.css";

import Link from "next/link";

const NavBar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-items">
        <div className="navbar-item">
          <Link href="/">Home</Link>
        </div>
        <div className="navbar-item">
          <Link href="/about">About Me</Link>
        </div>
        <div className="navbar-item">
          <Link href="/projects">Projects</Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
