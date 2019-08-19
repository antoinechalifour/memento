export function wait(timeInMs: number) {
  return new Promise(resolve => setTimeout(resolve, timeInMs));
}
