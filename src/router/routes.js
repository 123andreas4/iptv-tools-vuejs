import { AppRoot, UserRole, SubscriptionType, PlaylistType } from "../constants/config";
import store from "../store";

/*

  Vue Router Routes

*/
export default [
  /********************************
   *								               *
   *			  			Home	           *
   *								               *
   ********************************/
  {
    path: "/",
    name: "home",
    component: () => import(/* webpackChunkName: "home" */ "../views/home"),
    meta: {
      requiresAuth: false,
      scrollToTop: true,
    },
  },

  /********************************
   *                               *
   *              APP              *
   *                               *
   ********************************/
  {
    path: AppRoot,
    component: () => import(/* webpackChunkName: "dashboard" */ "../views/app"),
    name: "app",
    redirect: () => {
      if (
        [UserRole.SuperAdmin, UserRole.Admin, UserRole.Moderator].includes(
          store.getters.currentUser.user.role
        )
      ) {
        return `${AppRoot}/dashboard/start`;
      } else {
        return `${AppRoot}/start/dashboard`;
      }
    },
    meta: {
      requiresAuth: true,
      roles: [
        UserRole.SuperAdmin,
        UserRole.Admin,
        UserRole.Moderator,
        UserRole.User,
      ],
    },
    children: [
      /********************************
       *                               *
       *            Dashboard          *
       *                               *
       ********************************/
      {
        path: "dashboard",
        name: "dashboard",
        component: () =>
          import(/* webpackChunkName: "dashboard" */ "../views/app/dashboard"),
        redirect: `${AppRoot}/dashboard/start`,
        meta: {
          roles: [UserRole.SuperAdmin, UserRole.Admin],
        },
        children: [
          {
            path: "start",
            name: "start",
            component: () =>
              import(
                /* webpackChunkName: "dashboard" */ "../views/app/dashboard/start/start"
              ),
            meta: {
              roles: [UserRole.SuperAdmin, UserRole.Admin],
            },
          },
        ],
      },
      /********************************
       *                               *
       *        Administration         *
       *                               *
       ********************************/
      {
        path: "administration",
        name: "administration",
        component: () =>
          import(
            /* webpackChunkName: "administration" */ "../views/app/administration"
          ),
        redirect: `${AppRoot}/administration/users`,
        meta: {
          roles: [UserRole.SuperAdmin, UserRole.Admin, UserRole.Moderator],
        },
        children: [
          {
            path: "users",
            name: "users",
            component: () =>
              import(
                /* webpackChunkName: "administration" */ "../views/app/administration/users"
              ),
            meta: {
              roles: [UserRole.SuperAdmin, UserRole.Admin, UserRole.Moderator],
            },
          },
          {
            path: "profiles",
            name: "profiles",
            component: () =>
              import(
                /* webpackChunkName: "administration" */ "../views/app/administration/profiles"
              ),
            meta: {
              roles: [UserRole.SuperAdmin, UserRole.Admin, UserRole.Moderator],
            },
          },
          {
            path: "subscriptions",
            name: "subscriptions",
            component: () =>
              import(
                /* webpackChunkName: "administration" */ "../views/app/administration/subscriptions"
              ),
            meta: {
              roles: [UserRole.SuperAdmin, UserRole.Admin],
            },
          },
          {
            path: "logins",
            name: "logins",
            component: () =>
              import(
                /* webpackChunkName: "administration" */ "../views/app/administration/logins"
              ),
            meta: {
              roles: [UserRole.SuperAdmin, UserRole.Admin, UserRole.Moderator],
            },
          },
          {
            path: "confirm",
            name: "confirm",
            component: () =>
              import(
                /* webpackChunkName: "administration" */ "../views/app/administration/confirm"
              ),
            meta: {
              roles: [UserRole.SuperAdmin, UserRole.Admin, UserRole.Moderator],
            },
          },
          {
            path: "forgot",
            name: "forgot",
            component: () =>
              import(
                /* webpackChunkName: "administration" */ "../views/app/administration/forgot"
              ),
            meta: {
              roles: [UserRole.SuperAdmin, UserRole.Admin, UserRole.Moderator],
            },
          },
        ],
      },
      /********************************
       *                               *
       *            Tickets            *
       *                               *
       ********************************/
      {
        path: "tickets",
        name: "tickets",
        component: () =>
          import(/* webpackChunkName: "tickets" */ "../views/app/tickets"),
        redirect: `${AppRoot}/tickets/open`,
        meta: {
          roles: [UserRole.SuperAdmin, UserRole.Admin, UserRole.Moderator],
        },
        children: [
          {
            path: "open",
            name: "open",
            component: () =>
              import(
                /* webpackChunkName: "tickets" */ "../views/app/tickets/open"
              ),
            meta: {
              roles: [UserRole.SuperAdmin, UserRole.Admin, UserRole.Moderator],
            },
          },
          {
            path: "answered",
            name: "answered",
            component: () =>
              import(
                /* webpackChunkName: "tickets" */ "../views/app/tickets/answered"
              ),
            meta: {
              roles: [UserRole.SuperAdmin, UserRole.Admin, UserRole.Moderator],
            },
          },
          {
            path: "closed",
            name: "closed",
            component: () =>
              import(
                /* webpackChunkName: "tickets" */ "../views/app/tickets/closed"
              ),
            meta: {
              roles: [UserRole.SuperAdmin, UserRole.Admin, UserRole.Moderator],
            },
          },
          {
            path: "archived",
            name: "archived",
            component: () =>
              import(
                /* webpackChunkName: "tickets" */ "../views/app/tickets/archived"
              ),
            meta: {
              roles: [UserRole.SuperAdmin, UserRole.Admin, UserRole.Moderator],
            },
          },
        ],
      },
      /********************************
       *                               *
       *           Financial           *
       *                               *
       ********************************/
      {
        path: "financial",
        name: "financial",
        component: () =>
          import(/* webpackChunkName: "financial" */ "../views/app/financial"),
        redirect: `${AppRoot}/financial/payments`,
        meta: {
          roles: [UserRole.SuperAdmin, UserRole.Admin],
        },
        children: [
          {
            path: "payments",
            name: "payments",
            component: () =>
              import(
                /* webpackChunkName: "financial" */ "../views/app/financial/payments"
              ),
            meta: {
              roles: [UserRole.SuperAdmin, UserRole.Admin],
            },
          },
          {
            path: "invoices",
            name: "invoices",
            component: () =>
              import(
                /* webpackChunkName: "financial" */ "../views/app/financial/invoices"
              ),
            meta: {
              roles: [UserRole.SuperAdmin, UserRole.Admin],
            },
          },
          {
            path: "statistics",
            name: "statistics",
            component: () =>
              import(
                /* webpackChunkName: "financial" */ "../views/app/financial/statistics"
              ),
            meta: {
              roles: [UserRole.SuperAdmin, UserRole.Admin],
            },
          },
        ],
      },
      /********************************
       *                               *
       *            Sources            *
       *                               *
       ********************************/
      {
        path: "tools",
        name: "tools",
        component: () =>
          import(/* webpackChunkName: "tools" */ "../views/app/app-sources"),
        redirect: `${AppRoot}/tools/xmltv`,
        meta: {
          roles: [UserRole.SuperAdmin, UserRole.Admin],
        },
        children: [
          {
            path: "xmltv",
            name: "xmltv",
            component: () =>
              import(
                /* webpackChunkName: "tools" */ "../views/app/app-sources/xmltv"
              ),
            meta: {
              roles: [UserRole.SuperAdmin, UserRole.Admin],
            },
          },
          {
            path: "scheduler",
            name: "scheduler",
            component: () =>
              import(
                /* webpackChunkName: "tools" */ "../views/app/app-sources/scheduler"
              ),
            meta: {
              roles: [UserRole.SuperAdmin, UserRole.Admin],
            },
          },
          {
            path: "terminal",
            name: "terminal",
            component: () =>
              import(
                /* webpackChunkName: "tools" */ "../views/app/app-sources/terminal"
              ),
            meta: {
              roles: [UserRole.SuperAdmin, UserRole.Admin],
            },
          },
        ],
      },
      /********************************
       *                               *
       *             Start             *
       *                               *
       ********************************/
      {
        path: "start",
        name: "start",
        component: () =>
          import(/* webpackChunkName: "start" */ "../views/app/start/"),
        redirect: `${AppRoot}/start/dashboard`,
        meta: {
          roles: [UserRole.User, UserRole.External, UserRole.Guest],
        },
        children: [
          {
            path: "dashboard",
            name: "dashboard",
            component: () =>
              import(
                /* webpackChunkName: "start" */ "../views/app/start/dashboard"
              ),
          },
        ],
      },
      /********************************
       *                               *
       *             Xtream            *
       *                               *
       ********************************/
      {
        path: "xtream",
        name: "xtream",
        component: () =>
          import(/* webpackChunkName: "xtream" */ "../views/app/xtream/"),
        redirect: `${AppRoot}/xtream/playlists`,
        meta: {
          roles: [UserRole.User, UserRole.External, UserRole.Guest],
          playlistType: [PlaylistType.All, PlaylistType.Xtream],
        },
        children: [
          {
            path: "playlists",
            name: "playlists",
            component: () =>
              import(
                /* webpackChunkName: "xtream" */ "../views/app/xtream/playlists"
              ),
          },
          {
            path: "editor",
            name: "editor",
            component: () =>
              import(
                /* webpackChunkName: "xtream" */ "../views/app/xtream/editor"
              ),
          },
          {
            path: "groups",
            name: "groups",
            component: () =>
              import(
                /* webpackChunkName: "xtream" */ "../views/app/xtream/groups"
              ),
          },
          {
            path: "live",
            name: "live",
            component: () =>
              import(
                /* webpackChunkName: "xtream" */ "../views/app/xtream/live"
              ),
          },
          {
            path: "movies",
            name: "movies",
            meta: {
              subscriptions: [
                SubscriptionType.Professional,
                SubscriptionType.Family,
                SubscriptionType.BusinessSmall,
                SubscriptionType.BusinessProfessional,
                SubscriptionType.BusinessEnterprise,
                SubscriptionType.Manager,
              ],
            },
            component: () =>
              import(
                /* webpackChunkName: "xtream" */ "../views/app/xtream/movies"
              ),
          },
          {
            path: "series",
            name: "series",
            meta: {
              subscriptions: [
                SubscriptionType.Professional,
                SubscriptionType.Family,
                SubscriptionType.BusinessSmall,
                SubscriptionType.BusinessProfessional,
                SubscriptionType.BusinessEnterprise,
                SubscriptionType.Manager,
              ],
            },
            component: () =>
              import(
                /* webpackChunkName: "xtream" */ "../views/app/xtream/series"
              ),
          },
        ],
      },
      /********************************
       *                               *
       *             MOVIES            *
       *                               *
       ********************************/
       {
        path: "movies",
        name: "movies",
        component: () =>
          import(/* webpackChunkName: "movies" */ "../views/app/movies"),
        redirect: `${AppRoot}/movies/now-playing`,
        meta: {
          roles: [UserRole.User, UserRole.External, UserRole.Guest],
          subscriptions: [
            SubscriptionType.Professional,
            SubscriptionType.Family,
            SubscriptionType.BusinessSmall,
            SubscriptionType.BusinessProfessional,
            SubscriptionType.BusinessEnterprise,
            SubscriptionType.Manager,
          ],
        },
        children: [
          {
            path: "now-playing",
            name: "now-playing",
            component: () =>
              import(
                /* webpackChunkName: "movies" */ "../views/app/movies/now-playing"
              ),
          },
          {
            path: "top-rated",
            name: "top-rated",
            component: () =>
              import(
                /* webpackChunkName: "movies" */ "../views/app/movies/top-rated"
              ),
          },
          {
            path: "popular",
            name: "popular",
            component: () =>
              import(
                /* webpackChunkName: "movies" */ "../views/app/movies/popular"
              ),
          },
          {
            path: "browse",
            name: "browse",
            component: () =>
              import(
                /* webpackChunkName: "movies" */ "../views/app/movies/browse"
              ),
          },
          {
            path: "search",
            name: "search",
            component: () =>
              import(
                /* webpackChunkName: "movies" */ "../views/app/movies/search"
              ),
          },
        ],
      },
      /********************************
       *                               *
       *             SERIES            *
       *                               *
       ********************************/
       {
        path: "series",
        name: "series",
        component: () =>
          import(/* webpackChunkName: "series" */ "../views/app/movies"),
        redirect: `${AppRoot}/series/on-the-air`,
        meta: {
          roles: [UserRole.User, UserRole.External, UserRole.Guest],
          subscriptions: [
            SubscriptionType.Professional,
            SubscriptionType.Family,
            SubscriptionType.BusinessSmall,
            SubscriptionType.BusinessProfessional,
            SubscriptionType.BusinessEnterprise,
            SubscriptionType.Manager,
          ],
        },
        children: [
          {
            path: "on-the-air",
            name: "on-the-air",
            component: () =>
              import(
                /* webpackChunkName: "series" */ "../views/app/series/on-the-air"
              ),
          },
          {
            path: "popular",
            name: "popular",
            component: () =>
              import(
                /* webpackChunkName: "series" */ "../views/app/series/popular"
              ),
          },
          {
            path: "top-rated",
            name: "top-rated",
            component: () =>
              import(
                /* webpackChunkName: "series" */ "../views/app/series/top-rated"
              ),
          },
          {
            path: "browse",
            name: "browse",
            component: () =>
              import(
                /* webpackChunkName: "series" */ "../views/app/series/browse"
              ),
          },
          {
            path: "search",
            name: "search",
            component: () =>
              import(
                /* webpackChunkName: "series" */ "../views/app/series/search"
              ),
          },
        ],
      },
      
      
      /********************************
       *                               *
       *         APPLICATIONS          *
       *                               *
       ********************************/
       {
        path: "applications",
        name: "applications",
        component: () =>
          import(/* webpackChunkName: "applications" */ "../views/app/tools/applications"),
        redirect: `${AppRoot}/applications/xdpro`,
        meta: {
          roles: [UserRole.User, UserRole.External, UserRole.Guest],
          subscriptions: [
            SubscriptionType.Professional,
            SubscriptionType.Family,
            SubscriptionType.BusinessSmall,
            SubscriptionType.BusinessProfessional,
            SubscriptionType.BusinessEnterprise,
            SubscriptionType.Manager,
          ],
        },
        children: [
          {
            path: "xd-pro",
            name: "xd-pro",
            component: () =>
              import(
                /* webpackChunkName: "applications" */ "../views/app/tools/applications/xdpro"
              ),
          },
          
        ],
      },
      /********************************
       *                               *
       *              User             *
       *                               *
       ********************************/
      {
        path: "user",
        name: "user",
        component: () =>
          import(/* webpackChunkName: "user" */ "../views/app/user"),
        redirect: `${AppRoot}/user/default`,
        meta: {
          roles: [
            UserRole.SuperAdmin,
            UserRole.Admin,
            UserRole.Moderator,
            UserRole.User,
          ],
        },
        children: [
          {
            path: "profile",
            name: "profile",
            component: () =>
              import(
                /* webpackChunkName: "user" */ "../views/app/user/profile"
              ),
            meta: {
              roles: [
                UserRole.SuperAdmin,
                UserRole.Admin,
                UserRole.Moderator,
                UserRole.User,
                UserRole.Guest,
                UserRole.External,
              ],
            },
          },
          {
            path: "subscription",
            name: "subscription",
            component: () =>
              import(
                /* webpackChunkName: "user" */ "../views/app/user/subscription"
              ),
            meta: {
              roles: [UserRole.User, UserRole.Guest, UserRole.External],
            },
          },
          {
            path: "invoices",
            name: "invoices",
            component: () =>
              import(
                /* webpackChunkName: "user" */ "../views/app/user/invoice"
              ),
            meta: {
              roles: [UserRole.User, UserRole.Guest, UserRole.External],
            },
          },
          {
            path: "tickets",
            name: "tickets",
            component: () =>
              import(
                /* webpackChunkName: "user" */ "../views/app/user/tickets"
              ),
            meta: {
              roles: [UserRole.User, UserRole.Guest, UserRole.External],
            },
          },
          {
            path: "faq",
            name: "faq",
            component: () =>
              import(/* webpackChunkName: "user" */ "../views/app/user/faq"),
            meta: {
              roles: [
                UserRole.SuperAdmin,
                UserRole.Admin,
                UserRole.Moderator,
                UserRole.User,
                UserRole.Guest,
                UserRole.External,
              ],
            },
          },
        ],
      },
    ],
  },

  /********************************
   *                               *
   *             User              *
   *                               *
   ********************************/
  {
    path: "/user",
    component: () => import(/* webpackChunkName: "user" */ "../views/user"),
    redirect: "/user/login",
    meta: {
      requiresAuth: false,
      scrollToTop: true,
    },
    children: [
      {
        path: "login",
        component: () =>
          import(/* webpackChunkName: "user" */ "../views/user/login"),
      },
      {
        path: "register",
        component: () =>
          import(/* webpackChunkName: "user" */ "../views/user/register"),
      },
      {
        path: "forgot-password",
        component: () =>
          import(
            /* webpackChunkName: "user" */ "../views/user/forgot-password"
          ),
      },
      {
        path: "reset-password",
        component: () =>
          import(/* webpackChunkName: "user" */ "../views/user/reset-password"),
      },
    ],
  },

  /********************************
   *                               *
   *          Error Pages          *
   *          Fallback 404         *
   *                               *
   ********************************/
  {
    path: "/unauthorized",
    component: () =>
      import(/* webpackChunkName: "error" */ "../views/unauthorized"),
    meta: {
      requiresAuth: false,
      scrollToTop: true,
    },
  },
  {
    path: "/error",
    component: () => import(/* webpackChunkName: "error" */ "../views/error"),
    meta: {
      requiresAuth: false,
      scrollToTop: true,
    },
  },
  {
    path: "*",
    component: () => import(/* webpackChunkName: "error" */ "../views/error"),
    meta: {
      requiresAuth: false,
      scrollToTop: true,
    },
  },
];
