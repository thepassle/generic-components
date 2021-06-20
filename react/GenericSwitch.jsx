
import React, {useEffect, useRef} from "react";
import '@generic-components/components/switch.js';

const addedEvents = new Set();

export function GenericSwitch({children, onCheckedChanged, checked, disabled, label}) {
  
  const ref = useRef(null);
  useEffect(() => {
    if(onCheckedChanged && !addedEvents.has('checked-changed')) { 
      ref.current.addEventListener('checked-changed', onCheckedChanged);
      addedEvents.add('checked-changed');
    }
    if(typeof checked !== 'undefined') ref.current.checked = checked;
  }, [checked])
    

  return (
    <generic-switch ref={ref} disabled={disabled}  label={label} >
      {children}
    </generic-switch>
  )
}
          