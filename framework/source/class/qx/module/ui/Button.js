qx.Bootstrap.define("qx.module.ui.Button", {
  extend : qx.module.ui.Widget,

  construct : function(selector, context) {
    if (!selector && this instanceof qx.module.ui.Button) {
      return this;
    }

    var col = qx.lang.Array.cast(qxWeb(selector, context), qx.module.ui.Button);
    col.setAttribute("qx-class", this.classname);
    return col;
  },


  members : {
    setEnabled : function(value) {
      this.setProperty("disabled", !value);
      if (value) {
        this.removeClass("qx-button-disabled");
      } else {
        this.addClass("qx-button-disabled");
      }
    },


    setLabel : function(value) {
      this.getChildren("span").setHtml(value);
      return this;
    },


    getLabel : function() {
      return this.getChildren("span").getHtml();
    },


    setIcon : function(src) {
      var img = this.getChildren("img");
      img.setAttribute("src", src);
      img.setStyle("display", src ? "inline" : "none");

      return this;
    },


    setMenu : function(menu) {
      this.on("click", function(e) {
        menu.placeTo(this, "bottom-left");
        menu.show();
        q(document).once("click", function() {
          menu.hide();
        });
        e.stopPropagation();
      });
    }
  },


  defer : function() {
    qxWeb.$attach({
      button : function(label, icon) {

        var buttons = qx.lang.Array.cast(this, qx.module.ui.Button);
        buttons.setAttribute("qx-class", this.classname);
        buttons.forEach(function(button) {
          button = qx.module.ui.Button(button);

          if (!button.hasClass("qx-button")) {
            button.addClass("qx-button");
          }

          if (button.getChildren("span") == 0) {
            q.create("<span>").appendTo(button);
          }

          if (button.getChildren("img") == 0) {
            q.create("<img>").appendTo(button).setStyle("display", "none");
          }

          if (label != undefined) {
            button.setLabel(label);
          }

          if (icon != undefined) {
            button.setIcon(icon);
          }
        });

        return buttons;
      }
    });
  }
});
