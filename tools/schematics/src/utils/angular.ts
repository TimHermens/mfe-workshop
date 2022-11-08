import { names } from '@nrwl/devkit';
import { validateHtmlSelectorFormat } from './formatters';

export function buildSelector(name: string, prefix: string) {
  validateForUseInSelector(prefix, 'prefix');
  validateForUseInSelector(name, 'name');
  const nxNames = names(name);
  const selector = nxNames.fileName;
  return `${prefix}-${selector}`;
}

function validateForUseInSelector(string: string, subject: string): void {
  if (!validateHtmlSelectorFormat(string)) {
    throw new Error(
      `Because the ${subject} is used in the html selector, the ${subject} must start with a letter, and must contain only alphanumeric characters or dashes. When adding a dash the segment after the dash must also start with a letter.`
    );
  }
}
