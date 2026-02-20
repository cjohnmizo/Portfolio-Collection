const { chromium } = require('playwright');
const express = require('express');
const fs = require('fs');
const path = require('path');
const http = require('http');

// Config
const TEMPLATES_DIR = path.join(__dirname, '..', 'templates');
const PREVIEWS_DIR = path.join(__dirname, '..', '_previews');
const DEFAULT_PORT = 3000;

// CLI Flags
const args = process.argv.slice(2);
const isFullPage = args.includes('--fullpage');
const onlyFlag = args.find(a => a.startsWith('--only='));
const templateFilter = onlyFlag ? onlyFlag.split('=')[1].split(',') : null;

async function startServer() {
    const app = express();
    app.use(express.static(path.join(__dirname, '..')));

    return new Promise((resolve) => {
        const server = http.createServer(app);
        server.listen(0, () => {
            resolve(server);
        });
    });
}

function getTemplates() {
    if (!fs.existsSync(TEMPLATES_DIR)) {
        console.error(`Templates directory not found: ${TEMPLATES_DIR}`);
        process.exit(1);
    }
    let dirs = fs.readdirSync(TEMPLATES_DIR).filter(file => {
        return fs.statSync(path.join(TEMPLATES_DIR, file)).isDirectory();
    });

    if (templateFilter) {
        dirs = dirs.filter(d => templateFilter.includes(d));
    }
    return dirs;
}

async function generateScreenshots() {
    console.log('Starting local server...');
    const server = await startServer();
    const port = server.address().port;
    console.log(`Server running on port ${port}`);

    if (!fs.existsSync(PREVIEWS_DIR)) {
        fs.mkdirSync(PREVIEWS_DIR);
    }

    const templates = getTemplates();
    if (templates.length === 0) {
        console.log('No templates found matching the criteria.');
        server.close();
        return;
    }

    console.log(`Found ${templates.length} templates. Launching browser...`);
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    const results = [];

    for (const template of templates) {
        console.log(`Processing: ${template}...`);
        const defaultUrl = `http://localhost:${port}/templates/${template}/index.html`;
        let success = true;
        let errorMsg = '';

        try {
            // Check if index.html exists
            if (!fs.existsSync(path.join(TEMPLATES_DIR, template, 'index.html'))) {
                throw new Error('index.html not found');
            }

            await page.goto(defaultUrl, { waitUntil: 'networkidle', timeout: 30000 });

            // Desktop
            await page.setViewportSize({ width: 1440, height: 900 });
            // wait a bit for any animations
            await page.waitForTimeout(1000);
            await page.screenshot({ path: path.join(PREVIEWS_DIR, `${template}-desktop.png`) });

            // Mobile
            await page.setViewportSize({ width: 390, height: 844 });
            await page.waitForTimeout(500);
            await page.screenshot({ path: path.join(PREVIEWS_DIR, `${template}-mobile.png`) });

            // Full Page (Optional)
            if (isFullPage) {
                await page.setViewportSize({ width: 1440, height: 900 });
                await page.waitForTimeout(500);
                await page.screenshot({ path: path.join(PREVIEWS_DIR, `${template}-full.png`), fullPage: true });
            }
        } catch (err) {
            success = false;
            errorMsg = err.message;
            console.error(`Error generating preview for ${template}:`, err);
        }

        results.push({
            Template: template,
            Status: success ? '✅ Success' : '❌ Failed',
            Error: errorMsg || '-'
        });
    }

    await browser.close();
    server.close();

    console.log('\n--- Generation Summary ---');
    console.table(results);
}

generateScreenshots().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
