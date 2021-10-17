const rolls = require('../services/rolls');

module.exports = app => {
  app.get('/api/roll', (req, res) => {
    let result = null;
    const id = +req.query.id;
    if (id.toString() === req.query.id) {
      rolls.getFullRoll(id).then((results) => {
        if (results.length > 0) {
          result = results[0];
        }
        res.send(result);
      }, (error) => {
        res.error('Cannot get the roll result from the data base');
      });
    } else {
      res.error('No roll ID specified');
    }
  });

  app.get('/api/history', (req, res) => {
    let roomId = req.query.room;
    rolls.getRollsHistory(roomId).then(results => {
      res.send({ history: results, room: roomId });
    }, error => {
      res.error(error);
    });
  });
};