const { User } = require('../models/User');
const Bill = require('../models/Bill');

module.exports = {
  async list (req, res) {
    try {
      const { user } = req;
      const dbUser = await User.findOne({
        username: user.username,
      });

      if(dbUser) {
        res.status(200).send({ bills: dbUser.bills });
      }
      else
        res.status(400).send({ error: 'Greška pri dohvaćanju podataka. Pokušajte kasnije.' });

    } catch (err) {
      res.status(500).send({error: 'Greška pri dohvaćanju podataka. Pokušajte kasnije.'});
    }
  },
  async new (req, res) {
    try {
      const bills = req.body;
      const { username } = req.user;

      const dbUser = await User.findOne({
        username,
      });

      for (let i = 0; i < bills.length; i++) {
        try {
          const existingBill = await User.findOne({ username, 'bills.billNumber': bills[i].billNumber});
          if(!existingBill) {
            const billToInsert = {
              ...bills[i],
              period: `${bills[i].month}/${bills[i].year}`,
            };
            const bill = new Bill(billToInsert);
            dbUser.bills.push(bill);
          }
          else {
            res.status(400).send({ error: `Račun s pozivom na broj ${bills[i].billNumber} već postoji`});
            return;
          }
        } catch (error) {
          res.status(400).send({ error: `Račun s pozivom na broj ${bills[i].billNumber} već postoji`});
        }
      }
      dbUser.save(function (error) {
        if (error) res.status(500).send({ error });
      });

      res.status(200).send({ bills: dbUser.bills, username: dbUser.username });
    } catch (error) {
      res.status(500).send({error});
    }
  },
  async remove (req, res) {
    try {
      const { user } = req;
      const { billNumber } = req.query;

      const dbUser = await User.findOneAndUpdate({
        username: user.username,
      },
      {
        $pull: {
          bills: { billNumber: billNumber }
        }
      });

      res.status(200).send({ dbUser, msg: 'success!' });
    } catch (error) {
      res.status(500).send({error: 'Greška pri dohvaćanju podataka. Pokušajte kasnije.'});
    }
  },
};
