const Page = require('./helpers/page');
const paths = require('./helpers/paths');
const { getRandomOf } = require('./helpers/utils');
const { TEST_TEXT } = require('./helpers/constants');

let _page;

beforeEach(async () => {
  _page = await Page.build(page);
  await _page.goto(paths.MAIN_PAGE);
  await _page.waitForSelector('#createRoom');
  await _page.clickById('createRoom');
  await _page.waitForSelector('#charname');

  await _page.typeIn('#charname', '12');
  await _page.clickById('enterRoom');
  
  await _page.waitForSelector('#die10');
});

test('If there are no rolls the history shows message', async () => {
  let children = await _page.getChildCountOf('#history');
  expect(children).toEqual(1);
});

describe('When roll without description', () => {
  test('It shows a result in history', async () => {
    await _page.selectDice(1);
    await _page.makeRoll();

    await _page.waitForSelector('#history0');
    
    let children = await _page.getChildCountOf('#history');
    expect(children).toEqual(1);
  });

  test('It shows the same amount of dice', async () => {
    const count = getRandomOf(3);

    await _page.selectDice(count);
    await _page.makeRoll();

    await _page.waitForSelector('#history0');
    
    let children = await _page.getChildCountOf('#historyDice0');
    expect(children).toEqual(count);
  });

  test('It shows a roll link', async () => {
    await _page.selectDice(1);
    await _page.makeRoll();
    
    const link = await _page.$eval('#historyLink0', el => el.href);
    expect(link).toContain(paths.ROLLER_PATH);
  });

  describe('And then follow the roll link', () => {
    test('It opens full roll result page', async () => {
      const count = getRandomOf(3);
      await _page.selectDice(count);
      await _page.makeRoll();
      
      const link = await _page.$eval('#historyLink0', el => el.href);
      await _page.goto(link);
      await _page.waitForSelector('#die0-0');

      let resultDiceCount = await _page.getChildCountOf('#rollResult');
      expect(resultDiceCount).toEqual(count);
    });
  });
});

describe('When roll with description', () => {
  test('Same text appears above the result', async () => {
    await _page.doAndWaitForTitleChange(async () => {
      await _page.makeRollWithDescription(TEST_TEXT);
    });
    
    const title = await _page.getContentsOf('#historyDescr0');
    expect(title).toContain(TEST_TEXT);
  });
});