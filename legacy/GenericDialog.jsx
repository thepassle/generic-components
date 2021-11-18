import React, { useEffect, useRef } from "react";
import "@generic-components/components/dialog.js";

export function GenericDialog({
  children,
  onDialogOpened,
  onDialogClosed,
  _connected
}) {
  const ref = useRef(null);

  /** Event listeners - run once */

  useEffect(() => {
    if (onDialogOpened !== undefined) {
      ref.current.addEventListener("dialog-opened", onDialogOpened);
    }
  }, []);

  useEffect(() => {
    if (onDialogClosed !== undefined) {
      ref.current.addEventListener("dialog-closed", onDialogClosed);
    }
  }, []);

  /** Properties - run whenever a property has changed */

  useEffect(() => {
    if (_connected !== undefined && ref.current._connected !== _connected) {
      ref.current._connected = _connected;
    }
  }, [_connected]);

  return <generic-dialog ref={ref}>{children}</generic-dialog>;
}
