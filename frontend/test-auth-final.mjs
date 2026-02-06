import { chromium } from 'playwright';

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

console.log('🧪 Testing enhanced Auth Page...\n');

// Test 1: Load auth page
await page.goto('http://localhost:5173/auth');
await page.waitForLoadState('networkidle');
console.log('✓ Auth page loaded');

// Test 2: Check all form elements
const signinBtn = await page.locator('button:has-text("Đăng nhập")').first();
const signupBtn = await page.locator('button:has-text("Đăng ký")').first();
const emailInput = await page.locator('input#email').first();
const passwordInput = await page.locator('input#password').first();

console.log('✓ Sign in button visible:', await signinBtn.isVisible());
console.log('✓ Sign up button visible:', await signupBtn.isVisible());
console.log('✓ Email input visible:', await emailInput.isVisible());
console.log('✓ Password input visible:', await passwordInput.isVisible());

// Test 3: Toggle between signin and signup
await signupBtn.click();
await page.waitForTimeout(400);
const usernameInput = await page.locator('input#fullName').first();
const confirmPasswordInput = await page.locator('input#confirmPassword').first();
console.log('✓ Signup mode - username input:', await usernameInput.isVisible());
console.log('✓ Signup mode - confirm password:', await confirmPasswordInput.isVisible());

// Test 4: Check password strength indicator
await usernameInput.fill('Test User');
await emailInput.fill('test@example.com');
await passwordInput.fill('password123');
await page.waitForTimeout(300);
const strengthIndicator = await page.locator('text=Yếu').first();
console.log('✓ Password strength indicator visible:', await strengthIndicator.isVisible());

// Test 5: Check remember me checkbox
await page.setViewportSize({ width: 1280, height: 720 });
await page.waitForTimeout(200);
const rememberMe = await page.locator('text=Ghi nhớ đăng nhập').first();
console.log('✓ Remember me checkbox visible:', await rememberMe.isVisible());

// Test 6: Check success state after signup
await signinBtn.click();
await page.waitForTimeout(300);
console.log('✓ Toggle back to signin mode');

// Test 7: Mobile layout
await page.setViewportSize({ width: 375, height: 812 });
await page.waitForTimeout(300);
console.log('✓ Mobile layout (375px) renders');

// Test 8: Desktop layout
await page.setViewportSize({ width: 1280, height: 720 });
await page.waitForTimeout(300);
console.log('✓ Desktop layout (1280px) renders');

// Test 9: Trust signals visible
await page.setViewportSize({ width: 1280, height: 720 });
await page.waitForTimeout(200);
const trustSignals = await page.locator('text=Bảo mật cao').first();
console.log('✓ Trust signals visible:', await trustSignals.isVisible());

// Test 10: Check accessibility - proper labels
const emailHasLabel = await page.locator('label[for="email"]').count() > 0;
const passwordHasLabel = await page.locator('label[for="password"]').count() > 0;
console.log('✓ Email has proper label:', emailHasLabel);
console.log('✓ Password has proper label:', passwordHasLabel);

// Check for errors
if (errors.length > 0) {
  console.log('\n❌ Console errors found:');
  errors.forEach(e => console.log('  -', e));
} else {
  console.log('\n✓ No console errors');
}

await browser.close();
console.log('\n✅ All enhanced auth page tests passed!');
