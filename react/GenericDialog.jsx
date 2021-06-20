
import React, {useEffect, useRef} from "react";
import '@generic-components/components/dialog.js';

const addedEvents = new Set();

export function GenericDialog({children, onDialogOpened, onDialogClosed}) {
  
  const ref = useRef(null);
  useEffect(() => {
    if(onDialogOpened && !addedEvents.has('dialog-opened')) { 
      ref.current.addEventListener('dialog-opened', onDialogOpened);
      addedEvents.add('dialog-opened');
    }
    if(onDialogClosed && !addedEvents.has('dialog-closed')) { 
      ref.current.addEventListener('dialog-closed', onDialogClosed);
      addedEvents.add('dialog-closed');
    }
    
  }, [])
    

  return (
    <generic-dialog ref={ref} >
      {children}
    </generic-dialog>
  )
}
          