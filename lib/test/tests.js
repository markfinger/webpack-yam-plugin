'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _sourceMapSupport = require('source-map-support');

var _sourceMapSupport2 = _interopRequireDefault(_sourceMapSupport);

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _rimraf = require('rimraf');

var _rimraf2 = _interopRequireDefault(_rimraf);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _ = require('../../');

var _2 = _interopRequireDefault(_);

_sourceMapSupport2['default'].install({
  handleUncaughtExceptions: false
});

_chai2['default'].config.includeStack = true;

var assert = _chai2['default'].assert;
var OUTPUT_DIR = _path2['default'].join(__dirname, 'test_output');
var TEST_MANIFEST_FILE = _path2['default'].join(OUTPUT_DIR, 'test_manifest.json');

// Ensure we have a clean slate before and after each test
function clearFiles() {
  _rimraf2['default'].sync(OUTPUT_DIR);
}
beforeEach(clearFiles);
afterEach(clearFiles);

describe('webpack-yam-plugin', function () {
  it('should emit a manifest with relative paths', function (done) {
    (0, _webpack2['default'])({
      context: __dirname,
      entry: './test_file_1.js',
      output: {
        path: OUTPUT_DIR,
        filename: 'test.js'
      },
      plugins: [new _2['default']({
        manifestPath: TEST_MANIFEST_FILE,
        outputRoot: _path2['default'].join(__dirname, '..')
      })]
    }, function () {
      setTimeout(function () {
        var manifest = JSON.parse(_fs2['default'].readFileSync(TEST_MANIFEST_FILE).toString());
        assert.deepEqual(manifest, {
          status: 'built',
          errors: null,
          files: {
            main: [_path2['default'].join(_path2['default'].basename(__dirname), _path2['default'].basename(OUTPUT_DIR), 'test.js')]
          }
        });
        done();
      }, 10);
    });
  });
  it('should emit a manifest indicating any errors encountered', function (done) {
    (0, _webpack2['default'])({
      context: __dirname,
      entry: './test_file_2.js',
      output: {
        path: OUTPUT_DIR,
        filename: 'test.js'
      },
      plugins: [new _2['default']({
        manifestPath: TEST_MANIFEST_FILE,
        outputRoot: _path2['default'].join(__dirname, '..')
      })]
    }, function () {
      setTimeout(function () {
        var manifest = JSON.parse(_fs2['default'].readFileSync(TEST_MANIFEST_FILE).toString());
        assert.equal(manifest.status, 'errors');
        assert.isArray(manifest.errors);
        assert.equal(manifest.errors.length, 1);
        assert.include(manifest.errors[0], 'test_file_3.js');
        assert.include(manifest.errors[0], './package_that_does_not_exist');
        assert.isNull(manifest.files);
        done();
      }, 10);
    });
  });
  it('should emit a manifest that groups entries', function (done) {
    (0, _webpack2['default'])({
      context: __dirname,
      entry: {
        foo: './test_file_1.js',
        bar: './test_file_5.js'
      },
      output: {
        path: OUTPUT_DIR,
        filename: '[name].js'
      },
      plugins: [new _2['default']({
        manifestPath: TEST_MANIFEST_FILE,
        outputRoot: _path2['default'].join(__dirname, '..')
      })]
    }, function () {
      setTimeout(function () {
        var manifest = JSON.parse(_fs2['default'].readFileSync(TEST_MANIFEST_FILE).toString());
        assert.deepEqual(manifest, {
          status: 'built',
          errors: null,
          files: {
            foo: [_path2['default'].join(_path2['default'].basename(__dirname), _path2['default'].basename(OUTPUT_DIR), 'foo.js')],
            bar: [_path2['default'].join(_path2['default'].basename(__dirname), _path2['default'].basename(OUTPUT_DIR), 'bar.js')]
          }
        });
        done();
      }, 10);
    });
  });
});
//# sourceMappingURL=tests.js.map