
import React, {useEffect, useRef} from "react";
import '@generic-components/components/switch.js';

export function GenericSwitch({children, onCheckedChanged, checked, disabled, label}) {
  
  const ref = useRef(null);
  useEffect(() => {
    ref.current.addEventListener('checked-changed', onCheckedChanged);
    if(checked) ref.current.checked = checked;
  },[])
    

  return (
    <generic-switch ref={ref} disabled={disabled}  label={label} >
      {children}
    </generic-switch>
  )
}
          