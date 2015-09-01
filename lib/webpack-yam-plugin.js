'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _lodashObjectTransform = require('lodash/object/transform');

var _lodashObjectTransform2 = _interopRequireDefault(_lodashObjectTransform);

var _stripAnsi = require('strip-ansi');

var _stripAnsi2 = _interopRequireDefault(_stripAnsi);

/*
Webpack plugin that emits a manifest file in the following format

{
  status: "built" || "building" || "errors",
  errors: null || [
    "<error text>",
    ...
  ],
  files: null || {
    <entry>: [
      'rel/path/to/file.ext',
      ...
    ],
    ...
  }
}
 */

function WebpackYAMPlugin(_ref) {
  var manifestPath = _ref.manifestPath;
  var outputRoot = _ref.outputRoot;

  if (!manifestPath) throw new Error('WebpackYAMPlugin: no `manifestPath` option provided. It should be an absolute path to a file');
  if (!outputRoot) throw new Error('WebpackYAMPlugin: no `outputRoot` option provided. It should be an absolute path that your assets are served from');

  this.manifestPath = manifestPath;
  this.outputRoot = outputRoot;
}

WebpackYAMPlugin.prototype.apply = function (compiler) {
  var manifestPath = this.manifestPath;
  var outputRoot = this.outputRoot;

  if (!compiler.options.output.path) throw new Error('WebpackYAMPlugin: no `output.path` defined in config');
  var outputPath = compiler.options.output.path;

  compiler.plugin('compile', function (compiler, callback) {
    emitManifest({
      manifestPath: manifestPath,
      status: 'building'
    });
  });

  compiler.plugin('done', function (stats) {
    if (stats.hasErrors()) {
      emitManifest({
        manifestPath: manifestPath,
        status: 'errors',
        errors: stats.toJson().errors.map(function (err) {
          return (0, _stripAnsi2['default'])(err);
        })
      });
    } else {
      emitManifest({
        manifestPath: manifestPath,
        status: 'built',
        files: (0, _lodashObjectTransform2['default'])(stats.compilation.chunks, function (files, chunk) {
          files[chunk.name] = chunk.files.map(function (file) {
            var absPath = _path2['default'].join(outputPath, file);
            var relPath = absPath.slice(outputRoot.length);
            if (relPath[0] == _path2['default'].sep) {
              return relPath.slice(1);
            }
            return relPath;
          });
        }, {})
      });
    }
  });
};

function emitManifest(_ref2) {
  var manifestPath = _ref2.manifestPath;
  var status = _ref2.status;
  var _ref2$errors = _ref2.errors;
  var errors = _ref2$errors === undefined ? null : _ref2$errors;
  var _ref2$files = _ref2.files;
  var files = _ref2$files === undefined ? null : _ref2$files;

  if (!manifestPath) throw new Error('WebpackYAMPlugin: no `manifestPath` provided in call to emitManifest');
  if (!status) throw new Error('WebpackYAMPlugin: no `status` provided in call to emitManifest');

  var manifest = JSON.stringify({
    status: status,
    errors: errors,
    files: files
  }, null, 2);

  (0, _mkdirp2['default'])(_path2['default'].dirname(manifestPath), function (err) {
    if (err) throw err;

    _fs2['default'].writeFile(manifestPath, manifest, function (err) {
      if (err) throw err;
    });
  });
}

module.exports = WebpackYAMPlugin;
//# sourceMappingURL=webpack-yam-plugin.js.map