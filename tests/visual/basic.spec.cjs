const { test, expect } = require('@playwright/test')

test('basic example renders design tokens, overlays, popups, and modals without warnings', async ({ page }) => {
  const failures = []
  page.on('console', (message) => {
    if (['error', 'warning'].includes(message.type())) {
      failures.push(`${message.type()}: ${message.text()}`)
    }
  })
  page.on('pageerror', (error) => failures.push(`pageerror: ${error.message}`))

  await page.goto('/?visual=1&theme=light')
  const app = page.locator('.dn-app')
  await expect(app).toHaveClass(/dn-light/)
  await expect(app).toHaveCSS('--dn-ghost-bg-color', 'rgba(24, 144, 255, 0.5)')

  const overlayValues = await page.evaluate(() => {
    const app = document.querySelector('.dn-app')
    const values = {}
    for (const className of ['dn-auxtool', 'dn-aux-helpers', 'dn-ghost']) {
      const element = document.createElement('div')
      element.className = className
      app.appendChild(element)
      values[className] = getComputedStyle(element).pointerEvents
      element.remove()
    }
    return values
  })
  expect(overlayValues).toEqual({
    'dn-auxtool': 'none',
    'dn-aux-helpers': 'all',
    'dn-ghost': 'none',
  })
  const toolbarInput = page.getByTestId('visual-designer-tools').locator('.ant-input-number')
  await expect(toolbarInput).toBeVisible()
  await expect(toolbarInput).toHaveCSS('font-size', '12px')
  await expect(page.getByTestId('visual-formily-input')).toHaveCSS('pointer-events', 'none')

  await page.locator('.dn-color-input-color-tips').click()
  const popup = page.locator('.dn-color-input .ant-popover')
  await expect(popup).toBeVisible()
  expect(await popup.boundingBox()).not.toBeNull()
  await page.mouse.click(1200, 700)
  await expect(popup).toBeHidden()

  await page.getByTestId('visual-data-source-setter').getByRole('button').click()
  const modal = page.locator('.ant-modal')
  await expect(modal).toBeVisible()
  const modalBox = await modal.boundingBox()
  expect(modalBox).not.toBeNull()
  expect(modalBox.x).toBeGreaterThan(0)
  expect(modalBox.x + modalBox.width).toBeLessThan(await page.evaluate(() => innerWidth))
  await modal.getByRole('button', { name: 'Cancel' }).click()
  await expect(modal).toBeHidden()

  const viewTools = page.locator('.dn-view-tools')
  await viewTools.locator('button').nth(1).click()
  await expect(page.locator('.dn-viewport')).toHaveCount(0)
  await page.waitForTimeout(200)
  await viewTools.locator('button').first().click()
  await expect(page.locator('.dn-viewport')).toBeVisible()

  await page.goto('/?visual=1&theme=dark')
  await expect(app).toHaveClass(/dn-dark/)
  await expect(app).toHaveCSS('--dn-ghost-bg-color', 'rgba(24, 144, 255, 0.5)')
  expect(failures).toEqual([])
})
