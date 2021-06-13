const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: `
          @import "@/sass/_variables.scss";
          @import "@/sass/_mixins.scss";
          @import "@/sass/main.scss";
        `,
      },
    },
  },
  assetsDir: "./assets/",
  configureWebpack: {
    plugins: [
      new CopyPlugin({
        patterns: [{ from: "src/assets", to: "assets" }],
      }),
    ],
  },
};
