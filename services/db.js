const { Pool } = require('pg');
const config = require('../config/db');
const pool = new Pool(config.db);

async function query(query, params) {
    const {rows, fields} = await pool.query(query, params);

    return rows;
}

module.exports = {
  query
}