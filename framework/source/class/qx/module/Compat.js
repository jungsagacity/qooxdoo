qx.Bootstrap.define("qx.module.Compat", {

  statics : {
        /*
    ---------------------------------------------------------------------------
      SCROLL SUPPORT
    ---------------------------------------------------------------------------
    */

    /**
     * Scrolls the given child element into view. Only scrolls children.
     * Do not influence elements on top of this element.
     *
     * If the element is currently invisible it gets scrolled automatically
     * at the next time it is visible again (queued).
     *
     * @param elem {qx.html.Element} The element to scroll into the viewport.
     * @param align {String?null} Alignment of the element. Allowed values:
     *   <code>left</code> or <code>right</code>. Could also be null.
     *   Without a given alignment the method tries to scroll the widget
     *   with the minimum effort needed.
     * @param direct {Boolean?true} Whether the execution should be made
     *   directly when possible
     */
    scrollChildIntoViewX : function(elem, align, direct)
    {
      var thisEl = this.eq(0);
      var childEl = elem.eq(0);

      if (direct !== false && thisEl && thisEl.offsetWidth && childEl && childEl.offsetWidth)
      {
        qx.bom.element.Scroll.intoViewX(childEl, thisEl, align);
      }
      else
      {
        this.__lazyScrollIntoViewX =
        {
          element : elem,
          align : align
        };

        qx.module.Compat._scroll[this.$$hash] = this;
        //qx.html.Element._scheduleFlush("element");
      }

      delete this.__lazyScrollX;
    },


    /**
     * Disables browser-native scrolling
     * @attach{qxWeb}
     */
    disableScrolling : function()
    {
      this.enableScrolling();
      this.setScrollLeft(0);
      this.setScrollTop(0);
      this.on("scroll", this.__onScroll, this);
    },


    /**
     * Re-enables browser-native scrolling
     * @attach{qxWeb}
     */
    enableScrolling : function() {
      this.off("scroll", this.__onScroll, this);
    },


    /**
     * Handler for the scroll-event
     * @attach{qxWeb}
     *
     * @param e {qx.event.type.Native} scroll-event
     */
    __onScroll : function(e)
    {
      if (!this.__inScroll)
      {
        this.__inScroll = true;
        this.setScrollTop(0);
        this.setScrollLeft(0);
        delete this.__inScroll;
      }
    },


    /**
     * Whether the element is natively focusable (or will be when created)
     *
     * This ignores the configured tabIndex.
     * @attach{qxWeb}
     *
     * @return {Boolean} <code>true</code> when the element is focusable.
     */
    isNativelyFocusable : function() {
      if (this[0]) {
        var nodeName = qxWeb.getNodeName(this[0]);
        return !!qx.event.handler.Focus.FOCUSABLE_ELEMENTS[nodeName];
      }
      return false;
    },


    /**
     * Set whether the first element is selectable. It uses the qooxdoo attribute
     * qxSelectable with the values 'on' or 'off'.
     * In webkit, a special css property will be used (-webkit-user-select).
     * @attach{qxWeb}
     *
     * @param value {Boolean} True, if the element should be selectable.
     */
    setSelectable : function(value) {
      if (!this[0]) {
        return;
      }
      var contentElement = this.eq(0);
      contentElement.setAttribute("qxSelectable", value ? "on" : "off");
      var userSelect = qx.core.Environment.get("css.userselect");
      if (userSelect) {
        contentElement.setStyle(userSelect, value ? "text" :
          qx.core.Environment.get("css.userselect.none"));
      }
    }
  },

  defer : function(statics) {
    qxWeb.$attach({
      "addListener" : qx.module.Event.on,
      "removeListener" : qx.module.Event.off,
      "disableScrolling" : statics.disableScrolling,
      "enableScrolling" : statics.enableScrolling,
      "__onScroll" : statics.__onScroll,
      "isNativelyFocusable" : statics.isNativelyFocusable,
      "setSelectable" : statics.setSelectable
    });
  }
});
