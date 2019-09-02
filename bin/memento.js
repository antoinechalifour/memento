#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-var-requires */
process.env.NODE_ENV = 'development';

const { Memento, createCli, runMigrations } = require('../dist');

const memento = Memento();
const container = memento.container;

runMigrations(container)
  .then(() => memento.run())
  .then(() => {
    createCli({
      container: memento.container,
      reload: memento.reload,
    }).show();
  });

function stopServer() {
  memento.stop();
}

process.on('SIGINT', stopServer);
process.on('exit', stopServer);
