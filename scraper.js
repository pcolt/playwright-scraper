import { chromium } from 'playwright';
import { parse } from 'json2csv'
import { writeFileSync } from 'fs';

const baseUrl = 'https://github.com';

const browser = await chromium.launch({
    headless: false
});

const page = await browser.newPage({
    bypassCSP: true,
});

await page.goto(`${baseUrl}/topics/crawling`);
await page.click('text=Load more');
await page.waitForFunction(() => {
    const repoCards = document.querySelectorAll('article.border');
    return repoCards.length > 20;
});

// Extract data from the page. Selecting all 'article' elements
// will return all the repository cards we're looking for.
const locatorRepos = page.locator('article.border');
const repos = await locatorRepos.evaluateAll((repoCards) => {
// const repos = await page.$$eval('article.border', (repoCards) => {
    return repoCards.map(card => {
        const [user, repo] = card.querySelectorAll('h3 a');     // assign first and second result using js destructuring assigment sintax
        const stars = card.querySelector('#repo-stars-counter-star')
            .getAttribute('title');
        const description = card.querySelector('div.px-3 > p');
        const topics = card.querySelectorAll('a.topic-tag');

        const toText = (element) => element && element.innerText.trim();
        const parseNumber = (text) => Number(text.replace(/,/g, ''));
        const repoLink = card.querySelector('div.px-3 a.Link').getAttribute('href');
        console.log('repoLink', repoLink);

        return {
            user: toText(user),
            repo: toText(repo),
            url: repo.href,
            stars: parseNumber(stars),
            description: toText(description),
            topics: Array.from(topics).map((t) => toText(t)),
            repoLink: repoLink,
        };
    });
});


// await page.goto(`${baseUrl}${repoLink}`);
// const commitText = await page
//     .getByRole('listitem')
//     .filter({ hasText: 'commits'})
//     .textContent()
// const numberStrings = commitText.match(/\d+/g);
// const commitCount = Number(numberStrings.join(''));


// Print the results 🚀
console.log(`We extracted ${repos.length} repositories.`);
console.dir(repos);

const csv = parse(repos);
writeFileSync('repos.csv', csv);
writeFileSync('repos.json', JSON.stringify(repos));



await page.waitForTimeout(10000);
await browser.close();
