import React, { useEffect, useRef } from "react";
import "@generic-components/components/accordion.js";

export function GenericAccordion({
  children,
  onSelectedChanged,
  selected,
  updateComplete,
  __uuid
}) {
  const ref = useRef(null);

  /** Event listeners - run once */

  useEffect(() => {
    if (onSelectedChanged !== undefined) {
      ref.current.addEventListener("selected-changed", onSelectedChanged);
    }
  }, []);

  /** Properties - run whenever a property has changed */

  useEffect(() => {
    if (selected !== undefined && ref.current.selected !== selected) {
      ref.current.selected = selected;
    }
  }, [selected]);

  useEffect(() => {
    if (
      updateComplete !== undefined &&
      ref.current.updateComplete !== updateComplete
    ) {
      ref.current.updateComplete = updateComplete;
    }
  }, [updateComplete]);

  useEffect(() => {
    if (__uuid !== undefined && ref.current.__uuid !== __uuid) {
      ref.current.__uuid = __uuid;
    }
  }, [__uuid]);

  return <generic-accordion ref={ref}>{children}</generic-accordion>;
}
