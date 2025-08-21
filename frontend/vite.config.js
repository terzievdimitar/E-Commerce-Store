import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	build: {
		outDir: '../dist', // <-- This puts dist in the project root
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
