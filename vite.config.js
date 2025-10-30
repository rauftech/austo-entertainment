import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    cssCodeSplit: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/main.js'),
        index: resolve(__dirname, 'src/index.css'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]',

        globals: {
          gsap: 'gsap',
          'gsap/ScrollTrigger': 'ScrollTrigger',
          'gsap/Draggable': 'Draggable',
          'gsap/InertiaPlugin': 'InertiaPlugin',
          'gsap/CustomEase': 'CustomEase',
          'gsap/SplitText': 'SplitText',
        },
      },
      external: [
        'gsap',
        'gsap/ScrollTrigger',
        'gsap/Draggable',
        'gsap/InertiaPlugin',
        'gsap/CustomEase',
        'gsap/SplitText',
      ],
    },
    outDir: 'dist',
    emptyOutDir: true,
    minify: 'terser',
  },
  server: {
    port: 5173,
    cors: true,
    host: true,
  },
  base: './',
});
