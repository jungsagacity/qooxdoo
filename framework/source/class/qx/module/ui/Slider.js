/**
 * @require(qx.module.event.Mouse)
 */
qx.Bootstrap.define("qx.module.ui.Slider",
{
  extend : qx.module.ui.Widget,


  construct : function(selector, context) {
    this.base(arguments, selector, context)

    if (qxWeb.env.get("event.mspointer")) {
      knobElement.style["-ms-touch-action"] = "pan-x";
    }

    var trs = qxWeb.env.get("css.transform");
    this.__canTransform = (trs !== null && typeof trs === "object");
    this.__canTransform3d = this.__canTransform ? trs["3d"] : false;

    this.currentIndex = null;
  },


  events :
  {
    /** Fired at each value change */
    "changeValue" : "qx.event.Emitter",

    /** Fired with each mouse move event */
   "changePosition" : "qx.event.Emitter"
  },



  members :
  {
    __documentElement : null,
    __sliderWidth : null,
    __dragMin : null,
    __knobElement : null,
    __halfKnobWidth : null,
    __dragMode : null,
    __dragMax : null,
    __offset : null,
    __body : null,
    __nextStepInPixel : null,
    __steps : null,
    __increment : null,
    __pixel : null,
    __sliderPositionLeft : null,
    __leftOffset : 0,
    __canTransform3d : false,
    __canTransform : false,

    /*
    ---------------------------------------------------------------------------
      PUBLIC API
    ---------------------------------------------------------------------------
    */

    /**
     * The current slider value.
     */
    __value : null,

    /**
     * Returns the current value of the slider
     *
     * @return {Integer} slider value
     */
    getValue : function() {
      return this.__value;
    },

    /**
     * Sets the current value of the slider.
     *
     * @param value {Integer} new value of the slider
     */
    setValue : function(value)
    {
      if (qxWeb.type.get(value) != "Number") {
        throw Error("Please provide a Number value for 'value'!");
      }

      this.__value = value;

      if (this.__steps.indexOf(value) != -1) {
        this.__valueToPosition(value);
        this.emit("changeValue", value);
      }
    },


    /**
     * Returns the current position of the slider. This method returns the same
     * value as the {@link #changePosition} event.
     *
     * @return {Integer} position of the slider
     */
    getPosition : function()
    {
      if(this.__canTransform3d || this.__canTransform)
      {
        this.__knobElement.getStyle("transform").match(/matrix(3d)?\((.*?)\)/);
        var transform = RegExp.$2.split(',');
        transform = transform[12] || transform[4];
        return parseInt(Number(transform), 10);
      } else {
        return parseInt(this.__knobElement.getStyle("left"), 10);
      }
    },


    /*
    ---------------------------------------------------------------------------
      INITIALIZATION
    ---------------------------------------------------------------------------
    */

    _setOffset : function(offset) {
      if (offset) {
        this.__offset = parseInt(offset, 10);
      } else {
        this.__offset = 0;
      }
    },


    _setupElements : function(sliderElement, knobElement) {
      this.__knobElement = knobElement;

      this.__documentElement = this.__knobElement.getAncestors().find("html");

      this.__leftOffset = parseInt(this.__knobElement.getStyle("left")) || 0;

      this.__setupSlider();
    },



    /**
     * Retrieves basic infos like width of slider and knob element.
     *
     * * Sets both elements to "unselectable" to prevent native dragging.
     * * Gets the left and right position of the slider element for later computation.
     * * Sets a backgroumdImage to be able to dragging the knob element.
     * * Setup the event listeners.
     */
    __setupSlider : function()
    {
      var cancel = "event.stopPropagation ? event.stopPropagation() : event.cancelBubble = true;" +
        "event.preventDefault ? event.preventDefault() : event.returnValue = false;";

      this.__initCacheValues();

      this.__knobElement.setAttribute("draggable", "false");
      this.__knobElement.setAttribute("ondragstart", cancel);
      this.__knobElement.setAttribute("unselectable", "true");

      this.setAttribute("draggable", "false");
      this.setAttribute("ondragstart", cancel);
      this.setAttribute("unselectable", "true");

      this.__addListeners();
    },


    /**
     * Initializes caching values which are used to do a fast lookup whenever
     * the slider knob get dragged.
     */
    __initCacheValues : function()
    {
      this.__sliderWidth = this.getWidth();
      this.__sliderPositionLeft = this.getOffset().left;

      var knobWidth = this.__knobElement.getWidth();
      this.__halfKnobWidth = parseInt(knobWidth / 2, 10);

      this.__dragMin = this.__sliderPositionLeft + this.__offset;
      this.__dragMax = this.__sliderPositionLeft + this.__sliderWidth - this.__offset;
    },


    /**
     * Creates a lookup table to get the pixel values for each slider step.
     * And computes the "breakpoint" between two steps in pixel.
     *
     * @param steps {Array} Configured steps of the slider
     */
    __initSteps : function(steps)
    {
      this.__steps = steps;
      this.__pixel = [];

      // First pixel value is fixed
      this.__pixel.push(this.__dragMin);

      var lastIndex = steps.length-1;

      //The width realy used by the slider (drag area)
      var usedWidth = this.__sliderWidth - (this.__offset * 2);

      //The width of a single slider step
      var stepWidth = usedWidth/(steps[lastIndex]-steps[0]);

      var stepCount = 0;

      for(var i=1, j=steps.length-1; i<j; i++){
        stepCount = steps[i] - steps[0];
        this.__pixel.push(Math.round(stepCount*stepWidth) + this.__dragMin);
      }

      // Last pixel value is fixed
      this.__pixel.push(this.__dragMax);

    },


    /**
     * Event listener for slider, knob and body element to enable the drag and
     * click events for the slider.
     */
    __addListeners : function()
    {
      this.on("click", this._onClick, this);


      // TODO create a device-independent event processing
      // this.__knobElement.on(q.DeviceInfo.EVENT.start, this._onMouseDown, this);
      // this.__documentElement.on(q.DeviceInfo.EVENT.end, this._onMouseUp, this);

      this.__knobElement.on("mousedown", this._onMouseDown, this);
      this.__documentElement.on("mouseup", this._onMouseUp, this);

      qxWeb(window).on("resize", this._onWindowResize, this);
    },

    /**
    * Returns the nearest existing slider value according to he position of the knob element.
    * @param position {Integer} The current knob position in pixels
    * @return {Integer} The next position to snap to
    */
    __getCurrentValue : function(position){
      var currentIndex = 0,before = 0,after = 0;
      for (var i=0, j=this.__pixel.length; i<j; i++)
      {
        if (position >= this.__pixel[i]) {
          currentIndex = i;
          before = this.__pixel[i];
          after = this.__pixel[i+1] || before;
        } else {
          break;
        }
      }

      currentIndex = Math.abs(position - before) <=  Math.abs(position - after) ? currentIndex : currentIndex + 1;

      this.currentIndex = currentIndex;

      return this.__steps[currentIndex];
    },


    /*
    ---------------------------------------------------------------------------
      EVENT HANDLER
    ---------------------------------------------------------------------------
    */

    /**
     * Takes the click position and sets slider value to the nearest step.
     *
     * @param e {qx.event.Emitter} Incoming event object
     */
    _onClick : function(e)
    {

      var clickPosition =  e.getDocumentLeft ? e.getDocumentLeft() : e.changedTouches[0].pageX;
      this.setValue(this.__getCurrentValue(clickPosition));
    },


    /**
     * Listener of mousedown event. Initializes drag or tracking mode.
     *
     * @param e {qx.event.Emitter} Incoming event object
     */
    _onMouseDown : function(e)
    {
      // this can happen if the user releases the button while dragging outside
      // of the browser viewport
      if (this.__dragMode) {
        return;
      }

      this.__dragMode = true;

      // TODO create a device-independent event processing
      // this.__documentElement.on(q.DeviceInfo.EVENT.move, this._onMouseMove, this);

      this.__documentElement.on("mousemove", this._onMouseMove, this);

      this.__documentElement.setStyle("cursor", "pointer");

      e.stopPropagation();
    },


    /**
     * Listener of mouseup event. Used for cleanup of previously
     * initialized modes.
     *
     * @param e {qx.event.Emitter} Incoming event object
     */
    _onMouseUp : function(e)
    {
      // TODO create a device-independent event processing
      // if (e.type === q.DeviceInfo.EVENT.end)

      if (e.type === "mouseup")
      {
        if (this.__dragMode === true)
        {
          // Cleanup status flags
          delete this.__dragMode;

          this.__valueToPosition(this.getValue());

          // TODO create a device-independent event processing
          // this.__documentElement.off(q.DeviceInfo.EVENT.move, this._onMouseMove, this);

          this.__documentElement.off("mousemove", this._onMouseMove, this);
          this.__documentElement.setStyle("cursor", null);
        }

        e.stopPropagation();
      }
    },


    /**
     * Listener of mousemove event for the knob. Only used in drag mode.
     *
     * @param e {qx.event.Emitter} Incoming event object
     */
    _onMouseMove : function(e)
    {
      e.preventDefault();

      if (this.__dragMode)
      {
        if(!e.touches){
          e.touches = [e];
        }
        var dragPosition = e.getDocumentLeft ? e.getDocumentLeft() : e.touches[0].pageX;

        if (dragPosition >= this.__dragMin && dragPosition <= this.__dragMax)
        {
          this.setValue(this.__getCurrentValue(dragPosition));
          var positionKnob = dragPosition - this.getOffset().left - this.__halfKnobWidth;
          if (positionKnob > 0)
          {
            var trs = this.__getTransfrom(positionKnob);
            this.__knobElement.setStyle(trs.left,trs.value);
            this.emit("changePosition", positionKnob);
          }
        }
      }
      // Stop event
      e.stopPropagation();
    },

    /**
    * Determines the best possibility for an horizontal translation
    * @param x {Integer} the position to move to
    * @return {Map} A map containing the appropriate style property(transform/teft) and it's value
    */
    __getTransfrom : function(x){
      if(this.__canTransform3d){
        x -= this.__leftOffset;
        return {left:"transform",value : "translate3d("+x+"px,0px,0px)"};
      }else if(this.__canTransform){
        x -= this.__leftOffset;
        return {left:"transform",value : "translate("+x+"px,0px)"};
      }else{
        return {left:"left",value : x+"px"};
      }
    },


    /**
     * Listener for window resize events. This listener method resets the
     * calculated values which are used to position the slider knob.
     */
    _onWindowResize : function()
    {
      this.__initCacheValues();
      this.__initSteps(this.__steps);

      // Update the position of the slider knob
      if(this.currentIndex){
        var positionKnob = this.__pixel[this.currentIndex] - this.getOffset().left - this.__halfKnobWidth;
        var trs = this.__getTransfrom(positionKnob);
        this.__knobElement.setStyle(trs.left,trs.value);
        //this.__knobElement.setStyle("left", positionKnob+"px");
      }
    },


    /*
    ---------------------------------------------------------------------------
      VALUE HANDLING
    ---------------------------------------------------------------------------
    */

    /**
     * Positions the slider knob to the given value and fires the "changePosition"
     * event with the current position as integer.
     *
     * @param value {Integer} slider step value
     */
    __valueToPosition : function(value)
    {
      // Get the pixel value of the current step value

      var valueToPixel = this.__pixel[this.__steps.indexOf(value)];

      // relative position is necessary here
      var position = valueToPixel - this.__sliderPositionLeft - this.__halfKnobWidth;

      var trs = this.__getTransfrom(position);
      this.__knobElement.setStyle(trs.left,trs.value);

      this.emit("changePosition", position);
    }
  },


  // Make the slider widget as qxWeb module available
  defer : function(statics) {
    qxWeb.$attach({
      slider : function(knobElement, steps, offset) {
        var slider = new qx.module.ui.Slider(this);

        slider._setOffset(offset);
        slider._setupElements(this, knobElement);
        slider.__initSteps(steps);
        slider.setValue(steps[0]);

        return slider;
      }
    });
  },


  destruct : function()
  {
    this.off("click", this._onClick, this);

    // TODO create a device-independent event processing
    // this.__knobElement.off(q.DeviceInfo.EVENT.start, this._onMouseDown, this);
    // this.__documentElement.off(q.DeviceInfo.EVENT.end, this._onMouseUp, this);

    this.__knobElement.off("mousedown", this._onMouseDown, this);
    this.__documentElement.off("mouseup", this._onMouseUp, this);

    qxWeb(window).off("resize", this._onWindowResize, this);

    this.__knobElement = null;
    this.__documentElement = null;
  }
});
