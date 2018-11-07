'use strict';

var mongoose = require('mongoose'),
  Sensor = mongoose.model('Sensors'),
  Value = mongoose.model('Values'),
  auth = require('./middleware'),
  jwt = require('jsonwebtoken'),
  io = require('../../server').io,
  User = mongoose.model('Users');

exports.list_all_sensors = function(req, res) {
  Sensor.find({}, function(err, sensor) {
    if (err)
      res.send(err);
    res.json(sensor);
  });
};

exports.create_a_sensor = function(req, res) {
  var new_sensor = new Sensor(req.body);
  new_sensor.save(function(err, sensor) {
    if (err)
      res.send(err);
    res.json(sensor);
  });
};

exports.read_a_sensor = function(req, res) {
  Sensor.findById(req.params.sensorId, function(err, sensor) {
    if (err)
      res.send(err);
    res.json(sensor);
  });
};

exports.update_a_sensor = function(req, res) {
  Sensor.findOneAndUpdate({_id: req.params.sensorId}, req.body, {new: true}, function(err, sensor) {
    if (err)
      res.send(err);
    res.json(sensor);
  });
};

exports.delete_a_sensor = function(req, res) {
  Sensor.remove({
    _id: req.params.sensorId
  }, function(err, sensor) {
    if (err)
      res.send(err);
    res.json({ sensor: 'Sensor successfully deleted' });
  });
};

//Value
exports.list_all_values = function(req, res) {
  console.log(req.query.initialDate)
  console.log(req.query.finalDate)
  console.log("LOL")
  if (req.query.initialDate == null || req.query.finalDate == null){
    Value.find({}, function(err, value) {
      if (err)
        res.send(err);
      res.json(value);
    });
  }else {
    io.emit('event', {});
    Value.find({Created_date: {"$gte": new Date(req.query.initialDate), "$lt": new Date(req.query.finalDate)}, sensorId: req.query.sensorId}, function(err, value) {
      if (err)
        res.send(err);
      res.json(value);
    });
  }
  
};

exports.create_a_value = function(req, res) {
  var new_sensor = new Value(req.body);
  new_sensor.save(function(err, value) {
    if (err){
      res.send(err);
    }else{
      res.json(value);
      io.emit('value_added', { value: value.value });
    }
  });
};

exports.read_a_value = function(req, res) {
  Value.findById(req.params.valueId, function(err, value) {
    if (err)
      res.send(err);
    res.json(value);
  });
};

exports.update_a_value = function(req, res) {
  Value.findOneAndUpdate({_id: req.params.sensorId}, req.body, {new: true}, function(err, value) {
    if (err)
      res.send(err);
    res.json(value);
  });
};

exports.delete_a_value = function(req, res) {
  Value.remove({
    _id: req.params.sensorId
  }, function(err, value) {
    if (err)
      res.send(err);
    res.json({ value: 'Sensor successfully deleted' });
  });
};

//User
exports.create_a_user = function(req, res, next) {
    User.findOne({'username':req.body.username}, 'username', function(err, user) {
      if (user == null) {
        var new_user = new User(req.body);
        new_user.save(function(err, user) {
          if (err)
            res.send(err);
          res.status(200).json(user);
        });
      }else{
        res.send({'error':'Username already in use.'});
      }
    });
};

exports.list_all_users = function(req, res, next) {
  
  try{
    User.find({}, function(err, user) {
      if (err)
        res.send(err);
      res.status(200).json(user);
    });
  }catch(err){}
};

exports.read_a_user = function(req, res, next) {
  try{
    User.findOne({'username':req.params.username}, function(err, user) {
      if (err)
        res.send(err);
      res.status(200).json(user);
    });
  }catch(err){}
};

exports.update_a_user = function(req, res, next) {
  
  try{
    User.findOneAndUpdate({_id: req.params._id}, req.body, { new: true }, function(err, user) {
      if (err)
        res.send(err);
      res.status(200).json(user);
    });
  }catch(err){}
};

exports.delete_a_user = function(req, res, next) {
  
  try{
    User.remove({
      _id: req.params.userId
    }, function(err, user) {
      if (err)
        res.send(err);
      res.status(200).json({ message: 'Report successfully deleted' });
    });
  }catch(err){}
};

exports.authenticate = function(req, res, next) {

  // find the user
  
  User.findOne({'username':req.body.username}, function(err, user) {

      if (!user) {
        res.status(401).json({ success: false, message: 'Authentication failed. User not found.' });
      } else if (user) {

        // check if password matches
        if (user.password != req.body.password) {
          res.status(401).json({ success: false, message: 'Authentication failed. Wrong password.' });
        } else {

          const plainUserObject = {
            username: user.username,
            password: user.password
          }

          // if user is found and password is right
          // create a token
          var token = jwt.sign(plainUserObject, "@tomada_machine", {
            expiresIn: "10h"
          });

          // return the information including token as JSON
          res.status(200).json({
            success: true,
            message: 'Enjoy your token!',
            token: token
          });
        }   

      }
  });
};

