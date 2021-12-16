const Page = require('./helpers/page');
const paths = require('./helpers/constants');
const { getRandomFromArray, getRandomOf } = require('./helpers/utils');

let _page;

beforeEach(async () => {
  _page = await Page.build(page);
  await _page.goto(paths.MAIN_PAGE + paths.ROLLER_PATH);
  await _page.waitForSelector('#die10');
});

const TEST_TEXT = 'TestПроверкаמבדק';

const selectDice = async (number) => {
  const dice = [4, 6, 8, 10, 12, 20];
  for (let i = 0; i < number; i++) {
    await _page.clickById(`die${getRandomFromArray(dice)}`);
  }
  await _page.waitForSelector('#selectedDice');
};

const makeRoll = async () => {
  await _page.clickById('rollDice');
  await _page.waitForSelector('#selected0-0');
};

describe('When you select dice', () => {
  describe('And roll without description', () => {
    test('It shows a result', async () => {
      await selectDice(1);
      await makeRoll();

      let resultDiceCount = await _page.getChildCountOf('#rollResult');
      expect(resultDiceCount).toEqual(1);
    });

    test('It shows the same amount of dice', async () => {
      const count = getRandomOf(5);

      await selectDice(count);
      await makeRoll();

      let resultDiceCount = await _page.getChildCountOf('#rollResult');
      expect(resultDiceCount).toEqual(count);
    });

    test('It shows a roll link', async () => {
      await selectDice(1);
      await makeRoll();
      
      const link = await _page.$eval('#rollLink', el => el.value);
      expect(link).toContain(paths.ROLLER_PATH);
    });

    describe('And then follow the roll link', () => {
      test('It opens full roll result page', async () => {
        const count = getRandomOf(5);
        await selectDice(count);
        await makeRoll();
        
        const link = await _page.$eval('#rollLink', el => el.value);
        await _page.goto(link);
        await _page.waitForSelector('#die0-0');

        let resultDiceCount = await _page.getChildCountOf('#rollResult');
        expect(resultDiceCount).toEqual(count);
      });
    });

    describe('And then click Clear', () => {
      test('It cleans link and dice', async () => {
        await selectDice(getRandomOf(5));  
        await makeRoll();
  
        await _page.clickById('rollResultClear');
  
        const link = await _page.$eval('#rollLink', el => el.value);
        expect(link).toEqual('');
  
        let resultDiceCount = await _page.getChildCountOf('#rollResult');
        expect(resultDiceCount).toEqual(0);
      });

      test('It disables roll result button', async () => {
        await selectDice(1);
        await makeRoll();
        
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
      await selectDice(getRandomOf(5));

      await _page.typeIn('#rollDescription', TEST_TEXT);

      await makeRoll();
      
      const title = await _page.getContentsOf('#resultTitle');
      expect(title).toContain(`: ${TEST_TEXT}`);
    });

    describe('And then reroll', () => {
      test('Reroll title also contains the same text in description', async () => {
        await selectDice(getRandomOf(5));
  
        await _page.typeIn('#rollDescription', TEST_TEXT);
  
        await makeRoll();

        const link = await _page.$eval('#rollLink', el => el.value);

        await _page.clickById('rerollButton');
        await _page.waitForFunction(`document.getElementById("rollLink").value != "${link}"`);
        
        const title = await _page.getContentsOf('#resultTitle');
        expect(title).not.toContain(`: ${TEST_TEXT}`);
        expect(title).toContain(TEST_TEXT);
      });
    });

    describe('And then click Clear', () => {
      test('It cleans title', async () => {
        await selectDice(getRandomOf(5));
    
        await _page.typeIn('#rollDescription', TEST_TEXT);
  
        await makeRoll();
  
        await _page.clickById('rollResultClear');
  
        const title = await _page.getContentsOf('#resultTitle');
        expect(title).not.toContain(TEST_TEXT);
      });
    });
  });
});