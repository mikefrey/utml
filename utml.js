/*!
 * UTML
 * Underscore Template Markup Language
 * Copyright(c) 2011 Mike Frey <frey.mike@gmail.com>
 * MIT Licensed
 */


/**
 * Dependencies
 */
var _ = require('underscore');


/**
 * Module Version
 */
exports.version = '0.1.0';


/**
 * Default Options object
 */

var optionDefaults = {
  cache:true
};


/**
 * Template cache
 */

var cache = {};


/**
 * Clear template cache for the given 'filename', otherwise clear the whole cache
 *
 * @param {String} filename
 * @api public
 */

var clearCache = exports.clearCache = function(filename) {
  if (filename) 
    delete cache[filename];
  else
    cache = {};
}


/**
 * Compile the given 'source' utml into a 'Function'
 * 
 * @param {String} source
 * @param {Object} options
 * @return {Function}
 * @api public
 */

var compile = exports.compile = function(source, options) {
  if (typeof source === 'string') {
    var tmpl = _.template(source);
    if (options.filename && options.cache) 
      cache[options.filename] = tmpl;
    return tmpl;
  }
  else {
    return source;
  }
}



/**
 * Render the given 'str' of utml
 * 
 * Options:
 *  - 'locals'    Local variables object
 *  - 'cache'     Compiled functions are cached, requires 'filename', default: true
 *  - 'filename'  Used by 'cache' to key caches
 *  - 'scope'     Function execution context
 * 
 * @param {String} str
 * @param {Object} options
 * @return {String}
 * @api public
 */

var render = exports.render = function(str, options) {
  var fn, locals;
  
  options = _.extend({}, optionDefaults, options || {});
  locals = _.extend({}, {_:_}, options.locals || {});
  
  if (options.cache) {
    if (options.filename) {
    	fn = cache[options.filename] || compile(str, options);
    }
    else {
      throw new Error('"cache" option requires "filename".');
    }
  }
  else {
    fn = compile(str, options);
  }
  
  if (options.scope) {
    fn.call(options.scope, locals);
  }
  else {
    fn(locals);
  }
}



/**
 * Expose to require()
 */

if (require.extensions) {
  require.extensions['.utml'] = function(module, filename) {
    source = require('fs').readFileSync(filename, 'utf-8');
    module._compile(compile(source, {}), filename);
  };
}
else if (require.registerExtension) {
  require.registerExtension('.utml', function(src){
    return compile(src, {});
  });
}