import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	build: {
		emptyOutDir: true, // Clean the output dir before building
	},
	server: {
		proxy: {
			'/api': {
				target: 'http://localhost:3000',
			},
		},
	},
});
