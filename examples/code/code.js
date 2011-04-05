var utml = require('./../../utml.js');

var options = { 
  locals : { 
    title : 'Friends', 
    people : [
      { name:'Mike', email:'frey.mike@gmail.com' },
      { name:'Blago' },
      { name:'Sara' }, 
      { name:'Fred', email:'fred@flinstones.com' },
      { name:'Wilma', email:'wilma@flinstones.com' }
    ]
  }
};

// render the main template
utml.renderFile(__dirname + '/code.utml', options, function(err, html) {
  if (err) throw err;
  console.log(html);
});