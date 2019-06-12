#!/usr/bin/env node
/* eslint-disable import/no-extraneous-dependencies,no-console */

const fs = require('fs');
const path = require('path');
const sass = require('node-sass');

const ROOT = path.join(__dirname, '..');
const OUT_DIR = 'css';
const STYLES_DIR = 'styles';

function buildCSS(options) {
  // Get the base filename.
  let filename = options.file
    .split('/')
    .pop()
    .replace('.scss', '');

  // Denote minified CSS.
  if (options.outputStyle === 'compressed') {
    filename = `${filename}.min`;
  }

  // Render CSS files.
  sass.render(options, (err, result) => {
    if (err) {
      console.log(err);
      process.exit(1);
    }

    fs.writeFileSync(path.join(ROOT, OUT_DIR, `${options.filename}.css`), result.css);
  });
}

// Create the output directory if it doesn't exist.
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR);
}

fs.readdirSync(STYLES_DIR).forEach((filename) => {
  // Output both expanded and minified versions.
  ['expanded'].forEach((outputStyle) => {
    buildCSS({
      file: path.join(STYLES_DIR, filename),
      filename,
      outputStyle,
    });
  });
});