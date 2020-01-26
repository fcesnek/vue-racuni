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
      const { savedUsername } = (await newUser.save()).toJSON();
      res.send({
        user: { savedUsername },
        token: jwtSignUser({ savedUsername })
      });
    } catch (err) {
      res.status(500).send({error: 'Greška pri spremanju podataka. Pokušajte kasnije.'});
    }
  }
};
