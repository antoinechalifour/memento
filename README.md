# Memento

> Memento is a **development only** tool that caches HTTP calls once they have been executed.

This project was bootstrapped with [TSDX](https://github.com/jaredpalmer/tsdx).

## Getting started

```
yarn build

yarn dev --targetUrl=http://your.api.base.url.com
```

### Options

The following options can be used in the command line :

| Option    | Description                                             | Example               | Default value |
| --------- | ------------------------------------------------------- | --------------------- | ------------- |
| targetUrl | The API base URL                                        | http://localhost:4000 | None          |
| delay     | A delay in milliseconds to be applied to each HTTP call | 1000                  | 0             |

## Local Development

Below is a list of commands you will probably find useful.

```
# Start TS compiletation in watch mode
yarn start

# Start the local server
yarn dev
```
