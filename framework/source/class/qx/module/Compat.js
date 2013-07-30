qx.Bootstrap.define("qx.module.Compat", {

  statics : {
    /*
    ---------------------------------------------------------------------------
      EVENT SUPPORT
    ---------------------------------------------------------------------------
    */

    /**
     * Adds an event listener to the element.
     *
     * @param type {String} Name of the event
     * @param listener {Function} Function to execute on event
     * @param self {Object ? null} Reference to the 'this' variable inside
     *         the event listener. When not given, the corresponding dispatcher
     *         usually falls back to a default, which is the target
     *         by convention. Note this is not a strict requirement, i.e.
     *         custom dispatchers can follow a different strategy.
     * @param capture {Boolean ? false} Whether capturing should be enabled
     * @return {var} An opaque id, which can be used to remove the event listener
     *         using the {@link #removeListenerById} method.
     * @attach{qxWeb}
     */
    addListener : function(type, listener, self, capture)
    {
      //TODO: assertions
      if (false && qx.core.Environment.get("qx.debug"))
      {
        var msg = "Failed to add event listener for type '" + type + "'" +
          " to the target '" + this + "': ";

        this.assertString(type, msg + "Invalid event type.");
        this.assertFunction(listener, msg + "Invalid callback function");

        if (self !== undefined) {
          this.assertObject(self, "Invalid context for callback.")
        }

        if (capture !== undefined) {
          this.assertBoolean(capture, "Invalid capture flag.");
        }
      }

      if (this[0]) {
        return qx.event.Registration.addListener(this[0], type, listener, self, capture);
      }

      if (!this.__eventValues) {
        this.__eventValues = {};
      }

      if (capture == null) {
        capture = false;
      }

      var unique = qx.event.Manager.getNextUniqueId();
      var id = type + (capture ? "|capture|" : "|bubble|") + unique;

      this.__eventValues[id] =
      {
        type : type,
        listener : listener,
        self : self,
        capture : capture,
        unique : unique
      };

      return id;
    },


    /**
     * Removes an event listener from the element.
     *
     * @param type {String} Name of the event
     * @param listener {Function} Function to execute on event
     * @param self {Object} Execution context of given function
     * @param capture {Boolean ? false} Whether capturing should be enabled
     * @return {qx.html.Element} this object (for chaining support)
     */
    removeListener : function(type, listener, self, capture)
    {
      //TODO: assertions
      if (false && qx.core.Environment.get("qx.debug"))
      {
        var msg = "Failed to remove event listener for type '" + type + "'" +
          " from the target '" + this + "': ";

        this.assertString(type, msg + "Invalid event type.");
        this.assertFunction(listener, msg + "Invalid callback function");

        if (self !== undefined) {
          this.assertObject(self, "Invalid context for callback.")
        }

        if (capture !== undefined) {
          this.assertBoolean(capture, "Invalid capture flag.");
        }
      }

      if (this[0])
      {
        qx.event.Registration.removeListener(this[0], type, listener, self, capture);
      }
      else
      {
        var values = this.__eventValues;
        var entry;

        if (capture == null) {
          capture = false;
        }

        for (var key in values)
        {
          entry = values[key];

          // Optimized for performance: Testing references first
          if (entry.listener === listener && entry.self === self && entry.capture === capture && entry.type === type)
          {
            delete values[key];
            break;
          }
        }
      }

      return this;
    },



    /*
    ---------------------------------------------------------------------------
      SCROLL SUPPORT
    ---------------------------------------------------------------------------
    */

    _scroll : {},

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
     *
     * @attach{qxWeb}
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
      return this;
    },

    /**
     * Scrolls the given child element into view. Only scrolls children.
     * Do not influence elements on top of this element.
     *
     * If the element is currently invisible it gets scrolled automatically
     * at the next time it is visible again (queued).
     *
     * @param elem {qx.html.Element} The element to scroll into the viewport.
     * @param align {String?null} Alignment of the element. Allowed values:
     *   <code>top</code> or <code>bottom</code>. Could also be null.
     *   Without a given alignment the method tries to scroll the widget
     *   with the minimum effort needed.
     * @param direct {Boolean?true} Whether the execution should be made
     *   directly when possible
     *
     * @attach{qxWeb}
     */
    scrollChildIntoViewY : function(elem, align, direct)
    {
      var thisEl = this.eq(0);
      var childEl = elem.eq(0);

      if (direct !== false && thisEl && thisEl.offsetWidth && childEl && childEl.offsetWidth)
      {
        qx.bom.element.Scroll.intoViewY(childEl, thisEl, align);
      }
      else
      {
        this.__lazyScrollIntoViewY =
        {
          element : elem,
          align : align
        };

        qx.module.Compat._scroll[this.$$hash] = this;
        //qx.html.Element._scheduleFlush("element");
      }

      delete this.__lazyScrollY;
      return this;
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
      return this;
    },


    /**
     * Re-enables browser-native scrolling
     * @attach{qxWeb}
     */
    enableScrolling : function() {
      this.off("scroll", this.__onScroll, this);
      return this;
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
      return this;
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
     * Maps padding to background-position if the widget is rendered as a
     * background image
     * @param paddingLeft {Integer} left padding value
     * @param paddingTop {Integer} top padding value
     *
     * @attach{qxWeb}
     */
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
      "addListener" : statics.addListener,
      "removeListener" : statics.removeListener,

      "capture" : function() {},
      "releaseCapture" : function() {},
      "activate" : function() {},

      "scrollChildIntoViewX": statics.scrollChildIntoViewX,
      "scrollChildIntoViewY": statics.scrollChildIntoViewY,
      "scrollToX" : qx.module.Manipulating.setScrollLeft,
      "scrollToY" : qx.module.Manipulating.setScrollTop,
      "disableScrolling" : statics.disableScrolling,
      "enableScrolling" : statics.enableScrolling,
      "__onScroll" : statics.__onScroll,

      "isNativelyFocusable" : statics.isNativelyFocusable,
      "setSelectable" : statics.setSelectable,

      "setScale" : statics.setScale,
      "getScale" : statics.getScale,
      "setSource" : statics.setSource,
      "getSource" : statics.getSource,
      "resetSource" : statics.resetSource,
      "setPadding" : statics.setPadding,
      "createImage" : statics.createImage
    });
  }
});
