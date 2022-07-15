const { getRandomFromArray, getRandomOf } = require('./utils');
const paths = require('./paths');

class CustomPage {
  static async build(page) {
    const customPage = new CustomPage(page);

    return new Proxy(customPage, {
      get: function(target, property) {
        return target[property] || page[property];
      }
    })
  }

  constructor(page) {
    this.page = page;
  }

  async getContentsOf(selector) {
    return await this.page.$eval(selector, el => el.innerHTML);
  }

  async getChildCountOf(selector) {
    return await this.page.$eval(selector, el => el.childElementCount);
  }

  async clickById(id) {
    await this.page.evaluate((elId) => {
      document.getElementById(elId).click();
    }, id);
  }

  async typeIn(selector, text) {
    await this.page.focus(selector);
    await this.page.keyboard.type(text);
  }

  get(path) {
    return this.page.evaluate((p) => {
      return fetch(p, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Credentials': true
        }
      }).then(res => res.json());
    }, path);
  }

  post(path, data) {
    return this.page.evaluate((p, d) => {
      return fetch(p, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify(d)
      }).then(res => res.json());
    }, path, data);
  }

  /* Website specific */
  
  async getRoomIdFromUrl() {
    const url = await this.page.url();
    const idIndex = url.lastIndexOf(paths.ROOM_PATH);
    const roomIdStart = url.substr(idIndex + paths.ROOM_PATH.length);
    const idEndIndex = roomIdStart.indexOf('/');
    if (idEndIndex < 0) {
      return roomIdStart;
    }
    return roomIdStart.substring(0, idEndIndex);
  }
  
  async selectDice(number) {
    const dice = [4, 6, 8, 10, 12, 20];
    for (let i = 0; i < number; i++) {
      await this.clickById(`die${getRandomFromArray(dice)}`);
    }

    await this.waitForSelector('#selectedDice');
  }
  
  async makeRoll() {
    await this.clickById('rollDice');
    await this.waitForSelector('#selected0-0');
  }
  
  async makeRollWithDescription(text) {
    await this.selectDice(getRandomOf(3));    
    await this.typeIn('#rollDescription', text);
    await this.makeRoll();
  }
  
  async doAndWaitForTitleChange(action) {
    let oldTitle = await this.getContentsOf('#resultTitle');

    await action.call(null);

    await this.waitForFunction(
      `document.getElementById("resultTitle").innerHTML != "${oldTitle}"`
    );
  }
}

module.exports = CustomPage;