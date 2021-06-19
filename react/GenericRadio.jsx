
import React, {useEffect, useRef} from "react";
import '@generic-components/components/radio.js';

export function GenericRadio({children, onSelectedChanged, selected, vertical, disabled}) {
  
  const ref = useRef(null);
  useEffect(() => {
    ref.current.addEventListener('selected-changed', onSelectedChanged);
    if(selected) ref.current.selected = selected;
  },[])
    

  return (
    <generic-radio ref={ref} vertical={vertical}  disabled={disabled} >
      {children}
    </generic-radio>
  )
}
          