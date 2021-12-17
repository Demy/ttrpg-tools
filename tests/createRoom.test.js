const Page = require('./helpers/page');
const paths = require('./helpers/paths');

let _page;

beforeEach(async () => {
  _page = await Page.build(page);
  await _page.goto(paths.MAIN_PAGE);
  await _page.waitForSelector('#createRoom');
});

const creacteRoom = async () => {
  await _page.clickById('createRoom');
  await _page.waitForNavigation();
};

describe('"Whith password" OFF', () => {
  describe('When press Create', () => {
    test('it goes to a room', async () => {
      await creacteRoom();

      const url = await _page.url();
      expect(url).toContain(paths.ROOM_PATH);
    });

    test('The room does not have a password and protection', async () => {
      await creacteRoom();
      const roomId = await _page.getRoomIdFromUrl();

      const params = await _page.get(paths.SERVER_PATH + paths.ROOM_PARAMS_REQUEST + roomId);
      expect(params).toEqual({ private: 0, protected: 0 });
    });

    test('The room does not have rolls history', async () => {
      await creacteRoom();
      const roomId = await _page.getRoomIdFromUrl();

      const data = await _page.get(paths.SERVER_PATH + paths.ROOM_HISTORY_REQUEST + roomId);
      expect(data.history).toEqual([]);
    });
  });
});

describe('"Whith password" ON', () => {
  describe('When password is not set', () => {
    test('It shows an error message', async () => {
      const toastsContentBefore = await _page.getContentsOf('.Toastify');

      await _page.clickById('usePassword');
      await _page.waitForSelector('#newRoomPass');

      await _page.clickById('createRoom');

      await _page.waitForSelector('.Toastify__toast');
      const toastsContentAfter = await _page.getContentsOf('.Toastify');
      
      expect(toastsContentBefore).toEqual('');
      expect(toastsContentAfter).not.toEqual('');
    });
  });
  
  describe('When password is set', () => {
    test('It goes to the room that has password but no roll protection', async () => {
      await _page.clickById('usePassword');
      await _page.waitForSelector('#newRoomPass');

      await page.type('#newRoomPass', 'abcd');

      await creacteRoom();
      const roomId = await _page.getRoomIdFromUrl();

      const params = await _page.get(paths.SERVER_PATH + paths.ROOM_PARAMS_REQUEST + roomId);
      expect(params).toEqual({ private: 1, protected: 0 });
    });

    describe('When roll protection is ON', () => {
      test('It goes to the room that has roll protection', async () => {
        await _page.clickById('usePassword');
        await _page.waitForSelector('#newRoomPass');
  
        await page.type('#newRoomPass', 'abcd');

        await _page.clickById('protectRolls');
  
        await creacteRoom();
        const roomId = await _page.getRoomIdFromUrl();
  
        const params = await _page.get(paths.SERVER_PATH + paths.ROOM_PARAMS_REQUEST + roomId);
        expect(params).toEqual({ private: 1, protected: 1 });
      });
    });
  });
});
