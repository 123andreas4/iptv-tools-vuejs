/*

	Vue Router scroll behavior

*/

export default (to, from, savedPosition) => {
  if (savedPosition) {
    return savedPosition;
  } else {
    const position = {};

    // scroll to anchor by returning the selector
    if (to.hash) {
      position.selector = to.hash;

      // ************* Add anchors here *************
      switch (to.hash) {
        // #test
        case "test":
          position.offset = { y: 100 };
          break;

        default:
          position.offset = { x: 0, y: 0 };
          break;
      }
      // ************* Add anchors here *************

      // If element exists on the page return the position
      if (document.querySelector(to.hash)) {
        return position;
      }

      // If the returned position is falsy or an empty object,
      // will retain current scroll position.
      return false;
    }

    // If there is no selector - check for meta scrolToTop
    return new Promise((resolve) => {
      if (to.matched.some((m) => m.meta.scrollToTop)) {
        position.x = 0;
        position.y = 0;
      }

      // wait for the out transition to complete (if necessary)
      this.app.$root.$once("triggerScroll", () => {
        resolve(position);
      });
    });
  }
};
