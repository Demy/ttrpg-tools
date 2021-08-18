const rolls = require('../services/rolls');

module.exports = app => {
  app.post('/api/roll', async (req, res) => {
    const result = await rolls.makePublicRoll(req.body.dice, req.body.text);
    res.send(result);
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