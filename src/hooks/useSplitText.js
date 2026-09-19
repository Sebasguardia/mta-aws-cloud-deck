// src/hooks/useSplitText.js
import { useEffect, useRef } from "react";
import SplitType from "split-type";

/**
 * Hook para dividir texto en palabras o caracteres cinematográficos mediante SplitType.
 * Limpia automáticamente las etiquetas creadas al desmontar.
 * @param {string} types - 'words,chars' o 'words'
 * @param {boolean} active - Si se debe aplicar la división
 * @returns {React.RefObject} textRef
 */
export function useSplitText(types = "words", active = true) {
  const textRef = useRef(null);

  useEffect(() => {
    if (!textRef.current || !active) return;

    let splitInstance = null;

    try {
      splitInstance = new SplitType(textRef.current, {
        types: types,
        tagName: "span",
      });
    } catch (err) {
      console.warn("SplitType no pudo inicializarse:", err);
    }

    return () => {
      if (splitInstance) {
        splitInstance.revert();
      }
    };
  }, [types, active]);

  return textRef;
}
