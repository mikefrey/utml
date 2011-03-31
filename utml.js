/*!
 * UTML
 * Underscore Template Markup Language
 * Copyright(c) 2011 Mike Frey <frey.mike@gmail.com>
 * MIT Licensed
 */


/**
 * Dependencies
 */
var _ = require('underscore'),
  fs = require('fs');


/**
 * Module Version
 */
exports.version = '0.2.0';


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
 * Get a template from the cache
 * 
 * @param {object} options
 * @return {Function}
 */

function fromCache(options) {
  var filename = options.filename;
  if (options.cache) {
    if (filename) {
      if (cache[filename]) {
        return cache[filename];
      }
    }
    else {
      throw new Error('filename is required when using the cache option');
    }
  }
  return false;
}

/**
 * Store the given fn in the cache
 * 
 * @param {Function} fn
 * @param {object} options
 */

function cacheTemplate(fn, options) {
  if (options.cache && options.filename) {
    cache[options.filename] = fn;
  }
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
    cacheTemplate(tmpl, options);
    return tmpl;
  }
  else {
    return source;
  }
}

/**
 * Compiles a utml file into a 'Function'
 * 
 * @param {String} path
 * @param {object} options
 * @param {Function} fn
 * @return {Function}
 * @api public
 */

var compileFile = exports.compileFile = function(path, options, fn) {
  if (typeof options === 'function') {
    fn = options;
    options = _.extend({}, optionDefaults);
  }
  options.filename = path;
  
  var tmpl = fromCache(options);
  
  if (tmpl) {
    return fn(null, tmpl);
  }
  else {
    return fs.readFile(path, 'utf8', function(err, str) {
      if (err) return fn(err);
      try {
        return fn(null, compile(str, options));
      }
      catch (err) {
        return fn(err);
      }
    });
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
  
  fn = (typeof str === 'function') && str || fromCache(options) || compile(str, options);
  
  if (options.scope) {
    return fn.call(options.scope, locals);
  }
  else {
    return fn(locals);
  }
}

/**
 * Renders the utml file at the given path
 * 
 * @param {String} path
 * @param {object} options
 * @param {Function} fn
 * @return {String}
 * @api public
 */

var renderFile = exports.renderFile = function(path, options, fn) {
  if (typeof options === 'function') {
    fn = options;
    options = _.extend({}, optionDefaults);
  }
  options.filename = path;
  
  if (fromCache(options)) {
    return fn(null, render('', options));
  }
  else {
    compileFile(path, options, function(err, tmpl) {
      if (err) return fn(err);

      return fn(null, render(tmpl, options));
    });
  }
}






/**
 * Expose to require()
 */

if (require.extensions) {
  require.extensions['.utml'] = function(module, filename) {
    source = fs.readFileSync(filename, 'utf8');
    module._compile(compile(source, {}), filename);
  };
}
else if (require.registerExtension) {
  require.registerExtension('.utml', function(src){
    return compile(src, {});
  });
}
