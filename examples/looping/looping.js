var utml = require('./../../utml.js');

var options = { 
  locals : { 
    title : 'Friends', 
    people : ['Mike', 'Blago', 'Sara', 'Fred', 'Wilma']
  }
};

// render the main template
utml.renderFile(__dirname + '/looping.utml', options, function(err, html) {
  if (err) throw err;
  console.log(html);
});