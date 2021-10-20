const db = require('./db');
const bcrypt = require("bcrypt");

async function createRoom ({ roomId, private, password, protected }) {
  let hash = '';
  if (private) {
    const salt = await bcrypt.genSalt(10);
    hash = await bcrypt.hash(password, salt);
  }
  const result = await db.query(
    'INSERT INTO rooms(id, private, password, protected) VALUES ' + 
    `(${db.escape(roomId)}, ${db.escape(private)}, ${db.escape(hash)}, ${db.escape(protected)})`
  );
  return result;
}

module.exports = {
  createRoom,
};