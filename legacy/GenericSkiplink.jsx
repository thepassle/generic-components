import React, { useEffect, useRef } from "react";
import "@generic-components/components/skiplink.js";

export function GenericSkiplink({ children, _for }) {
  const ref = useRef(null);

  /** Attributes - run whenever an attr has changed */

  useEffect(() => {
    if (
      _for !== undefined &&
      ref.current.getAttribute("for") !== String(_for)
    ) {
      ref.current.setAttribute("for", _for);
    }
  }, [_for]);

  return (
    <generic-skiplink ref={ref} for={_for}>
      {children}
    </generic-skiplink>
  );
}
