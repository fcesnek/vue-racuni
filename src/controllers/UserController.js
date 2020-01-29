const { User } = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

function jwtSignUser (user) {
  const ONE_WEEK = 60 * 60 * 24 * 7;
  return jwt.sign(user, config.authentication.jwtSecret, {
    expiresIn: ONE_WEEK
  });
}

module.exports = {
  async signup (req, res) {
    try {
      const { username, password } = req.body;

      const userExists = await User.findOne({
        username
      });
      if(userExists)
        res.status(400).send({ error: 'Korisnik s unesenim korisničkim imenom već postoji.' });

      const newUser = new User({
        username,
        password
      });
      
      const savedUser = await newUser.save();
      const { username: savedUsername } = savedUser.toJSON();
      res.send({
        user: {username: savedUsername},
        token: jwtSignUser({ username: savedUsername })
      });
    } catch (err) {
      res.status(500).send({error: 'Greška pri spremanju podataka. Pokušajte kasnije.'});
    }
  },
  async login (req, res) {
    try {
      const { username, password } = req.body;
      console.log(req.body);
      const user = await User.findOne({
        username
      });
      console.log(user);
      
      if (!user) {
        return res.status(403).send({
          error: 'Pogrešni podaci za prijavu.'
        });
      }
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(403).send({
          error: 'Pogrešni podaci za prijavu.'
        });
      }
      const { username: savedUsername } = user.toJSON();
      res.send({
        user: {username: savedUsername},
        token: jwtSignUser({ username: savedUsername })
      });
    } catch (err) {
      res.status(500).send({
        error: 'Dogodila se greška prilikom autentikacije korisnika.'
      });
    }
  },
};
