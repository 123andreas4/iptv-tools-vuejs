import { setCurrentUser, getCurrentUser } from "../helpers";
import { AuthGuardActive } from "../constants/config";

/*

  Router authenticator - used on non public routes

*/
export default (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth === true)) {
    if (AuthGuardActive) {
      const user = getCurrentUser();
      if (user) {
        const requiredRoles = to.matched
          .filter((x) => x.meta.roles)
          .map((x) => x.meta.roles);
        const requiredSubscriptions = to.matched
          .filter((x) => x.meta.subscriptions)
          .map((x) => x.meta.subscriptions);
        const playlistTypes = to.matched
          .filter((x) => x.meta.playlistType)
          .map((x) => x.meta.playlistType);
        if (
          requiredRoles.every((x) => x.includes(user.user.role)) &&
          requiredSubscriptions.length &&
          user.subscription
            ? requiredSubscriptions.every((x) =>
                x.includes(user.subscription.subscription_type)
              )
            : true && playlistTypes.length && user.subscription
            ? playlistTypes.every((x) =>
                x.includes(user.subscription.playlist_type)
              )
            : true
        ) {
          next();
        } else {
          next("/unauthorized");
        }
      } else {
        setCurrentUser(null);
        next("/user/login");
      }
    } else {
      next();
    }
  } else {
    next();
  }
};
