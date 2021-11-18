import React, { useEffect, useRef } from "react";
import "@generic-components/components/tabs.js";

export function GenericTabs({
  children,
  onSelectedChanged,
  selected,
  updateComplete,
  __uuid,
  vertical,
  label
}) {
  const ref = useRef(null);

  /** Event listeners - run once */

  useEffect(() => {
    if (onSelectedChanged !== undefined) {
      ref.current.addEventListener("selected-changed", onSelectedChanged);
    }
  }, []);

  /** Boolean attributes - run whenever an attr has changed */

  useEffect(() => {
    if (vertical !== undefined) {
      if (vertical) {
        ref.current.setAttribute("vertical", "");
      } else {
        ref.current.removeAttribute("vertical");
      }
    }
  }, [vertical]);

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
    <generic-tabs ref={ref} vertical={vertical} label={label}>
      {children}
    </generic-tabs>
  );
}
