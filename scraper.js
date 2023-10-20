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
    return repoCards.length > 5;
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
        const repoLink = card.querySelectorAll('div.px-3 a.Link')[1].getAttribute('href');
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

// Now extract data (commits number) from each repo page
for (const repo of repos) {
    await page.goto(`${baseUrl}${repo.repoLink}`);

    console.log(`crawling page ${baseUrl}${repo.repoLink}`);

    // find the commits element and extract the value
    const commitText = await page
        .locator('span.d-none.d-sm-inline > strong')
        .textContent();
    console.log('commitText', commitText);
    const numberStrings = commitText.match(/\d+/g);
    const commitCount = Number(numberStrings.join(''));
    console.log('commitCount', commitCount);

    // select the right repos object and store the commits number
    repos.map(mappedRepos => {
        if (mappedRepos.url === repo.url) {
            repo.commits = commitCount;
            console.log('repo', repo);
            return repo;
        }
    })
}


// Print the results 🚀
console.log(`We extracted ${repos.length} repositories.`);
console.dir(repos);

// Store the results in the filesystem
const csv = parse(repos);
writeFileSync('repos.csv', csv);
writeFileSync('repos.json', JSON.stringify(repos));


// await page.waitForTimeout(10000);   // change this to somthing more robust like
await browser.close();
