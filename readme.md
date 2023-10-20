# GitHub's topics scraper with playright

This project is based on [this tutorial](https://blog.apify.com/how-to-scrape-the-web-with-playwright-ece1ced75f73/) from Apify.

The project goal -for now- is to scrape GitHub repositories based on a specific topic: **'scraping'**. The scraping process returns for each repo the following data: 
- owner
- name
- URL
- number of starts
- description
- list of repository topics

The complete result is then stored in a .json and in a .csv file.