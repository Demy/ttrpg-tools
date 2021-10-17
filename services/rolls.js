const db = require('./db');
const helper = require('../helper');
const config = require('../config/db');

function makePublicRoll(dice, text, callback) {
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

  savePublicRoll(JSON.stringify(rollData), text).then(result => {
    callback({ res: rollData, id: result.insertId, text, time: Date.now() });
  }, error => {
      throw error;
  });
};

function savePublicRoll(result, text) {
  return db.query(
    `INSERT INTO rolls(res, text) VALUES (${db.escape(result)}, ${db.escape(text)})`
  );
};

function getFullRoll(id) {
  return db.query(
    `SELECT id, res, time, text FROM rolls WHERE id=${id} LIMIT 1`
  );
};

function getRollsHistory(roomId) {
  return db.query(
    'SELECT id, res, time, text FROM rolls ORDER BY time DESC LIMIT 10'
  );
};
 
module.exports = {
  makePublicRoll,
  savePublicRoll,
  getFullRoll,
  getRollsHistory,
};