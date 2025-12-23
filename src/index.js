#!/usr/bin/env node
const { program } = require('commander');
const path = require('path');

const createCmd = require('./commands/create');

program
  .name('devhub')
  .description('DevHubTools Automator CLI')
  .version('0.1.0');

program
  .command('create <app-name>')
  .description('Scaffold a new project')
  .action((appName, options) => {
    createCmd(appName, options).catch((err) => {
      console.error('Error:', err.message || err);
      process.exit(1);
    });
  });

program.parse(process.argv);
