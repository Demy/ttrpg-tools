const rolls = require('../services/rolls');

module.exports = app => {
  app.post('/api/roll', async (req, res) => {
    const dice = req.body;
    const rollData = dice.map(die => {
      const res = [];
      for (let i = 0; i < die.count; i++) {
        res.push(Math.round(Math.random() * (die.die - 1)) + 1);
      }
      return { 
        ...die, 
        res
      };
    });

    let id = -1;
    try {
      const ids = await rolls.savePublicRoll(JSON.stringify(rollData));
      if (ids.length > 0) {
        id = ids[0].id;
      }
    } catch (err) {
      console.error(`Error while getting rolls `, err.message);
    }

    res.send({ roll: rollData, id });
  });
  
  app.get('/api/roll', async (req, res) => {
    let result = null;
    const id = +req.query.id;
    if (id.toString() === req.query.id) {
      const results = await rolls.getFullRoll(id);
      if (results.length > 0) {
        result = results[0];
      }
    }
    res.send(result);
  });
};