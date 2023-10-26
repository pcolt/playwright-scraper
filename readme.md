## GitHub's topics scraper with playright

For the scraping part the project is based on [this tutorial](https://blog.apify.com/how-to-scrape-the-web-with-playwright-ece1ced75f73/) from Apify.
For the mongodb storing part, it is based on [part 3c](https://fullstackopen.com/en/part3/saving_data_to_mongo_db#mongo-db) Helsinki University's Open Full Stack course.

The project goal -for now- is to scrape GitHub repositories based on a specific topic (i.e. 'scraping' or 'climatechange') and store the results into an Atlas Mongobd database. The complete result is also stored into a local .json and .csv file. 
The scraping process returns for each repository found the following data: 
- owner
- name
- URL
- number of starts
- description
- list of repository topics

Following steps will be to migrate this funcitonality into a single-page app using Nodejs and React.

## Usage

`npm run start` or `node scraper.js`