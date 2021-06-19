
import React, {useEffect, useRef} from "react";
import '@generic-components/components/disclosure.js';

export function GenericDisclosure({children, onOpenedChanged, expanded}) {
  
  const ref = useRef(null);
  useEffect(() => {
    ref.current.addEventListener('opened-changed', onOpenedChanged);
    if(expanded) ref.current.expanded = expanded;
  },[])
    

  return (
    <generic-disclosure ref={ref} >
      {children}
    </generic-disclosure>
  )
}
          