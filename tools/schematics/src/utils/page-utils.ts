export const pageNameFromPath = (path: string): string => {
  const removeLastIfExist = (remove: string) => (value: string) =>
    // eslint-disable-next-line no-useless-escape
    value.replace(new RegExp(`${remove}\$`), '');
  const extractLastPath = (path: string) => path.split('/').pop() as string;

  return [
    removeLastIfExist('/'),
    removeLastIfExist('/_index'),
    extractLastPath,
  ].reduce((acc, cur) => (acc = cur(acc)), path);
};
