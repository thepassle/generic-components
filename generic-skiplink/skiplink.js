export const skiplink = `
  a[skiplink] {
    background-color: white;
    border-radius: 5px;
    padding: 10px 20px 10px 20px;
    position: absolute;
    left: -999px;
    width: 1px;
    height: 1px;
    top: auto;
  }

  a[skiplink]:focus {
    top: 0px;
    left: 0px;
    height: auto;
    width: auto;
    margin: auto;
  }
`;
