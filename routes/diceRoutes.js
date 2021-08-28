const rolls = require('../services/rolls');

module.exports = app => {
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

  app.get('/api/history', async (req, res) => {
    let roomId = req.query.room;
    rolls.getRollsHistory(roomId, (error, results) => {
      if (error) {
        res.error(error);
        return;
      }
      res.send({ history: results, room: roomId });
    });
  });
};