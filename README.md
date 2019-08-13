[![Build Status](https://travis-ci.org/antoinechalifour/memento.svg?branch=master)](https://travis-ci.org/antoinechalifour/memento)

# Memento

> Memento is a **development only** tool that caches HTTP calls once they have been executed.

This project was bootstrapped with [TSDX](https://github.com/jaredpalmer/tsdx).

## Getting started

```
# Usage with configuration file
# You may use any configuration file supported by https://github.com/davidtheclark/cosmiconfig (e.g. .mementorc, memento.config.js, ...)
npx @antoinechalifour/memento

# Usage with CLI  args
npx @antoinechalifour/memento --targetUrl=<YOUR API BASE URL> --port=<THE PORT>

# Example for caching Punk API
npx @antoinechalifour/memento --targetUrl=https://api.punkapi.com/v2

# Delay all responses by 3 seconds
npx @antoinechalifour/memento --targetUrl=https://api.punkapi.com/v2 --delay=3000
```

### Options

#### Configuration file example
You may use any configuration file supported by [cosmiconfig](https://github.com/davidtheclark/cosmiconfig). For instance, you may create a `.mementorc` in your project root :

```
{
  "targetUrl": "https://api.punkapi.com/v2",
  "delay": 2,
  "port": 3344
}
```

#### Command Line Options
The following options can be used in the command line :

| Option    | Description                                             | Example               | Default value |
| --------- | ------------------------------------------------------- | --------------------- | ------------- |
| targetUrl | The API base URL                                        | http://localhost:4000 | None          |
| delay     | A delay in milliseconds to be applied to each HTTP call | 1000                  | 0             |
| port      | The port used to launch Memento                         | 9876                  | 3344          |

## Local Development

Below is a list of commands you will probably find useful.

```
# Start TS compilation in watch mode
yarn start

# Start the local server
yarn dev
```
