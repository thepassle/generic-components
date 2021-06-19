
import React, {useEffect, useRef} from "react";
import '@generic-components/components/accordion.js';

export function GenericAccordion({children, onSelectedChanged, selected}) {
  
  const ref = useRef(null);
  useEffect(() => {
    ref.current.addEventListener('selected-changed', onSelectedChanged);
    if(selected) ref.current.selected = selected;
  },[])
    

  return (
    <generic-accordion ref={ref} >
      {children}
    </generic-accordion>
  )
}
          