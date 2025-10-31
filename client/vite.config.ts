import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import * as path from 'path';
import { defineConfig } from 'vite';

const srcPath = path.resolve(__dirname, 'src');

export default defineConfig({
	plugins: [react(), tailwindcss()],
	resolve: {
		alias: {
			'@api': path.resolve(srcPath, 'api'),
			'@hooks': path.resolve(srcPath, 'hooks'),
			'@utils': path.resolve(srcPath, 'utils'),
			'@components': path.resolve(srcPath, 'components'),
			'@store': path.resolve(srcPath, 'store'),
			'@config': path.resolve(srcPath, 'config'),
			'@appTypes': path.resolve(srcPath, 'types'),
			'@': srcPath,
		},
	},
});
