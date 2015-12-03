var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var options = {
  user: 'testdatabase',
  pass: 'test'
};
mongoose.connect('mongodb://ds057244.mongolab.com:57244/dbz', options);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log('db connection established');
});

var cardSchema = mongoose.Schema({
  name: String,
  rarity: String,
  setName: String,
  setNumber: Number,
  type: String,
  color: String,
  alignment: String,
  text: String,
  endurance: Number
});
var Card = mongoose.model('Card', cardSchema);

function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/', function (req, res) {
  var request = req.body;
  for (var key in request) {
    if (request[key] == "") {
      delete request[key];
    }
  }
  if (request.name) {
    request.name = new RegExp(request.name.toLowerCase(), 'i');
  }
  if (request.text) {
    request.text = new RegExp(request.text, 'i');
  }
  Card.find(request, function (err, obj) {
    if (err) return console.log('error');
    if (obj.length == 0) {
      res.render('index', {message: 'No results found.'});
      return;
    } else {
      res.render('results', {cards: obj});
    }
  });
});

router.get('/input', function (req, res) {
  res.render('input');
});

router.post('/input', function (req, res) {
  var card = new Card(req.body);
  card.save(function (err) {
    if (err) return console.error(err);
  });
  res.render('input', {message: 'Record added'});
});

router.get('/showall', function (req, res) {
  Card.find({}, function (err, obj) {
    if (err) return console.log('error');
    var sorted = sortByKey(obj, 'setNumber');
    sorted.quantity = sorted.length;
    res.render('showall', {cards: sorted});
  });
});

router.get('/notext', function (req, res) {
  Card.find({text: ""}, function (err, obj) {
    if (err) return console.log('error');
    var sorted = sortByKey(obj, 'setNumber');
    sorted.quantity = sorted.length;
    res.render('notext', {cards: sorted});
  });
});

router.post('/edit', function (req, res) {
  Card.findOne({name: req.body.name}, function (err, obj) {
    if (err) return console.error(err);
    res.render('edit', {card: obj});
  });
});

router.post('/save', function (req, res) {
  var card = new Card(req.body);

  Card.update({name: req.body.name}, { $set: req.body }, {multi: false}, function (err, numAffected) {
    res.redirect('/notext');
  });
});




module.exports = router;
