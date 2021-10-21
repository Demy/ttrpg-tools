const rolls = require('../services/rolls');
const rooms = require('../services/rooms');
const jwt = require('jsonwebtoken');

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
        console.log(error);
        res.status(500).send('Cannot get the roll result from the data base');
      });
    } else {
      res.status(500).send('No roll ID specified');
    }
  });

  app.get('/api/history', (req, res) => {
    let roomId = req.query.room;
    rolls.getRollsHistory(roomId).then(results => {
      res.send({ history: results, room: roomId });
    }, error => {
      console.log(error);
      res.status(500).send(error);
    });
  });

  app.get('/api/room', (req, res) => {
    let roomId = req.query.room;
    rooms.getRoomStatus(roomId).then(results => {
      let result = null;
      if (results.length > 0) {
        result = results[0];
      }
      res.send(result);
    }, error => {
      console.log(error);
      res.status(500).send(error);
    });
  });

  app.post('/api/room-login', (req, res) => {
    const roomId = req.body.roomId;
    rooms.checkPassword(roomId, req.body.password).then(result => {
      if (result) {
        const token = jwt.sign(
          { roomId },
          process.env.TOKEN_KEY,
          { expiresIn: "24h" }
        );
        res.status(201).json({ token });
      } else {
        res.status(400).send('Incorrect password');
      }
    }, error => {
      console.log(error);
      res.status(500).send(error);
    });
  });
};