qx.Bootstrap.define("qx.module.Compat", {

  statics : {

  },

  defer : function(statics) {
    qxWeb.$attach({
      // "addListener" : statics.addListener,
      // "removeListener" : statics.removeListener,

      // "capture" : function() {},
      // "releaseCapture" : function() {},
      // "activate" : function() {},

      // "scrollChildIntoViewX": statics.scrollChildIntoViewX,
      // "scrollChildIntoViewY": statics.scrollChildIntoViewY,
      // "scrollToX" : qx.module.Manipulating.setScrollLeft,
      // "scrollToY" : qx.module.Manipulating.setScrollTop,
      // "disableScrolling" : statics.disableScrolling,
      // "enableScrolling" : statics.enableScrolling,
      // "__onScroll" : statics.__onScroll,

      // "isNativelyFocusable" : statics.isNativelyFocusable,
      // "setSelectable" : statics.setSelectable,

      // "setScale" : statics.setScale,
      // "getScale" : statics.getScale,
      // "setSource" : statics.setSource,
      // "getSource" : statics.getSource,
      // "resetSource" : statics.resetSource,
      // // "setPadding" : statics.setPadding,
      // "createImage" : statics.createImage
    });
  }
});
