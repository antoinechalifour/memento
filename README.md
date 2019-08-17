[![Build Status](https://travis-ci.org/antoinechalifour/memento.svg?branch=master)](https://travis-ci.org/antoinechalifour/memento) [![codecov](https://codecov.io/gh/antoinechalifour/memento/branch/master/graph/badge.svg)](https://codecov.io/gh/antoinechalifour/memento)

<p align="center">
  <h1 align="center">Memento</h3>
  <p align="center">Memento is a <strong>development only</strong> tool that caches HTTP calls once they have been executed</p>
</p>

<div align="center"><img src="https://github.com/antoinechalifour/memento/blob/master/cover.png?raw=true" alt="Medium Zoom Demo"></div>

This project was bootstrapped with [TSDX](https://github.com/jaredpalmer/tsdx).

## Why should one use Memento?

When building a UI, or working on any project that rely on external services, many things can slow us down :

- the API may not be stable at the moment
- the API may apply harsh rate-limiting (and that's terrible if you forget the dependency array in your `React.useEffect` 😉)
- ...or you may be working on a train or plane where the network is not reliable.

**Memento has been built to solve our development workflow.**

Memento acts as a development buddy that remembers the requests that your application is sending, the server response, and will respond to your app without the need for requests to go over the internet.

*Pro-tip: Memento may also be used for stubbing external services for integration or end-to-end testing 🎉*

## Getting started

To add Memento to your project, you just need to add a `.mementorc` file to your project root and run `npx @antoinechalifour/memento`. You may use any configuration file supported by [cosmiconfig](https://github.com/davidtheclark/cosmiconfig).

The most basic configuration file to cache the [PunkApi](https://punkapi.com/documentation/v2) would look something like this:

```json
{
  "target-url": "https://api.punkapi.com/v2"
}
```

### Examples

- [Usage with Create React App](./examples/create-react-app)
- [Stubbing external services for integration tests](./examples/stub-external-services)

### Options

The following options are supported:

| Option          | Description                                             | Example               | Default value  |
| --------------- | ------------------------------------------------------- | --------------------- | -------------- |
| target-url      | The API base URL                                        | http://localhost:4000 | None           |
| delay           | A delay in milliseconds to be applied to each HTTP call | 1000                  | 0              |
| port            | The port used to launch Memento                         | 9876                  | 3344           |
| cache-directory | The cache directory used for storing responses          | memento-integration   | .memento-cache |

## Using the CLI

Launching Memento will start the interactive Memento CLI, where you can type commands to modify the cached requests and responses. The documentation can be found by typing `help` in the command prompt.

## Cache location

By default, memento will create a `.memento-cache` directory in the current directory where each response will be mapped to a directory containing:

- `metadata.json` - A file containing information about the request and the response.
- `body.{json,xml,txt}` - The response content. The extension depends on the response `content-type` header. You may edit this file to edit the response.

You may override this directory by providing a `cache-directory` in the configuration file. this may be useful for storing environment dependent responses.

## Contributing

Below is a list of commands you will probably find useful.

```
# Start TS compilation in watch mode
yarn start

# Start the local server
yarn dev
```
