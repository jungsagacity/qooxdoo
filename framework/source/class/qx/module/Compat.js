qx.Bootstrap.define("qx.module.Compat", {

  statics : {
    setPadding : function(paddingLeft, paddingTop)
    {
      this.__paddingLeft = paddingLeft;
      this.__paddingTop = paddingTop;

      if (qxWeb.getNodeName(this[0]) == "div") {
        this.setStyle("backgroundPosition", paddingLeft + "px " + paddingTop + "px");
      }
    },


    /**
     * @attach{qxWeb}
     */
    setScale : function(value) {
      if (value !== undefined && this.__source) {
        this.__scale = value;
        this.createImage();
      }
      return this;
    },

    /**
     * @attach{qxWeb}
     */
    getScale : function() {
      return this.__scale;
    },

    /**
     * @attach{qxWeb}
     */
    setSource : function(value) {
      if (value !== undefined && value != this.__source) {
        this.__source = value;
        this.createImage();
      }
      return this;
    },

    /**
     * @attach{qxWeb}
     */
    getSource : function() {
      return this.__source;
    },

    /**
     * Resets the current source to null which means that no image
     * is shown anymore.
     * @return {qxWeb} The current instance for chaining
     * @attach{qxWeb}
     */
    resetSource : function()
    {
      // webkit browser sdo not allow to remove the required "src" attribute.
      // If removing the attribute the old image is still visible.
      if ((qx.core.Environment.get("engine.name") == "webkit")) {
        this.setSource("qx/static/blank.gif");
      } else {
        //TODO: Verify this works (attrib vs prop)
        this.removeAttribute("source");
      }
      return this;
    },


    /**
     * @attach{qxWeb}
     */
    createImage : function(tagNameHint)
    {
      var scale = this.getScale();
      var repeat = scale ? "scale" : "no-repeat";

      var source = this.getSource();
      var tagName;

      if ((qx.core.Environment.get("engine.name") == "mshtml"))
      {
        if (tagNameHint) {
          tagName = tagNameHint;
        } else {
          tagName = qx.bom.element.Decoration.getTagName(repeat, source);
        }
      }
      else
      {
        tagName = qx.bom.element.Decoration.getTagName(repeat);
      }

      var styles = {
        //TODO: get all current styles
      };

      if (tagName == "div" && this.length > 0 && this.getStyle("backgroundImage"))
      {
        styles.backgroundRepeat = null;
      }

      if (!this[0]) {
        this.push(document.createElement(tagName));
      }

      qx.bom.element.Decoration.update(this[0], source, repeat, styles);

      return this;
    }
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
