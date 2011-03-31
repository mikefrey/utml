var utml = require('./../../utml.js');

var options = { 
  locals : { 
    title : 'Friends', 
    people : ['Mike', 'Blago', 'Sara', 'Fred', 'Wilma']
  }
};

// compile the subtemplate
var subtmpl = utml.compileFile(__dirname + '/subtemplate.utml', function(err, fn){
  if (err) throw err;
  
  // add the subtemplate to locals
  options.locals.subtemplate = fn;
  
  // render the main template
  utml.renderFile(__dirname + '/maintemplate.utml', options, function(err, html) {
    if (err) throw err;
    console.log(html);
  });
});
