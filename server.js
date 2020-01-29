'use strict';

var express     = require('express');
var bodyParser  = require('body-parser');
var cors        = require('cors');
const helmet    = require('helmet');

var apiRoutes         = require('./routes/api.js');
var fccTestingRoutes  = require('./routes/fcctesting.js');
var runner            = require('./test-runner');

var MongoClient = require("mongodb").MongoClient;

const uri = `mongodb://${process.env.DBUSER}:${
  process.env.DBPASSWD
}@ds063124.mlab.com:63124/fcc`;



var app = express();

app.use('/public', express.static(process.cwd() + '/public'));
app.use(helmet.noCache());
app.use(helmet.hidePoweredBy({ setTo: 'PHP 4.2.0' }))

app.use(cors({origin: '*'})); //USED FOR FCC TESTING PURPOSES ONLY!

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

console.log("running server.js")

MongoClient.connect(uri, (err, db) => {
  if (err) console.log("Database error:  " + err);

  console.log("Database connected");
  

    //Index page (static HTML)
  app.route('/')
    .get(function (req, res) {
      res.sendFile(process.cwd() + '/views/index.html');
    });

  //For FCC testing purposes
  fccTestingRoutes(app);

  //Routing for API 
  apiRoutes(app,db);  

  //404 Not Found Middleware
  app.use(function(req, res, next) {
    res.status(404)
      .type('text')
      .send('Not Found');
  });

 
   //Start our server and tests!
  app.listen(process.env.PORT || 3000, function () {
    console.log("Listening on port " + process.env.PORT);
    console.log('process.env.NODE_ENV',process.env.NODE_ENV)
    if(process.env.NODE_ENV==='test') {
      console.log('Running Tests...');
      setTimeout(function () {
        try {
          runner.run();
        } catch(e) {
          var error = e;
            console.log('Tests are not valid:');
            console.log(error);
        }
      }, 1500);
    }
  });
  
  
})



module.exports = app; //for unit/functional testing
