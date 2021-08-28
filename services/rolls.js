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

  savePublicRoll(JSON.stringify(rollData), text, (error, result) => {
    if (error) {
      throw(error);
    }
    callback({ res: rollData, id: result.insertId, text, time: Date.now() });
  });
};

function getPublicRolls(callback, page = 1) {
  const offset = helper.getOffset(page, config.listPerPage);
  db.query(
    `SELECT id, res, time FROM rolls OFFSET ${offset} LIMIT ${config.listPerPage}`, 
    (error, results, fields) => {
      const data = helper.emptyOrRows(results);
      const meta = {page};
    
      callback(error, {
        data,
        meta
      }, fields);
    }
  );
};

function savePublicRoll(result, text, callback) {
  db.query(
    `INSERT INTO rolls(res, text) VALUES (${db.escape(result)}, ${db.escape(text)})`, 
    callback
  );
};

function getFullRoll(id, callback) {
  db.query(
    `SELECT id, res, time, text FROM rolls WHERE id=${id} LIMIT 1`,
    callback
  );
};

async function getRollsHistory(roomId, callback) {
  db.query(
    'SELECT res, time, text FROM rolls ORDER BY time DESC LIMIT 10',
    callback
  );
};

async function makeRoll(dice, text) {

};
 
module.exports = {
  getPublicRolls,
  makePublicRoll,
  savePublicRoll,
  getFullRoll,
  getRollsHistory,
  makeRoll,
};