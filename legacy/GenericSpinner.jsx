import React, { useEffect, useRef } from "react";
import "@generic-components/components/spinner.js";

export function GenericSpinner({ children, label }) {
  const ref = useRef(null);

  /** Attributes - run whenever an attr has changed */

  useEffect(() => {
    if (
      label !== undefined &&
      ref.current.getAttribute("label") !== String(label)
    ) {
      ref.current.setAttribute("label", label);
    }
  }, [label]);

  return (
    <generic-spinner ref={ref} label={label}>
      {children}
    </generic-spinner>
  );
}
