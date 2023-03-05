import { expect, test } from '@playwright/test'

test.describe('counter page test', () => {
  test('counter in page expects to increment twice', async ({ page }) => {
    await page.goto('/')

    const btn_increment = page.getByTestId('increment_btn')
    const btn_decrement = page.getByTestId('decrement_btn')
    const display_count = page.getByTestId('display_count')
    const display_count_3x = page.getByTestId('display_count_3x')

    await btn_increment.click()
    await btn_increment.click()

    await expect(display_count).toHaveText('2')
    await expect(display_count_3x).toHaveText('6')

    await btn_decrement.click()
    await btn_decrement.click()

    await expect(display_count).toHaveText('0')
    await expect(display_count_3x).toHaveText('0')
  })
})
