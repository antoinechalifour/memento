export const logger = {
  info: (message: string) => console.log(`[📼] ${message}`),
  debug: (message: string) => console.debug(`[📼](debug) ${message}`),
  error: (message: string) => console.error(`[📼](error) ${message}`),
};
