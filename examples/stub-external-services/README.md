# How to stub external services?

1. Add memento as a dev dependency: `yarn add memento --dev` or `npm install --save-dev memento`
2. Add a `.mementorc` in your project.
5. Configure your test environment for using Memento as the API url
6. Import memento in your test files, and plug it into your test runner hooks
   
```js
const { Memento } = require('memento');

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
