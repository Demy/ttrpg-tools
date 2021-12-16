const getRandomFromArray = (array) => {
  return array[Math.round(Math.random() * (array.length - 1))];
};

const getRandomOf = (max) => {
  return Math.round(Math.random() * max);
};

module.exports = {
  getRandomFromArray,
  getRandomOf,
};