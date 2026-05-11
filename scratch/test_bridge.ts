import { chromium } from 'playwright';

async function testConnection() {
  console.log('Attempting to connect to browser on http://localhost:9222...');
  try {
    const browser = await chromium.connectOverCDP('http://localhost:9222');
    console.log('Successfully connected to browser!');
    
    const context = browser.contexts()[0] || await browser.newContext();
    const page = await context.newPage();
    
    console.log('Navigating to google.com...');
    await page.goto('https://google.com', { waitUntil: 'domcontentloaded' });
    
    const title = await page.title();
    console.log(`Page title: ${title}`);
    
    await page.screenshot({ path: 'google_test.png' });
    console.log('Screenshot saved as google_test.png');
    
    await browser.close();
    console.log('Connection closed.');
  } catch (error) {
    console.error('Error connecting to browser:', error);
    process.exit(1);
  }
}

testConnection();
