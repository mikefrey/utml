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
 * Version
 */
exports.version = '0.1.0';


var optionDefaults = {
  cache:true
};


var cache = {};



function clearCache(filename) {
  if (filename) 
    delete cache[filename];
  else
    cache = {};
}




function compile(source, options) {
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




function render(str, options) {
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



exports.compile = compile
exports.render = render;
exports.clearCache = clearCache;


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