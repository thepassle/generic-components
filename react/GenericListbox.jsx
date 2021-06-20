
import React, {useEffect, useRef} from "react";
import '@generic-components/components/listbox.js';

const addedEvents = new Set();

export function GenericListbox({children, onSelectedChanged, selected}) {
  
  const ref = useRef(null);
  useEffect(() => {
    if(onSelectedChanged && !addedEvents.has('selected-changed')) { 
      ref.current.addEventListener('selected-changed', onSelectedChanged);
      addedEvents.add('selected-changed');
    }
    if(typeof selected !== 'undefined') ref.current.selected = selected;
  }, [selected])
    

  return (
    <generic-listbox ref={ref} >
      {children}
    </generic-listbox>
  )
}
          