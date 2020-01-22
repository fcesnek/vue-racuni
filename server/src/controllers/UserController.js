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
      const { username, email, password } = req.body;

      const userExistsEmail = await User.findOne({
        email
      });
      if(userExistsEmail)
        res.status(400).send({ error: 'Korisnik s unesenim emailom već postoji.' });

      const userExistsUsername = await User.findOne({
        username
      });
      if(userExistsUsername)
        res.status(400).send({ error: 'Korisnik s unesenim korisničkim imenom već postoji.' });

      const newUser = new User({
        username,
        email,
        password
      });
      const { savedUsername, savedEmail } = (await newUser.save()).toJSON();
      res.send({
        user: { savedUsername, savedEmail },
        token: jwtSignUser({ savedUsername, savedEmail })
      });
    } catch (err) {
      console.log(err);
      
      res.status(500).send({error: 'Greška pri spremanju podataka. Pokušajte kasnije.'});
    }
  }
};
