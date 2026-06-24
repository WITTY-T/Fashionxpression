import path from "path"
import { defineConfig } from "vite"

export default defineConfig({
  base: './',
  server: {
    port: 3000,
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        collection: path.resolve(__dirname, 'collection.html'),
        fabrics: path.resolve(__dirname, 'fabrics.html'),
        bespoke: path.resolve(__dirname, 'bespoke.html'),
        measurements: path.resolve(__dirname, 'measurements.html'),
        lookbook: path.resolve(__dirname, 'lookbook.html'),
        journal: path.resolve(__dirname, 'journal.html'),
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
