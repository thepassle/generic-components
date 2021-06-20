
import React, {useEffect, useRef} from "react";
import '@generic-components/components/tabs.js';

const addedEvents = new Set();

export function GenericTabs({children, onSelectedChanged, selected, vertical, label}) {
  
  const ref = useRef(null);
  useEffect(() => {
    if(onSelectedChanged && !addedEvents.has('selected-changed')) { 
      ref.current.addEventListener('selected-changed', onSelectedChanged);
      addedEvents.add('selected-changed');
    }
    if(typeof selected !== 'undefined') ref.current.selected = selected;
  }, [selected])
    

  return (
    <generic-tabs ref={ref} vertical={vertical}  label={label} >
      {children}
    </generic-tabs>
  )
}
          