const routes = [
  {
    path: "/",
    name: "home",
    componentName: "home",
    meta: {
      // TODO: should the route have a meta 'hue', or have a meta colors object that includes the specific rgb values of menu, bg, etc...
      hue: undefined,
      menuItem: false
    }
  },
  {
    path: "/about",
    name: "about",
    componentName: "page", // about
    meta: {
      hue: undefined,
      menuItem: true
    }
  },
  {
    path: "/issues",
    name: "issues",
    componentName: "issues",
    meta: {
      hue: undefined,
      menuItem: true
    }
  },
  {
    path: "/issue/:issueSlug",
    name: "issue",
    componentName: "issue",
    meta: {
      hue: undefined,
      menuItem: false
    }
  },
  {
    path: "/issue/:issueSlug/:articleSlug",
    name: "article",
    componentName: "article",
    meta: {
      hue: undefined,
      menuItem: false
    }
  },
  {
    path: "/atlas",
    name: "atlas",
    componentName: "page",
    meta: {
      hue: undefined,
      menuItem: true
    },
    children: [
      {
        path: ":projectSlug",
        name: "project",
        componentName: "page"
      }
    ]
  },
  {
    path: "/events",
    name: "events",
    componentName: "page",
    meta: {
      hue: undefined,
      menuItem: true
    },
    children: [
      {
        path: ":eventSlug",
        name: "event",
        componentName: "page"
      }
    ]
  },
  {
    path: "/resources",
    name: "resources",
    componentName: "page",
    meta: {
      hue: undefined,
      menuItem: true
    }
  },
  {
    path: "/contribute",
    name: "contribute",
    componentName: "page",
    meta: {
      hue: undefined,
      menuItem: true
    }
  },
  {
    path: "/join-us",
    name: "join us",
    componentName: "page",
    meta: {
      hue: undefined,
      menuItem: true
    }
  },
  {
    path: "/404",
    name: "not found",
    componentName: "page",
    meta: {
      hue: undefined,
      menuItem: false
    }
  },
  {
    path: "*",
    name: "not found x",
    componentName: "page",
    meta: {
      hue: undefined,
      menuItem: false
    }
  }
];

module.exports = { routes };
