const routes = [
  {
    path: "/",
    name: "home",
    componentName: "Home",
    meta: {
      // TODO: should the route have a meta 'hue', or have a meta colors object that includes the specific rgb values of menu, bg, etc...
      hue: undefined,
      menuItem: false
    }
  },
  {
    path: "/about",
    name: "about",
    componentName: "Page", // about
    meta: {
      hue: undefined,
      menuItem: true
    }
  },
  {
    path: "/issues",
    name: "issues",
    componentName: "Issues",
    meta: {
      hue: undefined,
      menuItem: true
    }
  },
  {
    path: "/issue/:issueSlug",
    name: "issue",
    componentName: "Issue",
    meta: {
      hue: undefined,
      menuItem: false
    }
  },
  {
    path: "/issue/:issueSlug/:essaySlug",
    name: "essay",
    componentName: "Essay",
    meta: {
      hue: undefined,
      menuItem: false
    }
  },
  {
    path: "/atlas",
    name: "atlas",
    componentName: "ComingSoon",
    meta: {
      hue: undefined,
      menuItem: true
    },
    children: [
      {
        path: ":projectSlug",
        name: "project",
        componentName: "ComingSoon"
      }
    ]
  },
  {
    path: "/events",
    name: "events",
    componentName: "ComingSoon",
    meta: {
      hue: undefined,
      menuItem: true
    },
    children: [
      {
        path: ":eventSlug",
        name: "event",
        componentName: "ComingSoon"
      }
    ]
  },
  {
    path: "/resources",
    name: "resources",
    componentName: "ComingSoon",
    meta: {
      hue: undefined,
      menuItem: true
    }
  },
  {
    path: "/contribute",
    name: "contribute",
    componentName: "Page",
    meta: {
      hue: undefined,
      menuItem: true
    }
  },
  {
    path: "/join-us",
    name: "join us",
    componentName: "Page",
    meta: {
      hue: undefined,
      menuItem: true
    }
  },
  {
    path: "/404",
    name: "not found",
    componentName: "NotFound",
    meta: {
      hue: undefined,
      menuItem: false
    }
  },
  {
    path: "*",
    name: "* not found",
    componentName: "NotFound",
    meta: {
      hue: undefined,
      menuItem: false
    }
  }
];

module.exports = { routes };
