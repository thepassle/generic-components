
import React, {useEffect, useRef} from "react";
import '@generic-components/components/disclosure.js';

const addedEvents = new Set();

export function GenericDisclosure({children, onOpenedChanged, expanded}) {
  
  const ref = useRef(null);
  useEffect(() => {
    if(onOpenedChanged && !addedEvents.has('opened-changed')) { 
      ref.current.addEventListener('opened-changed', onOpenedChanged);
      addedEvents.add('opened-changed');
    }
    if(typeof expanded !== 'undefined') ref.current.expanded = expanded;
  }, [expanded])
    

  return (
    <generic-disclosure ref={ref} >
      {children}
    </generic-disclosure>
  )
}
          