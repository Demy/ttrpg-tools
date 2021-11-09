const db = require('./db');

const PUBLIC_ROOM = 'public';

function makeRoll({ roomId, dice, text }, callback) {
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

  saveRoll(roomId, JSON.stringify(rollData), text).then(result => {
    callback({ res: rollData, id: result.insertId, text, time: Date.now() });
  }, error => {
      throw error;
  });
};

function saveRoll(roomId, result, text) {
  if (!roomId || roomId === PUBLIC_ROOM) {
    return db.query(
      `INSERT INTO rolls(res, text) VALUES (${db.escape(result)}, ${db.escape(text)})`
    );
  }
  return db.query(
    `INSERT INTO room_rolls(room, res, text) VALUES (${db.escape(roomId)}, ${db.escape(result)}, ${db.escape(text)})`
  );
};

function getFullRoll(id, roomId) {
  if (!roomId || roomId === PUBLIC_ROOM) {
    return db.query(
      `SELECT * FROM rolls WHERE id=${id} LIMIT 1`
    );
  }
  return db.query(
    `SELECT * FROM room_rolls WHERE id=${id} AND room=${db.escape(roomId)} LIMIT 1`
  );
};

function getRollsHistory(roomId) {
  if (!roomId || roomId === PUBLIC_ROOM) {
    return db.query(
      'SELECT * FROM rolls ORDER BY time DESC LIMIT 10'
    );
  }
  return db.query(
    `SELECT * FROM room_rolls WHERE room=${db.escape(roomId)} ORDER BY time DESC LIMIT 10`
  );
};
 
module.exports = {
  makeRoll,
  saveRoll,
  getFullRoll,
  getRollsHistory,
};