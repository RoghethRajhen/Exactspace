const puppeteer = require('puppeteer');
const fs = require('fs');

const scrapeWebsite = async () => {
    const url = process.env.SCRAPE_URL;
    if (!url) {
        console.error('Error: SCRAPE_URL is required');
        process.exit(1);
    }

    try {
        // Launch Puppeteer with Chromium
        const browser = await puppeteer.launch({
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium',
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            timeout: 60000
        });

        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'domcontentloaded' });

        const data = await page.evaluate(() => {
            return {
                title: document.title,
                heading: document.querySelector('h1')?.innerText || 'No heading found',
                metaDescription: document.querySelector('meta[name="description"]')?.content || 'No description',
                links: Array.from(document.querySelectorAll('a')).map(a => a.href).slice(0, 10), // Get first 10 links
                paragraphs: Array.from(document.querySelectorAll('p')).map(p => p.innerText).slice(0, 5), // First 5 paragraphs
                images: Array.from(document.querySelectorAll('img')).map(img => img.src).slice(0, 5) // First 5 images
            };
        });

        fs.writeFileSync('scraped_data.json', JSON.stringify(data, null, 2));
        console.log('✅ Scraping successful. Data saved to scraped_data.json');

        await browser.close();
    } catch (error) {
        console.error('❌ Scraping failed:', error);
        process.exit(1);
    }
};

// Execute the scraper function
scrapeWebsite();