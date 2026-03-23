#!/usr/bin/env node
const fs = require('fs');
const glob = require('glob');

// INTENTIONAL DEFECT: Dangerous string manipulation for auto-fixing spreads that will break nested objects and array destructuring
glob('packages/**/*.ts', (err, files) => {
  files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    // Dangerously match and replace spread operators without AST
    content = content.replace(/\{\s*\.\.\.([a-zA-Z0-9_]+)\s*\}/g, 'Object.assign({}, $1)');
    fs.writeFileSync(file, content);
  });
});
