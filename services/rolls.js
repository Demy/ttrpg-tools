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

async function savePublicRoll(result) {
  const queryResult = await db.query(
    'INSERT INTO public.rolls(res) VALUES ($1);', 
    [result]
  );
  return queryResult;
};

module.exports = {
  getPublicRolls,
  savePublicRoll
};