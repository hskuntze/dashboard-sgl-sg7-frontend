import { useState, useEffect } from "react";

export function useElementSize() {
  const [elementSize, setElementSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;

      if (newWidth < 768) {
        setElementSize({ height: 300, width: 300 });
      } else if (newWidth >= 768 && newWidth < 1600) {
        setElementSize({ height: 300, width: 400 });
      } else if (newWidth >= 1600 && newWidth < 1800) {
        setElementSize({ height: 300, width: 420 });
      } else {
        setElementSize({ height: 300, width: 450 });
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Chama a função para definir o estado inicial

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return elementSize;
}