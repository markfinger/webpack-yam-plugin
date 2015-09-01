webpack-yam-plugin
==================

Yet another manifest plugin for webpack.

The key difference in this plugin is that only preserves paths in a relative form,
so you can commit and deploy the manifest to remote locations without any issues.
Using a manifest enables you to hash the file names without complicating your
deployments, it also enables you to easily integrate pre-built assets from libraries.

A [python manifest reader](https://github.com/markfinger/python-webpack-manifest) is
available to consume the generated manifests.


Installation
------------

```
npm install webpack-yam-plugin
```


Usage
-----

```javascript
import WebpackManifestPlugin from 'webpack-yam-plugin';

module.exports = {
  // ...
  plugins: [
    new WebpackManifestPlugin({
      manifestPath: '/abs/path/to/webpack_manifest.json',
      outputRoot: '/abs/path/to/your/static_root'
    })
  ]
};
```


Options
-------

### manifestPath

An absolute path to a file that the manifest will be written to.

### outputRoot

An absolute path to a directory that manifest paths will be relative to.

If you're outputting files to `/foo/bar/woz` and the contents of `/foo/bar` are
exposed via a webserver, set `outputRoot` to `/foo/bar` and the manifest paths
will take the form `woz/some_file.js`. Assuming your files were served from
`/static/` you can easily prepend the root static url and serve the asset as
`/static/woz/some_file.js`.


Manifest schema
---------------

Manifests can take three forms, depending on the state and outcome of the build.

If webpack is still building, manifests will look like

```javascript
{
  status: "building",
  errors: null,
  files: null
}
```

Once webpack has completed successfully, manifests will look like

```javascript
{
  status: "built",
  errors: null,
  files: {
    <entry>: [
      'rel/path/to/some_file.js',
      ...
    ],
    ...
  }
}
```

If any errors are encountered during the build, manifests will look like

```
{
  status: "errors",
  errors: [
    "<error text>",
    ...
  ],
  files: null
}
```
