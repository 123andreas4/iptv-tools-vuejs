import { AppRoot, UserRole, PlaylistType, SubscriptionType } from "./config";

const data = [
  /********************************
   *                               *
   *          ADMIN AREA           *
   *                               *
   ********************************/
  {
    id: "dashboard",
    icon: "las la-home",
    label: "menu.dashboard",
    to: `${AppRoot}/dashboard`,
    roles: [UserRole.SuperAdmin, UserRole.Admin],
    subs: [
      {
        icon: "las la-home",
        label: "menu.start",
        to: `${AppRoot}/dashboard/start`,
      },
    ],
  },
  {
    id: "administration",
    icon: "las la-user-shield",
    label: "menu.administration",
    to: `${AppRoot}/administration`,
    roles: [UserRole.SuperAdmin, UserRole.Admin, UserRole.Moderator],
    subs: [
      {
        icon: "las la-users",
        label: "menu.users",
        to: `${AppRoot}/administration/users`,
        roles: [UserRole.SuperAdmin, UserRole.Admin, UserRole.Moderator],
      },
      {
        icon: "las la-users-cog",
        label: "menu.profiles",
        to: `${AppRoot}/administration/profiles`,
        roles: [UserRole.SuperAdmin, UserRole.Admin, UserRole.Moderator],
      },
      {
        icon: "las la-user-tag",
        label: "menu.subscriptions",
        to: `${AppRoot}/administration/subscriptions`,
        roles: [UserRole.SuperAdmin, UserRole.Admin],
      },
      {
        icon: "las la-sign-in-alt",
        label: "menu.logins",
        to: `${AppRoot}/administration/logins`,
        roles: [UserRole.SuperAdmin, UserRole.Admin, UserRole.Moderator],
      },
      {
        icon: "las la-user-check",
        label: "menu.confirm",
        to: `${AppRoot}/administration/confirm`,
        roles: [UserRole.SuperAdmin, UserRole.Admin, UserRole.Moderator],
      },
      {
        icon: "las la-user-nurse",
        label: "menu.forgot",
        to: `${AppRoot}/administration/forgot`,
        roles: [UserRole.SuperAdmin, UserRole.Admin, UserRole.Moderator],
      },
    ],
  },
  {
    id: "tickets",
    icon: "las la-headset",
    label: "menu.tickets",
    to: `${AppRoot}/tickets`,
    roles: [UserRole.SuperAdmin, UserRole.Admin, UserRole.Moderator],
    subs: [
      {
        icon: "las la-user",
        label: "menu.open",
        to: `${AppRoot}/tickets/open`,
      },
      {
        icon: "las la-user-check",
        label: "menu.answered",
        to: `${AppRoot}/tickets/answered`,
      },
      {
        icon: "las la-user-shield",
        label: "menu.closed",
        to: `${AppRoot}/tickets/closed`,
      },
      {
        icon: "las la-user-lock",
        label: "menu.archived",
        to: `${AppRoot}/tickets/archived`,
      },
    ],
  },
  {
    id: "financial",
    icon: "las la-euro-sign",
    label: "menu.financial",
    to: `${AppRoot}/financial`,
    roles: [UserRole.SuperAdmin, UserRole.Admin],
    subs: [
      {
        icon: "las la-euro-sign",
        label: "menu.payments",
        to: `${AppRoot}/financial/payments`,
      },
      {
        icon: "las la-receipt",
        label: "menu.invoices",
        to: `${AppRoot}/financial/invoices`,
      },
      {
        icon: "las la-chart-bar",
        label: "menu.statistics",
        to: `${AppRoot}/financial/statistics`,
      },
    ],
  },
  {
    id: "tools",
    icon: "las la-toolbox",
    label: "menu.tools",
    to: `${AppRoot}/tools`,
    roles: [UserRole.SuperAdmin, UserRole.Admin],
    subs: [
      {
        icon: "las la-tv",
        label: "menu.xmltv",
        to: `${AppRoot}/tools/xmltv`,
      },
      {
        icon: "las la-calendar-day",
        label: "menu.scheduler",
        to: `${AppRoot}/tools/scheduler`,
      },
      {
        icon: "las la-terminal",
        label: "menu.terminal",
        to: `${AppRoot}/tools/terminal`,
      },
    ],
  },
  /********************************
   *                               *
   *           USER AREA           *
   *                               *
   ********************************/
  {
    id: "start",
    icon: "las la-home",
    label: "menu.start",
    to: `${AppRoot}/start/dashboard`,
    roles: [UserRole.User, UserRole.Guest, UserRole.External],
    playlist: [
      PlaylistType.All,
      PlaylistType.Xtream,
      PlaylistType.M3U,
      PlaylistType.Portal,
    ],
    subs: [
      {
        icon: "las la-home",
        label: "menu.dashboard",
        to: `${AppRoot}/start/dashboard`,
      },
    ],
  },
  {
    id: "xtream",
    icon: "lab la-xing",
    label: "menu.xtream",
    to: `${AppRoot}/xtream/playlists`,
    roles: [UserRole.User, UserRole.Guest, UserRole.External],
    playlist: [PlaylistType.All, PlaylistType.Xtream],
    subs: [
      {
        icon: "las la-file-video",
        label: "menu.playlists",
        to: `${AppRoot}/xtream/playlists`,
      },
      {
        icon: "las la-folder-open",
        label: "menu.groups",
        to: `${AppRoot}/xtream/groups`,
      },
      {
        icon: "las la-tv",
        label: "menu.live",
        to: `${AppRoot}/xtream/live`,
      },
      {
        icon: "las la-film",
        label: "menu.movies",
        subscriptions: [
          SubscriptionType.Professional,
          SubscriptionType.Family,
          SubscriptionType.BusinessSmall,
          SubscriptionType.BusinessProfessional,
          SubscriptionType.BusinessEnterprise,
          SubscriptionType.Manager,
        ],
        to: `${AppRoot}/xtream/movies`,
      },
      {
        icon: "las la-video",
        label: "menu.series",
        subscriptions: [
          SubscriptionType.Professional,
          SubscriptionType.Family,
          SubscriptionType.BusinessSmall,
          SubscriptionType.BusinessProfessional,
          SubscriptionType.BusinessEnterprise,
          SubscriptionType.Manager,
        ],
        to: `${AppRoot}/xtream/series`,
      },
      {
        icon: "las la-pen",
        label: "menu.editor",
        to: `${AppRoot}/xtream/editor`,
      },
    ],
  },
  {
    id: "movies",
    icon: "las la-film",
    label: "menu.movies",
    to: `${AppRoot}/movies/now-playing`,
    roles: [UserRole.User, UserRole.Guest, UserRole.External],
    playlist: [
      PlaylistType.All,
      PlaylistType.Xtream,
      PlaylistType.M3U,
      PlaylistType.Portal,
    ],
    subscriptions: [
      SubscriptionType.Professional,
      SubscriptionType.Family,
      SubscriptionType.BusinessSmall,
      SubscriptionType.BusinessProfessional,
      SubscriptionType.BusinessEnterprise,
      SubscriptionType.Manager,
    ],
    subs: [
      {
        icon: "las la-theater-masks",
        label: "menu.now-playing",
        to: `${AppRoot}/movies/now-playing`,
      },
      {
        icon: "las la-star",
        label: "menu.top-rated",
        to: `${AppRoot}/movies/top-rated`,
      },
      {
        icon: "las la-fire",
        label: "menu.popular",
        to: `${AppRoot}/movies/popular`,
      },
      {
        icon: "las la-folder-open",
        label: "menu.browse",
        to: `${AppRoot}/movies/browse`,
      },
      {
        icon: "las la-search",
        label: "menu.search",
        to: `${AppRoot}/movies/search`,
      },
    ],
  },
  {
    id: "series",
    icon: "las la-video",
    label: "menu.series",
    to: `${AppRoot}/series/on-the-air`,
    roles: [UserRole.User, UserRole.Guest, UserRole.External],
    playlist: [
      PlaylistType.All,
      PlaylistType.Xtream,
      PlaylistType.M3U,
      PlaylistType.Portal,
    ],
    subscriptions: [
      SubscriptionType.Professional,
      SubscriptionType.Family,
      SubscriptionType.BusinessSmall,
      SubscriptionType.BusinessProfessional,
      SubscriptionType.BusinessEnterprise,
      SubscriptionType.Manager,
    ],
    subs: [
      {
        icon: "las la-tv",
        label: "menu.on-the-air",
        to: `${AppRoot}/series/on-the-air`,
      },
      {
        icon: "las la-star",
        label: "menu.top-rated",
        to: `${AppRoot}/series/top-rated`,
      },
      {
        icon: "las la-fire",
        label: "menu.popular",
        to: `${AppRoot}/series/popular`,
      },
      {
        icon: "las la-folder-open",
        label: "menu.browse",
        to: `${AppRoot}/series/browse`,
      },
      {
        icon: "las la-search",
        label: "menu.search",
        to: `${AppRoot}/series/search`,
      },
    ],
  },
  {
    id: "applications",
    icon: "las la-tools",
    label: "menu.applications",
    to: `${AppRoot}/applications/xdpro`,
    roles: [UserRole.User, UserRole.Guest, UserRole.External],
    playlist: [
      PlaylistType.All,
      PlaylistType.Xtream,
      PlaylistType.M3U,
      PlaylistType.Portal,
    ],
    subscriptions: [
      SubscriptionType.Professional,
      SubscriptionType.Family,
      SubscriptionType.BusinessSmall,
      SubscriptionType.BusinessProfessional,
      SubscriptionType.BusinessEnterprise,
      SubscriptionType.Manager,
    ],
    subs: [
      {
        icon: "las la-cloud-download-alt",
        label: "menu.xd-pro",
        to: `${AppRoot}/applications/xd-pro`,
      },
      /*{
        icon: "las la-photo-video",
        label: "menu.m3u-2-strm",
        to: `${AppRoot}/applications/m3u-2-strm`,
      },
      {
        icon: "las la-tv",
        label: "menu.kodi",
        to: `${AppRoot}/applications/kodi`,
      },*/
    ],
  },
];
export default data;
