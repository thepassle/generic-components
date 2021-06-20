
import React, {useEffect, useRef} from "react";
import '@generic-components/components/radio.js';

const addedEvents = new Set();

export function GenericRadio({children, onSelectedChanged, selected, vertical, disabled}) {
  
  const ref = useRef(null);
  useEffect(() => {
    if(onSelectedChanged && !addedEvents.has('selected-changed')) { 
      ref.current.addEventListener('selected-changed', onSelectedChanged);
      addedEvents.add('selected-changed');
    }
    if(typeof selected !== 'undefined') ref.current.selected = selected;
  }, [selected])
    

  return (
    <generic-radio ref={ref} vertical={vertical}  disabled={disabled} >
      {children}
    </generic-radio>
  )
}
          