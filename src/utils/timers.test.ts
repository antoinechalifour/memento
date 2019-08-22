import { wait } from './timers';

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

describe('wait', () => {
  it('should wait by the specified amout of time', async () => {
    // Given
    const time = 500;
    const spy = jest.fn();

    // When
    wait(time).then(spy);

    expect(spy).not.toHaveBeenCalled();

    jest.advanceTimersByTime(501);
    await Promise.resolve();

    // Then
    expect(spy).toBeCalledTimes(1);
  });
});
