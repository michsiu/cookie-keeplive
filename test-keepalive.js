const puppeteer = require('puppeteer');
const fs = require('fs');

async function run() {
  fs.mkdirSync('screenshots', { recursive: true });

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  // 1. 打开 Google 首页
  console.log('🌐 打开 Google 首页...');
  await page.goto('https://www.google.com', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: 'screenshots/01-google-home.png', fullPage: false });
  console.log('📸 截图: 01-google-home.png');

  // 2. 搜索
  const keyword = 'hello world';
  console.log(`🔍 搜索: "${keyword}"...`);
  await page.type('textarea[name="q"]', keyword, { delay: 100 });
  await page.keyboard.press('Enter');
  await page.waitForNavigation({ waitUntil: 'networkidle2' });
  await page.screenshot({ path: 'screenshots/02-search-results.png', fullPage: true });
  console.log('📸 截图: 02-search-results.png');

  // 3. 点击第一个结果
  const firstLink = await page.$('h3');
  if (firstLink) {
    console.log('🖱️ 点击第一个搜索结果...');
    await firstLink.click();
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 });
    await page.screenshot({ path: 'screenshots/03-clicked-page.png', fullPage: true });
    console.log('📸 截图: 03-clicked-page.png');
  } else {
    console.log('⚠️ 没找到搜索结果链接');
    await page.screenshot({ path: 'screenshots/03-no-link.png' });
  }

  console.log('✅ 测试完成，查看 screenshots/ 目录');
  await browser.close();
}

run().catch(e => {
  console.error('❌ 失败:', e.message);
  process.exit(1);
});