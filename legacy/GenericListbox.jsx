import React, { useEffect, useRef } from "react";
import "@generic-components/components/listbox.js";

export function GenericListbox({
  children,
  onSelectedChanged,
  selected,
  updateComplete,
  __uuid,
  label
}) {
  const ref = useRef(null);

  /** Event listeners - run once */

  useEffect(() => {
    if (onSelectedChanged !== undefined) {
      ref.current.addEventListener("selected-changed", onSelectedChanged);
    }
  }, []);

  /** Attributes - run whenever an attr has changed */

  useEffect(() => {
    if (
      label !== undefined &&
      ref.current.getAttribute("label") !== String(label)
    ) {
      ref.current.setAttribute("label", label);
    }
  }, [label]);

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

  return (
    <generic-listbox ref={ref} label={label}>
      {children}
    </generic-listbox>
  );
}
