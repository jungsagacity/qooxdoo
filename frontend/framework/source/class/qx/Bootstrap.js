/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2007 1&1 Internet AG, Germany, http://www.1and1.org

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Sebastian Werner (wpbasti)
     * Andreas Ecker (ecker)

************************************************************************ */

/* ************************************************************************

#module(core)
#resource(qx.static:static)
#use(qx.lang.Core)
#use(qx.lang.Generics)

************************************************************************ */

/**
 * Create namespace
 */
qx =
{
  core :
  {
    /**
     * Bootstrap qx.Bootstrap to create myself later
     * This is needed for the API browser etc. to let them detect me
     */
    Bootstrap :
    {
      createNamespace : function(name, object)
      {
        var splits = name.split(".");
        var parent = window;
        var part = splits[0];

        for (var i=0, len=splits.length-1; i<len; i++, part=splits[i])
        {
          if (!parent[part]) {
            parent = parent[part] = {};
          } else {
            parent = parent[part];
          }
        }

        // store object
        parent[part] = object;

        // return last part name (e.g. classname)
        return part;
      },

      define : function(name, config)
      {
        if (!config) {
          var config = { statics : {} };
        }

        this.createNamespace(name, config.statics);

        if (config.defer) {
          config.defer(config.statics);
        }

        // Store class reference in global class registry
        qx.Bootstrap.$$registry[name] = config.statics;
      }    
    }
  }
};


/**
 * Internal class that is responsible for bootstrapping the qooxdoo
 * framework at load time.
 *
 * Automatically loads JavaScript language fixes, core logging possibilities
 * and language addons for arrays, strings, etc.
 */
qx.Bootstrap.define("qx.Bootstrap",
{
  statics :
  {
    /** Timestamp of qooxdoo based application startup */
    LOADSTART : new Date,
    

    /**
     * Create namespace.
     * Lightweight version of {@link qx.Class#createNamespace} only used during bootstrap phase.
     *
     * @type map
     * @signature function(name, object)
     * @param name {var} TODOC
     * @param object {var} TODOC
     * @return {var} TODOC
     */    
    createNamespace : qx.Bootstrap.createNamespace,


    /**
     * Define class.
     * Lightweight version of {@link qx.Class#define} only used during bootstrap phase.
     *
     * @type map
     * @signature function(name, config)
     * @param name {var} TODOC
     * @param config {var} TODOC
     * @return {void}
     */
    define : qx.Bootstrap.define,


    /**
     * Returns the current timestamp
     *
     * @type static
     * @return {Integer} Current timestamp (milliseconds)
     */
    time : function() {
      return new Date().getTime();
    },


    /**
     * Returns the time since initialisation
     *
     * @type static
     * @return {Integer} milliseconds since load
     */
    since : function() {
      return this.time() - this.LOADSTART;
    },


    /** Stores all defined classes */
    $$registry : {}
  }
});
