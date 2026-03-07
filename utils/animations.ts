export const getDelayClass = (index: number, step = 50) => {
  // actual delay is in global.css, this is just a helper to generate the correct class name based on index and step
  const ms = index * step;
  return ms === 0 ? 'delay-0' : `delay-[${ms}ms]`;
};
