import { chromium } from 'playwright';
import { parse } from 'json2csv'
import { writeFileSync } from 'fs';

const browser = await chromium.launch({
    headless: false
});

const page = await browser.newPage({
    bypassCSP: true,
});

await page.goto('https://github.com/topics/crawling');
await page.click('text=Load more');
await page.waitForFunction(() => {
    const repoCards = document.querySelectorAll('article.border');
    return repoCards.length > 20;
});

// Extract data from the page. Selecting all 'article' elements
// will return all the repository cards we're looking for.
const repos = await page.$$eval('article.border', (repoCards) => {
    return repoCards.map(card => {
        const [user, repo] = card.querySelectorAll('h3 a');
        const stars = card.querySelector('#repo-stars-counter-star')
            .getAttribute('title');
        const description = card.querySelector('div.px-3 > p');
        const topics = card.querySelectorAll('a.topic-tag');

        const toText = (element) => element && element.innerText.trim();
        const parseNumber = (text) => Number(text.replace(/,/g, ''));

        return {
            user: toText(user),
            repo: toText(repo),
            url: repo.href,
            stars: parseNumber(stars),
            description: toText(description),
            topics: Array.from(topics).map((t) => toText(t)),
        };
    });
});


// Print the results 🚀
console.log(`We extracted ${repos.length} repositories.`);
console.dir(repos);

const csv = parse(repos);
writeFileSync('repos.csv', csv);
writeFileSync('repos.json', JSON.stringify(repos));



await page.waitForTimeout(10000);
await browser.close();
