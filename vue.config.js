const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData:
          '\n          @import "@/sass/_variables.scss";\n          @import "@/sass/_mixins.scss";\n          @import "@/sass/main.scss";\n        ',
      },
    },
  },
  transpileDependencies: [
    "@glidejs/glide",
    "bootstrap",
    "bootstrap-vue",
    "chart.js",
    "file-saver",
    "jszip",
    "sortablejs",
    "string-similarity",
    "vue-plyr",
    "vue-shell",
    "vue-shirtkey",
    "vue2-perfect-scrollbar",
    "vuedraggable",
  ],
  assetsDir: "./assets/",

  configureWebpack: {
    plugins: [
      new CopyPlugin({
        patterns: [{ from: "src/assets", to: "assets" }],
      }),
    ],
  },

  productionSourceMap: false,
};
