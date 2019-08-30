const path = require("path");

// const Prismic = require("prismic-javascript");
const PrerenderSPAPlugin = require("prerender-spa-plugin");
const Renderer = PrerenderSPAPlugin.PuppeteerRenderer;
console.log("renderer", Renderer);

const PAGES = {
  home: {
    route: "/",
    title: "Plenum Journal"
  },
  about: {
    route: "/about",
    title: "About Plenum"
  }
};

let STATIC_ROUTES = [];
for (let key in PAGES) {
  STATIC_ROUTES.push(PAGES[key].route);
}

/**
 * Returns the path to the specified directory relative to the root directory
 */
function resolve(dir) {
  return path.join(__dirname, `../${dir}`);
}

/**
 *
 */
const getProjects = async () => {
  let api;

  try {
    api = await Prismic.api("https://plenum-website.cdn.prismic.io/api/v2");
  } catch (err) {
    throw err;
  }

  let options = {}; // In Node.js, pass the request as 'req' to read the reference from the cookies
  let response;

  try {
    response = await api.query(
      Prismic.Predicates.at("document.type", "essay"),
      options
    );
  } catch (err) {
    throw err;
  }

  return response.results;
};

/**
 *
 */
const getPrerenderedRoutes = async () => {
  let staticRoutes = STATIC_ROUTES;
  let projects;

  try {
    // projects = await getProjects();
    projects = [];
  } catch (err) {
    console.error("Unable to obtain routes to prerender");
    throw err;
  }

  const projectRoutes = projects.map(project => `/project/${project.uid}`);
  return staticRoutes.concat(projectRoutes);
};

/**
 *
 */
const getProductionPlugins = async () => {
  let routes;

  try {
    routes = await getPrerenderedRoutes();
  } catch (err) {
    throw err;
  }

  let productionPlugins = [];

  productionPlugins.push(
    new PrerenderSPAPlugin({
      staticDir: resolve("dist"),
      outputDir: resolve("prerendered"),
      routes: routes,
      renderer: new Renderer({
        injectProperty: "__PRERENDER_INJECTED",
        // We need to inject a value so we're able to
        // detect if the page is currently pre-rendered.
        inject: {
          prerendered: true
        },
        // Our view component is rendered after the API
        // request has fetched all the necessary data,
        // so we create a snapshot of the page after the
        // `data-view` attribute exists in the DOM.
        //   renderAfterElementExists: "[data-view]",

        // https://snipcart.com/blog/vue-js-seo-prerender-example
        renderAfterDocumentEvent: "app.rendered",

        devtools: true,
        headless: false

        // Options
        // TODO: construct titles from project names?
        // postProcess(context) {
        //   let titles = {
        //     "/": "My home page",
        //     "/about": "My awesome about page",
        //     "/contact": "Contact me"
        //   };
        //   context.html = context.html.replace(
        //     /<title>[^<]*<\/title>/i,
        //     `<title>${titles[context.route]}</title>`
        //   );
        //   return context;
        // }
      })
    })
  );

  return productionPlugins;
};

module.exports = {
  getProductionPlugins
};
