
import React, {useEffect, useRef} from "react";
import '@generic-components/components/listbox.js';

export function GenericListbox({children, onSelectedChanged, selected}) {
  const ref = useRef(null);

  /** Event listeners - run once */

  useEffect(() => {
    if(onSelectedChanged !== undefined) {
      ref.current.addEventListener('selected-changed', onSelectedChanged);
    }
  }, [])

  

  

  /** Properties - run whenever a property has changed */

  useEffect(() => {
    if(selected !== undefined && ref.current.selected !== selected) {
      ref.current.selected = selected;
    }
  }, [selected])
        

  return (
    <generic-listbox ref={ref} >
      {children}
    </generic-listbox>
  )
}
          