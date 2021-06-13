/*

  Root path to the APP

*/
export const AppRoot = "/app";

/*

  Payment website

*/
export const PaymentWebsite = "IPTV-Tools";

/*

  Auth Guard

  ** If set to false, the router will not authenticate
     and execute next() for every route **

*/
export const AuthGuardActive = true;

/*

  User Roles; Like admin, moderator, guest, user.

*/
export const UserRole = {
  SuperAdmin: 1985,
  Admin: 1,
  Moderator: 2,
  User: 3,
  Guest: 4,
  External: 5,
};

/* 

Playlist Types

*/
export const PlaylistType = {
  All: 0,
  Xtream: 1,
  M3U: 2,
  Portal: 3,
};

/* 

Subscription Types (title only)

*/
export const SubscriptionType = {
  Enthusiast: 0,
  Professional: 1,
  Family: 2,
  BusinessSmall: 3,
  BusinessProfessional: 4,
  BusinessEnterprise: 5,
  Manager: 1985,
};

/*

  API Status indicators

*/
export const ApiStatus = {
  enabled: 1,
  disabled: 0,
  error: 2,
};

/*

  API Endpoint URL's

*/
export const ApiURL = [
  /* Base API URL */
  {
    url: "https://salt.iptv-tools.com",
    status: ApiStatus.disabled,
    priority: 1,
  },

  /* Fallback API URL */
  {
    url: "https://pepper.iptv-tools.com",
    status: ApiStatus.disabled,
    priority: 2,
  },

  /* Test Environment API URL */
  {
    url: "https://api.iptv-tools.com",
    status: ApiStatus.enabled,
    priority: 9,
  },
];

/*

  Fallback API URL

*/
export const FallbackAPIURL = "http://localhost/test-api";

/* 

  Locale options 
  
*/
export const defaultLocale = "en";
export const localeOptions = [
  { id: "en", name: "English" },
  { id: "nl", name: "Nederlands" },
];

/* 

Locale date options 

*/
export const localeDateTimeFormats = {
  "en-US": {
    short: {
      year: "numeric",
      month: "short",
      day: "numeric",
    },
  },
};

/* 

  Menu Breakpoints 
  
*/
export const subHiddenBreakpoint = 1440;
export const menuHiddenBreakpoint = 768;

/* 

IPGEO API Key 

*/
export const ipGeoAPIKey = "fbdb45a1f8ba4d85a81eda6b31cf24f8";
