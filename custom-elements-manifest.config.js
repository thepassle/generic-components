import reactify from './cem-plugin-reactify.js';

export default {
  exclude: ['coverage/**/*'],
  plugins: [
    reactify({
      exclude: ['BatchingElement', 'FocusTrap', 'GenericDialogOverlay'],
      attributeMapping: {
        for: '_for',
      },
    }),
  ],
};
