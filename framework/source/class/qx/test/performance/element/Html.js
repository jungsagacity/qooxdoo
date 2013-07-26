/**
 * @require(qxWeb)
 * @require(qx.module.Core)
 */
qx.Class.define("qx.test.performance.element.Html",
{
  extend : qx.test.ui.LayoutTestCase,
  include : qx.dev.unit.MMeasure,

  members :
  {
    ITERATIONS : 5000,

    __cont : null,

    __outerStyles : null,

    setUp : function()
    {
      this.__outerStyles = {
        position: "absolute",
        top: "20px",
        left: "20px",
        width: "60px",
        height: "60px",
        border: "1px solid blue",
        padding: "10px"
      };
      this.__cont = new qx.ui.container.Composite(new qx.ui.layout.Basic());
      this.getRoot().add(this.__cont, {edge: 0});
      qx.ui.core.queue.Manager.flush();
    },

    tearDown : function()
    {
      qxWeb("body > div").getChildren().remove();
      this.__cont.destroy();
    },

    __createHtmlElement : function()
    {
      var outer = new qx.html.Element();
      outer.setStyles(this.__outerStyles);

      var inner = new qx.html.Element();
      inner.setAttribute("text", "Some Text");
      outer.add(inner);

      this.__cont.getContentElement().add(outer);
    },

    __createQxWeb : function()
    {
      var outer = qxWeb.create("<div>")
      .setStyles(this.__outerStyles);

      var inner = qxWeb.create("<div>")
      .setHtml("Some Text")
      .appendTo(outer);

      outer.appendTo(this.__cont.getContentElement());
    },

    testQxHtml : function() {
      this.measure(
        "create HTML elements",

        function() {
          for (var i=0; i<= this.ITERATIONS; i++) {
            this.__createHtmlElement();
          }
        }.bind(this),

        function() {
          qx.html.Element.flush();
        },

        this.ITERATIONS
      );
    },

    testQxWeb : function() {
      this.measure(
        "create qxWeb elements",

        function() {
          for (var i=0; i<= this.ITERATIONS; i++) {
            this.__createQxWeb();
          }
        }.bind(this),

        null,

        this.ITERATIONS
      );
    }
  }
});
