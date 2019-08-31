const path = require("path");
const PrerenderSPAPlugin = require("prerender-spa-plugin");
const Renderer = PrerenderSPAPlugin.PuppeteerRenderer;

/**
 * Returns the path to the specified directory relative to the root directory
 */
function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  // Add scss variables in _settings.scss to scss global scope
  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "scss",
      patterns: ["./src/styles/globals.scss"]
    }
  },
  chainWebpack: config => {
    // Create environment variable of the build date
    config.plugin("define").tap(definitions => {
      definitions[0]["process.env"][
        "BUILD_DATE_ISO"
      ] = new Date().toISOString();

      return definitions;
    });

    // Resolve file references that start with "assets"
    config.resolve.alias.set("assets", resolve("src/assets"));

    // Allow inline svgs and style tag svgs, both in parallel
    const svgRule = config.module.rule("svg");
    const inlineSvgRule = config.module.rule("inline-svg");

    svgRule.exclude.add(/inline\.(.*)\.svg/).end();

    inlineSvgRule
      .test(/inline\.(.*)\.svg/)
      .use("vue-svg-loader")
      .loader("vue-svg-loader");
  },
  configureWebpack: {
    plugins: [
      new PrerenderSPAPlugin({
        staticDir: resolve("dist"),
        outputDir: resolve("dist"),
        routes: ["/", "/about", "/test"],

        renderer: new Renderer({
          inject: {
            foo: "bar"
          },
          headless: true,
          renderAfterDocumentEvent: "render-event"
        })
      })
    ]
  }
};

/*
  Prismic prerender build
*/
// const BuildUtil = require("./prerender.build.js");

/*
  Webpack Exports
*/
// module.exports = {
//   runtimeCompiler: false, // One prerender guide set to true
//   productionSourceMap: false, // TODO: should be on, 'terser' dependency is buggy

//   // Add scss variables in _settings.scss to scss global scope
//   pluginOptions: {
//     "style-resources-loader": {
//       preProcessor: "scss",
//       patterns: ["./src/styles/globals.scss"]
//     }
//   },
//   configureWebpack: {
//     plugins: BuildUtil.plugins
//   },
//   chainWebpack: config => {
//     // Create environment variable of the build date
//     config.plugin("define").tap(definitions => {
//       definitions[0]["process.env"][
//         "BUILD_DATE_ISO"
//       ] = new Date().toISOString();

//       return definitions;
//     });

//     // Resolve file references that start with "assets"
//     config.resolve.alias.set("assets", resolve("src/assets"));

//     // Allow inline svgs and style tag svgs, both in parallel
//     const svgRule = config.module.rule("svg");
//     const inlineSvgRule = config.module.rule("inline-svg");

//     svgRule.exclude.add(/inline\.(.*)\.svg/).end();

//     inlineSvgRule
//       .test(/inline\.(.*)\.svg/)
//       .use("vue-svg-loader")
//       .loader("vue-svg-loader");
//   }

//   // configureWebpack: async config => {
//   //   if (process.env.BUILD_OPTION === "prerender") {
//   //     // Set within .env file of prerender mode
//   //     let plugins;

//   //     try {
//   //       plugins = await BuildUtil.getProductionPlugins();
//   //     } catch (err) {
//   //       throw err;
//   //     }

//   //     (config.plugins || []).concat(...plugins);
//   //   }
//   // }
// };
