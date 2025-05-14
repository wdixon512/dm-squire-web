export const debounce = (func, delay: number) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

export const toKebabCase = (str: string) => {
  return str?.replaceAll(' ', '-').toLowerCase();
};

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
