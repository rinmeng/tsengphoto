export const getDelayClass = (index: number, step = 50) => {
  const ms = index * step;
  return ms === 0 ? 'delay-0' : `delay-[${ms}ms]`;
};
