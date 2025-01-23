export const cypressIsTesting = () => {
  return window.localStorage.getItem('cypressTesting')?.includes('true');
};
