# How to stub external services?

1. Add memento as a dev dependency: `yarn add @antoinechalifour/memento --dev` or `npm install --save-dev @antoinechalifour/memento`
2. Add a `.mementorc` in your project.
3. Configure your test environment for using Memento as the API url
4. Import memento in your test files, and plug it into your test runner hooks
   
```js
const { Memento } = require('@antoinechalifour/memento');

const memento = Memento({
  cacheDirectory: path.join(__dirname, '<path to cache directory>')
});

beforeAll(async () => {
  await memento.run();
});

afterAll(() => {
  memento.stop();
});
```

5. If the requests are not in the cache on the first test run, the assertions will be made against the actual API responses. On the next runs, they will be made against the cache.