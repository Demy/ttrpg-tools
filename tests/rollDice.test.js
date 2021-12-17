const { TEST_TEXT } = require('./helpers/constants');
const Page = require('./helpers/page');
const paths = require('./helpers/paths');
const { getRandomOf } = require('./helpers/utils');

let _page;

beforeEach(async () => {
  _page = await Page.build(page);
  await _page.goto(paths.MAIN_PAGE + paths.ROLLER_PATH);
  await _page.waitForSelector('#die10');
});

describe('When you select dice', () => {
  describe('And roll without description', () => {
    test('It shows a result', async () => {
      await _page.selectDice(1);
      await _page.makeRoll();

      let resultDiceCount = await _page.getChildCountOf('#rollResult');
      expect(resultDiceCount).toEqual(1);
    });

    test('It shows the same amount of dice', async () => {
      const count = getRandomOf(3);

      await _page.selectDice(count);
      await _page.makeRoll();

      let resultDiceCount = await _page.getChildCountOf('#rollResult');
      expect(resultDiceCount).toEqual(count);
    });

    test('It shows a roll link', async () => {
      await _page.selectDice(1);
      await _page.makeRoll();
      
      const link = await _page.$eval('#rollLink', el => el.value);
      expect(link).toContain(paths.ROLLER_PATH);
    });

    describe('And then follow the roll link', () => {
      test('It opens full roll result page', async () => {
        const count = getRandomOf(3);
        await _page.selectDice(count);
        await _page.makeRoll();
        
        const link = await _page.$eval('#rollLink', el => el.value);
        await _page.goto(link);
        await _page.waitForSelector('#die0-0');

        let resultDiceCount = await _page.getChildCountOf('#rollResult');
        expect(resultDiceCount).toEqual(count);
      });
    });

    describe('And then click Clear', () => {
      test('It cleans link and dice', async () => {
        await _page.selectDice(getRandomOf(3));  
        await _page.makeRoll();
  
        await _page.clickById('rollResultClear');
  
        const link = await _page.$eval('#rollLink', el => el.value);
        expect(link).toEqual('');
  
        let resultDiceCount = await _page.getChildCountOf('#rollResult');
        expect(resultDiceCount).toEqual(0);
      });

      test('It disables roll result button', async () => {
        await _page.selectDice(1);
        await _page.makeRoll();
        
        let disabled = await _page.$eval('#rerollButton', el => el.disabled);
        expect(disabled).toBeFalsy();

        await _page.clickById('rollResultClear');
        
        disabled = await _page.$eval('#rerollButton', el => el.disabled);
        expect(disabled).toBeTruthy();
      });
    });
  });

  describe('And roll with description', () => {
    test('Same text appears above the result', async () => {
      await _page.doAndWaitForTitleChange(async () => {
        await _page.makeRollWithDescription(TEST_TEXT);
      });
      
      const title = await _page.getContentsOf('#resultTitle');
      expect(title).toContain(`: ${TEST_TEXT}`);
    });

    describe('And then reroll', () => {
      test('Reroll title also contains the same text in description', async () => {
        await _page.doAndWaitForTitleChange(async () => {
          await _page.makeRollWithDescription(TEST_TEXT);
        });

        await _page.doAndWaitForTitleChange(async () => {
          await _page.clickById('rerollButton');
        });
        
        const title = await _page.getContentsOf('#resultTitle');
        expect(title).not.toContain(`: ${TEST_TEXT}`);
        expect(title).toContain(TEST_TEXT);
      });
    });

    describe('And then click Clear', () => {
      test('It cleans title', async () => {
        await _page.makeRollWithDescription(TEST_TEXT);
  
        await _page.clickById('rollResultClear');
  
        const title = await _page.getContentsOf('#resultTitle');
        expect(title).not.toContain(TEST_TEXT);
      });
    });
  });
});