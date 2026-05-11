import { chromium } from 'playwright';

async function testConnection() {
  const port = '9223';
  console.log(`Attempting to connect to browser on http://localhost:${port}...`);
  try {
    const browser = await chromium.connectOverCDP(`http://localhost:${port}`);
    console.log('Successfully connected to browser!');
    
    const context = browser.contexts()[0] || await browser.newContext();
    const page = await context.newPage();
    
    console.log('Navigating to google.com...');
    await page.goto('https://google.com', { waitUntil: 'domcontentloaded', timeout: 60000 });
    
    const title = await page.title();
    console.log(`Page title: ${title}`);
    
    const screenshotPath = 'google_port_9223.png';
    await page.screenshot({ path: screenshotPath });
    console.log(`Screenshot saved as ${screenshotPath}`);
    
    await browser.close();
    console.log('Connection closed.');
  } catch (error) {
    console.error('Error connecting to browser:', error);
    process.exit(1);
  }
}

testConnection();
