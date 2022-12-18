import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const srcPath = fileURLToPath(new URL('./src', import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      components: path.join(srcPath, 'components'),
      hooks: path.join(srcPath, 'hooks'),
      services: path.join(srcPath, 'services'),
      styles: path.join(srcPath, 'styles'),
      types: path.join(srcPath, 'types'),
      utils: path.join(srcPath, 'utils')
    }
  },
  server: { port: 5173, host: '0.0.0.0' }
});
