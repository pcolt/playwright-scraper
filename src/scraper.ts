import { chromium } from 'playwright';
import { Parser } from '@json2csv/plainjs';
import { writeFileSync } from 'fs';
import mongoose, { set } from 'mongoose';
// import 'dotenv/config';
import repoSchema from './models/repo_model.js';

const scraper = async (topic: string) => {
    // console.log('topic', topic);

    /**
     * FIRST PART - SCRAPING WITH PLAYWRIGHT
     * This part is based on Apify tutorial at https://blog.apify.com/how-to-scrape-the-web-with-playwright-ece1ced75f73/
     */
    const baseUrl = 'https://github.com';
    // const topic = 'crawler'
    // const topic = 'climatechange'

    const browser = await chromium.launch({
        headless: true
    });

    const page = await browser.newPage({
        bypassCSP: true,
    });

    await page.goto(`${baseUrl}/topics/${topic}`);
    // await page.click('text=Load more');
    await page.waitForFunction(() => {
        const repoCards = document.querySelectorAll('article.border');
        return repoCards.length > 5;
    });

    // Extract data from the page. Selecting all 'article' elements
    // will return all the repository cards we're looking for.
    const locatorRepos = page.locator('article.border');
    const repos = await locatorRepos.evaluateAll((repoCards) => {
    // const repos = await page.$$eval('article.border', (repoCards) => {
        return repoCards.map((card, index) => {
            // const [user, repo]: NodeListOf<HTMLElement> = card.querySelectorAll('h3 a');     // assign first and second result using js destructuring assigment sintax
            const [user] = card.querySelectorAll('h3');     // assign first and second result using js destructuring assigment sintax
            const [repo] = card.querySelectorAll('a');     // assign first and second result using js destructuring assigment sintax
            const starsElement = card.querySelector('#repo-stars-counter-star')
            if (starsElement === null) {
                throw new Error('starsElement is null');
            }
            const stars = starsElement.getAttribute('title');
            const description: HTMLElement | null = card.querySelector('div.px-3 > p');
            const topics: NodeListOf<HTMLElement> = card.querySelectorAll('a.topic-tag');

            const toText = (element: HTMLElement) => element && element.innerText.trim();
            const parseNumber = (text: string) => Number(text.replace(/,/g, ''));
            const repoLink = card.querySelectorAll('div.px-3 a.Link')[1].getAttribute('href');
            console.log('repoLink', repoLink);

            return {
                id: index,
                user: toText(user),
                repoName: toText(repo),
                url: repo.href,
                stars: stars? parseNumber(stars) : "stars not found",
                description: description ? toText(description) : "description not found",
                topics: Array.from(topics).map((t) => toText(t)),
                repoLink: repoLink,
            };
        });
    });

    // Now extract data (commits number) from each repo page
    for (const repo of repos) {
        // Go to the page and wait 2 minute to load
        await page.goto(`${baseUrl}${repo.repoLink}`, { timeout: 2*60*10000 });

        console.log(`crawling page ${baseUrl}${repo.repoLink}`);

        // find the commits element and extract the value
        // const commitText = "test";
        const commitText = await page
            // .locator('span.d-none.d-sm-inline > strong')
            .getByText('commits')
            // .locator('span')
            // .filter({hasText: 'commits'})
            .first()
            .textContent();
        console.log('commitText', commitText);
        if (!commitText) {
            throw new Error('commitText is falsy');
        }
        const numberStrings = commitText.match(/\d+/g);
        // @ts-ignore 
        const commitCount = Number(numberStrings.join(''));
        console.log('commitCount', commitCount);

        // select the right repos object and store the commits number
        repos.map(mappedRepos => {
            if (mappedRepos.url === repo.url) {
                // @ts-ignore
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
    try {
        const parser = new Parser();
        const csv = parser.parse(repos);
        writeFileSync('repos.csv', csv);
        writeFileSync('repos.json', JSON.stringify(repos));
    } catch (err) {
        console.error('json2csv error:', err);
    }


    // await page.waitForTimeout(10000);   // change this to somthing more robust like
    await browser.close();



    /**
     * SECOND PART - SAVE RESULTS TO ATLAS' MONGO DB
     * This part is based on Open Full Stack - part3 c: Saving data to MongoDB at https://fullstackopen.com/en/part3/saving_data_to_mongo_db#mongo-db
     */
    const RepoMongooseModel = mongoose.model(topic, repoSchema)

    await RepoMongooseModel.deleteMany().then(function(){
        console.log("Data deleted");
    }).catch(function(error){
        console.log(error);
    });

    await RepoMongooseModel.insertMany(repos).then(function(){
        console.log("Data inserted");
    }).catch(function(error){
        console.log(error);
    });

// mongoose.connection.close();
}
 
export default scraper;