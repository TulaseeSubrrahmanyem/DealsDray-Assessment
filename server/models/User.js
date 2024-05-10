// models/User.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  f_userName: { type: String, required: true, unique: true },
  f_Pwd: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
