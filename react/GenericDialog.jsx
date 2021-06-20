import React, { useEffect, useRef } from "react";
import "@generic-components/components/dialog.js";

export function GenericDialog({ children, onDialogOpened, onDialogClosed }) {
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

  return <generic-dialog ref={ref}>{children}</generic-dialog>;
}
