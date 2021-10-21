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

function getRoomStatus(roomId) {
  return db.query(
    `SELECT private, protected FROM rooms WHERE id=${db.escape(roomId)} LIMIT 1`
  );
};

async function checkPassword(roomId, password) {
  const results = await db.query(
    `SELECT password FROM rooms WHERE id=${db.escape(roomId)} LIMIT 1`
  );
  if (results.length > 0) {
    const result = results[0];
    let comp = bcrypt.compareSync(password, result.password);
    return comp;
  }
};

module.exports = {
  createRoom,
  getRoomStatus,
  checkPassword,
};