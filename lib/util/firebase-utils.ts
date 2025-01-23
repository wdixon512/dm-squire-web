export const sanitizeData = (data: any) => {
  return JSON.parse(JSON.stringify(data, (key, value) => (value === undefined ? null : value)));
};
