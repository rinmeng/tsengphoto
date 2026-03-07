export const getDelayClass = (index: number) => {
  const delays = [
    'delay-0',
    'delay-[50ms]',
    'delay-[100ms]',
    'delay-[150ms]',
    'delay-[200ms]',
    'delay-[250ms]',
    'delay-[300ms]',
    'delay-[350ms]',
    'delay-[400ms]',
    'delay-[450ms]',
    'delay-[500ms]',
    'delay-[550ms]',
    'delay-[600ms]',
    'delay-[650ms]',
    'delay-[700ms]',
    'delay-[750ms]',
    'delay-[800ms]',
    'delay-[850ms]',
    'delay-[900ms]',
  ];
  return delays[Math.min(index, delays.length - 1)];
};
