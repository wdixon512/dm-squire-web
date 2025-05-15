export const isValidCronRequest = (req: Request): boolean => {
  const authHeader = req.headers.get('Authorization');
  const expectedAuth = `Bearer ${process.env.CRON_SECRET}`;

  if (authHeader !== expectedAuth) {
    return false;
  }

  return true;
};

export const isAuthorizedRequest = (req: Request): boolean => {
  const authHeader = req.headers.get('Authorization');
  const expectedAuth = `Bearer ${process.env.API_SECRET}`;

  if (authHeader !== expectedAuth) {
    return false;
  }

  return true;
};
