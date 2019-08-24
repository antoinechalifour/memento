#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-var-requires */
process.env.NODE_ENV = 'development';

const { Memento, createCli, runMigrations } = require('../dist');

const memento = Memento();

memento
  .run()
  .then(() => runMigrations(memento.container))
  .then(() => {
    createCli({ container: memento.container }).show();
  });

function stopServer() {
  memento.stop();
}

process.on('SIGINT', stopServer);
process.on('exit', stopServer);
