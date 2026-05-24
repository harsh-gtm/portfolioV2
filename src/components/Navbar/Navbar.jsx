import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import styles from "./Navbar.module.css";

const LiquidGlass = dynamic(() => import("liquid-glass-react"), {
  ssr: false,
});

const Navbar = () => {
  const [glassKey, setGlassKey] = useState(0);

  useEffect(() => {
    const isFirefox = navigator.userAgent.toLowerCase().includes("firefox");
    if (isFirefox) {
      const id = setTimeout(() => setGlassKey((k) => k + 1), 50);
      return () => clearTimeout(id);
    }
  }, []);

  return (
    <nav className={styles.navbarWrap}>
      <LiquidGlass key={glassKey} cornerRadius={19} padding="0">
        <div className={styles.navbarContent}>
          <h2 className={styles.logo}>NAV</h2>
          {/* Add your links here */}
        </div>
      </LiquidGlass>
    </nav>
  );
};

export default Navbar;
