import { MementoConfiguration } from '../configuration';

export function getTestConfiguration(
  overrides: Partial<MementoConfiguration> = {}
): MementoConfiguration {
  return {
    targetUrl: '',
    cacheDirectory: '',
    disableCachingPatterns: [],
    port: 0,
    useRealResponseTime: false,
    version: '',
    ignoreCookiesPattern: /.*/g,
    ...overrides,
  };
}
