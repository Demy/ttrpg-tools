const db = require('./db');
const helper = require('../helper');
const config = require('../config/db');

async function makePublicRoll(dice, text) {
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
    const ids = await savePublicRoll(JSON.stringify(rollData), text);
    if (ids.length > 0) {
      id = ids[0].id;
    }
  } catch (err) {
    console.error(`Error while getting rolls `, err.message);
  }
  return { res: rollData, id, text, time: new Date(Date.now()) };
};

async function getPublicRolls(page = 1) {
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    'SELECT id, res, time FROM rolls OFFSET $1 LIMIT $2', 
    [offset, config.listPerPage]
  );
  const data = helper.emptyOrRows(rows);
  const meta = {page};

  return {
    data,
    meta
  };
};

async function savePublicRoll(result, text) {
  const queryResult = await db.query(
    'INSERT INTO public.rolls(res, text) VALUES ($1, $2) returning id;', 
    [result, text]
  );
  return queryResult;
};

async function getFullRoll(id) {
  const queryResult = await db.query(
    'SELECT id, res, time, text FROM rolls WHERE id=$1 LIMIT 1', 
    [id]
  );
  return queryResult;
};

async function getRollsHistory(roomId) {
  console.log('getRollsHistory ' + roomId);
  const queryResult = await db.query(
    'SELECT res, time, text FROM rolls ORDER BY time DESC LIMIT 10'
  );
  return queryResult;
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