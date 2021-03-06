/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2013 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Richard Sternagel (rsternagel)

************************************************************************ */
qx.Class.define("qx.test.ui.core.DragDropScrolling",
{
  extend : qx.test.ui.LayoutTestCase,

  // the mixin under test:
  include : qx.ui.core.MDragDropScrolling,

  members :
  {
    list: null,

    setUp : function()
    {
      this.list = this._createDummyList();
      this.getRoot().add(this.list, {left: 150});

      // render the widgets
      this.flush();
    },

    tearDown : function()
    {
      this.list.destroy();
    },

    _createDummyList : function()
    {
      var list = new qx.ui.form.List();
      for (var i=0; i<20; i++) {
        list.add(new qx.ui.form.ListItem("Item " + i));
      }
      return list;
    },

    testFindScrollableParent : function()
    {
      var li = this.list.findItem("Item 7");
      this.assertNotNull(this._findScrollableParent(li));
    },

    testIsScrollable : function()
    {
      this.assertTrue(this._isScrollable(this.list));
      this.assertFalse(this._isScrollable(this));
    },

    testGetBounds : function()
    {
      var bounds = this._getBounds(this.list);

      this.assertKeyInMap("top", bounds);
      this.assertKeyInMap("right", bounds);
      this.assertKeyInMap("bottom", bounds);
      this.assertKeyInMap("left", bounds);
    },

    testGetEdgeType : function()
    {
      var diff = {};

      diff = {"left":-20, "right":0, "bottom":0, "top":0};
      this.assertEquals("left", this._getEdgeType(diff, 20, 30));

      diff = {"left":0, "right":20, "bottom":0, "top":0};
      this.assertEquals("right", this._getEdgeType(diff, 20, 30));

      diff = {"left":0, "right":0, "bottom":0, "top":-30};
      this.assertEquals("top", this._getEdgeType(diff, 20, 30));

      diff = {"left":0, "right":0, "bottom":30, "top":0};
      this.assertEquals("bottom", this._getEdgeType(diff, 20, 30));
    },

    testGetAxis : function()
    {
      this.assertEquals("x", this._getAxis("left"));
      this.assertEquals("x", this._getAxis("right"));
      this.assertEquals("y", this._getAxis("top"));
      this.assertEquals("y", this._getAxis("bottom"));
      this.assertException(function() { this._getAxis("notLeftRightTopOrBottom"); }, Error);
    },

    testGetThresholdByEdgeType : function()
    {
      this.setDragScrollThresholdX(15);
      this.assertEquals(15, this._getThresholdByEdgeType("left"));
      this.assertEquals(15, this._getThresholdByEdgeType("right"));

      this.setDragScrollThresholdY(25);
      this.assertEquals(25, this._getThresholdByEdgeType("top"));
      this.assertEquals(25, this._getThresholdByEdgeType("bottom"));
    },

    testIsScrollbarVisible : function()
    {
      this.assertTrue(this._isScrollbarVisible(this.list, "y"));
      this.assertFalse(this._isScrollbarVisible(this.list, "x"));
    },

    testIsScrollbarExceedingMaxPos : function()
    {
      var scrollbar = this.list.getChildControl("scrollbar-y", true);
      this.assertFalse(this._isScrollbarExceedingMaxPos(scrollbar, "y", 30));
    },

    testCalculateScrollAmount : function()
    {
      this.assertEquals(10, this._calculateScrollAmount(10, 20));
      this.assertEquals(-10, this._calculateScrollAmount(-10, 20));
    },

    testScrollByAmount : function()
    {
      var scrollbar = this.list.getChildControl("scrollbar-y", true),
          initPos = scrollbar.getPosition(),
          scrollAmount = 20;

      this._scrollByAmount(this.list, "y", scrollAmount);
      this.assertEquals(initPos + scrollAmount, scrollbar.getPosition());
    }
  }
});
