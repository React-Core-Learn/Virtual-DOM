import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  esbuild: {
    jsx: 'transform',
    jsxInject: `import { h, Fragment } from '@/lib/jsx/jsx-runtime'`,
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
  },
});
