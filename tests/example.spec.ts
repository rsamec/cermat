import { test, expect } from '@playwright/test';
import { getTestUrl } from './test.utils';

const viewportSize = { width: 1200, height: 900 };
test('has title', async ({ page }) => {
  const slug = 'c9b-2023';
  await page.goto(getTestUrl('paper', slug));

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle("Čeština (9 ročník) - 2. řádný termín 2023");

});

const slugs: [string, string[]][] = [
  ['matematika-5-2023-1', ["math", "8", "M5A-2023"]],
  ['matematika-9-2023-1', ["math", "4", "M9A-2023"]],
  ['cestina-9-2023-1', ["cz", "4", "C9A-2023"]],
  ['cestina-5-2023-1', ["cz", "8", "C5A-2023"]],
  ['c9b-2023', ["cz", "4", "C9B-2023"]],
  ['c7a-2023', ["cz", "6", "C7A-2023"]],
  ['c5b-2023', ["cz", "8", "C5B-2023"]],
  ['cestina-maturita-jaro-2023', ["cz", "diploma", "CMA-2023"]],
];

for (const [slug, pathes] of slugs) {
  test(`screenshot root document ${slug}`, async ({ page }) => {
    await page.goto(getTestUrl('paper', slug));

    await page.setViewportSize(viewportSize);
    await page.emulateMedia({ media: 'print' });
    await expect(page.getByTestId('root-document')).toBeVisible();

    //await page.pdf({ path: ['public'].concat(...pathes.concat(`cover.pdf`)).join("/"), format: 'A4', landscape: true })
    //await page.getByTestId('root-document').screenshot({ path: ['public'].concat(...pathes.concat(`cover-full.png`)).join("/") })
    await page.screenshot({ path: ['public'].concat(...pathes.concat(`cover.png`)).join("/") })
    // for (const i of [0,30]){
    //   const questionId = `question-${i}`;
    //   await page.getByTestId(questionId).screenshot({ path: ['public'].concat(...pathes.concat(`${questionId}.png`)).join("/") })
    // }
  });
}