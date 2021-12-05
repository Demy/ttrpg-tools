const ROOM_PATH = '/room/';
const ROOT = 'http://localhost:3000';

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

  async clickById(id) {
    await this.page.evaluate((elId) => {
      document.getElementById(elId).click();
    }, id);
  }
  
  async getRoomIdFromUrl() {
    const url = await this.page.url();
    const idIndex = url.lastIndexOf(ROOM_PATH);
    const roomIdStart = url.substr(idIndex + ROOM_PATH.length);
    const idEndIndex = roomIdStart.indexOf('/');
    if (idEndIndex < 0) {
      return roomIdStart;
    }
    return roomIdStart.substring(0, idEndIndex);
  }

  get(path) {
    return this.page.evaluate((p) => {
      return fetch(p, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => res.json());
    }, path);
  }

  post(path, data) {
    return this.page.evaluate((p, d) => {
      return fetch(p, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(d)
      }).then(res => res.json());
    }, path, data);
  }
}

module.exports = CustomPage;