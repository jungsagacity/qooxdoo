qx.Bootstrap.define("qx.module.ui.Rating", {
  extend : qx.module.ui.Widget,

  construct : function(selector, context) {
    this.base(arguments, selector, context);

    this.forEach(function(rating) {
      rating = q(rating);

      for (var i = 0; i < 5; i++) {
        q.create("<span>★</span>").appendTo(rating);
      }

      rating.getChildren("span")
        .addClasses(["qx-rating", "qx-rating-off"])
        .on("click", this.__onClick, this);
    }.bind(this));

  },


  members : {
    setValue : function(value) {
      var children = this.getChildren();
      children.removeClass("qx-rating-off");
      children.slice(value, children.length).addClass("qx-rating-off");
      this.emit("changeValue", this.getValue());
    },


    getValue : function() {
      return this.getChildren("span").not(".qx-rating-off").length;
    },


    setSymbol : function(symbol) {
      this.getChildren("span").setHtml(symbol);
    },


    _setLength : function(length) {
      this.forEach(function(el) {
        el = q(el);
        var diff = length - el.getChildren().length;
        if (diff > 0) {
          for (var i = 0; i < diff; i++) {
            el.getChildren().getLast().clone(true).appendTo(el);
          }
        } else {
          for (var i = 0; i < Math.abs(diff); i++) {
            el.getChildren().getLast().remove();
          }
        }
      });
    },


    __onClick : function(e) {
      var parents = q(e.target).getParents();
      this.setValue(parents.getChildren().indexOf(e.target) + 1);
    }
  },


  defer : function(statics) {
    qxWeb.$attach({
      rating : function(initValue, symbol, length) {
        var rating =  new qx.module.ui.Rating(this);

        if (length != undefined && length != 5) {
          rating._setLength(length);
        }

        if (initValue != undefined) {
          rating.setValue(initValue);
        }

        if (symbol != undefined) {
          rating.setSymbol(symbol);
        }

        return rating;
      }
    });
  }
});
