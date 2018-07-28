// rollup.config.js
const resolveNode = require('rollup-plugin-node-resolve');
const babel = require('rollup-plugin-babel');
const replace = require('rollup-plugin-replace');
const scss = require('rollup-plugin-scss');
const alias = require('rollup-plugin-alias');
const path = require('path');
const version = process.env.VERSION || require('../package.json').version;

const banner = `/*
    * Vuescroll v${version}
    * (c) 2018-${new Date().getFullYear()} Yi(Yves) Wang
    * Released under the MIT License
    * Github Link: https://github.com/YvesCoding/vuescroll
    */
   `;

const aliases = require('./alias');

const resolve = p => {
  const base = p.split('/')[0];
  if (aliases[base]) {
    return path.resolve(aliases[base], p.slice(base.length + 1));
  } else {
    return path.resolve(__dirname, '../', p);
  }
};

const builds = {
  umd: {
    entry: resolve('mode/entry-mix.js'),
    dest: resolve('dist/vuescroll.js'),
    format: 'umd',
    external: ['vue'],
    banner
  }
};

function genConfig(name) {
  const opts = builds[name];
  const config = {
    input: opts.entry,
    external: opts.external,
    output: {
      globals: {
        vue: 'Vue'
      },
      file: opts.dest,
      format: opts.format,
      banner: opts.banner,
      name: opts.moduleName || 'vuescroll',
      sourcemap: opts.sourcemap
    },
    plugins: [
      resolveNode(),
      scss({
        output: 'dist/vuescroll.css',
        outputStyle: 'compressed'
      }),
      babel({
        exclude: 'node_modules/**' // only transpile our source code
      }),
      replace({
        'process.env.NODE_FORMAT': JSON.stringify(opts.format),
        __version__: version
      }),
      alias(Object.assign({}, aliases, opts.alias))
    ]
  };
  return config;
}

exports.getBuild = genConfig;
exports.getAllBuilds = () => Object.keys(builds).map(genConfig);
