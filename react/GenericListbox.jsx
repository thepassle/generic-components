
import React, {useEffect, useRef} from "react";
import '@generic-components/components/listbox.js';

export function GenericListbox({children, onSelectedChanged, selected}) {
  
  const ref = useRef(null);
  useEffect(() => {
    ref.current.addEventListener('selected-changed', onSelectedChanged);
    if(selected) ref.current.selected = selected;
  },[])
    

  return (
    <generic-listbox ref={ref} >
      {children}
    </generic-listbox>
  )
}
          