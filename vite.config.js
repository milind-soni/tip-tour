const path = require('path')
const { defineConfig } = require('vite')

const LIB_NAME = 'tiptour-selector'

module.exports = defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'lib/main.ts'),
      name: LIB_NAME,
      fileName: (format) => `${LIB_NAME}.${format}.js`
    },
    minify: "terser"
  }
});