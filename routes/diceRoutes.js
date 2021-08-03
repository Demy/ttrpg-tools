const rolls = require('../services/rolls');

module.exports = app => {
  app.post('/api/roll', async (req, res) => {
    const dice = req.body;
    const rollData = dice.map(die => ({ 
      ...die, 
      res: Math.round(Math.random() * (die.die - 1)) + 1
    }));

    try {
      await rolls.savePublicRoll(JSON.stringify(rollData));
    } catch (err) {
      console.error(`Error while getting rolls `, err.message);
    }

    res.send(rollData);
  });
};