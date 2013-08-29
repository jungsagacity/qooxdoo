qx.Bootstrap.define("qx.module.ui.Button", {
  extend : qx.module.ui.Widget,

  construct : function(selector, context) {
    this.base(arguments, selector, context);

    this.forEach(function(button) {
      button = q(button);

      if (!button.hasClass("qx-button")) {
        button.addClass("qx-button");
      }

      if (button.getChildren("span") == 0) {
        q.create("<span>").appendTo(button);
      }

      if (button.getChildren("img") == 0) {
        q.create("<img>").appendTo(button).setStyle("display", "none");
      }
    });
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
        var buttons = new qx.module.ui.Button(this);
        if (label != null) {
          buttons.setLabel(label);
        }
        if (icon != null) {
          buttons.setIcon(icon);
        }

        return buttons;
      }
    });
  }
});
