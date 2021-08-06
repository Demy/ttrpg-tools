const db = require('./db');
const helper = require('../helper');
const config = require('../config/db');

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

async function savePublicRoll(dice, text) {
  const queryResult = await db.query(
    'INSERT INTO public.rolls(res, text) VALUES ($1, $2) returning id;', 
    [dice, text]
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
 
module.exports = {
  getPublicRolls,
  savePublicRoll,
  getFullRoll
};