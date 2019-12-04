#!/usr/bin/env node
const os = require('os');
const path = require('path');
const program = require('commander')
program.version('0.1.0');
program
 .option('-d, --directory [...otherdirs]', 'specify directory or file you want to scan')

program.parse(process.argv);



function commaSeparatedList(value, dummyPrevious) {
  return value.split(',');
}
console.log(program.directory)
