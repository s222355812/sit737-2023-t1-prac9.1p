var express = require('express');
var app = express();

app.get('/', function(req,res){
    res.send("hello world")
    var dateTime = new Date();
    console.log("server time is " +dateTime)
})

// app.use((req, res, next) => {
//     var dateTime = new Date();
//     console.log("server time is " +dateTime);
//     //console.log('[Server Activity]: ' + Date(Date.now()));
//     next();
//   });

  
app.listen(3000, () => console.log('App is listening on port 3000'));