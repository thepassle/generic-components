import { _visuallyHidden } from '../utils/visually-hidden.js';

export const skiplink = `
  a[skiplink] {
    ${_visuallyHidden}
  }

  a[skiplink]:focus {
    position: absolute;
    top: 0px;
    left: 0px;
    height: auto;
    width: auto;
    margin: auto;
    opacity: 1;
    pointer-events: auto;
    background-color: white;
  }
`;
