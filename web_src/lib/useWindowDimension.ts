import { useEffect, useState } from "react";

const getDimension = () => {
  const { innerWidth: width, innerHeight: height } = window;
  return { width, height };
};

const useWindowDimension = () => {
  const hasWindow = typeof window !== "undefined";

  const [windowDimension, setWindowDimension] = useState<{
    width: number;
    height: number;
  }>(getDimension());

  useEffect(() => {
    if (hasWindow) {
      const handleResize = () => {
        setWindowDimension(getDimension());
      };
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [hasWindow]);

  return windowDimension;
};

export default useWindowDimension;
