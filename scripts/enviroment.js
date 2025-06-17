#!/bin/node

const fs = require('fs');

const environment = process.argv[2];
const file = fs.readFileSync(`./scripts/environments/${environment}.txt`, 'utf-8');
const dirTmp = './src/env/';
if (!fs.existsSync(dirTmp)) {
    fs.mkdirSync(dirTmp);
}
fs.writeFileSync(`${dirTmp}/index.tsx`, file);
