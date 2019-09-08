interface TestKoaContext {
  set: jest.Mock;
  request: any;
  state: any;
  [x: string]: any;
}

export function getTestKoaContext(): TestKoaContext {
  return {
    set: jest.fn(),
    request: {},
    state: {},
  };
}
