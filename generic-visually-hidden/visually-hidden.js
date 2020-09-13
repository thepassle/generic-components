export const _visuallyHidden = `
  clip: rect(1px, 1px, 1px, 1px);
  clip-path: inset(50%);
  height: 1px;
  width: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
`;

/** For usage as constructible stylesheet  */
export const visuallyHidden = `
  [visually-hidden] {
    ${_visuallyHidden}
  }
`;

/** For usage inside a web component */
export const hostVisuallyHidden = `
  :host {
    ${_visuallyHidden}
  }
`;
