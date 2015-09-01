#!/usr/bin/env node
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var PROJECT_ROOT = _path2['default'].join(__dirname, '..');

console.log('Building project from ' + PROJECT_ROOT);

var SOURCE_DIRS = _defineProperty({}, _path2['default'].join(PROJECT_ROOT, 'src'), _path2['default'].join(PROJECT_ROOT, 'lib'));

// Remove the previously built versions
console.log('\nRemoving directories...');
Object.values(SOURCE_DIRS).forEach(function (outputDir) {
  console.log('Removing ' + outputDir);
  var rm = _child_process2['default'].spawnSync('rm', ['-rf', outputDir]);

  var stderr = rm.stderr.toString();
  if (stderr) {
    throw new Error(stderr);
  }

  var stdout = rm.stdout.toString();
  if (stdout) {
    console.log(stdout);
  }
});

// Rebuild from the source files
console.log('\nRebuilding and watching directories...');
Object.keys(SOURCE_DIRS).forEach(function (sourceDir) {
  var outputDir = SOURCE_DIRS[sourceDir];

  var babel = _child_process2['default'].spawn(_path2['default'].join(PROJECT_ROOT, 'node_modules', '.bin', 'babel'), [sourceDir, '--out-dir', outputDir, '--source-maps', '--watch']);

  babel.stderr.on('data', function (data) {
    process.stderr.write(data);
  });

  babel.stdout.on('data', function (data) {
    process.stdout.write(data);
  });
});
//# sourceMappingURL=build.js.map