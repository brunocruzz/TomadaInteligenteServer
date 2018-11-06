'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var valueSchema = new Schema({
  value: {
    type: Number
  },
  sensorId: {
    type: String
  },
  Created_date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Values', valueSchema);
