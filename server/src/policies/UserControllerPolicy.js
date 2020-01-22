const Joi = require('joi');

module.exports = {
  signup (req, res, next) {
    const schema = Joi.object({
      username: Joi.string().alphanum().min(3).max(30).required(),
      email: Joi.string().email({ minDomainAtoms: 2 }).required(),
      password: Joi.string().regex(
        new RegExp('^[a-zA-z0-9]{6,32}$')
      ).min(6).max(32).required(),
    });
    const { error } = Joi.validate(req.body, schema);
    if (error) {
      console.log('error', error.details[0]);
      switch (error.details[0].context.key) {
      case 'username':
        res.status(400).send({
          error: `Korisničko ime mora poštovati sljedeća pravila:
            <br>
            1. Može sadržavati samo alfanumeričke znakove
            <br>
            2. Duljina mora biti između 3 i 30 znakova.
            `
        });
        break;
      case 'email':
        res.status(400).send({
          error: 'Upišite validnu email adresu.'
        });
        break;
      case 'password':
        res.status(400).send({
          error: `Lozinka mora poštovati sljedeća pravila:
            <br>
            1. Može sadržavati samo alfanumeričke znakove
            <br>
            2. Duljina mora biti između 6 i 32 znaka.
            `
        });
        break;
      default:
        res.status(400).send({
          error: 'Provjerite unesene podatke i pokušajte ponovno.'
        });
      }
    } else {
      next();
    }
  }
};
