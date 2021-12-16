const Page = require('./helpers/page');
const paths = require('./helpers/constants');

let _page;

beforeEach(async () => {
  _page = await Page.build(page);
  await _page.goto(paths.MAIN_PAGE + paths.ROLLER_PATH);
  await _page.waitForSelector('#die10');
});

test('When click on a dice it appears in the selected panel', async () => {
  await _page.clickById('die10');
  await _page.waitForSelector('#selectedDice');

  let selectedDiceCount = await _page.getChildCountOf('#selectedDice');
  expect(selectedDiceCount).toEqual(1);

  await _page.clickById('die10');
  selectedDiceCount = await _page.getChildCountOf('#selectedDice');
  expect(selectedDiceCount).toEqual(2);
});