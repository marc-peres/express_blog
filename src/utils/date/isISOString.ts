export const isISOString = (val: unknown) => {
  if (!val || typeof val !== 'string') return false;
  const d = new Date(val);
  return !Number.isNaN(d.valueOf()) && d.toISOString() === val;
};
