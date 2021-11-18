import reactify from './cem-plugin-reactify.js';

export default {
  exclude: ['coverage/**/*', 'cem-plugin-reactify.js'],
  plugins: [
    reactify({
      exclude: ['BatchingElement', 'FocusTrap', 'GenericDialogOverlay'],
      attributeMapping: {
        for: '_for',
      },
    }),
  ],
};
