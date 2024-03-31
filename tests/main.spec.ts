import { test } from '@playwright/test';
import { getTestUrl } from './test.utils';

const viewportSizes = [{ width: 600, height: 3400 },{ width: 1200, height: 1400 }];
for (const viewportSize of viewportSizes) {
  test(`screenshot root page - ${viewportSize.width}/${viewportSize.height}`, async ({ page }) => {
    await page.goto(getTestUrl(''));

    await page.setViewportSize(viewportSize);
    await page.emulateMedia({ media: 'print' });

    //await expect(page.getByTestId('root-document')).toBeVisible(); 
    page.waitForLoadState('domcontentloaded');
    page.waitForTimeout(1000);


    await page.screenshot({ path: ['public', 'images'].concat(`root_${viewportSize.width}_${viewportSize.height}.png`).join("/") })
    await page.screenshot({ fullPage: true, path: ['public', 'images'].concat(`root-full_${viewportSize.width}_${viewportSize.height}.png`).join("/") })
  });
}

