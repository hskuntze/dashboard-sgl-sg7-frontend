import { useEffect } from "react";

interface Props {
  onActive: () => void;
  id: string;
  className: string;
}

const useActiveObserver = ({ onActive, id, className }: Props) => {
  useEffect(() => {
    const targetElement = document.getElementById(id);

    if (!targetElement) return;

    const observer = new MutationObserver(() => {
      if (targetElement.classList.contains(className)) {
        onActive(); // Dispara a função quando #cop estiver ativo
      }
    });

    observer.observe(targetElement, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect(); // Remove o observer ao desmontar o componente
  }, [onActive, id, className]);
};

export default useActiveObserver;
