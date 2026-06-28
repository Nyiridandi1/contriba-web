import { useEffect, useState } from "react";
import "./ScrollProgress.css";

function ScrollProgress() {
  const [scrollWidth, setScrollWidth] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const pageHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      const progress = pageHeight > 0 ? (scrollTop / pageHeight) * 100 : 0;

      setScrollWidth(progress);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="scroll-progress-wrap">
      <div
        className="scroll-progress-bar"
        style={{ width: `${scrollWidth}%` }}
      ></div>
    </div>
  );
}

export default ScrollProgress;