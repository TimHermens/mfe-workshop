import { buildSelector } from './angular';

describe('angular utils', () => {
  describe('buildSelector', () => {
    it('should build a valid selector', function () {
      const selector = buildSelector('mySelector', 'app');
      expect(selector).toBe('app-my-selector');
    });

    it('should throw an error when providing an invalid selector name', function () {
      expect(() => {
        buildSelector('1-invalid-starting-with-number', 'app');
      }).toThrow(
        /Because the name is used in the html selector, the name must start with a letter, and must contain only alphanumeric characters or dashes./
      );
    });
  });
});
