 'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var UserSchema = new Schema({
        username: {
            type: String
        },
        created_date: {
            type: Date,
            default: Date.now
        },
        password: {
            type: String
        },
        sensors: [String],
        admin: {
            type: Boolean,
            default: false
        }
});

module.exports = mongoose.model('Users', UserSchema);




