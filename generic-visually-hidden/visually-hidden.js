import { _visuallyHidden } from '../utils/visually-hidden.js';

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
