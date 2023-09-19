const mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    name: {type:String},
    email: {type:String},
    subscription: {type:String} 
});

module.exports = mongoose.model('subscribers', userSchema);