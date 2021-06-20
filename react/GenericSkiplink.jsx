
import React from "react";
import '@generic-components/components/skiplink.js';



export function GenericSkiplink({children, _for}) {
  

  return (
    <generic-skiplink  for={_for} >
      {children}
    </generic-skiplink>
  )
}
          