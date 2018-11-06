'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var sensorSchema = new Schema({
  ledState: {
    type: String
  },
  Created_date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Sensors', sensorSchema);
