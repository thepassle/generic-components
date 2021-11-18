import React, { useEffect, useRef } from "react";
import "@generic-components/components/disclosure.js";

export function GenericDisclosure({
  children,
  onOpenedChanged,
  expanded,
  __expanded
}) {
  const ref = useRef(null);

  /** Event listeners - run once */

  useEffect(() => {
    if (onOpenedChanged !== undefined) {
      ref.current.addEventListener("opened-changed", onOpenedChanged);
    }
  }, []);

  /** Properties - run whenever a property has changed */

  useEffect(() => {
    if (expanded !== undefined && ref.current.expanded !== expanded) {
      ref.current.expanded = expanded;
    }
  }, [expanded]);

  useEffect(() => {
    if (__expanded !== undefined && ref.current.__expanded !== __expanded) {
      ref.current.__expanded = __expanded;
    }
  }, [__expanded]);

  return <generic-disclosure ref={ref}>{children}</generic-disclosure>;
}
