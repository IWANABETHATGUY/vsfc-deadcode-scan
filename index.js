#!/usr/bin/env node
const { unusedToken } = require('vscf-deadcode-detect');
const os = require('os');
const path = require('path');
const fs = require('fs');
const program = require('commander');
program.version('0.1.0');
program
  .option('-c, --cpu <type>', 'specify directory or file you want to scan')
  .option('-n --nuxt', 'if you are scanning a nuxt project, this flag should be added')
  .command('<dir> [otherDirs...]');

program.parse(process.argv);
const isNuxt = program.nuxt;
const paths = program.args.map(p => {
  return path.resolve(process.cwd(), p);
});
function walkPath(base, dirs) {
  return dirs.reduce((pre, p) => {
    const absolutePath = path.resolve(base, p);
    if (fs.statSync(absolutePath).isDirectory()) {
      return pre.concat(walkPath(absolutePath, fs.readdirSync(absolutePath)));
    } else {
      if (path.extname(p) === '.vue') {
        pre.push(path.resolve(base, p));
      }
    }
    return pre;
  }, []);
}
const vueFileList = paths.reduce((pre, p) => {
  if (fs.statSync(p).isDirectory()) {
    return pre.concat(walkPath(p, fs.readdirSync(p)));
  } else {
    if (path.extname(p) === '.vue') {
      pre.push(p);
    }
  }
  return pre;
}, []);

vueFileList.forEach(p => {
  const file = fs.readFileSync(p).toString();
  const unusedTokens = unusedToken(file, {nuxt: isNuxt});
  console.log(p);
  if (unusedTokens.length) {
    console.log(unusedTokens);
  }
});
