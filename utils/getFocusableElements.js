export const getFocusableElements = el => [
  ...el.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  ),
];
