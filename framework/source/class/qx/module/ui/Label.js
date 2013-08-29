qx.Bootstrap.define("qx.module.ui.Label", {
  extend : qx.module.ui.Widget,


  construct : function(selector, context) {
     this.base(arguments, selector, context);
  },


  members : {
    setWrap : function(value) {
      // apply the white space style to the label to force it not
      // to wrap if wrap is set to false [BUG #3732]
      var whiteSpace = value ? "normal" : "nowrap";
      this.setStyle("whiteSpace", whiteSpace);
    },

    getWrap : function() {
      var whiteSpace = this.getStyle("whiteSpace");
      return whiteSpace == "normal";
    },

    setValue : function(value) {
      if (value === null) {
        value = "";
      }

      this.setHtml(value);
    },


    getValue : function() {
      return this.getHtml();
    }
  },


  defer : function() {
    qxWeb.$attach({
      label : function() {
        return new qx.module.ui.Label(this);
      }
    });
  }
});
