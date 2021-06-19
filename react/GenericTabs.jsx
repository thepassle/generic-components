
import React, {useEffect, useRef} from "react";
import '@generic-components/components/tabs.js';

export function GenericTabs({children, onSelectedChanged, selected, vertical, label}) {
  
  const ref = useRef(null);
  useEffect(() => {
    ref.current.addEventListener('selected-changed', onSelectedChanged);
    if(selected) ref.current.selected = selected;
  },[])
    

  return (
    <generic-tabs ref={ref} vertical={vertical}  label={label} >
      {children}
    </generic-tabs>
  )
}
          