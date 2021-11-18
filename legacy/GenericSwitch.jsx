import React, { useEffect, useRef } from "react";
import "@generic-components/components/switch.js";

export function GenericSwitch({
  children,
  onCheckedChanged,
  checked,
  disabled,
  label
}) {
  const ref = useRef(null);

  /** Event listeners - run once */

  useEffect(() => {
    if (onCheckedChanged !== undefined) {
      ref.current.addEventListener("checked-changed", onCheckedChanged);
    }
  }, []);

  /** Boolean attributes - run whenever an attr has changed */

  useEffect(() => {
    if (disabled !== undefined) {
      if (disabled) {
        ref.current.setAttribute("disabled", "");
      } else {
        ref.current.removeAttribute("disabled");
      }
    }
  }, [disabled]);

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
    if (checked !== undefined && ref.current.checked !== checked) {
      ref.current.checked = checked;
    }
  }, [checked]);

  return (
    <generic-switch ref={ref} disabled={disabled} label={label}>
      {children}
    </generic-switch>
  );
}
