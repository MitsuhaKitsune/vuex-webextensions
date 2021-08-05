import { babel } from '@rollup/plugin-babel';
import { uglify } from 'rollup-plugin-uglify';

export default [
  {
    input: './src/index.js',
    output: {
      file: './dist/index.js',
      format: 'cjs',
      name: 'index',
      sourcemap: true
    },
    external: ['vuex'],
    plugins: [babel(), uglify()]
  }
];
