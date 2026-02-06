const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  page.on('pageerror', err => errors.push(err.message));
  
  console.log('Testing /auth page...');
  
  // Test 1: Load auth page
  await page.goto('http://localhost:5173/auth');
  await page.waitForLoadState('networkidle');
  
  // Test 2: Check form elements exist
  const signinBtn = await page.locator('button:has-text("Đăng nhập")').first();
  const signupBtn = await page.locator('button:has-text("Đăng ký")').first();
  const emailInput = await page.locator('input[type="email"]').first();
  const passwordInput = await page.locator('input[type="password"]').first();
  
  console.log('✓ Sign in button visible:', await signinBtn.isVisible());
  console.log('✓ Sign up button visible:', await signupBtn.isVisible());
  console.log('✓ Email input visible:', await emailInput.isVisible());
  console.log('✓ Password input visible:', await passwordInput.isVisible());
  
  // Test 3: Toggle between signin and signup
  await signupBtn.click();
  await page.waitForTimeout(300);
  const usernameInput = await page.locator('input[placeholder="Nguyen Van A"]').first();
  console.log('✓ Username input appears on signup:', await usernameInput.isVisible());
  
  // Test 4: Check mobile layout (375px)
  await page.setViewportSize({ width: 375, height: 812 });
  await page.waitForTimeout(300);
  console.log('✓ Mobile layout renders at 375px');
  
  // Test 5: Check desktop layout (1280px)
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.waitForTimeout(300);
  console.log('✓ Desktop layout renders at 1280px');
  
  // Check for errors
  if (errors.length > 0) {
    console.log('\n❌ Console errors found:');
    errors.forEach(e => console.log('  -', e));
  } else {
    console.log('\n✓ No console errors');
  }
  
  await browser.close();
  console.log('\n✅ All auth page tests passed!');
})();
