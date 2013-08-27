qx.Bootstrap.define("qx.module.ui.Label", {
  extend : qx.module.ui.Widget,

  construct : function(selector, context) {
    if (!selector && this instanceof qx.module.ui.Label) {
      return this;
    }

    return qx.lang.Array.cast(qxWeb(selector, context), qx.module.ui.Label);
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
        this.setAttribute("qx-class", this.classname);
        return qx.lang.Array.cast(this, qx.module.ui.Label);
      }
    });
  }
});
