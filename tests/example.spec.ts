import { test, expect } from '@playwright/test';
import { getTestUrl } from './test.utils';
import exams from '../lib/exams.utils';

const viewportSize = { width:  1200, height: 900 };
const maxViewportSize = { width:  2800, height: 2100 };
// test('has title', async ({ page }) => {
//   const slug = 'c9b-2023';
//   await page.goto(getTestUrl('paper', slug));

//   // Expect a title "to contain" a substring.
//   await expect(page).toHaveTitle("Čeština (9 ročník) - 2. řádný termín 2023");

// });


for (const {pathes} of exams) {
  test(`screenshot root document ${pathes}`, async ({ page }) => {
    await page.goto(getTestUrl('paper', pathes[2].toLocaleLowerCase()));

    await page.setViewportSize(viewportSize);
    await page.emulateMedia({ media: 'print' });
    await expect(page.getByTestId('root-document')).toBeVisible();

    //await page.pdf({ path: ['public'].concat(...pathes.concat(`cover.pdf`)).join("/"), format: 'A4', landscape: true })
    //await page.getByTestId('root-document').screenshot({ path: ['public'].concat(...pathes.concat(`cover-full.png`)).join("/") })
    //await page.screenshot({ fullPage: true, path: ['public'].concat(...pathes.concat(`cover-full.png`)).join("/") })
    await page.screenshot({ path: ['public'].concat(...pathes.concat(`cover.png`)).join("/") })
    
    // for (const i of [0,30]){
    //   const questionId = `question-${i}`;
    //   await page.getByTestId(questionId).screenshot({ path: ['public'].concat(...pathes.concat(`${questionId}.png`)).join("/") })
    // }
  });
}

// for (const  {pathes} of exams) {
//   test(`screenshot full ${pathes}`, async ({ page }) => {
//     await page.goto(getTestUrl('paper', pathes[2].toLocaleLowerCase()));
//     console.log(getTestUrl('paper', pathes[2].toLocaleLowerCase()))

//     await page.setViewportSize(maxViewportSize);
//     await page.emulateMedia({ media: 'print' });
//     await expect(page.getByTestId('root-document')).toBeVisible();
//     await page.screenshot({ fullPage: true, path: ['public'].concat(...pathes.concat(`cover-full.png`)).join("/") })

//   });
// }