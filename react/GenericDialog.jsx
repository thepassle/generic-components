
import React, {useEffect, useRef} from "react";
import '@generic-components/components/dialog.js';

export function GenericDialog({children, onDialogOpened, onDialogClosed}) {
  
  const ref = useRef(null);
  useEffect(() => {
    ref.current.addEventListener('dialog-opened', onDialogOpened);
    ref.current.addEventListener('dialog-closed', onDialogClosed);
    
  },[])
    

  return (
    <generic-dialog ref={ref} >
      {children}
    </generic-dialog>
  )
}
          