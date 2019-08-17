#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-var-requires */
process.env.NODE_ENV = 'production';

const { Memento, createCli } = require('../dist');

const memento = Memento();

memento.run().then(() => {
  createCli({ container: memento.container }).show();
});

function stopServer() {
  memento.stop();
}

process.on('SIGINT', stopServer);
process.on('exit', stopServer);
