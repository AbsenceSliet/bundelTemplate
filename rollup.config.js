import del from 'rollup-plugin-delete';
import typescript from 'rollup-plugin-typescript2';
import babel from '@rollup/plugin-babel';
import external from 'rollup-plugin-peer-deps-external';
import path from 'path';
import { DEFAULT_EXTENSIONS } from '@babel/core';
import pkg from './package.json';
import { builtinModules } from 'module';
const getPath = (_path) => path.resolve(__dirname, _path);

const extensions = ['.js', '.ts', '.tsx'];

const tsPlugin = typescript({
  tsconfig: getPath('./tsconfig.json'),
  extensions,
});

export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: pkg.module,
      format: 'esm',
      sourcemap: true,
    },
  ],
  plugins: [
    external(),
    tsPlugin,
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'runtime',
      extensions: [...DEFAULT_EXTENSIONS, '.ts', '.tsx'],
    }),
    del({ targets: ['dist/*'] }),
  ],
  external: [
    ...builtinModules,
    ...(pkg.dependencies == null ? [] : Object.keys(pkg.dependencies)),
    ...(pkg.devDependencies == null ? [] : Object.keys(pkg.devDependencies)),
    ...(pkg.peerDependencies == null ? [] : Object.keys(pkg.peerDependencies)),
    // 对于 @babel/runtime 使用正则来排除
    /@babel\/runtime/,
  ],
};
