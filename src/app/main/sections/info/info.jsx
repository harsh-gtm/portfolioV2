import React from "react";
import styles from "./style.module.css";
import Image from "next/image";
import bgImage from "../../../../../public/bg2.jpg";

const Info = () => {
  return (
    <div className={styles.container}>
      <div className={styles.imageWrapper}>
        <Image
          src={bgImage}
          fill
          priority
          placeholder="blur"
          alt=""
          style={{
            objectFit: "cover",
            objectPosition: "center",
            transform: "scaleY(-1)",
          }}
        />
      </div>
    </div>
  );
};

export default Info;
