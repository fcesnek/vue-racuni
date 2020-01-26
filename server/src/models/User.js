const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const billSchema = require('./Bill');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true
  },
  bills: [billSchema],
  password: {
    type: String
  }
}, { timestamps: true });

userSchema.pre('save', function () {
  const SALT_ROUNDS = 10;
  this.updatedAt = Date.now();
  if (!this.isModified('password')) {
    return;
  }

  return bcrypt
    .genSalt(SALT_ROUNDS)
    .then(salt => bcrypt.hash(this.password, salt, null))
    .then(hash => {
      this.password = hash;
    });
});

userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports.User = User;
